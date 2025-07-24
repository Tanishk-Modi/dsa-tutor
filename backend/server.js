require('dotenv').config();

const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI} = require('@google/generative-ai');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
app.use(cors());
app.use(express.json());

const roomDocuments = {};

// Web Socket Server Setup

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST']
  }
});

// WebSocket Connection 

io.on('connection', (socket) => {
  console.log(`🔌 User connected: ${socket.id}`);

  socket.on('join-room', (roomId) => {
    socket.join(roomId);
    console.log(`User ${socket.id} joined room ${roomId}`);

    if (roomDocuments[roomId]) {
      socket.emit('load-document', roomDocuments[roomId]);
    }
  });

  socket.on('code-change', ({ roomId, newCode }) => {
    roomDocuments[roomId] = newCode;
    
    socket.to(roomId).emit('code-update', newCode);
  });

  socket.on('disconnect', () => {
    console.log(`🔌 User disconnected: ${socket.id}`);
  });
});

// Main analysis endpoint
app.post('/analyze', async (req, res) => {
  try {
    const { code } = req.body; 

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `
    You are an expert AI programming tutor for Data Structures and Algorithms, designed to give concise, targeted feedback. Your goal is to guide, not to solve.

    Analyze the user's Python code below with these strict rules:
    1.  **Be Extremely Concise:** Keep your entire response under 5 sentences OR a few bullet points. Get straight to the point.
    2.  **NO CODE BLOCKS:** Do not provide corrected code or long code snippets. You can refer to a variable name or a single line number if necessary, but never write out chunks of code.
    3.  **Guide with Questions:** Instead of giving the answer, ask a leading question that helps the student find the solution themselves. For example, instead of saying "you need a base case", ask "What happens if your function receives an empty array?"
    4.  **Focus on One Key Concept:** Identify the single most important area for improvement or the core concept the user is working on.

    Start by identifying the algorithm, then give your targeted feedback.

    User's Code:
    \`\`\`python
    ${code}
    \`\`\`
  `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const feedback = response.text();

    res.json({ feedback });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to analyze code.' });
  }
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});