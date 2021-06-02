import fetch from '../../../utils/serve'
var common = require("../../../utils/throttle.js")
Page({
  mixins: [require('../../../utils/scrollMixin.js')],
  /**
   * 页面的初始数据
   */
  data: {
    pageData: {
      activityName: '', // 活动名称
      activityDescription: '', // 活动描述
      merchCode: '', // 商家code
      merchName: '', // 商家名称
      activityScope: '', // 活动范围
      isInactive: 0, // 是否上架
      losingLotteryDesc: '', // 未中奖描述
      address: '', // 位置
    },
    doGoodsActivityList: [
      {
        goodsName: '', // 商品名称
        winningProbability: '', // 中奖率
        levelName: '', // 商品描述
        goodsUpper: '' // 商品数量
      }
    ],
    listItem: [], // 商品列表
    merchItem: [], // 商户列表
    goodsShow: false,
    merchShow: false,
    actionItem: [],
    clickType: [],
    clickIndex: '',
    activityId: ''
  },
  changeValueMerch(e) {
    let {key, index} = e.currentTarget.dataset;
    let kyes = `doGoodsActivityList[${index}].${key}`;
    this.setData({
      [kyes]: e.detail.value
    })
  },
  onClick(e) {
    let { type, key, value, index } = e.currentTarget.dataset;
    let { doGoodsActivityList, clickIndex } = this.data;
    this.setData({
      clickType: [key, value],
      clickIndex: index
    })
    switch(type) {
      case 'merch': // 商家活动
        this.resetPageNum(this.getMerchData)
        this.setData({
          merchShow: true
        })
        break;
      case 'goods': // 商品选择
        this.resetPageNum()
        this.setData({
          goodsShow: true
        })
        break;
      case 'add': // 添加商品规则
        doGoodsActivityList.push({
          goodsName: '', // 商品名称
          winningProbability: '', // 中奖率
          levelName: '', // 商品描述
          goodsUpper: '' // 商品数量
        })
        this.setData({
          doGoodsActivityList
        })
        break;
      case 'delete': // 商品删除
        doGoodsActivityList.splice(index, 1);
        this.setData({doGoodsActivityList})
        break;
      case 'push': // 添加商品
        this.handleAdd();
        break;
      case 'goodsshow': // 选择商品弹窗
        doGoodsActivityList[clickIndex] = Object.assign(doGoodsActivityList[clickIndex], value)
        this.setData({
          doGoodsActivityList,
          goodsShow: false
        })
        break;
    }
  },
  handleCancel() { // 关闭选择框
    this.setData({
      goodsShow: false,
      merchShow: false
    })
  },
  handleAdd () { // 添加按钮
    let {pageData, doGoodsActivityList} = this.data;
    let {activityName, activityDescription, merchName, activityScope, losingLotteryDesc} = this.data.pageData;
    for(let i = 0; i < doGoodsActivityList.length; i++) {
      if(!doGoodsActivityList[i].goodsName) {
        wx.showToast({
          title: '请将必填项补充完整',
          icon: 'none',
          duration: 2000
        })
        return
      }
    }
    if(!activityName || !activityDescription || !merchName || !activityScope || !losingLotteryDesc) {
      wx.showToast({
        title: '请将必填项补充完整',
        icon: 'none',
        duration: 2000
      })
      return
    }
    pageData.doGoodsActivityList = doGoodsActivityList;
    common.throttleFunc(fetch.post('/saveDoActivityInfo.do', pageData).then((res) => {
      wx.redirectTo({
        url: '/pages/activity/activity'
      });
      }).catch((res) => {
        console.log(res)
      }), 2000)
  },
  changeInputValue(e) {
    let { key } = e.currentTarget.dataset;
    let keys = `pageData.${key}`
    this.setData({
      [keys]: e.detail.value
    })
  },
  handleSelect(e) { // 选择框发生变化
    let {clickType, merchItem} = this.data;
    let {info} = e.currentTarget.dataset;
    let key, value;
    key = `pageData.${clickType[0]}`;
    value = `pageData.${clickType[1]}`;
    let address = merchItem.filter((item) => {return item.merchName == (!!info ? info.merchName : e.detail.name)})
    this.setData({
      [key]: !!info ? info.merchName : e.detail.name,
      [value]: !!info ? info.merchId : e.detail.value,
      'pageData.address': address[0].merchAddress,
      merchShow: false
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options.activityId) {
      this.setData({
        activityId: options.activityId
      })
      this.getDetail();
      wx.setNavigationBarTitle({
        title: '活动详情'
      })
    }
  },
  onChange({ detail }) {
    // 需要手动对 checked 状态进行更新
    this.setData({ 'pageData.isInactive': detail ? 1 : 0 });
  },
  getDetail() {
    fetch.post('/getDoActivityVOById.do', {activityId: this.data.activityId},{'content-type': 'application/x-www-form-urlencoded'}).then((res) => {
    this.setData({
      pageData: res,
      doGoodsActivityList: res.doGoodsActivityList
    })
    }).catch((res) => {
      console.log(res)
    })
  },
  getDataItem() { // 获取商品列表
    let {pageNum} = this.data;
    fetch.post('/getGoodsInfoList.do', {pageNum}, {}, true).then((res) => {
      console.log("为什么")
      this.setDatas(res)
    }).catch((res) => {
      console.log(res)
    })
  },
  getMerchData() { // 获取商家列表
    let {pageNum} = this.data;
    fetch.post('/getMerchantsInfoList.do', {pageNum}, {}, true).then((res) => {
      console.log('nihaoya')
      this.setDatas(res, 'merchItem')
    }).catch((res) => {
      console.log(res)
    })
  },
  handleBindscrolltolowerMerch() {
    this.handleBindscrolltolower(this.getMerchData)
  },
  onClose() {
    this.setData({
      merchShow: false,
      goodsShow: false
    })
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
