var rs = [];
var insert = function (results) {
  if (typeof results != "undefined" && Array.isArray(results)) {
    var template = document.querySelector(".template");
    var panel = document.querySelector(".imgs-panel");
    results.forEach(function (result) {
      if (rs.findIndex(function (r) { return r.url == result.url }) < 0) {
        rs.push(result);
        var link = template.cloneNode(true);
        var img = link.querySelector(".img");
        var type = link.querySelector(".type");
        link.classList.remove("template");
        // 处理svg
        if (result.tag == "svg") {
          var file = new File([result.url], "free-copy.svg", { type: "image/svg+xml;charset=utf-8" });
          var dataUrl = URL.createObjectURL(file);
          img.src = dataUrl;
          link.href = dataUrl;
          // type.innerHTML = "svg (矢量图)";
        } else {
          link.href = result.url;
          img.src = result.url;
          // type.innerHTML = "image (位图)";
        }
        img.addEventListener("error", function (e) {
          // console.log("error:",e,img);
          link.remove();
        }, false);
        if (panel.firstElementChild) {
          panel.insertBefore(link, panel.firstElementChild);
        } else {
          panel.appendChild(link);
        }
      }
    });
  }
};


chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.type === "insertResults") {
    // console.log('results:', request.results)
    insert(request.results)
  }
  sendResponse('res')
});