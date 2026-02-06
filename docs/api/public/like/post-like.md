# 点赞文章

```
POST /api/like
```

对当前页面执行点赞操作，同一用户对同一页面只会计入一次点赞。

- 方法：`POST`
- 路径：`/api/like`
- 鉴权：不需要

**请求头**

| 名称              | 必填 | 示例                          | 说明                           |
| ----------------- | ---- | ----------------------------- | ------------------------------ |
| `ContentC-Type`    | 是   | `application/json`           |                                |
| `X-CWD-Like-User` | 否   | `550e8400-e29b-41d4-a716...` | 前端生成的匿名用户标识，用于区分不同用户 |

**请求体**

```json
{
  "postSlug": "https://example.com/blog/hello-world",
  "postTitle": "博客标题，可选",
  "postUrl": "https://example.com/blog/hello-world"
}
```

字段说明：

| 字段名      | 类型   | 必填 | 说明                                                                 |
| ----------- | ------ | ---- | -------------------------------------------------------------------- |
| `postSlug`  | string | 是   | 页面唯一标识符，应与评论接口中的 `post_slug` 一致                   |
| `postTitle` | string | 否   | 页面标题，用于点赞统计中显示                                       |
| `postUrl`   | string | 否   | 页面 URL，用于点赞统计中跳转                                       |

**成功响应**

- 状态码：`200`

```json
{
  "liked": true,
  "alreadyLiked": false,
  "totalLikes": 13
}
```

说明：

- 第一次点赞：`liked=true`，`alreadyLiked=false`，`totalLikes` 增加 1；
- 重复点赞：服务器不会重复插入记录，`alreadyLiked=true`，`totalLikes` 不会继续增加。

**错误响应**

- 缺少 `postSlug`：

  - 状态码：`400`

  ```json
  {
    "message": "postSlug is required"
  }
  ```

- 服务器内部错误：

  - 状态码：`500`

  ```json
  {
    "message": "点赞失败"
  }
  ```
