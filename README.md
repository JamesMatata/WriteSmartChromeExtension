
# WriteSmart - AI-Powered Writing Assistant

**WriteSmart** is a Chrome extension that helps users enhance their writing with AI-powered suggestions. Whether you're writing emails, filling out forms, or creating content, WriteSmart provides instant improvements to ensure clarity, grammar, and style.

## Features

- **AI Text Enhancement**: Improve text by leveraging OpenAI's GPT-3.5-turbo model.
- **Easy Integration**: Automatically enhance and insert improved text back into web forms.
- **User-Friendly**: Simple popup interface for quick text enhancement.

## Installation

1. Clone the repository or download it as a zip file.
   ```bash
   git clone https://github.com/JamesMatata/WriteSmart.git
   ```

2. Open Chrome and go to `chrome://extensions/`.

3. Enable **Developer mode**.

4. Click **Load unpacked** and select the folder with the extension files.

## How to Use

1. **Select a Text Field**: Click inside any form input field on a webpage.
2. **Open WriteSmart**: Click the extension icon in the Chrome toolbar.
3. **Enhance Text**: Enter or paste your text, then click **Enhance Text**.
4. **Confirm**: Review the enhanced text and click **Confirm** to insert it into the selected input field.

## Project Files

- `manifest.json`: Defines permissions and settings.
- `popup.js`: Handles communication between the popup and background script.
- `background.js`: Processes text through OpenAI's API.
- `content.js`: Manages interaction with input fields.
- `popup.html`: UI for the extension popup.

## API Setup

1. Replace the placeholder API key in `background.js` with your OpenAI key:
   ```js
   'Authorization': 'Bearer OPEN_API_KEY'
   ```

## Permissions

- **activeTab**: To interact with the active web page.
- **storage**: To store selected input information.
- **scripting**: To modify the content of web forms.
