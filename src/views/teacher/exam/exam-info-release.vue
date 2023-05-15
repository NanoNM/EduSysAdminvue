<template>
  <div>
    <div class="container">
      <div class="handle-box">
        <div style="margin-top: 1%">
          <div style="margin-bottom: 1%">
          </div>
          <el-button style="margin-left: 1%" type="primary" :icon="Plus" @click="releaseCl">发布考试通知</el-button>
        </div>
      </div>


      <div style="margin-bottom: 1%">
        现在通知
      </div>

      <el-table :data="tableData" border class="table" ref="multipleTable" header-cell-class-name="table-header">

        <el-table-column #default="scope" prop="id" label="ID" width="55" align="center">{{scope.$index+((query.pageIndex-1)*8)+1}}</el-table-column>
        <el-table-column prop="name" label="考试名"></el-table-column>
        <el-table-column prop="examLocal" label="地点"></el-table-column>
        <el-table-column prop="startTime" label="开始时间"></el-table-column>

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
    <el-dialog title="发布考试通知" v-model="releaseInfoVisible" width="30%">
      <div style="margin-bottom: 5%; color: #ff4927">
        可以为年级 整个系 个别班级发布考试信息
        <br><br>
        注意！ 为年级发布信息请只选择年级， 为系发布信息请先选择年级在选择系， 如果为班级发布信息请先选择年级在选择班级！
      </div>
      <el-form label-width="70px">
        <el-form-item label="考试名">
          <el-input v-model="examInfo.exam_name"></el-input>
        </el-form-item>
        <el-form-item label="考试场地">
          <el-input v-model="examInfo.exam_local"></el-input>
        </el-form-item>
        <el-form-item label="年级">
          <el-select v-model="examInfo.exam_year" clearable placeholder="请选择" @change="onGradeChange">
            <el-option
                v-for="item in examReleaseInfo.year"
                :key="item.id"
                :label="item.gradeName"
                :value="item.gradeName"
                >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="系">
          <el-select v-model="examInfo.exam_dept" clearable  placeholder="请选择">
            <el-option
                v-for="item in examReleaseInfo.dept"
                :key="item.id"
                :label="item.deptName"
                :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="班级">
          <el-select v-model="examInfo.exam_class" clearable  placeholder="请先选择年级">
            <el-option
                v-for="item in examReleaseInfo.classes"
                :key="item.id"
                :label="item.className"
                :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="开始时间">
          <el-input v-model="examInfo.start_time" placeholder="格式 XXXX-XX-XX XX:XX:XX"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
				<span class="dialog-footer">
					<el-button @click="releaseInfoVisible = false">取 消</el-button>
					<el-button type="primary" @click="release">提 交</el-button>
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
  exam_local: '',
  exam_year:'',
  exam_dept:'',
  exam_class:'',
  start_time:''
});

let examReleaseInfo = reactive({
  year:'',
  dept:'',
  classes:''
});

const onGradeChange = () =>{

  let config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: 'http://localhost:8080/class/classes?grade=' + examInfo.exam_year,
    headers: { }
  };

  axios.request(config)
      .then((response) => {
        examReleaseInfo.classes = response.data['data']['data']['classes'];
      })
      .catch((error) => {
        console.log(error);
      });

}

const releaseCl = () => {
  let grades = {
    method: 'get',
    maxBodyLength: Infinity,
    url: 'http://localhost:8080/grades?status=normal',
    headers: { }
  };

  axios.request(grades)
      .then((response) => {
        examReleaseInfo.year = response.data['data']
      })
      .catch((error) => {
        console.log(error);
      });
  let config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: 'http://localhost:8080/depts',
    headers: { }
  };

  axios.request(config)
      .then((response) => {
        examReleaseInfo.dept = response.data['data']
      })
      .catch((error) => {
        console.log(error);
      });


  releaseInfoVisible.value = true;
}


const release = () => {
  if (examInfo.exam_name=='' || examInfo.exam_local=='' || examInfo.start_time==''){
    ElMessage.error("不允许的参数 请填写点东西")
  }
  console.log(examInfo)


  if (examInfo.exam_year != '' && examInfo.exam_dept != '' && examInfo.exam_class == '')
  {
    console.log("创建系级别考试")
    let config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: 'http://localhost:8080/exam/create?name='+
          examInfo.exam_name+'&local='+
          examInfo.exam_local+'&time='+
          examInfo.start_time+'&grade='+
          examInfo.exam_year+'&deptid='+
          examInfo.exam_dept,
      headers: { }
    };

    axios.request(config)
        .then((response) => {
          if (response.data.status == "OK"){
            getData(1,1)
            ElMessage.success(response.data.message);
            releaseInfoVisible.value = false
          }
          else {
            ElMessage.error(response.data.message);
          }
        })
        .catch((error) => {
          ElMessage.error(error.response.data.message);
        });

  }else if(examInfo.exam_year != '' && examInfo.exam_dept == '' && examInfo.exam_class == ''){
    console.log("创建年级级别考试")
    let year = {
      method: 'get',
      maxBodyLength: Infinity,
      url: 'http://localhost:8080/exam/create?name='+
          examInfo.exam_name+'&local='+
          examInfo.exam_local+'&time='+
          examInfo.start_time+'&grade='+examInfo.exam_year
      ,
      headers: { }
    };

    axios.request(year)
        .then((response) => {
          if (response.data.status == "OK"){
            getData(1,1)
            ElMessage.success(response.data.message);
            releaseInfoVisible.value = false
          }
          else {
            ElMessage.error(response.data.message);
          }
        })
        .catch((error) => {
          ElMessage.error(error.response.data.message);
        });

  }else if(examInfo.exam_class != ''){
    console.log("创建班级级别考试")
    let classes = {
      method: 'get',
      maxBodyLength: Infinity,
      url: 'http://localhost:8080/exam/create?name='+
          examInfo.exam_name+'&local='+
          examInfo.exam_local+'&time='+
          examInfo.start_time+'&class='+
          examInfo.exam_class,
      headers: { }
    };

    axios.request(classes)
        .then((response) => {
          if (response.data.status == "OK"){
            getData(1,1)
            ElMessage.success(response.data.message);
            releaseInfoVisible.value = false
          }
          else {
            ElMessage.error(response.data.message);
          }
        })
        .catch((error) => {
          ElMessage.error(error.response.data.message);
        });


  }else {
    ElMessage.error("不允许的操作")

  }


}


const status = ref<string>('normal');


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

  let config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: 'http://localhost:8080/exam/exams',
    headers: { }
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
          url: 'http://localhost:8080/exam/delete?examID='+row.id,
          headers: { }
        };

        axios.request(config)
            .then((response) => {
              if (response.data['status'] == 'OK'){
                ElMessage.success('删除成功');
                tableData.value.splice(index, 1);

              }else {
                ElMessage.error(response.data['message'])
              }

            })
            .catch((error) => {
              console.log(error);
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
