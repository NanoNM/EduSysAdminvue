<template>
  <div>
    <div class="container">
      <el-transfer
          filterable
          :filter-method="filterMethod"
          filter-placeholder="请输入课程"
          v-model="value"
          :data="data">
      </el-transfer>
    </div>

    <!-- 编辑弹出框 -->
    <el-dialog title="编辑" v-model="editVisible" width="30%">
      <el-form label-width="70px">
        <el-form-item label="班级名">
          <el-input v-model="form.className"></el-input>
        </el-form-item>
        <el-form-item label="年级">
          <el-input v-model="form.year"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
				<span class="dialog-footer">
					<el-button @click="editVisible = false">取 消</el-button>
					<el-button type="primary" @click="saveEdit">提 交</el-button>
				</span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts" name="basetable">
import {ref, reactive, getCurrentInstance, ComponentInternalInstance} from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { Delete, Edit, Search, Plus } from '@element-plus/icons-vue';
import { fetchData } from '../../api/index';
import axios, {AxiosResponse} from "axios";
const { proxy } = getCurrentInstance() as ComponentInternalInstance

let globeHeaders = {
  'token':localStorage.getItem('jwtToken')
}



let value = ref<string[]>('');
let data = ref<string[]>([]);




interface TableItem {
  id: number;
  name: string;
  emp_id: string;
  state: string;
  create_time: string;
  modify_time: string;
  last_time: string;
  role: string;
}

const query = reactive({
  className: '',
  grade: '',
  pageIndex: 1,
  pageSize: 10000
});
const tableData = ref<TableItem[]>([]);

const myClass = ref<TableItem[]>([]);

const pageTotal = ref(0);

const userID:string|null = localStorage.getItem("user_info");


// 获取表格数据
const getData = (page:any,st:any) => {

};
// getData(1,null);

const filterMethod = () => {

}

const getMyClass = () => {
  let config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: proxy?.$baseURL+'/teacher/getclass',
    headers: globeHeaders
  };

  axios.request(config)
      .then((response) => {
        myClass.value = response.data['data']
        console.log();
      })
      .catch((error) => {
        console.log(error);
      });
};

getMyClass()

// 查询操作
const handleSearch = () => {
  query.pageIndex = 1;
  getData(1,null);
};
// 分页导航
const handlePageChange = (val: number) => {
  query.pageIndex = val;
  getData(val,null);
};


// 表格编辑时弹窗和保存
const editVisible = ref(false);
let form = reactive({
  className: '',
  year: '',
});
let idx: number = -1;
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
