import path from 'path'
import OSS from 'ali-oss'
import co from 'co'

const store = OSS({
  region: 'oss-cn-shanghai',
  accessKeyId: 'LTAItBIHvnTYlSQx',
  accessKeySecret: 'UwMNsjvZEGhMUR7jyszXyaG5AelzCX',
  bucket: 'venus-resource'
})

export default {
  // TODO: 1.上传文件 2.上传图片 3.删除图片 4.更新文件 5.获取文件
  getFile (path) {
    return co(function*() {
      return yield store.get(path)
    })
    .catch((err) => {
      console.log(err)
    })
  },
  upload (path, data) {
    return co(function* () {
      return yield store.put(path, data)
    })
  },
  deleteFile (path) {
    return co(function* () {
      return yield store.delete(path)
    })
  }
}
