// pages/start/start.js
const AV = require('../../libs/av-weapp-min.js'); //存储服务
Page({

  /**
   * 页面的初始数据
   */
  data: {
    remind: '加载中',
    angle: 0,

    userinfos: undefined,
  },

  /**
   * 获取用户授权
   * 
   * 用户授权后，进入index页面
   *        用户授权后，进行
   * 用户未授权，则停留在当前页面
   */
  onGotUserInfo(e) {
    console.log("start - onGotUserInfo " + e.detail.errMsg)
    console.log(e.detail.userInfo)
    console.log(e.detail.rawData)

    this.data.userinfos = e.detail.userInfo;

    if (this.data.userinfos != undefined) { //登陆成功
      console.log("start - 用户数据获取成功，跳转页面")
      //转换数据 昵称、头像链接、性别、国家、省份、城市
      var userInfo = this.data.userinfos
      var nickName = userInfo.nickName
      var avatarUrl = userInfo.avatarUrl
      var gender = userInfo.gender
      var country = userInfo.country
      var province = userInfo.province
      var city = userInfo.city

      //将用户第一次授权数据写入缓存
      wx.setStorageSync('userInfo', userInfo)
      wx.setStorageSync('nickName', nickName)
      wx.setStorageSync('avatarUrl', avatarUrl)
      wx.setStorageSync('gender', gender)
      wx.setStorageSync('country', country)
      wx.setStorageSync('province', province)
      wx.setStorageSync('city', city)
      
      // 将微信用户数据绑定到当前登陆用户
      const user = AV.User.current(); //获取当前用户
      try {
        var username = user.get('username');
        user.setUsername(username);
        user.setPassword('123456');
        user.signUp().then(user => { // user 已转化为普通用户
          console.log("start - user 已转化为普通用户")
        }).catch(function (error) { // 异常处理
          console.error("start signup error: " + error);
        });
      } catch (e) {
        console.log("start - 匿名用户更改为普通用户失败！");
      } finally {
        //跳转页面
        wx.redirectTo({
          url: '/pages/index/index?isSave=1',
        })
      }
    } else { //用户没有进行授权，则停留在当前页面
      console.log("用户没有进行授权")
      wx.showModal({
        title: '提示',
        content: '为了您的正常使用，请进行授权！',
        showCancel: false,
        confirmText: '确定',
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击了“确认”')
          }
        }
      })
    }
  },

  bindGetUserInfo(e) {
    console.log("bindGetUserInfo" + e.detail.userInfo)
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("start - onLoad")
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    console.log("start - onReady")
    var _this = this;
    setTimeout(function () {
      _this.setData({
        remind: ''
      });
    }, 1000);
    wx.onAccelerometerChange(function (res) {
      var angle = -(res.x * 30).toFixed(1);
      if (angle > 14) { angle = 14; }
      else if (angle < -14) { angle = -14; }
      if (_this.data.angle !== angle) {
        _this.setData({
          angle: angle
        });
      }
    });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    console.log("start - onShow")
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})