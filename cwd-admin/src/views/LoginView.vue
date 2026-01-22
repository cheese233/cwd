<template>
  <div class="login-page">
    <div class="login-card">
      <h1 class="login-title">CWD 评论后台</h1>
      <p class="login-subtitle">简洁的自托管评论系统管理面板</p>
      <form class="login-form" @submit.prevent="handleSubmit">
        <div class="form-item">
          <label class="form-label">API 地址</label>
          <input v-model="apiBaseUrl" class="form-input" type="text" />
        </div>
        <div class="form-item">
          <label class="form-label">管理员账号</label>
          <input v-model="name" class="form-input" type="text" autocomplete="username" />
        </div>
        <div class="form-item">
          <label class="form-label">密码</label>
          <input
            v-model="password"
            class="form-input"
            type="password"
            autocomplete="current-password"
          />
        </div>
        <div v-if="error" class="form-error">{{ error }}</div>
        <button class="form-button" type="submit" :disabled="submitting">
          <span v-if="submitting">登录中...</span>
          <span v-else>登录</span>
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { loginAdmin } from "../api/admin";

const router = useRouter();
const defaultAdminName = (import.meta.env.VITE_ADMIN_NAME || "").trim();
const defaultAdminPassword = (import.meta.env.VITE_ADMIN_PASSWORD || "").trim();
const name = ref(defaultAdminName);
const password = ref(defaultAdminPassword);
const submitting = ref(false);
const error = ref("");
const apiBaseUrl = ref("");

const rawEnvApiBaseUrl = (import.meta.env.VITE_API_BASE_URL || "").trim();
const defaultApiBaseUrl = rawEnvApiBaseUrl.replace(/\/+$/, "");

onMounted(() => {
  const stored = (localStorage.getItem("cwd_admin_api_base_url") || "").trim();
  if (stored) {
    apiBaseUrl.value = stored;
    return;
  }
  apiBaseUrl.value = defaultApiBaseUrl;
});

async function handleSubmit() {
  const normalizedApiBaseUrl = apiBaseUrl.value.trim().replace(/\/+$/, "");
  if (!normalizedApiBaseUrl) {
    error.value = "请输入 API 地址";
    return;
  }
  if (!name.value || !password.value) {
    error.value = "请输入账号和密码";
    return;
  }
  error.value = "";
  submitting.value = true;
  try {
    localStorage.setItem("cwd_admin_api_base_url", normalizedApiBaseUrl);
    await loginAdmin(name.value, password.value);
    router.push({ name: "comments" });
  } catch (e: any) {
    error.value = e.message || "登录失败";
  } finally {
    submitting.value = false;
  }
}
</script>

<style scoped>
.login-page {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 24px 16px;
  background: radial-gradient(circle at top, #eef2ff 0, #f9fafb 45%, #f3f4f6 100%);
}

.login-card {
  background-color: #ffffff;
  padding: 32px 32px 28px;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  box-shadow: 0 18px 45px rgba(15, 23, 42, 0.12);
  width: 100%;
  max-width: 420px;
  box-sizing: border-box;
}

.login-title {
  margin: 0;
  font-size: 24px;
  text-align: center;
  color: #111827;
  letter-spacing: 0.03em;
}

.login-subtitle {
  margin: 8px 0 28px;
  font-size: 13px;
  text-align: center;
  color: #6b7280;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.form-item {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-label {
  font-size: 14px;
  color: #4b5563;
}

.form-input {
  padding: 9px 12px;
  border-radius: 8px;
  border: 1px solid #d1d5db;
  font-size: 14px;
  outline: none;
  background-color: #f9fafb;
  transition: border-color 0.16s ease, box-shadow 0.16s ease, background-color 0.16s ease;
}

.form-input:focus {
  border-color: #2563eb;
  background-color: #ffffff;
  box-shadow: 0 0 0 1px rgba(37, 99, 235, 0.18);
}

.form-error {
  font-size: 13px;
  color: #dc2626;
  margin-top: 4px;
}

.form-button {
  margin-top: 8px;
  padding: 10px 0;
  border-radius: 999px;
  border: none;
  background: linear-gradient(135deg, #2563eb, #1d4ed8);
  color: #ffffff;
  font-size: 15px;
  cursor: pointer;
  font-weight: 500;
  transition: transform 0.12s ease, box-shadow 0.12s ease, filter 0.12s ease,
    background 0.12s ease;
  box-shadow: 0 10px 25px rgba(37, 99, 235, 0.28);
  width: 100%;
}

.form-button:disabled {
  opacity: 0.7;
  cursor: default;
  box-shadow: none;
  transform: none;
}

.form-button:not(:disabled):hover {
  filter: brightness(1.03);
  transform: translateY(-1px);
  box-shadow: 0 14px 30px rgba(37, 99, 235, 0.32);
}

.form-button:not(:disabled):active {
  transform: translateY(0);
  box-shadow: 0 8px 20px rgba(37, 99, 235, 0.26);
}
</style>
