<template>
  <div id="role-management">
    <!-- 搜索条件 -->
    <div class="condition">
      <div class="condition-empty">
        <div class="condition-item">
          <label for="company" value="类型编号">类型编号 :&nbsp;</label>
          <input class="input-com" name="company" type="text" v-model="findData.typeNo">
        </div>
        <div class="condition-item">
          <label for="company" value="类型名称">类型名称 :&nbsp;</label>
          <input class="input-com" name="company" type="text" v-model="findData.typeName">
        </div>
        <!-- 查询按钮 -->
        <div class="sub-btn" @click="getDeviceDataM()">
          <svgicon iconClass="icon-chazhao" class="do-icon-com"></svgicon>查询
        </div>
      </div>
    </div>
    <!-- 按钮操作组 -->
    <div class="button-group">
      <div class="btn-com" @click="updateM">
        <svgicon iconClass="icon-banbengengxin" class="do-icon-com"></svgicon>更新
      </div>
    </div>
    <!-- 信息表 @on-selection-change='selectionClick'不能有括号-->
    <Table
      :loading="loading"
      border 
      stripe
      highlight-row 
      ref="selection" 
      :columns="columnsHeader" 
      :data="deviceData" 
      @on-row-click="handleChange" 

    >
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
        <Modal width="760" draggable v-model="lookBool" title="查看设备信息">
          <div class="set-wrapper">
            <!-- 需要设置UI -->
            设备编码------ {{ lookData.typeCode }}
            <br>
            设备名称------ {{ lookData.typeName }}
            <br>
            是否有效------ {{ lookData.enable }} <br/>
            有一个属性列表 {{ lookData.deviceProperties }}
            <br>
          </div>
        </Modal>
  </div>
</template>

<script>
import {updateDeviceType, getDeviceTypePage, apiCompany, getRoleList, getMenuList } from "@/request/api";
import Storage from "@/util/storage";
export default {
  name: "account-information",
  data() {
    return {

      // 获取设备信息
      deviceData: [
        {
          typeCode: "5465",
          typeName: "打印机",
          enable: "是"
        },
      ],
      // 分页信息
       findData: {
        bePage:1,
        currPage:10,
        typeNo:'',
        typeName:'',
        enable:''
      },
      pageSizeOpts: [5, 10, 15, 20 ,25, 30],
      total: 0,
      loading:true,

      // 查看按钮
      lookBool:false,
      lookData:{
        "descriptions": "",
				"deviceProperties": [
					{
						"descriptions": "",
						"enable": true,
						"propertyId": "",
						"propertyName": "",
						"propertyValue": "",
						"valueType": ""
					}
				],
				"enable": true,
				"typeCode": "",
				"typeId": "",
				"typeName": ""
      },


      _token: "",
      modal1: false,
      modal2: false,
      companyTreeBool: false,
      batchDel: false,
      batchDelData: null,
      selectBool: false,
      treeBoolMenu: true,
      addData: {
        name: "",
        code: new Number(),
        company: "",
        data: "",
        enable: "",
        menu: ""
      },
     
      fixData: {
        name: "",
        company: "",
        index: ""
      },

    
      choices: [], //在右边需展示出来的数据
      keyTreeData: null,
      menuData: [],
      columnsHeader: [
        {
          type: "index",
          width: 60,
          align: "center"
        },
        {
          title: "类型编号",
          key: "typeCode"
        },
        {
          title: "类型名称",
          key: "typeName"
        },
        {
          title: "是否有效",
          key: "enable"
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
            ]);
          }
        }
      ]
    };
  },
  created() {
   this.getDeviceDataM();
  },
  computed: {},
  mounted() {
  
  },
  methods: {
    // 获取设备分页信息
    getDeviceDataM(){
      let param=this.findData;
      getDeviceTypePage(param).then(res=>{
        if(res.code==='200'){
        let fData=this.findData;
        let data=res.data;
        fData.bePage=data.pageNo;
        this.total=data.total;
        fData.currPage=data.currPage;
        this.deviceData=res.data.pageData;
        this.loading=false;
        }
      })
    },
    // 更新按钮
    updateM(){
      let param={};
      param=this.findData;
      this.loading=true;
      updateDeviceType(param).then(res=>{
        if(res.code==='200'){
          this.$Message.info('更新成功!')
          let fData=this.findData;
          let data=res.data;
          fData.bePage=data.pageNo;
          this.total=data.total;
          fData.currPage=data.currPage;
          this.deviceData=res.data.pageData;
          this.loading=false;
        }
      })
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

    handleChange(){

    },

    showData(index){
      this.lookBool=true;
      let lookData=this.lookData;
      let deviceD=this.deviceData[index];
      lookData.typeCode=deviceD.typeCode;
      lookData.typeName=deviceD.typeName;
      lookData.typeNo=deviceD.typeNo;
      lookData.descriptions=deviceD.descriptions;
    },
    getSelectedNodesData(arr, item) {
    },
    choiceMenu(arr) {
    },
    findDataM() {
      let findObj = this.findData;
      getRoleList({
        access_token: this._token,
        bePage: 1,
        currPage: this.pageSize,
        deptId: findObj.company,
        roleNo: findObj.roleNo,
        roleName: findObj.roleName
      }).then(res => {
        if (res.code === "200") {
        }
      });
    },

    // 点击表格里的复选框事件
    selectionClick(arr) {
      this.batchDelData = arr;
    },
    // 确认删除选中的表格数据
    okBatchDel() {},
    // 取消删除选中的表格数据
    cancelBatchDel() {},
    showCompanyTree() {
      apiCompany({
        access_token: this._token
      }).then(res => {
      });
      this.companyTreeBool = true;
    },
    // 递归改变json格式
    changeJson(da) {
      let oldObj = {};
    },
    // 确定选中单位树
    okTree() {
      let el = this.$refs.tree.getSelectedNodes(); //返回选中数据
      this.$refs.company.value = el[0].title;
    },
    choiceCompany() {},
    handleSelectAll(status) {
      this.$refs.selection.selectAll(status);
    },
    addKeyMenuStructure(resData, addAttr, s) {
      for (let i = 0, len = resData.length; i < len; i++) {
        //  添加属性
        resData[i][addAttr] = s;
        if (!!resData[i].childMenu) {
          this.addKeyMenuStructure(resData[i].childMenu, addAttr, ++s);
        }
      }
      return resData;
    },
    doBottom(who) {
      if (who === "add") {
        getMenuList({
          access_token: this._token
        }).then(res => {
          if (res.code === "200") {
            let addAttr = "nodeKey",
              s = 0;
            let newKeyData = this.$options.methods.addKeyMenuStructure(
              res.data,
              addAttr,
              s
            );
            this.keyTreeData = newKeyData;
            let oldMenu = [];
            let newMenu = this.$options.methods.changeMenuStructure(
              res.data,
              oldMenu
            );
            this.menuData = newMenu;
            return;
          }
        });
        this.modal2 = true;
        return;
      }
    },
    show(index) {
      this.fixData.index = index;
      this.modal1 = true;
    }
  }
};
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



















