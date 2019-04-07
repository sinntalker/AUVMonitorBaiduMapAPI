// pages/slide/userinfo/userinfo.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    username:'',
    userAvatar:'',
  },

  submitUserNameChangeTap: function (e) {
    console.log("submitUserNameChangeTap")
  },

  submitUserAvatarChangeTap: function (e) {
    console.log("submitUserAvatarChangeTap")
  },

  submitUserInfoChangeTap: function (e) {
    console.log("submitUserInfoChangeTap")
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("userinfo - onLoad")

    // this.data.username = wx.getStorageSync("nickName")
    // this.data.userAvatar = wx.getStorageSync("avartarUrl")
    
    this.setData({
      username: wx.getStorageSync("nickName"),
      userAvatar: wx.getStorageSync("avatarUrl")
    })

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    console.log("userinfo - onReady")
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    console.log("userinfo - onShow")
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    console.log("userinfo - onHide")
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    console.log("userinfo - onUnload")
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    console.log("userinfo - onPullDownRefresh")
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