# cwd 评论前端模板

## 使用方法

```html
<!-- 评论组件容器 -->
<div id="comments"></div>

<script src="dist/cwd-comments.js"></script>

<script>
  new CWDComments({
    el: '#comments', // 容器 ID
    apiBaseUrl: 'https://message.zishu.me', // 部署的后端地址
    postSlug: '/message', // 当前页面路径，可使用博客程序支持的 url 模板路径
  }).mount();
</script>
```