function loadScript(src, callback) {
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.onload = callback;
    script.src = src;
    document.head.appendChild(script);
}

function getChatbotId() {
    var currentScript = document.currentScript || (function() {
        var scripts = document.getElementsByTagName('script');
        return scripts[scripts.length - 1];
    })();
    return currentScript.getAttribute('data-chatbot-id');
}

var chatbotId = getChatbotId();
var apiUrl = 'https://neweraendpoint.azurewebsites.net/api/get_info?code=flK1M9Xa8f8qe7BCWZ5MJ9rWkM_QbhKufh3j-OnAeqLvAzFucJ0Wxg==';

if (chatbotId) {
    console.log('chatbotId', chatbotId);
    console.log('apiUrl', apiUrl);
    loadScript('https://newerastorage.blob.core.windows.net/widget/chatbot.umd.js', function() {
        window.Chatbot.mount({
            chatbotId: chatbotId,
            apiUrl: apiUrl
        });
    });
} else {
    console.error('chatbotId not provided in the script.');
}
