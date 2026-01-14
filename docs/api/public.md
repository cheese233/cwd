# 公开 API

## 获取评论列表

获取指定页面的评论列表。

### 请求

```http
GET /api/comments?path={path}&page={page}&pageSize={pageSize}
```

### 参数

| 参数     | 类型   | 必填 | 说明              |
| -------- | ------ | ---- | ----------------- |
| path     | string | 是   | 页面路径          |
| page     | number | 否   | 页码，默认 1      |
| pageSize | number | 否   | 每页数量，默认 10 |

### 响应示例

```json
{
  "success": true,
  "data": {
    "comments": [
      {
        "id": 1,
        "path": "/blog/hello-world",
        "author": "张三",
        "email": "zhangsan@example.com",
        "content": "很棒的文章！",
        "parent_id": null,
        "status": "approved",
        "created_at": "2026-01-13T10:00:00Z",
        "avatar": "https://gravatar.com/avatar/..."
      }
    ],
    "total": 1,
    "page": 1,
    "pageSize": 10
  }
}
```

## 提交评论

提交新评论。

### 请求

```http
POST /api/comments
Content-Type: application/json
```

### 请求体

```json
{
  "path": "/blog/hello-world",
  "author": "张三",
  "email": "zhangsan@example.com",
  "content": "很棒的文章！",
  "parent_id": null
}
```

### 参数说明

| 参数      | 类型   | 必填 | 说明                    |
| --------- | ------ | ---- | ----------------------- |
| path      | string | 是   | 页面路径                |
| author    | string | 是   | 评论者昵称              |
| email     | string | 是   | 评论者邮箱              |
| content   | string | 是   | 评论内容                |
| parent_id | number | 否   | 父评论 ID（回复时使用） |

### 响应示例

```json
{
  "success": true,
  "data": {
    "id": 1,
    "message": "评论提交成功，等待审核"
  }
}
```
