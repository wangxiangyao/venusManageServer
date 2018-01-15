import koa from 'koa'
import koaRouter from 'koa-router'
import koaBody from 'koa-bodyparser'
import { graphqlKoa, graphiqlKoa } from 'apollo-server-koa'
import cors from 'koa2-cors'
import configs from './config/index.js'
import schema from './schema'
import api from './OSSAPI/index.js'
import multer from 'koa-multer'

const app = new koa()
const router = new koaRouter()
const storage = multer.memoryStorage()
const uploadImg = multer({storage: storage})

//配置graphql 路由
router.post('/graphql', koaBody(), graphqlKoa({
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
router.post('/api/uploadImg', uploadImg.single('file'), async (ctx, next) => {
  const fileInfo = await api.upload(`/home/image/${ctx.req.file.originalname}`, ctx.req.file.buffer)
  ctx.body = {
    code: 200,
    url: fileInfo.url
  }
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
app.use(router.routes())
app.use(router.allowedMethods())
app.listen(configs.port, () => {
  console.log('listening on port ' + configs.port)
})
