<template>
  <div>
    <button @click="sendMessage">发送消息</button>
    <div v-if="messageReceived">收到的消息：{{ receivedMessage }}</div>
  </div>
</template>

<script setup>


</script>