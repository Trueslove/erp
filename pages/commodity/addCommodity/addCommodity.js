import fetch from '../../../utils/serve'
import {
  uploadOne,
  uploadMore
} from "../../../utils/upload"
var common = require("../../../utils/throttle.js")
Page({
  mixins: [require('../../../utils/scrollMixin.js')],
  /**
   * 页面的初始数据
   */
  data: {
    getInfo: [], // 当前所操作的弹窗参数
    pageData:{
      goodsImg: '', // 商品图片
      goodsName: '', // 商品描述
      goodsCost: '', // 商品价值
      categoryCode: '', // 商品类目
      goodsType: '', // 商品类型
      goodsTypeName: '',
      categoryName: '', // 商品类目
      subsidyAmt: '', // 补贴金额
      payPrice: '', // 支付金额
      convertType: '', // 兑换方式
      convertName: '', // 兑换方式
      convertCycleType: '', // 兑换周期
      cycleUnitName: '', // 兑换周期
      merchCode: '', // 核销商家
      merchName: '', // 核销商家
      merchId: '',
      drainageCode: '', // 引流商家
      drainageName: '', // 引流商家
      divideInto: '', // 引流佣金
      doGoodsDetailList: '' // 图文详情
    },
    goodsImgfileList: [], // 商品图片展示
    twFileList: [],
    show: false,
    showType: false,
    merchItem: [],
    typeItem: [], // 分类
    listItem: [], // 兑换方式选择数据
    clickType: [], // 点击选择框类型
    typeShow: false, // 分类弹窗
    typeItemSave: {}, // 保存分类数据
    typeItemValueSave: {}, // 保存分类数据值
    prentId: '',
    version: '',
    isInactive: '',
    jumpType: null // 上一页按钮类型
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options.id) {
      this.setData({
        prentId: options.id,
        version: options.version,
        isInactive: options.isInactive,
        jumpType: options.type
      })
      this.getDetail(options.id)
      wx.setNavigationBarTitle({
        title: options.type == 'see' ? '商品详情' : '编辑商品'
      })
    }
  },
  onChange(event) {
    const { picker, value } = event.detail;
    picker.setColumnValues(1, this.data.typeItemSave[value[0]]);
  },
  onClick(e) {
    let { type, value } = e.currentTarget.dataset;
    if(this.data.jumpType == 'see') return;
    this.setData({'clickType': [value, type]})
    switch(type) {
      case 'categoryCode': // 类目
        this.setData({
          getInfo: ['/getCategoryList.do', 'getCategoryList']
        })
        this.getColumnItem();
        break;
      case 'convertType': // 兑换方式
        this.setData({
          listItem: [{name: '线上', value: '1'},{name: '线下', value: '2'}],
          showType: true
        })
        break;
      case 'convertCycleType': // 兑换周期 
        this.setData({
          getInfo: ['/getDoCycleUnitList.do', 'cycleUnitName', 'cycleUnitType']
        })
        this.resetPageNum();
        break;
      case 'merchCode': // 核销商家
          this.setData({
            getInfo: ['/getMerchantsInfoList.do', 'merchName', 'merchId']
          })
          this.resetPageNum();
        break;
      case 'drainageCode': // 引流商家
        this.setData({
          getInfo: ['/getMerchantsInfoList.do', 'merchName', 'merchId']
        })
        this.resetPageNum();
        break;
      case 'goodsType': // 商品类型
        this.setData({
          listItem: [{name: '平台扶持', value: '0'},{name: '引流商家', value: '1'}],
          showType: true
        })
        break;
    }
  },
  //关闭弹窗
  onClose(){
    this.setData({
      show:false
    })
  },
  handleCancel() { // 关闭弹窗
    this.setData({
      show: false,
      showType: false
    })
  },
  handleChangeInput(e) { // 输入框发生变化
    let { key } = e.currentTarget.dataset;
    let keys = `pageData.${key}`;
    this.setData({
      [keys]: e.detail.value
    })
  },
  handleRelease() { // 发布商品按钮
    let { prentId, version, isInactive, pageData, twFileList } = this.data;
    let {goodsType, drainageName, divideInto} = this.data.pageData;
    let verifyItem = ['goodsImg', 'categoryCode', 'goodsName', 'subsidyAmt', 'payPrice', 'convertName', 'cycleUnitName', 'merchName', 'goodsTypeName']
    if(twFileList.length == 0 || (goodsType == 1 && (!drainageName || !divideInto))) {
      wx.showToast({
        title: '请将必填项补充完整',
        icon: 'none',
        duration: 2000
      })
      return false;
    }
    for(let i = 0; i < verifyItem.length; i++) {
      if(!this.data.pageData[verifyItem[i]]) {
        wx.showToast({
          title: '请将必填项补充完整',
          icon: 'none',
          duration: 2000
        })
        return false;
      }
    }
    let params = Object.assign(pageData, isInactive);
    let twImgArr = [];
    twFileList.forEach((item, index) => {
      twImgArr.push({
        detailImg: item.url,
        imgOrder: index
      })
    })
    pageData.doGoodsDetailList = twImgArr;
    prentId ? Object.assign(params, {goodsId: prentId, version}) : params
    common.throttleFunc(
      fetch.post('/addOrEditGoodsInfo.do', params).then((res) => {
          wx.redirectTo({
            url: '/pages/commodity/commodity'
          });
      }).catch((res) => {
      }), 2000)
  },
  handleSelect(e) { // 选择框发生变化
    let {clickType} = this.data;
    let {info} = e.currentTarget.dataset;
    let name = `pageData.${clickType[0]}`;
    let value = `pageData.${clickType[1]}`;
    this.setData({
      [name]: !!info ? info.name : e.detail.name,
      [value]: !!info ? info.value : e.detail.value,
      show: false,
      showType: false,
      listItem: [],
      pageNum: 1
    })
  },
  onCancel() {// 分类列表选择弹窗隐藏
    this.setData({
      'typeShow': false
    })
  },
  onConfirm(e) { // 分类列表选择确定
    let { typeItemValueSave } = this.data;
    let {index, value} = e.detail
    let keys = Object.keys(typeItemValueSave)[index[0]];
    let childKeys = typeItemValueSave[keys][index[1]]
    this.setData({
      'pageData.categoryName': value[1],
      'pageData.categoryCode': childKeys || keys,
      'typeShow': false
    })
  },
  getDataItem() { // 获取
    let {pageNum, getInfo} = this.data;
    this.setData({saveSelect: [getInfo[1], getInfo[2]]})
    fetch.post(getInfo[0], {pageNum}, {}, true).then((res) => {
      let arr = [];
      res.data.forEach(item => {
        arr.push({name: item[getInfo[1]], value: item[getInfo[2]]})
      })
      this.setDatas({data: arr, total: res.total});
      this.setData({
        'show': true
      })
    }).catch((res) => {
      console.log(res)
    })
  },
  getColumnItem() {
    fetch.post('/getCategoryList.do').then((res) => {
      let obj = {};
      let objValue = {};
      res.forEach(item => {
        let county_list = [];
        let county_listValue = [];
        item.list.forEach(childItem => {
          county_listValue.push(childItem.categoryCode)
          county_list.push(childItem.categoryName)
        })
        Object.assign(obj, {[item.categoryName]: county_list})
        Object.assign(objValue, {[item.categoryCode]: county_listValue})
      })
      this.setData({
        typeItemValueSave: objValue,
        typeItemSave: obj,
        typeItem: [ {
          values: Object.keys(obj),
          className: 'column1',
        },
        {
          values: obj[res[0].categoryName],
          className: 'column2',
          defaultIndex: 2,
        }],
        typeShow: true
      })
    }).catch((res) => {
      console.log(res)
    })
  },
  getDetail(id) { // 获取详情
    fetch.post('/getGoodsInfoById.do', {id}, {'content-type': 'application/x-www-form-urlencoded'}).then((res) => {
      res.convertName = res.convertType == 1 ? '线上' : '线下';
      res.goodsTypeName = res.goodsType == 1 ? '引流商家' : '平台扶持';
      let twItem = res.doGoodsDetailList;
      twItem.forEach(item => {
        item.url = item.detailImg
      })
      this.setData({
        goodsImgfileList: [{url: res.goodsImg}],
        twFileList: twItem,
        pageData: res
      })
    }).catch(err => {
      console.log(err)
    })
  },
  handleUploaderDelete(e) { // 删除图片
    let { key, keyimg } = e.currentTarget.dataset;
    if(this.data.jumpType == 'see') return;
    if(key == 'twFileList') { // 多图片删除
      let { index } = e.detail;
      let {twFileList} = this.data;
      twFileList.splice(index, 1);
      this.setData({
        [key]: twFileList,
        
      })
    } else {
      let keys = `pageData.${key}`;
      let keyimgs = `pageData.${keyimg}`;
      this.setData({
        [keys]: [],
        [keyimgs]: ''
      })
    }
  },
  afterReadMore(e) { // 多图片上传
    if(this.data.jumpType == 'see') return;
    let { key } = e.currentTarget.dataset;
    uploadMore(e, (data) => {
      let fileKey = []
      data.forEach((item) => {
        fileKey.push({url: item})
      })
      this.setData({
        [key]: fileKey
      });
    })
  },
  afterRead(e) {// 图片上传
    let { key, keyimg } = e.currentTarget.dataset;
    let keyimgs = `pageData.${keyimg}`;
    uploadOne(e, (data) => {
      this.setData({
        [key]: [{
          url: data
        }],
        [keyimgs]: data
      });
    })
  }
})