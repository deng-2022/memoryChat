<template>
  <a-affix :offset-top="0">
    <!--页头-->
    <a-page-header
        class="demo-page-header"
        style="border: 1px solid rgb(235, 237, 240);background: white"
        title="Memory"
        sub-title="Memory博客社区"
        @back="() => $router.go(-1)"
    >
      <template #extra>
        <div v-if="currentUser">
          <div>
            <a-button type="primary" ghost @click="goToBlog">前往博客页</a-button>
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

  <div>
    <a-card class="infoList" style="width: 100%;">
      <a-tabs v-model:activeKey="activeKey" class="centered-tabs" @change="handleTabChange">
        <a-tab-pane key="1" tab="博文">
        </a-tab-pane>
        <a-tab-pane key="2" tab="收藏">
        </a-tab-pane>
        <a-tab-pane key="3" tab="关注">
        </a-tab-pane>
        <a-tab-pane key="4" tab="粉丝">
        </a-tab-pane>
      </a-tabs>
    </a-card>
  </div>

</template>

<script lang="ts" setup="ts">
import {onMounted, ref} from 'vue';
import currentUser from "@/model/currentUser";
import getCurrentUser from "@/service/getCurrentUser";

const activeKey = ref('1');

// 监听Tab标签变化
const handleTabChange = (key: any) => {
  // 根据选项卡的key发送不同的请求
  if (key === "1") {
    // 当前登录用户信息
    getCurrentUser();
  } else if (key === "2") {
    // 当前登录用户信息
    getCurrentUser();
  } else if (key === "3") {
    // 当前登录用户信息
    getCurrentUser();
  } else if (key === "4") {
    // 当前登录用户信息
    getCurrentUser();
  }
}

// 钩子函数
onMounted(() => {
  // 当前登录用户信息
  getCurrentUser();
})
</script>

<style>
/*.infoList {*/
/*  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1);*/
/*}*/
</style>


