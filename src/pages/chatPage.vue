<template>
  <div class="chat">
    <a-affix :offset-top="0">
      <!--页头-->
      <a-page-header
          class="demo-page-header"
          style="border: 1px solid rgb(235, 237, 240); background: rgba(255, 255, 255, 0.5)"
          title="Memory畅聊社区"
          sub-title="聊天大厅"
          @back="() => $router.go(-1)"
      >
        <template #extra>
          <div class="goToPage1">
            <EyeTwoTone class="icon" style="font-size: 25px;"/>
            <span><a @click="goToCenter">用户中心</a></span>
          </div>

          <div class="goToPage2">
            <FireTwoTone class="icon" style="font-size: 25px;"/>
            <span><a @click="goToBlog">博客社区</a></span>
          </div>
          <div v-if="currentUser">
            <div>
              <!--登录用户信息-->
              <span style="margin-left: 13px">
                <a-tooltip>
                <template #title>进入个人主页</template>
                <a>
                  <a-avatar size="large"
                            :src="currentUser.avatarUrl"/>
                </a>
                  <span>{{ currentUser.username }}</span>
              </a-tooltip>
            </span>

              <!--退出登录-->
              <span style="margin-left: 13px">
              <a-button type="primary" ghost @click="showModal">退出登录</a-button>
              <a-modal v-model:visible="visible" title="警告" @ok="logout">
                <p>您确定要退出登录吗</p>
              </a-modal>
             </span>
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

    <div style="width: 97%; margin-left: 1%;">
      <a-card class="chatList" style="width: 100%;">
        <a-tabs v-model:activeKey="activeKey" tab-position="left" @change="handleTabChange">
          <!--文件传输助手-->
          <a-tab-pane v-model:activeKey="activeKey" :key="currentUserId" tab="文件传输助手"
                      @click="handleTabChange">
            <div class="msgWindow">
              <h1>收发文件，您的得力助手</h1>
            </div>


            <div class="inputWindow">
              <a-divider style="height: 2px; background-color: #7cb305"/>
              <div>
                <a-input v-model:value="mesInput" placeholder="Basic usage" size="large" style="width: 90%"
                         showCount :maxlength="300"/>
                <a-button @click="sendMessage" type="primary" size="large" style="margin-left: 20px">发送消息
                </a-button>
              </div>
            </div>
          </a-tab-pane>

          <!--好友私聊聊天框-->
          <a-tab-pane v-model:activeKey="activeKey" v-for="tab in friendList" :key="tab.id" :tab="tab.username"
                      @click="handleTabChange">
            <div class="chatWindow">
              <div class="msgWindow">
                <a-list item-layout="horizontal" :data-source="chatMsgList">
                  <template #renderItem="{ item }">
                    <div style="position: relative">
                      <!--发送者-->
                      <div style="position: absolute;top: 6px">
                        <a-avatar size="large" src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"/>
                      </div>
                      <div style="margin-left: 24px;font-size: medium">
                        <a-list-item>
                          <div style="font-size: smaller">
                            <!--发送时间-->
                            <a-list-item-meta :description="item.sendTime">
                            </a-list-item-meta>
                          </div>
                          <!--消息内容-->
                          {{ item.content }}
                        </a-list-item>
                      </div>
                    </div>
                  </template>
                </a-list>
              </div>

              <div class="inputWindow">
                <a-divider style="height: 2px; background-color: #7cb305"/>
                <div>
                  <a-input v-model:value="mesInput" placeholder="Basic usage" size="large" style="width: 90%"
                           showCount :maxlength="300"/>
                  <a-button @click="sendMessage" type="primary" size="large" style="margin-left: 20px">发送消息
                  </a-button>
                </div>
                <!--测试是否连接成功-->
                <!--<div id="message">{{ retMes }}</div>-->
              </div>
            </div>
          </a-tab-pane>
        </a-tabs>
      </a-card>
    </div>
  </div>

</template>

<script setup>
import {onMounted, ref, watch, computed} from "vue";
import currentUser from "@/model/currentUser";
import myAxios from "@/plugins/myAxios";
import {useRoute} from 'vue-router';
import {message, notification} from "ant-design-vue";
import getCurrentUser from "@/service/getCurrentUser";
import {EyeTwoTone, FireTwoTone} from '@ant-design/icons-vue';
import router from "@/router";

// 消息输入
const mesInput = ref("");

// 计算属性，用于校验变量的值是否为空
const isMesInputEmpty = computed(() => {
  return mesInput.value === "";
});

const route = useRoute();
const chatTabName = ref({});
// 服务器 消息提示
const retMes = ref("");
// 当前登录用户id
let currentUserId = currentUser.value.id;
// socket
let socket;
// tab页 key
const activeKey = ref(currentUserId);
// 聊天记录 消息列表
const chatMsgList = ref([])
// 当前通信用户id
const chatUser = ref();

// 监听Tab标签变化 根据选项卡的key发送不同的请求
const handleTabChange = (key) => {
  chatUser.value = key;
  getMesList(key);
}

// 更新消息列表
const getMesList = (key) => {
  getCurrentUser();
  currentUserId = currentUser.value.id;

  myAxios.get("/chat/list", {
    params: {
      senderId: currentUserId,
      receiverId: key,
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
function openSocket(Id) {
  if (typeof WebSocket == "undefined") {
    console.log("您的浏览器不支持WebSocket");
  } else {
    console.log("您的浏览器支持WebSocket");

    //指定要连接的服务器地址与端口
    const socketUrl = `ws://localhost:8081/api/websocket/${Id}`;
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
      // 实时更新聊天记录
      getMesList(chatUser.value);
      receiveMsg.value = JSON.parse(msg.data)
      // 是发给自己的消息 更新聊天记录
      if (currentUserId === receiveMsg.value.receiverId) {
        openNotification()
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

// 弹出收到消息提示
const openNotification = () => {
  notification.open({
    message: '消息通知',
    description:
        '你收到了一条新消息, 请注意查收',
    onClick: () => {
      console.log('Notification Clicked!');
    },
  });
}

// 客户端发出的消息
const sendMsg = ref(initMessage)

// 发送消息
function sendMessage() {
  if (typeof WebSocket == "undefined") {
    console.log("您的浏览器不支持WebSocket");
  } else {
    console.log("您的浏览器支持WebSocket");

    // 在需要校验的地方使用 isMesInputEmpty
    if (isMesInputEmpty.value) {
      message.warning("发送消息不能为空")
      return;
    }

    sendMsg.value = JSON.stringify({
      senderId: currentUserId,
      receiverId: chatUser.value,
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
    message.success("成功发送一条消息")
    mesInput.value = "";
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

// 监听 activeKey 的变化，更新存储中的值
watch(activeKey, (value) => {
  localStorage.setItem('activeKey', value);
});

// 钩子函数
onMounted(() => {
  // 主动连接
  openSocket(currentUserId);
  // 获取接收者id
  chatTabName.value = route.query
  // 记忆选中的Tab标签页
  if (chatTabName.value === undefined) {
    activeKey.value = localStorage.getItem('activeKey')
  } else {
    activeKey.value = chatTabName.value.chatTabName;
  }
  // 获取好友列表信息
  chatWindowList();
  // 聊天记录
  getMesList(activeKey.value)
})

// 好友列表
const friendList = ref([]);
// 获取好友列表信息
const chatWindowList = () => {
  myAxios.get("/friends/list").then((res) => {
    friendList.value = res.data.records;
  }).catch(() => {
    console.log("加入失败")
  });
  console.log(friendList.value)
}

// 前往博客社区
const goToBlog = () => {
  router.push("/blog")
}

// 前往用户中心
const goToCenter = () => {
  router.push("/")
}
</script>

<style>
.demo-page-header {
  position: relative;
  backdrop-filter: blur(5px);
}

.goToPage1, .goToPage2 {
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 32px
}

.goToPage1 {
  left: 300px;
}

.goToPage2 {
  left: 400px;
}

.icon {
  padding-right: 5px;;
}

.chat {
  background-image: linear-gradient(135deg, #70F570 10%, #49C628 100%);
  height: 2000px;
}

.chatList {
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1);
}

.msgWindow {
  overflow-y: scroll;
  height: 600px;
}
</style>