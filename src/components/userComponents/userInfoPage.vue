<template>
  <div>
    <!--拿到数据-->
    <template v-if="currentUser ">
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
                  <a-button size="large" type="primary" ghost @click="goToChatInTeam">队内聊天</a-button>
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
                  <!--发布公告-->
                  <a-button size="large" danger @click="showModal(item)">发布公告</a-button>
                  <div style="position: relative">
                    <a-modal v-model:visible="item.showEditWindow" title="队伍公告" @ok="updateAnnouncement(item)">
                      <p>请编辑队伍公告</p>
                      <a-textarea v-model:value="announcement" style="height: 100px"/>
                    </a-modal>
                  </div>
                  <!--队长-->
                  <span>队长</span>
                  <a-tag color="success">
                    {{ item.userName }}
                  </a-tag>
                  <a-button size="large" type="primary" ghost @click="goToChatInTeam">队内聊天</a-button>
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
    </template>

    <!--获取数据失败-->
    <template v-else>
      <a-empty
          image="https://gw.alipayobjects.com/mdn/miniapp_social/afts/img/A*pevERLJC9v0AAAAAAAAAAABjAQAAAQ/original"
          :image-style="{
          height: '60px',
            }"
      >
        <template #description>
      <span style="color: darkcyan">
       登录后即可查看
      </span>
        </template>
        <a-button type="primary" @click="goToLogin">登录</a-button>
      </a-empty>
    </template>
  </div>
</template>

<script setup lang="ts">
import {withDefaults, defineProps, ref, onMounted} from "vue";
import myAxios from "@/plugins/myAxios";
import currentUser from "@/model/currentUser";
import router from "@/router";
import {message} from "ant-design-vue";

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
if (currentUser.value) {
  userId = currentUser.value.id;
}

// 申请添加好友
const getCreatedTeam = () => {
  myAxios.get("/team/created", {
    params: {
      "loginUserId": userId
    }
  }).then((res) => {
    createdTeamList.value = res.data.records.map((team: any) => {
      return {
        ...team,
        showEditWindow: false
      };
    });
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

// 默认选中已加入的队伍
const activeKey = ref('1');
// 直接查询已加入的队伍
onMounted(() => {
  getJoinedTeam();
})

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

// 跳转登录页
const goToLogin = () => {
  router.push("user/login")
}

// 队内聊天
const goToChatInTeam = () => {
  message.warning("很抱歉，暂不支持该功能")
}

// 公告内容
const announcement = ref("");

// 公告弹窗
const showModal = (team: any) => {
  team.showEditWindow = true;
};

// 更新队伍公告
const updateAnnouncement = (team: any) => {
  myAxios.post("/team//update/announcement", {
    userId: userId,
    teamId: team.id,
    announcement: announcement.value,
  }).then(() => {
    message.success("队伍公告发布成功")
  }).catch(() => {
    message.error("队伍公告发布失败")
  });
  team.showEditWindow = false;
};

</script>

<style>
.isOnline {
  color: #18f300;
}
</style>