import '../css/reset.less'
import '../css/index.less'

axios.defaults.withCredentials = true;
axios.defaults.crossDomain = true

var domain = "https://m.vmei.com";
// var domain = "http://m.sephome.cn";
Vue.component('toast-box', {
  props: ['content'],
  template: '<div id="toast" class="m-toast">{{content}}</div>'
})
Vue.use(VueLazyload, {
  preLoad: 2.3,
  error: 'https://assets.vmei.com/web/m/act/2018/yearSells/image/replace.png',
  loading: 'https://assets.vmei.com/web/m/act/2018/yearSells/image/replace.png',
  attempt: 9
})

var app = new Vue({
  el: '#app',
  components: [],
  data: {
    toast: '',
    platform: '',
    isLoading: true,
    isLogin: false,
    bridge: null,
    isIos: false,
    fixTab: false, //固定导航栏
    userShareKey: '', //分享人
    shareInfo: {
      title: '双旦礼遇季 最高188任选6件起 活动时间：12.24-1.1',
      content: '年度热销榜单、品牌大赏、口碑好物钜惠来袭，圣诞礼盒超值抢购，量贩囤货过新年，好货任选，好用不贵。',
      url: "https://act.vmei.com/web/m/act/2018/christmas/dist/index.html?needSS=1",
      urlWechat: "https://m.vmei.com/special/2018/christmas/dist/index",
      imgUrl: "https://assets.vmei.com/web/m/act/2018/christmas/images/index/share1.jpg",
      imgUrlWechat: "https://assets.vmei.com/web/m/act/2018/christmas/images/index/share2.jpg"
    },
    prodList: [],
    time: {
      day: 0,
      hour: 0,
      min: 0,
      second: 0
    },
    channelId: 593,  // 593  535
    isShowDrop: false,
    coupons: []
  },
  created() {
    let _this = this
    let href = location.href
 
    //判断在哪个端访问
    var ua = navigator.userAgent.toLowerCase();

    if (/sephome/.test(ua) || /唯美美妆/.test(ua)) {
      _this.platform = 'app';
      _this.app();
      if (/iphone/.test(ua)) {
        _this.isIos = true
      }
    } else if (ua.indexOf('micromessenger') != -1) {
      _this.platform = 'wechat';
    } else {
      _this.platform = 'other';
      _this.loadCoupon()
    }

    if (wx && wx.miniProgram) {
      wx.miniProgram.getEnv(function (res) {
        if (res.miniprogram) {
          _this.platform = 'miniApp';
          // domain = 'https://mp.vmei.com'   //一般用于红包或者优惠券
          wx.miniProgram.postMessage({
            data: {
              shareUrl: _this.shareInfo.url,
              shareTitle: _this.shareInfo.content,
              sharePic: _this.shareInfo.imgUrl
            }
          })
          _this.loadCoupon()
          return
        } else {
          _this.platform = 'wechat';
          _this.weChat();
          return
        }
      })
    }


  },
  mounted() {
    let _this = this
    _this.isLoad = true
    //获取服务器时间
    axios.get(domain + `/serverTime`)
      .then(function (res) {
        if (res.data.success) {
          let nowTime = res.data.data.serverTimes
          let startDate = 1546358400000 // 1.2凌晨
          // let startDate = 1541761354000 // 测试
          let date = new Date(nowTime).getDate()

          let timeStamp = (startDate - nowTime) / 1000;
          countDown(timeStamp);
          _this.interval = setInterval(() => {
            timeStamp = timeStamp - 1
            countDown(timeStamp)
          }, 1000)

        }

      })
      .catch(function (res) {
        console.log(res);
      })

    //距离11.10倒计时函数
    function countDown(timeStamp) {
      let timeLimitHours = Math.floor(timeStamp / 3600)
      let timeLimitMinutes = Math.floor((timeStamp - 3600 * timeLimitHours) / 60)

      let day = Math.floor(timeStamp / 86400)
      let hour = Math.floor(timeStamp / 3600)
      let min = Math.floor((timeStamp - 3600 * timeLimitHours) / 60)
      let second = Math.floor(timeStamp - 3600 * timeLimitHours - 60 * timeLimitMinutes)

      // console.log(day,hour,min,second)
      _this.time.day = day
      _this.time.hour = hour % 24
      _this.time.min = min
      _this.time.second = second
      if (day === 0 && hour === 0 && min === 0 && second === 0) { //时间结束
        clearInterval(_this.interval)
      }
    }
    //获取第一栏商品数据
    axios.get(`${domain}/vmeiActivity/${this.channelId}/20181111`)
      .then(function (res) {
        if (res.data.success) {
          let data = res.data.data.channelData
          console.log(res.data.data.channelList)
          _this.prodList = res.data.data.channelList
          _this.isLoading = false
          document.body.classList.remove("z-loading")
        }

      })
      .catch(function (res) {
        console.log(res);
      })

    document.addEventListener('scroll', function (e) {
      let scrollHeight = document.body.scrollHeight
      let scrollTop = document.documentElement.scrollTop || document.body.scrollTop

      if (_this.fixTab) {
        if (scrollTop < 1500) {
          _this.fixTab = false
        }
      } else {
        if (scrollTop > 1500) {
          _this.fixTab = true
        }
      }

    });
  },
  methods: {
    showEntry() {
      this.isShowEntry = !this.isShowEntry
    },
    //toast调用
    showToast(content,time) {
      this.toast = content
      let _this = this
      setTimeout(function () {
        _this.toast = ''
      }, time || 2000)
    },
    // 获取优惠券
    getCoupon(id) {
      let _this = this
      let url
      if (this.platform === 'wechat' || this.platform === 'other' || this.platform === 'app') {
        url = domain + '/acceptShare/act/coupon/send?property=shuangDan&id=' + id
      } else if (this.platform === 'miniApp') {
        url = domain + '/act/coupon/send?property=shuangDan&id=' + id +'&chatSessionKey=' + _this.getQueryString('chatSessionKey')
      }
      axios.get(url,{
        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
      }).then(res => {
        _this.showToast(res.data.msg)
        if (res.data.success) {
          _this.loadCoupon()
        }
      })
    },
    // 加载优惠券
    loadCoupon() {
      let url
      let _this = this
      if (this.platform === 'wechat' || this.platform === 'other' || this.platform === 'app') {
        url = domain + '/acceptShare/act/coupon/list?property=shuangDan' 
      } else if (this.platform === 'miniApp') {
        
        url = domain + '/act/coupon/list?property=shuangDan&chatSessionKey=' + _this.getQueryString('chatSessionKey')
      }
      // url = 'http://mp.sephome.cn/act/coupon/list?property=shuangDan&chatSessionKey=mp_f0e6f3d0-3a1b-4427-9d07-1241528df514'
      axios.get(url,{
        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
      })
        .then(function (res) {
          _this.coupons = res.data.data.list
          _this.coupons.forEach(item => {
            if (item.isNomore) {
              item.status = '已领完'
            } else if (item.isReceive) {
              item.status = '已领取'
            } else if (item.canReceive) {
              item.status = '点击领取'
            }
          })
        })
        .catch(function (res) {
          _this.showToast(res,20000)
        })
    },
    getQueryString(e, t) {
      var n = new RegExp("(^|\\?|&)" + e + "=([^&]*)(&|$)", "i"),
        t = t || window.location.search,
        o = t.match(n);
      return null != o ? unescape(o[2]) : null
    },
    app() {
      let _this = this
      let ss = _this.getQueryString("ss") || ""

      function connectWebViewJavascriptBridge(callback) {
        if (window.WebViewJavascriptBridge) {
          callback(WebViewJavascriptBridge)
        } else {
          document.addEventListener('WebViewJavascriptBridgeReady', function () {
            callback(WebViewJavascriptBridge)
          }, false)
        }
      }
      connectWebViewJavascriptBridge(function (bridge) {
        _this.bridge = bridge;
        bridge.init(function (message, responseCallback) {
          _this.isLogin = message
          var ss = message.ss;
          if (ss) {
            axios.post(domain + '/login/d?ss=' + ss)
              .then(function (res) {
                _this.test = res.data.data
                if (!res.data.success) {
                  // bridge.callHandler('loginBack', { 'needLogin': true }, function (response) { });
                }
                _this.userShareKey = res.data.data.userShareKey || ''
                _this.initShareParams(bridge)
                _this.loadCoupon()
              })
              .catch(function (res) {
                console.log(res);
              })
          }

          //接受支付返回消息

          let payStatus = message.paystatus
          if (payStatus) {
            _this.handlePaySuccess()
          }
        });

        bridge.callHandler('loginBack', { 'needSendSS': true }, function (response) { });
      })
      // }

    },
    weChat() {
      var _this = this
      document.getElementById('recommendown').style.display = 'block'

      let form = new FormData()
      form.append('currUrl', window.location.href)
      axios.post('https://m.vmei.com/openapi/jssdk/getConfig', form)
        .then(function (res) {
          t(res.data)
        })
        .catch(function (res) {
          console.log(res);
        })

      wx.ready(function () {
        axios.get(domain + `/heySephome`)
          .then(function (res) {

            if (res.data.data.loggedIn) {
              _this.loadCoupon()
              if (res.data.data.isVip) { //如果登录成功且是VIP
                _this.userShareKey = res.data.data.userShareKey
              }
              //微信端分享
              wx.onMenuShareAppMessage({
                title: _this.shareInfo.title,
                desc: _this.shareInfo.content,
                link: _this.shareInfo.urlWechat + '?uskey=' + _this.userShareKey,
                imgUrl: _this.shareInfo.imgUrlWechat, // 分享图标
                success: function () {
                  console.log('分享成功')
                }
              })
            } else {
              ////如果登录成功且是VIP
              wx.onMenuShareAppMessage({
                title: _this.shareInfo.title,
                desc: _this.shareInfo.content,
                link: _this.shareInfo.urlWechat,
                imgUrl: _this.shareInfo.imgUrlWechat, // 分享图标
                success: function () {
                  console.log('分享成功')
                }
              })
            }
          })
          .catch(function (res) {
            console.log(res);
          })



      })
      function t(t) {
        wx.config({
          debug: false,
          appId: t.appId,
          timestamp: t.timestamp,
          nonceStr: t.noncestr,
          signature: t.signature,
          jsApiList: ["checkJsApi", "onMenuShareTimeline", "onMenuShareAppMessage", "onMenuShareQQ", "onMenuShareWeibo", "hideMenuItems", "showMenuItems", "hideAllNonBaseMenuItem", "showAllNonBaseMenuItem", "translateVoice", "startRecord", "stopRecord", "onRecordEnd", "playVoice", "pauseVoice", "stopVoice", "uploadVoice", "downloadVoice", "chooseImage", "previewImage", "uploadImage", "downloadImage", "getNetworkType", "openLocation", "getLocation", "hideOptionMenu", "showOptionMenu", "closeWindow", "scanQRCode", "chooseWXPay", "openProductSpecificView", "addCard", "chooseCard", "launch3rdApp", "openCard", "openAddress"]
        })
      }

    },
    miniApp() {

    },
    //初始化分享
    initShareParams(bridge) {
      var _this = this;
      var options = {
        callType: "needSharePage",
        params: {
          shareType: "shareAction",
          shareTitle: _this.shareInfo.title,
          shareContent: _this.shareInfo.content,
          sharePic: _this.shareInfo.imgUrl,
          shareUrl: _this.shareInfo.urlWechat + '?uskey=' + _this.userShareKey,
          isOnlyMiniapp: true,
          miniapp: {
            appId: "gh_5b08b212e368",
            title: _this.shareInfo.title,
            pic: _this.shareInfo.imgUrl,
            link: _this.shareInfo.url,
            content: _this.shareInfo.content,
            path: "pages/webView/base/index?url=" + encodeURIComponent(_this.shareInfo.url)
          }
        }
      };

      bridge.callHandler("AppJSBack", options, function (response) { });

    },
    goToIndex() {
      location.href = 'https://act.vmei.com/web/m/act/2018/yearSells/index.html'
    },
    //时间戳转换
    timestampToTime(timestamp) {
      const _this = this;
      var date = new Date(timestamp * 1000);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
      var Y = date.getFullYear() + '-';
      var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
      var D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' ';
      // var D = date.getDate() + ' ';
      var h = _this.formatNumber(date.getHours()) + ':';
      var m = _this.formatNumber(date.getMinutes()) + ':';
      var s = _this.formatNumber(date.getSeconds());
      return Y + M + D + h + m + s;
    },
    formatNumber(n) {
      n = n.toString()
      return n[1] ? n : '0' + n
    },

    // 控制链接跳转
    goToPage(linkid, type) {
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
    },
    setTab(index) {
      if (this.channelId === 606) {
        this.christmas_tabs.forEach((item) => {
          item.active = false
        })
        this.christmas_tabs[index].active = true
      } else if (this.channelId === 607) {
        this.newyear_tabs.forEach((item) => {
          item.active = false
        })
        this.newyear_tabs[index].active = true
      }

      this.isShowDrop = false
    },
    handleNavs(type) {
      switch (type) {
        case 1:
          if (this.platform === 'wechat') {
            location.href = 'https://m.vmei.com/special/2018/christmas/dist/index'
          } else {
            location.href = 'https://act.vmei.com/web/m/act/2018/christmas/dist/index.html?needSS=1'
          }
          break
        case 2:
          if (this.platform === 'wechat') {
            location.href = 'https://m.vmei.com/special/2018/christmas/dist/entry'
          } else {
            location.href = 'https://act.vmei.com/web/m/act/2018/christmas/dist/entry.html'
          }
          break
        case 3:
          if (this.platform === 'wechat') {
            location.href = 'https://m.vmei.com/special/2018/christmas/dist/christmas'
          } else {
            location.href = 'https://act.vmei.com/web/m/act/2018/christmas/dist/christmas.html'
          }
          break
        case 4:
          if (this.platform === 'wechat') {
            location.href = 'https://m.vmei.com/special/2018/christmas/dist/newYear'
          } else {
            location.href = 'https://act.vmei.com/web/m/act/2018/christmas/dist/newYear.html'
          }
          break
      }
    },
    showDrop() {
      this.isShowDrop = !this.isShowDrop
    },
  },
  filters: {
    formatMoney(val) {
      let index = val.indexOf('.')
      return val.slice(0, index)
    },
    minisizePic(val) {
      return val + '?x-oss-process=image/resize,p_50'
    },
    formatDate(val) {
      if (val < 10) {
        return '0' + val
      }
      else {
        return val
      }
    }
  }
})