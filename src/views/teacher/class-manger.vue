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
            加入班级
          </div>
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

          <span style="margin-left: 1%" class="label">班级：</span>
          <el-select v-model="clazz" @change="">
            <el-option v-for="clazz in tableData" :label="clazz['className']" :value="clazz['id']"></el-option>
          </el-select>

          <el-button style="margin-left: 1%" type="primary" :icon="Plus"  @click="insertClass">加入班级</el-button>
        </div>
      </div>


      <div style="margin-bottom: 1%">
        我的班级
      </div>

      <el-table :data="myClass" border class="table" ref="multipleTable" header-cell-class-name="table-header">

        <el-table-column #default="scope" prop="id" label="ID" width="55" align="center">{{scope.$index+((query.pageIndex-1)*8)+1}}</el-table-column>
        <el-table-column prop="className" label="班级名"></el-table-column>

        <el-table-column prop="createTime" label="创建时间"></el-table-column>
        <el-table-column prop="modifyTime" label="编辑时间"></el-table-column>

        <el-table-column label="操作" width="420" align="center">
          <template #default="scope">
            <el-button v-if="scope.row['counsellorId'] == null" text :icon="Edit" @click="toBeCounselor(scope.$index, scope.row)" v-permiss="2">
              成为导员
            </el-button>
            <el-button v-else-if="scope.row['counsellorId'] === JSON.parse(userID)['id']" text :icon="Edit" @click="retiredCounselor(scope.$index, scope.row)" v-permiss="2">
              卸任导员
            </el-button>
            <el-button v-else text :icon="Edit" @click="toBeCounselor(scope.$index, scope.row)" v-permiss="2">

            </el-button>

            <el-button text :icon="Delete" @click="handleDelete(scope.$index, scope.row)" v-permiss="2">
              退出班级
            </el-button>

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
import { ref, reactive } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { Delete, Edit, Search, Plus } from '@element-plus/icons-vue';
import { fetchData } from '../../api/index';
import axios, {AxiosResponse} from "axios";
let globeHeaders = {
  'token':localStorage.getItem('jwtToken')
}

const status = ref<string>('normal');
const grade = ref<string>('');
let grades = ref<string[]>([]);

let dept = ref<string[]>('');
let depts = ref<string[]>([]);

let dept2 = ref<string[]>('');
let depts2 = ref<string[]>([]);


let clazz = ref<string[]>('');



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
    url: 'http://localhost:8080/class/classes?grade='+grade.value+'&page='+page,
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
// getData(1,null);

const getMyClass = () => {
  let config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: 'http://localhost:8080/teacher/getclass',
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

// 教师加入班级
const insertClass = () => {
  console.log(clazz)
  let config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: 'http://localhost:8080/teacher/joinclass?classid='+clazz.value,
    headers: globeHeaders,
  };

  axios.request(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
        getMyClass()
      })
      .catch((error) => {
        console.log(error);
      });

}

// 退出班级
const handleDelete = (index: number,row: any) => {
  // 二次确认删除
  ElMessageBox.confirm('确定要删除吗？', '提示', {
    type: 'warning'
  })
      .then(() => {
        let config = {
          method: 'get',
          maxBodyLength: Infinity,
          url: 'http://localhost:8080/teacher/deleteClass?classid='+row.id,
          headers: globeHeaders
        };

        axios.request(config)
            .then((response) => {
              console.log(JSON.stringify(response.data));
              getMyClass()
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
  className: '',
  year: '',
});
let idx: number = -1;

// 成为导员
const toBeCounselor = (index: number, row: any) => {
  let config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: 'http://localhost:8080/teacher/regcor?classid='+row.id,
    headers: globeHeaders
  };

  axios.request(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
        getMyClass()
      })
      .catch((error) => {
        console.log(error);
      });

}

// 卸任导员
const retiredCounselor = (index: number, row: any) => {
  let config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: 'http://localhost:8080/teacher/retirecor?classid='+row.id,
    headers: globeHeaders
  };

  axios.request(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
        getMyClass()
      })
      .catch((error) => {
        console.log(error);
      });
}

const handleEdit = (index: number, row: any) => {
  console.log(row)
  idx = index;
  form.className = row.className;
  form.year = grade.value;
  editVisible.value = true;
};


// 设置年级状态
const handleChange1 = (val: string[]) => {
  let url = 'http://localhost:8080/grades?status='+status.value

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

//获取正常的年级
const getSelectGrade = () => {
  let url = 'http://localhost:8080/grades?status=normal'

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

// 设置年级
const handleChange2 = (val: string[]) => {
  let config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: 'http://localhost:8080/class/classes?grade='+grade.value+'&page=1',
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

// 设置系
const handleChange3 = (val: string[]) => {
  let config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: 'http://localhost:8080/class/classes?grade='+grade.value+'&page=1&dept='+dept.value,
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
    url: 'http://localhost:8080/depts',
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
