<template>
  <a-affix :offset-top="0">
    <!--页头-->
    <a-page-header
        class="demo-page-header"
        style="border: 1px solid rgb(235, 237, 240);background: white"
        title="Memory"
        sub-title="Memory畅聊社区"
        @back="() => $router.go(-1)"
    >
      <template #extra>
        <div>
          <div v-if="currentUser">
            <!--用户头像-->
            <a-tooltip>
              <template #title>进入个人主页</template>
              <a>
                <a-avatar class="infoList" size="large"
                          :src="currentUser.avatarUrl"/>
              </a>
              <span>{{ currentUser.userAccount }}</span>
            </a-tooltip>
          </div>

          <div v-else>
            <a-tooltip>
              <template #title>去登录</template>
              <router-link :to="{ path: '/user/login' }">未登录</router-link>
            </a-tooltip>
          </div>
        </div>
        <!--设置下拉菜单-->
        <a-dropdown>
          <a class="ant-dropdown-link" @click.prevent>
            设置
            <DownOutlined/>
          </a>
          <template #overlay>
            <a-menu>
              <a-menu-item>
                <a href="javascript:;">1st menu item</a>
              </a-menu-item>
              <a-menu-item>
                <a href="javascript:;">2nd menu item</a>
              </a-menu-item>
              <a-menu-item>
                <a href="javascript:;">3rd menu item</a>
              </a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>
      </template>
    </a-page-header>
    <br/>
  </a-affix>

  <div>
    <a-row :gutter="[16,16]">
      <a-col :span="5" :push="1">
        <a-card class="infoList" style="width: 220px;height: 400px">
          <template #cover>
            <img alt="example"
                 src="http://rza7uevjr.hn-bkt.clouddn.com/%E5%8A%A8%E6%BC%AB%E6%8F%92%E7%94%BB/bradge.jpg?e=1694248940&token=7EF9y7gF9x4urpXC9ka8c_DxTxDTfH_jYaTCfmkr:Tzl7PgQpltWiFPi5tyBoeC9DISQ="/>
          </template>
          <a-card-meta title="Europe Street beat">
            <template #description>www.instagram.com</template>
          </a-card-meta>
        </a-card>
      </a-col>

      <a-col :span="12">
        <a-card class="infoList" style="width: 1200px;">
          <a-tabs v-model:activeKey="activeKey" class="centered-tabs" @change="handleTabChange">
            <a-tab-pane key="1" tab="用户列表">
              <!--在线用户列表-->
              <UserListPage :userInfo-list="userInfoList"/>
            </a-tab-pane>
            <a-tab-pane key="2" tab="队伍列表">
              <!--在线队伍列表-->
              <!--切换队伍-->
              <div>
                <span>显示加密队伍</span>
                <a-switch v-model:checked="checked"/>
              </div>
              <TeamListPage :teamInfo-list="teamInfoList"/>
            </a-tab-pane>
            <a-tab-pane key="3" tab="聊天大厅">
              <!--聊天大厅-->
              <ChatPage/>
            </a-tab-pane>
            <a-tab-pane key="4" tab="我的">
              <!--我的-->
              <UserInfoPage :user-info="currentUser"/>
            </a-tab-pane>
          </a-tabs>
        </a-card>
      </a-col>
    </a-row>
  </div>

</template>

<script lang="ts" setup="ts">
import {ref, watchEffect} from 'vue';
import UserListPage from "@/components/userListPage.vue";
import TeamListPage from "@/components/teamListPage.vue";
import myAxios from "../plugins/myAxios";
import {onMounted} from "vue";
import {DownOutlined} from '@ant-design/icons-vue';
import UserInfoPage from "@/components/userInfoPage.vue";
import ChatPage from "@/components/chatPage.vue";

const activeKey = ref('1');
const userInfoList = ref([]);
const teamInfoList = ref([]);
const currentUser = ref({});

// 获取在线用户列表
const getUserList = () => {
  myAxios.get("/user/recommend", {
    params: {
      currentPage: 1,
      pageSize: 10
    }
  }).then((res) => {
    userInfoList.value = res.records;
  }).catch(() => {
    console.log("获取用户列表失败")
  });
};

// 获取队伍列表
const getTeamList = (isSecret: any) => {
  myAxios.get("/team/list/page", {
    params: {
      isSecret: isSecret,
    }
  }).then((res) => {
    teamInfoList.value = res.records;
  });
}

// 监听Tab标签变化
const handleTabChange = (key: any) => {
  // 根据选项卡的key发送不同的请求
  if (key === "1") {
    getUserList();
  } else if (key === "2") {
    // 默认仅展示公开队伍
    getTeamList(false);
  }
}

// 获取当前登录用户
const getCurrentUser = () => {
  myAxios.get("/user/currentUser", ).then((res) => {
    currentUser.value = res;
  }).catch(() => {
    console.log("获取用户列表失败")
  });
}

// 钩子函数
onMounted(() => {
  getUserList();
  getCurrentUser();
})

// 开关 队伍状态改变
const checked = ref<boolean>(false);
// 监听开关状态变化
watchEffect(() => {
  if (checked.value) {
    getTeamList(true);
  } else {
    getTeamList(false);
  }
});
</script>

<style>
.infoList {
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1);
}
</style>


