<template>
  <div>
    <!--拿到数据-->
    <template v-if="userInfoList && userInfoList.length > 0">
      <a-list
          item-layout="horizontal"
          :grid="{ gutter: 16, xs: 1, sm: 2, md: 4, lg: 4, xl: 6, xxl: 6 }"
          :data-source="props.userInfoList"
      >
        <template #renderItem="{ item }">
          <a-list-item>
            <a-card hoverable>
              <template #cover>
                <img alt="example" :src="item.avatarUrl"/>
              </template>

              <a-card-meta :title="item.username">
                <template #description>{{ item.profile }}</template>
              </a-card-meta>
            </a-card>
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
import {withDefaults, defineProps} from "vue";

interface Props {
  userInfoList: any[];
}

const props = withDefaults(defineProps<Props>(), {
  userInfoList: () => [],
  name: "UserListPage"
})
</script>