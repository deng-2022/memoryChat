<template>
  <div>
    <a-button type="primary" ghost>我加入的队伍</a-button>
  </div>
  <div>
    <a-button type="primary">我创建的队伍</a-button>
  </div>
</template>

<script setup lang="ts">
import {withDefaults, defineProps} from "vue";

interface Props {
  userInfo: any[];
}

const props = withDefaults(defineProps<Props>(), {
  userInfo: () => [],
  name: "UserPage"
})
</script>