// pages/canvas/canvas.js
Page({

  data: {
    title: '标题',
    salary: '500-8000元/月',
    canvasWidth: '', // canvas宽度
    canvasHeight: '', // canvas高度
    imagePath: '', // 分享的图片路径
    leftMargin: 0,
    topMargin: 0,
    imgInfo: {},
    ctx: [1, 2, 3],
    imgProportion: 0.6, // 图片占canvas画布宽度百分比, 不建议随意修改
    imgToTop: 100 // 图片到canvas顶部的距离
  },
  onLoad: function(options) {
    var that = this
    var sysInfo = wx.getSystemInfo({
      success: function(res) {
        that.setData({
          canvasWidth: res.windowWidth,
          canvasHeight: res.windowHeight * 0.8
        })
        let leftMargin = (res.windowWidth * (1 - that.data.imgProportion)) / 2
        that.setData({
          leftMargin
        })
      }
    })
  },
  start: function() {
    let that = this
    let ctx = wx.createCanvasContext('myCanvas')
    that.setData({
      ctx: ctx
    })
    this.addImage(ctx)
    // this.tempFilePath()
  },
  //画背景图
  addImage: function(ctx) {
    var context = wx.createContext();
    var that = this;
    let imgInfo = that.data.imgInfo
    var path
    wx.chooseImage({
      count: '1',
      success(res) {
        wx.getImageInfo({
          src: res.tempFilePaths[0],
          success: function(response) {
            console.log(JSON.stringify(response));
            that.setData({
              imgInfo: response
            });
            path = res.tempFilePaths[0]
            let imgWidth = that.data.canvasWidth * that.data.imgProportion
            let imgHeight = response.height / response.width * imgWidth
            console.log('imgwidth', imgWidth, 'imgHeight', imgHeight)
            let height = that.data.canvasWidth * imgInfo.width
            ctx.drawImage(path, 0, 0, response.width, response.height, that.data.leftMargin, that.data.imgToTop, imgWidth, imgHeight)
            ctx.draw()
            // that.makeCanvas(url);
          }
        })
      }
    })

    //将模板图片绘制到canvas,在开发工具中drawImage()函数有问题，不显示图片
    //不知道是什么原因，手机环境能正常显示

    this.addTitle(ctx)
    // this.addRtype()
    // this.addRmoney()
    // this.addSalary()
    // ctx.draw()
  },
  //画标题
  addTitle: function(ctx) {
    var str = this.data.title
    ctx.font = 'normal bold 20px sans-serif';
    ctx.setTextAlign('center'); // 文字居中
    ctx.setFillStyle("#222222");
    ctx.fillText(str, this.data.canvasWidth / 2, 65)
  },
  // 画返费方式
  addRtype: function() {
    var str = this.data.rtype
    ctx.setFontSize(16)
    ctx.setFillStyle("#ff4200");
    ctx.setTextAlign('left');
    ctx.fillText(str, leftMargin * 0.35, topMargin * 0.4)
  },
  // 画返费金额
  addRmoney: function() {
    var str = this.data.rmoney
    ctx.setFontSize(16)
    ctx.setFillStyle("#222");
    ctx.setTextAlign('left');
    ctx.fillText(str, leftMargin * 0.35, topMargin * 0.5)
  },
  // 画薪资
  addSalary: function() {
    var str = this.data.salary
    ctx.setFontSize(16)
    ctx.setFillStyle("#222");
    ctx.setTextAlign('left');
    ctx.fillText(str, leftMargin * 0.35, topMargin * 0.61)
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function(res) {
    // return eventHandler接收到的分享参数
    return {
      title: this.data.title,
      path: '/pages/test/test',
      imageUrl: this.data.imagePath
    };
  },
  //导出图片
  tempFilePath: function() {
    let that = this;
    wx.canvasToTempFilePath({
      canvasId: 'myCanvas',
      success: function success(res) {
        wx.saveFile({
          tempFilePath: res.tempFilePath,
          success: function success(res) {
            that.setData({
              imagePath: res.savedFilePath
            });
          }
        });
      }
    });
  },
})