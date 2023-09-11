<template>
  <div>
    <a-tabs v-model:activeKey="activeKey" tab-position="left" @change="handleTabChange">
      <a-tab-pane key="1" tab="已加入的队伍">已加入的队伍</a-tab-pane>
      <a-tab-pane key="2" tab="我创建的队伍">我创建的队伍</a-tab-pane>
      <a-tab-pane key="3" tab="我的好友">
        <a-list item-layout="horizontal" :data-source="friendList">
          <template #renderItem="{ item }">
            <a-list-item>
              <a-list-item-meta
                  description="Ant Design, a design language for background applications, is refined by Ant UED Team"
              >
                <template #title>
                  <a href="https://www.antdv.com/">{{ item.username }}</a>
                </template>
                <template #avatar>
                  <a-avatar :src="item.avatarUrl"/>
                </template>
              </a-list-item-meta>
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
import {message} from "ant-design-vue";

// 好友列表
const friendList = ref();

interface Props {
  userInfo: any[];
}

const props = withDefaults(defineProps<Props>(), {
  userInfo: () => [],
  name: "UserPage"
})

// 监听Tab标签变化
const handleTabChange = (key: any) => {
  // 根据选项卡的key发送不同的请求
  if (key === "3") {
    getFriendList();
  }
}

// 申请添加好友
const getFriendList = () => {
  myAxios.get("/friends/list",).then((res) => {
    friendList.value = res.records;
  }).catch(() => {
    console.log("加入失败")
  });
};

const activeKey = ref('1');
</script>