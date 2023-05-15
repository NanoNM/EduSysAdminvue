<template>
<div>
  <div class="container">
    <div class="handle-box">
      <div style="margin-top: 1%">
        <div style="margin-bottom: 1%">

          <el-button style="margin-left: 1%" type="primary" :icon="Plus" @click="editVisible = true">发布教务通知</el-button>
        </div>
      </div>
    </div>

    <div style="margin-bottom: 1%">
      现在通知
    </div>

    <el-table :data="tableData" border class="table" ref="multipleTable" header-cell-class-name="table-header">

      <el-table-column #default="scope" prop="id" label="ID" width="55" align="center">{{scope.$index+((query.pageIndex-1)*8)+1}}</el-table-column>
      <el-table-column prop="title" label="标题"></el-table-column>
      <el-table-column prop="content" label="内容"></el-table-column>
      <el-table-column prop="createTime" label="创建时间"></el-table-column>

      <el-table-column label="操作" width="420" align="center">
        <template #default="scope">
          <el-button text :icon="Delete" class="red" @click="handleDelete(scope.$index,scope.row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>


    <!-- 编辑弹出框 -->
    <el-dialog title="编辑" v-model="editVisible" width="30%">
      <el-form label-width="70px">
        <el-form-item label="标题">
          <el-input v-model="form.title"></el-input>
        </el-form-item>
        <el-form-item label="详细内容">
          <el-input type="textarea"
                    :rows="5" v-model="form.content"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
				<span class="dialog-footer">
					<el-button @click="editVisible = false">取 消</el-button>
					<el-button type="primary" @click="createNotice">提 交</el-button>
				</span>
      </template>
    </el-dialog>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { Delete, Edit, Search, Plus } from '@element-plus/icons-vue';
import axios, {AxiosResponse} from "axios";
let globeHeaders = {
  'token':localStorage.getItem('jwtToken')
}
const query = reactive({
  pageIndex: 1,
  pageSize: 10000
});

let form = reactive({
  title: '',
  content: '',
});

const editVisible = ref(false);

interface TableItem {

}

const tableData = ref<TableItem[]>([]);

const createNotice = () => {
  let data = JSON.stringify({
    "title": form.title,
    "content": form.content
  });

  let config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: 'http://localhost:8080/admin/create/edunotice',
    headers: {
      'Content-Type': 'application/json'
    },
    data : data
  };

  axios.request(config)
      .then((response) => {
        if (response.data.status == "OK"){
          getNoticeData()
          ElMessage.success(response.data.message);
          editVisible.value = false
        }
        else {
          ElMessage.error(response.data.message);
        }
      })
      .catch((error) => {
        ElMessage.error(error.response.data.message);
      });
}

const getNoticeData = () => {
  let config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: 'http://localhost:8080/admin/edunotices',
    headers: { }
  };

  axios.request(config)
      .then((response) => {
        tableData.value = response.data.data
        console.log(response.data.data)
      })
      .catch((error) => {
        console.log(error);
      });
}

const handleDelete = (index:Any,row:Any) => {

  ElMessageBox.confirm('确定要删除吗？', '提示', {
    type: 'warning'
  })
      .then(() => {
        let config = {
          method: 'get',
          maxBodyLength: Infinity,
          url: 'http://localhost:8080/admin/remove/edunotice?id='+row.id,
          headers: { }
        };

        axios.request(config)
            .then((response) => {
              if (response.data.status == "OK"){
                getNoticeData()
                ElMessage.success(response.data.message);
                editVisible.value = false
              }
              else {
                ElMessage.error(response.data.message);
              }
            })
            .catch((error) => {
              ElMessage.error(error.response.data.message);
            });

      })
      .catch(() => {});



}
getNoticeData()

</script>

<style scoped>

</style>