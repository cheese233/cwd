import { html } from 'hono/html';

export const AdminView = html`
	<!DOCTYPE html>
	<html lang="zh-CN">
		<head>
			<meta charset="UTF-8" />
			<meta name="viewport" content="width=device-width, initial-scale=1.0" />
			<title>CWD 评论后台管理系统</title>
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
				.loader {
					border-top-color: #3498db;
					animation: spinner 1.5s linear infinite;
				}
				@keyframes spinner {
					0% {
						transform: rotate(0deg);
					}
					100% {
						transform: rotate(360deg);
					}
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
						<a href="/admin" class="flex items-center px-4 py-3 rounded-lg mb-2 bg-blue-50 text-blue-600 transition">
							<i class="fa-solid fa-comments w-5"></i>
							<span class="ml-3">评论管理</span>
						</a>
						<a href="/admin/settings" class="flex items-center px-4 py-3 rounded-lg mb-2 text-gray-600 hover:bg-gray-50 transition">
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
					<div class="flex justify-between items-center mb-6">
						<h2 class="text-2xl font-bold text-gray-700">评论管理</h2>
						<button @click="fetchComments(pagination.page)" class="text-gray-600 hover:text-blue-600">
							<i class="fa-solid fa-rotate-right mr-1"></i> 刷新
						</button>
					</div>
					<div v-if="loading && comments.length === 0" class="flex justify-center items-center h-64">
						<div class="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12"></div>
					</div>

					<div v-else class="bg-white shadow overflow-hidden sm:rounded-lg">
						<div class="overflow-x-auto">
							<table class="min-w-full divide-y divide-gray-200">
								<thead class="bg-gray-50">
									<tr>
										<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">信息</th>
										<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/2">内容</th>
										<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">状态</th>
										<th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
									</tr>
								</thead>
								<tbody class="bg-white divide-y divide-gray-200">
									<tr v-if="comments.length === 0">
										<td colspan="4" class="px-6 py-10 text-center text-gray-500">暂无评论数据</td>
									</tr>
									<tr v-for="comment in comments" :key="comment.id" class="hover:bg-gray-50 transition">
										<td class="px-6 py-4 whitespace-nowrap">
											<div class="flex items-center">
												<div>
													<div>
														<span class="text-sm font-medium text-gray-900" v-text="comment.author"></span>
														<span class="text-sm text-gray-500"> (<em class="text-xs" v-text="comment.email"></em>)</span>
													</div>
													<a class="text-xs text-blue-500 hover:underline" :href="comment.url">{{ comment.url }}</a>
													<div class="text-xs text-gray-400 mt-1">IP: <em v-text="comment.ipAddress"></em></div>
													<div class="text-xs text-gray-400">{{ formatDate(comment.pubDate) }}</div>
												</div>
											</div>
										</td>
										<td class="px-6 py-4">
											<div
												class="text-sm text-gray-900 break-words whitespace-pre-wrap max-h-32 overflow-y-auto"
												v-text="comment.contentText"
											></div>
											<a
												v-if="comment.postSlug"
												:href="config.blogDomain + comment.postSlug"
												target="_blank"
												class="text-xs text-blue-500 hover:underline mt-1 inline-block"
											>
												{{ config.blogDomain + comment.postSlug }}
											</a>
										</td>
										<td class="px-6 py-4 whitespace-nowrap">
											<span
												class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
												:class="{
                                          'bg-green-100 text-green-800': comment.status === 'approved',
                                          'bg-yellow-100 text-yellow-800': comment.status === 'pending',
                                          'bg-red-100 text-red-800': ['spam', 'rejected', 'deleted'].includes(comment.status)
                                      }"
											>
												{{ comment.status }}
											</span>
										</td>
										<td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
											<button
												v-if="comment.status !== 'approved'"
												@click="updateStatus(comment.id, 'approved')"
												class="text-green-600 hover:text-green-900 mr-3"
											>
												<i class="fa-solid fa-check mr-1"></i>显示
											</button>
											<button
												v-if="comment.status === 'approved'"
												@click="updateStatus(comment.id, 'pending')"
												class="text-yellow-600 hover:text-yellow-900 mr-3"
											>
												<i class="fa-solid fa-ban mr-1"></i>隐藏
											</button>
											<button @click="confirmDelete(comment.id)" class="text-red-600 hover:text-red-900">
												<i class="fa-solid fa-trash mr-1"></i>删除
											</button>
										</td>
									</tr>
								</tbody>
							</table>
						</div>

						<!-- 分页 -->
						<div class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
							<div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
								<div>
									<p class="text-sm text-gray-700">
										第 <span class="font-medium">{{ pagination.page }}</span> 页， 共
										<span class="font-medium">{{ pagination.total }}</span> 页
									</p>
								</div>
								<div>
									<nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
										<button
											@click="changePage(pagination.page - 1)"
											:disabled="pagination.page === 1"
											class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
										>
											上一页
										</button>
										<button
											@click="changePage(pagination.page + 1)"
											:disabled="pagination.page >= pagination.total"
											class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
										>
											下一页
										</button>
									</nav>
								</div>
							</div>
						</div>
					</div>
				</main>
			</div>

			<script>
				const { createApp, reactive, toRefs, onMounted } = Vue;

				createApp({
					setup() {
						const state = reactive({
							loading: false,
							apiKey: '',
							config: {
								baseUrl: localStorage.getItem('apiBaseUrl') || location.origin,
								blogDomain: localStorage.getItem('blogDomain') || '',
							},
							comments: [],
							pagination: { page: 1, limit: 20, total: 1 },
							toast: { show: false, message: '', type: 'success' },
						});

						const showToast = (msg, type = 'success') => {
							state.toast.message = msg;
							state.toast.type = type;
							state.toast.show = true;
							setTimeout(() => (state.toast.show = false), 3000);
						};

						const formatDate = (dateString) => {
							if (!dateString) return '';
							return new Date(dateString).toLocaleString('zh-CN', { hour12: false });
						};

						const fetchComments = async (page = 1) => {
							state.loading = true;
							state.comments = [];
							try {
								const url = \`\${state.config.baseUrl}/admin/comments/list?page=\${page}\`;
								const response = await fetch(url, {
									headers: { Authorization: state.apiKey },
								});
								const result = await response.json();

								if (result.message === 'Invalid key' || result.status === 401) {
									logout();
									return;
								}

								state.comments = result.data || [];
								state.pagination = result.pagination || { page, limit: 10, total: 1 };
								showToast('刷新成功');
							} catch (error) {
								console.error(error);
								showToast('获取数据失败', 'error');
							} finally {
								state.loading = false;
							}
						};

						const updateStatus = async (id, newStatus) => {
							state.loading = true;
							try {
								const url = \`\${state.config.baseUrl}/admin/comments/status?id=\${id}&status=\${newStatus}\`;
								const response = await fetch(url, {
									method: 'PUT',
									headers: { Authorization: state.apiKey },
								});
								if (response.ok) {
									const comment = state.comments.find((c) => c.id === id);
									if (comment) comment.status = newStatus;
									showToast('状态更新成功');
								} else {
									showToast('更新失败', 'error');
								}
							} catch (error) {
								showToast('请求失败', 'error');
							} finally {
								state.loading = false;
							}
						};

						const confirmDelete = async (id) => {
							if (!confirm('确定删除？')) return;
							state.loading = true;
							try {
								const url = \`\${state.config.baseUrl}/admin/comments/delete?id=\${id}\`;
								const response = await fetch(url, {
									method: 'DELETE',
									headers: { Authorization: state.apiKey },
								});
								if (response.ok) {
									showToast('删除成功');
									fetchComments(state.pagination.page);
								} else {
									showToast('删除失败', 'error');
								}
							} catch (error) {
								showToast('请求失败', 'error');
							} finally {
								state.loading = false;
							}
						};

						const changePage = (page) => {
							if (page > 0) fetchComments(page);
						};

						const logout = () => {
							localStorage.removeItem('adminKey');
							window.location.href = '/login';
						};

						onMounted(() => {
							const storedKey = localStorage.getItem('adminKey');
							if (!storedKey) {
								window.location.href = '/login';
								return;
							}
							state.apiKey = storedKey;
							fetchComments();
						});

						return {
							...toRefs(state),
							fetchComments,
							updateStatus,
							confirmDelete,
							changePage,
							logout,
							formatDate,
						};
					},
				}).mount('#app');
			</script>
		</body>
	</html>
`;
