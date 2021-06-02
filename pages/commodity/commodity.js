import fetch from '../../utils/serve'
Page({
  mixins: [require('../../utils/myMixin.js')],
  /**
   * 页面的初始数据
   */
  data: {
    serchValue: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getDataItem();
  },
  handleChangeSearch(e) {
    this.setData({
      serchValue: e.detail.value
    })
    this.resetPageNum();
  },
  getDataItem() {
    let {pageNum, serchValue} = this.data;
    fetch.post('/getGoodsInfoList.do', {pageNum, goodsCode: serchValue}, {}, true).then((res) => {
      this.setDatas(res)
    }).catch((res) => {
      console.log(res)
    })
  },
  onClick(e) {
    let {type, item} = e.currentTarget.dataset;
    switch(type) {
      case 'see':
        wx.navigateTo({
          url: `/pages/commodity/addCommodity/addCommodity?id=${item.goodsId}&type=see`
        })
        break;
      case 'edit':
        wx.navigateTo({
          url: `/pages/commodity/addCommodity/addCommodity?id=${item.goodsId}&version=${item.version}&isInactive=${item.isInactive}&type=edit`
        })
        break;
      case 'delete':
        let that = this;
        wx.showModal({
          title: '删除',
          content: '此操作不可逆，是否确认删除？',
          success (res) {
            if (res.confirm) {
              fetch.post('/changeGoodsInfoStatus.do', {goodsId: item.goodsId, version: item.version, isInactive: 2}).then((res) => {
                that.setData({
                  listItem: []
                })
                that.getDataItem();
              }).catch((res) => {
                console.log(res)
              })
            }
          }
        })
        
        break;
      case 'to':
        wx.navigateTo({
          url: `/pages/classification/classification`
        })
        break;
      case 'add':
        wx.navigateTo({
          url: `/pages/commodity/addCommodity/addCommodity`
        })
        break;
    }
  },
  handleConfirm(event) {
    this.setData({
      currentDate: event.detail,
      show: false
    });
  },
  handleCancel() {
    this.setData({
      show: false
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