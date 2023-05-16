<template>
  <div>
    <div class="container">
      <span style="margin-left: 1%;margin-bottom: 1%" class="label">学号：</span>
      <el-input style="margin-bottom: 1%" v-model="empid" placeholder="学号" class="handle-input mr10"></el-input>
      <el-button style="margin-bottom: 1%" type="primary" :icon="Plus"  @click="getData" class="">查询</el-button>


      <el-table :data="tableData" border class="table" ref="multipleTable" header-cell-class-name="table-header">
        <el-table-column #default="scope" prop="id" label="ID" width="55" align="center">{{scope.$index+((query.pageIndex-1)*8)+1}}</el-table-column>
        <el-table-column prop="course['courseName']" label="课程名"></el-table-column>
        <el-table-column #default="scope" label="当前状态">{{scope.row.status === 0?'申请中':scope.row.status === 1?'驳回':scope.row.status === 2?'批准':'异常'}}</el-table-column>

        <el-table-column label="操作" width="220" align="center">
          <template #default="scope">
            <el-button text :icon="Edit" @click="handleEdit(scope.$index, scope.row)">
              通过
            </el-button>
            <el-button text :icon="Delete" class="red" @click="handleDelete(scope.$index,scope.row)">
              驳回
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

const empid = ref();



interface TableItem {

}


interface trItem {
  key: number
  label: string
  initial: string
}
const trData = ref<trItem[]>()
const trValue = ref([])
const filterMethod= (query, item) => {
  return item.initial.toLowerCase().includes(query.toLowerCase())
}


interface insertTrItem {
  key: number
  label: string
  initial: string
}
const insertTrData = ref<insertTrItem[]>()
const insertTrValue = ref([])
const insertFilterMethod= (query, item) => {
  return item.initial.toLowerCase().includes(query.toLowerCase())
}


const query = reactive({
  empID: '',
  name: '',
  credit:'',
  pageIndex: 1,
  pageSize: 10000
});
const tableData = ref<TableItem[]>([]);
const pageTotal = ref(0);
const test = (s:Any) => {
  console.log(s)
}



// 获取表格数据
const getData = () => {


  let config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: 'http://localhost:8080/student/selected/getempid?empid='+empid.value,
    headers: globeHeaders
  };

  axios.request(config)
      .then((response) => {
        tableData.value = response.data.data
        console.log(tableData.value)
      })
      .catch((error) => {
        console.log(error);
      });


};

// 查询操作
const handleSearch = () => {
  // query.pageIndex = 1;
  // getData(1);
};
// 分页导航
const handlePageChange = (val: number) => {
  query.pageIndex = val;
  getData(val);
};

// 删除操作
const handleDelete = (index: number,row: any) => {
  // 二次确认删除
  ElMessageBox.confirm('确定要驳回吗？', '提示', {
    type: 'warning'
  })
      .then(() => {

        let config = {
          method: 'get',
          maxBodyLength: Infinity,
          url: 'http://localhost:8080/student/selected/reject?id=' + row.id,
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


      })
      .catch(() => {});

};


let form = reactive({
  name: '',
  class_hour: '',
  credit:'',
  grade:'',
  public:''
});
const handleEdit = (index: number, row: any) => {
  let config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: 'http://localhost:8080/student/selected/pass?id=' + row.id,
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
