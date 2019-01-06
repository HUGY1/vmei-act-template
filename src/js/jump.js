
// 处理各种跳转的方法。变动较少所以抽离
// 判断了客户端环境，根据不同环境进行跳转app,web,小程序
// @params linkid: 链接ID（美妆团ID，商品ID）
// @params type: 链接类型。 vmact: 美妆团 product: 商品
function goToPage(linkid, type) {
    var _this = this;
    var linkHref

    if (type === 'product') {
      linkHref = `http://m.vmei.com/product/${linkid}.html`

    } else if (type === 'vmact') {
      linkHref = `https://act.vmei.com/web/m/act/vmact/${linkid}.html`
    }
    var linkPos = linkHref.lastIndexOf('/') + 1
    // linkPosLast = linkHref.lastIndexOf('ios'),
    let bridge = _this.bridge
    if (_this.platform === 'miniApp') {
      if (type === 'product') {
        wx.miniProgram.navigateTo({ url: "/pages/goods/details?pid=" + linkid })
      } else if (type === 'vmact') {
        wx.miniProgram.navigateTo({ url: "/pages/packageMain/pages/dresser/vmact/vmactDetail?id=" + linkid })
      }

      return
    }

    if (!bridge) {
      location.href = linkHref
      return false
    }


    if (linkHref.indexOf('products') != -1) {

      var dataContent = _this.getAttribute('data-content') || _this.getQueryString('keyword', linkHref) || '';
      // IOS 代码有问题，这里做兼容
      if (dataContent === '' && (window.navigator.userAgent.toLowerCase().indexOf("iphone") != -1)) {
        dataContent = ' ';
      }

      var cid = _this.getQueryString('cid', linkHref) || ''
      var pv = _this.getQueryString('pv', linkHref) || ''
      // var TOPIC= getQueryString('TOPIC', linkHref)   || ''
      var stype = _this.getQueryString('stype', linkHref) || ''
      var stypeId = _this.getQueryString('stypeId', linkHref) || ''
      var title = _this.getQueryString('title', linkHref) || ''

      // stype 使用BRAND一直有问题，
      var options = {
        callType: 'searchProduct',
        params: {
          'cid': cid, 'pv': pv, 'keyword': dataContent, 'stype': 'TOPIC', 'stypeId': stypeId, 'liveList': '', 'title': title
        }
      }

      bridge.callHandler('AppJSBack', options, function (response) { })
      setTimeout(function () {
        bridge.callHandler('productJSBack', { 'searchProduct': dataContent }, function (response) { })
      }, 20)

    } else if (linkHref.indexOf('product') != -1 && linkHref.indexOf('liveshow') != -1) {

      var options = {
        callType: 'liveProduct',
        params: {
          'liveProductID': linkid
        }
      }
      bridge.callHandler('AppJSBack', options, function (response) { });
      setTimeout(function () {
        bridge.callHandler('productJSBack', { 'liveProductID': linkid }, function (response) { });

        setTimeout(function () {
          bridge.callHandler('AppJSBack', { 'liveProductID': linkid }, function (response) { });
        }, 20);
      }, 20);
    } else if (linkHref.indexOf('product') != -1 && linkHref.indexOf('exchange') != -1) {
      var options = {
        callType: 'pointsMallProduct',
        params: {
          'pointsMallProduct': linkid
        }
      }
      bridge.callHandler('AppJSBack', options, function (response) { });
      setTimeout(function () {
        bridge.callHandler('productJSBack', { 'pointsMallProduct': linkid }, function (response) { });

        // setTimeout(function() {
        //     bridge.callHandler('AppJSBack', {'pointsMallProduct': linkid}, function(response) {});
        // }, 20);
      }, 20);
    } else if (linkHref.indexOf('product') != -1) {
      var options = {
        callType: 'product',
        params: {
          'productID': linkid
        }
      }
      bridge.callHandler('AppJSBack', options, function (response) { });
      setTimeout(function () {
        bridge.callHandler('productJSBack', { 'productID': linkid }, function (response) { });
      }, 20);

    } else if (linkHref.indexOf('/web/m/act/vmact') != -1) {
      var options = {
        callType: 'vmActivity',
        params: {
          'activityId': linkid
        }
      }
      bridge.callHandler('AppJSBack', options, function (response) { });
      setTimeout(function () {
        bridge.callHandler('productJSBack', { 'activityId': linkid }, function (response) { });
      }, 20);
    }
  }
  module.exports = goToPage