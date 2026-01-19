<template>
  <div class="page">
    <h2 class="page-title">评论管理</h2>
    <div class="toolbar">
      <div class="toolbar-left">
        <select v-model="statusFilter" class="toolbar-select">
          <option value="">全部状态</option>
          <option value="approved">已通过</option>
          <option value="pending">待审核</option>
          <option value="rejected">已拒绝</option>
        </select>
      </div>
      <div class="toolbar-right">
        <button class="toolbar-button" @click="loadComments">刷新</button>
      </div>
    </div>
    <div v-if="loading" class="page-hint">加载中...</div>
    <div v-else-if="error" class="page-error">{{ error }}</div>
    <div v-else>
      <div class="comment-list">
        <div
          v-for="item in filteredComments"
          :key="item.id"
          class="comment-card"
        >
          <div class="comment-card-header">
            <div class="comment-author">
              <div class="comment-author-name">
                {{ item.author }}
              </div>
              <div class="comment-author-email">
                {{ item.email }}
              </div>
            </div>
            <div class="comment-meta">
              <span class="comment-path">{{ item.postSlug }}</span>
              <span class="comment-time">{{ formatDate(item.pubDate) }}</span>
            </div>
          </div>
          <div class="comment-content">
            {{ item.contentText }}
          </div>
          <div class="comment-footer">
            <div class="comment-info">
              <span class="comment-id">#{{ item.id }}</span>
              <span
                class="comment-status"
                :class="`comment-status-${item.status}`"
              >
                {{ formatStatus(item.status) }}
              </span>
            </div>
            <div class="comment-actions">
              <button
                class="comment-action"
                @click="changeStatus(item, 'approved')"
                :disabled="item.status === 'approved'"
              >
                通过
              </button>
              <button
                class="comment-action"
                @click="changeStatus(item, 'pending')"
                :disabled="item.status === 'pending'"
              >
                待审
              </button>
              <button
                class="comment-action"
                @click="changeStatus(item, 'rejected')"
                :disabled="item.status === 'rejected'"
              >
                拒绝
              </button>
              <button
                class="comment-action comment-action-danger"
                @click="removeComment(item)"
              >
                删除
              </button>
            </div>
          </div>
        </div>
        <div
          v-if="filteredComments.length === 0"
          class="page-hint comment-empty"
        >
          暂无数据
        </div>
      </div>
      <div v-if="pagination.total > 1" class="pagination">
        <button
          class="pagination-button"
          :disabled="pagination.page <= 1"
          @click="goPage(pagination.page - 1)"
        >
          上一页
        </button>
        <span class="pagination-info"
          >{{ pagination.page }} / {{ pagination.total }}</span
        >
        <button
          class="pagination-button"
          :disabled="pagination.page >= pagination.total"
          @click="goPage(pagination.page + 1)"
        >
          下一页
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from "vue";
import {
  CommentItem,
  CommentListResponse,
  fetchComments,
  deleteComment,
  updateCommentStatus,
} from "../api/admin";

const comments = ref<CommentItem[]>([]);
const pagination = ref<{ page: number; total: number }>({ page: 1, total: 1 });
const loading = ref(false);
const error = ref("");
const statusFilter = ref("");

const filteredComments = computed(() => {
  if (!statusFilter.value) {
    return comments.value;
  }
  return comments.value.filter((item) => item.status === statusFilter.value);
});

function formatDate(value: string) {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) {
    return value;
  }
  return d.toLocaleString();
}

function formatStatus(status: string) {
  if (status === "approved") {
    return "已通过";
  }
  if (status === "pending") {
    return "待审核";
  }
  if (status === "rejected") {
    return "已拒绝";
  }
  return status;
}

async function loadComments(page?: number) {
  const targetPage = typeof page === "number" ? page : 1;
  loading.value = true;
  error.value = "";
  try {
    const res = await fetchComments(targetPage);
    comments.value = res.data;
    pagination.value = { page: res.pagination.page, total: res.pagination.total };
  } catch (e: any) {
    error.value = e.message || "加载失败";
  } finally {
    loading.value = false;
  }
}

async function goPage(page: number) {
  if (page < 1 || page > pagination.value.total) {
    return;
  }
  await loadComments(page);
}

async function changeStatus(item: CommentItem, status: string) {
  try {
    await updateCommentStatus(item.id, status);
    item.status = status;
  } catch (e: any) {
    error.value = e.message || "更新状态失败";
  }
}

async function removeComment(item: CommentItem) {
  if (!window.confirm(`确认删除评论 ${item.id} 吗`)) {
    return;
  }
  try {
    await deleteComment(item.id);
    comments.value = comments.value.filter((c) => c.id !== item.id);
  } catch (e: any) {
    error.value = e.message || "删除失败";
  }
}

onMounted(() => {
  loadComments();
});
</script>

<style scoped>
.page {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.page-title {
  margin: 0;
  font-size: 18px;
  color: #24292f;
}

.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.toolbar-left {
  display: flex;
  gap: 8px;
}

.toolbar-right {
  display: flex;
  gap: 8px;
}

.toolbar-select {
  padding: 4px 8px;
  font-size: 13px;
}

.toolbar-button {
  padding: 6px 10px;
  border-radius: 4px;
  border: 1px solid #d0d7de;
  background-color: #f6f8fa;
  cursor: pointer;
  font-size: 13px;
}

.page-hint {
  font-size: 14px;
  color: #57606a;
}

.page-error {
  font-size: 14px;
  color: #d1242f;
}

.comment-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.comment-card {
  background-color: #ffffff;
  border-radius: 6px;
  border: 1px solid #d0d7de;
  padding: 10px 12px;
  box-shadow: 0 1px 0 rgba(27, 31, 36, 0.04);
}

.comment-card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 8px;
}

.comment-author {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.comment-author-name {
  font-size: 14px;
  font-weight: 600;
  color: #24292f;
}

.comment-author-email {
  font-size: 12px;
  color: #57606a;
  word-break: break-all;
}

.comment-meta {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
  font-size: 12px;
  color: #57606a;
}

.comment-path {
  max-width: 220px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.comment-time {
  white-space: nowrap;
}

.comment-content {
  font-size: 14px;
  line-height: 1.6;
  color: #24292f;
  margin-bottom: 8px;
  white-space: pre-wrap;
  word-break: break-word;
}

.comment-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.comment-info {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: #57606a;
}

.comment-id {
  padding: 2px 6px;
  border-radius: 999px;
  background-color: #f6f8fa;
}

.comment-status {
  padding: 2px 8px;
  border-radius: 999px;
  background-color: #f6f8fa;
}

.comment-status-approved {
  color: #1a7f37;
  background-color: #e7f5eb;
}

.comment-status-pending {
  color: #9a6700;
  background-color: #fff8c5;
}

.comment-status-rejected {
  color: #d1242f;
  background-color: #ffebe9;
}

.comment-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.comment-action {
  padding: 4px 8px;
  border-radius: 4px;
  border: 1px solid #d0d7de;
  background-color: #f6f8fa;
  font-size: 12px;
  cursor: pointer;
}

.comment-action-danger {
  border-color: #d1242f;
  color: #d1242f;
}

.comment-action:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.comment-empty {
  margin-top: 8px;
  text-align: center;
}

.pagination {
  margin-top: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.pagination-button {
  padding: 4px 8px;
  border-radius: 4px;
  border: 1px solid #d0d7de;
  background-color: #f6f8fa;
  font-size: 12px;
  cursor: pointer;
}

.pagination-info {
  font-size: 13px;
}
</style>
