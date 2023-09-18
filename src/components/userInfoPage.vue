<template>
  <div>
    <a-tabs v-model:activeKey="activeKey" tab-position="left" @change="handleTabChange">
      <a-tab-pane key="1" tab="已加入的队伍">
        <a-list
            item-layout="horizontal"
            :data-source="joinedTeamList"
        >
          <template #renderItem="{ item }">
            <a-list-item>
              <template #actions>
                <!--队长-->
                <span>队长</span>
                <a-tag color="success">
                  {{ item.userName }}
                </a-tag>
                <a-button size="large" type="primary" ghost>队内聊天</a-button>
              </template>

              <a-list-item-meta
                  :description="item.description"
              >
                <template #title>
                  <span>{{ item.name }}</span>
                </template>

                <template #avatar>
                  <a-avatar :src="item.imgUrl"/>
                </template>
              </a-list-item-meta>
            </a-list-item>
          </template>
        </a-list>
      </a-tab-pane>

      <a-tab-pane key="2" tab="我创建的队伍">
        <a-list
            item-layout="horizontal"
            :data-source="createdTeamList"
        >
          <template #renderItem="{ item }">
            <a-list-item>
              <template #actions>
                <!--队长-->
                <span>队长</span>
                <a-tag color="success">
                  {{ item.userName }}
                </a-tag>
                <a-button size="large" type="primary" ghost>队内聊天</a-button>
              </template>
              <a-list-item-meta
                  :description="item.description"
              >
                <template #title>
                  <span>{{ item.name }}</span>
                </template>

                <template #avatar>
                  <a-avatar :src="item.imgUrl"/>
                </template>
              </a-list-item-meta>
            </a-list-item>
          </template>
        </a-list>
      </a-tab-pane>

      <a-tab-pane key="3" tab="我的好友">
        <a-list
            item-layout="horizontal"
            :data-source="friendList"
        >
          <template #renderItem="{ item }">
            <a-list-item>
              <template #actions>
                <a-button size="large" type="primary" ghost @click="goToTab(item)">私聊</a-button>
              </template>
              <a-list-item-meta
                  :description="item.profile"
              >
                <template #title>
                  <span>{{ item.username }}</span>
                </template>

                <template #avatar>
                  <a-avatar :src="item.avatarUrl"/>
                </template>
              </a-list-item-meta>

              <div v-if="item.isOnline === 1">
                <a-tag color="processing">
                  在线
                </a-tag>
              </div>

              <div v-if="item.isOnline === 0">
                <a-tag color="default">
                  下线
                </a-tag>
              </div>
            </a-list-item>
          </template>
        </a-list>
      </a-tab-pane>
      <a-tab-pane key="4" tab="我的博客">我的博客</a-tab-pane>
      <a-tab-pane key="5" tab="收藏博客">收藏博客</a-tab-pane>
    </a-tabs>
  </div>
</template>

<script setup lang="ts">
import {withDefaults, defineProps, ref} from "vue";
import myAxios from "@/plugins/myAxios";
import currentUser from "@/model/currentUser";
import router from "@/router";

// 好友列表
const friendList = ref([]);
// 我创建的队伍
const createdTeamList = ref();
// 我加入的队伍
const joinedTeamList = ref();

interface Props {
  userInfo: any[];
}

const props = withDefaults(defineProps<Props>(), {
  userInfo: () => [],
  name: "UserPage"
})

// 监听Tab标签变化 根据选项卡的key发送不同的请求
const handleTabChange = (key: any) => {
  // 获取已加入的队伍
  if (key === "1") {
    getJoinedTeam();
  }
  // 获取已创建的队伍
  if (key === "2") {
    getCreatedTeam();
  }
  // 获取好友
  if (key === "3") {
    getFriendList();
  }
}

// 申请添加好友
const getFriendList = () => {
  myAxios.get("/friends/list",).then((res) => {
    friendList.value = res.data.records;
  }).catch(() => {
    console.log("加入失败")
  });
};

// 登录用户id
let userId = "";
if (currentUser) {
  userId = currentUser.value.id;
}

// 申请添加好友
const getCreatedTeam = () => {
  myAxios.get("/team/created", {
    params: {
      "loginUserId": userId
    }
  }).then((res) => {
    createdTeamList.value = res.data.records;
  }).catch(() => {
    console.log("加入失败")
  });
};

// 申请添加好友
const getJoinedTeam = () => {
  myAxios.get("/team/joined", {
    params: {
      "loginUserId": userId
    }
  }).then((res) => {
    joinedTeamList.value = res.data.records;
  }).catch(() => {
    console.log("加入失败")
  });
};

const activeKey = ref('1');

// 监听页面变化
const goToTab = (item: any) => {
  router.push({
    name: "chat",
    path: "/chat",
    query: {
      chatTabName: item.id,
    }
  })
}

</script>

<style>
.isOnline {
  color: #18f300;
}
</style>