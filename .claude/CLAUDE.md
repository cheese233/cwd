# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

这是一个基于 Cloudflare Workers 的轻量级评论系统后端（Momo Backend Worker），使用 Hono 框架构建，数据存储使用 Cloudflare D1（SQLite）和 KV。

## 常用命令

```bash
# 开发
npm run dev          # 本地开发服务器
npm run deploy       # 部署到 Cloudflare Workers

# 测试
npm run test         # 运行 Vitest 测试

# 类型生成
npm run cf-typegen   # 生成 Cloudflare Workers 类型定义

# 数据库操作
npm wrangler d1 execute CWD_DB --remote --file=./schemas/comment.sql  # 初始化数据库表
```

## 架构概览

```
src/
├── index.ts          # 应用入口，路由定义
├── bindings.ts       # TypeScript 类型定义（Env 绑定）
├── api/
│   ├── admin/        # 管理员 API（需认证）
│   │   ├── login.ts, listComments.ts, deleteComment.ts, updateStatus.ts
│   └── public/       # 公开 API
│       ├── getComments.ts, postComment.ts
├── utils/
│   ├── auth.ts       # 管理员认证中间件
│   ├── cors.ts       # CORS 配置
│   ├── email.ts      # Resend 邮件通知
│   └── getAvatar.ts  # Gravatar 头像生成
└── views/
    └── html.ts       # 管理后台 HTML 页面（内嵌 Vue 3）
```

## API 路由

| 方法 | 路径 | 功能 | 认证 |
|------|------|------|------|
| GET | `/` | 管理后台页面 | 否 |
| GET | `/api/comments` | 获取评论列表 | 否 |
| POST | `/api/comments` | 提交评论 | 否 |
| POST | `/admin/login` | 管理员登录 | 否 |
| GET | `/admin/comments/list` | 评论管理列表 | Bearer Token |
| PUT | `/admin/comments/status` | 更新评论状态 | Bearer Token |
| DELETE | `/admin/comments/delete` | 删除评论 | Bearer Token |

## 关键绑定

- `CWD_DB`: D1 数据库绑定
- `CWD_AUTH_KV`: KV 存储（用于认证 Token）

## 环境变量

| 变量名 | 说明 | 必填 |
|--------|------|------|
| `ADMIN_NAME` | 管理员用户名 | 是 |
| `ADMIN_PASSWORD` | 管理员密码 | 是 |
| `ALLOW_ORIGIN` | CORS 白名单（逗号分隔） | 是 |
| `RESEND_API_KEY` | Resend API 密钥 | 否 |
| `RESEND_FROM_EMAIL` | 发件邮箱 | 否 |
| `EMAIL_ADDRESS` | 站长接收邮箱 | 否 |

## 本地开发

1. 复制 `.dev.vars.example` 为 `.dev.vars` 并配置环境变量
2. 运行 `npm run dev` 启动本地开发服务器
