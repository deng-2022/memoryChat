<template>
  <div class="center">
    <a-affix :offset-top="0">
      <!--页头-->
      <a-page-header
          class="demo-page-header"
          style="border: 1px solid rgb(235, 237, 240); background: rgba(255, 255, 255, 0.5)"
          title="Memory畅聊社区"
          sub-title="用户中心"
          @back="() => $router.go(-1)"
      >
        <template #extra>
          <div class="goToPage1">
            <FireTwoTone class="icon" style="font-size: 25px;"/>
            <span><a @click="goToBlog">博客社区</a></span>
          </div>

          <div class="goToPage2">
            <ApiTwoTone class="icon" style="font-size: 25px;"/>
            <span><a @click="goToChat">聊天大厅</a></span>
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
                <span>{{ currentUser.userAccount }}</span>
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

    <!--主页内容-->
    <div>
      <a-row :gutter="[16,16]">
        <!--推荐用户列表-->
        <a-col :span="6" :push="1">
          <!--拿到数据-->
          <template v-if="matchUserList && matchUserList.length > 0">
            <a-card style="width: 350px">
              <template #cover>
                <img alt="example"
                     src="https://memory-1318574676.cos.ap-nanjing.myqcloud.com/memory-chat/cat3.jpg?q-sign-algorithm=sha1&q-ak=AKIDzo8ZpFYKWfPX6axc2EpXaU5_2NvVNG7kfAW5SSVKQOoZc1-YCX-LiUkTpRp1wxNL&q-sign-time=1695111586;1695115186&q-key-time=1695111586;1695115186&q-header-list=host&q-url-param-list=ci-process&q-signature=99881b8d77719ea2715dba09a1e5160d2335fb49&x-cos-security-token=DXoTLoexyQSTnI8300hZnzqFbEjlGWvaea4765a47a6fda14bd340eb2e49ff482F6RfKcmKBFpwoA69cRpnxzRU75FL5ObZHv_aISUhoyOIrSHV2TweTYXhCT4JU-fd9s8Bs3IB9-VxHoUa1KUuMfXpX9AbL7wAsrGwvGtXWTHLEebhNpBKC4uumLgHeMRlcRtdTJt8iLzId1lHsD2qlyO5RFouZ7GvMBLwuX3QetW2VuA2_SMbTPxBdmN2Zy-s&ci-process=originImage"/>
              </template>
              <a-card-meta title="每周用户推荐">
              </a-card-meta>
              <a-list item-layout="horizontal" :data-source="matchUserList">
                <template #renderItem="{ item }">
                  <div class="container">
                    <!--用户头像-->
                    <div>
                      <a-avatar :src="item.avatarUrl"/>
                    </div>
                    <!--用户昵称 标签-->
                    <div>
                      <span>{{ item.username }}</span>

                      <div>
                        <a-tag color="green">green</a-tag>
                        <a-tag color="cyan">cyan</a-tag>
                        <a-tag color="blue">blue</a-tag>
                        <a-tag color="purple">purple</a-tag>
                      </div>
                    </div>
                    <!--匹配度-->
                    <div>
                      <span>
                        {{ item.percentage }}%
                      </span>
                    </div>
                  </div>
                </template>
              </a-list>

            </a-card>
          </template>
          <!--获取数据失败-->
          <template v-else>
            <a-empty/>
          </template>
        </a-col>

        <!--在线用户列表-->
        <a-col :span="10">
          <a-card class="infoList">
            <a-tabs v-model:activeKey="activeKey" class="centered-tabs" @change="handleTabChange">
              <!--在线用户列表-->
              <a-tab-pane key="1" tab="用户列表">
                <UserListPage :userInfo-list="userInfoList"/>
              </a-tab-pane>

              <!--在线队伍列表-->
              <a-tab-pane key="2" tab="队伍列表">
                <!--切换队伍-->
                <div>
                  <span>显示加密队伍</span>
                  <a-switch v-model:checked="checked"/>
                </div>
                <TeamListPage :teamInfo-list="teamInfoList"/>
              </a-tab-pane>

              <!--我的-->
              <a-tab-pane key="3" tab="我的">
                <UserInfoPage :user-info="currentUser"/>
              </a-tab-pane>
            </a-tabs>
          </a-card>
        </a-col>
      </a-row>
    </div>
  </div>


</template>

<script lang="ts" setup="ts">
import {ref, watchEffect} from 'vue';
import UserListPage from "@/components/userListPage.vue";
import TeamListPage from "@/components/teamListPage.vue";
import myAxios from "../plugins/myAxios";
import {onMounted} from "vue";
import UserInfoPage from "@/components/userInfoPage.vue";
import {message} from "ant-design-vue";
import getCurrentUser from "@/service/getCurrentUser";
import currentUser from "@/model/currentUser";
import router from "@/router";
import {ApiTwoTone, FireTwoTone} from '@ant-design/icons-vue';

const activeKey = ref('1');
const userInfoList = ref([]);
const teamInfoList = ref([]);

// 获取在线用户列表
const getUserList = () => {
  myAxios.get("/user/recommend", {
    params: {
      currentPage: 1,
      pageSize: 10
    }
  }).then((res) => {
    userInfoList.value = res.data.records;
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
    teamInfoList.value = res.data.records;
  });
}

// 推荐用户数量
const matchNum = ref(7)
// 推荐用户列表
const matchUserList = ref([]);
// 获取推荐用户
const getMatchUserList = () => {
  myAxios.get("/user/match", {
    params: {
      matchNum: matchNum.value
    }
  }).then((res) => {
    if (res.data !== null) {
      matchUserList.value = res.data.records;
    }
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

// 钩子函数
onMounted(() => {
  // 用户列表
  getUserList();
  // 当前登录用户信息
  getCurrentUser();
  // 推荐用户列表
  getMatchUserList();
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

// 注销警告状态
const visible = ref<boolean>(false);
// 注销警告展示
const showModal = () => {
  visible.value = true;
};
// 退出登录
const logout = () => {
  myAxios.post("/user/logout",).then(() => {
    currentUser.value = {}
    message.success("退出登录成功");
    location.reload(); // 刷新页面
  }).catch(() => {
    message.error("退出登录失败");
  });
  visible.value = false;
};

// 前往博客社区
const goToBlog = () => {
  router.push("/blog")
}

// 前往博客社区
const goToChat = () => {
  router.push("/chat")
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

.center {
  background-image: linear-gradient(135deg, #FF9D6C 10%, #BB4E75 100%);
  height: 2000px;
}

.matchUserInfo {
  width: 150px;
}

.infoList {
  width: 180%;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1);
}

.container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.container div{
  margin-bottom: 7px;
}
</style>


