// pages/withdrawal/withdrawalDetail/withdrawalDetail.js
import fetch from '../../../utils/serve'
import { format } from '../../../utils/formatDate'
var common = require("../../../utils/throttle.js")
Page({
  /**
   * 页面的初始数据
   */
  data: {
    dataInfo: {},
    applyId: '',
    id: '', // 商家id
    version: '', // 版本号
    dismissReason: '', // 驳回原因
    show: false, // 是否显示弹窗
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options, '999999999999')
    this.setData({
      id: options.id,
      version: options.version,
      applyId: options.applyId
    })
    this.getDataDetail();
  },
  handleInputChange(e) {
    this.setData({
      dismissReason: e.detail.value
    })
  },
  handleClickBtn(e) { // 底部三按钮
    let {type} = e.currentTarget.dataset
    let {dismissReason, version, id, applyId} = this.data;
    switch(type) {
      case '0': // 查看流水
          wx.navigateTo({
            url: `/pages/flowingWater/flowDetail/flowDetail`
          });
        break;
      case '1': // 驳回
          this.setData({show: true})
        break;
      case '2': // 通过
        this.apiChangeStatus({version, applyId, auditStatus: 1})
      break;
      case '3': // 取消，关闭
        this.setData({
          show: false,
        })
      break;
      case '4': // 确认驳回
        this.apiChangeStatus({dismissReason, version, applyId, auditStatus: 2})
      break;
    }
  },
  apiChangeStatus(params) { // 通过， 驳回
    common.throttleFunc(
      fetch.post('/changeMerchantsAmtStatus.do', 
        params).then((res)=>{
        this.setData({
          show: false,
        })
      }).catch((res)=>{
        console.log(res)
      }), 2000)
  },
  getDataDetail() { // 获取详情
    let {applyId} = this.data;
    fetch.post('/getMerchantsAmtById.do', 
      {id: applyId},
      {'content-type': 'application/x-www-form-urlencoded'}).then((res)=>{
      let dataInfo = res;
      dataInfo.changeDate = format(dataInfo.auditDate);
      this.setData({
        dataInfo: res
      })
    }).catch((res)=>{
      console.log(res)
    })
  }
})