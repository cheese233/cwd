import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { Bindings } from './bindings';
import { customCors } from './utils/cors';
import { adminAuth } from './utils/auth';

import { getComments } from './api/public/getComments';
import { postComment } from './api/public/postComment';
import { adminLogin } from './api/admin/login';
import { deleteComment } from './api/admin/deleteComment';
import { listComments } from './api/admin/listComments';
import { updateStatus } from './api/admin/updateStatus';
import { getAdminEmail } from './api/admin/getAdminEmail';
import { setAdminEmail } from './api/admin/setAdminEmail';

const app = new Hono<{ Bindings: Bindings }>();
const VERSION = 'v0.0.1';

app.use('*', async (c, next) => {
	console.log('Request:start', {
		method: c.req.method,
		path: c.req.path,
		url: c.req.url,
		hasDb: !!c.env.CWD_DB,
		hasAuthKv: !!c.env.CWD_AUTH_KV
	});
	const res = await next();
	console.log('Request:end', {
		method: c.req.method,
		path: c.req.path
	});
	return res;
});

app.use('/api/*', async (c, next) => {
	const corsMiddleware = customCors(c.env.ALLOW_ORIGIN);
	return corsMiddleware(c, next);
});
app.use('/admin/*', async (c, next) => {
	const corsMiddleware = customCors(c.env.ALLOW_ORIGIN);
	return corsMiddleware(c, next);
});

app.get('/', (c) => {
	return c.html(
		`CWD 评论部署成功，当前版本 ${VERSION}，<a href="https://github.com/anghunk/cwd-comments" target="_blank" rel="noreferrer">查看文档</a>`
	);
});

app.get('/api/comments', getComments);
app.post('/api/comments', postComment);

app.post('/admin/login', adminLogin);
app.use('/admin/*', adminAuth);
app.delete('/admin/comments/delete', deleteComment);
app.get('/admin/comments/list', listComments);
app.put('/admin/comments/status', updateStatus);
// 设置接口
app.get('/admin/settings/email', getAdminEmail);
app.put('/admin/settings/email', setAdminEmail);

export default app;
