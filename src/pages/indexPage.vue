<template>
  <a-affix :offset-top="0">
    <a-page-header
        style="border: 1px solid rgb(235, 237, 240);background: white"
        title="Memory"
        sub-title="Memory畅聊社区"
    />
    <a-menu v-model:selectedKeys="current" mode="horizontal">
      <a-menu-item key="mail">
        <template #icon>
          <mail-outlined/>
        </template>
        Navigation One
      </a-menu-item>
      <a-menu-item key="app" disabled>
        <template #icon>
          <appstore-outlined/>
        </template>
        Navigation Two
      </a-menu-item>
      <a-sub-menu>
        <template #icon>
          <setting-outlined/>
        </template>
        <template #title>Navigation Three - Submenu</template>
        <a-menu-item-group title="Item 1">
          <a-menu-item key="setting:1">Option 1</a-menu-item>
          <a-menu-item key="setting:2">Option 2</a-menu-item>
        </a-menu-item-group>
        <a-menu-item-group title="Item 2">
          <a-menu-item key="setting:3">Option 3</a-menu-item>
          <a-menu-item key="setting:4">Option 4</a-menu-item>
        </a-menu-item-group>
      </a-sub-menu>
      <a-menu-item key="alipay">
        <a href="https://antdv.com" target="_blank" rel="noopener noreferrer">
          Navigation Four - Link
        </a>
      </a-menu-item>
    </a-menu>
  </a-affix>

  <a-divider/>

  <div>
    <a-row :gutter="[16,16]">
      <a-col :span="6" :push="1">
        <a-card class="a-card" style="width: 280px;height: 400px">
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
        <a-card class="a-card" style="width: 1200px;height: 800px">
          <a-tabs v-model:activeKey="activeKey" class="centered-tabs">
            <a-tab-pane key="1" tab="用户列表">
              在线用户列表
              <UserListPage :userInfo-list="userInfoList"/>
            </a-tab-pane>
            <a-tab-pane key="2" tab="队伍列表">
              在线队伍列表
              <TeamListPage :teamInfo-list="teamInfoList"/>
            </a-tab-pane>
            <a-tab-pane key="3" tab="聊天大厅">
              聊天大厅
            </a-tab-pane>
            <a-tab-pane key="4" tab="我的">
              我的
            </a-tab-pane>
          </a-tabs>
          <div>
            <a-card hoverable style="width: 300px">
              <template #cover>
                <img alt="example"
                     src="http://rza7uevjr.hn-bkt.clouddn.com/%E5%8A%A8%E6%BC%AB%E6%8F%92%E7%94%BB/bradge.jpg?e=1694248940&token=7EF9y7gF9x4urpXC9ka8c_DxTxDTfH_jYaTCfmkr:Tzl7PgQpltWiFPi5tyBoeC9DISQ="/>
              </template>
              <a-card-meta title="Europe Street beat">
                <template #description>www.instagram.com</template>
              </a-card-meta>
            </a-card>
          </div>
        </a-card>
      </a-col>
    </a-row>
  </div>

</template>

<script lang="ts" setup="ts">
import {ref} from 'vue';
import UserListPage from "@/components/userListPage.vue";
import TeamListPage from "@/components/teamListPage.vue";

const current = ref<string[]>(['mail']);
const activeKey = ref('1');
const userInfoList = ref([]);
const teamInfoList = ref([]);

import myAxios from "../plugins/myAxios";
import {onMounted} from "vue";

const getList = ()=>{
  myAxios.get("/user/recommend", {
    params: {
      currentPage: 1,
      pageSize: 10
    }
  }).then((res) => {
    userInfoList.value = res.records;
  });

  myAxios.get("/team/list/page", {
    params: {
      currentPage: 1,
      pageSize: 10
    }
  }).then((res) => {
    teamInfoList.value = res.records;
  });
}

onMounted(() => {
  getList();
})
</script>

<style>
.a-card {
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1);
}
</style>


