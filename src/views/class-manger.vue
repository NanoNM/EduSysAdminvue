<template>
  <div>
    <div class="container">
      <div class="handle-box">
        <span style="margin-left: 1%" class="label">系：</span>
        <el-select v-model="dept2" @change="" style="margin-right: 1%">
          <el-option v-for="dept in depts2" :label="dept['deptName']" :value="dept['id']"></el-option>
        </el-select>
        <span style="margin-left: 1%" class="label">班级名：</span>
        <el-input v-model="query.className" placeholder="班级名" class="handle-input mr10"></el-input>
        <span class="mr10">
          <span style="margin-left: 1%" class="label">年级：</span>
          <el-select v-model="grade" @change="handleChange2">
            <el-option v-for="grade in grades" :label="grade['gradeName']" :value="grade['gradeName']"></el-option>
          </el-select>
        </span>


<!--        <el-button type="primary" :icon="Search" @click="handleSearch">搜索</el-button>-->
        <el-button type="primary" :icon="Plus"  @click="insertClass">新增</el-button>

        <div style="*-+margin-top: 1%">
          <span class="label">状态：</span>
          <el-select v-model="status" @change="handleChange1">
            <el-option label="正常的" value="normal"></el-option>
            <el-option label="结业的" value="graduated"></el-option>
          </el-select>

          <span style="margin-left: 1%" class="label">年级：</span>
          <el-select v-model="grade" @change="handleChange2">
            <el-option v-for="grade in grades" :label="grade['gradeName']" :value="grade['gradeName']"></el-option>
          </el-select>

          <span style="margin-left: 1%" class="label">系：</span>
          <el-select v-model="dept" @change="handleChange3">
            <el-option v-for="dept in depts" :label="dept['deptName']" :value="dept['id']"></el-option>
          </el-select>
        </div>


      </div>


      <el-table :data="tableData" border class="table" ref="multipleTable" header-cell-class-name="table-header">
        <el-table-column #default="scope" prop="id" label="ID" width="55" align="center">{{scope.$index+((query.pageIndex-1)*8)+1}}</el-table-column>
        <el-table-column prop="className" label="班级名"></el-table-column>

        <el-table-column prop="createTime" label="创建时间"></el-table-column>
        <el-table-column prop="modifyTime" label="编辑时间"></el-table-column>

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
import { fetchData } from '../api/index';
import axios, {AxiosResponse} from "axios";
const { proxy } = getCurrentInstance() as ComponentInternalInstance

let headers = {
  'token':localStorage.getItem('jwtToken')
}

const status = ref<string>('normal');
const grade = ref<string>('');
let grades = ref<string[]>([]);

let dept = ref<string[]>('');
let depts = ref<string[]>([]);

let dept2 = ref<string[]>('');
let depts2 = ref<string[]>([]);


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
  pageSize: 10
});
const tableData = ref<TableItem[]>([]);
const pageTotal = ref(0);

// 获取表格数据
const getData = (page:any,st:any) => {
  let config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: proxy?.$baseURL+'/class/classes?grade='+grade.value+'&page='+page,
    headers: { }
  };

  axios.request(config)
      .then((response) => {
        tableData.value = response.data['data']['data']['classes'];
        pageTotal.value = response.data['data']['pageTotal'];
      })
      .catch((error) => {
        console.log(error);
      });


};
getData(1,null);
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

const insertClass = () => {
  let config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: proxy?.$baseURL+'/admin/create/class?grade='+grade.value+'&name='+query.className+'&dept='+dept2.value,
    headers: { }
  };

  axios.request(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
        getData(1,1)
      })
      .catch((error) => {
        console.log(error);
      });

}

// 删除操作
const handleDelete = (index: number,row: any) => {
  // 二次确认删除
  ElMessageBox.confirm('注意！删除可会导致该班级学生丢失班级信息！！！！ 确定删除？', '提示', {
    type: 'warning'
  })
      .then(() => {

        let config = {
          method: 'get',
          maxBodyLength: Infinity,
          url: 'http://localhost:8080/class/deleteclass?id=' + row.id,
          headers: { }
        };

        axios.request(config)
            .then((response) => {
              if (response.data.status == "OK"){
                ElMessage.success(response.data.message);
                tableData.value.splice(index, 1);
              }
              else {
                ElMessage.success(response.data.message);
              }
            })
            .catch((error) => {
              ElMessage.success(error.response.data.message);

            });

        ElMessage.success('删除成功');
      })
      .catch(() => {});
};

// 表格编辑时弹窗和保存
const editVisible = ref(false);
let form = reactive({
  id:'',
  className: '',
  year: '',
});
let idx: number = -1;

// 将班级加入到我的班级
const addToMyClass = (index: number, row: any) => {
  console.log(row.id)
}


const handleEdit = (index: number, row: any) => {
  console.log(row)
  idx = index;
  form.id = row.id
  form.className = row.className;
  form.year = grade.value;
  editVisible.value = true;
};
// 保存编辑的班级
const saveEdit = () => {

  console.log(form)
  let config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: 'http://localhost:8080/class/updateclass?className='+form.className+'&classYear='+form.year+'&id='+form.id,
    headers: { }
  };

  axios.request(config)
      .then((response) => {
        if (response.data.status == "OK"){
          ElMessage.success(response.data.message)
          getData(1,1)
          editVisible.value = false
        }else {
          ElMessage.error(response.data.message)
        }
      })
      .catch((error) => {
        ElMessage.error(error.response.data.message)
      });



};

const handleChange1 = (val: string[]) => {
  let url = proxy?.$baseURL+'/grades?status='+status.value

  let config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: url,
    headers: { }
  };


  axios.request(config)
      .then((response) => {
        grades.value = response.data["data"]
      })
      .catch((error) => {
        console.log(error);
      });
};

const getSelectGrade = () => {
  let url = proxy?.$baseURL+'/grades?status=normal'

  let config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: url,
    headers: { }
  };


  axios.request(config)
      .then((response) => {
        grades.value = response.data["data"]
      })
      .catch((error) => {
        console.log(error);
      });
}

getSelectGrade();

const handleChange2 = (val: string[]) => {
  let config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: proxy?.$baseURL+'/class/classes?grade='+grade.value+'&page=1',
    headers: { }
  };

  axios.request(config)
      .then((response) => {
          tableData.value = response.data['data']['data']['classes'];
          pageTotal.value = response.data['data']['pageTotal'];
      })
      .catch((error) => {
        console.log(error);
      });

};

const handleChange3 = (val: string[]) => {
  let config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: proxy?.$baseURL+'/class/classes?grade='+grade.value+'&page=1&dept='+dept.value,
    headers: { }
  };

  axios.request(config)
      .then((response) => {
        tableData.value = response.data['data']['data']['classes'];
        pageTotal.value = response.data['data']['pageTotal'];
      })
      .catch((error) => {
        console.log(error);
      });

};

const getAllDept = () =>{

  let config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: proxy?.$baseURL+'/depts',
    headers: { }
  };

  axios.request(config)
      .then((response) => {
        depts.value = response.data["data"]
        depts2.value = depts.value
      })
      .catch((error) => {
        console.log(error);
      });

}
getAllDept()

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
