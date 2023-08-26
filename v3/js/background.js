chrome.contextMenus.create({
  title: "抓取全页图片",
  id: "catchAllImg"
});

chrome.contextMenus.onClicked.addListener(function (data) {
  if (data.menuItemId == 'catchAllImg') {
    catchAllImg();
  }
})


function sendMessageToContentScript(message, callback) {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, message, function (response) {
      if (callback) callback(response);
    });
  });
}
function catchImg() {
  sendMessageToContentScript({ cmd: 'catchImg' }, function (response) {
    // console.log('来自content的回复：'+response);
  });
};
function catchAllImg() {
  sendMessageToContentScript({ cmd: 'catchAllImg' }, function (response) {
    // console.log('来自content的回复：'+response);
  });
};

var showImgPage = null;
var showImgTab = null;
var showImgUrl = chrome.runtime.getURL('html/show-img.html');

// chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
//   // console.log(tabId,changeInfo,tab)
//   if (showImgTab && tabId === showImgTab.id) {
//     if (changeInfo.status === "complete") {
//     }
//   }
// })

chrome.tabs.onRemoved.addListener((tabId, changeInfo) => {
  if (showImgTab && tabId === showImgTab.id) {
    showImgTab = null
  }
})

const insertResults = (results) => {
  setTimeout(() => {
    chrome.tabs.sendMessage(showImgTab.id, {
      type: 'insertResults',
      results
    }, (response) => {
      console.log(response);
    });
  }, 500)
}

chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
  // console.log('收到来自content-script的消息：');
  // console.log(request, sender, sendResponse);
  if (request.type === "showImg") {
    if (showImgTab == null) {
      showImgTab = await chrome.tabs.create({ url: showImgUrl });
      console.log('tab:', showImgTab)
      insertResults(request.results)

    } else {
      chrome.tabs.query({ url: showImgUrl }, function (tabs) {
        if (tabs[0]) {
          chrome.tabs.update(tabs[0].id, { active: true });
        }
      });
      insertResults(request.results)
    }
  }
  // sendResponse('我是后台，我已收到你的消息：' + JSON.stringify(request));
});


