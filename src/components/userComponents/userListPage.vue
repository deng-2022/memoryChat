<template>
  <div>
    <!--拿到数据-->
    <template v-if="userInfoList && userInfoList.length > 0">
      <a-list
          item-layout="horizontal"
          :grid="{ gutter: 16, xs: 1, sm: 2, md: 4, lg: 4, xl: 6, xxl: 5 }"
          :data-source="props.userInfoList"
          class="userList"
      >
        <template #renderItem="{ item }">
          <a-list-item>
            <a-card hoverable class="userInfo" @click="showDrawer(item.id)">
              <template #cover>
                <img alt="example" :src="item.avatarUrl"/>
              </template>

              <a-card-meta :title=" item.username">
                <template #description>{{ item.profile }}</template>
              </a-card-meta>

              <div>
                <a-tag color="green">green</a-tag>
                <a-tag color="cyan">cyan</a-tag>
                <a-tag color="blue">blue</a-tag>
                <a-tag color="purple">purple</a-tag>
              </div>
            </a-card>

            <a-drawer
                :key="item.id"
                :title="item.username"
                placement="right"
                :closable="false"
                v-model:visible="visible[item.id]"
                :after-visible-change="afterVisibleChange"
            >
              <a-card>
                <div>
                  <van-notice-bar
                      left-icon="volume-o"
                      text="盛年不重来，一日难再晨。及时当勉励，岁月不待人。"
                  />
                </div>
                <!--队伍名片-->
                <template #cover>
                  <img alt="example" :src="item.avatarUrl"/>
                </template>
                <!--队伍名 队伍介绍-->
                <a-card-meta>
                  <template #description>
                    <div style="margin-bottom: 20px">{{ item.profile }}</div>
                  </template>
                </a-card-meta>
                <!--队伍成员-->
                <div>
                  <a-avatar-group>
                    <a-space :size="space">
                      <a-tag color="orange">orange</a-tag>
                      <a-tag color="green">green</a-tag>
                      <a-tag color="cyan">cyan</a-tag>
                      <a-tag color="blue">blue</a-tag>
                      <a-tag color="purple">purple</a-tag>
                    </a-space>
                  </a-avatar-group>
                </div>
              </a-card>
              <!--加入队伍-->
              <a-space :size="120">
                <a-button size="large" type="primary" danger @click="addFriends(item)" style="margin-left: 24px">
                  加好友
                </a-button>
                <a-button size="large" type="primary" ghost>聊天</a-button>
              </a-space>
            </a-drawer>
          </a-list-item>
        </template>
      </a-list>
    </template>
    <!--获取数据失败-->
    <template v-else>
      <a-empty/>
    </template>
  </div>
</template>

<script setup lang="ts">
import {withDefaults, defineProps, ref} from "vue";
import myAxios from "@/plugins/myAxios";
import {message} from "ant-design-vue";
import userInfo from "@/type/userInfo";

interface Props {
  userInfoList: any[];
}

const props = withDefaults(defineProps<Props>(), {
  userInfoList: () => [],
  name: "UserListPage"
})

// 抽屉展示
const visible = ref({});
const showDrawer = (itemId: any) => {
  visible.value[itemId] = true;
}
// 监听抽屉状态
const afterVisibleChange = (bool: boolean) => {
  console.log('visible', bool);
};

// 申请添加好友
const addFriends = (friend: userInfo) => {
  myAxios.post("/friends/add", {
    id: friend.id
  }).then((res) => {
    message.success("成功发送好友申请")
  }).catch(() => {
    console.log("加入失败")
  });
};

const space = ref("2px");
</script>

<style>
.userList {
  overflow-y: scroll;
  height: 600px;
}

.userInfo {
  width: 200px;
  height: 350px;
}
</style>