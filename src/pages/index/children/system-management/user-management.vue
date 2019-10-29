<template>
  <div id="user-management">
    <div class="condition">
      <div class="condition-empty">
        <div class="condition-item">
          <label class="treeLable" for="company" value="部门编码">部门信息 :&nbsp;</label>
          <span class="companyTree">
            <tree-select
                :options="options"
                placeholder="请选择部门.."
                v-model="value"
                :default-expand-level="3"
          />
          </span>
        </div>
        <div class="condition-item">
          <label for="company" value="角色名称">用户名称 :&nbsp;</label>
          <input class="input-com" name="company" type="text" v-model="findData.userName">
        </div>
        <div class="condition-item">
          <label for="company" value="角色编号">用户编码 :&nbsp;</label>
          <input class="input-com" name="company" type="text" v-model="findData.empNo">
        </div>
        <div class="condition-item">
          <label for="company" value="角色编号">邮箱 :&nbsp;</label>
          <input class="input-com" name="company" type="text" v-model="findData.email">
        </div>
        <div class="sub-btn" @click="findM">
          <svgicon iconClass="icon-chazhao" class="do-icon-com"></svgicon>查询
        </div>
      </div>
    </div>
    <!-- 按钮操作组 -->
    <div class="button-group">
      <div class="btn-com" @click="doBottom('add')">
        <svgicon iconClass="icon-Group-" class="do-icon-com"></svgicon>新增
      </div>
      <div class="btn-com" @click="doBottom('del')">
        <svgicon iconClass="icon-shanchu3" class="do-icon-com"></svgicon>删除
      </div>
      <div class="btn-com" @click="doBottom('jin')">
        <svgicon iconClass="icon-jinyong1" class="do-icon-com"></svgicon>禁用
      </div>
      <div class="btn-com" @click="exportData">
        <svgicon iconClass="icon-daochu" class="do-icon-com"></svgicon>导出
      </div>
    </div>
    <!-- 信息表 -->
    <Table 
      :loading="loading" 
      border 
      stripe
      highlight-row 
      ref="selection" 
      :columns="userColumns" 
      :data="userData" 
      @on-selection-change="selectionClick"
      
    >   
    <!-- @on-row-click="handleChange"  -->
    </Table>
    <!-- 分页条 -->
    <div class="page-bar">
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
    </div>
    <!-- 查看图层 -->
    <Modal draggable width="760" v-model="lookBool" title="查看用户信息" @on-ok="lookOk">
      <div class="set-wrapper">
        <!-- 需要设置UI -->
        用户编码------ {{ lookData.empNo }}
        <br>
        用户名称------ {{ lookData.empName }}
        <br>
        登录名------ {{ lookData.loginName }}
        <br>
        部门名称------ {{ lookData.deptName }}
        <br>
        角色------ {{ lookData.roleName }}
        <br>
        联系邮箱------ {{ lookData.email }}
        <br>
        是否有效------ {{ lookData.enable }}
        <br>
        备注信息------ {{ lookData.descriptions }}
        <br>
      </div>
    </Modal>
    <!-- 修改 -->
    <Modal draggable width="432" v-model="modalFix" title="修改信息">
      <div class="fix-wrapper">

        <Form v-model="addData" :rules="ruleForm"  >
          <!-- <FormItem label="用户编码" prop="empNo">
            <Input type="text" name="new" v-model="addData.empNo"></Input>
          </FormItem>
          <FormItem label="用户名称" prop="empName">
            <Input type="text" name="new" v-model="addData.empName"></Input>
          </FormItem> -->
          <FormItem label="登录名" prop="loginName">
            <Input type="text" name="new" v-model="addData.loginName"></Input>
          </FormItem>
          <FormItem label="部门名称" prop="addDepId">
            <span class="companyTree">
              <tree-select
                :options="options"
                placeholder="请选择分类..."
                v-model="addData.deptId"
                :default-expand-level="3"
              />
          </span>
          </FormItem>
          <!-- <FormItem label="密码" prop="password">
            <Input type="text" name="new" v-model="addData.password" ></Input>
          </FormItem> -->
          <FormItem label="角色" prop="roleNo">
            <div class="selectRole">
              <div class="select-wrapper" @click="showFixRole">
                <div class="set--select">
                  <span ref="fixRole" class="set-select--type">选择角色</span>
                  <span class="set-com-choose-svg">
                    <svgicon iconClass="icon-ICON-"></svgicon>
                  </span>
                </div>
              </div>
              <select-box-role
                ref="fixRoleRef"
                :selectBox_data="initSelectData"
                @reciveMe="selectFixM"
              ></select-box-role>
            </div>
          </FormItem>
          <FormItem label="邮箱" prop="email">
            <Input type="text" name="new" v-model="addData.email" ></Input>
          </FormItem>
          <FormItem label="是否有效" prop="checked">
            <div class="modal-new">
              <i-Switch size="large" @on-change="changeFixEnable" v-model="addData.enable">
                <span slot="open" checked>有效</span>
                <span slot="close">无效</span>
              </i-Switch>
            </div>
          </FormItem>
          <FormItem label="备注" prop="descriptions">
            <textarea style="border: 1px solid #dcdee2;border-radius:6px;width:100%" name="" id="" cols="30" rows="2" v-model="addData.descriptions"></textarea>
          </FormItem>
        </Form>

        <!-- <Form v-model="saveMenuEdtorData" :rules="ruleEditForm"  >
          <FormItem label="菜单图标" prop="iconPath">
            <Input type="text" name="new" v-model="saveMenuEdtorData.iconPath"></Input>
          </FormItem>
          <FormItem label="菜单编码" prop="menuNo">
            <Input type="text" name="new" v-model="saveMenuEdtorData.menuNo"></Input>
          </FormItem>
          <FormItem label="菜单名称" prop="menuName">
            <Input type="text" name="new" v-model="saveMenuEdtorData.menuName"></Input>
          </FormItem>
          <FormItem label="上级菜单信息" prop="higherLevelName">
            <Input type="text" name="new" v-model="saveMenuEdtorData.higherLevelName" readonly></Input>
          </FormItem>
          <FormItem label="菜单URL" prop="menuUrl">
            <Input type="text" name="new" v-model="saveMenuEdtorData.menuUrl" ></Input>
          </FormItem>
          <FormItem label="是否有效" prop="checked">
            <div class="modal-new">
              <i-Switch size="large" @on-change="changeFixEnable" v-model="saveMenuEdtorData.enable">
                <span slot="open" checked>有效</span>
                <span slot="close">无效</span>
              </i-Switch>
            </div>
          </FormItem>
          <FormItem label="备注" prop="checked">
            <textarea style="border: 1px solid #dcdee2;border-radius:6px;width:100%" name="" id="" cols="30" rows="2"></textarea>
          </FormItem>
        </Form> -->

        <!-- <div class="modal-new">
          <label for="new">登录名 :</label>
          <input type="text" name="new" v-model="addData.loginName">
        </div>
        <div class="modal-new">
          <label for="new">部门名称 :</label>
          <span class="companyTree">
            <tree-select
              :options="options"
              placeholder="请选择分类..."
              v-model="addData.deptId"
              :default-expand-level="3"
          />
          </span>
        </div>
        <div class="modal-new">
          <label for="new">角色名称 :</label>
          <div class="selectRole">
              <div class="select-wrapper" @click="showFixRole">
                <div class="set--select">
                  <span ref="fixRole" class="set-select--type">选择角色</span>
                  <span class="set-com-choose-svg">
                    <svgicon iconClass="icon-ICON-"></svgicon>
                  </span>
                </div>
              </div>
              <select-box-role
                ref="fixRoleRef"
                :selectBox_data="initSelectData"
                @reciveMe="selectFixM"
              ></select-box-role>
            </div>
        </div>
        <div class="modal-new">
          <label for="new">联系邮箱 :</label>
          <input type="text" name="new" v-model="addData.email">
        </div>
        <div class="modal-new">
          <label for="new">是否有效 :</label>
          <i-Switch size="large" v-model="addData.enable" @on-change="changeFixEnable">
            <span slot="open">有效</span>
            <span slot="close">无效</span>
          </i-Switch>
        </div>
        <div class="modal-new">
          <label for="new">备注信息 :</label>
          <input type="text" name="new" v-model="addData.descriptions">
        </div> -->
      </div>
      <div slot="footer">
            <Button type="text" @click="concelFixFun">取消</Button>
            <Button type="primary" @click="confirmFixFun">确定</Button>
      </div>
    </Modal>
    <!-- 点击删除按钮 -->
    <Modal draggable width="332" v-model="modelDel" title="删除警告" @on-ok="okDel" @on-cancel="cancelDel">
      <div>您确定删除此部门吗?</div>
    </Modal>
    <!-- 新增 -->
    <Modal draggable width="432" v-model="modalAdd" title="新增用户">
      <div class="fix-wrapper">
        <Form v-model="addData" :rules="ruleForm"  >
          <FormItem label="用户编码" prop="empNo">
            <Input type="text" name="new" v-model="addData.empNo"></Input>
          </FormItem>
          <FormItem label="用户名称" prop="empName">
            <Input type="text" name="new" v-model="addData.empName"></Input>
          </FormItem>
          <FormItem label="部门名称" prop="deptId">
            <span class="companyTree">
              <tree-select
                :options="options"
                placeholder="请选择分类..."
                v-model="addData.deptId"
                :default-expand-level="3"
              />
          </span>
          </FormItem>
          <FormItem label="登录名" prop="loginName">
            <Input type="text" name="new" v-model="addData.loginName"></Input>
          </FormItem>
          <FormItem label="密码" prop="password">
            <Input type="text" name="new" v-model="addData.password" ></Input>
          </FormItem>
          <FormItem label="角色" prop="roleNo">
            <div class="selectRole">
              <div class="select-wrapper" @click="showRole">
                <div class="set--select">
                  <span ref="addRole" class="set-select--type">选择角色</span>
                  <span class="set-com-choose-svg">
                    <svgicon iconClass="icon-ICON-"></svgicon>
                  </span>
                </div>
              </div>
              <select-box-role
                ref="RoleRef"
                :selectBox_data="initSelectData"
                @reciveMe="selectAddM"
              ></select-box-role>
            </div>
          </FormItem>
          <FormItem label="邮箱" prop="email">
            <Input type="text" name="new" v-model="addData.email" ></Input>
          </FormItem>
          <FormItem label="是否有效" prop="checked">
            <div class="modal-new">
              <i-Switch size="large" @on-change="changeFixEnable" v-model="addData.enable">
                <span slot="open" checked>有效</span>
                <span slot="close">无效</span>
              </i-Switch>
            </div>
          </FormItem>
          <FormItem label="备注" prop="descriptions">
            <textarea style="border: 1px solid #dcdee2;border-radius:6px;width:100%" name="" id="" cols="30" rows="2" v-model="addData.descriptions"></textarea>
          </FormItem>
        </Form>
        
        <!-- <div class="modal-new">
          <label for="new">用户编码 :</label>
          <input type="text" name="new" v-model="addData.empNo">
        </div> -->
        <!-- <div class="modal-new">
          <label for="new">用户名称 :</label>
          <input type="text" name="new" v-model="addData.empName">
        </div>
        <div class="modal-new">
          <label for="new">部门名称 :</label>
          <span class="companyTree">
            <tree-select
                :options="options"
                placeholder="请选择分类..."
                v-model="addDepId"
                :default-expand-level="3"
          />
          </span>
        </div>
        <div class="modal-new">
          <label for="new">登录名 :</label>
          <input type="text" name="new" v-model="addData.loginName">
        </div>
        <div class="modal-new">
          <label for="new">密码 :</label>
          <input type="text" name="new" v-model="addData.password">
        </div>
        <div class="modal-new">
          <label for="new">角色 :</label>
            <div class="selectRole">
              <div class="select-wrapper" @click="showRole">
                <div class="set--select">
                  <span ref="selectRef" class="set-select--type">选择角色</span>
                  <span class="set-com-choose-svg">
                    <svgicon iconClass="icon-ICON-"></svgicon>
                  </span>
                </div>
              </div>
              <select-box-role
                ref="select_box"
                :selectBox_data="initSelectData"
                @reciveMe="selectM"
              ></select-box-role>
            </div>
            
        </div>
        <div class="modal-new">
          <label for="new">邮箱 :</label>
          <input type="text" name="new" v-model="addData.email">
        </div>
        <div class="modal-new">
          <label for="new">是否有效 :</label>
          <i-Switch size="large" v-model="addData.enable" @on-change="changeEnable">
            <span slot="open">有效</span>
            <span slot="close">无效</span>
          </i-Switch>
        </div>
        <div class="modal-new">
          <label for="new">备注信息 :</label>
          <input type="text" name="new" v-model="addData.descriptions">
        </div> -->
      </div>
      <div slot="footer">
        <Button type="text" @click="concelFun">取消</Button>
        <Button type="primary" @click="confirmFun">确定</Button>
      </div>
    </Modal>
    <!-- 确认批量删除提示框 -->
    <Modal draggable width="332" v-model="modelDelAll" title="删除警告"  @on-ok="okDelAll" @on-cancel="cancelDelAll">
      <div>您确定要批量删除选中的用户吗?</div>
    </Modal>
    <!-- 确认批量禁用提示框 -->
    <Modal draggable width="332" v-model="modelStopAll" title="禁用警告"  @on-ok="okStopAll" @on-cancel="cancelStopAll">
      <div>您确定要批量禁用选中的用户吗?</div>
    </Modal>
  </div>
</template>

<script>
import { getUserList, saveUserInfo, deleteUserInfo, deletesUsers, getDeptList, getUserInfoByUserNo, findRolesEnable, setEnableByIds } from "@/request/api";
import Storage from "@/util/storage";
import TreeSelect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import selectBoxRole from "@/components/select-box/select-box-role";
export default {
  name: "",
  components: {
    TreeSelect,
    selectBoxRole
  },
  data() {

     // 用户编码验证
    const validateEmpNo = async (rule, value, callback) => {
      let val=this.addData.empNo;   
      let fl=this.empNoBool;   //false
      let bool=true;
      if (val === ''||val===undefined) {
        this.empNoBool=false;
        bool=false;
        return callback(new Error('用户编码不能为空!'));
      }
      await getUserInfoByUserNo({userNo:val}).then(res=>{
        if(res.data){
          this.empNoBool=false;
          bool=false;
          return callback(new Error('用户编码重复!'));
          return;
        }
      })
      if(bool){
        this.empNoBool=true;
      }
      
      callback();
    };

    // 用户名称验证
    const validateEmpName = (rule, value, callback) => {
      let val=this.addData.empName;
      let fl=this.empNameBool;   //false
      if (val === ''||val===undefined) {
        this.empNameBool=false;
        return callback(new Error('用户名称不能为空!'));
      }
      this.empNameBool=true;
      callback();
    };
    // 部门Id验证
    const validateAddDepId = (rule, value, callback) => {
      // let val=this.addDepId;
      // let fl=this.addDepIdBool;   //false
      // if (val === ''||val===undefined) {
      //   this.addDepIdBool=false;
      //   return callback(new Error('部门名称不能为空!'));
      // }
      // this.addDepIdBool=true;
      callback();
    };
    // 登录名称验证
    const validateloginName = (rule, value, callback) => {
      let val=this.addData.loginName;
      let fl=this.loginNameBool;   //false
      if (val === ''||val===undefined) {
        this.loginNameBool=false;
        return callback(new Error('登录名称不能为空!'));
      }
      this.loginNameBool=true;
      callback();
    };
    // 密码验证
    const validatePassword = (rule, value, callback) => {
      let val=this.addData.password;
      let fl=this.passwordBool;   //false
      if (val === ''||val===undefined) {
        this.passwordBool=false;
        return callback(new Error('密码不能为空!'));
      }
      this.passwordBool=true;
      callback();
    };
    // 角色验证
    const validateRoleNo = (rule, value, callback) => {
      let val=this.addData.roleNo;
      let fl=this.roleNoBool;   //false
      if (val === ''||val===undefined) {
        this.roleNoBool=false;
        return callback(new Error('角色不能为空!'));
      }
      this.roleNoBool=true;
      callback();
    };

    
    return {

      

      modal2: false,
      // 新增
      // addDepId:0,
      addDepId:0,
      addData: {
       	deptId: "",
        deptName: "",
        deptNo: "",
        descriptions: "",
        email: "",
        empName: "",
        empNo: "",
        enable: true,
        loginName: "",
        password: "",
        roleName: "",
        roleNo: "",
        userId: ""
      },
      addDataTem: {
       	deptId: "",
        deptName: "",
        deptNo: "",
        descriptions: "",
        email: "",
        empName: "",
        empNo: "",
        enable: true,
        loginName: "",
        password: "",
        roleName: "",
        roleNo: "",
        userId: ""
      },
      modalAdd:false,

      // 新增用户
      empNoBool:false,
      empNameBool:false,
      addDepIdBool:false,
      passwordBool:false,
      loginNameBool:false,
      roleNoBool:false,
      ruleForm: {
        empNo: [
            {required: true, validator: validateEmpNo, trigger: 'blur' }
        ],
        empName: [
            {required: true, validator: validateEmpName, trigger: 'blur' }
        ],
        addDepId: [
            {required: true, validator: validateAddDepId, trigger: 'blur' }
        ],
        loginName: [
            {required: true, validator: validateloginName, trigger: 'blur' }
        ],
        password: [
            {required: true, validator: validatePassword, trigger: 'blur' }
        ],
        roleNo: [
            {required: true, validator: validateRoleNo, trigger: 'blur' }
        ],
      },

      initSelectData:{
         data: [
          {
            "enable": true,
            "roleId": "",
            "roleName": "",
            "roleNo": ""
          }
        ],
        HEI: "13rem"
      },
      // 查询
      value:0,
      options: [],
      selectValue: 0,
      findData:{
        bePage:1,
        currPage:10,
        deptNo:'',
        userName:'',
        empNo:'',
        email:''
      },
      // 分页条数据
      pageSizeOpts: [5, 10, 15, 20 ,25, 30],
      total: 0,
      loading:true,
      // 修改
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
      // 点击批量删除
      modelDelAll:false,
      selectAllData:[],

      // 点击单个删除
      modelDel: false,

      removeData: {
        userId: ""
      },
      // 点击批量禁用
      modelStopAll:false,
      stopData:'',

      // 查看
      lookBool:false,
      lookData:{
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
      userColumns: [
        {
          type: "selection",
          width: 60,
          align: "center"
        },
        {
          type: "index",
          width: 60,
          align: "center"
        },
        {
          title: "用户编码",
          key: "empNo",
          align: "center"
        },
        {
          title: "用户名称",
          key: "empName",
          align: "center"
        },
        {
          title: "登录名",
          key: "loginName",
          align: "center"
        },
        {
          title: "部门名称",
          key: "deptName",
          align: "center"
        },
        {
          title: "角色名称",
          key: "roleName",
          align: "center"
        },
        {
          title: "是否有效",
          key: "enable",
          align: "center",
          render: (h, params) => {
            const row = params.row;
            const color = row.enable ? 'success' : 'error';
            const text = row.enable? '是' : '否';
            return h('Tag', {
              props: {
              type: 'dot',
              color: color
              }
            }, text);
          }
        },
        {
          title: "操作",
          slot: "action",
          width: 180,
          align: "center",
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
                      this.fix(params.index,params.row);
                    }
                  }
                },
                "修改"
              ),
              h(
                "Button",
                {
                  props: {
                    type: "error",
                    size: "small"
                  },
                  style: {
                    borderRadius:"32px"
                  },
                  on: {
                    click: () => {
                      this.remove(params.index);
                    }
                  }
                },
                "删除"
              )
            ]);
          }
        }
      ],
      setName:'',
      userData: [
        {
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
        }
      ]
    };
  },
  created(){
    this.getUserDataM();
    this.queryCategoryList();
    this.getRoleList();
  },
  methods: {
    // 初始化数据表
    getUserDataM(){
      this.loading=true;
      let fd=this.findData
      if(fd.deptNo==='undefined'){
        fd.deptNo='';
      }
      getUserList(fd).then(res=>{
        if(res.code==='200'){
          this.loading=false;
          let data=res.data;
          this.userData=data.pageData;
          this.total=data.total;
          this.currPage=data.currPage;
        }
      })
    },
    // 获取角色信息
    getRoleList(){
      findRolesEnable().then(res=>{
          if(res.code==='200'){
            this.initSelectData.data=res.data;
          }
        })
    },
    // 点击查看
    showData(index){
      this.lookBool=true;
      this.lookData=this.userData[index]
    },
    // 查询按钮
    findM(){
      
      if(this.value===0){
        this.findData.deptNo='';
      }else{
        this.findData.deptNo=this.value+''
      }
      this.getUserDataM.bind(this)();
    },
    // 分页条切换页数
    changepage(index) {
      this.findData.bePage = index;
      this.getUserDataM();
    },
    // 分页条切换单页显示条数
     changPageSize(index) {
      this.findData.currPage = index;
      this.getUserDataM();
    },
    concelFixFun(){
      this.modalFix=false;
    },
    confirmFixFun(){
      if(this.addData.loginName){
        this.loginNameBool=true;
      }
      if(this.$refs.fixRole.innerText==='选择角色'){
        this.addData.deptId='';
        this.addData.roleNo='';
      }
      if(this.loginNameBool&&this.addData.deptId&&this.addData.roleNo){
        this.modalFix=false;
        this.saveUserInfoM.bind(this)();
        return;
      }
      this.$Message.info('信息未填写正确或不完整,请检查!');
    },
    // 取消新增
    concelFun(){
      this.modalAdd=false;
    },
    // 确定新增
    confirmFun(){

      if(this.empNoBool&&this.empNameBool&&this.passwordBool&&this.loginNameBool&&this.addData.roleNo&&this.addData.deptId){
        this.modalAdd=false;
        this.saveUserInfoM.bind(this)();
        return;
      }
      this.$Message.info('信息未填写正确或不完整,请检查!');
    },
    // 查询
    // 单位信息树
    queryCategoryList() {
      let children = [];
      let obj = {
        label: "请选择...",
        id: 0,
        children: []
      };
      getDeptList().then(res => {
        obj.label = res.data.deptName;
        obj.id = res.data.deptId;
        obj.children = this.getchildren.bind(this)(res.data.deptTreeDtos);
      });
      // let mo={
      //   label: "请选择...",
      //   id: 0,
      // }
      // this.options.push(mo);
      this.options.push(obj);
    },

    getchildren(data) {
      const redata = [];
      for (let i = 0, len = data.length; i < len; i++) {
        let dx = {
          label: "",
          id: ""
        };
        dx.label = data[i].deptName;
        dx.id = data[i].deptId;
        if (!!data[i].deptTreeDtos && data[i].deptTreeDtos.length > 0) {
          dx.children = [];
          dx.children = this.getchildren(data[i].deptTreeDtos);
        }
        redata.push(dx);
      }
      return redata;
    },
    // 新增用户
    saveUserInfoM(){
      let params=this.addData;
      saveUserInfo(params).then(res=>{
        if(res.code==='200'){
          this.$Message.info('操作成功!');
          params={};
          this.addData={};
          this.getUserDataM.bind(this)();
        }
      })
    },
    selectM(item){
      this.$refs.selectRef.innerText = item.roleName;
      this.addData.roleName=item.roleName;
    },
      // 点击显示角色下拉--新增
    showRole(){
      this.$refs.RoleRef.repeatControl();
    },
    changeEnable(status){
      this.addData.enable=status;
    },
    okAdd(){
      
      let para={};
      para.userNo=this.addData.deptNo;
      getUserInfoByUserNo(para).then(res=>{
        if(res.code==='200'){
          this.saveUserInfoM.bind(this)();
        }
      })
      
    },
    cancelAdd(){

    },

    // 点击显示角色下拉--修改
    showFixRole(){
      this.$refs.fixRoleRef.repeatControl();
    },
    selectAddM(item){
      this.$refs.addRole.innerText = item.roleName;
      this.addData.roleName=item.roleName;
      this.addData.roleNo=item.roleNo;
    },
    selectFixM(item){
      this.$refs.fixRole.innerText = item.roleName;
      this.addData.roleName=item.roleName;
      this.addData.roleNo=item.roleNo;
    },
    // 更改是否有效
    changeFixEnable(status){
      this.addData.enable=status;
    },
    // 确认修改
    okFix(){
      let params=this.fixData;
      this.$options.methods.saveUserInfoM.bind(this)();
    },
    // 取消修改
    cancelFix(){

    },
    handleSelectAll(status) {
      this.$refs.selection.selectAll(status);
    },
    showBtn(index) {
      this.$Modal.info({
        title: "修改信息"
        // content: `Name：${this.data6[index].name}<br>Age：${this.data6[index].age}<br>Address：${this.data6[index].address}`
      });
    },
    // 导出表格数据
    exportData(){
      this.$refs.selection.exportCsv({
      filename: '用户管理表'//导出Excel的文件名
      })
    },
    doBottom(who) {
      if (who === "add") {
        // this.addData=this.addDataTem;
        this.addData={};
        this.modalAdd = true;
      }
      if (who === "del") {
        if(!this.selectAllData.length){
          this.$Message.info('您没选中任何要删除的数据!');
          return;
        }
        this.modelDelAll=true;
      }
      if(who==='jin'){
        if(!this.stopData){
          this.$Message.info('您没选中任何要禁用的数据!');
          return;
        }
        this.modelStopAll=true;
      }
    },
    show(index) {
      this.modal1 = true;
    },
    confirm(index) {
      this.$Modal.confirm({
        title: "Title",
        content: "<p>Content of dialog</p><p>Content of dialog</p>",
        onOk: () => {
          this.userData.splice(index, 1);
          // this.$Message.info("删除成功");
        },
        onCancel: () => {
          // this.$Message.info("Clicked cancel");
        }
      });
    },
    // 查看
    lookOk(){

    },
    // 点击单个修改
    fix(index,row){
      this.modalFix=true;
      this.addData=this.userData[index];

      this.$refs.fixRole.innerText = row.roleName;
      this.addData.roleName=row.roleName;
      this.addData.roleNo=row.roleNo;
    },
    // 处理表格复选框点击选中
    selectionClick(arr){
      let da=[];
      for(let i=0,len=arr.length;i<len;i++){
        da.push(arr[i].userId);
      }
      this.selectAllData=da;
      this.stopData=da.join(',');

    },
    // 处理表格点击选中
    handleChange(data,index){
      let arr=this.selectAllData;
      let dat=this.userData[index];
      this.$set(dat,'_checked',!dat._checked)
      if(dat._checked){
        arr.push(data.userId);
      }else{
        for(let q=0,len=arr.length;q<len;q++){
          let inx=arr[q].indexOf(data.userId)
          if(inx!==-1){
            arr.splice(inx,1);
          }
        }
      }
    },
    // 点击批量删除
    okDelAll(){
      deletesUsers(this.selectAllData).then(res=>{
        if(res.code==='200'){
          this.$Message.info('删除用户成功!')
          this.getUserDataM.bind(this)();
        }
      })
    },
    cancelDelAll(){

    },
    // 点击单个删除
     remove (index) {
        this.modelDel=true;
        this.removeData.userId=this.userData[index].userId;
    },
    // 点击单个删除(确定)
    okDel(){
      deleteUserInfo(this.removeData).then(res=>{
        if(res.code==='200'){
          this.$Message.info('删除用户成功!');
          this.getUserDataM.bind(this)()
        }
      })
    },
    // 点击单个删除(取消)
    cancelDel(){

    },
    // 确认批量禁用
    okStopAll(){
      let stopData={};
      stopData.userIds=this.selectAllData;
      stopData.enable=false;
      setEnableByIds(stopData).then(res=>{
        if(res.code==='200'){
          this.selectAllData=[];
          this.stopData=''
          this.loading=true;
          this.$Message.info('禁用成功!')
          this.$options.methods.getUserDataM.bind(this)()
        }
      })
    },
    cancelStopAll(){

    },
  }
};
</script>

<style lang="stylus" scoped>

#user-management >>> .ivu-form-item-content

& >>> .ivu-form-item-content
      display inline-block
    & >>> .ivu-form .ivu-form-item-label
      width 70px
 #user-management
    .condition
      margin 16px 0
      .condition-empty
        width 100%
        &:after
          content:''
          clear both
          display block
          visibility hidden
        .condition-item
          display flex
          align-items center
          float left
          padding 10px 30px 10px 0
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
          color #ffffff
          transition .3s
          cursor pointer
          &:hover
            background #3896f7
          &:active
            background #515a6eb0
        .companyTree
          display inline-block
          min-width 13rem
          max-width 18rem
          & >>> .vue-treeselect__control
            border-radius 30px
            height 38px
            border 1px solid #8590a69e
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
        color #ffffff
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
    input 
      background #bdcef1
      font-size 15px
      padding 6px 20px
      border-radius 10px
      text-indent 1px
  .fix-wrapper
    padding 0 2.8rem
    .modal-new
      display flex
      align-items center
      justify-content left
      margin 26px 0
      label 
        font-size 14px
        width 6rem
        color #8590a6
      input
        font-size 15px
        padding 6px 0
        border-bottom 1px solid #00000052;
      .companyTree
        display inline-block
        width 12rem
        & >>> .vue-treeselect__control
          border-radius 30px
          border 1px solid #8590a69e
    .selectRole
      display inline-block
      position relative
      // width 18rem
      color #8590a6
      .select-wrapper
        display inline-block
        .set--select
          padding: 0 0.8rem;
          border: 1px solid #8590a69e;
          border-radius: 1rem;
          cursor: pointer;
          .set-select--type
            display: inline-block
            min-width 140px 
            max-width 200px
          .set-com-choose-svg
            display: inline-block
            .svg-icon
              font-size 1.2rem
  .page-bar
    margin-top 20px


</style>














            