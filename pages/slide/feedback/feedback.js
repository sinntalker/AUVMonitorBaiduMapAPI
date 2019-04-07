// pages/slide/feedback/feedback.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list_remind: '加载中',
    status: false,  //是否显示列表
    itemopen: false,
    feednum: 0, //反馈的次数
    hasFeed: false,
    title: '',
    content: '',
    info: '',
    showTopTips: false,
    TopTips: '',

    windowHeight: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.windowHeight = wx.getStorageSync('windowHeight')
    console.log("feedback windowHeight:" + this.data.windowHeight)
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