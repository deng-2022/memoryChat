<template>
  <a-affix :offset-top="0">
    <!--页头-->
    <a-page-header
        class="demo-page-header"
        style="border: 1px solid rgb(235, 237, 240);background: white"
        title="Memory畅聊社区"
        sub-title="聊天大厅"
        @back="() => $router.go(-1)"
    >
      <template #extra>
        <div v-if="currentUser">
          <div>
            <!--登录用户信息-->
            <a-tooltip>
              <template #title>进入个人主页</template>
              <a>
                <a-avatar class="infoList" size="large"
                          :src="currentUser.avatarUrl"/>
              </a>
              <span>{{ currentUser.userAccount }}</span>
            </a-tooltip>
          </div>

          <!--退出登录-->
          <div>
            <a-button type="primary" @click="showModal">退出登录</a-button>
            <a-modal v-model:visible="visible" title="警告" @ok="logout">
              <p>您确定要退出登录吗</p>
            </a-modal>
          </div>
        </div>

        <div v-else>
          <router-link :to="{ path: '/user/login' }">
            <a-button type="primary" @click="showModal">去登录</a-button>
          </router-link>
        </div>

        <!--用户操作-->
      </template>
    </a-page-header>
    <br/>
  </a-affix>

  <div>
    <a-card class="chatList" style="width: 100%;">
      <a-tabs v-model:activeKey="activeKey" tab-position="left" @change="handleTabChange">
        <a-tab-pane v-model:activeKey="activeKey" v-for="tab in friendList" :key="tab.id" :tab="tab.username"
                    @click="handleTabChange">
          <div class="chatWindow">
            <div class="msgWindow">
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
            </div>

            <div class="inputWindow">
              <hr/>
              <a-input v-model:value="mesInput" placeholder="Basic usage"/>
              <a-button @click="sendMessage">发送消息</a-button>
              <hr/>
              <a-button @click="openSocket()">连接socket</a-button>
              <a-button @click="closeWebSocket()">关闭WebSocket连接</a-button>
              <div id="message">{{ retMes }}</div>
            </div>
          </div>
        </a-tab-pane>
      </a-tabs>
    </a-card>
  </div>
</template>

<script setup>
import {onMounted, ref} from "vue";
import currentUser from "@/model/currentUser";
import myAxios from "@/plugins/myAxios";
import {useRoute} from 'vue-router';

const route = useRoute();
const chatTabName = ref({});
// 服务器 消息提示
const retMes = ref("");
// 当前登录用户id
const currentUserId = currentUser.value.id;
// socket
let socket;

// tab页 key
const activeKey = ref(chatTabName.value.chatTabName);
// tab标签列表
// 消息输入
const mesInput = ref("");
// 聊天记录 消息列表
const chatMsgList = ref([])

// 监听Tab标签变化 根据选项卡的key发送不同的请求
const handleTabChange = (key) => {
  getMesList(key);
}

// 当前通信用户id
const chatUser = ref();
// 更新消息列表
const getMesList = (key) => {
  chatUser.value = key;
  myAxios.get("/chat/list", {
    params: {
      senderId: currentUserId,
      receiverId: chatUser.value,
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
  // 实时更新聊天记录
  getMesList();
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
      receiveMsg.value = JSON.parse(msg.data)
      // 是发给自己的消息 更新聊天记录
      if (currentUserId === receiveMsg.value.receiverId) {
        getMesList(chatUser.value);
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
      receiverId: chatTabName.value.chatTabName,
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
    // setMessage(sendMsg.value);
    // 实时更新聊天记录
    getMesList(chatUser.value);
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


// 钩子函数
onMounted(() => {
  // 获取接收者id
  chatTabName.value = route.query
  console.log("参数:" + chatTabName.value.chatTabName)
  activeKey.value = chatTabName.value.chatTabName;
  // 获取好友列表信息
  chatWindowList();
})

// 好友列表
const friendList = ref([]);
// 获取好友列表信息
const chatWindowList = () => {
  myAxios.get("/friends/list",).then((res) => {
    friendList.value = res.data.records;
  }).catch(() => {
    console.log("加入失败")
  });
  console.log(friendList.value)
}

</script>

<style>
.chatList {
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1);
}

.msgWindow {
  overflow-y: scroll;
  height: 600px;
}
</style>