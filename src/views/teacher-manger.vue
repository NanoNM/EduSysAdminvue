<template>
  <div>
    <div class="container">
      <div class="handle-box">
        <el-input v-model="query.name" placeholder="用户名" class="handle-input mr10"></el-input>
        <el-input v-model="query.empID" placeholder="学号" class="handle-input mr10"></el-input>
        <el-button type="primary" :icon="Search" @click="handleSearch">搜索</el-button>
        <el-button type="primary" :icon="Plus">新增</el-button>
      </div>


      <el-table :data="tableData" border class="table" ref="multipleTable" header-cell-class-name="table-header">
        <el-table-column #default="scope" prop="id" label="ID" width="55" align="center">{{scope.$index+((query.pageIndex-1)*8)+1}}</el-table-column>
        <el-table-column prop="name" label="用户名"></el-table-column>
        <el-table-column label="员工号" prop="employeeId"></el-table-column>
        <el-table-column label="状态" align="center">
          <template #default="scope">
            <el-tag :type="scope.row.role.indexOf('normal') ? 'success' : 'danger'">
              {{ scope.row.role }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column prop="createTime" label="注册时间"></el-table-column>
        <el-table-column prop="modifyTime" label="编辑时间"></el-table-column>
        <el-table-column prop="lastTime" label="最后登录"></el-table-column>

        <el-table-column label="操作" width="220" align="center">
          <template #default="scope">
            <el-button text :icon="Edit" @click="handleEdit(scope.$index, scope.row)" v-permiss="15">
              编辑
            </el-button>
            <el-button text :icon="Delete" class="red" @click="handleDelete(scope.$index,scope.row)" v-permiss="16">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination">
        <el-pagination
            background
            layout="total, prev, pager, next, jumper"
            :current-page="query.pageIndex"
            :page-size="query.pageSize"
            :total="pageTotal"
            @current-change="handlePageChange"
        ></el-pagination>
      </div>
    </div>

    <!-- 编辑弹出框 -->
    <el-dialog title="编辑" v-model="editVisible" width="30%">
      <el-form label-width="70px">
        <el-form-item label="用户名">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="学号">
          <el-input v-model="form.empID"></el-input>
        </el-form-item>
        <el-form-item label="角色">
          <el-input v-model="form.role"></el-input>
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
import { fetchData } from '../api/index';
import axios, {AxiosResponse} from "axios";
const { proxy } = getCurrentInstance() as ComponentInternalInstance

let headers = {
  'token':localStorage.getItem('jwtToken')
}
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
  empID: '',
  name: '',
  pageIndex: 1,
  pageSize: 10
});
const tableData = ref<TableItem[]>([]);
const pageTotal = ref(0);
// 获取表格数据
const getData = (page:number) => {

  let config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: proxy?.$baseURL+'/admin/users?page='+page+'&role=thr',
    headers: headers
  };

  axios.request(config)
      .then((response) => {
        tableData.value = response.data['data']['students'];
        pageTotal.value = response.data['data']['pageTotal'];
      })
      .catch((error) => {
        console.log(error);
      });


  // fetchData().then(res => {
  //   tableData.value = res.data.list;
  //   pageTotal.value = res.data.pageTotal || 50;
  // });
};
getData(1);

// 查询操作
const handleSearch = () => {
  query.pageIndex = 1;
  getData(1);
};
// 分页导航
const handlePageChange = (val: number) => {
  query.pageIndex = val;
  getData(val);
};

// 删除操作
const handleDelete = (index: number,row: any) => {
  // 二次确认删除
  ElMessageBox.confirm('确定要删除吗？', '提示', {
    type: 'warning'
  })
      .then(() => {

        let config = {
          method: 'get',
          maxBodyLength: Infinity,
          url: proxy?.$baseURL+'/admin/delete/user?userno='+row.userNo,
          headers: { }
        };

        axios.request(config)
            .then((response) => {
              console.log(JSON.stringify(response.data));
            })
            .catch((error) => {
              console.log(error);
            });

        ElMessage.success('删除成功');
        tableData.value.splice(index, 1);
      })
      .catch(() => {});
};

// 表格编辑时弹窗和保存
const editVisible = ref(false);
let form = reactive({
  name: '',
  empID: '',
  role:'',
  userNo:''
});
let idx: number = -1;
const handleEdit = (index: number, row: any) => {
  idx = index;
  form.name = row.name;
  form.empID = row.employeeId;
  form.role = row.role;
  form.userNo = row.userNo;
  editVisible.value = true;
};
// 保存编辑的老师
const saveEdit = () => {
  let config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: proxy?.$baseURL+'/admin/update/teacher?userno='+form.userNo+'&username='+form.name+'&empID='+form.empID+'&role='+form.role,
    headers: { }
  };

  axios.request(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
      })
      .catch((error) => {
        console.log(error);
      });


};
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
