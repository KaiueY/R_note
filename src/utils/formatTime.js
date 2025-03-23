  // 格式化时间
  const formatTime = (timestamp) => {
    const date = new Date(Number(timestamp));
    return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  };
  export default formatTime;