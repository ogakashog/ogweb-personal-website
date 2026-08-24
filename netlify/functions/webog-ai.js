exports.handler = async (event) => {
  // Allow only POST requests
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({
        error: "Method not allowed"
      })
    };
  }

  try {
    const body = JSON.parse(event.body || "{}");

    const message = body.message;
    const sessionId = body.session_id;

    if (!message) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: "Message is required"
        })
      };
    }

    const apiKey = process.env.LYZR_API_KEY;
    const agentId = process.env.LYZR_AGENT_ID;

    if (!apiKey || !agentId) {
      console.error("Missing Lyzr environment variables");

      return {
        statusCode: 500,
        body: JSON.stringify({
          error: "AI configuration is missing"
        })
      };
    }

    const response = await fetch(
      "https://agent-prod.studio.lyzr.ai/v3/inference/chat/",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey
        },

        body: JSON.stringify({
          user_id: "webog-visitor",
          agent_id: agentId,
          session_id: sessionId || `webog-${Date.now()}`,
          message: message
        })
      }
    );

    const data = await response.json();

    console.log("Lyzr response:", data);

    if (!response.ok) {
      return {
        statusCode: response.status,
        body: JSON.stringify({
          error: "Lyzr request failed",
          details: data
        })
      };
    }

    return {
      statusCode: 200,

      headers: {
        "Content-Type": "application/json"
      },

      body: JSON.stringify({
        response:
          data.response ||
          data.message ||
          data.answer ||
          "I'm unable to respond right now."
      })
    };

  } catch (error) {
    console.error("WEBOG AI ERROR:", error);

    return {
      statusCode: 500,

      body: JSON.stringify({
        error: "Internal server error"
      })
    };
  }
};