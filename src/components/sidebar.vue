<template>
    <div class="sidebar">
        <el-menu
            class="sidebar-el-menu"
            :default-active="onRoutes"
            :collapse="sidebar.collapse"
            background-color="#324157"
            text-color="#bfcbd9"
            active-text-color="#20a0ff"
            unique-opened
            router
        >
            <template v-for="item in items">
                <template v-if="item.subs">
                    <el-sub-menu :index="item.index" :key="item.index" v-permiss="item.permiss">
                        <template #title>
                            <el-icon>
                                <component :is="item.icon"></component>
                            </el-icon>
                            <span>{{ item.title }}</span>
                        </template>
                        <template v-for="subItem in item.subs">
                            <el-sub-menu
                                v-if="subItem.subs"
                                :index="subItem.index"
                                :key="subItem.index"
                                v-permiss="item.permiss"
                            >
                                <template #title>{{ subItem.title }}</template>
                                <el-menu-item v-for="(threeItem, i) in subItem.subs" :key="i" :index="threeItem.index">
                                    {{ threeItem.title }}
                                </el-menu-item>
                            </el-sub-menu>
                            <el-menu-item v-else :index="subItem.index" v-permiss="item.permiss">
                                {{ subItem.title }}
                            </el-menu-item>
                        </template>
                    </el-sub-menu>
                </template>
                <template v-else>
                    <el-menu-item :index="item.index" :key="item.index" v-permiss="item.permiss">
                        <el-icon>
                            <component :is="item.icon"></component>
                        </el-icon>
                        <template #title>{{ item.title }}</template>
                    </el-menu-item>
                </template>
            </template>
        </el-menu>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useSidebarStore } from '../store/sidebar';
import { useRoute } from 'vue-router';

const admin=[

  {
    icon: 'Calendar',
    index: '1',
    title: '成员相关',
    permiss: '1',
    subs: [
      {
        index: '/std-manger',
        title: '学生管理',
        permiss: '1',
      },
      {
        index: '/teacher-manger',
        title: '教师管理',
        permiss: '1',
      },
      // {
      //   index: '/import',
      //   title: '导入Excel',
      //   permiss: '1',
      // },
      // {
      //   index: '/export',
      //   title: '导出Excel',
      //   permiss: '1',
      // },
    ],
  },

  {
    icon: 'Calendar',
    index: '2',
    title: '考试相关',
    permiss: '1',
    subs: [
      {
        index: '/exam-info-release',
        title: '发布考试通知',
        permiss: '1',
      },
      {
        index: '/exam-result-release',
        title: '成绩管理',
        permiss: '1',
      },
    ],
  },

  {
    icon: 'Calendar',
    index: '3',
    title: '班级相关',
    permiss: '1',
    subs: [
      {
        index: '/admin-class-manger',
        title: '班级管理',
        permiss: '1',
      },
      {
        index: '/dept-manger',
        title: '院系管理',
        permiss: '1',
      },
      {
        index: '/garde-manger',
        title: '年级管理',
        permiss: '1',
      },

    ],
  },
  {
    icon: 'Calendar',
    index:'4',
    title:'课程管理',
    permiss: '1',
    subs: [
      {
        index: '/admin-course-manger',
        title: '课程管理',
        permiss: '1',
      },
      {
        index: '/selected-manger',
        title: '选课批准',
        permiss: '1,2',
      }
    ]
  },
  {
    icon: 'Calendar',
    index: '/edu-notice',
    title: '教务公告',
    permiss: '1',
  },
  {
    icon: 'Calendar',
    index: '/reg-key',
    title: '教师注册key',
    permiss: '1',
  },
];

const teacher=[
  {
    icon: 'Calendar',
    index: '3',
    title: '老师相关',
    permiss: '2',
    subs: [
      {
        index: '/teacher/class-manger',
        title: '我的班级',
        permiss: '2',
      },
      // {
      //   index: '/teacher/course-manger',
      //   title: '我的学科',
      //   permiss: '2',
      // },
    ],
  },
  {
    icon: 'Calendar',
    index: '2',
    title: '考试相关',
    permiss: '2',
    subs: [
      {
        index: '/exam-info-release',
        title: '发布考试通知',
        permiss: '2',
      },
      {
        index: '/exam-result-release',
        title: '成绩管理',
        permiss: '2',
      },
    ],
  },
  {
    icon: 'Calendar',
    index:'4',
    title:'课程管理',
    permiss: '2',
    subs: [
      {
        index: '/course-manger',
        title: '课程管理',
        permiss: '2',
      },
      {
        index: '/selected-manger',
        title: '选课批准',
        permiss: '2',
      }
    ]
  }
];

const items = localStorage.getItem('ms_role')=='admin_super'?admin:teacher;

const route = useRoute();
const onRoutes = computed(() => {
    return route.path;
});

const sidebar = useSidebarStore();
</script>

<style scoped>
.sidebar {
    display: block;
    position: absolute;
    left: 0;
    top: 70px;
    bottom: 0;
    overflow-y: scroll;
}
.sidebar::-webkit-scrollbar {
    width: 0;
}
.sidebar-el-menu:not(.el-menu--collapse) {
    width: 250px;
}
.sidebar > ul {
    height: 100%;
}
</style>
