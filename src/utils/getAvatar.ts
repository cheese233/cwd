/**
 * 默认 gravatar.com 前缀
 */
const DEFAULT_AVATAR_PREFIX = 'https://gravatar.com/avatar';

/**
 * 辅助函数：生成 gravatar.com 头像地址 (MD5 算法)
 * @param email - 邮箱地址
 * @param prefix - 头像服务前缀，默认为 https://gravatar.com/avatar
 */
export const getCravatar = async (email: string, prefix?: string): Promise<string> => {
  const cleanEmail = email.trim().toLowerCase();
  const msgUint8 = new TextEncoder().encode(cleanEmail);
  const hashBuffer = await crypto.subtle.digest('MD5', msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  const avatarPrefix = prefix || DEFAULT_AVATAR_PREFIX;
  return `${avatarPrefix}/${hashHex}?s=200&d=retro`;
};