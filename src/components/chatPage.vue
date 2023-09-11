<template>
  <div>
    <button @click="sendMessage">发送消息</button>
    <div v-if="messageReceived">收到的消息：{{ receivedMessage }}</div>
  </div>
</template>

<script setup>
import {io} from 'socket.io-client';
import {ref} from 'vue';

const socket = io('http://localhost:8080/socket'); // 根据实际后端URL设置

const receivedMessage = ref('');
const messageReceived = ref(false);

// 发送消息
const sendMessage = () => {
  socket.emit('sendMessage', 'Hello from client!');
};

// 接收到消息时的处理函数
const handleMessage = (message) => {
  // 处理消息逻辑
  receivedMessage.value = message;
  messageReceived.value = true;
};

// 监听socket 'receiveMessage' 事件
socket.on('receiveMessage', handleMessage);

// 在组件卸载时关闭socket连接
const beforeUnmount = () => {
  socket.disconnect();
};
</script>