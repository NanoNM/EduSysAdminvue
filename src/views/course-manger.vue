<template>
  <div>
    <div class="container">
      <div class="handle-box">
<!--        <el-input v-model="query.name" placeholder="用户名" class="handle-input mr10"></el-input>-->
<!--        <el-input v-model="query.empID" placeholder="学号" class="handle-input mr10"></el-input>-->
<!--        <el-button type="primary" :icon="Search" @click="handleSearch">搜索</el-button>-->
        <el-button type="primary" :icon="Plus" @click="insertVisible = true;getAllDept()">新增</el-button>
      </div>


      <el-table :data="tableData" border class="table" ref="multipleTable" header-cell-class-name="table-header">
        <el-table-column #default="scope" prop="id" label="ID" width="55" align="center">{{scope.$index+((query.pageIndex-1)*8)+1}}</el-table-column>
        <el-table-column prop="curriculum['courseName']" label="课程名"></el-table-column>
        <el-table-column prop="curriculum['classHour']" label="课时"></el-table-column>
        <el-table-column prop="curriculum['credit']" label="学分"></el-table-column>

          <el-table-column #default="scope" label="年级">
<!--            <span >{{-->
<!--                scope.row.curriculum['level']===1?'大一 上'-->
<!--                    : scope.row.curriculum['level']===2?'大一 下'-->
<!--                        : scope.row.curriculum['level']===3?'大二 上'-->
<!--                            :scope.row.curriculum['level']===4?'大二 下'-->
<!--                                :scope.row.curriculum['level']===5?'大三 上'-->
<!--                                    :scope.row.curriculum['level']===6?'大三 下'-->
<!--                                        :scope.row.curriculum['level']===7?'大四 上'-->
<!--                                            :scope.row.curriculum['level']===8?'大四 下':'大五'-->
<!--              }}</span>-->
            <span >{{
                scope.row.curriculum['level']===1?'大一'
                    : scope.row.curriculum['level']===2?'大一'
                        : scope.row.curriculum['level']===3?'大二'
                            : scope.row.curriculum['level']===4?'大二'
                                : scope.row.curriculum['level']===5?'大三'
                                    : scope.row.curriculum['level']===6?'大三'
                                        : scope.row.curriculum['level']===7?'大四'
                                            : scope.row.curriculum['level']===8?'大四':'大五'
              }}</span>
          </el-table-column>

        <el-table-column label="是否公共课" #default="scope">
          <span>{{scope.row.curriculum['publicRequired']==1?'是':'否'}}</span>
        </el-table-column>

        <el-table-column label="所属系" #default="scope">
          <span v-if="scope.row.dept===''">空</span>
          <span v-else>
            <span v-for="dept in scope.row.dept">
              {{dept['deptName']}} ,
            </span>
          </span>
        </el-table-column>
        <el-table-column label="操作" width="220" align="center">
          <template #default="scope">
            <el-button text :icon="Edit" @click="handleEdit(scope.$index, scope.row)">
              编辑
            </el-button>
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
    <el-dialog title="编辑" v-model="editVisible" width="90%" style="height: 100%">
      <el-form style="height: 100%" label-width="70px">
        <el-form-item label="学科名">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="课时">
          <el-input v-model="form.class_hour"></el-input>
        </el-form-item>
        <el-form-item label="学分">
          <el-input placeholder="学分" v-model="form.credit"></el-input>
        </el-form-item>
        <el-form-item label="年级">
          <el-input placeholder="1,2 大一上下 依次类推" v-model="form.grade"></el-input>
        </el-form-item>
        <el-form-item label="公共课">
          <el-input placeholder="0不是 1是" v-model="form.public"></el-input>
        </el-form-item>
        <el-form-item label="系">
          <el-transfer
              filterable
              :filter-method="filterMethod"
              filter-placeholder=输入系的名字
              v-model="trValue"
              :titles="['未选系', '已选系']"
              :data="trData"
              @change="onTrChange">
          </el-transfer>
        </el-form-item>
      </el-form>
      <template #footer>
				<span class="dialog-footer">
					<el-button @click="editVisible = false">取 消</el-button>
					<el-button type="primary" @click="saveEdit">提 交</el-button>
				</span>
      </template>
    </el-dialog>

    <!-- 新增课程弹出框 -->
    <el-dialog title="创建课程" v-model="insertVisible" width="90%" style="height: 100%">
      <el-form style="height: 100%" label-width="70px">
        <el-form-item label="学科名">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="课时">
          <el-input v-model="form.class_hour"></el-input>
        </el-form-item>
        <el-form-item label="学分">
          <el-input placeholder="学分" v-model="form.credit"></el-input>
        </el-form-item>
        <el-form-item label="年级">
          <el-input placeholder="1,2 大一上下 依次类推" v-model="form.grade"></el-input>
        </el-form-item>
        <el-form-item label="公共课">
          <el-input placeholder="0不是 1是" v-model="form.public"></el-input>
        </el-form-item>
        <el-form-item label="系">
          <el-transfer
              filterable
              :filter-method="insertFilterMethod"
              filter-placeholder=输入系的名字
              v-model="insertTrValue"
              :titles="['未选系', '已选系']"
              :data="insertTrData"
              @change="insertOnTrChange">
          </el-transfer>
        </el-form-item>
      </el-form>
      <template #footer>
				<span class="dialog-footer">
					<el-button @click="
					insertVisible = false
        ">取 消</el-button>
					<el-button type="primary" @click="insertCourse">提 交</el-button>
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

const insertCourse = () => {
  let data = JSON.stringify({
    "curriculum": {
      "courseName": form.name,
      "classHour": form.class_hour,
      "level": form.grade,
      "publicRequired": form.public,
      "credit": form.credit
    },
    "deptids": insertTrValue.value
  });

  let config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: 'http://localhost:8080/course/create',
    headers: {
      'Content-Type': 'application/json',
    },
    data : data
  };

  console.log(config)

  axios.request(config)
      .then((response) => {

        if (response.data["status"] == "OK"){
          insertVisible.value = false
          ElMessage.success(response.data["message"])
          getData(1)
          return
        }else {
          ElMessage.error(response.data["message"])
        }

      })
      .catch((error) => {
        console.log(error);
        ElMessage.error(error.response.data["message"])
      });

}


// 获取表格数据
const getData = (page:number) => {

  let config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: proxy?.$baseURL+'/admin/course',
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



  // fetchData().then(res => {
  //   tableData.value = res.data.list;
  //   pageTotal.value = res.data.pageTotal || 50;
  // });
};
getData(1);

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
  ElMessageBox.confirm('确定要删除吗？', '提示', {
    type: 'warning'
  })
      .then(() => {

        let config = {
          method: 'get',
          maxBodyLength: Infinity,
          url: 'http://localhost:8080/course/remove?id='+row.curriculum.id,
          headers: { }
        };

        axios.request(config)
            .then((response) => {
              if (response.data["status"] == "OK"){
                ElMessage.success(response.data["message"])
                tableData.value.splice(index, 1);
              }else {
                ElMessage.error(response.data["message"])
              }
            })
            .catch((error) => {
              ElMessage.error(error.response.data["message"])

            });
        //

      })
      .catch(() => {});

};

// 表格编辑时弹窗和保存
const editVisible = ref(false);

const insertVisible = ref(false);

let form = reactive({
  name: '',
  class_hour: '',
  credit:'',
  grade:'',
  public:''
});
let idx: number = -1;
const editCourseData = ref()
const handleEdit = (index: number, row: any) => {
  //
  let trTemp: any[] = []
  row.dept.forEach(it=>{
    trTemp.push(it['id'])
  })
  trValue.value = trTemp
  // 将本课程原来的系写入
  editCourseData.value = row.curriculum
  idx = index;
  console.log(row)
  form.name = row.curriculum.courseName;
  form.class_hour = row.curriculum.classHour
  form.credit = row.curriculum.credit
  form.grade = row.curriculum.level
  form.public = row.curriculum.publicRequired
  // form. = row.employeeId;
  // form.role = row.role;
  // form.userNo = row.userNo;

  trData.value = []

  let Data: trItem[] = []
  let allDept: any[] = []
  let allDeptID: any[] = []

  let config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: proxy?.$baseURL+'/depts',
    headers: { }
  };


  axios.request(config)
      .then((response) => {
        response.data['data'].forEach((i: any)=>{
          allDept.push(i)
          allDeptID.push(i['deptName'])
        })

        allDept.forEach((city, index) => {
          console.log(city['deptName'])
          Data.push({
            label: city['deptName'],
            key: city['id'],
            initial: allDeptID[index],
          })
          trData.value = Data
        })
      })
      .catch((error) => {
        console.log(error);
      });


  // console.log(Data)
  // Data.push()


  editVisible.value = true;
};


const onTrChange = () => {
  console.log(trValue.value);
}
const insertOnTrChange = () => {

  console.log(insertTrValue.value);
}

const getAllDept = () => {

  trData.value = []

  let Data: trItem[] = []
  let allDept: any[] = []
  let allDeptID: any[] = []

  let config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: proxy?.$baseURL+'/depts',
    headers: { }
  };


  axios.request(config)
      .then((response) => {
        response.data['data'].forEach((i: any)=>{
          allDept.push(i)
          allDeptID.push(i['deptName'])
        })

        allDept.forEach((city, index) => {
          console.log(city['deptName'])
          Data.push({
            label: city['deptName'],
            key: city['id'],
            initial: allDeptID[index],
          })
          insertTrData.value = Data
        })
      })
      .catch((error) => {
        console.log(error);
      });

}


// 保存编辑的老师
const saveEdit = () => {
  let data = JSON.stringify({
    "curriculum": {
      "id": editCourseData.value.id,
      "courseName": form.name,
      "classHour": form.class_hour,
      "level": form.grade,
      "publicRequired": form.public,
      "credit": form.credit
    },
    "deptids": trValue.value
  });

  let config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: 'http://localhost:8080/course/update',
    headers: {
      'Content-Type': 'application/json'
    },
    data : data
  };

  axios.request(config)
      .then((response) => {
        if (response.data["status"] == "OK"){
          ElMessage.success(response.data["message"])
          editVisible.value = false
          getData(1)
        }else {
          ElMessage.error(response.data["message"])
        }
      })
      .catch((error) => {
        ElMessage.error(error.response.data["message"])
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
