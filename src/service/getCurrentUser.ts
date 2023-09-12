// 获取当前登录用户
import myAxios from "@/plugins/myAxios";
import currentUser from "@/model/currentUser";

const getCurrentUser = () => {
    myAxios.get("/user/currentUser",).then((res) => {
        currentUser.value = res.data;

    }).catch(() => {
        console.log("获取用户列表失败")
    });
}

export default getCurrentUser;