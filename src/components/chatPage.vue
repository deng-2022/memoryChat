<template>
  <div>
    <a-tabs v-model:activeKey="activeKey" tab-position="left" @change="handleTabChange">
      <a-tab-pane key="1" tab="测试1">
        Welcome
        <br/>
        <a-input v-model:value="mesInput" placeholder="Basic usage"/>
        <a-button @click="sendMessage">发送消息</a-button>
        <hr/>
        <a-button @click="openSocket()">连接socket</a-button>
        <a-button @click="closeWebSocket()">关闭WebSocket连接</a-button>
        <hr/>
        <div id="message">{{ retMes }}</div>
        <a-list item-layout="horizontal" :data-source="chatMsgList">
          <template #renderItem="{ item }">
            <a-list-item>
              <a-list-item-meta
                  :description="item.content"
              >
              </a-list-item-meta>
            </a-list-item>
          </template>
        </a-list>
      </a-tab-pane>
      <a-tab-pane key="2" tab="测试2">
        <a-list item-layout="horizontal" :data-source="chatMsgList">
          <template #renderItem="{ item }">
            <a-list-item>
              <a-list-item-meta
                  :description="item.content"
              >
              </a-list-item-meta>
            </a-list-item>
          </template>
        </a-list>
      </a-tab-pane>
      <a-tab-pane key="3" tab="聊天3">
      </a-tab-pane>
      <a-tab-pane key="4" tab="聊天4">
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script setup>
import {ref} from "vue";
import currentUser from "@/model/currentUser";
import myAxios from "@/plugins/myAxios";
// 服务器 消息提示
const retMes = ref("");
// 当前登录用户id
const currentUserId = currentUser.value.id;
// socket
let socket;

// tab页 key
const activeKey = ref('1');
// 消息输入
const mesInput = ref("");
// 聊天记录 消息列表
const chatMsgList = ref([])
// 监听Tab标签变化 根据选项卡的key发送不同的请求
const handleTabChange = (key) => {
  // 获取已加入的队伍
  if (key === "1") {
    // alert(key)
  }
  // 获取聊天记录
  if (key === "2") {
    getMesList();
    // 获取好友
    if (key === "3") {
      // alert(key)
    }
  }
}

const getMesList = () => {
  myAxios.get("/chat/list", {
    params: {
      loginUserId: currentUserId
    }
  }).then((res) => {
    chatMsgList.value = res.data;
  }).catch((res) => {
    console.log(res)
  });
}


const initMessage = {
  senderId: "",
  receiverId: "",
  content: "",
  sendTime: ""
}
// 服务器转发回的消息(客户端收到的消息)
const receiveMsg = ref(initMessage)

// 连接服务器
function openSocket() {
  if (typeof WebSocket == "undefined") {
    console.log("您的浏览器不支持WebSocket");
  } else {
    console.log("您的浏览器支持WebSocket");
    //指定要连接的服务器地址与端口
    const socketUrl = `ws://localhost:8081/api/websocket/${currentUserId}`;
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
    //获得消息事件(获得服务端转发的消息)
    socket.onmessage = function (msg) {
      // 封装返回消息
      if (typeof (msg) === String) {
        receiveMsg.value = JSON.parse(msg.data);
      }
      receiveMsg.value = msg.data;
      // 解构
      const receiverId = receiveMsg.value.receiverId;
      const content = receiveMsg.value.content;
      // 是否属于我的消息
      if (receiverId === currentUserId) {
        setMessage("服务端回应: " + content + "发给: " + receiverId);
      }
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

// 客户端发出的消息
const sendMsg = ref(initMessage)

// 发送消息
function sendMessage() {
  if (typeof WebSocket == "undefined") {
    console.log("您的浏览器不支持WebSocket");
  } else {
    console.log("您的浏览器支持WebSocket");

    sendMsg.value = JSON.stringify({
      senderId: currentUserId,
      receiverId: "1657284893320364034",
      content: mesInput.value,
      sendTime: new Date()
    });
    // 校验是否连接服务器
    if (socket == null) {
      retMes.value += "服务未开启"
      return;
    }
    // 发送消息
    socket.send(sendMsg.value);
    setMessage(sendMsg.value);
    // 实时更新聊天记录
    getMesList();
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