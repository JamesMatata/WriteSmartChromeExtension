let selectedInput = null;

// Detect when user selects a form input field
document.addEventListener('focusin', function(event) {
  if (event.target.tagName.toLowerCase() === 'textarea' || event.target.type === 'text') {
    selectedInput = event.target;
    let maxLength = selectedInput.getAttribute('maxlength') || 'No limit';

    // Store the selected input field's info in chrome.storage
    chrome.storage.local.set({
      selectedInputInfo: {
        inputId: selectedInput.id || null,
        inputName: selectedInput.name || null,
        inputIndex: Array.from(document.querySelectorAll('textarea, input[type="text"]')).indexOf(selectedInput)
      }
    }, () => {
      console.log('Selected input field info stored in chrome.storage');
    });

    console.log('Form input field selected:', selectedInput);
    console.log('Max length for this field:', maxLength);

    // Send a message to background to update the popup UI with the field's requirements
    chrome.runtime.sendMessage({
      type: 'updateFieldInfo',
      maxLength: maxLength,
      inputType: selectedInput.type,
    }, function(response) {
      console.log('Message sent to background script, awaiting response...');
    });
  }
});

// Listen for the message from the popup to populate the field
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('Message received in content script:', message);

  if (message.type === 'populateField') {
    let { inputId, inputName, inputIndex, enhancedText } = message;

    let inputField;
    if (inputId) {
      // Find the input by its ID
      inputField = document.getElementById(inputId);
    } else if (inputName) {
      // Find the input by its name
      inputField = document.querySelector(`[name="${inputName}"]`);
    } else if (inputIndex !== undefined) {
      // Fallback: Use input index
      let inputs = document.querySelectorAll('textarea, input[type="text"]');
      inputField = inputs[inputIndex];
    }

    if (inputField) {
      inputField.value = enhancedText;  // Populate the input field with the enhanced text
      console.log('Input field updated with enhanced text:', enhancedText);
      sendResponse({ success: true });  // Send success response
    } else {
      console.error('Could not find the input field to populate.');
      sendResponse({ success: false, error: 'Input field not found' });
    }
  }
});
