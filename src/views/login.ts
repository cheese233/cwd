import { html } from "hono/html";

export const LoginView = html`
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>登录 - CWD 评论后台</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; }
        .loader { border-top-color: #3498db; animation: spinner 1.5s linear infinite; }
        @keyframes spinner { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
    </style>
</head>
<body class="bg-gray-100 text-gray-800">

<div id="app" class="min-h-screen flex items-center justify-center px-4">
    <div class="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 class="text-2xl font-bold mb-6 text-center text-gray-700">管理员登录</h2>
        <form @submit.prevent="handleLogin">
            <div class="mb-4">
                <label class="block text-gray-700 text-sm font-bold mb-2">接口地址</label>
                <input v-model="config.baseUrl" type="text" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500">
            </div>
            <div class="mb-4">
                <label class="block text-gray-700 text-sm font-bold mb-2">用户名</label>
                <input v-model="loginForm.name" type="text" required class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500">
            </div>
            <div class="mb-6">
                <label class="block text-gray-700 text-sm font-bold mb-2">密码</label>
                <input v-model="loginForm.password" type="password" required class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500">
            </div>
            <button :disabled="loading" type="submit" class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none transition duration-300 flex justify-center items-center">
                <span v-if="loading" class="loader ease-linear rounded-full border-2 border-t-2 border-gray-200 h-5 w-5 mr-2"></span>
                {{ loading ? '登录中...' : '登录' }}
            </button>
        </form>
        <p v-if="error" class="mt-4 text-red-500 text-sm text-center">{{ error }}</p>
    </div>
</div>

<script>
    const { createApp, reactive, toRefs, onMounted } = Vue;

    createApp({
        setup() {
            const state = reactive({
                loading: false,
                error: '',
                config: {
                    baseUrl: localStorage.getItem('apiBaseUrl') || location.origin
                },
                loginForm: { name: '', password: '' }
            });

            const handleLogin = async () => {
                state.loading = true;
                state.error = '';
                localStorage.setItem('apiBaseUrl', state.config.baseUrl);

                try {
                    const response = await fetch(\`\${state.config.baseUrl}/admin/login\`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(state.loginForm)
                    });
                    const resData = await response.json();
                    const key = resData.key || (resData.data && resData.data.key);

                    if (key) {
                        localStorage.setItem('adminKey', key);
                        window.location.href = '/admin';
                    } else {
                        state.error = resData.message || '登录失败';
                    }
                } catch (error) {
                    state.error = '网络错误';
                } finally {
                    state.loading = false;
                }
            };

            onMounted(() => {
                const storedKey = localStorage.getItem('adminKey');
                if (storedKey) {
                    window.location.href = '/admin';
                }
            });

            return { ...toRefs(state), handleLogin };
        }
    }).mount('#app');
</script>
</body>
</html>
`;
