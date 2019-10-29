<template>
    <div id="role-management">
      
        <!-- 按钮操作组 -->
        <!-- <div class="button-group"> -->
          <!-- <div class="btn-com" @click="doBottom('add')"><svgicon iconClass="icon-jia11" class="do-icon-com"></svgicon>新增</div> -->
          <!-- <div class="btn-com" @click="confirmBatch('del')"><svgicon iconClass="icon-shanchu3" class="do-icon-com"></svgicon>删除</div> -->
          <!-- <div class="btn-com" @click="doBottom('jin')"><svgicon iconClass="icon-jinyong1" class="do-icon-com"></svgicon>禁用</div>
          <div class="btn-com" @click="doBottom('dao')"><svgicon iconClass="icon-daochu" class="do-icon-com"></svgicon>导出</div>
        </div> -->
        <!-- 信息表 @on-selection-change='selectionClick'不能有括号-->
        <Table 
        :columns="columnsHeader" 
        :data="historyData"
        @on-selection-change='selectionClick'
        >
        </Table>
        <!-- 分页条 -->
        <Page :total="dataCount" :page-size="pageSize" show-total  @on-change="changepage"></Page>
    </div>
</template>

<script>
import { 
  apiCompany,
  getRoleList,
  getMenuList 
        } from '@/request/api'
import Storage from '@/util/storage'
export default {
  name:'account-information',
  data(){
   return {
     _token:'',
   
    //  分页条
     ajaxHistoryData:[],
    // 初始化信息总条数
    dataCount:0,
    // 每页显示多少条
    pageSize:1,

    historyData: [
      {
      customer:'DC',
      account:'@jack',
      online_time:'2019.4.13',
      Contact:'163邮箱',
      },
      {
      customer:'DC',
      account:'@jack',
      online_time:'2019.4.13',
      Contact:'163邮箱',
      },
      {
      customer:'DC',
      account:'@jack',
      online_time:'2019.4.13',
      Contact:'163邮箱',
      },
      {
      customer:'DC',
      account:'@jack',
      online_time:'2019.4.13',
      Contact:'163邮箱',
      },
      {
      customer:'DC',
      account:'@jack',
      online_time:'2019.4.13',
      Contact:'163邮箱',
      },
      {
      customer:'DC',
      account:'@jack',
      online_time:'2019.4.13',
      Contact:'163邮箱',
      },
      {
      customer:'DC',
      account:'@jack',
      online_time:'2019.4.13',
      Contact:'163邮箱',
      },
      {
      customer:'DC',
      account:'@jack',
      online_time:'2019.4.13',
      Contact:'163邮箱',
      },
      {
      customer:'DC',
      account:'@jack',
      online_time:'2019.4.13',
      Contact:'163邮箱',
      },
      {
      customer:'DC',
      account:'@jack',
      online_time:'2019.4.13',
      Contact:'163邮箱',
      },
      {
      customer:'DC',
      account:'@jack',
      online_time:'2019.4.13',
      Contact:'163邮箱',
      }
    ],
     choices:[],//在右边需展示出来的数据
      keyTreeData:null,
      menuData:[],
     columnsHeader: [
                    {
                        type: 'index',
                        width: 60,
                        align: 'center'
                    },
                    {
                        title: '客户',
                        key: 'customer'
                    },
                    {
                        title: '账户',
                        key: 'account',
                        
                    },
                    {
                        title: '上线时间',
                        key: 'online_time'
                    },
                    {
                        title: '联系方式',
                        key: 'Contact'
                    },
                    // {
                    //     title: '操作',
                    //     slot: 'action',
                    //     width: 180,
                    //     align: 'center'
                    // }
                ],
  
   }
  },
  created(){
    this.getToken()
    this.handleListApproveHistory();
  },
  computed:{
   
  },
  mounted(){
    
    // this.changeStructure(this.menuData)
    // this.showfor(10)
  },
  methods:{

    getToken(){
      this._token=Storage.getSession('access_token');
    },
   
    // 分页条
    // 获取历史记录信息
    handleListApproveHistory(){
        // 保存取到的所有数据
        // this.ajaxHistoryData = testData.histories
        this.dataCount = this.data1.length;
        // 初始化显示，小于每页显示条数，全显，大于每页显示条数，取前每页条数显示
        if(this.data1.length < this.pageSize){
            // this.historyData = this.data1;
        }else{
            // this.historyData = this.data1.slice(0,this.pageSize);
        }
    },
    changepage(index){
      getRoleList({
        access_token:this._token,
        bePage:index,
        currPage:this.pageSize,
        deptNo: '',
        roleNo: '',
        roleName: ''
      }).then(res=>{
        if(res.code==='200'){
        }
      })
        let _start = ( index - 1 ) * this.pageSize;
        let _end = index * this.pageSize;
    },

 
  }
}
</script>

<style lang='stylus' scoped>
  .ivu-page{
      margin 10px auto
  }
//   #role-management
</style>



















