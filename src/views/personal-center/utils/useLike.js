import { ref } from 'vue';
import axios from 'axios';

export function useLike(isLiked, likeCount, initialIsLiked, initialLikeCount) {
  // 回滚函数
  function rollbackToInitialState() {
    isLiked.value = initialIsLiked.value;
    likeCount.value = initialLikeCount.value;
  }

  // 点赞切换函数
  async function toggleLike() {
    // 本地立即切换状态
    isLiked.value = !isLiked.value;
    likeCount.value += isLiked.value ? 1 : -1;

    try {
      // 向新接口发送 PUT 请求
      const response = await axios.put(
        '/api/user-profile/like',
        {}, // 空数据，因为请求数据在 headers 中
        {
          headers: {
            Authorization: `${localStorage.getItem('atoken')}`,
          },
          timeout: 500, // 设置请求超时时间
        });

      if (response.data.code === 200) {
        // 更新点赞数为服务器返回的数据
        likeCount.value = response.data.data.like_count;
      } else {
        console.error('点赞请求失败');
        ElMessage.error('点赞失败，请稍后重试');
        rollbackToInitialState();
      }
    } catch (error) {
      console.error('点赞请求出错:', error);
      ElMessage.error('网络错误，点赞失败');
      rollbackToInitialState();
    }
  }

  return {
    toggleLike,
    rollbackToInitialState,
  };
}
