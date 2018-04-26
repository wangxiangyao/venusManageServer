import fs from 'fs'
import path from 'path'
import https from 'https'
import http from 'http'
import koa from 'koa'
import koaParser from 'koa-bodyparser'
import koaBody from 'koa-body'
import koaRouter from 'koa-router'

import { graphqlKoa, graphiqlKoa } from 'apollo-server-koa'
import cors from 'koa2-cors'
import jsSHA from 'jssha'
import configs from './config/index.js'
import schema from './schema'
import api from './OSSAPI/index.js'
import multer from 'koa-multer'
import staticFiles from './staticServer.js'

const app = new koa()
const router = new koaRouter()
const storage = multer.memoryStorage()
const uploadImg = multer({storage: storage})
const _staticDir = path.resolve('./views')

//配置graphql 路由
router.post('/graphql', koaParser(), graphqlKoa({
  schema: schema,
  formatParams: (params) => {
    // if (params.query.includes('mutation')) {
    //   params.query = params.query.split('__typename\n').join('')
    // }
    return params
  }
}));
router.get('/graphql', graphqlKoa({ schema: schema }));
router.get('/graphiql', graphiqlKoa({ endpointURL: '/graphql' }));

// 除了graphql以外的请求
router.post('/api/oldHome', koaParser(), async (ctx, next) => {
  const data = ctx.request.body
  const result = await api.upload(`home/json/main.json`, Buffer.from(JSON.stringify(data)))
  if (result.res.status == 200) {
    ctx.status = 200
    ctx.body = {
      code: 200,
      message: '成功'
    }
  }
})
router.get('/api/addPageView', async (ctx, next) => {
  // 70%几率+1，20%几率+2，5%+5 3%+10 2%+100
  console.log('有浏览')
  const articleBuffer = await api.getFile(`home/article/${ctx.request.query.id}.json`)
  var articleObj = JSON.parse(articleBuffer.content.toString('utf8'))
  const random = Math.random()
  var add = 0
  if (random < 0.7) {
    add = 0
  } else if (random < 0.9) {
    add = 1
  } else if (random < 0.95) {
    add = 4
  } else if (random < 0.98) {
    add = 9
  } else {
    add = 99
  }
  if (articleObj.pageView) {
    articleObj.pageView++
    articleObj.extra += add
  } else {
    articleObj.pageView = 1
    articleObj.extra = add
  }
  console.log(articleObj)
  const result = await api.upload(`home/article/${articleObj.id}.json`, Buffer.from(JSON.stringify(articleObj)))
  if (result.res.status === 200) {
    ctx.body = articleObj
  } else {
    ctx.body = {
      code: 'error',
      message: '没有做判断'
    }
  }
})
router.get('/api/brands', async (ctx, next) => {
  console.log('请求品牌')
  const brands = await new Promise((resolve, reject) => {
    http.get('http://app.starluxe.cn/api/commodity/brand', (res) => {
      console.log('已经发送请求')
      const { statusCode } = res;
      let data = ''
      if (statusCode !== 200) {
        res.resume()
        reject()
      }
      res.setEncoding('utf8');
      res.on('data', (chunk) => {
        data += chunk
        console.log('每一部分结束')
      })
      res.on('end', () => {
        console.log('end事件')
        try {
          const parsedData = JSON.parse(data);
          resolve(parsedData)
        } catch (e) {
          reject(e.message)
        }
      })
    })
  })
  console.log('拿到品牌：', brands)
  ctx.body = brands
})

router.post('/api/uploadImg', uploadImg.single('file'), async (ctx, next) => {
  const fileInfo = await api.upload(`/home/image/${ctx.req.file.originalname}`, ctx.req.file.buffer)
  ctx.body = {
    code: 200,
    url: fileInfo.url
  }
})
router.post('/api/deleteImg', koaParser(), async (ctx, next) => {
  const imgName = ctx.request.body.name
  const result = await api.deleteFile(`/home/image/${imgName}`)
  if (result.res.status == 204) {
    ctx.body = {
      code: 200,
      message: '删除成功'
    }
  }
})
router.get('/', async (ctx, next) => {
  var indexPath = path.join(_staticDir, '/index.html');
  ctx.response.body = fs.readFileSync(indexPath, 'utf-8');
})

router.get('/wxConfig', async (ctx, next) => {
  // 一个参数：url
  /* 返回值：
  {
    appId: '',
    timestamp: ,
    nonceStr: '',
    signature: ''
  }
  */
  var resultOfAccessToken, resultOfJsapiTicket, result = {}, calcSignature1
  var nonceStr1 = nonceStr(),
    timeStamp1 = timeStamp(),
    appid = 'wx5e7fc035524cd8e6',
    secret = '577b5cc4f5aae9b14c9dec7ce77efddf'

  function nonceStr () {
    return Math.random().toString(36).substr(2, 15);
  }
  function timeStamp () {
    return parseInt(new Date().getTime() / 1000) + '';
  }
  function calcSignature (ticket, nonceStr, timeStamp, url) {
      var result = {
          jsapi_ticket: ticket,
          nonceStr: nonceStr,
          timestamp: timeStamp,
          url: url,
      }
      var str = 'jsapi_ticket=' + ticket + '&noncestr=' + nonceStr + '&timestamp=' + timeStamp + '&url=' + url;
      // 对str使用sha1签名，得到signature，这里使用jsSHA模块，需install
      shaObj = new jsSHA(str, 'TEXT');
      return shaObj.getHash('SHA-1', 'HEX');
  }
  resultOfAccessToken = await new Promise((resolve, reject) => {
    https.get(`https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${appid}&secret=${secret}`, (res) => {
      const { statusCode }  = res
      let error;
      if (statusCode !== 200) {
        error = new Error('请求失败。\n' +
                          `状态码: ${statusCode}`);
      }
      if (error) {
        console.error(error.message);
        // 消耗响应数据以释放内存
        res.resume();
        reject({
          code: statusCode,
          message: error.message
        })
      }

      res.setEncoding('utf8');
      let rawData = '';
      res.on('data', (chunk) => { rawData += chunk; });
      res.on('end', () => {
        try {
          const parsedData = JSON.parse(rawData);
          console.log('请求内容：', parsedData);
          resolve(parsedData)
        } catch (e) {
          reject(e.message);
        }
      })
    })
  })
  if (resultOfAccessToken.access_token) {
    resultOfJsapiTicket = await new Promise((resolve, reject) => {
      https.get(`https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=${resultOfAccessToken.access_token}&type=jsapi`, (res) => {
        const { statusCode }  = res
        let error;
        if (statusCode !== 200) {
          error = new Error('请求失败。\n' +
                            `状态码: ${statusCode}`);
        }
        if (error) {
          console.error(error.message);
          // 消耗响应数据以释放内存
          res.resume();
          reject({
            code: statusCode,
            message: error.message
          })
        }

        res.setEncoding('utf8');
        let rawData = '';
        res.on('data', (chunk) => { rawData += chunk; });
        res.on('end', () => {
          try {
            const parsedData = JSON.parse(rawData);
            console.log('请求内容：', parsedData);
            resolve(parsedData)
          } catch (e) {
            reject(e.message);
          }
        })
      })
    })
    if (resultOfJsapiTicket.ticket) {
      calcSignature1 = calcSignature(resultOfJsapiTicket.ticket, nonceStr1, timeStamp1, ctx.query.url)
      result = {
        appId: appid,
        timestamp: timeStamp1,
        nonceStr: nonceStr1,
        signature: calcSignature1,
      }
    } else {
      result = resultOfJsapiTicket
    }
  } else {
    result = resultOfAccessToken
  }
  ctx.body = result
})

// 配置cors请求头
app.use(cors({
  origin: function(ctx) {
    // return 'http://localhost:' + configs.port
    return '*'
  },
  exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'],
  maxAge: 5,
  credentials: true,
  allowMethods: ['GET', 'POST', 'DELETE', 'PUT', 'HEAD', 'PATCH'],
  allowHeaders: ['Content-Type', 'Authorization', 'Accept']
}))

app.use(staticFiles('/static/', path.join(__dirname, './views/static')))

app.use(router.routes())
app.use(router.allowedMethods())
app.listen(configs.port, () => {
  console.log('listening on port ' + configs.port)
})
