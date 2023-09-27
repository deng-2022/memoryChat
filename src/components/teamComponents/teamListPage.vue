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
                <a-progress :percent="(item.joinNum / item.maxNum * 100).toFixed(2)" size="small" status="active"/>
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
              <a-card style="margin-top: 60px">
                <!--群公告-->
                <div class="alert">
                  <div @click="info(item.announcement)">
                    <a-tooltip>
                      <template #title>点击查看详细公告内容</template>
                      <a-alert
                          show-icon
                          type="info"
                          :closable="false"
                          message="该队伍已发布新的队伍公告！"
                          style="width: 330px;cursor: pointer"
                      />
                    </a-tooltip>
                  </div>
                </div>
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
                <a-button size="large" type="primary" ghost @click="showConfirmModal">申请加入</a-button>
                <a-button size="large" type="primary" ghost>队伍聊天</a-button>
              </a-space>

              <div v-if="item.userId === currentUser.id">

              </div>
              <!--申请加密队伍确认框-->
              <a-modal v-model:visible="vis" title="提示" @ok="handleOk(item)" @close="onCloseModal">
                <p>申请加密队伍, 需要输入密码</p>
                <a-input placeholder="请输入密码" v-model:value="teamPassword">
                </a-input>
              </a-modal>
              <!--申请队伍确认框-->
              <a-modal
                  title="提示"
                  v-model:visible="joinedConfirm"
                  @ok="goToJoined(item)"
              >
                <p> 你确认要申请加入这个队伍吗？</p>
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
import {message, Modal} from "ant-design-vue";
import currentUser from "@/model/currentUser";
import {h} from 'vue';


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
const joinTeam = (teamInfo: any) => {
  if (teamInfo.status === 2) {
    showModal();
  } else {
    myAxios.post("/team/join", teamInfo).then((res) => {
      message.success("申请入队成功")
    }).catch(() => {
      console.log("加入失败")
    });
  }
};

// 申请弹窗
const vis = ref<boolean>(false);

const showModal = () => {
  vis.value = true;
};

// 确认
const handleOk = (teamInfo: any) => {
  vis.value = false;

  myAxios.post("/team/join", teamInfo)
      .then(() => {
        message.success("申请入队成功")
      }).catch(() => {
    console.log("加入失败")
  });
};

const teamPassword = ref("");
// 公告栏
const info = (announcement: any) => {
  Modal.info({
    title: () => '公告',
    content: () => h('div', {}, [
      h('p', `${announcement}`),
    ]),
    onOk() {
      console.log('ok');
    },
  });
};

// 确认申请弹窗
const joinedConfirm = ref<boolean>(false);
// 展示确认申请弹窗
const showConfirmModal = () => {
  joinedConfirm.value = true;
};
// 确定
const goToJoined = (teamInfo: any) => {
  joinedConfirm.value = false;
  joinTeam(teamInfo);
};
</script>

<style>
.teamInfoCard {
  position: relative;
  width: 250px;
  height: 350px;
}

.alert {
  position: absolute;
  top: -70px;
  right: 0;
  white-space: nowrap; /* 强制文本在一行显示 */
  overflow: hidden; /* 隐藏溢出的文本 */
  text-overflow: ellipsis; /* 使用省略号表示溢出的文本 */
}
</style>