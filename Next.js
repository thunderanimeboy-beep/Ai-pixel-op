// This is a Next.js API route that connects to the Google Gemini API.

export default async function handler(req, res) {
  // 1. Check for POST request
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ error: `Method ${req.method} not allowed` });
  }

  const { message } = req.body;

  // 2. Validate that a message was provided
  if (!message) {
    return res.status(400).json({ error: "No message provided" });
  }

  try {
    // --- API Key Configuration ---
    // Your API key is placed here.
    // For production, it's still best to use environment variables for security.
    const apiKey = "AIzaSyD1LZxj5b9bneKYRmYDQ9mFipBjdTLJq-E";
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;

    if (!apiKey || apiKey === "YOUR_GEMINI_API_KEY") {
        return res.status(500).json({ error: "The Gemini API key has not been configured." });
    }

    // 3. Prepare the data payload for the Gemini API
    const payload = {
      // System instructions guide the model's behavior and persona.
      systemInstruction: {
        parts: [{ text: "You are Pixel AI, owned by Rehan. Be helpful and smart." }]
      },
      contents: [{
        parts: [{ text: message }]
      }]
    };

    // 4. Make the API call to Gemini
    const apiResponse = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!apiResponse.ok) {
      // If the API response is not successful, throw an error
      const errorData = await apiResponse.json();
      console.error("Gemini API Error:", errorData);
      throw new Error(errorData.error?.message || "Failed to get response from Gemini API.");
    }

    const responseData = await apiResponse.json();
    
    // 5. Extract the text reply from the Gemini response
    // The response structure is different from OpenAI's
    const reply = responseData.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I couldn't get a reply.";

    // 6. Send the successful response back to the client
    res.status(200).json({ reply });

  } catch (error) {
    // 7. Handle any errors during the process
    console.error("Server-side error:", error);
    res.status(500).json({ error: error.message });
  }
}
