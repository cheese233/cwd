# 获取评论列表

```
GET /api/comments
```

获取指定文章的评论列表，支持分页和嵌套结构。

- 方法：`GET`
- 路径：`/api/comments`
- 鉴权：不需要

**查询参数**

| 名称        | 位置  | 类型    | 必填 | 说明                                                                                         |
| ----------- | ----- | ------- | ---- | -------------------------------------------------------------------------------------------- |
| `post_slug` | query | string  | 是   | 使用 `window.location.origin + window`location.pathname`，获取带域名的链接，否则后台无法识别 |
| `page`      | query | integer | 否   | 页码，默认 `1`                                                                               |
| `limit`     | query | integer | 否   | 每页数量，默认 `20`，最大 `50`                                                               |
| `nested`    | query | string  | 否   | 是否返回嵌套结构，默认 `'true'`                                                              |

**成功响应**

- 状态码：`200`

```json
{
  "data": [
    {
      "id": 1,
      "author": "张三",
      "email": "zhangsan@example.com",
      "url": "https://example.com",
      "contentText": "很棒的文章！",
      "contentHtml": "很棒的文章！",
      "pubDate": "2026-01-13T10:00:00Z",
      "postSlug": "/blog/hello-world",
      "avatar": "https://gravatar.com/avatar/...",
      "priority": 2,
      "likes": 5,
      "replies": [
        {
          "id": 2,
          "author": "李四",
          "email": "lisi@example.com",
          "url": null,
          "contentText": "同感！",
          "contentHtml": "同感！",
          "pubDate": "2026-01-13T11:00:00Z",
          "postSlug": "/blog/hello-world",
          "avatar": "https://gravatar.com/avatar/...",
          "parentId": 1,
          "replyToAuthor": "张三",
          "priority": 1,
          "likes": 2
        }
      ]
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 1,
    "totalCount": 2
  }
}
```

说明：

- 当 `nested=true`（默认）时，接口返回的是"根评论列表"，每条根评论包含其 `replies`。
- 当 `nested=false` 时，接口返回扁平列表，所有评论都在 `data` 中，`replies` 为空。
- `priority` 字段：评论的置顶权重，数值越大排序越靠前。
- `likes` 字段：评论的点赞数，默认为 0。

**错误响应**

- 缺少 `post_slug`：

  - 状态码：`400`

  ```json
  {
    "message": "post_slug is required"
  }
  ```

- 服务器内部错误：

  - 状态码：`500`

  ```json
  {
    "message": "错误信息"
  }
  ```
