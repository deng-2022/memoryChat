<template>
  <div class="blog">
    <a-affix :offset-top="0">
      <!--页头-->
      <a-page-header
          class="demo-page-header"
          style="border: 1px solid rgb(235, 237, 240); background: rgba(255, 255, 255, 0.5)"
          title="Memory畅聊社区"
          sub-title="博客社区"
          @back="() => $router.go(-1)"
      >
        <template #extra>
          <div class="goToPage1">
            <EyeTwoTone  class="icon" style="font-size: 25px;"/>
            <span><a @click="goToCenter">用户中心</a></span>
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


    <div>
      <a-card class="infoList" style="width: 100%;">
        <a-tabs v-model:activeKey="activeKey" class="centered-tabs" @change="handleTabChange">
          <a-tab-pane key="1" tab="博文">
            <a-list item-layout="horizontal" :data-source="articleList">
              <template #renderItem="{ item }">
                <a-list-item>
                  <a-list-item-meta
                      :description="item.description"
                  >
                    <template #title>
                      <a href="https://www.antdv.com/">{{ item.title }}</a>
                    </template>
                    <template #avatar>
                      <a-avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"/>
                    </template>
                  </a-list-item-meta>
                </a-list-item>
              </template>
            </a-list>
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
  </div>
</template>

<script lang="ts" setup="ts">
import {onMounted, ref} from 'vue';
import currentUser from "@/model/currentUser";
import getCurrentUser from "@/service/getCurrentUser";
import router from "@/router";
import myAxios from "@/plugins/myAxios";
import {EyeTwoTone , ApiTwoTone} from '@ant-design/icons-vue';

const activeKey = ref('1');

const articleList = ref([]);

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

// 获取博文列表
const getArticleList = () => {
  myAxios.get("/article/list", {
    params: {
      currentPage: 1,
      pageSize: 20
    }
  }).then((res) => {
    if (res.data !== null) {
      articleList.value = res.data.records;
    }
  });
}

// 钩子函数
onMounted(() => {
  // 当前登录用户信息
  getCurrentUser();
  // 获取博文列表
  getArticleList();
})

// 前往用户中心
const goToCenter = () => {
  router.push("/")
}

// 前往聊天大厅
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

.blog {
  background-image: linear-gradient( 135deg, #52E5E7 10%, #130CB7 100%);
  height: 2000px;
}

/*.infoList {*/
/*  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1);*/
/*}*/
</style>


