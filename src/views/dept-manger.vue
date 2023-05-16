<template>
  <div class="container">
    <div class="handle-box">
      <div style="margin-bottom: 1%">操作</div>
      <span style="margin-left: 1%" class="label">系名：</span>
      <el-input v-model="createDeptName" placeholder="系名" class="handle-input mr10"></el-input>
      <span style="margin-left: 1%" class="label">学制：</span>
      <el-input v-model="eduSys" placeholder="学制" class="handle-input mr10"></el-input>
      <el-button type="primary" :icon="Plus"  @click="createDept" class="">新增</el-button>

    </div>

    <div class="handle-box">
      <div style="margin-bottom: 1%">编辑</div>
      <el-select v-model="selectedDept" @change="selectedDeptChange" class="mr10">
        <el-option v-for="dept in depts" :label="dept['deptName']" :value="dept['id']"></el-option>
      </el-select>
      <span style="margin-left: 1%" class="label">学制：</span>
      <el-input v-model="eduSysUpdate" placeholder="学制" class="handle-input mr10"></el-input>
      <el-button type="primary" :icon="Plus"  @click="updateDept" class="">更新学制</el-button>

      <el-button type="danger" :icon="Delete"  @click="deleteDept" class="">删除</el-button>

    </div>
  </div>
</template>

<script setup lang="ts" name="basetable">
import {ref, reactive, getCurrentInstance, ComponentInternalInstance} from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { Delete, Edit, Search, Plus } from '@element-plus/icons-vue';
import { fetchData } from '../api/index';
import axios, {AxiosResponse} from "axios";
const { proxy } = getCurrentInstance() as ComponentInternalInstance

let globeHeaders = {
  'token':localStorage.getItem('jwtToken')
}

const createDeptName = ref('')
const eduSys = ref('4')
const eduSysUpdate = ref('4')

const selectedDept = ref('')
const depts = ref();

const selectedDeptChange = (val:Any) => {
  let config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: 'http://localhost:8080/dept?id=' + val,
    headers: globeHeaders
  };

  axios.request(config)
      .then((response) => {
        eduSysUpdate.value = response.data.data.eduSys
      })
      .catch((error) => {
        console.log(error);
      });

  console.log(val)
  // eduSysUpdate.value =val
}

const updateDept = () => {
  let config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: 'http://localhost:8080/updatedept?deptid='+selectedDept.value+'&edusys='+eduSysUpdate.value,
    headers: globeHeaders
  };

  axios.request(config)
      .then((response) => {
        if (response.data.status == "OK"){
          getAllDept();
          ElMessage.success(response.data.message);
        }
        else {
          ElMessage.error(response.data.message);
        }
      })
      .catch((error) => {
        ElMessage.error(error.response.data.message);
      });

}

const deleteDept = () => {
  ElMessageBox.confirm('注意！删除可能会丢失这个系对应的诸多消息！！！！ 确定删除？', '提示', {
    type: 'warning'
  })
      .then(() => {
        let config = {
          method: 'get',
          maxBodyLength: Infinity,
          url: 'http://localhost:8080/delete/dept?id=' + selectedDept.value,
          headers: globeHeaders
        };

        axios.request(config)
            .then((response) => {
              if (response.data.status == "OK"){
                getAllDept();
                ElMessage.success(response.data.message);
              }
              else {
                ElMessage.error(response.data.message);
              }
            })
            .catch((error) => {
              ElMessage.error(error.response.data.message);
            });
      })
      .catch(() => {});
}
const createDept = () => {
  let config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: 'http://localhost:8080/create/dept?deptname=' + createDeptName.value + '&edusys=' + eduSys.value,
    headers: globeHeaders
  };

  axios.request(config)
      .then((response) => {
        if (response.data.status == "OK"){
          getAllDept();
          ElMessage.success(response.data.message);
        }
        else {
          ElMessage.error(response.data.message);
        }
      })
      .catch((error) => {
        ElMessage.error(error.response.data.message);

      });
}

const getAllDept = () => {
  let config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: 'http://localhost:8080/depts',
    headers: globeHeaders
  };

  axios.request(config)
      .then((response) => {
        if (response.data.status == "OK"){
          depts.value = response.data.data
          ElMessage.success(response.data.message);
        }
        else {
          ElMessage.error(response.data.message);
        }
      })
      .catch((error) => {
        ElMessage.error(error.response.data.message);

      });

}
getAllDept();


</script>

<style scoped>
.handle-box {
  margin-bottom: 20px;
}

.handle-select {
  width: 120px;
}

.handle-input {
  width: 300px;
}
.table {
  width: 100%;
  font-size: 14px;
}
.red {
  color: #F56C6C;
}
.mr10 {
  margin-right: 10px;
}
.table-td-thumb {
  display: block;
  margin: auto;
  width: 40px;
  height: 40px;
}
</style>
