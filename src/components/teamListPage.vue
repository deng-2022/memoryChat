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
              <!--队伍状态-->
              <div v-if="item.status === 0">
                <a-tag color="green" style="position: absolute; left:36%;bottom:5%;font-size: large"> 公开
                </a-tag>
              </div>
              <div v-else-if="item.status === 2">
                <a-tag color="red" style="position: absolute; left:38%;top:88%;font-size: large"> 加密
                </a-tag>
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
                <a-card-meta style="margin: 15px 0">
                  <template #description>
                    <span style="font-size: large">
                     {{ item.description }}
                      </span>
                  </template>

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
                <!--队伍状态-->
                <div v-if="item.status === 0">
                  <a-tag color="green" style="position: absolute; left:38%;top: 120%;font-size: large"> 公开
                  </a-tag>
                </div>
                <div v-else-if="item.status === 2">
                  <a-tag color="red" style="position: absolute; left:38%;top:120%;font-size: large"> 加密
                  </a-tag>
                </div>
              </a-card>
              <!--加入队伍-->
              <a-space :size="120" style="margin-left: 10px;margin-top: 10px">
                <a-button size="large" type="primary" ghost @click="joinTeam(item)">申请加入</a-button>
                <a-button size="large" type="primary" ghost>队伍聊天</a-button>
              </a-space>

              <div v-if="item.userId === currentUser.id">

              </div>

              <a-modal v-model:visible="vis" title="提示" @ok="handleOk" @close="onCloseModal">
                <p>申请加密队伍, 需要输入密码</p>
                <a-input placeholder="请输入密码" v-model:value="teamPassword">
                </a-input>
              </a-modal>
            </a-drawer>
          </a-list-item>
        </template>
      </a-list>
    </div>
  </div>
</template>

<script setup lang="ts">
import {withDefaults, defineProps, ref} from "vue";
import myAxios from "@/plugins/myAxios";
import TeamInfo from "@/type/teamInfo";
import {message} from "ant-design-vue";
import currentUser from "@/model/currentUser";

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
// 监听抽屉状态
const afterVisibleChange = (bool: boolean) => {
  console.log('visible', bool);
};

const space = ref("4px");

// 申请加入队伍
const joinTeam = (teamInfo: TeamInfo) => {
  if (teamInfo.status === 2) {
    showModal();
  }

  myAxios.post("/team/join", teamInfo).then((res) => {
    message.success("申请入队成功")
  }).catch(() => {
    console.log("加入失败")
  });
};

// 弹窗
const vis = ref<boolean>(false);

const showModal = () => {
  vis.value = true;
};

const handleOk = (e: MouseEvent) => {
  console.log(e);
  vis.value = false;
};

const teamPassword = ref("");

</script>

<style>
.teamInfoCard {
  position: relative;
  width: 250px;
  height: 350px;
}
</style>