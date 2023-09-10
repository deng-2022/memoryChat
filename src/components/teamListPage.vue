<template>
  <div>
    <div>
      <a-list
          item-layout="horizontal"
          :grid="{ gutter: 16, xs: 1, sm: 2, md: 4, lg: 4, xl: 6, xxl: 4 }"
          :data-source="props.teamInfoList"
      >
        <template #renderItem="{ item }">
          <a-list-item>
            <a-card hoverable class="teamInfoCard" @click="showDrawer(item.id)">
              <template #cover>
                <img alt="example" :src="item.imgUrl"/>
              </template>

              <a-card-meta :title="item.name">
                <template #description>{{ item.description }}</template>
              </a-card-meta>
              <div>
                <a-slider id="test" v-model:value="item.joinNum" :max="item.maxNum" disabled/>
                <span>{{ item.joinNum }}/{{ item.maxNum }}</span>
              </div>
            </a-card>

            <a-drawer
                :key="item.id"
                :title="item.name"
                placement="right"
                :closable="false"
                v-model:visible="visible[item.id]"
                :after-visible-change="afterVisibleChange"
            >
              <a-card>
                <!--队伍名片-->
                <template #cover>
                  <img alt="example" :src="item.imgUrl"/>
                </template>
                <!--队伍名 队伍介绍-->
                <a-card-meta>
                  <template #description>{{ item.description }}</template>
                </a-card-meta>
                <!--队伍成员-->
                <div>
                  <a-avatar-group>
                    <a-space :size="space">
                      <a-avatar src="https://deng-2022.gitee.io/blog/img/%E5%9B%9E%E5%BF%86%E5%A6%82%E5%88%9D.jpg"/>
                      <a-avatar src="https://deng-2022.gitee.io/blog/img/%E5%9B%9E%E5%BF%86%E5%A6%82%E5%88%9D.jpg"/>
                      <a-avatar src="https://deng-2022.gitee.io/blog/img/%E5%9B%9E%E5%BF%86%E5%A6%82%E5%88%9D.jpg"/>
                      <a-avatar src="https://deng-2022.gitee.io/blog/img/%E5%9B%9E%E5%BF%86%E5%A6%82%E5%88%9D.jpg"/>
                    </a-space>
                  </a-avatar-group>
                </div>
              </a-card>
              <!--加入队伍-->
              <a-space :size="120">
                <a-button size="large" type="primary" ghost>申请加入</a-button>
                <a-button size="large" type="primary" ghost>队伍聊天</a-button>
              </a-space>
            </a-drawer>
          </a-list-item>
        </template>
      </a-list>
    </div>
  </div>
</template>

<script setup lang="ts">
import {withDefaults, defineProps, ref} from "vue";

interface Props {
  teamInfoList: any[];
}

const props = withDefaults(defineProps<Props>(), {
  teamInfoList: () => [],
  name: "TeamListPage"
})

// 抽屉展示
const visible = ref({});
const showDrawer = (itemId: any) => {
  visible.value[itemId] = true;
}

const afterVisibleChange = (bool: boolean) => {
  console.log('visible', bool);
};

const space = ref("2px");
</script>

<style>
.teamInfoCard {
  width: 250px;
  height: 350px;
}
</style>