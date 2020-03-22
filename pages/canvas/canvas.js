// pages/canvas/canvas.js
Page({

  data: {
    title: '标题',
    salary: '500-8000元/月',
    rtype: '日结',
    rmoney: '20元',
    canvasWidth: '', // canvas宽度
    canvasHeight: '', // canvas高度
    imagePath: '', // 分享的图片路径
    leftMargin: 0,
    rightMargin: 0,
    ctx: [1,2,3]
  },

  onShow: function (options) {
    var that = this
    var sysInfo = wx.getSystemInfo({
      success: function (res) {
        that.setData({
          //设置宽高为屏幕宽，高为屏幕高的80%，因为文档比例为5:4
          canvasWidth: res.windowWidth,
          canvasHeight: res.windowHeight * 0.8
        })
        let leftMargin = res.windowWidth * 0.5
        let rightMargin = res.windowHeight * 0.5
          
        that.setData({
          leftMargin, rightMargin
        })
      },
    })
  },

  /**
  * 生命周期函数--监听页面初次渲染完成
  */
  start: function () {
    let that = this
    let ctx = wx.createCanvasContext('myCanvas')
    that.setData({
      ctx: ctx
    })
    console.log('this',that.data.ctx,'111')
    // wx.chooseImage({
    //   success: function(res) {
    //     ctx.drawImage(res.tempFilePaths[0], 0, 0, 300, 300)
    //     ctx.setTextAlign = 'center'
    //     ctx.draw()
    //   }
    // })
    // console.log(ctx)
      this.addImage(ctx)
    // this.tempFilePath()

  },
  //画背景图
  addImage: function (ctx) {
    var context = wx.createContext();
    var that = this;
    var path 
    wx.chooseImage({
      count: '1',
      success(res){
        wx.getImageInfo({
          src: res.tempFilePaths[0],
          success: function (res) {
            console.log(JSON.stringify(res));
            that.setData({
              imgInfo: res
            });
            console.log(JSON.stringify(that.data.imgInfo));
            let imageSize = util.imageZoomHeightUtil(that.data.imgInfo.width, that.data.imgInfo.height);//根据屏幕宽度
            that.setData({ canvasHeight: imageSize.imageHeight });
            console.log('imageSize等比例' + JSON.stringify(imageSize));
            that.makeCanvas(url);
          }
        })



        path = res.tempFilePaths[0]
        ctx.drawImage(path, 0, 0, 30,30,100,100,100,100);
        ctx.draw()
        console.log(that.data.leftMargin, that.data.rightMargin)
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
  addTitle: function (ctx) {
    var str = this.data.title
    ctx.font = 'normal bold 20px sans-serif';
    ctx.setTextAlign('center'); // 文字居中
    ctx.setFillStyle("#222222");
    ctx.fillText(str, this.data.canvasWidth / 2, 65)
  },
  // 画返费方式
  addRtype: function () {
    var str = this.data.rtype
    ctx.setFontSize(16)
    ctx.setFillStyle("#ff4200");
    ctx.setTextAlign('left');
    ctx.fillText(str, leftMargin * 0.35, topMargin * 0.4)
  },
  // 画返费金额
  addRmoney: function () {
    var str = this.data.rmoney
    ctx.setFontSize(16)
    ctx.setFillStyle("#222");
    ctx.setTextAlign('left');
    ctx.fillText(str, leftMargin * 0.35, topMargin * 0.5)
  },
  // 画薪资
  addSalary: function () {
    var str = this.data.salary
    ctx.setFontSize(16)
    ctx.setFillStyle("#222");
    ctx.setTextAlign('left');
    ctx.fillText(str, leftMargin * 0.35, topMargin * 0.61)
  },
  /**
  * 用户点击右上角分享
  */
  onShareAppMessage: function (res) {
    // return eventHandler接收到的分享参数
    return {
      title: this.data.title,
      path: '/pages/test/test',
      imageUrl: this.data.imagePath
    };
  },
  //导出图片
  tempFilePath: function () {
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