(function(){
  // console.log("free-copy.js");
  // 禁止篡改复制内容
  var blockAll = function(e){
    e.stopImmediatePropagation();
  };
  window.addEventListener("copy",blockAll,true);

  const selectName = "free-copy-select";

  window.addEventListener("message", function(e)
  {
    console.log("message:",e);
    // if(e.data.type == "catchImg"){
    //   startFind();
    // }
    if(e.data.type == "catchAllImg"){
      // console.log("catchAllImg");
      catchImg(document.body);
    }
    if(e.data.type == "recover-right-click"){
      window.addEventListener("contextmenu",blockAll,true);
    }
  }, false);

  var regUrl = /^url\(['"]([\S]+)['"]\)$/;
  var catchImg = function(node){
    // 兼容性检查 
    if (!node.computedStyleMap) {
      // alert("浏览器版本比较低，可能会遗漏部分图片，建议升级浏览器");
    }
    var rs = [];
    var target = node;
    var insert = function(node,url){
      if(rs.findIndex(function(r){ return r.url == url }) < 0){
        rs.push({
          tag: node.tagName,
          url
        });
      }
    };
    var deal = function(node){
      // img src
      if(node.src && node.tagName === "IMG"){
        insert(node,node.src);
      }
      // background-image
      if(node.computedStyleMap){
        var backgroundImage = node.computedStyleMap().get("background-image").toString();
        if(regUrl.test(backgroundImage)){
          insert(node,backgroundImage.replace(regUrl,"$1"));
        }
      }
      // // iframe // 不采用遍历方案，因为跨域iframe访问不到dom，已经换成注入方案
      // if (node.tagName.toLowerCase() == "iframe"){
      //   if(node.contentDocument){
      //     deal(node.contentDocument.querySelector("body"));
      //   }
      // }
      // svg
      if (node.tagName.toLowerCase() == "svg"){
        insert(node,node.outerHTML);
        // svg 以后就不在向下检索
        return;
      }
      if(node.children && node.children.length > 0){
        for(var i=0;i < node.children.length;i++){
          deal(node.children[i]);
        }
      }
    }
    deal(target);
    showResult(rs);
  };
  var showResult = function(results){
    window.postMessage({"type": 'showImg',results}, '*');
  };
})();
