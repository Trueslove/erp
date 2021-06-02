// pages/user/customerMap/customerMap.js
import fetch from "../../../utils/serve"

Page({
  mixins: [require('../../../utils/scrollMixin.js')],
  /**
   * 页面的初始数据
   */
  data: {
    latitude: 30.25564393,
    longitude: 120.21207547,
    markers: [],
    customCalloutMarkerIds: [],
    num: 1,
    customerShow:false,//用户弹出层
    saveData: [],
    activeInfo: {},
    merchId: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getInfo();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.mapCtx = wx.createMapContext('myMap');
  },
  handleToPageDetail(e) {
    let {id, type} = e.currentTarget.dataset
    if(type != 1) {
      wx.navigateTo({
        url: `/pages/user/customerDetail/customerDetail?id=${id}`
      });
    }
  },
  getInfo() { // 获取地图用户信息
    fetch.post('/getAllMerchantsInfoAndUserNum.do').then(res => {
      let markers = [];
      let customCalloutMarkerIds = [];
      res.forEach((item, index) => {
        markers.push({
          id: index + 1,
          latitude: item.merchCoordinatesLatitude,
          longitude: item.merchCoordinatesLongitude,
          alpha:0,
          customCallout: {
            anchorY: 0,
            anchorX: 0,
            display: 'ALWAYS'
          },
        })
        customCalloutMarkerIds.push(
          {
            id: index + 1,
            name: item.sl,
          }
        )
      })
      this.setData({
        markers,
        customCalloutMarkerIds,
        saveData: res
      })
    })
  },
  callouttap(e) {
    this.setData({
      merchId: this.data.saveData[e.detail.markerId - 1].merchId
    })
    this.resetPageNum();
    this.setData({
      customerShow:true,
      activeInfo: this.data.saveData[e.detail.markerId - 1]
    })
  },
  getDataItem() {
    let {merchId, pageNum} = this.data;
    fetch.post('/getLoLotteryUserInfoList.do', {merchId, pageNum}, {}, true).then(res => {
      this.setDatas(res)
    })
  },
  //关闭弹窗
  onClose(){
    this.setData({
      customerShow:false
    })
  }
})