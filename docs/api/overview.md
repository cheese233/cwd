# API 概览

## 基础信息

- **Base URL**: `https://your-worker.workers.dev`
- **数据格式**: JSON
- **字符编码**: UTF-8

## 认证方式

管理员 API 需要使用 Bearer Token 认证：

```http
Authorization: Bearer <token>
```

Token 通过登录接口获取，有效期为 24 小时。

## 响应格式

### 成功响应

```json
{
  "success": true,
  "data": { ... }
}
```

### 错误响应

```json
{
  "success": false,
  "error": "错误信息"
}
```

## HTTP 状态码

| 状态码 | 说明         |
| ------ | ------------ |
| 200    | 请求成功     |
| 400    | 请求参数错误 |
| 401    | 未授权       |
| 403    | 禁止访问     |
| 404    | 资源不存在   |
| 500    | 服务器错误   |
