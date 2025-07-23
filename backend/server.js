require('dotenv').config();

const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI} = require('@google/generative-ai');

const app = express();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.use(cors());
app.use(express.json());

// Main analysis endpoint
app.post('/analyze', async (req, res) => {
  try {
    const { code } = req.body; 

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `
      You are an expert AI programming tutor for Data Structures and Algorithms.
      Analyze the user's Python code below.
      Provide feedback in a friendly, encouraging, and educational tone.
      Do not simply give the correct code. Instead, guide the student towards the solution by asking leading questions and pointing out conceptual strengths or weaknesses.
      Identify the algorithm the user is trying to implement. Comment on the code's structure, logic, and potential edge cases. If there's an error, explain the potential cause without directly fixing it.
      
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
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});