var catchImg = function () {
  const node = document.body
  var regUrl = /^url\(['"]([\S]+)['"]\)$/;
  // 兼容性检查 
  if (!node.computedStyleMap) {
    // alert("浏览器版本比较低，可能会遗漏部分图片，建议升级浏览器");
  }
  var rs = [];
  var target = node;
  var insert = function (node, url) {
    if (rs.findIndex(function (r) { return r.url == url }) < 0) {
      rs.push({
        tag: node.tagName,
        url
      });
    }
  };
  var deal = function (node) {
    // img src
    if (node.src && node.tagName === "IMG") {
      insert(node, node.src);
    }
    // background-image
    if (node.computedStyleMap) {
      var backgroundImage = node.computedStyleMap().get("background-image").toString();
      if (regUrl.test(backgroundImage)) {
        insert(node, backgroundImage.replace(regUrl, "$1"));
      }
    }
    // svg
    if (node.tagName.toLowerCase() == "svg") {
      var file = new File([node.outerHTML], "free-copy.svg", { type: "image/svg+xml;charset=utf-8" });
      var dataUrl = URL.createObjectURL(file);
      insert(node, dataUrl);
      // svg 以后就不在向下检索
      return;
    }
    if (node.children && node.children.length > 0) {
      for (var i = 0; i < node.children.length; i++) {
        deal(node.children[i]);
      }
    }
  }
  deal(target);
  rs.forEach(r => {
    console.log(r)
  })
};

catchImg();