import { html } from 'hono/html';

export const SettingsView = html`
	<!DOCTYPE html>
	<html lang="zh-CN">
		<head>
			<meta charset="UTF-8" />
			<meta name="viewport" content="width=device-width, initial-scale=1.0" />
			<title>设置 - CWD 评论后台</title>
			<script src="https://cdn.tailwindcss.com"></script>
			<script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>
			<link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet" />
			<style>
				body {
					font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
				}
				.fade-enter-active,
				.fade-leave-active {
					transition: opacity 0.3s;
				}
				.fade-enter-from,
				.fade-leave-to {
					opacity: 0;
				}
				aside {
					height: 100vh;
					overflow-y: auto;
					position: sticky;
					top: 0;
				}
			</style>
		</head>
		<body class="bg-gray-100 text-gray-800">
			<div id="app" class="min-h-screen flex">
				<!-- Toast -->
				<transition name="fade">
					<div
						v-if="toast.show"
						:class="toast.type === 'error' ? 'bg-red-500' : 'bg-green-500'"
						class="fixed top-4 right-4 text-white px-6 py-3 rounded shadow-lg z-50 flex items-center"
					>
						<i :class="toast.type === 'error' ? 'fa-circle-exclamation' : 'fa-check-circle'" class="fa-solid mr-2"></i>
						{{ toast.message }}
					</div>
				</transition>

				<!-- 侧边栏 -->
				<aside class="w-64 bg-white shadow-lg flex flex-col min-h-screen">
					<div class="p-4 border-b">
						<h1 class="text-xl font-bold text-blue-600">CWD 评论系统</h1>
						<p class="text-xs text-gray-400 mt-1 truncate">{{ config.baseUrl }}</p>
					</div>
					<nav class="flex-1 p-4">
						<a href="/admin" class="flex items-center px-4 py-3 rounded-lg mb-2 text-gray-600 hover:bg-gray-50 transition">
							<i class="fa-solid fa-comments w-5"></i>
							<span class="ml-3">评论管理</span>
						</a>
						<a href="/admin/settings" class="flex items-center px-4 py-3 rounded-lg mb-2 bg-blue-50 text-blue-600 transition">
							<i class="fa-solid fa-gear w-5"></i>
							<span class="ml-3">设置</span>
						</a>
					</nav>
					<div class="p-4 border-t">
						<button @click="logout" class="flex items-center w-full px-4 py-3 rounded-lg text-red-500 hover:bg-red-50 transition">
							<i class="fa-solid fa-sign-out-alt w-5"></i>
							<span class="ml-3">退出登录</span>
						</button>
					</div>
				</aside>

				<!-- 主内容 -->
				<main class="flex-1 p-8 overflow-auto">
					<h2 class="text-2xl font-bold text-gray-700 mb-6">设置</h2>
					<div class="bg-white shadow rounded-lg p-6 max-w-xl">
						<div class="mb-6">
							<label class="block text-gray-700 text-sm font-bold mb-2">博客域名前缀</label>
							<input
								v-model="settingsForm.blogDomain"
								type="text"
								placeholder="例如: https://example.com"
								class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
							/>
							<p class="text-xs text-gray-500 mt-1">设置后，文章链接将自动拼接此前缀</p>
						</div>
					</div>
					<div class="flex justify-end mt-4">
						<button @click="saveSettings" class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">确认保存</button>
					</div>
				</main>
			</div>

			<script>
				const { createApp, reactive, toRefs, onMounted } = Vue;

				createApp({
					setup() {
						const state = reactive({
							config: { baseUrl: localStorage.getItem('apiBaseUrl') || location.origin },
							settingsForm: { blogDomain: localStorage.getItem('blogDomain') || '' },
							toast: { show: false, message: '', type: 'success' },
						});

						const showToast = (msg, type = 'success') => {
							state.toast = { show: true, message: msg, type };
							setTimeout(() => (state.toast.show = false), 3000);
						};

						const logout = () => {
							localStorage.removeItem('adminKey');
							window.location.href = '/login';
						};

						const saveSettings = () => {
							localStorage.setItem('blogDomain', state.settingsForm.blogDomain);
							showToast('设置已保存');
						};

						onMounted(() => {
							if (!localStorage.getItem('adminKey')) {
								window.location.href = '/login';
							}
						});

						return { ...toRefs(state), logout, saveSettings };
					},
				}).mount('#app');
			</script>
		</body>
	</html>
`;
