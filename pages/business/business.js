import fetch from '../../utils/serve'
Page({
  mixins: [require('../../utils/myMixin.js')],
  data: {
    tabItem: [ '已注册', '未注册' ],
    auditStatus: 0
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getDataItem();
  },
  getDataItem() {
    let {listItem, pageNum, auditStatus} = this.data;
    auditStatus = auditStatus == 0 ? 1 : 0;
    fetch.post('/getMerchantsInfoList.do', {auditStatus, pageNum}, {}, true).then((res)=>{
      this.setData({
        listItem: listItem.concat(res.data),
        total: res.total 
      })
      this.isNoMore();
    }).catch((res)=>{
      console.log(res)
    })
  },
  handleToMap(e) {
    wx.navigateTo({
      url: '/pages/map/map?address=' + e.currentTarget.dataset.address
    });
  },
  handleAddToPage() {
    wx.navigateTo({
      url: '/pages/business/addBusiness/addBusiness'
    });
  },
  changeTab(e) {
    this.setData({
      auditStatus: e.detail
    })
    this.resetPageNum();
  },
  handleToPageDetail(e) { // 跳转详情页
    let {info} = e.currentTarget.dataset
    wx.navigateTo({
      url: `/pages/business/addBusiness/addBusiness?id=${info.merchId}&version=${info.version}`
    });
  }
})