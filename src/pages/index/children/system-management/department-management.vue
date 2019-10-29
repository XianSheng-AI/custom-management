<template>
  <div id="company-management">
    <div class="condition">
      <div class="condition-empty">
        <div class="condition-item">
          <!-- 列表显示信息：复选框、序号、单位编码、单位名称、时区、单位性质、行业信息、操作（查看、修改、删除）， -->
          <label for="company" value="单位编码">部门名称 :&nbsp;</label>
          <input class="input-com" name="company" type="text" v-model="param.deptName">
        </div>
        <div class="condition-item">
          <label for="company" value="角色名称">部门编号 :&nbsp;</label>
          <input class="input-com" name="company" type="text" v-model="param.deptNo">
        </div>
        <!-- 查询按钮 -->
        <div class="sub-btn" @click="find">
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
    </div>
    <!-- 信息表 -->
    <Table border ref="selection"
    :columns="columns1"
    stripe
    :data="data1"
    :loading="loading"
    @on-selection-change="selectionClick"
    ></Table>
    <!-- 分页条 -->
    <Page
      :total="total"
      :page-size="param.currPage"
      :current="param.bePage"
      :page-size-opts="pageSizeOpts"
      show-total
      show-elevator
      show-sizer
      @on-change="changepage"
      @on-page-size-change="changPageSize"
    ></Page>
    <!-- 修改部门 -->
    <Modal width="560" draggable v-model="modalFix" title="修改部门" @on-ok="okFix" @on-cancel="cancelFix">
      <div class="set-wrapper">
        <div class="set-left">
          <Form v-model="addData" :rules="ruleFixForm"  >
            <FormItem label="上级部门" prop="selectValueFix">
              <tree-select
                  :options="options"
                  placeholder="请选择部门..."
                  v-model="selectValueFix"
                  :value="fixValue"
                  :default-expand-level="3"
              />
            </FormItem>
            <FormItem label="部门名称" prop="deptName">
              <Input type="text" name="new" v-model="fixData.deptName"></Input>
            </FormItem>
            <FormItem label="备注" prop="checked">
              <textarea style="border: 1px solid #dcdee2;border-radius:6px;width:100%;text-indent: 6px;" name="" id="" cols="30" rows="2" v-model="fixData.descriptions"></textarea>
            </FormItem>
          </Form>
        </div>
      </div>
      <div slot="footer">
        <Button type="text" @click="concelFixFun">取消</Button>
        <Button type="primary" @click="confirmFixFun">确定</Button>
      </div>
    </Modal>
    <!-- 新增按钮 -->
    <Modal width="560" draggable v-model="modalAdd" title="新增部门">
      <div class="set-wrapper">
        <div class="set-left">
          <Form v-model="newDept" :rules="ruleForm"  >
            <FormItem label="上级部门" prop="selectValue">
              <div class="modal-new">
                <span class="preTree">
                  <tree-select
                    :options="options"
                    placeholder="请选择分类..."
                    v-model="selectValue"
                    :default-expand-level="3"
                  />
                </span>
              </div>
            </FormItem>
            <FormItem label="部门名称" prop="deptName">
              <Input type="text" name="new" v-model="newDept.deptName"></Input>
            </FormItem>
            <FormItem label="部门编码" prop="deptNo">
              <Input type="text" name="new" v-model="newDept.deptNo"></Input>
            </FormItem>
          </Form>
        </div>
      </div>
      <div slot="footer">
        <Button type="text" @click="concelFun">取消</Button>
        <Button type="primary" @click="confirmFun">确定</Button>
      </div>
    </Modal>
    <!-- 查看图层 -->
    <Modal width="760" draggable v-model="lookBool" title="查看部门信息" @on-ok="lookOk">
      <div class="set-wrapper">
        <!-- 需要设置UI -->
        上级部门 {{ lookData.highDeptName }}
        <br>
        部门编码 {{ lookData.deptNo }}
        <br>
        部门名称 {{ lookData.deptName }}
        <br>
        备注信息 {{ lookData.descriptions }}
        <br>
      </div>
    </Modal>
    <!-- 点击删除按钮 -->
    <Modal width="332" draggable v-model="modelDel" title="删除警告" @on-ok="okDel" @on-cancel="cancelDel">
      <div>您确定删除此部门吗?</div>
    </Modal>
    <!-- 点击批量删除按钮 -->
    <Modal
      width="332"
      draggable
      v-model="modelDelAll"
      title="删除警告"
      @on-ok="okDelAll"
      @on-cancel="cancelDelAll"
    >
      <div>您确定要批量删除选中的部门吗?</div>
    </Modal>
    <!-- 确认批量禁用提示框 -->
    <Modal width="332" draggable v-model="modelStopAll" title="禁用警告"  @on-ok="okStopAll" @on-cancel="cancelStopAll">
      <div>您确定要批量禁用选中的部门吗?</div>
    </Modal>
  </div>
</template>

<script>
import {
  getDeptPageInfo,
  getDeptList,
  saveDept,
  deleteDept,
  deletes,
  setMoreDept,
  getDeptInfoByNo
} from "@/request/api";
import Storage from "@/util/storage";
import TreeSelect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
export default {
  name: "department-management",
  components: {
    TreeSelect
  },
  data() {
    // 上级部门验证
    const validateAddSelectValue = (rule, value, callback) => {
      let val=this.selectValue;
      if (val === ''||val===undefined) {
        return callback(new Error('上级部门不能为空!'));
      }
      callback();
    };
    // 部门名称验证
    const validateDeptName = (rule, value, callback) => {
      let val=this.newDept.deptName;
      if (val === ''||val===undefined) {
        this.deptNameBool=false;
        return callback(new Error('部门名称不能为空!'));
      }
      this.deptNameBool=true;
      callback();
    };
    // 部门编码验证
     const validateDeptNo = async (rule, value, callback) => {
      let val=this.newDept.deptNo;
      if (val === ''||val===undefined) {
        this.deptNoBool=false;
        return callback(new Error('部门编码不能为空!'));
      }
      let flag=true;
      
      await getDeptInfoByNo({deptNo:val}).then(res=>{
        if(res.data!==null){
          flag=false;
        }else{
          flag=true;
        }
      })
      if(!flag){
        this.deptNoBool=false;
        return callback(new Error('部门编码已重复!'));
      }
      this.deptNoBool=true;
      callback();
    };
    // 修改上级部门验证
    const validateSelectValue=(rule, value, callback)=>{
      callback();
    };
    // 修改部门名称
    const validateFixDeptName=(rule, value, callback)=>{
      let val=this.fixData.deptName;
      if (val === ''||val===undefined) {
        this.deptNameFixBool=false;
        return callback(new Error('部门名称不能为空!'));
      }
      this.deptNameFixBool=true;
      callback();
    }

    return {
      selectValue: 0,
      options: [],
      list: [],
      data: [
        {
          
        }
      ],
      // 部门表数据
      loading:true,
      // 点击批量禁用
      modelStopAll:false,

      findData: {
        bePage: 1,
        currPage: 10,
        deptNo: "",
        deptName: ""
      },

      lookBool: false, //查看图层
      lookData: {
        deptId: "",
        deptName: "",
        deptNo: "",
        descriptions: "",
        enable: true,
        highDeptId: "",
        highDeptName: "",
        highDeptNo: ""
      },
      // 点击批量删除
      delData:'',
      // 修改部门信息
      modalFix: false,
      fixData: {
        deptId: "",
        deptName: "",
        deptNo: "",
        descriptions: "",
        enable: true,
        highDeptId: "",
        highDeptName: "",
        highDeptNo: ""
      },
      selectValueFix:'',
      

      modal2: false,
      model2: "15654",
      addData: {
        name: "",
        code: new Number(),
        company: "",
        data: ""
      },
      // 分页条数据
      
      pageSizeOpts: [3, 5, 10, 15, 20 ],
      param: {
        bePage: 1,
        currPage: 10,
        deptNo: "",
        deptName: ""
      },
      total: 0,

      // 新增部门数据
        deptNameBool:false,
        deptNoBool:false,
      newDept: {
        deptId: "",
        deptName: "",
        deptNo: "",
        descriptions: "",
        enable: true,
        highDeptId: "",
        highDeptName: "",
        highDeptNo: ""
      },
      modalAdd:false,
      selectValueFixBool:false,
      deptNameFixBool:false,
      ruleFixForm: {
        selectValueFix: [
            {required: true, validator: validateSelectValue, trigger: 'blur' }
        ],
        deptName: [
            {required: true, validator: validateFixDeptName, trigger: 'blur' }
        ],
      },
      
      ruleForm: {
        selectValue: [
            {required: true, validator: validateAddSelectValue, trigger: 'blur' }
        ],
        deptNo: [
            {required: true, validator: validateDeptNo, trigger: 'blur' }
        ],
        deptName: [
            {required: true, validator: validateDeptName, trigger: 'blur' }
        ],
        
        // linkMan: [
        //     { validator: validateLinkMan, trigger: 'blur' }
        // ],
        // email: [
        //     { validator: validateEmail, trigger: 'blur' }
        // ],
        // id: [
        //     {required: true, validator: validateId, trigger: 'blur' }
        // ],
        // dealerAddress: [
        //     {required: true, validator: validateDealerAddress, trigger: 'blur' }
        // ],
        // serviceIp: [
        //     {required: true, validator: validateServiceIp, trigger: 'blur' }
        // ],
        // servicePort: [
        //     {required: true, validator: validateServicePort, trigger: 'blur' }
        // ]
      },

      model8: "",
      deptTreeData: [
        {
          label: "",
          expand: true,
          id: "",
          render: (h, { root, node, data }) => {
            return h(
              "span",
              {
                style: {
                  display: "inline-block",
                  width: "100%"
                }
              },
              [
                h("span", [
                  h(
                    "span",
                    {
                      on: {
                        click: () => {
                        }
                      }
                    },
                    data.title
                  )
                ]),
                h("span", {
                  style: {
                    display: "inline-block",
                    float: "left",
                    marginRight: "32px"
                  }
                })
              ]
            );
          },
          children: []
        }
      ],

      // 点击单个删除按钮
      modelDel: false,
      removeData: {
        deptId: ""
      },
      // 批量删除按钮
      modelDelAll: false,


      fixValue:null,
      

      choices: [], //在右边需展示出来的数据

      columns1: [
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
          title: "部门编码",
          key: "deptNo",
          align: "center"
        },
        {
          title: "部门名称",
          key: "deptName",
          align: "center"
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
      data1: [
        {
          deptId: "",
          deptName: "",
          deptNo: "",
          descriptions: "",
          enable: true,
          highDeptId: "",
          highDeptName: "",
          highDeptNo: ""
        }
      ]
    };
  },
  created() {
    this.getDepartment();
    this.queryCategoryList();
  },
  methods: {
    // 查看
    showData(index) {
      this.lookBool = true;
      this.lookData = this.data1[index];
    },
    // 点击查询
    find() {
      this.getDepartment();
    },
    lookOk() {
      this.lookBool = false;
    },
    queryCategoryList() {
      let children = this.getTree();
      let obj = {
        label: "请选择...",
        id: 0,
        children: []
      };
      getDeptList().then(res => {
        obj.label = res.data.deptName;
        obj.id = res.data.deptId;
        obj.children = this.getchildren(res.data.deptTreeDtos);
      });
      this.options.push(obj);
    },
    getTree() {
      let redata = {
        label: "",
        id: "",
        children: []
      };
      getDeptList().then(res => {
        redata.label = res.data.deptName;
        redata.id = res.data.deptId;
        redata.children = this.getchildren(res.data.deptTreeDtos);
      });
      return redata;
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
    // 获取部门分页信息
    getDepartment() {
      this.loading=true;
      getDeptPageInfo(this.param).then(res => {
        if(res.code==='200'){
          this.loading=false;
          this.total = res.data.total;
          this.data1 = res.data.pageData;
        }
      });
    },
    // 点击表格复选框
    selectionClick(arr){
      let da=[];
      for(let i=0,len=arr.length;i<len;i++){
        da.push(arr[i].deptId);
      }
      let param={};
      this.delData=da.join(',');
    },
    changepage(index) {
      this.param.bePage = index;
      this.getDepartment();
    },
    changPageSize(index) {
      this.param.currPage = index;
      this.getDepartment();
    },

    handleSelectAll(status) {
      this.$refs.selection.selectAll(status);
    },
    showBtn(index) {
      this.$Modal.info({
        title: "修改信息"
      });
    },
    // 修改部门信息
    // "deptId": "",
    // "deptName": "",
    // "deptNo": "",
    // "descriptions": "",
    // "enable": true,
    // "highDeptId": "",
    // "highDeptName": "",
    // "highDeptNo": ""
    fix(index,row) {

      this.selectValueFix=row.highDeptId;

      this.modalFix = true;
      // let deptData = this.data1[index];
      let params = this.fixData;
      params.deptId = row.deptId;
      params.deptName = row.deptName;
      params.deptNo = row.deptNo;
      params.descriptions = row.descriptions;
      params.enable = row.enable;
      params.highDeptId = row.highDeptId;
    },
    okFix() {
      this.fixData.highDeptId = this.selectValue;
      saveDept(this.fixData).then(res => {
        if (res.code === "200") {
          this.$Message.info('修改成功!');
          this.getDepartment.bind(this)();
        }
      });
    },
    cancelFix() {
    },
    // 点击批量删除按钮
    okDelAll() {
      let param={};
      param.deptIds=this.delData;
      deletes(param).then(res=>{
        if(res.code==='200'){
          this.$Message.info('批量删除成功!')
          this.getDepartment.bind(this)();
        }
      })
    },
    cancelDelAll() {},

    // 点击单个删除按钮
    remove(index) {
      this.removeData.deptId = this.data1[index].deptId;
      this.modelDel = true;
    },
    okDel() {
      deleteDept(this.removeData).then(res => {
        if(res.code==='200'){
          this.$Message.info('删除成功!');
          this.getDepartment.bind(this)();
        }
      });
    },
    cancelDel() {},
    doBottom(who) {
      if (who === "add") {
        this.modalAdd = true;
      }
      if (who === "del") {
        if(!this.delData){
          this.$Message.info('您没选中任何数据!');
          return;
        }
        let el = this.$refs.selection;
        this.modelDelAll=true;
      }
      if (who === "jin") {
        if(!this.delData){
          this.$Message.info('您没选中任何数据!');
          return;
        }
        this.modelStopAll=true;
      }
    },
    // 确认批量禁用
    okStopAll(){
      let param={};
      param.deptIds=this.delData;
      param.enable=false;
      this.loading=true;
      setMoreDept(param).then(res=>{
        if(res.code==='200'){
          this.delData='';
          this.loading=true;
          this.$Message.info('禁用成功!')
          this.getDepartment.bind(this)();
        }
      })
    },
    // 取消批量禁用
    cancelStopAll(){

    },
    show(index) {},

    ok() {
    },
    cancel() {
    },

    // 修改部门
    confirmFixFun(){


      if(this.fixData.deptName){
        this.deptNameFixBool=true;
      }
      if(this.selectValueFix&&this.deptNameFixBool){
        let params = this.fixData;
        params.highDeptId = this.selectValueFix;
        saveDept(params).then(res => {
          if (res.code === "200") {
            this.fixData={};
            this.modalFix=false;
            this.$Message.info("修改部门成功!");
            this.getDepartment.bind(this)();
          }
        });
        return;
      }
      this.$Message.info('信息未填写正确或不完整或未修改,请检查!');
    },
    concelFixFun(){
      this.modalFix=false;
    },
    // 确认新增部门
    confirmFun(){
      if(this.deptNameBool&&this.deptNoBool&&this.selectValue){
        let params = this.newDept;
        params.highDeptId = this.selectValue;
        saveDept(params).then(res => {
          if (res.code === "200") {
            this.newDept={};
            this.modalAdd=false;
            this.$Message.info("新增部门成功!");
            this.getDepartment.bind(this)();
          }
        });
        return;
      }
      this.$Message.info('信息未填写正确或不完整或未修改,请检查!');
    },
    concelFun(){
      this.modalAdd=false;
    },
    ok2() {
      let params = this.newDept;
      params.highDeptId = this.selectValue;
    },
    cancel2() {

    }
  }
};
</script>

<style lang="stylus" scoped>
 #company-management
    & >>> .ivu-page 
      margin-top 20px
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
    
  .set-wrapper
    .modal-fix
      margin 32px 0
      // label 
      //   font-size 14px
      // input 
      //   background #eeeeee
      //   font-size 15px
      //   padding 6px 20px
      //   border-radius 10px
      //   text-indent 1px
    .set-left
      // background red
      // width 400px
      // background red
      margin 0 auto
      padding 0 3.8rem
      .modal-new
        margin 32px 0
        
        
        label 
          display inline-block
          font-size 14px
          width 5rem
        input
          width 20rem
          font-size 15px
          padding 6px 0
          border-bottom 1px solid #00000052;
        .preCom
          // background red
          display block
          float left
          line-height 36px
          width 5rem
          font-size 14px
          // margin-top -20px
          
          // padding 10px 0
        .preTree
          margin-left 4px
          display inline-block;
          max-width 260px
        .remarkLabel
          float left
        .remark
          font-size 15px
          outline none
          border none
          width 20.2rem
          height 4rem
          background #00000005
          border-bottom 1px solid #00000052
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
</style>