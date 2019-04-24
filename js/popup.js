// console.log("popup.js");
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

var btnRecoverRightClick = document.querySelector("#recover-right-click");
chrome.storage.local.get({"recover-right-click": 'red'}, function(items) {
  btnRecoverRightClick.checked = items["recover-right-click"];
});
btnRecoverRightClick.addEventListener("click",function(){
  // if(btnRecoverRightClick.checked){
  //   sendMessageToContentScript({cmd:'recover-right-click'});
  //   chrome.storage.local.set({"recover-right-click": 1});
  // }else{
  //   chrome.storage.local.set({"recover-right-click": 0});
  // }
  sendMessageToContentScript({cmd:'recover-right-click'});
  document.querySelector(".msg").innerHTML = "恢复完成";
},false);
// window.addEventListener("storage", function (e) {
//   console.log(e);
// });