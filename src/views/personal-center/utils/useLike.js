import { ref } from 'vue';
import axios from 'axios';
import _ from 'lodash'; // 引入 lodash

export function useLike(isLiked, likeCount) {
  // 点赞切换函数
  const handleLike = _.debounce(async () => {
    const previousState = isLiked.value;
    const previousCount = likeCount.value;

     // 本地乐观更新
     isLiked.value = isLiked.value === 1 ? 0 : 1; // 切换状态
     likeCount.value += isLiked.value === 1 ? 1 : -1; // 更新点赞数
          
    try {
      // 向新接口发送 PUT 请求
      const response = await axios.put(
        '/api/user-profile/like',
        {}, // 空对象表示没有请求体内容
        {
          headers: {
            Authorization: `${localStorage.getItem('atoken')}`,
          },
          timeout: 2000, // 设置请求超时时间
        });

        console.log('点赞',response)
      if (response.data.code === 20000) {
        // 更新点赞数为服务器返回的数据
        likeCount.value = response.data.data.like_count;
        // 强制刷新响应式
        console.log('点赞状态更新:', isLiked.value, likeCount.value);
      } else {
        isLiked.value = previousState;
        likeCount.value = previousCount;
        console.error('点赞请求失败');
        ElMessage.error('点赞失败，请稍后重试');
      }
    } catch (error) {
      isLiked.value = previousState;
      likeCount.value = previousCount;
      console.error('点赞请求出错:', error);
      ElMessage.error('网络错误，点赞失败');
    }
  }, 1000); // 防抖 1 秒

  return {
    toggleLike: handleLike, // 将防抖后的函数暴露出去
  };
}
