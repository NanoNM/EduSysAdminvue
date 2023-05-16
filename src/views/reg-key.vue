<template>
  <div class="container">
    <div class="handle-box">
      <el-input style="width: 10%" v-model="query.nums" placeholder="年级名" class="handle-input mr10"></el-input>
      <el-button type="primary" :icon="Plus" @click="genRegKey">生成KEY</el-button>
    </div>
    <el-table :data="tableData" border class="table" ref="multipleTable" header-cell-class-name="table-header">
      <el-table-column #default="scope" prop="id" label="ID" width="55" align="center">{{scope.$index+((query.pageIndex-1)*8)+1}}</el-table-column>
      <el-table-column prop="key" label="KEY"></el-table-column>
    </el-table>
  </div>


</template>

<script setup lang="ts">
import {
  ref, reactive, onBeforeMount,
  getCurrentInstance, ComponentInternalInstance,
} from 'vue';
import { Delete, Edit, Search, Plus } from '@element-plus/icons-vue';
import { useTagsStore } from '../store/tags';
import { usePermissStore } from '../store/permiss';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import type { FormInstance, FormRules } from 'element-plus';
import { Lock, User } from '@element-plus/icons-vue';
import axios, {AxiosResponse} from "axios";

const { proxy } = getCurrentInstance() as ComponentInternalInstance

let globeHeaders = {
  'token':localStorage.getItem('jwtToken')
}

const query = reactive({
  nums: 1,
  pageIndex:1
});

interface TableItem {
  key: string;
}
const tableData = ref<TableItem[]>([]);

const getData = () => {
  let config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: 'http://localhost:8080/admin/get/key',
    headers: globeHeaders
  };
  axios.request(config)
      .then((response) => {
        tableData.value = response.data['data']
        console.log(tableData.value)
      })
      .catch((error) => {
        console.log(error);
      });



};

getData();

const genRegKey = () => {
  let config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: 'http://localhost:8080/admin/gen/key?nums='+query.nums,
    headers: globeHeaders
  };

  axios.request(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
        getData()
      })
      .catch((error) => {
        console.log(error);
      });
}





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