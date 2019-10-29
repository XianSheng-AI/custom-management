<template>
    <div id="role-management">
      <!-- 搜索条件 -->
        <div class="condition">
          <div class="condition-empty">
            <div class="condition-item">
              <label for="company" value='角色名称'>角色名称 :&nbsp;</label>
              <input class="input-com" 
              name="company" 
              type="text" 
              v-model="findData.roleName"
              >
            </div>
            <div class="condition-item">
              <label for="company" value='角色编号'>角色编号 :&nbsp;</label>
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
          <div class="btn-com" @click="doBottom('add')"><svgicon iconClass="icon-jia11" class="do-icon-com"></svgicon>新增</div>
          <div class="btn-com" @click="doBottom('del')"><svgicon iconClass="icon-shanchu3" class="do-icon-com"></svgicon>删除</div>
          <!-- <div class="btn-com" @click="doBottom('jin')"><svgicon iconClass="icon-jinyong1" class="do-icon-com"></svgicon>禁用</div> -->
          <div class="btn-com" @click="exportData"><svgicon iconClass="icon-daochu" class="do-icon-com"></svgicon>导出</div>
        </div>
        <!-- 信息表 @on-selection-change='selectionClick'不能有括号-->
        <Table 
          :loading="loading"
          border 
          stripe
          highlight-row 
          ref="selection" 
          :columns="columns" 
          :data="roleData" 
          @on-selection-change="selectionClick"
        >   
        <!-- @on-row-click="handleChange"  -->
        </Table>
        <!-- 分页条 -->
          <Page
            :total="total"
            :page-size="findData.currPage"
            :current="findData.bePage"
            :page-size-opts="pageSizeOpts"
            show-total
            show-elevator
            show-sizer
            @on-change="changepage"
            @on-page-size-change="changPageSize"
        ></Page>
        <!-- 点击查看 -->
        <Modal width="760" draggable v-model="lookBool" title="查看角色信息">
          <div class="set-wrapper">
            <!-- 需要设置UI -->
            角色编码------ {{ lookData.roleId }}
            <br>
            角色名称------ {{ lookData.roleName }}
            <br>
            是否有效------ {{ lookData.enable }}
            <br>
          </div>
        </Modal>
        <!-- 修改 -->
        <!-- <Modal
          width="332"
          draggable
          v-model="modal1"
          title="修改信息"
          @on-ok="okFix"
          @on-cancel="cancelFix">
          <div class="modal-fix">
            <label for="fix">角色名称 : </label>
            <input type="text" name="fix" v-model="fixData.name">
          </div>
          <div class="modal-fix">
            <label for="fix2">所属单位 : </label>
            <input type="text" name="fix2" v-model="fixData.company">
          </div>
          <div slot="footer">
            <Button type="ghost" @click="concelFixFun">取消</Button>
            <Button type="primary" @click="confirmFixFun">确定</Button>
         </div>
        </Modal> -->
        <!-- 新增按钮 -->
        <Modal
          draggable
          width="560"
          v-model="modalAdd"
          title="新增角色"
         
          >
          <div class="set-wrapper">
            <div class="set-left">
            <Form v-model="addData" :rules="ruleForm"  >
              <FormItem label="角色编码" prop="roleNo">
                <Input type="text" name="new" v-model="addData.roleNo"></Input>
              </FormItem>
              <FormItem label="角色名称" prop="roleName">
                <Input type="text" name="new" v-model="addData.roleName"></Input>
              </FormItem>
            </Form>
            <!-- @on-cancel="cancelAdd" -->
             <!-- @on-ok="okAdd" -->
              <!-- <div class="modal-new">
                <label for="new">角色编码 : </label>
                <input type="text" name="new" v-model="addData.roleNo">
              </div> -->
              <!-- <div class="modal-new">
                <label for="new">角色名称 : </label>
                <input type="text" name="new" v-model="addData.roleName">
              </div> -->
            </div>
            <div class="set-right">
              <label for="new">权限菜单 :&nbsp; &nbsp; &nbsp; &nbsp; </label>
              <Tree 
              ref="powerTree"
              :data="treeMenuData"
              show-checkbox
              @on-check-change='choiceMenu'
              :render="renderContent"
              ></Tree>
            </div>
          </div>
          <div slot="footer">
            <Button type="text" @click="concelFun">取消</Button>
            <Button type="primary" @click="confirmFun">确定</Button>
         </div>
        </Modal>
        <!-- 修改按钮 -->
        <Modal
          draggable
          width="560"
          v-model="modalFix"
          title="修改角色信息"
          >
          <div class="set-wrapper">
            <div class="set-left">
              <!-- <Form v-model="newDept" :rules="ruleForm"  >
                <div class="modal-new">
                  <span class="preCom">上级部门 :</span>
                  <span class="preTree">
                    <tree-select
                      :options="options"
                      placeholder="请选择分类..."
                      v-model="selectValue"
                      :default-expand-level="3"
                    />
                  </span>
                </div>
                <FormItem label="部门名称" prop="deptName">
                  <Input type="text" name="new" v-model="newDept.deptName"></Input>
                </FormItem>
                <FormItem label="部门编码" prop="deptNo">
                  <Input type="text" name="new" v-model="newDept.deptNo"></Input>
                </FormItem>
              </Form> -->
              <Form v-model="addData" :rules="ruleForm"  >
              <FormItem label="角色编码" prop="roleNo">
                <Input type="text" name="new" v-model="addData.roleNo"></Input>
              </FormItem>
              <FormItem label="角色名称" prop="roleName">
                <Input type="text" name="new" v-model="addData.roleName"></Input>
              </FormItem>
            </Form>
              <!-- <div class="modal-new">
                <label for="new">角色编码 : </label>
                <input type="text" name="new" v-model="addData.roleNo">
              </div>
              <div class="modal-new">
                <label for="new">角色名称 : </label>
                <input type="text" name="new" v-model="addData.roleName">
              </div> -->
            </div>
            <div class="set-right">
              <label for="new">权限菜单 :&nbsp; &nbsp; &nbsp; &nbsp; </label>
              <Tree 
              ref="powerTree"
              :data="treeMenuData"
              show-checkbox
              @on-check-change='choiceMenu'
              :render="renderContent"
              ></Tree>
            </div>
          </div>
          <div slot="footer">
            <Button type="text" @click="concelFun">取消</Button>
            <Button type="primary" @click="confirmFun">确定</Button>
         </div>
        </Modal>
        <!-- 点击单个删除按钮 -->
        <Modal
          draggable
          width="332"
          v-model="modalDel"
          title="删除角色警告"
          @on-ok="okDel"
          @on-cancel="cancelDel">
          <div>您确定删除此角色吗??</div>
        </Modal>
        <!-- 点击批量(batchDel)删除按钮 -->
        <Modal
          draggable
          width="332"
          v-model="modalDelAll"
          title="删除数据"
          @on-ok="okDelAll"
          @on-cancel="cancelDelAll">
          <div>您确定删除选中的角色吗?</div>
        </Modal>
        <!-- 确认批量禁用提示框 -->
        <Modal draggable width="332" v-model="modelStopAll" title="禁用警告"  @on-ok="okStopAll" @on-cancel="cancelStopAll">
          <div>您确定要批量禁用选中的角色吗?</div>
        </Modal>
    </div>
</template>

<script>
import { 
  apiCompany,
  getRoleList,
  getMenuList,     //获取可用菜单改为获取所有可用菜单
  saveRoleInfo,
  deleteRoleInfo,
  deleteRoles,
  setEnableById,
  getRoleInfoByNo,
  getAllUsableMenuList
        } from '@/request/api'
import Storage from '@/util/storage'
export default {
  name:'',
  data(){
    // 角色编码验证
    const validateRoleNo = async (rule, value, callback) => {
      // let winF=this.winFlag;    //false
      let val=this.addData.roleNo;
      if (val === ''||val===undefined) {
        this.winFlag=false;
        return callback(new Error('角色编码不能为空!'));
      }
      
      let flag=true;
      await getRoleInfoByNo({roleNo:val}).then(res=>{
        
        if(res.data!==null){
          flag=false;
          this.deptNoBool=false;
          this.winFlag=true;

        }else{
          flag=true;
          this.winFlag=false;
        }
      })
      if(!flag){
        this.winFlag=false;
        return callback(new Error('角色编码已重复!'));
      }
      this.winFlag=true;
      callback();
      
    };
    // 角色名称验证
    const validateDeptName = (rule, value, callback) => {
      let val=this.addData.roleName;
      if (val === ''||val===undefined) {
        this.winFlagS=false;
        return callback(new Error('角色名称不能为空!'));
      }
      this.winFlagS=true;
      callback();
    };

   return {

     winFlag:false,
     winFlagS:false,

     _token:'',
     modal1:false,
     modal2:false,
     companyTreeBool:false,
     batchDel:false,
     batchDelData:null,
     selectBool:false,
     treeBoolMenu:true,

    deptNoBool:true,
    //  点击禁用
    modelStopAll:false,

    //  点击新增
    modalAdd:false,
     addData:{
        descriptions: "",
        enable: true,
        menuNos: "",
        roleId: "",
        roleName: "",
        roleNo: "",
        usefulMenuDtos: []
     },
     addDataTem:{
       descriptions: "",
        enable: true,
        menuNos: "",
        roleId: "",
        roleName: "",
        roleNo: "",
        usefulMenuDtos: []
     },
     ruleForm: {
        roleNo: [
            {required: true, validator: validateRoleNo, trigger: 'blur' }
        ],
        roleName: [
            {required: true, validator: validateDeptName, trigger: 'blur' }
        ],
      },
    //  表数据  分页条(部分)
     roleData:[],
     findData:{
       bePage:1,
       currPage:10,
       roleNo:'',
       roleName:''
     },

     // 分页条数据
      pageSizeOpts: [5, 10, 15, 20 ,25, 30],
      total: 0,
      loading:true,

    // 点击查看
      lookBool:false,
      lookData:{
        "enable": true,
        "roleId": "",
        "roleName": "",
        "roleNo": ""
      },
      // 点击单个修改
      fixData:{
        "deptId": "",
        "deptName": "",
        "deptNo": "",
        "descriptions": "",
        "email": "",
        "empName": "",
        "empNo": "",
        "enable": true,
        "loginName": "",
        "password": "",
        "roleName": "",
        "roleNo": "",
        "userId": ""
      },
      modalFix:false,
      switchBool:false,
      // 点击单个删除
      modalDel:false,
      removeData:{
        roleId:''
      },
      // 点击批量删除
      modalDelAll:false,
      delAllData:{
        roleIds:''
      },
     


      choices:[],//在右边需展示出来的数据

      keyTreeData:null,
      menuData:[],
      treeMenuData:[
        {
          title: 'parent 1',
          expand: true,
          iconName:'',
          menuId:'',
          menuName:'',
          menuNo:'',
          menuUrl:'',
          checked:true,
          render: (h, { root, node, data }) => {
              return h('span', {
                  style: {
                      display: 'inline-block',
                      width: '100%'
                  }
              }, [
                  h('span', [
                      h('span',data.menuName)
                  ]),
                  h('span', {
                      style: {
                          display: 'inline-block',
                          float: 'left',
                          marginRight: '32px'
                      }
                  })
              ]);
          },
          children:[],
        }
      ],
      columns: [
                    {
                        type: 'selection',
                        width: 60,
                        align: 'center'
                    }, 
                    {
                        type: 'index',
                        width: 60,
                        align: 'center'
                    },
                    {
                        title: '角色编码',
                        key: 'roleNo',
                        align: "center"
                    },
                    {
                        title: '角色名称',
                        key: 'roleName',
                        align: "center"
                    },
                    {
                        title: '操作',
                        slot: 'action',
                        width: 180,
                        align: 'center',
                        render: (h, params) => {
                          return h("div", [
                            h(
                              "Button",
                              {
                                props: {
                                  type: "primary",
                                  size: "small"
                                },
                                style: {
                                  borderRadius:"32px"
                                },
                                on: {
                                  click: () => {
                                    this.showData(params.index);
                                  }
                                }
                              },
                              "查看"
                            ),
                            h(
                              "Button",
                              {
                                props: {
                                  type: "primary",
                                  size: "small"
                                },
                                style: {
                                  margin: "0 5px",
                                  borderRadius:"32px"
                                },
                                on: {
                                  click: () => {
                                    this.fix(params.index);
                                  }
                                }
                              },
                              "修改"
                            ),
                            // h(
                            //   "Button",
                            //   {
                            //     props: {
                            //       type: "error",
                            //       size: "small"
                            //     },
                            //     style: {
                            //       borderRadius:"32px"
                            //     },
                            //     on: {
                            //       click: () => {
                            //         this.remove(params.index);
                            //       }
                            //     }
                            //   },
                            //   "删除"
                            // )
                          ]);
                      }
                    }
                ],
    data1: []

   }
  },
  created(){
    this.findDataM();
    this.findMenuDataM();
  },
  computed:{
   
  },
  mounted(){
    this.$Message.config({
      top: 20,
      duration: 4
    });
  },
  methods:{
    findMenuDataM(){
      getAllUsableMenuList().then(res=>{
        let mDa=res.data;
        this.treeMenuData=res.data;
      })
    },
    // 选择menuNo给menuNos
    findDataM(){
      this.loading=true;
      getRoleList(this.findData).then(res=>{
        if(res.code==='200'){
          let dat=res.data;
          this.loading=false;
          this.total=dat.total;
          this.findData.currPage=dat.currPage;
          this.roleData=dat.pageData;

        }
      })
    },
    confirmFixFun(){

    },
    concelFixFun(){

    },
    // getchildren (data) {
    //   const redata = [];
    //   for(let i=0,len=data.length;i<len;i++){
    //     let dx={
    //       title:'',
    //       expand:true,
    //       iconName:'',
    //       menuId:'',
    //       menuName:'',
    //       menuNo:'',
    //       menuUrl:'',
    //       children:[],
    //     }
    //     dx.title=data[i].menuName;
    //     dx.menuId=data[i].menuId;
    //     dx.menuNo=data[i].menuNo;
    //     dx.menuUrl=data[i].menuUrl;
    //     if(!!data[i].children){
    //       dx.children=this.getchildren(data[i].children);
    //     }
    //     redata.push(dx);
    //   }
    //   return redata;
    // },
    renderContent (h, { root, node, data }) {
      return h('span', {
          style: {
              display: 'inline-block',
              width: '100%',
              textAlign:'left'
          }
      }, [
          h('span', [
              h('span',data.menuName)
          ]),
          h('span', {
              style: {
                  display: 'inline-block',
                  marginLeft: '10%'
              }
          },
          )
      ]);
    },
    concelFun(){
      this.modalAdd=false;
      this.modalFix=false;
    },
    confirmFun(){
      if(this.addData.roleNo){
        this.winFlag=true;
      }
      if(this.addData.roleName){
        this.winFlagS=true;
      }
      if(!this.winFlag || !this.winFlagS){
        this.$Message.info('信息没填写正确或不完整或未修改，请检查!');
      }else{
         saveRoleInfo(this.addData).then(res=>{
          if(res.code==='200'){
            this.modalFix=false;
            this.modalAdd=false;
            this.addData={};
            this.$Message.info('操作成功!');
            this.findDataM.bind(this)();
          }
        })
      }
    },
    // 导出表格数据
    exportData(){
      this.$refs.selection.exportCsv({
      filename: '用户管理表'//导出Excel的文件名
      })
    },
    getSelectedNodesData(arr,item){
    },
    
  
    // 单页切换分页条
    changepage(index){
      this.findData.bePage = index;
      this.findDataM();
    },
    // 分页条切换单页显示条数
     changPageSize(index) {
      this.findData.currPage = index;
      this.findDataM();
    },

    // 确认批量禁用
    okStopAll(){

    },
    // 取消批量禁用
    cancelStopAll(){
      
    },

    // 点击表格里的复选框事件
    selectionClick(arr){
      let roleIds='';
      for(let i=0,len=arr.length;i<len;i++){
        roleIds=roleIds+arr[i].roleId+',';
      }
      this.delAllData.roleIds=roleIds;
    },
    // 点击表格选中事件
    handleChange(data,index){
      let arr=this.delAllData.roleIds;
      let dat=this.roleData[index];
      this.$set(dat,'_checked',!dat._checked)
      if(dat._checked){
        arr=arr+data.roleId+','
      }else{
        for(let q=0,len=arr.length;q<len;q++){
        }
      }
      this.delAllData.roleIds=arr;
    },
    // 确认批量删除选中的表格数据
    okDelAll(){
      let param={};
      let data=this.delAllData.roleIds;
      
      param.roleIds= data.substr(0,data.length-1);
      deleteRoles(param).then(res=>{
        
        if(res.code==='200'){
          this.$Message.info('删除成功');
          this.findDataM.bind(this)();
        }
      })
    },
    // 取消删除选中的表格数据
    cancelDelAll(){
      
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
    //  点击新增
    // 选择菜单权限
    choiceMenu(arr){
      let getD=this.$refs.powerTree.getCheckedAndIndeterminateNodes();    //获取半选和全选  ------ 例如 [{}，{}]
     
      let newStr= '';                                    
      for(let i=0,len=getD.length;i<len;i++){
        newStr=newStr+getD[i].menuNo+',';
      }
      this.addData.menuNos=newStr;

    },
    okAdd () {
      if(!this.deptNoBool){
        this.$Message.info('本次操作失败!');
      }else{
         saveRoleInfo(this.addData).then(res=>{
          if(res.code==='200'){
            this.addData={};
            this.$Message.info('操作成功!')
            this.findDataM.bind(this)();
          }
        })
      }
     
    },
    cancelAdd () {
        
    },
    doBottom(who){
      // 点击新增
      if(who==='add'){

        this.addData={
       descriptions: "",
        enable: true,
        menuNos: "",
        roleId: "",
        roleName: "",
        roleNo: "",
        usefulMenuDtos: []
     };

        this.modalAdd=true;
      };
      // 点击删除
      if(who==='del'){
        if(!this.delAllData.roleIds){
          this.$Message.info('您没选中任何数据!')
          return;
        }
        this.modalDelAll=true;
      }
      // 点击禁用
      if(who==='jin'){
        this.modelStopAll=true;
      }
    },
    // 点击查看
    showData(index){
      this.lookBool=true;
      this.lookData=this.roleData[index]
    },
    // 点击单个修改
    fix(index){
      this.modalFix=true;
      this.addData=this.roleData[index];
      let arrMenus=this.addData.menuNos.split(',');
      let treeData=this.treeMenuData;
    },
   
    okFix(){
      this.okAdd.bind(this)('fix');
    },
    cancelFix(){

    },
    
    // 点击单个删除
     remove (index) {
        this.modalDel=true;
        this.removeData.roleId=this.roleData[index].roleId;
    },
    okDel(){
      deleteRoleInfo(this.removeData).then(res=>{
        if(res.code==='200'){
          this.$Message.info('删除成功!')
          this.$options.methods.findDataM.bind(this)();
        }
      })
    },
    cancelDel(){

    },
  }
}
</script>

<style lang='stylus' scoped>
  .ivu-page{
      margin 20px auto
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
          &:nth-of-type(3)
            input 
              width 100px
          label 
            font-size 16px
          input 
            border 1px solid #8590a69e
            padding 6px 0
            // background #bdcef1
            font-size 16px
            border-radius 30px
            text-indent 8px

        .sub-btn
          float left
          width 4rem
          height 36px
          background #2d8cf0
          font-size 15px
          margin-top 10px
          border-radius 30px
          line-height 36px
          color #fff
          transition .3s
          cursor pointer
          &:hover
            background #3896f7
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
        color #fff
        border-radius 28px
        cursor pointer
        transition .3s
        &:nth-of-type(1)
          background #59a9fd
          &:hover
              background-color #2991ff
            &:active
              background-color #7987a5
        &:nth-of-type(2)
          background #f59da6
          &:hover
              background-color #ff5667
            &:active
              background-color #f59da6
        &:nth-of-type(3)
          background #7987a5
          &:hover
              background-color #43506b
            &:active
              background-color #7987a5
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
