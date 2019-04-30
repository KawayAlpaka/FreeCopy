function injectCustomJs(jsPath,callback)
{
    jsPath = jsPath || 'js/free-copy.js';
    var temp = document.createElement('script');
    temp.setAttribute('type', 'text/javascript');
    temp.src = chrome.extension.getURL(jsPath);
    temp.onload = function()
    {
        this.parentNode.removeChild(this);
        callback && callback();
    };
    document.documentElement.appendChild(temp);
}
injectCustomJs('js/free-copy.js',function(){});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse)
{
  if(request.cmd == 'catchImg') {
    window.postMessage({"type": 'catchImg'}, '*');
  }
  if(request.cmd == 'catchAllImg') {
    window.postMessage({"type": 'catchAllImg'}, '*');
  }
  if(request.cmd == 'recover-right-click') {
    window.postMessage({"type": 'recover-right-click'}, '*');
  }
  sendResponse('我收到了你的消息！');
});


window.addEventListener("message", function(e)
{
  if(e.data.type == "showImg"){
    showImg(e.data.results);
  }
}, false);

var showImg = function(results){
  chrome.runtime.sendMessage({type: 'showImg',results}, function(response) {
    // response 回复内容
  });
};
