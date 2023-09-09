<template>
  <div>
    哈哈
    <a-list
        item-layout="horizontal"
        :grid="{ gutter: 16, xs: 1, sm: 2, md: 4, lg: 4, xl: 6, xxl: 6 }"
        :data-source="props.teamInfoList"
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
    hh1

  </div>
</template>

<script setup lang="ts">
import {withDefaults, defineProps} from "vue";

interface Props {
  teamInfoList: any[];
}

const props = withDefaults(defineProps<Props>(), {
  teamInfoList: () => [],
  name: "UserListPage"
})

</script>