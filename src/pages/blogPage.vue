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
            <EyeTwoTone class="icon" style="font-size: 25px;"/>
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


    <div style="display: flex">
      <!--博文列表-->
      <a-card style="width: 70%;margin-left: 1.5%;">
        <a-tabs v-model:activeKey="activeKey" class="centered-tabs" @change="handleTabChange">
          <a-tab-pane key="1" tab="博文">
            <!--            <a-card>-->
            <!--              <a-list item-layout="horizontal" :data-source="articleList">-->
            <!--              <template #renderItem="{ item }">-->
            <!--                <a-list-item>-->
            <!--                  <a-list-item-meta-->
            <!--                      :description="item.description"-->
            <!--                  >-->
            <!--                    <template #title>-->
            <!--                      <a href="https://www.antdv.com/">{{ item.title }}</a>-->
            <!--                    </template>-->
            <!--                    <template #avatar>-->
            <!--                      <a-avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"/>-->
            <!--                    </template>-->
            <!--                  </a-list-item-meta>-->
            <!--                </a-list-item>-->
            <!--              </template>-->
            <!--              </a-list>-->
            <!--            </a-card>-->

            <div class="articles">
              <div class="article">
                <a-card hoverable>
                  <a-card-meta title="Europe Street beat">
                    <template #description>www.instagram.com</template>
                  </a-card-meta>
                </a-card>
              </div>

              <div class="article">
                <a-card hoverable >
                  <a-card-meta title="Europe Street beat">
                    <template #description>www.instagram.com</template>
                  </a-card-meta>
                </a-card>
              </div>

              <div class="article">
                <a-card hoverable>
                  <a-card-meta title="Europe Street beat">
                    <template #description>www.instagram.com</template>
                  </a-card-meta>
                </a-card>
              </div>
            </div>
          </a-tab-pane>
          <a-tab-pane key="2" tab="收藏">
          </a-tab-pane>
          <a-tab-pane key="3" tab="关注">
          </a-tab-pane>
          <a-tab-pane key="4" tab="粉丝">
          </a-tab-pane>
        </a-tabs>
      </a-card>
      <!--每周推荐用户-->
      <a-card class="infoList" style="width: 26%; margin-left: 1%">
        <template #cover>
          <img alt="example"
               src="https://memory-1318574676.cos.ap-nanjing.myqcloud.com/memory-chat/cat3.jpg?q-sign-algorithm=sha1&q-ak=AKIDzo8ZpFYKWfPX6axc2EpXaU5_2NvVNG7kfAW5SSVKQOoZc1-YCX-LiUkTpRp1wxNL&q-sign-time=1695111586;1695115186&q-key-time=1695111586;1695115186&q-header-list=host&q-url-param-list=ci-process&q-signature=99881b8d77719ea2715dba09a1e5160d2335fb49&x-cos-security-token=DXoTLoexyQSTnI8300hZnzqFbEjlGWvaea4765a47a6fda14bd340eb2e49ff482F6RfKcmKBFpwoA69cRpnxzRU75FL5ObZHv_aISUhoyOIrSHV2TweTYXhCT4JU-fd9s8Bs3IB9-VxHoUa1KUuMfXpX9AbL7wAsrGwvGtXWTHLEebhNpBKC4uumLgHeMRlcRtdTJt8iLzId1lHsD2qlyO5RFouZ7GvMBLwuX3QetW2VuA2_SMbTPxBdmN2Zy-s&ci-process=originImage"/>
        </template>
        <a-card-meta title="每周用户推荐">
        </a-card-meta>
        <!--拿到数据-->
        <template v-if="matchUserList && matchUserList.length > 0">
          <a-list item-layout="horizontal" :data-source="matchUserList">
            <template #renderItem="{ item }">
              <a-list-item>
                <div class="container">
                  <!--用户头像-->
                  <div>
                    <a-avatar :src="item.avatarUrl"/>
                  </div>
                  <!--用户昵称 标签-->
                  <div>
                    <span>{{ item.username }}</span>

                    <div style="padding: 5px 10px">
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
              </a-list-item>
            </template>
          </a-list>
        </template>

        <!--获取数据失败-->
        <template v-else>
          <a-card style="width: 350px">
            <template #cover>
              <img alt="example"
                   src="https://memory-1318574676.cos.ap-nanjing.myqcloud.com/memory-chat/cat3.jpg?q-sign-algorithm=sha1&q-ak=AKIDzo8ZpFYKWfPX6axc2EpXaU5_2NvVNG7kfAW5SSVKQOoZc1-YCX-LiUkTpRp1wxNL&q-sign-time=1695111586;1695115186&q-key-time=1695111586;1695115186&q-header-list=host&q-url-param-list=ci-process&q-signature=99881b8d77719ea2715dba09a1e5160d2335fb49&x-cos-security-token=DXoTLoexyQSTnI8300hZnzqFbEjlGWvaea4765a47a6fda14bd340eb2e49ff482F6RfKcmKBFpwoA69cRpnxzRU75FL5ObZHv_aISUhoyOIrSHV2TweTYXhCT4JU-fd9s8Bs3IB9-VxHoUa1KUuMfXpX9AbL7wAsrGwvGtXWTHLEebhNpBKC4uumLgHeMRlcRtdTJt8iLzId1lHsD2qlyO5RFouZ7GvMBLwuX3QetW2VuA2_SMbTPxBdmN2Zy-s&ci-process=originImage"/>
            </template>
            <a-card-meta title="每周用户推荐">
            </a-card-meta>
          </a-card>
          <a-empty/>
        </template>
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
import {EyeTwoTone, ApiTwoTone} from '@ant-design/icons-vue';
import {message} from "ant-design-vue";

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
  // 每周推荐用户
  getMatchUserList();
})

// 前往用户中心
const goToCenter = () => {
  router.push("/")
}

// 前往聊天大厅
const goToChat = () => {
  if (!currentUser.value) {
    message.warning("请先登录")
  } else {
    router.push("/chat")
  }
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
  background-image: linear-gradient(135deg, #52E5E7 10%, #130CB7 100%);
  height: 2000px;
}

.container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.container div {
  margin-bottom: 7px;
}

.article {
  width: 100%;
  margin-bottom: 30px;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1);
}


/*.infoList {*/
/*  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1);*/
/*}*/
</style>


