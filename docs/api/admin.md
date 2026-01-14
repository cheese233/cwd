# 管理员 API

所有管理员 API 都需要在请求头中携带 Bearer Token：

```http
Authorization: Bearer <token>
```

## 管理员登录

获取管理员 Token。

### 请求

```http
POST /admin/login
Content-Type: application/json
```

### 请求体

```json
{
  "username": "admin",
  "password": "your_password"
}
```

### 响应示例

```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 604800
  }
}
```

## 获取评论管理列表

获取所有评论列表（包括待审核的评论）。

### 请求

```http
GET /admin/comments/list?page={page}&pageSize={pageSize}&status={status}
Authorization: Bearer <token>
```

### 参数

| 参数     | 类型   | 必填 | 说明                                |
| -------- | ------ | ---- | ----------------------------------- |
| page     | number | 否   | 页码，默认 1                        |
| pageSize | number | 否   | 每页数量，默认 20                   |
| status   | string | 否   | 状态筛选：pending/approved/rejected |

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
        "status": "pending",
        "created_at": "2026-01-13T10:00:00Z"
      }
    ],
    "total": 1,
    "page": 1,
    "pageSize": 20
  }
}
```

## 更新评论状态

审核评论，更新评论状态。

### 请求

```http
PUT /admin/comments/status
Authorization: Bearer <token>
Content-Type: application/json
```

### 请求体

```json
{
  "id": 1,
  "status": "approved"
}
```

### 参数说明

| 参数   | 类型   | 必填 | 说明                                     |
| ------ | ------ | ---- | ---------------------------------------- |
| id     | number | 是   | 评论 ID                                  |
| status | string | 是   | 状态：approved（通过）/ rejected（拒绝） |

### 响应示例

```json
{
  "success": true,
  "data": {
    "message": "评论状态已更新"
  }
}
```

## 删除评论

删除指定评论。

### 请求

```http
DELETE /admin/comments/delete?id={id}
Authorization: Bearer <token>
```

### 参数

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| id | number | 是 | 评论 ID |

### 响应示例

```json
{
  "success": true,
  "data": {
    "message": "评论已删除"
  }
}
```
