// chrome.browserAction.setBadgeText({text: '3'});
// chrome.browserAction.setBadgeBackgroundColor({color: [255, 0, 0, 255]});

// chrome.contextMenus.create({
//   title: "抓取图片",
//   onclick: function(){ catchImg();}
// });
chrome.contextMenus.create({
  title: "抓取全页图片",
  onclick: function(){ catchAllImg();}
});

function sendMessageToContentScript(message, callback)
{
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs)
    {
        chrome.tabs.sendMessage(tabs[0].id, message, function(response)
        {
            if(callback) callback(response);
        });
    });
}
function catchImg(){
  sendMessageToContentScript({cmd:'catchImg', value:'你好，我是popup！'}, function(response)
  {
      // console.log('来自content的回复：'+response);
  });
};
function catchAllImg(){
  sendMessageToContentScript({cmd:'catchAllImg', value:'你好，我是popup！'}, function(response)
  {
      // console.log('来自content的回复：'+response);
  });
};

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse)
{
    // console.log('收到来自content-script的消息：');
    // console.log(request, sender, sendResponse);
    var url = chrome.extension.getURL('html/show-img.html');
    // console.log(url);
    var showImgPage = window.open(url);
    showImgPage.results = request.results;
    sendResponse('我是后台，我已收到你的消息：' + JSON.stringify(request));
});