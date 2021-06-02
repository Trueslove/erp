//index.js
const QQMapWX = require('qqmap-wx-jssdk');
const app = getApp();
import fetch from '../../utils/serve'

Page({
  data: {
    typeItem: [
      {name: '分类管理', url: '/pages/classification/classification', iconUrl: '../../images/home/商品@2x.png'},
      {name: '商品管理', url: '/pages/commodity/commodity', iconUrl: '../../images/home'},
      {name: '商家管理', url: '/pages/business/business', iconUrl: '../../images/home'},
      {name: '提现管理', url: '/pages/withdrawal/withdrawal', iconUrl: '../../images/home'},
      {name: '用户管理', url: '/pages/user/user', iconUrl: '../../images/home'},
      {name: '商家活动', url: '/pages/activity/activity', iconUrl: '../../images/home'},
      {name: '商家流水', url: '/pages/flowingWater/flowingWater', iconUrl: '../../images/home'},
      {name: '绑定码', url: '/pages/creatCode/creatCode', iconUrl: '../../images/home'}
    ],
    qqmapsdk: null,
    userInfo:{}
  },
  getPhoneNumber({detail: {encryptedData, iv,errMsg}}) { //授权手机
    console.log(encryptedData)
    console.log(iv)
    console.log(errMsg)
    if(errMsg==='getPhoneNumber:ok' ){
      this.getTel({encryptedData, iv})
    }

  },
  getTel({encryptedData, iv}) {
    wx.login({
      success: (res)=> {
        if (res.code) {
          const {code} = res; //code换取token
          fetch.post('/platform/decryptData.do', {data: encryptedData, iv,code},{'content-type': 'application/x-www-form-urlencoded'}).then(({platform:userInfo,token}) => {
            wx.setStorageSync('token',token)
            this.setData({userInfo})
          }).catch(() => {

          })
        } else {
          console.log('获取用户登录态失败！' + res.errMsg)
        }
      }
    });
  },
  //事件处理函数
  onLoad: function () {
    this.setData({
      qqmapsdk: new QQMapWX({ key: 'YLFBZ-WHAWI-ZXUGH-53Q65-TOJ7E-ADBNQ' })
    })
    this.getCurrentPosition();
    app.login(({userInfo})=>{
      if(userInfo){
        this.setData({userInfo})
      }
    })
  },
  // 获取当前位置经纬度
  async getCurrentPosition() {
    const self = this
    // 获取经纬度
    const { latitude, longitude } = await new Promise((resolve, reject) => {
      wx.getLocation({
        type: 'gcj02',
        success(res) {
          resolve(res)
        }
      })
    })
    // 获取地址信息
    this.data.qqmapsdk.reverseGeocoder({
      location: {
        latitude: latitude,
        longitude: longitude
      },
      success: function (res) {
        const { result } = res
        wx.setStorageSync('addressInfo', result)
      },
      fail: function (res) {
        console.log(res)
      }
    })
  },
  handleToPage(e) {
    wx.navigateTo({
      url: e.currentTarget.dataset.url
    });
  }
})

