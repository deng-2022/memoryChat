<template>
  <!--用户登录表单-->
  <div class="container">
    <a-card class="userLoginForm">
      <a-form @submit="handleSubmit">
        <a-form-item label="用户名" name="username"
                     :rules="[{ required: true, message: '请输入用户名' }]">
          <a-input :placeholder="'请输入用户名'" v-model:value="userAccount"/>
        </a-form-item>

        <a-form-item label="密码" name="userPassword"
                     :rules="[{ required: true, message: '请输入密码' }]">
          <a-input :type="'password'" :placeholder="'请输入密码'" v-model:value="userPassword"
          />
        </a-form-item>

        <a-form-item>
          <a-button type="primary" html-type="submit">登录</a-button>
        </a-form-item>
      </a-form>
    </a-card>
  </div>
</template>

<script lang="ts" setup>
import MyAxios from "@/plugins/myAxios";
import {ref} from "vue";

// 用户名 密码
const userAccount = ref("");
const userPassword = ref("");

// 登录请求
const handleSubmit = () => {
  MyAxios.post("/user/login", {
    userAccount: userAccount.value,
    userPassword: userPassword.value,
  })
      .then((values) => {
        // 处理表单提交逻辑
        console.log('表单数据：', values);
      })
      .catch((error) => {
        console.error('表单验证失败：', error);
      });
};

</script>

<style>

</style>