# 功能设置相关

管理各项功能开关的接口，包括点赞功能、图片灯箱预览、评论占位符、域名可见性等。

## 获取功能设置

```
GET /admin/settings/feature
```

获取当前的功能开关配置。

- 方法：`GET`
- 路径：`/admin/settings/feature`
- 鉴权：需要 Bearer Token

**成功响应**

- 状态码：`200`

```json
{
  "enableCommentLike": true,
  "enableArticleLike": true,
  "enableImageLightbox": true,
  "commentPlaceholder": "发表你的看法...",
  "visibleDomains": ["example.com", "blog.example.com"]
}
```

字段说明：

| 字段名               | 类型   | 说明                   |
| -------------------- | ------ | ---------------------- |
| `enableCommentLike`   | boolean | 是否启用评论点赞功能 |
| `enableArticleLike`   | boolean | 是否启用文章点赞功能 |
| `enableImageLightbox` | boolean | 是否启用评论图片灯箱预览功能 |
| `commentPlaceholder`   | string \| null | 评论输入框的占位符文本 |
| `visibleDomains`      | string[] | 允许显示评论组件的域名列表 |

## 更新功能设置

```
PUT /admin/settings/feature
```

更新功能开关配置。

- 方法：`PUT`
- 路径：`/admin/settings/feature`
- 鉴权：需要 Bearer Token

**请求头**

| 名称           | 必填 | 示例               |
| -------------- | ---- | ------------------ |
| `Content-Type` | 是   | `application/json` |
| `Authorization` | 是   | `Bearer <token>` |

**请求体**

```json
{
  "enableCommentLike": true,
  "enableArticleLike": true,
  "enableImageLightbox": true,
  "commentPlaceholder": "发表你的看法...",
  "visibleDomains": ["example.com", "blog.example.com"]
}
```

字段说明：

| 字段名               | 类型    | 必填 | 说明                   |
| -------------------- | ------- | ---- | ---------------------- |
| `enableCommentLike`   | boolean | 否   | 是否启用评论点赞功能 |
| `enableArticleLike`   | boolean | 否   | 是否启用文章点赞功能 |
| `enableImageLightbox` | boolean | 否   | 是否启用评论图片灯箱预览功能 |
| `commentPlaceholder`   | string | 否   | 评论输入框的占位符文本 |
| `visibleDomains`      | string[] | 否   | 允许显示评论组件的域名列表 |

**说明**：

- `enableImageLightbox`：启用后，评论内容中的图片可以点击放大预览
- `commentPlaceholder`：自定义评论输入框的占位符文本，留空则使用默认文本
- `visibleDomains`：设置后，只有在此列表中的域名可以正常显示评论组件，其他域名将被隐藏。留空或为 `null` 表示不限制域名。

**成功响应**

- 状态码：`200`

```json
{
  "message": "保存成功！"
}
```

**错误响应**

- 状态码：`401`

```json
{
  "message": "Unauthorized"
}
```

- 状态码：`500`

```json
{
  "message": "Failed to save feature settings"
}
```
