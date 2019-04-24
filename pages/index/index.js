//index.js
//获取应用实例
var app = getApp()

const AV = require('../../libs/av-weapp-min.js'); //存储服务

//画图
var wxCharts = require('../../libs/wxcharts.js');
var areaChart = null;

// 定义常量
const MENU_WIDTH_SCALE = 0.5;
const FAST_SPEED_SECOND = 300;
const FAST_SPEED_DISTANCE = 5;
const FAST_SPEED_EFF_Y = 50;

//腾讯地图 引入SDK核心类
var QQMapWX = require('../../libs/qqmap-wx-jssdk.js');
var qqmapsdk;

//定义变量
var that;

Page({
  data: {
    // 用户登陆相关
    isLogin: false, //未登录
    userAvatarUrl: '',
    userNickName: '',

    // index 首页顶部导航 - "地理位置", "调试与控制", "操作日志"
    navitopbar: ["地理位置", "操作日志"],
    currentTab: 0, //标签控制： 0 - 地理位置， 1 - 调试与控制， 2 - 操作日志

    //地图上marker点
    markers: [{
      iconPath: '../../images/auv.png',
      id: 0,
      latitude: 23.099994,
      longitude: 113.324520,
      width: 50,
      height: 50
    },
    {
      iconPath: '../../images/auv.png',
      id: 1,
      latitude: 23.1011750000,
      longitude: 113.3235540000,
      width: 50,
      height: 50
    }],

    
    deviceInfoIsShow: false, //是否展示AUV信息
    // deviceInfoID: 0, //AUV 对应的ID编号

    deviceInfo: {
      deviceInfoID: 0, //AUV 对应的ID编号

      min_speed: 0, //最小速度
      max_speed: 0, //最大速度
      ave_speed: 0, //平均速度

      min_depth: 0, //最小水深
      max_depth: 0, //最大水深
      ave_depth: 0, //平均水深

      min_temperature: 0, //最小水温
      max_temperature: 0, //最大水温
      ave_temperature: 0, //平均水温

      deviceInfoMoreIsShow: false, //是否展示更多信息
    },

    // index 系统信息
    windowHeight: 0,
    windowWidth: 0,
    systemHeight: app.globalData.systemInfo.windowHeight, //系统高度
    systemWidth: app.globalData.systemInfo.windowWidth, //系统宽度

    

    // 侧滑栏 - 菜单宽度、偏移位置、是否开始
    ui: {
      menuWidth: 0,
      offsetLeft: 0,
      tStart: true,
    },

    //滑动参数
    moveStartX: 0,
    moveEndX: 0,

    //侧边栏展开条目
    itemSlide: [
      {
        id: 0,
        name: "个人信息",//只显示：微信头像、微信昵称，用户权限；（注册数据库时绑定用户ID，根据用户ID获取用户权限）同时获取性别、地区、token等数据。
      }, {
        id: 1,
        name: "查看设备",//用户可以查看当前名下可以操作的设备编号、名称、状态，
      }, {
        id: 2,
        name: "项目简介",
      }, {
        id: 3,
        name: "问题反馈",
      }, {
        id: 4,
        name: "关于我们",
      }, {
        id: 5,
        name: "权限设置",
      },
    ],
    itemAvatar: '',

    mapContext: '',
    mapScale: 16,
  },

  // 顶部导航栏 切换
  navtopbarTap: function (e) {
    this.setData({
      currentTab: e.currentTarget.dataset.idx // 标签切换
    })
  },

  //地图 - 标记点
  markertap(e) {
    // console.log(e.markerId + "deviceInfoIsShow: " + this.data.deviceInfoIsShow)
    var deviceInfoId = 'deviceInfo.deviceInfoID';
    if (this.data.deviceInfo.deviceInfoID == e.markerId) {
      if (this.data.deviceInfoIsShow) {
        this.setData({
          deviceInfoIsShow: false,
          [deviceInfoId]: e.markerId
        })
      } else {
        this.setData({
          deviceInfoIsShow: true,
          [deviceInfoId]: e.markerId
          // deviceInfoID: e.markerId,
        })
      }
    } else {
      if (this.data.deviceInfoIsShow) {
        this.setData({
          deviceInfoIsShow: true,
          [deviceInfoId]: e.markerId
          // deviceInfoID: e.markerId
        })
      } else {
        this.setData({
          deviceInfoIsShow: true,
          [deviceInfoId]: e.markerId
          // deviceInfoID: e.markerId
        })
      }
    }
    
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

  deviceInfoShowMoreTap: function(e) {
    console.log("deviceInfoShowMoreTap")

    var deviceInfoMoreIsShow = 'deviceInfo.deviceInfoMoreIsShow';
    wx.navigateTo({
      url: '../../pages/device/deviceInfo/deviceInfo?id=' + this.data.deviceInfo.deviceInfoID,
    })
    // if (this.data.deviceInfo.deviceInfoMoreIsShow == true) {
    //   this.setData({
    //     [deviceInfoMoreIsShow]: false,
    //   })
    // } else {
    //   this.setData({
    //     [deviceInfoMoreIsShow]: true,
    //   })
    // }

  },

  deviceSetWorkTap: function(e) {
    console.log("deviceSetWorkTap")

    wx.navigateTo({
      url: '../../pages/device/deviceWork/deviceWork?id=' + this.data.deviceInfo.deviceInfoID,
    })
  },

  mapShowInfoTap: function(e) {
    console.log("mapShowInfoTap")

    var deviceInfoMoreIsShow = 'deviceInfo.deviceInfoMoreIsShow';

    this.setData({
      deviceInfoIsShow: false,
      [deviceInfoMoreIsShow]: false,
      // deviceInfoID: e.markerId
    })
    wx.getLocation({
      type: 'wgs84',
      success(res) {
        var latitude = res.latitude
        var longitude = res.longitude
        var speed = res.speed
        var accuracy = res.accuracy
        console.log("当前经纬度为： " + latitude + ',' + longitude + ".")
      }
    })
    
    
    
  },

  // index 加载页面
  onLoad: function (options) {
    console.log("index onload" + options.isSave)

    this.data.userNickName = wx.getStorageSync('nickName');
    this.data.userAvatarUrl = wx.getStorageSync('avatarUrl');

    if (options.isSave == 1) {
      try {
        //转换为普通用户后绑定当前用户数据
        const user = AV.User.current(); //获取当前用户

        var nickname = wx.getStorageSync('nickName');
        var avatarUrl = wx.getStorageSync('avatarUrl');
        var gender = wx.getStorageSync('gender');
        var country = wx.getStorageSync('country');
        var province = wx.getStorageSync('province');
        var city = wx.getStorageSync('city');
        var userInfo = wx.getStorageSync('userInfo');

        AV.User.logIn(user.get('username'), '123456').then(function (loggedInUser) {
          console.log("index - 获取当前用户数据成功：" + loggedInUser.get('objectId'));
          loggedInUser.set('nickName', nickname);
          loggedInUser.set('avatarUrl', avatarUrl);
          loggedInUser.set('gender', gender);
          loggedInUser.set('country', country);
          loggedInUser.set('province', province);
          loggedInUser.set('city', city);
          loggedInUser.set('userInfo', userInfo);
          return loggedInUser.save();
        }).then(function (loggedInUser) {
          console.log("index - 保存当前用户数据成功：" + loggedInUser.get('objectId'));
        }).catch(function (error) { // 异常处理
          console.error("index - 异常处理" + error);
        });
      } catch (e) {
        console.log("index - 保存当前数据失败！" + e);
      } finally {

      }
    } else {
      console.log("index - 此时不需要重新覆写用户数据！")
    }
    
    //腾讯地图 实例化API核心类
    qqmapsdk = new QQMapWX({
      key: 'OJSBZ-6N6KQ-VEU5L-GGADF-HNVBK-LGFLC'
    });

    var that = this;
    try {
      console.log("index - onload - getSystemInfo success.")
      var height = wx.getStorageSync('windowHeight')
      var width = wx.getStorageSync('windowWidth')
      this.setData({
        windowHeight: height,
        windowWidth: width,
      })
      let res = wx.getSystemInfo({
        success: function (res) {
          that.data.ui.menuWidth = res.windowWidth * 0.5;
          that.data.ui.offsetLeft = 0;
          that.data.ui.tStart = true;
          that.setData({
            ui: that.data.ui,
            // windowHeight: res.windowHeight,
            // windowWidth: res.windowWidth,
          })
          console.log("systemInfo:" + res.windowHeight + " " + res.windowWidth + res.model + " " + res.pixelRatio + " " + res.language + " " + res.version + " " + res.platform)
          console.log("slide ui info:" + that.data.ui.menuWidth + " " + that.data.ui.offsetLeft + " " + that.data.ui.tStart)
        },
      })
    } catch (e) {
      console.log("index - onload - getSystemInfo error:" + e);
    }

    this.mapCtx = wx.createMapContext('myMap')

    this.data.mapContext = this.mapCtx;
    this.setData({
      mapContext: this.mapCtx
    })

  },

  // index 展示页面
  onShow: function () {
    console.log("index onshow")

    this.setData({
      itemAvatar: (this.data.userAvatarUrl != '') ? (this.data.userAvatarUrl) : ('../../images/user.png'),
    })


  },

  /**
   * loginInTap 点击按钮 进行微信登陆
   */
  loginInTap: function(e) {
    console.log("点击了loginInTap 登陆头像")
    if (!this.data.isLogin) {
      console.log("用户没有进行微信登陆")
      this.setData({
        isLogin: true,
      })

    } else {
      console.log("用户已经进行微信登陆")
      this.setData({
        isLogin: false,
      })
    }
  },

  handletap: function(e) {
    console.log("index - 点击了handletap")
  },

  userSlideShowTap: function(e) {
    // console.log("index - userSlideShowTap");
    let { ui } = this.data;
    if (ui.offsetLeft <= 0) {
      ui.offsetLeft = ui.menuWidth;
    } else if (ui.offsetLeft >= ui.menuWidth) {
      ui.offsetLeft = 0;
    }
    this.setData({
      ui: ui,
    })
  },

  userSlideCloseTap: function(e) {
    let {ui} = this.data;
    ui.offsetLeft = 0;
    this.setData({
      ui: ui,
    })
  },

  // -------------------------------------------------------
  /**
   * 侧边栏点击事件
   */
  bindTapSlideItem: function (e) {
    console.log("bindTapSlideItem" + e);
    var id = e.currentTarget.dataset.index;
    if (id == 0) {
      console.log("index: " + id);
      wx.navigateTo({
        url: '../slide/userinfo/userinfo', 
      })
    } else if (id == 1) {
      console.log("index: " + id);
      wx.navigateTo({
        url: '../slide/deviceinfo/deviceinfo',
      })
    } else if (id == 2) {
      console.log("index: " + id);
      wx.navigateTo({
        url: '../slide/projectbrief/projectbrief',
      })
    } else if (id == 3) {
      console.log("index: " + id);
      wx.navigateTo({
        url: '../slide/feedback/feedback',
      })
    } else if (id == 4) {
      console.log("index: " + id);
      wx.navigateTo({
        url: '../slide/aboutus/aboutus',
      })
    } else if (id == 5) {
      console.log("index: " + id);
      wx.navigateTo({
        url: '../slide/aclsetting/aclsetting',
      })
    }
    //  else if (id == 6) {
    //   console.log("index: " + id);
    //   wx.navigateTo({
    //     url: './slide/userinfo/userinfo',
    //   })
    // }

  },

  // --------------------------------------------------------
  //滑动移动事件 - 只处理滑动事件
  handletouchmove: function (e) {
    console.log("index handle touch - start")
    let currentX = e.touches[0].pageX; //获取当前鼠标X位置

    let { clientX } = e.touches[0];
    let { ui } = this.data;
    let offsetX = this.startX - clientX;
    this.startX = clientX;
    ui.offsetLeft -= offsetX;
    if (ui.offsetLeft <= 0) {
      ui.offsetLeft = 0;
    } else if (ui.offsetLeft >= ui.menuWidth) {
      ui.offsetLeft = ui.menuWidth;
    }
    this.setData({
      ui: ui,
      moveEndX: this.startX,
    })
  },

  //滑动开始事件 - 只记录滑动事件开始时X坐标
  handletouchtart: function (e) {
    let currentX = e.touches[0].pageX;
    this.startX = currentX; //起始位置
    console.log("startX =" + this.startX);
    this.data.ui.tStart = true; //set animate
    this.setData({
      ui: this.data.ui,
      moveStartX: this.startX, //记录起始位置
    })
  },

  /** 滑动结束事件 - 处理滑动事件
   * 1. 滑动事件标志取消：tStart
   * 2. 判断滑动方向
   *        如果向左滑动 - 收起侧边栏 - offset置0
   *        如果向右滑动 - 展开侧边栏 - offset置满
   */
  handletouchend: function (e) {
    console.log("index handle touch - end")
    let { ui } = this.data;
    let moveEndX = this.data.moveEndX;
    let moveStartX = this.data.moveStartX;
    ui.tStart = false; //close animate

    if (moveEndX > (moveStartX + 50)) { //右滑
      ui.offsetLeft = ui.menuWidth;
    } else if (moveEndX < moveStartX) { //左滑
      ui.offsetLeft = 0;
    }

    this.setData({ ui: this.data.ui })
  },
  
})