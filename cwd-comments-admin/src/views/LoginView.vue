<template>
  <div class="login-page">
    <div class="login-card">
      <h1 class="login-title">CWD 评论后台</h1>
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
  height: 100%;
}

.login-card {
  background-color: #ffffff;
  padding: 32px 40px;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  width: 360px;
}

.login-title {
  margin: 0 0 24px;
  font-size: 22px;
  text-align: center;
  color: #333333;
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
  color: #555555;
}

.form-input {
  padding: 8px 10px;
  border-radius: 4px;
  border: 1px solid #d0d7de;
  font-size: 14px;
  outline: none;
}

.form-input:focus {
  border-color: #0969da;
  box-shadow: 0 0 0 1px rgba(9, 105, 218, 0.2);
}

.form-error {
  font-size: 13px;
  color: #d1242f;
}

.form-button {
  margin-top: 8px;
  padding: 10px 0;
  border-radius: 4px;
  border: none;
  background-color: #0969da;
  color: #ffffff;
  font-size: 15px;
  cursor: pointer;
}

.form-button:disabled {
  opacity: 0.7;
  cursor: default;
}
</style>
