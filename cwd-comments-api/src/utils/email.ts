import { Bindings } from '../bindings';

/**
 * 回复通知邮件
 */
export async function sendCommentReplyNotification(
  env: Bindings,
  params: {
    toEmail: string;
    toName: string;
    postTitle: string;
    parentComment: string;
    replyAuthor: string;
    replyContent: string;
    postUrl: string;
  }
) {
  const { toEmail, toName, postTitle, parentComment, replyAuthor, replyContent, postUrl } = params;

  console.log('EmailReplyNotification:start', {
    toEmail,
    toName,
    postTitle,
    fromEmail: env.CF_FROM_EMAIL,
    hasSendBinding: !!env.SEND_EMAIL
  });

  const html = `
      <div style="font-family: sans-serif; line-height: 1.6; color: #333;">
        <p>Hi <b>${toName}</b>，</p>
        <p>${replyAuthor} 回复了你在 <b>${postTitle}</b> 中的评论：</p>
        <blockquote style="margin: 10px 0; padding: 10px; border-left: 4px solid #e2e8f0; background: #f8fafc;">
          ${parentComment}
        </blockquote>
        <p>最新回复：</p>
        <blockquote style="margin: 10px 0; padding: 10px; border-left: 4px solid #3b82f6; background: #eff6ff;">
          ${replyContent}
        </blockquote>
        <p style="margin-top: 20px;">
          <a href="${postUrl}" style="background: #3b82f6; color: white; padding: 10px 20px; text-decoration: none; border-radius: 6px; display: inline-block;">
            查看完整回复
          </a>
        </p>
        <hr style="border: none; border-top: 1px solid #eee; margin-top: 30px;">
        <p style="font-size: 12px; color: #999;">此邮件由系统自动发送，请勿直接回复。</p>
      </div>
    `;

  if (!env.SEND_EMAIL || !env.CF_FROM_EMAIL) {
    console.error('EmailReplyNotification:missingBinding', {
      hasSendBinding: !!env.SEND_EMAIL,
      fromEmail: env.CF_FROM_EMAIL
    });
    throw new Error('未配置邮件发送绑定或发件人地址');
  }

  await env.SEND_EMAIL.send({
    to: [{ email: toEmail }],
    from: { email: env.CF_FROM_EMAIL },
    subject: `你在 example.com 上的评论有了新回复`,
    html
  });

  console.log('EmailReplyNotification:sent', {
    toEmail
  });
}

/**
 * 站长通知邮件
 */
export async function sendCommentNotification(
  env: Bindings,
  params: {
    postTitle: string;
    postUrl: string;
    commentAuthor: string;
    commentContent: string;
  }
) {
  const { postTitle, postUrl, commentAuthor, commentContent } = params;
  const toEmail = await getAdminNotifyEmail(env);

  console.log('EmailAdminNotification:start', {
    toEmail,
    postTitle,
    fromEmail: env.CF_FROM_EMAIL,
    hasSendBinding: !!env.SEND_EMAIL
  });

  const html = `
    <div style="font-family: sans-serif;">
      <p><b>${commentAuthor}</b> 在文章《${postTitle}》下发表了评论：</p>
      <div style="padding: 15px; border: 1px solid #ddd; border-radius: 8px;">
        ${commentContent}
      </div>
      <p><a href="${postUrl}">点击跳转到文章</a></p>
    </div>
  `;

  if (!env.SEND_EMAIL || !env.CF_FROM_EMAIL) {
    console.error('EmailAdminNotification:missingBinding', {
      hasSendBinding: !!env.SEND_EMAIL,
      fromEmail: env.CF_FROM_EMAIL
    });
    throw new Error('未配置邮件发送绑定或发件人地址');
  }

  await env.SEND_EMAIL.send({
    to: [{ email: toEmail }],
    from: { email: env.CF_FROM_EMAIL },
    subject: `新评论通知：${postTitle}`,
    html
  });

  console.log('EmailAdminNotification:sent', {
    toEmail
  });
}

async function getAdminNotifyEmail(env: Bindings): Promise<string> {
  await env.CWD_DB.prepare(
    'CREATE TABLE IF NOT EXISTS Settings (key TEXT PRIMARY KEY, value TEXT NOT NULL)'
  ).run();
  const row = await env.CWD_DB.prepare('SELECT value FROM Settings WHERE key = ?')
    .bind('admin_notify_email')
    .first<{ value: string }>();
  if (row?.value) {
    console.log('EmailAdminNotification:useDbEmail', {
      email: row.value
    });
    return row.value;
  }
  if (env.EMAIL_ADDRESS) {
    console.log('EmailAdminNotification:useEnvEmail', {
      email: env.EMAIL_ADDRESS
    });
    return env.EMAIL_ADDRESS;
  }
  console.error('EmailAdminNotification:noAdminEmail');
  throw new Error('未配置管理员通知邮箱');
}
