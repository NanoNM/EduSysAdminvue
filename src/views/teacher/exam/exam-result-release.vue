<template>
  <div>
    <div class="container">
      <div class="handle-box">
<!--        <span style="margin-left: 1%" class="label">系：</span>-->
<!--        <el-select v-model="dept2" @change="" style="margin-right: 1%">-->
<!--          <el-option v-for="dept in depts2" :label="dept['deptName']" :value="dept['id']"></el-option>-->
<!--        </el-select>-->

<!--        <el-input v-model="query.className" placeholder="班级名" class="handle-input mr10"></el-input>-->
<!--        <span class="mr10">-->
<!--          <span style="margin-left: 1%" class="label">年级：</span>-->
<!--          <el-select v-model="grade" @change="handleChange2">-->
<!--            <el-option v-for="grade in grades" :label="grade['gradeName']" :value="grade['gradeName']"></el-option>-->
<!--          </el-select>-->
<!--        </span>-->
<!--        <el-button type="primary" :icon="Search" @click="handleSearch">搜索</el-button>-->

        <div style="margin-top: 1%">
          <div style="margin-bottom: 1%">
          </div>
          <el-button style="margin-left: 1%" type="primary" :icon="Plus" @click="
          releaseInfoVisible = true
">发布考试结果</el-button>
        </div>
      </div>


      <div style="margin-bottom: 1%">
        现有的结果
      </div>

      <el-table :data="tableData" border class="table" ref="multipleTable" header-cell-class-name="table-header">

        <el-table-column #default="scope" prop="id" label="ID" width="55" align="center">{{scope.$index+((query.pageIndex-1)*8)+1}}</el-table-column>
        <el-table-column prop="name" label="考试名"></el-table-column>
        <el-table-column prop="score" label="分数"></el-table-column>
        <el-table-column prop="studentId" label="学生学号"></el-table-column>
        <el-table-column prop="examMarker" label="阅卷人"></el-table-column>

        <el-table-column label="操作" width="420" align="center">
          <template #default="scope">
            <el-button text :icon="Delete" class="red" @click="handleDelete(scope.$index,scope.row)">
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
    <el-dialog title="发布考试信息" v-model="releaseInfoVisible" width="30%">
      <el-form label-width="70px">
        <el-form-item label="考试名">
          <el-input v-model="examInfo.exam_name"></el-input>
        </el-form-item>
        <el-form-item label="考生学号">
          <el-input v-model="examInfo.examinee_id"></el-input>
        </el-form-item>
        <el-form-item label="成绩">
          <el-input v-model="examInfo.exam_score"></el-input>
        </el-form-item>
        <el-form-item label="阅卷人">
          <el-input v-model="examInfo.exam_marker"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
				<span class="dialog-footer">
					<el-button @click="releaseInfoVisible = false">取 消</el-button>
					<el-button type="primary" @click="releaseExamResult">提 交</el-button>
				</span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts" name="basetable">
import { ref, reactive } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { Delete, Edit, Search, Plus } from '@element-plus/icons-vue';
import axios, {AxiosResponse} from "axios";
let globeHeaders = {
  'token':localStorage.getItem('jwtToken')
}


const releaseInfoVisible = ref(false);
let examInfo = reactive({
  exam_name: '',
  examinee_id: '',
  exam_score:'',
  exam_marker:''
});

let examReleaseInfo = reactive({
  year:'',
  dept:'',
  classes:''
});



const status = ref<string>('normal');


interface TableItem {

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

const releaseExamResult = () => {
  let data = JSON.stringify({
    "name": examInfo.exam_name,
    "score": examInfo.exam_score,
    "studentId": examInfo.examinee_id,
    "examMarker": examInfo.exam_marker
  });

  let config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: 'http://localhost:8080/exam/insertResults',
    headers: {
      'Content-Type': 'application/json',
      'token':localStorage.getItem('jwtToken')

    },
    data : data
  };

  axios.request(config)
      .then((response) => {
        if (response.data.status == "OK"){
          ElMessage.success(response.data.message)
          releaseInfoVisible.value = false
          getData(1,1)
        }else {
          ElMessage.error(response.data.message)
        }
      })
      .catch((error) => {
          ElMessage.error(error.response.data.message)
      });

}

// 获取表格数据
const getData = (page:any,st:any) => {

  let config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: 'http://localhost:8080/exam/getResults',
    headers: globeHeaders
  };

  axios.request(config)
      .then((response) => {
        tableData.value = response.data['data'];
        console.log(JSON.stringify(response.data));
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


// 删除
const handleDelete = (index: number,row: any) => {
  // 二次确认删除
  ElMessageBox.confirm('确定要删除吗？', '提示', {
    type: 'warning'
  })
      .then(() => {
        let config = {
          method: 'get',
          maxBodyLength: Infinity,
          url: 'http://localhost:8080/exam/deleteResults?id='+row.id,
          headers: globeHeaders
        };

        axios.request(config)
            .then((response) => {
              if (response.data.status == "OK"){
                ElMessage.success(response.data.message)
                getData(1,1)
              }else {
                ElMessage.error(response.data.message)
              }
            })
            .catch((error) => {
              ElMessage.error(error.response.data.message)
            });

      })
      .catch(() => {});
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
