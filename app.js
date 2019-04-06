//app.js
//Leancloud 相关服务
const AV = require('libs/av-weapp-min.js'); //存储服务
const { Realtime, TextMessage } = require('libs/realtime.weapp.min.js'); //实时通信服务
var APP_ID = 'OGEJNJU53uSc4WDEoBIAD4o8-gzGzoHsz';
var APP_KEY = 'jJ85gNS0a5wrNngXONdmEdCK';

var that;

// Bmob平台 后端数据服务
var Bmob = require('libs/Bmob-1.7.0.min.js'); // 1 - 引入
Bmob.initialize("3448b85209987a43b19d6717928e724b", "95e6db52dc93c72eddaa8c587bbe628b"); // 2 - Bmob 初始化

App({
  onLaunch: function () {

    //获取系统信息
    try {
      const res = wx.getSystemInfoSync()
      this.globalData.systemInfo.model = res.model
      this.globalData.systemInfo.pixelRatio = res.pixelRatio
      this.globalData.systemInfo.windowWidth = res.windowWidth
      this.globalData.systemInfo.windowHeight = res.windowHeight
      this.globalData.systemInfo.language = res.language
      this.globalData.systemInfo.version = res.version
      this.globalData.systemInfo.platform = res.platform
      console.log("APP - 获取设备信息成功！")
    } catch (e) {
      // Do something when catch error
      console.log("APP - 获取设备信息失败！")
    }

    //LeanCloud 初始化
    AV.init({
      appId: APP_ID,
      appKey: APP_KEY
    });
    
    //此处忽略一个问题，即可能存在一个微信用户对应于多个注册用户，原因：手机用户清空缓存时，系统自动创建新的匿名对象进行登陆，然后再行绑定微信用户
    //解决办法：获取用户openid，设置为唯一索引，若已存在，则舍弃当前匿名用户对象，获取该openid对象 用户名和密码直接进行登陆

    /**
     * Leancloud 一键登录
     */
    var currentUser = AV.User.current(); //获取当前用户
    if (currentUser) { //当前用户存在 ，直接跳转页面
      console.log("APP - 当前用户存在 ，直接跳转页面")
      if (currentUser.isAnonymous()) { //判断是否是匿名用户 是
        console.log("当前用户是匿名用户")
        //检查后端数据库是否已经修改为普通用户
        AV.User.logIn(currentUser.get('username'), '123456').then(function (loggedInUser) {
          console.log("已经改为普通用户" + loggedInUser);
        }, function (error) { //继续匿名用户登陆
          console.log("没有改为普通用户" + error);
        });
      } else { //不是
        console.log("当前用户不是匿名用户")
      }


      //判断用户是否已经授权
      wx.getSetting({ // 查看是否授权
        success(res) {
          if (res.authSetting['scope.userInfo']) {// 已经授权，可以直接调用 getUserInfo 获取头像昵称
            console.log("APP - 已经授权，可以直接调用 getUserInfo 获取头像昵称 --> 直接跳转到index页面")
            wx.redirectTo({
              url: '/pages/index/index',
            })
          } else if (!res.authSetting['scope.userInfo']) { // 未授权，不能调用 getUserInfo 获取头像昵称
            console.log("APP - 未授权，不能调用 getUserInfo 获取头像昵称 --> 跳转到start页面获取授权") //后续不用采取任何动作
          }
        }
      })
    } else { //currentUser 为空时，可打开用户注册界面… --> 进行匿名登陆 --> 随后进行绑定
      console.log("APP - currentUser 为空时，可打开用户注册界面… -->进行匿名用户登陆")
      AV.User.loginAnonymously().then(user => {// 匿名登录成功，user 即为当前登录的匿名用户
        console.log("APP - 匿名登录成功，user 即为当前登录的匿名用户")
      }).catch(function (error) {// 异常处理
        console.error("APP - 匿名用户登陆异常处理" + error);
      });
    }

  },

  globalData: {
    systemInfo: {
      model: '', //string  设备型号
      pixelRatio: '', //number 设备像素比
      windowWidth: 0, //number 可用窗口宽度
      windowHeight: 0, //number 可用窗口高度
      language: '', //string 微信设置的语言
      version: '', //string 微信版本号
      platform: '', //string 客户端平台
    },
  }
  
})