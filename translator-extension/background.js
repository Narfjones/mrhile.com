// background.js

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "translate") {
    
    // Using MyMemory API (Free)
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(request.text)}&langpair=fr|en`;

    fetch(url)
      .then(response => response.json())
      .then(data => {
        // The API returns the translation in responseData.translatedText
        const translatedText = data.responseData.translatedText;
        sendResponse({ translation: translatedText });
      })
      .catch(error => {
        console.error("API Error:", error);
        sendResponse({ translation: "Error translating." });
      });

    // Return true to indicate we wish to send a response asynchronously
    return true; 
  }
});