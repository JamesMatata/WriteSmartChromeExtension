document.getElementById('enhanceText').addEventListener('click', function() {
  let inputText = document.getElementById('inputText').value;
  let enhancedTextDiv = document.getElementById('enhancedTextDiv');

  // Initially hide the enhancedTextDiv when the process starts
  enhancedTextDiv.style.display = 'none';

  if (inputText.trim() === '') {
    alert('Please enter some text to enhance.');
    return;  // Stop if there's no input text
  }

  // Send the input to the background script for AI enhancement
  chrome.runtime.sendMessage({
    type: 'processText',
    text: inputText,
    maxLength: 200  // You can adjust this value based on your needs
  }, function(response) {
    if (response.enhancedText) {
      // Show the enhanced text in the readonly textarea
      document.getElementById('enhancedText').value = response.enhancedText;

      // Display the enhancedTextDiv and Confirm button
      enhancedTextDiv.style.display = 'block';
    } else {
      document.getElementById('enhancedText').value = 'Error: ' + response.error;
    }
  });
});

document.getElementById('confirmText').addEventListener('click', function() {
  console.log('Confirm button clicked');
  let enhancedText = document.getElementById('enhancedText').value;

  // Retrieve the saved input field info from chrome.storage
  chrome.storage.local.get('selectedInputInfo', function(data) {
    if (data.selectedInputInfo) {
      const { inputId, inputName, inputIndex } = data.selectedInputInfo;

      // Log the input details to verify if they are being passed
      console.log('Selected Input Details:');
      console.log('inputId:', inputId);
      console.log('inputName:', inputName);
      console.log('inputIndex:', inputIndex);

      // Send a message to the content script to populate the input field
      chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {
          type: 'populateField',
          enhancedText: enhancedText,
          inputId: inputId,
          inputName: inputName,
          inputIndex: inputIndex
        }, function(response) {
          if (chrome.runtime.lastError) {
            console.error('Could not send message to content script:', chrome.runtime.lastError.message);
            alert('Failed to populate field. Content script is not available on this page.');
          } else {
            console.log('Message successfully sent to content script:', response);
          }
        });
      });
    } else {
      console.error('No selected input info found in storage.');
    }
  });
});
