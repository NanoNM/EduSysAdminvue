<template>
  <div>
    <div class="container">
      <div class="handle-box">
        <el-input v-model="query.garde_name" placeholder="年级名" class="handle-input mr10"></el-input>
        <el-input v-model="query.garde" placeholder="年级" class="handle-input mr10"></el-input>
<!--        <el-button type="primary" :icon="Search" @click="handleSearch">搜索</el-button>-->
        <el-button type="primary" :icon="Plus" @click="handleInsert">新增</el-button>
      </div>


      <el-table :data="tableData" border class="table" ref="multipleTable" header-cell-class-name="table-header">
        <el-table-column #default="scope" prop="id" label="ID" width="55" align="center">{{scope.$index+((query.pageIndex-1)*8)+1}}</el-table-column>
        <el-table-column prop="gradeName" label="年级名"></el-table-column>
        <el-table-column #default="scope" label="年级">

            <span >{{
                scope.row['level']===1?'大一'
                    : scope.row['level']===3?'大二'
                        :scope.row['level']===5?'大三'
                            :scope.row['level']===7?'大四'
                                :scope.row['level']===9?'大五':''
              }}</span>
        </el-table-column>

        <el-table-column label="状态" align="center">
          <template #default="scope">
            <el-tag :type="scope.row.status==='normal' ? 'success' : 'danger'">
              {{ scope.row.status }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column prop="createTime" label="创建时间"></el-table-column>
        <el-table-column prop="modifyTime" label="编辑时间"></el-table-column>
        <el-table-column prop="startingDate" label="开课时间"></el-table-column>

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
      <div style="color: #409EFF;margin-bottom: 5%">PS. 级别1为大一，3为大二，5为大三，以此类推</div>
      <el-form label-width="70px">
        <el-form-item label="用户名">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="年级">
          <el-input v-model="form.year"></el-input>
        </el-form-item>
        <el-form-item label="级别">
          <el-input v-model="form.level"></el-input>
        </el-form-item>
        <el-form-item label="开课时间">
          <el-input v-model="form.startingDate" placeholder="格式 yyyy-MM-dd"></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-input v-model="form.status"></el-input>
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
  garde: '',
  garde_name: '',
  pageIndex: 1,
  pageSize: 8
});
const tableData = ref<TableItem[]>([]);
const pageTotal = ref(0);
// 获取表格数据
const getData = (page:number) => {

  let config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: proxy?.$baseURL+'/grades?page='+query.pageIndex,
    headers: headers
  };

  axios.request(config)
      .then((response) => {
        tableData.value = response.data['data']['data'];
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

// 插入年级操作
const handleInsert = () => {
  let config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: proxy?.$baseURL+'/admin/create/grade?year='+query.garde+'&name='+query.garde_name,
    headers: { }
  };

  axios.request(config)
      .then((response) => {
        console.log()
        if (response.data["status"] == "FAILED"){
          ElMessage.warning("操作失败 "+response.data["message"]);
          return
        }
        getData(1)
        ElMessage.success("操作完成 "+ response.data["message"])

      })
      .catch((error) => {
        ElMessage.error("操作失败 "+error);
      });

};
// 分页导航
const handlePageChange = (val: number) => {
  query.pageIndex = val;
  getData(val);
};

// 删除操作
const handleDelete = (index: number,row: any) => {
  // 二次确认删除
  ElMessageBox.confirm('十分不建议的操作，您可以编辑年级使其处于结业状态（学生老师不会访问到），年级可能包含班级，删除年级会删除关联年级，确定要删除么？', '警告', {
    type: 'warning'
  })
      .then(() => {
        let config = {
          method: 'get',
          maxBodyLength: Infinity,
          url: proxy?.$baseURL+'/admin/delete/grade?grade='+row.gradeName,
          headers: { }
        };

        axios.request(config)
            .then((response) => {
              getData(1)
              ElMessage.success("操作完成 "+ response.data["message"])
            })
            .catch((error) => {
              ElMessage.error("操作失败 "+ error)
            });


        tableData.value.splice(index, 1);
      })
      .catch(() => {});
};

// 表格编辑时弹窗和保存
const editVisible = ref(false);
let form = reactive({
  id:'',
  name: '',
  year: '',
  level:'',
  status:'',
  startingDate:'',

});
let idx: number = -1;
const handleEdit = (index: number, row: any) => {
  idx = index;
  form.id = row.id
  form.name = row.gradeName
  form.year = row.gradeYear
  form.level = row.level
  form.status = row.status
  form.startingDate = row.startingDate
  editVisible.value = true;
};
// 保存编辑
const saveEdit = () => {

  console.log(form)


  let data = JSON.stringify({
    "id": form.id,
    "gradeName": form.name,
    "gradeYear": form.year,
    "level": form.level,
    "status": form.status,
    "startingDate": form.startingDate+"T00:00:00"
  });

  let config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: 'http://localhost:8080/grade/update',
    headers: {
      'Content-Type': 'application/json'
    },
    data : data
  };

  axios.request(config)
      .then((response) => {
        if (response.data.status == "OK"){
          getData(1)
          editVisible.value=false
          ElMessage.success(response.data.message);
        }
        else {
          ElMessage.error(response.data.message);
        }
      })
      .catch((error) => {
        ElMessage.error(error.response.data.message);
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
