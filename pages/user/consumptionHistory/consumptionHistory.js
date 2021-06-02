import fetch from "../../../utils/serve"
import { format } from "../../../utils/formatDate"
Page({
  mixins: [require('../../../utils/myMixin.js')],
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getDataItem();
  },
  getDataItem() {
    let {pageNum} = this.data;
    fetch.post("/customerPayBook/getCustomerPayBookList.do", {pageNum}, {}, true).then(res=> {
      res.data.forEach(item => {
        item.changeTime = format(item.payTime);
      })
      this.setDatas(res)
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