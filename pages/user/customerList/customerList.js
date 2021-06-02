import fetch from '../../../utils/serve'
Page({
  mixins: [require('../../../utils/myMixin.js')],
  /**
   * 页面的初始数据
   */
  data: {
    show: false, // 弹窗
    userNameOrPhone: '', // 搜索数据
    type: '', // 判断是哪种类型
    checked: false,
    tabItem: [ '全部', '今日', '本周', '本月' ],
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      type: options.type
    })
    this.getDataItem();
  },
  changeTab(e) { // 标签发生更改
    this.setData({
      type: e.detail
    })
    this.resetPageNum();
  },
  getDataItem() { // 获取列表
    let {pageNum, userNameOrPhone, type} = this.data;
    fetch.post('/getLoLotteryUserInfoList.do',{pageNum, userNameOrPhone, type}, {}, true).then(res => {
      res.data.forEach(item => {
        item.checked = false
      })
      this.setDatas(res)
    }).catch(err => {
      console.log(err)
    })
  },
  handleSearch(e) { // 搜索
    this.setData({
      userNameOrPhone: e.detail.value
    })
    this.resetPageNum();
  },
  onClick(e) {
    let { type } = e.currentTarget.dataset;
    switch(type) {
      case 'send': // 发短信
        this.setData({show: true})
        break;
      case 'close': // 关闭弹窗
        this.setData({
          show: false
        })
        break;
      case 'confrim':
        break;
    }
  },
  onChange(e) { // 勾选信息发生变化
    let { index, type } = e.currentTarget.dataset;
    let { listItem } = this.data;
    if(type == 'all') {
      listItem.forEach(item => {
        item.checked = e.detail
      })
      this.setData({
        checked: e.detail,
        listItem
      })
    } else {
      listItem[index].checked = e.detail
      let checkArr = listItem.filter(item => {return !item.checked})
      this.setData({
        listItem,
        checked: checkArr.length > 0 ? false : true
      });
    }
  },
  handleToPageDetail(e) {
    let {id, merchid, type} = e.currentTarget.dataset
    if(type != 1) {
      wx.navigateTo({
        url: `/pages/user/customerDetail/customerDetail?id=${id}&merchId=${merchid}`
      });
    }
  }
})