<template>
  <div class="articleInfo ">
    <a-affix offset-top="0">
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
      <a-affix offset-top="10">
        <!--文章数据-->
        <div style="display: flex;flex-direction: column;  align-items: center; margin-right: -400px;">
          <div class="heart-icon">
            <LikeTwoTone hover style="font-size: 40px;margin-bottom: 18px" key="like"/>
          </div>
          <div class="heart-icon">
            <HeartTwoTone style="font-size: 40px;margin-bottom: 18px" key="collect"/>
          </div>
          <div class="heart-icon">
            <MessageTwoTone style="font-size: 40px" key="comment"/>
          </div>
        </div>
      </a-affix>


      <!--文章信息-->
      <div style="width: 60%;margin-left: 15%;  min-height: 85vh;margin-bottom: 20px">
        <!--正文-->
        <a-card>
          <!--标题-->
          <h1>{{ articleInfo.title }}</h1>
          <div style="position: absolute;top:102px;left: 600px">
            <a-tag color="orange">orange</a-tag>
            <a-tag color="green">green</a-tag>
            <a-tag color="cyan">cyan</a-tag>
            <a-tag color="blue">blue</a-tag>
          </div>
          <a-card-meta>
            <!--文章信息-->
            <template #description>
              <div style="font-size: medium">
                <span> <ClockCircleTwoTone/> 创建于 {{ articleInfo.createTime }}</span>
                <span style="margin-left: 12px"> <ClockCircleTwoTone/> 更新于 {{ articleInfo.updateTime }}</span>
                <span style="margin-left: 12px"> <EyeTwoTone/> 浏览量 {{ articleInfo.view }}</span>
              </div>
            </template>
          </a-card-meta>
          <!--其他信息-->
          <div style="position: relative">
            <!--文章内容-->
            <div v-html="parsedContent"
                 style="margin-left: 10px; margin-right: 10px; margin-top: 20px;">
            </div>
          </div>
        </a-card>

        <!--评论区-->
        <a-card style="margin-top: 30px">
          <template #title>评论区</template>
          <a-list
              class="comment-list"
              :header="`${data.length} replies`"
              item-layout="horizontal"
              :data-source="data"
          >
            <template #renderItem="{ item }">
              <a-list-item>
                <a-comment :author="item.author" :avatar="item.avatar">
                  <template #actions>
                    <span v-for="(action, index) in item.actions" :key="index">{{ action }}</span>
                  </template>
                  <template #content>
                    <p>
                      {{ item.content }}
                    </p>
                  </template>
                  <template #datetime>
                    <a-tooltip :title="item.datetime.format('YYYY-MM-DD HH:mm:ss')">
                      <span>{{ item.datetime.fromNow() }}</span>
                    </a-tooltip>
                  </template>
                </a-comment>
              </a-list-item>
            </template>
          </a-list>
        </a-card>
      </div>


      <a-affix offset-top="10">
        <!--作者信息-->
        <a-card style="width: 280px; margin-left: 24px;">
          <div class="container">
            <div style="display: flex">
              <div>
                <a-avatar style="position: absolute; top: 50px;left: 25px" size="large"
                          :src="authorInfo.avatarUrl"/>
              </div>

              <div>
                <a-list-item-meta
                    :description="authorInfo.email"
                >
                  <template #title>
                    <a href="https://www.antdv.com/">{{ authorInfo.username }} </a>
                  </template>
                </a-list-item-meta>
              </div>
            </div>
            <div style="display: flex;font-size: larger;margin: 8px 0">
            <span>
              <div style="color: dodgerblue;margin-left: 10px">{{ authorInfo.articleNum }}</div>
              <div><a style="color: black">文章</a></div>
            </span>
              <span style="margin-left:50px">
               <div style="color: dodgerblue;margin-left: 10px">{{ authorInfo.likes }}</div>
              <div><a style="color: black">获赞</a></div>
            </span>
              <span style="margin-left:50px">
               <div style="color: dodgerblue;margin-left: 10px">{{ authorInfo.fans }}</div>
              <div><a style="color: black">粉丝</a></div>
            </span>
            </div>
            <div style="margin-top: 5px">
              <a-button size="large" danger type="primary">
                关注
              </a-button>
              <a-button size="large" type="primary" ghost style="margin-left:50px">私信</a-button>
            </div>
          </div>
        </a-card>
      </a-affix>
    </div>
  </div>

  <a-back-top/>
</template>

<script lang="ts" setup="ts">
import {onMounted, ref, watchEffect} from 'vue';
import currentUser from "@/model/currentUser";
import myAxios from "@/plugins/myAxios";
import {
  MessageTwoTone,
  HeartTwoTone,
  LikeTwoTone,
  ClockCircleTwoTone,
  EyeTwoTone,
  ApiTwoTone
} from '@ant-design/icons-vue';
import {useRoute} from 'vue-router';
import MarkdownIt from 'markdown-it';

const show = ref(false);

onMounted(() => {
  show.value = true;
});
// Markdown语法
const parsedContent = ref()

const articleInfo = ref({});
const authorInfo = ref({});
const route = useRoute();
const articleId = ref();
// 获取id值
articleId.value = route.query.articleId;

onMounted(() => {
  // 获取文章及作者信息
  getArticle();
  window.scrollTo(0, 0);
})

const getArticle = () => {
  myAxios.get("/article/get/VO", {
    params: {
      id: articleId.value
    }
  }).then((res) => {
    articleInfo.value = res.data;
    authorInfo.value = articleInfo.value.author;

    const md = new MarkdownIt();
    parsedContent.value = md.render(articleInfo.value.content);
  }).catch(() => {
    console.log("获取文章信息失败")
  });
}

import moment from 'moment';

const data = [
  {
    actions: ['Reply to'],
    author: 'Han Solo',
    avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
    content:
        'We supply a series of design principles, practical patterns and high quality design resources (Sketch and Axure), to help people create their product prototypes beautifully and efficiently.',
    datetime: moment().subtract(1, 'days'),
  },
  {
    actions: ['Reply to'],
    author: 'Han Solo',
    avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
    content:
        'We supply a series of design principles, practical patterns and high quality design resources (Sketch and Axure), to help people create their product prototypes beautifully and efficiently.',
    datetime: moment().subtract(2, 'days'),
  },
]
moment();

</script>

<style>
.articleInfo {
  background-image: linear-gradient(-225deg, #AC32E4 0%, #7918F2 48%, #4801FF 100%);
}

.container {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
}

.heart-icon:hover {
  color: red;
  cursor: pointer;
}

.fade-in-out {
  animation: fadeInOut 5s;
}

@keyframes fadeInOut {
  0% {
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}
</style>





