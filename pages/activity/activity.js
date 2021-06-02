// pages/activity/activity.js
import fetch from '../../utils/serve'
Page({
  mixins: [require('../../utils/myMixin.js')],
  /**
   * 页面的初始数据
   */
  data: {
    searchValue: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getDataItem();
  },
  getDataItem() {
    let {searchValue, pageNum} = this.data;
    fetch.post('/getDoActivityInfoList.do', {activityName: searchValue, pageNum}, {}, true).then(res => {
      this.setDatas(res)
    }).catch(res => {
    })
  },
  handleSearch(e) {
    this.setData({
      searchValue: e.detail.value
    })
    this.resetPageNum();
  },
  handleToPageDetail(e) {
    let { type, id } = e.currentTarget.dataset;
    let url = '/pages/activity/activityDetail/activityDetail';
    url = type == 'detail' ? `${url}?activityId=${id}` : url;
    wx.navigateTo({
      url
    })
  }
})