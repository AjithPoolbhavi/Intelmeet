// controllers/aiController.js

const OpenAI = require("openai");

// Initialize OpenAI only when needed (lazy loading)
const getOpenAI = () => {
  return new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
};

const meetingSummaryTemplates = [
  {
    summary: `The team convened for a productive strategy session covering Q4 product roadmap priorities and resource allocation.`,
    actionItems: [
      "Schedule follow-up design review",
      "Finalize API documentation",
      "Share updated roadmap",
      "Prepare launch announcement"
    ]
  }
];

exports.generateSummary = async (req, res) => {
  try {
    console.log("🔥 generateSummary called");
    console.log("Using OpenAI API");

    const { meetingTitle, duration, participantCount, chatMessages } = req.body;

    if (process.env.OPENAI_API_KEY) {
      try {
        const transcript = chatMessages && chatMessages.length > 0
          ? chatMessages.map(msg => `${msg.sender}: ${msg.text}`).join("\n")
          : "No conversation available";

        const prompt = `Summarize this meeting and extract key action items.

Meeting: ${meetingTitle || "N/A"}
Participants: ${participantCount || "N/A"}
Duration: ${duration || "N/A"} minutes

Conversation:
${transcript}

Provide a concise summary and list the key action items.`;

        const response = await getOpenAI().chat.completions.create({
          model: "gpt-3.5-turbo",
          messages: [
            { role: "system", content: "You are a helpful meeting assistant that summarizes meetings." },
            { role: "user", content: prompt }
          ],
          temperature: 0.7,
          max_tokens: 500
        });

        const aiText = response.choices[0].message.content;

        console.log("✅ AI RESPONSE RECEIVED");

        return res.json({
          success: true,
          summary: aiText,
          generatedAt: new Date().toISOString(),
          model: "OpenAI GPT-3.5",
        });

      } catch (error) {
        console.error("❌ AI ERROR:", error.message);
      }
    }

    // 🟡 FALLBACK MOCK
    await new Promise(resolve => setTimeout(resolve, 1500));

    const template = meetingSummaryTemplates[0];

    res.json({
      success: true,
      summary: template.summary,
      actionItems: template.actionItems,
      generatedAt: new Date().toISOString(),
      model: 'IntellMeet-AI-v1',
    });

  } catch (err) {
    res.status(500).json({
      message: 'AI service error',
      error: err.message
    });
  }
};

exports.generateActionItems = async (req, res) => {
  try {
    console.log("🔥 generateActionItems called");

    const { meetingTitle, transcript } = req.body;

    if (!process.env.OPENAI_API_KEY) {
      throw new Error("OPENAI_API_KEY not configured");
    }

    try {
      const prompt = `Extract action items from this meeting transcript.

Meeting: ${meetingTitle || "N/A"}

Transcript:
${transcript || "No transcript available"}

List each action item with: Task, Owner (if mentioned), and suggested due date.`;

      const response = await getOpenAI().chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "You are a helpful meeting assistant that extracts action items." },
          { role: "user", content: prompt }
        ],
        temperature: 0.5,
        max_tokens: 400
      });

      const aiText = response.choices[0].message.content;

      console.log("✅ ACTION ITEMS EXTRACTED");

      return res.json({
        success: true,
        actionItems: [
          {
            task: aiText,
            owner: "Team",
            dueDate: new Date(Date.now() + 7*24*60*60*1000).toISOString().split('T')[0]
          }
        ],
        generatedAt: new Date().toISOString(),
        model: "OpenAI GPT-3.5",
      });

    } catch (error) {
      console.error("❌ AI ERROR:", error.message);
      return res.json({
        success: true,
        summary: "AI temporarily unavailable. Showing fallback summary.",
        actionItems: ["Continue with planned tasks"],
        model: "Fallback-AI"
      });
    }

  } catch (err) {
    console.log("🟡 Using fallback action items");
    
    // Fallback mock data
    res.json({
      success: true,
      actionItems: [
        { task: "Follow up on Q4 roadmap", owner: "Product Team", dueDate: new Date(Date.now() + 7*24*60*60*1000).toISOString().split('T')[0] },
        { task: "Update API documentation", owner: "Engineering", dueDate: new Date(Date.now() + 3*24*60*60*1000).toISOString().split('T')[0] },
        { task: "Send meeting recap", owner: "Project Manager", dueDate: new Date().toISOString().split('T')[0] }
      ],
      generatedAt: new Date().toISOString(),
      model: 'IntellMeet-AI-v1',
    });
  }
};