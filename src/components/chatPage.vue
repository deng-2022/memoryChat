<template>
  <div>
    <a-tabs v-model:activeKey="activeKey" tab-position="left" @change="handleTabChange">
      <a-tab-pane key="1" tab="聊天1">
        <span></span>
      </a-tab-pane>
      <a-tab-pane key="2" tab="聊天2">
      </a-tab-pane>
      <a-tab-pane key="3" tab="聊天3">
      </a-tab-pane>
      <a-tab-pane key="4" tab="聊天4">
      </a-tab-pane>
    </a-tabs>
    Welcome
    <br/>
    <input id="text" value="这是一条测试消息"/>
    <a-button @click="sendMessage">发送消息</a-button>
    <hr/>
    <a-button @click="openSocket()">连接socket</a-button>
    <a-button @click="closeWebSocket()">关闭WebSocket连接</a-button>
    <hr/>
    <div id="message">{{ retMes }}</div>
  </div>
</template>

<script setup>
import {ref} from "vue";
import currentUser from "@/model/currentUser";

const retMes = ref("");
const currentUserId = currentUser.value.id;
let socket;

const initMessage = {
  "senderId": "",
  "receiverId": "",
  "content": "",
  "sendTime": ""
}
const message = ref(initMessage)

function openSocket() {
  if (typeof WebSocket == "undefined") {
    console.log("您的浏览器不支持WebSocket");
  } else {
    console.log("您的浏览器支持WebSocket");
    //指定要连接的服务器地址与端口
    const socketUrl = `ws://localhost:8081/api/websocket/${currentUserId}`;
    console.log(socketUrl);
    console.log(currentUser);
    console.log(currentUserId);
    if (socket != null) {
      socket.close();
      socket = null;
    }
    // 实例化WebSocket对象，建立连接
    socket = new WebSocket(socketUrl);
    //打开事件
    socket.onopen = function () {
      console.log("websocket已打开");
      setMessage("websocket已打开");
    };
    //获得消息事件
    socket.onmessage = function (msg) {
      console.log(msg.data);
      //消息进入后的处理逻辑
      setMessage("服务端回应: " + msg.data);
    };
    //关闭事件
    socket.onclose = function () {
      console.log("websocket已关闭");
      setMessage("websocket已关闭");
    };
    //发生了错误事件
    socket.onerror = function () {
      console.log("websocket发生了错误");
    };
  }
}

// 发送消息
function sendMessage() {
  if (typeof WebSocket == "undefined") {
    console.log("您的浏览器不支持WebSocket");
  } else {
    console.log("您的浏览器支持WebSocket");

    message.value = JSON.stringify({
      senderId: currentUserId,
      receiverId: "1657284893320364034",
      content: "你好",
      sendTime: new Date()
    });

    if (socket == null) {
      retMes.value += "服务未开启"
      return;
    }
    socket.send(message.value);
    setMessage(message.value);
  }
}

//将消息显示在网页上
function setMessage(message) {
  retMes.value += message + "\n";
}

//关闭WebSocket连接
function closeWebSocket() {
  socket.close();
}

//监听窗口关闭事件，当窗口关闭时，主动去关闭websocket连接，防止连接还没断开就关闭窗口，server端会抛异常。
window.onbeforeunload = function () {
  closeWebSocket();
};
</script>