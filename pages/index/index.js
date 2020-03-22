//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
  },
  upload() {
    var tempFilePaths
    wx.chooseImage({
      sizeType: ['compressed'],
      success: (res) => {
        tempFilePaths = res.tempFilePaths

        this.change(tempFilePaths)
        console.log(tempFilePaths)
      }
    })
    let n = 1
    let idd = setInterval(function () {
      console.log(n++)
      n = n++
    }, 1000)
  },
  change(tempFilePaths) {
    let arr = []
    for (let index = 0; index < tempFilePaths.length; index++) {
      let tempimage = tempFilePaths[index]
      wx.getFileSystemManager().readFile({
        filePath: tempimage,
        encoding: "base64",
        success: (data) => {
          let base = 'data:image/jpg;base64,' + data.data
          console.log('base', base)
          arr.push(base)
          console.log(arr)
          // clearInterval(idd)
        }
      })
    }
  }
})
