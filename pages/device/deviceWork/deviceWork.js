// pages/device/deviceWork/deviceWork.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // index 首页顶部导航 - “调试与控制” 页面 导航
    navitopBarControl: ['调试功能', '控制功能',],
    currentTabControl: 0, //标签控制： 0 - 调试功能 ， 1 - 控制功能

    status: true,
    latitude: '',
    longitude: '',
    mapScale: 16,

    mapContext: '',
  },

  // 顶部导航栏 - 调试与控制 切换
  navtopBarControlTap: function (e) {
    this.setData({
      currentTabControl: e.currentTarget.dataset.idx // 标签切换
    })
  },

  /**
  * Debug功能测试
  * debugSpeedControlTap：测试螺旋桨启停功能
  * debugAngleATap：测试α摆角
  * debugAngleBTap：测试β摆角
  */
  debugSpeedControlTap: function (e) {
    console.log("debugSpeedControlTap:" + e);
  },

  debugAngleATap: function (e) {
    console.log("debugAngleATap:" + e);
  },

  debugAngleBTap: function (e) {
    console.log("debugAngleBTap:" + e);
  },

  /**
   * 设置目标地点
   * mapSetTap： 点击地图，选择对应的点
   */
  mapSetTap: function (e) {
    console.log("mapSetTap: " + e)
    var that = this;

    //获取当前数据
    wx.getLocation({
      type: 'wgs84',
      success(res) {
        var latitude = res.latitude
        var longitude = res.longitude
        var speed = res.speed
        var accuracy = res.accuracy
        console.log("当前经纬度为： " + latitude + ',' + longitude + ".")
        that.setData({
          latitude: latitude,
          longitude: longitude,
        })
      }
    })
  },

  mapResetTap: function (e) {
    console.log("mapResetTap: " + e)
    var that = this;
    // this.mapCtx.moveToLocation();
    this.data.mapContext.moveToLocation();
  },

  mapZoomOutTap: function (e) {
    console.log("mapZoomOutTap: " + e)
    if (this.data.mapScale <= 18) {
      this.setData({
        mapScale: ++this.data.mapScale
      })
    }
  },

  mapZoomInTap: function (e) {
    console.log("mapZoomInTap: " + e)
    if (this.data.mapScale >= 5) {
      this.setData({
        mapScale: --this.data.mapScale
      })
    }
  },

  /**
   * Run任务下达
   * inputDepthTap：输入下潜深度，弹出对话框，输入数字
   * inputSpeedTap：输入航行速度，弹出对话框，输入数字
   */
  inputDepthTap: function (e) {
    console.log("inputDepthTap:" + e)
  },

  inputSpeedTap: function (e) {
    console.log("inputSpeedTap:" + e)
  },

  submitRunTap: function (e) {
    console.log("submitRunTap: " + e + ", status: " + this.data.status)
    if (this.data.status == true) {
      this.setData({
        status: false,
      })
    } else {
      this.setData({
        status: true,
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("deviceWork onLoad : " + options.id)
    this.mapCtx = wx.createMapContext('myMapWork')

    this.data.mapContext = this.mapCtx;
    this.setData({
      mapContext: this.mapCtx
    })

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

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