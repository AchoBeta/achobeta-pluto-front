<script setup>
import { getPowerApi } from '@/utils/api/teamInformation.ts'

const tableData = ref([]);

const allData = ref([
      {
        id:1,
        name: '张三',
        group: 'A组',
        grade: '大二',
        major: '计算机科学与技术',
        present: '在读',
        phone: '13800000001'
      },
      {
        id:2,
        name: '李四',
        group: 'B组',
        grade: '大三',
        major: '软件工程',
        present: '实习',
        phone: '13800000002'
      },
      {
        id:3,
        name: '王五',
        group: 'C组',
        grade: '大四',
        major: '信息安全',
        present: '毕业',
        phone: '13800000003'
      },
      {
        id:4,
        name: '赵六',
        group: 'D组',
        grade: '研究生',
        major: '人工智能',
        present: '在读',
        phone: '13800000004'
      },
      {
        id:5,
        name: '孙七',
        group: 'E组',
        grade: '博士生',
        major: '计算机科学与技术',
        present: '在读',
        phone: '13800000005'
      },
      {
        id:6,
        name: '张三',
        group: 'A组',
        grade: '大二',
        major: '计算机科学与技术',
        present: '在读',
        phone: '13800000001'
      },
      {
        id:7,
        name: '李四',
        group: 'B组',
        grade: '大三',
        major: '软件工程',
        present: '实习',
        phone: '13800000002'
      },
      {
        id:8,
        name: '王五',
        group: 'C组',
        grade: '大四',
        major: '信息安全',
        present: '毕业',
        phone: '13800000003'
      },
      {
        id:9,
        name: '赵六',
        group: 'D组',
        grade: '研究生',
        major: '人工智能',
        present: '在读',
        phone: '13800000004'
      },
      {
        id:10,
        name: '孙七',
        group: 'E组',
        grade: '博士生',
        major: '计算机科学与技术',
        present: '在读',
        phone: '13800000005'
      },
      {
        id:11,
        name: '张三',
        group: 'A组',
        grade: '大二',
        major: '计算机科学与技术',
        present: '在读',
        phone: '13800000001'
      },
      {
        id:12,
        name: '李四',
        group: 'B组',
        grade: '大三',
        major: '软件工程',
        present: '实习',
        phone: '13800000002'
      },
      {
        id:13,
        name: '王五',
        group: 'C组',
        grade: '大四',
        major: '信息安全',
        present: '毕业',
        phone: '13800000003'
      },
      {
        id:14,
        name: '赵六',
        group: 'D组',
        grade: '研究生',
        major: '人工智能',
        present: '在读',
        phone: '13800000004'
      },
      {
        id:15,
        name: '孙七',
        group: 'E组',
        grade: '博士生',
        major: '计算机科学与技术',
        present: '在读',
        phone: '13800000005'
      },
      {
        id:16,
        name: '张三',
        group: 'A组',
        grade: '大二',
        major: '计算机科学与技术',
        present: '在读',
        phone: '13800000001'
      },
      {
        id:17,
        name: '李四',
        group: 'B组',
        grade: '大三',
        major: '软件工程',
        present: '实习',
        phone: '13800000002'
      },
      {
        id:18,
        name: '王五',
        group: 'C组',
        grade: '大四',
        major: '信息安全',
        present: '毕业',
        phone: '13800000003'
      },
      {
        id:19,
        name: '赵六',
        group: 'D组',
        grade: '研究生',
        major: '人工智能',
        present: '在读',
        phone: '13800000004'
      },
      {
        id:20,
        name: '孙七',
        group: 'E组',
        grade: '博士生',
        major: '计算机科学与技术',
        present: '在读',
        phone: '13800000005'
      }
    ]);
const loading = ref(false);
const pageSize = 9; // 每次加载的数据量
let currentPage = 1;
 
const noMore = computed(() => currentPage * pageSize >= allData.value.length);
 
const loadMore = () => {
  if (loading.value || noMore.value) return;
  loading.value = true;
  setTimeout(() => {
    const start = (currentPage - 1) * pageSize;
    const end = currentPage * pageSize;
    tableData.value = [...tableData.value, ...allData.value.slice(start, end)];
    currentPage++;
    loading.value = false;
  }, 2000); // 模拟异步加载延迟
};
// 初始加载第一页数据//while(currentPage < allData.value.length)
loadMore();

//拉框
const selectedTeam = ref('AchoBeta 1.0');
const dropdownItems = ref([
  { command: 'AchoBeta 1.0', label: 'AchoBeta 1.0' },
  { command: 'AchoBeta 2.0', label: 'AchoBeta 2.0' },
  { command: 'AchoBeta 3.0', label: 'AchoBeta 3.0' }
]);
const handleCommand = (command) => {
  selectedTeam.value = command;
};
const teamEdit = ref('团队架构');

//删除
function showDelete(id) {
  ElMessageBox.confirm(
    '是否确认删除此团队成员？',
    '提示',
    {
      type: 'warning',
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      // 可以添加其他配置选项，如 showCancelButton: true（默认情况下已经是 true）
    }
  ).then((confirm) => {
    if (confirm) {

      console.log("用户点击了确认，准备删除ID为", id, "的成员");
      // 在这里添加删除成员的逻辑，比如发送请求到服务器
    } else {
      ElMessage({
      message: '已取消删除。',
      type: 'warning'
    }),
      console.log("用户点击了取消");
    }
  }).catch((error) => {
    ElMessage.error('出错了！'),
    console.error("显示消息框时发生错误:", error);
    // 处理显示消息框过程中可能出现的错误
  });
}
function handleDelete(id){
  console.log("执行了接口")
}


//团队信息
const first_teamid = ref();
const first_team_name = ref('');
const teams = ref([]);//团队成员信息

//权限组  **需要修改url
const urls = ref([1]);
const TeamStrManage = computed(() => urls.value.includes("/team/members/:userid"));//团队架构管理
const deleteMember = computed(() => urls.value.includes("/team/memberlist/:userid"));//删除团队成员
const addMember = computed(() => urls.value.includes("/team/memberlist/:userid"));//新增用户

onMounted(async() =>{
  try {
        const atoken = localStorage.getItem('atoken');
        if (!atoken) {
          ElMessage.error('未找到认证令牌。');
          return; // 如果没有令牌，则不继续执行
        }

        const responseFirst = await getPowerApi({atoken});
        first_teamid.value = responseFirst.first_teamid;
        first_team_name.value = responseFirst.first_team_name;
 
        const responseScecond = await getPowerApi({atoken , first_teamid});
        urls.value = responseScecond.urls;
        teams.value = responseScecond.teams;
      } catch (error) {
        ElMessage.error('数据获取失败。');
        console.error('Error fetching data:', error);
      }
})
</script>

<template>
  <div class="box">
    <div class="box-header">
      <span class="title" style="cursor: default">团队信息</span>
      <span class="currentTeam" style="cursor: default">当前团队：</span>
      <el-dropdown @command="handleCommand">
      <span class="el-dropdown-link">
        {{ selectedTeam }}
        <el-icon class="el-icon--right">
          <CaretBottom />
        </el-icon>
      </span>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item 
            v-for="item in dropdownItems" 
            :key="item.command" 
            :command="item.command"
            :disabled="item.command === selectedTeam"
            :class="{ 'is-disabled': item.command === selectedTeam }">
            {{ item.label }}
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
    <div v-if="urls.length!=0" class="btn-group">
      <el-button type="info" plain class="btn1">
        <span v-if="TeamStrManage" class="btn-content">团队架构管理</span>
        <span v-else class="btn-content">团队架构查看</span>
      </el-button>
      <el-button v-if="addMember" type="primary" plain class="btn2">
        <span class="btn-content">新增用户</span>
      </el-button>
    </div>
    </div>
    <div class="box-team" v-infinite-scroll="loadMore" infinite-scroll-disabled="loading || noMore" infinite-scroll-distance="10" style="cursor: default">
      <el-table :data="allData" stripe style="width: 100%"  height="550px" class="large-text-table">
          <el-table-column prop="name" label="姓名"/>
          <el-table-column prop="group" label="组别"/>
          <el-table-column prop="grade" label="年级"/>
          <el-table-column prop="major" label="专业"/>
          <el-table-column prop="present" label="现状"/>
          <el-table-column prop="phone" label="联系方式"/>
          <el-table-column label="操作" width="auto">
            <template v-slot="scope">
              <!-- <el-button type="text" @click="handleViewDetail(scope.row.id)">查看详情</el-button> -->
              <el-button type="text">查看详情</el-button>
              <el-button v-if="deleteMember" type="text" @click="showDelete(scope.row.id)" class="delete">
                <el-icon><DeleteFilled /></el-icon>
                删除
              </el-button>
            </template>
          </el-table-column>
      </el-table>
      <p v-if="loading">Loading...</p>
      <p v-if="noMore">No more data</p>
    </div> 
  </div>
</template>

<style scoped>
/*全局*/
.box {
  width:100%;
  height:98%;
  margin:0px;
  padding:2%;
  background-color: #FFFFFF;
  border-radius: 1.5%;
}

/*头部*/
.box-header {
  margin-bottom: 30px;
}
.title {
  font-size: 2.1em;
  font-weight: 500;
  margin-left: 20px;
}
.currentTeam {
  font-size: 1.5em;
  font-weight: 500;
  padding-left: 0.5em;
  margin-left: 1em;;
}
.el-dropdown-link {
  cursor: pointer;
  color: #000000;
  display: flex;
  align-items: center;
  font-size: 1.5em;
  margin-top: 14px;
}
.el-dropdown-menu__item.is-disabled {
  color: gray;
  cursor: not-allowed;
  pointer-events: none; /* 禁止点击 */
}
.el-dropdown-menu {
  transition: all 0.5s ease; /* 控制速度 */
}
.btn-group {
  float: right;
  margin-right: 20px;
}
.btn1 , .btn2{
  padding: 25px;
  margin-left:40px;
}
.btn1:hover {
    border:solid 1.5px #1f0202;
}
.btn2:hover {
  border:solid 1.5px #005eff;
}
.btn-content {
font-size: 20px;
}

/*表格*/
.box-team{
  margin-left:3%;
}
.delete {
  padding:5px;
}
.delete:hover {
  color: red; 
}
.large-text-table {
  font-size: 18px; 
}
.large-text-table .el-table__body-wrapper::-webkit-scrollbar-track {
  background-color: red; /* 滚动条轨道的颜色 */
}
p {
    text-align: center;
    margin: 20px 0;
    font-size: 16px;
}
</style>