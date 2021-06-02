import fetch from '../../../utils/serve'
import {
  formLatLng,
  formAddress
} from "../../../utils/map"
import {
  uploadOne
} from "../../../utils/upload"

var common = require("../../../utils/throttle.js")
Page({
  /**
   * 页面的初始数据
   */
  data: {
    dataForm: {
      merchLogo: '', // 商家logo
      merchName: '', // 商家名称
      industryName: '', // 商家行业
      linkMan: '', // 联系人
      linkNo: '', // 联系电话
      businessHours: '', // 营业时间
      merchAddress: '', // 地址信息
      merchCoordinatesLatitude: 23.099994,
      merchCoordinatesLongitude: 113.324520,
    },
    markers: [],
    fileList: [],
    info: {},
    relationId: '',
    scanResult: null // 扫描结果
  },
  onReady: function () {
    let {
      address,
      location
    } = wx.getStorageSync('addressInfo');
    this.addressChange(location, address);
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options.id) {
      this.setData({
        info: options
      })
      this.getDetail(options.id);
      wx.setNavigationBarTitle({
        title: "商家详情"
      })
    }
  },
  handleScanCode() { // 扫一扫
    wx.scanCode({
      success: (res) => {
        let URL= res.result;
        let relationId = URL.split('?')[1].split('=')[1];
        this.setData({
          relationId
        })
        fetch.post('/mePlatformRelation/isRelationIdAvailable.do', {relationId}).then(res =>{
          this.setData({
            scanResult: res
          })
        }).catch(err => {
          this.setData({
            scanResult: err
          })
        })
      },
      fail: (res) => {
        console.log(res);
      }
    })
  },
  getDetail(id) { // 获取商家详情
    fetch.post('/getMerchantsInfoById.do', {
      id
    }, {'content-type': 'application/x-www-form-urlencoded'}).then((res) => {
      this.setData({
        dataForm: res,
        fileList: [{
          url: res.merchLogo
        }]
      })
    }).catch((res) => {
      console.log(res)
    })
  },
  handleFormLatLng(e) { // 根据经纬度转换成详细地址
    formLatLng(e, (data) => {
      this.addressChange(data, e.detail.value);
    })
  },
  handleClickMap(e) { // 根据详细地址转换成经纬度
    formAddress(e, (data) => {
      this.addressChange(e.detail, data);
    })
  },
  afterRead(event) { // 上传图片
    uploadOne(event, (data) => {
      this.setData({
        fileList: [{
          url: data
        }],
        'dataForm.merchLogo': data
      });
    })
  },
  handleUploaderDelete() { // 删除图片
    if(this.data.info.id) return;
    this.setData({
      fileList: [],
      'dataForm.merchLogo': ''
    })
  },
  handleConfirm() { // 点击确认按钮
    let {
      info,
      dataForm,
      scanResult,
      relationId
    } = this.data;
    let {merchLogo, merchName, industryName, linkMan, linkNo, applyRealName} = this.data.dataForm;
    let parmse = Object.assign({}, dataForm, {relationId, linkPhone: linkNo});
    if (!merchLogo || !merchName || !industryName || !linkMan || !linkNo || !applyRealName) {
      wx.showToast({
        title: '请将必填项补充完整',
        icon: 'none'
      })
      return;
    } else if(scanResult != 'success') {
      wx.showToast({
        title: '绑定失败，请重新绑定',
        icon: 'none'
      })
      return;
    }
    if(info.version) {
      Object.assign(parmse, {merchId: info.id, version: info.version})
    }
    common.throttleFunc(fetch.post('/addOrEditMerchantsInfo.do', parmse).then((res) => {
      wx.navigateTo({
        url: '/pages/business/business'
      });
    }).catch((res) => {
      console.log(res)
    }), 2000)
  },
  addressChange(location, address) { // 地址信息发生变化，视图变化
    this.setData({
      'dataForm.merchCoordinatesLatitude': location.latitude || location.lat,
      'dataForm.merchCoordinatesLongitude': location.longitude || location.lng,
      'dataForm.merchAddress': address,
      markers: [{
        id: 1,
        latitude: location.latitude || location.lat,
        longitude: location.longitude || location.lng,
        name: address
      }]
    })
  },
  changeInputValue(e) { // 当输入框值发生变化时
    let {
      key
    } = e.currentTarget.dataset
    let keys = `dataForm.${key}`
    this.setData({
      [keys]: e.detail.value
    })
  }
})