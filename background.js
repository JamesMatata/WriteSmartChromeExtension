chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'processText') {
    let inputText = request.text;
    let maxLength = request.maxLength;

    // Log the input received
    console.log('Received input for processing:', inputText);
    console.log('Max length constraint:', maxLength);

    // Call OpenAI API with gpt-3.5-turbo model (chat-based model)
    fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      body: JSON.stringify({
        model: "gpt-3.5-turbo",  // Specify the chat model
        messages: [
          {
            role: "system", // Optional: Can provide system instructions here
            content: "You are an assistant that helps users rewrite and improve their text."
          },
          {
            role: "user",  // User's input
            content: inputText
          }
        ],
        max_tokens: maxLength,      // Ensure the response doesn't exceed the token limit
        temperature: 0.7            // Adjust for creativity level
      }),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer OPEN_API_KEY'  // Placeholder API key
      }
    })
    .then(response => {
      // Ensure response is OK before parsing JSON
      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }
      return response.json();
    })
    .then(data => {
      console.log('Full API response:', data);

      // Check if 'choices' exists and has the expected structure
      if (data.choices && data.choices.length > 0) {
        let enhancedText = data.choices[0].message.content.trim();
        console.log('Enhanced text before enforcing length:', enhancedText);

        // Ensure the enhanced text meets the max length requirement
        if (enhancedText.length > maxLength) {
          enhancedText = enhancedText.slice(0, maxLength);
          console.log('Trimmed enhanced text to max length:', enhancedText);
        }

        // Send the enhanced text back to the content/popup script
        sendResponse({ enhancedText: enhancedText });
      } else {
        console.error('API response does not contain choices[0]:', data);
        sendResponse({ error: 'AI response missing or invalid.' });
      }
    })
    .catch(error => {
      // Log the error and notify the user
      console.error('Error during API call:', error);
      sendResponse({ error: 'Failed to enhance text due to an API error.' });
    });

    // Keep the message channel open for the asynchronous response
    return true;
  }
});
