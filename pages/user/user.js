// pages/user/user.js
import fetch from '../../utils/serve'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    customerInfo: {},
    winningInfo: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   this.getCustomerData();
   this.getWinningData();
  },
  getCustomerData() {
    fetch.post('/getCustomerSituation.do').then(res => {
      this.setData({
        customerInfo: res
      })
    }).catch(err => {
      console.log(err)
    })
    
  },
  getWinningData() {
    fetch.post('/getWinningSituation.do').then(res => {
      this.setData({
        winningInfo: res
      })
    }).catch(err => {
      console.log(err)
    })
  },
  handleToPageMap(e) {
    let {type} = e.currentTarget.dataset;
    wx.navigateTo({
      url: `/pages/user/customerMap/customerMap?type=${type}`
    });
  },
  handleToPage(e) {
    let { type } = e.currentTarget.dataset
    wx.navigateTo({
      url: `/pages/user/customerList/customerList?type=${type}`
    });
  },
  handleToPageLottery(e) {
    let { type } = e.currentTarget.dataset
    wx.navigateTo({
      url: `/pages/user/lotteryHistory/lotteryHistory?typeNum=${type}&type=1`
    });
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