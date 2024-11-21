import { ref } from 'vue';
import axios from 'axios';

export default function useLike(likeCount, initialLikeState) {
  const isLiked = ref(initialLikeState.isLiked || false); // 点赞状态
  const initialLikeCount = initialLikeState.likeCount || 0; // 初始点赞数

  async function toggleLike() {
    // 本地立即切换状态和数字
    isLiked.value = !isLiked.value;
    likeCount.value += isLiked.value ? 1 : -1;

    try {
      // 异步发送请求
      const response = await axios.put('/api/PutLikeCount', {
        atoken: localStorage.getItem('atoken'),
        userid: localStorage.getItem('userid'),
      });

      if (response.data.code === 200) {
        // 使用后端返回的最新点赞数
        likeCount.value = response.data.likecount;
      } else {
        console.error('点赞请求失败');
        // 回滚到初始状态
        rollbackToInitialState();
      }
    } catch (error) {
      console.error('点赞请求出错:', error);
      // 回滚到初始状态
      rollbackToInitialState();
    }
  }

  function rollbackToInitialState() {
    isLiked.value = initialLikeState.isLiked; // 恢复到初始点赞状态
    likeCount.value = initialLikeCount; // 恢复到初始点赞数
  }

  return { toggleLike, isLiked };
}
