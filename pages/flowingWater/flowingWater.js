// pages/flowingWater/flowingWater.js
import fetch from '../../utils/serve'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    headerItem:[],
    dataList: [],
    beginTime: null,
    endTime: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    this.setData({
      beginTime: this.getThreeMonths(),
      endTime: Date.parse(new Date())
    })
    this.getDataHeader();
  },
  getDataHeader() { // 获取流水表头列表
    let {beginTime, endTime} = this.data;
    fetch.post('/meMerchants/getAllMeMerchantsFlowMonth.do', {endTime, beginTime}).then(res => {
      this.setData({
        headerItem: res
      })
      this.getDataItem();
    })
  },
  getDataItem() { // 获取流水列表
    let {beginTime, endTime, headerItem} = this.data;
    fetch.post('/meMerchants/getAllMeMerchantsFlow.do', {endTime, beginTime}).then(res => {
      let parentObj = {};
      headerItem.forEach(item => {
        let obj = {}
        obj[item.month] = item;
        obj[item.month].list = [];
        Object.assign(parentObj, obj)
      })
      res.forEach(item => {
        parentObj[item.month].list.push(item)
      })
      this.setData({
        dataList: Object.values(parentObj)
      })
    })
  },
  getThreeMonths () {
    let timeOne = new Date()
    let year = timeOne.getFullYear()
    let month = timeOne.getMonth() + 1
    let day = timeOne.getDate()
    let hours = timeOne.getHours()
    let minutes = timeOne.getMinutes()
    let seconds = timeOne.getSeconds()

    // console.log(`现在的时间是:${year}-${month}-${day} ${hours}:${minutes}:${seconds}`)

    // 计算3个月后的月份
    let ThreeMonths = month - 3

    // 如果小于 0 说明是去年
    if (ThreeMonths <= 0) {
      year = year - 1
    }

    // 如果 等于 -2 说明当前月是 1 月份 所以三个月前是去年 10月
    if (ThreeMonths === -2) {
      ThreeMonths = 10
    }

    // 如果 等于 -1 说明当前月是 2 月份 所以三个月前是去年 11月
    if (ThreeMonths === -1) {
      ThreeMonths = 11
    }

    // 如果 等于 0 说明当前月是 3 月份 所以三个月前是去年 12月
    if (ThreeMonths === 0) {
      ThreeMonths = 12
    }

    // 获取当前的时间的日期字符串
    // **如果天数的值为零，则默认返回当前月份的最后一天
    let timeTow = new Date(year, ThreeMonths, 0, hours, minutes, seconds)

    // 获取三个月前的最后一天
    let ThreeMonthsDay = timeTow.getDate()

    // 获取三个月前的小时数
    let ThreeMonthsHour = timeTow.getHours() < 10 ? '0' + timeTow.getHours() : timeTow.getHours()

    // 获取三个月前的分钟数
    let ThreeMonthsMinutes = timeTow.getMinutes() < 10 ? '0' + timeTow.getMinutes() : timeTow.getMinutes()

    // 获取三个月前的秒数
    let ThreeMonthsSeconds = timeTow.getSeconds() < 10 ? '0' + timeTow.getSeconds() : timeTow.getSeconds()

    // 判断如果当前月份的天数大于三个月前的天数时，则当前天数等于三个月前的天数
    if (day > ThreeMonthsDay) {
      day = ThreeMonthsDay
    }

    day = day < 10 ? '0' + day : day

    // console.log(`三个月前的时间是:${year}-${ThreeMonths}-${day} ${ThreeMonthsHour}:${ThreeMonthsMinutes}:${ThreeMonthsSeconds}`)

    // 格式化时间
    const THREE_MONTHS_AGO = `${year}/${ThreeMonths}/${day} ${ThreeMonthsHour}:${ThreeMonthsMinutes}:${ThreeMonthsSeconds}`

    // 生成时间戳
    const THREE_STAMP = new Date(THREE_MONTHS_AGO).getTime()

    return THREE_STAMP
  },
  handleToPageDetail(e) {
    let {merchid, info} = e.currentTarget.dataset
    wx.navigateTo({
      url: `/pages/flowingWater/flowDetail/flowDetail?merchid=${merchid}&month=${info.month}&subsidyAmt=${info.subsidyAmt}&withdrawAmt=${info.withdrawAmt}`
    })
  }
})