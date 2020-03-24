// pages/canvas/canvas.js
Page({
  data: {
    title: 'canvas绘制图片',
    canvasWidth: '', // canvas宽度
    canvasHeight: '', // canvas高度
    imagePath: '', // 分享的图片路径
    leftMargin: 0,
    topMargin: 0,
    imgInfo: {},
    ctx: [1, 2, 3],
    canvasImage: '',
    previewImage: false,
    imgProportion: 0.8, // 图片占canvas画布宽度百分比, 不建议随意修改
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
    ctx.setFillStyle('#f8f8f8')
    ctx.fillRect(0, 0, that.data.canvasWidth, that.data.canvasHeight)
    that.setData({
      ctx: ctx
    })
    this.addImage(ctx)
  },
  // 选择图片
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
            that.setData({
              imgInfo: response,
              path: res.tempFilePaths[0]
            })
            // that.makeCanvas(url);
            that.drawImage(ctx)
          }
        })
      }
    })
    this.addTitle(ctx)
  },
  // 绘制图片
  drawImage(ctx) {
    let that = this
    let imgInfo = that.data.imgInfo
    let path = that.data.path
    let imgWidth = that.data.canvasWidth * that.data.imgProportion
    let imgHeight = imgInfo.height / imgInfo.width * imgWidth
    ctx.drawImage(path, 0, 0, imgInfo.width, imgInfo.height, that.data.leftMargin, that.data.imgToTop, imgWidth, imgHeight)
    ctx.draw()
    that.data.previewImage = true
  },
  //画标题
  addTitle: function(ctx) {
    var str = this.data.title
    ctx.font = 'normal bold 16px sans-serif';
    ctx.setTextAlign('center'); // 文字居中
    ctx.setFillStyle("#222222");
    ctx.fillText(str, this.data.canvasWidth / 2, 45)
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function(res) {
    // return eventHandler接收到的分享参数
    console.log('fengxinagshijian')
    console.log('share', this.data.path, this.data.title)
    return {
      title: this.data.title,
      path: '/pages/canvas/canvas',
      imageUrl: this.data.path
    };
  },
  //点击下载按钮保存canvas图片
  downloadCanvas: function() {
    let that = this;
    if (that.data.previewImage) {
      wx.canvasToTempFilePath({
        x: 0,
        y: 0,
        width: that.canvasWidth,
        height: that.canvasWidth,
        destWidth: that.canvasWidth,
        destHeight: that.canvasHeight,
        canvasId: 'myCanvas',
        success: function success(res) {
          wx.saveImageToPhotosAlbum({
            filePath: res.tempFilePath,
            success(res) {
              console.log(res, '保存')
            }
          })
        }
      });
    } else {
      wx.showToast({
        title: '请先选择图片',
        image: '../../static/img/error.png'
      })
    }
  },
  // 分享图片
  share() {
    let that = this
    if (that.data.previewImage) {

    wx.canvasToTempFilePath({
      x: 0,
      y: 0,
      width: that.canvasWidth,
      height: that.canvasWidth,
      destWidth: that.canvasWidth,
      destHeight: that.canvasHeight,
      canvasId: 'myCanvas',
      success: function success(res) {
          wx.showToast({
            icon: 'none',
            title: '长按图片分享',
            duration: 1500
          })
          setTimeout(
            () => {
              wx.previewImage({
                urls: [res.tempFilePath]
              })
            }, 1000)
      }
    })
    } else {
      wx.showToast({
        title: '请先选择图片',
        image: '../../static/img/error.png'
      })
    }
  },
  saveImg() {
    let that = this;
    // 获取用户是否开启用户授权相册
    wx.getSetting({
      success(res) {
        // 如果没有则获取授权
        if (!res.authSetting['scope.writePhotosAlbum']) {
          wx.authorize({
            scope: 'scope.writePhotosAlbum',
            success() {
              wx.saveImageToPhotosAlbum({
                filePath: that.data.shareImg,
                success() {
                  wx.showToast({
                    title: '保存成功'
                  })
                },
                fail() {
                  wx.showToast({
                    title: '保存失败',
                    icon: 'none'
                  })
                }
              })
            },
            fail() {
              // 如果用户拒绝过或没有授权，则再次打开授权窗口
              //（ps：微信api又改了现在只能通过button才能打开授权设置，以前通过openSet就可打开，下面有打开授权的button弹窗代码）
              that.setData({
                openSet: true
              })
            }
          })
        } else {
          // 有则直接保存
          wx.saveImageToPhotosAlbum({
            filePath: that.data.shareImg,
            success() {
              wx.showToast({
                title: '保存成功'
              })
            },
            fail() {
              wx.showToast({
                title: '保存失败',
                icon: 'none'
              })
            }
          })
        }
      }
    })
  }
})