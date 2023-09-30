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

    <div style="display: flex;">
      <a-card style="width: 70%;margin-left: 1.5%;margin-bottom: 20px">
        <a-tabs v-model:activeKey="activeKey" class="centered-tabs" @change="handleTabChange">
          <!--博文列表-->
          <a-tab-pane key="1" tab="博文">
            <a-list
                item-layout="horizontal"
                :data-source="articleList">

              <template #renderItem="{ item }">
                <a-list-item>
                  <div class="article">
                    <!--博文-->
                    <a-card hoverable>
                      <!--操作-->
                      <template #actions>
                        <LikeTwoTone style="font-size: 18px" key="like"
                                     :twoToneColor="item.isLiked ? '#ff4d4f' : '#b0c4d8'"
                                     @click="toggleLike(item)"/>

                        <HeartTwoTone style="font-size: 18px" key="collect"
                                      :twoToneColor="item.isCollected ? '#ff4d4f' : '#b0c4d8'"
                                      @click="toggleCollect(item)"
                        />
                        <MessageTwoTone @click="goToRead(item.id)" style="font-size: 18px" key="comment"
                                        :twoToneColor="item.isComment ? '#ff4d4f' : '#b0c4d8'"
                        />
                      </template>
                      <div style="position: absolute;left: 195px;top:297px;display: flex">
                        <div style="margin-right: 335px">
                          {{ item.likes }}
                        </div>
                        <div style="margin-right: 335px">
                          {{ item.collects }}
                        </div>
                        <div>
                          {{ item.comments }}
                        </div>
                      </div>

                      <div @click="goToRead(item.id)">
                        <!--标题-->
                        <a-card-meta :title="item.title">
                          <!--文章信息-->

                          <template #description>
                            <div style="margin-top: 10px">
                              <span> <ClockCircleTwoTone/> 创建于 {{ item.createTime }}</span>
                              <span style="margin-left: 12px"> <ClockCircleTwoTone/> 更新于 {{ item.updateTime }}</span>
                              <span style="margin-left: 12px"> <EyeTwoTone/> 浏览量 {{ item.view }}</span>
                            </div>
                          </template>
                        </a-card-meta>

                        <!--其他信息-->
                        <div style="position: relative">
                          <!--文章简介-->
                          <div style="position: absolute;width: 60%;margin-top: 20px">
                            {{ item.description }} {{ item.description }} {{ item.description }} {{ item.description }}
                            {{ item.description }} {{ item.description }}
                          </div>
                          <!--作者信息-->
                          <a-avatar style="position: absolute; top: 150px;left: 25px" size="large"
                                    :src="item.author.avatarUrl"/>
                          <div style="position: absolute;top: 160px;left: 80px;">
                            <a-tag color="green"> {{ item.author.username }}</a-tag>
                          </div>
                          <div style="position: absolute;top: 160px;left: 300px">
                            <a-tag color="orange">orange</a-tag>
                            <a-tag color="green">green</a-tag>
                            <a-tag color="cyan">cyan</a-tag>
                            <a-tag color="blue">blue</a-tag>
                          </div>
                          <!--文章配图-->
                          <div style="margin-left: 65%">
                            <img style="width: 300px" :src="item.articleUrl">
                          </div>
                        </div>
                      </div>
                    </a-card>
                  </div>
                </a-list-item>
              </template>
            </a-list>
          </a-tab-pane>

          <a-tab-pane key="2" tab="收藏">
            <a-list
                class="demo-loadmore-list"
                item-layout="horizontal"
                :data-source="articleList"
            >
              <template #renderItem="{ item }">
                <a-list-item>
                  <!--文章操作-->
                  <template #actions>
                    <a @click="goToRead(item.id)">查看</a>
                    <a>删除</a>
                  </template>

                  <a-list-item-meta
                      :description="item.description"
                  >
                    <template #title>
                      <a @click="goToRead(item.id)">{{ item.title }}</a>
                    </template>

                  </a-list-item-meta>

                  <!--文章标签-->
                  <div style="position: absolute;left: 520px; ">
                    <a-tag color="orange">orange</a-tag>
                    <a-tag color="green">green</a-tag>
                    <a-tag color="cyan">cyan</a-tag>
                    <a-tag color="blue">blue</a-tag>
                  </div>

                  <div style="position:absolute; margin-left: 70%">
                    <!--文章配图-->
                    <img style="width: 120px" :src="item.articleUrl">
                  </div>
                </a-list-item>
              </template>
            </a-list>
          </a-tab-pane>

          <a-tab-pane key="3" tab="关注">
          </a-tab-pane>

          <a-tab-pane key="4" tab="粉丝">
          </a-tab-pane>
        </a-tabs>
      </a-card>

      <a-affix offset-top="10">
        <!--每周推荐用户-->
        <a-card style="width: 420px; margin-left: 18px;height: 800px">
          <template #cover>
            <img alt="example"
                 src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
            >
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
                    <div style="width: 20px">
<!--                      <a-progress type="circle"  :percent="item.percentage"  />-->
                      {{item.percentage}}%
                    </div>
                  </div>
                </a-list-item>
              </template>
            </a-list>
          </template>

          <!--获取数据失败-->
          <template v-else>
            <a-empty/>
          </template>
        </a-card>
      </a-affix>

    </div>
  </div>

  <a-back-top/>
</template>

<script lang="ts" setup="ts">
import {onMounted, ref} from 'vue';
import currentUser from "@/model/currentUser";
import getCurrentUser from "@/service/getCurrentUser";
import router from "@/router";
import myAxios from "@/plugins/myAxios";
import {
  MessageTwoTone,
  HeartTwoTone,
  LikeTwoTone,
  ClockCircleTwoTone,
  EyeTwoTone,
  ApiTwoTone
} from '@ant-design/icons-vue';
import {message} from "ant-design-vue";

// 点赞
const toggleLike = (item) => {
  item.isLiked = !item.isLiked
  if (item.isLiked) {
    message.success("点赞成功")
  } else {
    message.success("已取消点赞")
  }
}
// 收藏
const toggleCollect = (item) => {
  item.isCollected = !item.isCollected
  if (item.isCollected) {
    message.success("收藏成功")
  } else {
    message.success("已取消收藏")
  }
}

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
  myAxios.get("/article/list/VO", {
    params: {
      currentPage: 1,
      pageSize: 5
    }
  }).then((res) => {
    if (res.data !== null) {
      articleList.value = res.data.records.map((article: any) => {
        return {
          ...article,
          isLiked: false,
          isCollected: false,
          isComment: false
        };
      });
    }
  });
}

// 钩子函数
onMounted(() => {
  message.info('欢迎进入博文社区，祝您学习愉快！')
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
const matchNum = ref(5)
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

// 跳转博文详情页
const goToRead = (id: never) => {
  // router.push(`/blog/read/${id}`)
  router.push({
    name: "blogRead",
    path: "/blog/read",
    query: {
      articleId: id
    }
  })
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


