import fetch from '../../utils/serve'
import { format } from '../../utils/formatDate'
Page({
  mixins: [require('../../utils/myMixin.js')],
  /**
   * 页面的初始数据
   */
  data: {
    tabItem: [ '待提现', '已提现' ],
    isInactive: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getDataItem();
  },
  getDataItem() {
    let {listItem, pageNum, isInactive} = this.data;
    fetch.post('/getMerchantsAmtList.do', {isInactive, pageNum}, {}, true).then((res)=>{
      res.data.forEach(item => {
        item.changeDate = isInactive == 0 ? format(item.applyDate) : format(item.auditDate)
      });
      this.setData({
        listItem: listItem.concat(res.data),
        total: res.total
      })
      this.isNoMore();
    }).catch((res)=>{
      console.log(res)
    })
  },
  handleToDetailPage(e) {
    let {version, merchId, applyId} = e.currentTarget.dataset.item
    wx.navigateTo({
      url: `/pages/withdrawal/withdrawalDetail/withdrawalDetail?id=${merchId}&version=${version}&applyId=${applyId}`
    });
  },
  changeTab(e) {
    this.setData({
      isInactive: e.detail
    })
    this.resetPageNum();
    this.getDataItem();
  }
})