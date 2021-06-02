import { formLatLng } from "../../utils/map"
Page({
  data: {
    markers: [],
    polyline: [
    {
      color: '#398BFB',
      points: [],
      width: 6
    }],
    address: ''
  },
  onLoad(options) {
    this.setData(
      {address: options.address}
    )
    this.init()
  },
  init() {
    let points, newAddress;
    let { address } = this.data;
    let promise = Promise.all([new Promise(function(resolve, reject) {
      wx.getStorage({
        key: 'addressInfo',
        success: (res)=>{
          resolve(res.data.location)
          newAddress = res.data.location;
        }
      });
    }), new Promise(function(resolve, reject) {
      formLatLng(address, (res) => {
        points = [
          {
            "latitude": newAddress.lat,
            "longitude": newAddress.lng
          }, {
            "latitude": res.lat,
            "longitude": res.lng
          }
        ]
        resolve(points)
      })
    })])
    promise.then(res => {
      const mapCtx = wx.createMapContext('map', this)
      mapCtx.includePoints({
        points
      })
      this.setData({
        'polyline[0].points':points,
        markers: [{
          latitude: points[0].latitude, 
          longitude: points[0].longitude,
          id: 20,
          rotate: 90,
          iconPath: '',
          width: 30,
          height: 30,
          anchor : {
            x: 0.5,
            y: 0.4
          }
        }]
      })
      mapCtx.moveAlong({
        markerId: 20,
        autoRotate: true,
        path: points,
        duration: 3000,
      })
    }).catch(err => {
      console.log(err);
    });
  }
})
