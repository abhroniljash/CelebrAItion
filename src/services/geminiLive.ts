/**
 * Direct Gemini API Integration
 * Supports Gemini 1.5 Flash / 2.0 Flash / Pro models with structured JSON output and chat.
 */

export interface GeminiApiConfig {
  apiKey: string;
  model?: string;
}

export async function callGeminiRaw(
  prompt: string, 
  apiKey: string, 
  systemInstruction?: string,
  model = 'gemini-1.5-flash'
): Promise<string> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
  
  const body: any = {
    contents: [
      {
        parts: [
          { text: prompt }
        ]
      }
    ]
  };

  if (systemInstruction) {
    body.systemInstruction = {
      parts: [
        { text: systemInstruction }
      ]
    };
  }

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Gemini API Error (${response.status}): ${errorText}`);
  }

  const data = await response.json();
  const candidate = data.candidates?.[0];
  const text = candidate?.content?.parts?.[0]?.text;

  if (!text) {
    throw new Error('Gemini API returned an empty response.');
  }

  return text;
}
