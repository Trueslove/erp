import fetch from '../../../utils/serve'
Page({
  mixins: [require('../../../utils/scrollMixin.js')],
  /**
   * 页面的初始数据
   */
  data: {
    info: {},
    show: false, // 是否显示个签删除按钮
    customerShow: false, // 个签相关客户弹窗
    id: '',
    merchantsId: '',
    detailData: {}, // 客户详情信息
    labelItem: [], // 个性标签列表
    showLabel: false, // 个签添加弹窗
    tagName: '', // 标签名称
    activeTagName: '', // 点击的标签名称
    popupItem: [],
    merchLabelItem: [] // 商户标签列表
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      id: options.id,
      merchantsId: options.merchId
    })
    this.getDetailData();
  },
  onClick(e) {
    let { type, address, name, item } = e.currentTarget.dataset;
    switch(type){
      case 'close': // 关闭爱车达人弹窗
        this.setData({ customerShow: false })
        break;
      case 'show': // 打开爱车达人弹窗
        this.setData({
          info: item
        })
        this.resetPageNum(this.getLabelUserData)
        this.setData({ 
          customerShow: true,
          activeTagName: item.tagName
        })
        break;
      case 'tagName': // 选择个性标签
        this.setData({
          tagName: name
        })
        this.getLabelData();
        break;
      case 'map': // 地图详细信息
        wx.navigateTo({
          url: '/pages/map/map?address=' + address
        });
        break;
      case 'label':
        this.setData({// 关闭新增个签弹窗
          showLabel: false
        })
        break;
      case 'add': // 打开新增个签弹窗
        this.resetPageNum(this.getLabelData)
        this.setData({
          showLabel: true
        })
        break;
      case 'send': // 新增个签
        this.handleAdd();
        break;
      case 'detail': // 点击爱车达人列表
        wx.redirectTo({
          url: `/pages/user/customerDetail/customerDetail?id=${item.userId}`
        })
        break;
      default:
        this.setData({
          show: false
        })
    }
  },
  onChange(e) { // 标签信息变化
    this.setData({
      tagName: e.detail
    })
    this.resetPageNum(this.getLabelData)
  },
  handleBindscrolltolowerTag() {
    this.handleBindscrolltolower(this.getLabelData)
  },
  handleBindscrolltolowerUser() {
    this.handleBindscrolltolower(this.getLabelUserData)
  },
  handleLongPress() { // 长按打开删除图标
    this.setData({
      show: true
    })
  },
  handleAdd() { // 添加标签
    let {id, detailData, tagName} = this.data;
    fetch.post('/tagController/addUserTag.do',
      {tagName, merchId: detailData.merchId, userId: id}
    ).then(res => {
      this.getDetailData();
      this.setData({
        showLabel: false
      })
    })
  },
  delLabel(e) { // 删除个性标签列表
    let { item } = e.currentTarget.dataset;
    fetch.post('/tagController/delUserTag.do', item).then(res => {
      this.getDetailData();
    })
  },
  getLabelData() { // 获取个性标签列表
    let { pageNum, tagName } = this.data;
    fetch.post('/tagController/getTagList.do', { tagName, pageNum, pageSize: 20 }, {}, true).then(res => {
      this.setDatas(res, 'popupItem');
    })
  },
  getLabelUserData() { // 获取个性标签用户
    let { pageNum, info } = this.data;
    info.userId = '';
    info.merchId = '';
    info.pageNum = pageNum;
    fetch.post('/tagController/getTagUserList.do', info, {}, true).then(res => {
      this.setDatas(res, 'merchLabelItem');
    })
  },
  getDetailData() { // 获取详情信息
    let {merchantsId, id} = this.data;
    fetch.post('/getLoLotteryUserInfo.do', {merchantsId,userId: id}).then(res => {
      this.setData({
        detailData: res,
        labelItem: res.meUserTagList
      })
    })
  }
})