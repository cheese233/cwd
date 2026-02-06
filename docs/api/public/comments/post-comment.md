# 提交评论

```
POST /api/comments
```

提交新评论或回复。

- 方法：`POST`
- 路径：`/api/comments`
- 鉴权：不需要

**请求头**

| 名称           | 必填 | 示例                         |
| -------------- | ---- | ---------------------------- |
| `Content-Type` | 是   | `application/json`          |

**请求体（Request Body）**

```json
{
  "post_slug": "https://example.com/blog/hello-world",
  "post_title": "博客标题，可选",
  "post_url": "https://example.com/blog/hello-world",
  "name": "张三",
  "email": "zhangsan@example.com",
  "url": "https://zhangsan.me",
  "content": "很棒的文章！",
  "parent_id": 1,
  "adminToken": "your-admin-key"
}
```

字段说明：

| 字段名       | 类型   | 必填 | 说明                                                                                                          |
| ------------ | ------ | ---- | ------------------------------------------------------------------------------------------------------------- |
| `post_slug`  | string | 是   | 文章唯一标识符，应与前端组件初始化时的 `postSlug` 值一致，`window.location.origin + window.location.pathname` |
| `post_title` | string | 否   | 文章标题，用于邮件通知内容                                                                                    |
| `post_url`   | string | 否   | 文章 URL，用于邮件通知中的跳转链接                                                                            |
| `name`       | string | 是   | 评论者昵称                                                                                                    |
| `email`      | string | 是   | 评论者邮箱，需为合法邮箱格式                                                                                  |
| `url`        | string | 否   | 评论者个人主页或站点地址                                                                                      |
| `content`    | string | 是   | 评论内容，内部会过滤 `<script>...</script>` 片段                                                              |
| `parent_id`  | number | 否   | 父评论 ID，用于回复功能；缺省或 `null` 表示根评论                                                             |
| `adminToken` | string | 否   | 管理员评论密钥，博主发布评论时需要先通过 `/api/verify-admin` 验证密钥后将密钥传入此字段，评论将直接通过且不受审核设置影响 |

**成功响应**

- 状态码：`200`

评论直接通过时：

```json
{
  "message": "评论已提交",
  "status": "approved"
}
```

评论进入待审核状态时（开启"先审核再显示"且非管理员评论）：

```json
{
  "message": "已提交评论，待管理员审核后显示",
  "status": "pending"
}
```

**错误响应**

- 请求体缺失或字段类型错误：

  - 状态码：`400`

  ```json
  {
    "message": "无效的请求体"
  }
  ```

- 缺少必填字段：

  - `post_slug` 为空：

    ```json
    {
      "message": "post_slug 必填"
    }
    ```

  - `content` 为空：

    ```json
    {
      "message": "评论内容不能为空"
    }
    ```

  - `author` 为空：

    ```json
    {
      "message": "昵称不能为空"
    }
    ```

  - `email` 为空或格式不正确：

    ```json
    {
      "message": "邮箱不能为空"
    }
    ```

    或

    ```json
    {
      "message": "邮箱格式不正确"
    }
    ```

- IP 或邮箱被限制：

  - IP 被限制：
    - 状态码：`403`

    ```json
    {
      "message": "当前 IP 已被限制评论，请联系站长进行处理"
    }
    ```

  - 邮箱被限制：
    - 状态码：`403`

    ```json
    {
      "message": "当前邮箱已被限制评论，请联系站长进行处理"
    }
    ```

- 管理员评论验证失败：

  - 未输入密钥：
    - 状态码：`401`

    ```json
    {
      "message": "请输入管理员密钥",
      "requireAuth": true
    }
    ```

  - 密钥错误：
    - 状态码：`401`

    ```json
    {
      "message": "密钥错误"
    }
    ```

  - 验证失败次数过多：
    - 状态码：`403`

    ```json
    {
      "message": "验证失败次数过多，请 30 分钟后再试"
    }
    ```

- 评论频率限制：

  - 状态码：`429`
  - 逻辑：同一 IP 最近一条评论时间在 10 秒内，则拒绝此次请求。

  ```json
  {
    "message": "评论频繁，等 10s 后再试"
  }
  ```

- 服务器内部错误：

  - 状态码：`500`

  ```json
  {
    "message": "Internal Server Error"
  }
  ```
