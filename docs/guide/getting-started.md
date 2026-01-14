# 快速开始

## 简介

CWD 评论系统是一个基于 Cloudflare Workers 的轻量级评论解决方案，使用 Hono 框架构建，数据存储使用 Cloudflare D1（SQLite）和 KV。

## 特性

- ⚡️ **极速响应**：基于 Cloudflare 全球边缘网络
- 🔒 **安全可靠**：内置管理员认证、CORS 保护
- 📧 **邮件通知**：支持 Resend 邮件服务
- 🎨 **易于集成**：提供完整的 REST API

## 前置要求

- Node.js 16+
- Cloudflare 账号
- Wrangler CLI

## 安装

```bash
# 克隆项目
git clone https://github.com/anghunk/cwd-comments
cd cwd-comments

# 安装依赖
npm install
```

## 配置

- [后端配置](./backend-config.md)
- [前端配置](./frontend-config.md)
