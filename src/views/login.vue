<template>
	<div class="login-wrap">
		<div class="ms-login">
			<div class="ms-title">后台管理系统</div>
			<el-form :model="param" :rules="rules" ref="login" label-width="0px" class="ms-content">
				<el-form-item prop="username">
					<el-input v-model="param.username" placeholder="username">
						<template #prepend>
							<el-button :icon="User"></el-button>
						</template>
					</el-input>
				</el-form-item>
				<el-form-item prop="password">
					<el-input
						type="password"
						placeholder="password"
						v-model="param.password"
						@keyup.enter="submitForm(login)"
					>
						<template #prepend>
							<el-button :icon="Lock"></el-button>
						</template>
					</el-input>
				</el-form-item>
				<div class="login-btn">
          <el-button type="primary" @click="submitForm(login)">登录</el-button>
        </div>

        <div class="login-btn">
          <el-button type="text" @click="goToReg(login)">老师注册</el-button>
        </div>

        <p class="login-tips"></p>
			</el-form>
		</div>
	</div>
</template>

<script setup lang="ts">
import {
  ref, reactive, onBeforeMount,
  getCurrentInstance, ComponentInternalInstance,
} from 'vue';
import { useTagsStore } from '../store/tags';
import { usePermissStore } from '../store/permiss';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import type { FormInstance, FormRules } from 'element-plus';
import { Lock, User } from '@element-plus/icons-vue';
import axios, {AxiosResponse} from "axios";


const { proxy } = getCurrentInstance() as ComponentInternalInstance
interface LoginInfo {
	username: string;
	password: string;
}

const router = useRouter();
const param = reactive<LoginInfo>({
	username: 'evI0GC7Z',
	password: '7Hcul8aF'
});

const rules: FormRules = {
	username: [
		{
			required: true,
			message: '请输入用户名',
			trigger: 'blur'
		}
	],
	password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
};
const permiss = usePermissStore();
const login = ref<FormInstance>();

function statusDetection(res: AxiosResponse<any, any>):Boolean {
  switch (res.data["status"]) {
    case "OK":
      return true;
    case "WARRING":
      ElMessage.error("警告! "+res.data["statusCode"] +": "+ res.data["message"]);
      break;
    case "FAILED":
      ElMessage.error(res.data["statusCode"] +": "+ res.data["message"]);
      break;
    case "ERROR":
      ElMessage.error("错误! "+res.data["statusCode"] +": "+ res.data["message"]);
      break;
  }
  return false;
}

const goToReg = () => {
  router.push('/register');
}

const submitForm = (formEl: FormInstance | undefined) => {
  // axios.get("http://localhost:8080/test").then()
  axios.post(proxy?.$baseURL+'/user/login?username='+param.username+'&password='+param.password+'').then((res)=>{
    if (statusDetection(res)){
      localStorage.setItem('jwtToken', res.data["data"]["token"]);

      let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: proxy?.$baseURL+'/user/info',
        headers: {
          'token': localStorage.getItem('jwtToken')
        }
      };

      axios.request(config)
          .then((response) => {
            localStorage.setItem('user_info', JSON.stringify(response.data['data']));
            localStorage.setItem('ms_username', response.data['data']['name']);
            let role = response.data['data']['role']=='admin:super'?'admin_super':response.data['data']['role'].indexOf('teacher')!=-1?'teacher':'user'
            localStorage.setItem('ms_role', role);
            const keys = permiss.defaultList[
                response.data['data']['role']=='admin:super'?'admin_super':response.data['data']['role'].indexOf('teacher')!=-1?'teacher':'user'
                ];
            permiss.handleSet(keys);
            localStorage.setItem('ms_keys', JSON.stringify(keys));
            if (role == 'teacher'){
              router.push('/teacher');
            }else {
              router.push('/admin');
            }

          })
          .catch((error) => {
            ElMessage.error("错误! "+error);
          });
    }
  })


	// formEl.validate((valid: boolean) => {
	// 	if (valid) {
	// 		ElMessage.success('登录成功');
	// 		localStorage.setItem('ms_username', param.username);
	// 		const keys = permiss.defaultList[param.username == 'admin' ? 'admin' : 'user'];
	// 		permiss.handleSet(keys);
	// 		localStorage.setItem('ms_keys', JSON.stringify(keys));
	// 		router.push('/');
	// 	} else {
	// 		ElMessage.error('登录成功');
	// 		return false;
	// 	}
	// });
};

const tags = useTagsStore();
tags.clearTags();
</script>

<style scoped>
.login-wrap {
	position: relative;
	width: 100%;
	height: 100%;
	background-image: url(../assets/img/login-bg.jpg);
	background-size: 100%;
}
.ms-title {
	width: 100%;
	line-height: 50px;
	text-align: center;
	font-size: 20px;
	color: #fff;
	border-bottom: 1px solid #ddd;
}
.ms-login {
	position: absolute;
	left: 50%;
	top: 50%;
	width: 350px;
	margin: -190px 0 0 -175px;
	border-radius: 5px;
	background: rgba(255, 255, 255, 0.3);
	overflow: hidden;
}
.ms-content {
	padding: 30px 30px;
}
.login-btn {
	text-align: center;
}
.login-btn button {
	width: 100%;
	height: 36px;
	margin-bottom: 10px;
}
.login-tips {
	font-size: 12px;
	line-height: 30px;
	color: #fff;
}
</style>
