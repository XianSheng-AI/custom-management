<template>
    <div id="role-management">
      <!-- 搜索条件 -->
        <div class="condition">
          <div class="condition-empty">
            <div class="condition-item">
              <label for="company" value='客户'>客户 :&nbsp;</label>
              <input class="input-com" 
              name="company" 
              type="text" 
              v-model="findData.roleName"
              >
            </div>
            <div class="condition-item">
              <label for="company" value='账号'>账号 :&nbsp;</label>
              <input class="input-com"  
              name="company" 
              type="text" 
              v-model="findData.roleNo"
              >
            </div>
            <div class="condition-item">
              <label for="company" value='开始时间'>开始时间 :&nbsp;</label>
              <input class="input-com"  
              name="company" 
              type="text" 
              v-model="findData.roleNo"
              >
            </div>
            <div class="condition-item">
              <label for="company" value='结束时间'>结束时间 :&nbsp;</label>
              <input class="input-com"  
              name="company" 
              type="text" 
              v-model="findData.roleNo"
              >
            </div>
            <!-- 查询按钮 -->
            <div class="sub-btn" @click="findDataM()"><svgicon iconClass="icon-chazhao" class="do-icon-com"></svgicon>查询</div>
          </div>
        </div>
        <!-- 按钮操作组 -->
        <div class="button-group">
          <!-- <div class="btn-com" @click="doBottom('add')"><svgicon iconClass="icon-jia11" class="do-icon-com"></svgicon>新增</div> -->
          <!-- <div class="btn-com" @click="confirmBatch('del')"><svgicon iconClass="icon-shanchu3" class="do-icon-com"></svgicon>删除</div> -->
          <!-- <div class="btn-com" @click="doBottom('jin')"><svgicon iconClass="icon-jinyong1" class="do-icon-com"></svgicon>禁用</div> -->
          <div class="btn-com" @click="doBottom('dao')"><svgicon iconClass="icon-daochu" class="do-icon-com"></svgicon>导出</div>
        </div>
        <!-- 信息表 @on-selection-change='selectionClick'不能有括号-->
        <Table border ref="selection" 
        :columns="columnsHeader" 
        :data="historyData"
        
        @on-selection-change='selectionClick'
        >
          <!-- <template slot-scope="{ row }" slot="name">
              <strong>{{ row.name }}</strong>
          </template>
          <template slot-scope="{ row, index }" slot="action">
              <Button type="primary" size="small"  @click="show(index)">查看</Button>
              <Button type="warning" size="small" style="margin: 0 5px" @click="modify(index)">修改</Button>
              <Button type="primary" size="small" style="margin-right: 5px"  @click="show(index)">修改</Button>
              <Button type="error" size="small" @click="confirmSingle(index)">删除</Button>
          </template> -->
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
     modal1:false,
     modal2:false,
     companyTreeBool:false,
     batchDel:false,
     batchDelData:null,
     selectBool:false,
     treeBoolMenu:true,
     addData:{
        name: '',
        code: new Number(),
        company: '',
        data:'',
        enable: '',
        menu: ''
     },
     findData:{
       company:'',
       roleName:'',
       roleNo:''
     },
     fixData:{
       name:'',
       company:'',
       index:'',
     },
    //  分页条
     ajaxHistoryData:[],
    // 初始化信息总条数
    dataCount:0,
    // 每页显示多少条
    pageSize:1,

    historyData: [
      {
      customer:'天天快递',
      account:'@DFWS',
      online_time:'2019.3.10',
      use_count:'1228',
      use_time:'12小时'
      },
      {
      customer:'天天快递',
      account:'@DFWS',
      online_time:'2019.3.10',
      use_count:'1228',
      use_time:'12小时'
      },
      {
      customer:'天天快递',
      account:'@DFWS',
      online_time:'2019.3.10',
      use_count:'1228',
      use_time:'12小时'
      },
      {
      customer:'天天快递',
      account:'@DFWS',
      online_time:'2019.3.10',
      use_count:'1228',
      use_time:'12小时'
      },
      {
      customer:'天天快递',
      account:'@DFWS',
      online_time:'2019.3.10',
      use_count:'1228',
      use_time:'12小时'
      },
      {
      customer:'天天快递',
      account:'@DFWS',
      online_time:'2019.3.10',
      use_count:'1228',
      use_time:'12小时'
      },
      {
      customer:'天天快递',
      account:'@DFWS',
      online_time:'2019.3.10',
      use_count:'1228',
      use_time:'12小时'
      },
      {
      customer:'天天快递',
      account:'@DFWS',
      online_time:'2019.3.10',
      use_count:'1228',
      use_time:'12小时'
      },
      {
      customer:'天天快递',
      account:'@DFWS',
      online_time:'2019.3.10',
      use_count:'1228',
      use_time:'12小时'
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
                        title: '账号',
                        key: 'account',
                        
                    },
                    {
                        title: '上线时间',
                        key: 'online_time'
                    },
                    {
                        title: '使用次数',
                        key: 'use_count'
                    },
                    {
                        title: '使用时长',
                        key: 'use_time'
                    }
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
    // 改变数据结构
    /*
      $params  
      例如:  
      oldArr=[{},{menuName:[{},{}]}]
      dataName = menuName
    */
  //  角色管理--新增按钮-菜单树
   changeMenuStructure(resData,newData){
     for(let i=0,len=resData.length;i<len;i++){
       //  添加属性
       newData[i]={};
       newData[i].title=resData[i].menuName;
       newData[i].expand=true;
       if(!!resData[i].childMenu){
         newData[i].children=[]
         this.changeMenuStructure(resData[i].childMenu,newData[i].children)
         
       }
     }
     return newData
   },
    getToken(){
      this._token=Storage.getSession('access_token');
    },
    getSelectedNodesData(arr,item){
    },
    choiceMenu(arr){
    },
    findDataM(){
      let findObj=this.findData;
      getRoleList({
        access_token:this._token,
        bePage:1,
        currPage:this.pageSize,
        deptId: findObj.company,
        roleNo: findObj.roleNo,
        roleName: findObj.roleName
      }).then(res=>{
        if(res.code==='200'){
        }
      })
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

    // 点击表格里的复选框事件
    selectionClick(arr){
       this.batchDelData=arr;
    },
    // 确认删除选中的表格数据
    okBatchDel(){

    },
    // 取消删除选中的表格数据
    cancelBatchDel(){
      
    },

    showCompanyTree(){
      apiCompany({
        access_token:this._token
      }).then(res=>{
        
      })
      this.companyTreeBool=true;
    },
    // 递归改变json格式
    changeJson(da){
      let oldObj={

      }
    },
    // 确定选中单位树
    okTree(){
      let el=this.$refs.tree.getSelectedNodes();  //返回选中数据
      this.$refs.company.value=el[0].title;
    },
    choiceCompany(){
      
    },
   
    handleSelectAll (status) {
      this.$refs.selection.selectAll(status);
    },
    addKeyMenuStructure(resData,addAttr,s){
     for(let i=0,len=resData.length;i<len;i++){
       //  添加属性
       resData[i][addAttr]=s;
       if(!!resData[i].childMenu){
          
         this.addKeyMenuStructure(resData[i].childMenu,addAttr,++s)
         
       }
     }
     return resData
   },
    doBottom(who){
      if(who==='add'){
        getMenuList({
          access_token:this._token,
        }).then(res=>{
          if(res.code==='200'){
            let addAttr='nodeKey',s=0;
            let newKeyData=this.$options.methods.addKeyMenuStructure(res.data,addAttr,s)
            this.keyTreeData=newKeyData;
            let oldMenu=[]
            let newMenu=this.$options.methods.changeMenuStructure(res.data,oldMenu)
            this.menuData=newMenu;
            return;
          }
        })
        this.modal2=true;
        return;
      };
    },
    show(index) {
      this.fixData.index=index;
      this.modal1=true;
    },
    confirmBatch (){
      if(this.batchDelData===null){
        this.$Message.info('您没选中任何信息!');
        return;
      }
      this.$Modal.confirm({
        title: '操作警告',
        content: '<p>您确认删除选中数据?</p>',
        onOk: () => {
          let arr = this.batchDelData;
          let _this=this;
          for(let i=0,len=arr.length;i<len;i++){
            let index=this.data1.findIndex((v)=>{return v.code==arr[i].code})
            if(index!==-1){
              _this.$options.methods.handleListApproveHistory();
            }
          }
          this.$Message.info('删除成功!');
        },
        onCancel: () => {
            this.$Message.info('取消操作!');
        }
    });
    },
    confirmSingle (index) {
    this.$Modal.confirm({
        title: '操作警告',
        content: '<p>您确认删除此角色?</p>',
        onOk: () => {
          this.data1.splice(index, 1);
          this.$Message.info('删除成功!');
        },
        onCancel: () => {
            this.$Message.info('取消操作!');
        }
    });
    },
    remove (index) {
        this.data1.splice(index, 1);
    },
    ok () {
        let _this=this;
        _this.data1[_this.fixData.index].name=_this.fixData.name;
        _this.data1[_this.fixData.index].company=_this.fixData.company;
        
        _this.$options.methods.clearFixData(_this);
        _this.$Message.info('修改成功!');
    },
    cancel () {
        this.$Message.info('取消操作!');
    },
    clearFixData(_this){
      _this.fixData={  name:'',company:'',index:'', }
    },
    ok2 () {
        this.data1.push(this.addData)
        this.$Message.info('您点击了确认');
    },
    cancel2 () {
        this.$Message.info('您点击了取消');
    }
  }
}
</script>

<style lang='stylus' scoped>
  .ivu-page{
      margin 10px auto
  }
  #role-management
    .condition
      margin 16px 0
      .condition-empty
        width 100%
        overflow hidden
        .condition-item
          float left
          padding 10px 30px 10px 0
          &:nth-of-type(1)
            input 
              width 200px
          label 
            font-size 16px
            color #515a6e
          input 
            padding 6px 0
            background #eee
            font-size 16px
            border-radius 10px
            text-indent 8px

        .sub-btn
          float left
          line-height 36px
          padding 0 10px
          background #515a6eb0
          font-size 15px
          margin-top 10px
          border-radius 10px
          line-height 36px
          color #eee
          transition .3s
          cursor pointer
          &:hover
            background #515a6e
          &:active
            background #515a6eb0
    .button-group
      overflow hidden
      margin-bottom 26px
      .btn-com
        font-size 15px
        padding 0 10px
        float left
        background red
        margin-right 10px
        line-height 36px
        color #eeeeee
        border-radius 10px
        cursor pointer
        transition .3s
        &:nth-of-type(1)
          background rgba(28,132,198,0.78)
          &:hover
              background-color rgba(28, 132, 198, 0.94)
            &:active
              background-color rgba(28,132,198,0.78)
        &:nth-of-type(2)
          background #f59da6
          &:hover
              background-color #fd6b7a
            &:active
              background-color #f59da6
        &:nth-of-type(3)
          background rgba(81,90,110,0.71);
          &:hover
              background-color rgba(81, 90, 110, 0.92)
            &:active
              background-color rgba(81,90,110,0.71);
        &:nth-of-type(4)
          background #f8ac59
          &:hover
              background-color #d3740d
            &:active
              background-color #f8ac59
  .modal-fix
    margin 32px 0
    label 
      font-size 14px
      color #515a6e
    input 
      background #eeeeee
      font-size 15px
      padding 6px 20px
      border-radius 10px
      text-indent 1px
  .set-wrapper
    overflow hidden
    .set-left
      float left
      .modal-new
        margin 32px 0
        label 
          font-size 14px
          color #515a6e
        input
          background #eeeeee
          font-size 15px
          padding 6px 20px
          border-radius 10px
          text-indent 1px
    .set-right
      float right
      padding 10px
      border-radius 10px
      background #eee
      
</style>



















