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
  sendMessageToContentScript({cmd:'catchImg'}, function(response){
      // console.log('来自content的回复：'+response);
  });
};
function catchAllImg(){
  sendMessageToContentScript({cmd:'catchAllImg'}, function(response){
      // console.log('来自content的回复：'+response);
  });
};

var showImgPage = null;
var showImgTab = null;
var showImgUrl = chrome.extension.getURL('html/show-img.html');
var initShowImgPage = function(showImgPage){
  showImgPage.pLoaded = new Promise(function(resolve,reject){
    showImgPage.addEventListener("DOMContentLoaded",function(){
      resolve();
    },false);
  });
};
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse)
{
    // console.log('收到来自content-script的消息：');
    // console.log(request, sender, sendResponse);
    if(request.type === "showImg"){
      if(showImgPage == null || showImgPage.closed){
        showImgPage = window.open(showImgUrl);
        initShowImgPage(showImgPage);
        showImgPage.pLoaded.then(function(){
          showImgPage.insert(request.results);
        });
      }else {
        chrome.tabs.query({url:showImgUrl}, function(tabs){
          if(tabs[0]){
            chrome.tabs.update(tabs[0].id,{active:true});
          }
        });
        showImgPage.pLoaded.then(function(){
          showImgPage.insert(request.results);
        });
      }
    }
    // sendResponse('我是后台，我已收到你的消息：' + JSON.stringify(request));
});
