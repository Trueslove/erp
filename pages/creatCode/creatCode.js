import fetch from "../../utils/serve"
import QRCode from '../../utils/qrCode'
Page({
  mixins: [require('../../utils/myMixin.js')],
  /**
   * 页面的初始数据
   */
  data: {
    tabItem: [ '全部', '已绑定', '未绑定' ],
    isInactive: 0,
    activeItem: [], // 商品列表
    goodsShow: false,
    creatShow: false,
    downShow: false,
    num: null, // 生成个数
    type: 0,
    activeInfo: {},
    downPath: '',
    activeCode: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getDataItem();
    this.getActiveItem();
  },
  onClick(e) {
    let {type, info} = e.currentTarget.dataset;
    let that = this;
    switch(type) {
      case 'confirm': // 弹窗确认按钮
        this.handleAddRelation();
        break;
      case 'cancel': // 弹窗取消按钮
        this.setData({
          creatShow: false
        })
        break;
      case 'creat': // 点击生成按钮
        this.setData({
          creatShow: true
        })
        break;
      case 'down': // 点击下载按钮
        this.clickSaveImg();
        break;
      case 'dialogDown': // 点击打开下载弹窗
        wx.showLoading({
            title: ''
        })
        this.setData({downShow: true}, () => { //必须先渲染canvas才能执行
          const url = 'https://shoppingtest.zjmiec.cn/lottot/platform'
          new QRCode('myQrcode', {
            text: `${url}?relationId=${info.relationId}`,
            width: 180,
            height: 180,
            padding: 0, // 生成二维码四周自动留边宽度，不传入默认为0
            correctLevel: QRCode.CorrectLevel.L, // 二维码可辨识度
            callback: (res) => {
              wx.previewImage({
                current: res.path,
                urls: [res.path]
              });
              this.setData({
                downPath: res.path,
                downShow: false
              })
              wx.hideLoading();
            }
          })
        })
        break;
      case 'close':
        this.setData({
          downShow: false
        })
        break;
      case 'active':
        this.setData({
          activeInfo: info,
          goodsShow: true
        })
        break;
      case 'goodsshow':
        this.setData({
          activeCode: info.activityId
        })
        this.handleBindActivity(info);
        break;
    }
  },
  handleCancel() {
    this.setData({
      goodsShow: false
    })
  },
  handleChangeInput(e) {
    this.setData({
      num: e.detail.value
    })
  },
  handleAddRelation() { // 添加绑定码
    let { num } = this.data;
    fetch.post('/mePlatformRelation/addRelation.do', {num}, {'content-type': 'application/x-www-form-urlencoded'}).then(res => {
      this.setData({
        creatShow: false
      })
      this.getDataItem();
    })
  },
  handleBindActivity(info) { // 绑定活动
    let {activityId, activityName, merchId, merchName} = info;
    let {id} = this.data.activeInfo;
    fetch.post('/mePlatformRelation/bindActivity.do', {id, activityId, activityName, merchId, merchName}).then(res => {
      this.handleCancel();
      this.getDataItem();
    }).catch(err => {
    })
  },
  handleSelectById() { // 查询绑定码
    fetch.post('/mePlatformRelation/selectById.do', {id}, {'content-type': 'application/x-www-form-urlencoded'}).then(res => {
      this.setData({
        creatShow: false
      })
    })
  },
  getActiveItem() { // 获取活动列表
    fetch.post('/getDoActivityInfoList.do').then(res => {
      this.setData({
        activeItem: res
      })
    }).catch(res => {
    })
  },
  getDataItem() { // 获取列表
    let {type, pageNum, pageSize} = this.data;
    fetch.post('/mePlatformRelation/activityList.do', {type, pageNum, pageSize}, {}, true).then((res) => {
      this.setDatas(res)
    }).catch((res) => {
      console.log(res)
    })
  },
  getGoodsData() { // 获取商品列表
    fetch.post('/getGoodsInfoList.do').then((res) => {
      this.setData({
        activeItem: res
      })
    }).catch((res) => {
      console.log(res)
    })
  },
  changeTab(e) {
    this.setData({
      type: e.detail
    })
    this.resetPageNum();
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