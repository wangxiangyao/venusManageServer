import fs from 'mz/fs'
import path from 'path'
import mime from 'mime'

// url：定义的静态资源接口，比如'/static/'，'/public/'等
// dir：接口文件夹的绝对路径
function staticFiles(url, dir) {
	return async(ctx, next) => {
		let reqPath = ctx.request.path;
		// 取到请求路径

		//判断是否为静态接口
		if (reqPath.startsWith(url)) {
			let fp = path.join(dir, reqPath.substring(url.length));
			// 同步获取文件状态
			let fileStats = fs.statSync(fp);
			ctx.response.type = mime.getType(reqPath);
			try {
				// 利用last-modify判断是否缓存
				if (ctx.request.header['if-modified-since'] && Date(ctx.request.header['if-modified-since']) === Date(fileStats.mtime)) {
					ctx.status = 304
					return
				}
				ctx.lastModified = fileStats.mtime

				// chrome 必须设置Cache-Control字段，才能自动返回if-modified-since字段。
				// 否则，即使设置了last-modified也不会返回
				ctx.set('Cache-Control', 'max-age=0')
				ctx.body = await fs.readFile(fp);
			} catch (e) {
				ctx.response.status = 404;
				// 返回404页面，后边再添加
			}
		} else {
			// 不是指定的接口，继续下一个
			await next();
		}
	}
}

module.exports = staticFiles;
