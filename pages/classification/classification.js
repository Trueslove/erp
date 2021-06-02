import fetch from '../../utils/serve'
var common = require("../../utils/throttle.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    selected: [], // // 这里表示列表项是否展开，默认初始时此数组的元素全为fasle，表示都没展开
    active: null, // 当前展开的项的index值
    listDatas: [], // 分类列表
    operation: null, // 要删除的index
    show: false, // 弹窗显示状态
    showTxt: '添加分类', // 添加分类弹框文案
    addValue: '', // 添加分类内容
    type: '', // 添加的类型 child：子分类  parent：分类
    info: {}, // 子分类信息
    parentinfo: {}, // 父类信息 
    beforeClose(action) {
      return new Promise((resolve) => {
         setTimeout(() => {
           if (action === 'confirm') {
             resolve(false);
           } else {
             // 拦截取消操作
             resolve(false);
           }
         }, 1000);
       });
     }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getTypeList();
  },
  getTypeList() { // 获取分类列表
    fetch.post('/getCategoryList.do').then((res)=>{
      this.setData({
        listDatas: res,
        operation: null
      })
    }).catch((res)=>{
      console.log(res)
    })
  },
  onClose() { // 关闭弹窗
    this.setData({ show: false, addValue: '' });
  },
  handleChangeInput(e) {
    this.setData({
      addValue: e.detail.value
    })
  },
  handleDelete(e) { // 删除
    let {info, type, parentinfo} = this.data;
    let { childreninfo } = e.currentTarget.dataset;
    let parmse = {
      version: type == 'child' ? childreninfo.version : parentinfo.version,
      categoryCode: info.categoryCode,
      isInactive: 2 
    };
    type == 'child' ?  Object.assign(parmse, {parentCode: parentinfo.categoryCode}) : parmse;
    fetch.post('/changeCategoryStatus.do', parmse).then((res)=>{
      this.showToast('删除成功');
      this.getTypeList();
    }).catch((res)=>{
      console.log(res)
    })
  },
  handleRename() { // 重命名
    let { type, info } = this.data;
    this.setData({
      showTxt: type == 'child' ? '修改子分类' : '修改分类',
      show: true,
      addValue: info.categoryName
    })
  },
  handleConfirm() { // 添加分类确认按钮
    let { type, info, addValue, showTxt } = this.data;
    if(!addValue) {
      wx.showToast({
        title: '请填写分类内容',
        icon: 'none',
        duration: 1000
      })
      return false;
    }
    let parmse = {categoryName: addValue};
    type == 'child' ?  Object.assign(parmse, {parentCode: info.categoryCode}) : parmse;
    if(showTxt == '修改子分类' || showTxt == '修改分类') {
      Object.assign(parmse, {
        version: info.version,
        categoryCode: info.categoryCode,
        categoryTreeCode: info.categoryTreeCode,
        isInactive: info.isInactive
      })
    }
    common.throttleFunc(fetch.post('/addOrEditCategory.do', parmse).then((res)=>{
      this.showToast('操作成功');
      this.setData({
        show: false,
        addValue: ''
      })
      this.getTypeList();
    }).catch((res)=>{
      console.log(res)
    }), 2000)
  },
  handleAddClass (e) { // 打开添加分类弹窗
    let { type, info } = e.currentTarget.dataset;
    this.setData({
      showTxt: type == 'child' ? '添加子分类' : '添加分类',
      show: true,
      type: type,
      info: info || {},
      operation: null
    })
  },
  showToast(text) {
    wx.showToast({
      title: text,
      icon: 'success'
    })
  },
  // 点击列表,收缩与展示
  onListClick(event) {
    let index = event.currentTarget.dataset.index;
    let active = this.data.active;
    this.setData({
      [`selected[${index}]`]: !this.data.selected[`${index}`],
      active: index,
      operation: null
    });
    // 如果点击的不是当前展开的项，则关闭当前展开的项
    // 这里就实现了点击一项，隐藏另一项
    if (active !== null && active !== index) {
      this.setData({
        [`selected[${active}]`]: false
      });
    }
  },
  handleClickIcon(event) { // 点击更多按钮
    let {info, type, parentinfo} = event.currentTarget.dataset;
    this.setData({
      info,
      type,
      parentinfo,
      operation: info.categoryCode
    });
  }
})