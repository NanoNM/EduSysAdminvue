import { createApp } from 'vue';
import { createPinia } from 'pinia';
import * as ElementPlusIconsVue from '@element-plus/icons-vue';
import App from './App.vue';
import router from './router';
import { usePermissStore } from './store/permiss';
import 'element-plus/dist/index.css';
import './assets/css/icon.css';
import axios from "axios";
import {ElMessage} from "element-plus";

const app = createApp(App);
app.use(createPinia());
app.use(router);

app.config.globalProperties.$jwtToken = "";

axios.get('./config.json').then(data => {
    app.config.globalProperties.$baseURL = data.data.baseURL;
    app.config.globalProperties.$baseWS = data.data.baseWS;

    console.log('挂载后端地址',app.config.globalProperties.$baseURL)
    console.log('挂载后端socket',app.config.globalProperties.$baseWS)
}).catch(error => {
    console.log(error);
})

// 注册elementplus图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component);
}
// 自定义权限指令
const permiss = usePermissStore();
app.directive('permiss', {
    mounted(el, binding) {
        if (!permiss.key.includes(String(binding.value))) {
            el['hidden'] = true;
        }
    },
});

axios.interceptors.response.use(
    response => {
        return response;
    },
    error => {
        if (error.response.status == 403) {
            if (error.response.data.statusCode == 'INVALID_LOGIN'){
                ElMessage.error("请重新登录！ " + error.response.data.message)
                let config = {
                    method: 'get',
                    maxBodyLength: Infinity,
                    url: 'http://localhost:8080/user/lgout',
                    headers: {
                        'token': localStorage.getItem('jwtToken')
                    }
                };

                axios.request(config)
                    .then((response) => {
                        if (response.data['status'] == 'ok'){
                            localStorage.removeItem('ms_username');
                            localStorage.removeItem('jwtToken');
                            localStorage.removeItem('ms_keys');
                        }
                    })
                    .catch((error) => {
                        ElMessage.error("错误! "+error);
                    });
                ElMessage.success("登出成功");
                router.push('/login');
            }
            console.log(error.response.data)
        } else {
            // message.error("出错了");
            // return Promise.reject(error);
        }
    }
);

app.mount('#app');
