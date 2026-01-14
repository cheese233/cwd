# CWDComments 配置参数

## 前端 Widget 配置

在初始化 `CWDComments` 实例时，可以传入以下配置参数：

```javascript
const comments = new CWDComments({
  el: '#comments',
  apiBaseUrl: 'https://your-api.example.com',
  postSlug: 'my-post',
  postTitle: '文章标题',
  postUrl: 'https://example.com/my-post',
  theme: 'light',
  pageSize: 20,
  avatarPrefix: 'https://gravatar.com/avatar',
  adminEmail: 'admin@example.com',
  adminBadge: '博主'
});
comments.mount();
```

### 参数说明

| 参数           | 类型                    | 必填 | 默认值                        | 说明                      |
| -------------- | ----------------------- | ---- | ----------------------------- | ------------------------- |
| `el`           | `string \| HTMLElement` | 是   | -                             | 挂载元素选择器或 DOM 元素 |
| `apiBaseUrl`   | `string`                | 是   | -                             | API 基础地址              |
| `postSlug`     | `string`                | 是   | -                             | 文章唯一标识符            |
| `postTitle`    | `string`                | 否   | -                             | 文章标题，用于邮件通知    |
| `postUrl`      | `string`                | 否   | -                             | 文章 URL，用于邮件通知    |
| `theme`        | `'light' \| 'dark'`     | 否   | `'light'`                     | 主题模式                  |
| `pageSize`     | `number`                | 否   | `20`                          | 每页显示评论数            |
| `avatarPrefix` | `string`                | 否   | `https://gravatar.com/avatar` | 头像服务前缀              |
| `adminEmail`   | `string`                | 否   | -                             | 博主邮箱，用于显示博主标识 |
| `adminBadge`   | `string`                | 否   | `博主`                        | 博主标识文字              |

### 头像服务前缀示例

常用的 Gravatar 镜像服务：

| 服务            | 前缀地址                         |
| --------------- | -------------------------------- |
| Gravatar 官方   | `https://gravatar.com/avatar`    |
| Cravatar (国内) | `https://gravatar.com/avatar`    |
| 自定义镜像      | `https://your-mirror.com/avatar` |

## 后端环境变量

在 Cloudflare Workers 中配置以下环境变量：

| 变量名              | 说明                            | 必填 |
| ------------------- | ------------------------------- | ---- |
| `ADMIN_NAME`        | 管理员用户名                    | 是   |
| `ADMIN_PASSWORD`    | 管理员密码                      | 是   |
| `ALLOW_ORIGIN`      | CORS 白名单（逗号分隔多个域名） | 是   |
| `RESEND_API_KEY`    | Resend 邮件服务 API 密钥        | 否   |
| `RESEND_FROM_EMAIL` | 发件邮箱地址                    | 否   |
| `EMAIL_ADDRESS`     | 站长接收通知的邮箱              | 否   |

## 实例方法

| 方法                   | 说明                           |
| ---------------------- | ------------------------------ |
| `mount()`              | 挂载组件到 DOM                 |
| `unmount()`            | 卸载组件                       |
| `updateConfig(config)` | 更新配置（支持动态切换主题等） |
| `getConfig()`          | 获取当前配置                   |

### 示例

```javascript
// 动态切换主题
comments.updateConfig({ theme: 'dark' });

// 切换文章
comments.updateConfig({ postSlug: 'another-post' });
```
