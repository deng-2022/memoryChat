<template>
  <div class="index">
    <a-affix :offset-top="0">
      <!--页头-->
      <a-page-header
          class="demo-page-header"
          style="border: 1px solid rgb(235, 237, 240);background: white"
          title="Memory畅聊社区"
          sub-title="组队交友"
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
      <a-row :gutter="[16,16]">
        <a-col :span="5" :push="1">
          <a-card class="infoList" style="width: 220px;height: 400px">
            <template #cover>
              <img alt="example"
                   src="https://memory-1318574676.cos.ap-nanjing.myqcloud.com/memory-chat/cat3.jpg?q-sign-algorithm=sha1&q-ak=AKID_30LRemOGWipTSYklSI21gZDoQz9DBD2WMOorBwaNbRSrCyJutIkHZnmn6teuvGY&q-sign-time=1694832694;1694836294&q-key-time=1694832694;1694836294&q-header-list=host&q-url-param-list=ci-process&q-signature=bfe197b2440c06369b82f95eb2ae2219e17394d8&x-cos-security-token=bBfp2RyIi3xpLBk6FztpjwRg65k02OLa3bcaea542a244f819058117bf5f36ec4HnQt_M3GYeyaQgqcorJa0l0ksJt795J7brVOTGEZO7EQYA2p8mjH5mjciERlEmuYaNR496MF75mxYfXEIjudDG_QWi9LEsAwjGuYPSvpKMQNsmdKRwJZnfrXrzJ8C5WVUUr9F0iZEkQASXNwqel66qgtrS7DLXWrk19aDfspeUeWXRw5McInaUipE-QfsB2-&ci-process=originImage"/>
            </template>
            <a-card-meta title="本周推荐用户">
              <template #description></template>
            </a-card-meta>
          </a-card>
        </a-col>

        <a-col :span="10">
          <a-card class="infoList" style="width: 180%;">
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
</script>

<style>
/*.index {*/
/*  background: deepskyblue;*/
/*}*/

.infoList {
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1);
}
</style>


