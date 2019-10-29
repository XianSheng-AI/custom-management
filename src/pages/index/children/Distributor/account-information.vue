<template>
  <div id="role-management">
    <!-- 搜索条件 -->
    <div class="condition">
      <div class="condition-empty">
        <div class="condition-item">
          <label value="企业名称">企业名称 :&nbsp;</label>
          <div class="input-wrapper">
            <div class="select-wrapper" @click="showCompany">
              <div class="set--select">
                <span ref="industryId" class="set-select--type">请选择</span>
                <span class="set-com-choose-svg">
                  <svgicon iconClass="icon-ICON-"></svgicon>
                </span>
              </div>
            </div>
            <select-box
              ref="companySelect"
              :selectBox_data="initSelectData"
              @reciveMe="industryMethod"
            ></select-box>
          </div>
        </div>
        <div class="condition-item">
          <label for="company" value="角色编号">账号名称 :&nbsp;</label>
          <input class="input-com" name="company" type="text" v-model="initData.appName">
        </div>
        <!-- 查询按钮 -->
        <div class="sub-btn" @click="findAccount()">
          <svgicon iconClass="icon-chazhao" class="do-icon-com"></svgicon>查询
        </div>
      </div>
    </div>
    <!-- 按钮操作组 -->
    <div class="button-group">
      <!-- <div class="btn-com" @click="doBottom('add')"><svgicon iconClass="icon-jia11" class="do-icon-com"></svgicon>新增</div> -->
      <!-- <div class="btn-com" @click="confirmBatch('del')"><svgicon iconClass="icon-shanchu3" class="do-icon-com"></svgicon>删除</div> -->
      <div class="btn-com" @click="updateM">
        <svgicon iconClass="icon-banbengengxin" class="do-icon-com"></svgicon>更新
      </div>
      <!-- <div class="btn-com" @click="doBottom('jin')">
        <svgicon iconClass="icon-jinyong1" class="do-icon-com"></svgicon>禁用
      </div> -->
      <div class="btn-com" @click="exportData">
        <svgicon iconClass="icon-daochu" class="do-icon-com"></svgicon>导出
      </div>
    </div>
    <!-- 信息表 @on-selection-change='selectionClick'不能有括号-->
    <Table
      border
      stripe
      ref="selection"
      :columns="columnsHeader"
      :data="accountData"
      @on-selection-change="selectionClick"
    >
      <template slot-scope="{ row }" slot="name">
        <strong>{{ row.name }}</strong>
      </template>
    </Table>
    <!-- 分页条 -->
    <Page
      :total="total"
      :page-size="initData.currPage"
      :current="initData.bePage"
      :page-size-opts="pageSizeOpts"
      show-total
      show-elevator
      show-sizer
      @on-change="changepage"
      @on-page-size-change="changPageSize"
    ></Page>
    <!-- 查看图层 -->
    <Modal width="560" draggable v-model="lookBool" title="查看账号信息" @on-ok="lookOk">
      <div class="set-wrapper">
        <!-- 需要设置UI -->
        账号编码 {{ lookData.appNo }}
        <br>
        账号名称 {{ lookData.appName }}
        <br>
        上级账号 {{ lookData.highLevelName }}
        <br>
        <!-- 账号企业信息 {{ lookData.dealerName }}
        <br>角色 还没有 -->
        <br>
        <!-- 联系方式 {{ lookData.email }} -->
        <br>
        <!-- 是否可登录 bool {{ lookData.loginFlag }} -->
        <br>
        <!-- 是否有效 {{ lookData.enable }} -->
        <br>
        备注信息 {{ lookData.descriptions }}
        <br>
      </div>
    </Modal>
  </div>
</template>

<script>
import { getAccountPage, getDealerList, getAppPageInfo, modifyAppInfo } from "@/request/api";
import Storage from "@/util/storage";
import selectBox from "@/components/select-box/select-box";

export default {
  name: "account-information",
  components: {
    selectBox
  },
  data() {
    return {
      _token: "",
      cBool: false, //判断企业名称点击触发接口
      lookBool: false,

      modal1: false,
      modal2: false,
      companyTreeBool: false,
      batchDel: false,
      batchDelData: null,
      selectBool: false,
      treeBoolMenu: true,
      accountData: [], //账号信息表
      lookData: {},

      findData: {
        company: "",
        roleName: "",
        roleNo: ""
      },
      fixData: {
        name: "",
        company: "",
        index: ""
      },

      initSelectData: {
        data: [],
        HEI: "13rem"
      },

      //  分页条
      ajaxHistoryData: [],
      // 初始化信息总条数
      dataCount: 0,
      // 每页显示多少条
      pageSize: 1,
      total: 100,
      pageSizeOpts: [1, 2, 3],
      initData: {
        //初始化或切换页面时参数
        bePage: 1,
        currPage: 3,
        dealerNo: "",
        appName: ""
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
          title: "账号编码",
          key: "appNo"
        },
        {
          title: "账号名称",
          key: "appName"
        },
        {
          title: "归属客户",
          key: "dealerName"
        },
        {
          title: "上级用户",
          key: "highLevelName"
        },
        // {
        //   title: "是否有效",
        //   key: "enable"
        // },
        // {
        //   title: "Action",
        //   key: "action",
        //   width: 200,
        //   align: "center",
        //   render: (h, params) => {
        //     return h("div", [
        //       h(
        //         "Button",
        //         {
        //           props: {
        //             type: "primary",
        //             size: "small"
        //           },
        //           style: {
        //             marginRight: "5px"
        //           },
        //           on: {
        //             click: () => {
        //               this.showData(params.index);
        //             }
        //           }
        //         },
        //         "查看"
        //       ),
        //       h(
        //         "Button",
        //         {
        //           props: {
        //             type: "error",
        //             size: "small"
        //           },
        //           on: {
        //             click: () => {
        //               this.prohibit(params.index);
        //             }
        //           }
        //         },
        //         "禁用"
        //       )
        //     ]);
        //   }
        // }
      ]
    };
  },
  created() {
    this.getToken();
    // this.handleListApproveHistory();
  },
  computed: {},
  mounted() {
    this.getAccount();
    // this.changeStructure(this.menuData)
    // this.showfor(10)
  },
  methods: {
    prohibit(index) {},
    lookOk() {
      this.lookBool = false;
    },
    // 点击显示企业名称
    showCompany() {
      this.cBool = !this.cBool;
      if (this.cBool) {
        getDealerList().then(res => {

          let da={
            companyName: "所有企业...",
            companyNo: "",
            id: ""
          }
          this.initSelectData.data = res.data;
          this.initSelectData.data.unshift(da);
        });
      }
      this.$refs.companySelect.repeatControl();
    },
    //行业选择select框接收方法
    industryMethod(item) {
      this.$refs.industryId.innerText = item.companyName;
      this.initData.dealerNo=item.companyNo;
    },
    showData(index) {
      this.lookBool = true;
      this.lookData = this.accountData[index];
    },
    exportData(){
      this.$refs.selection.exportCsv({
      filename: '账号信息表'//导出Excel的文件名
      })
    },
    findAccount() {
      this.getAccount.bind(this)();
    },
    getAccount() {
      getAppPageInfo(this.initData).then(res => {
        this.initData.bePage = res.data.pageNo;
        this.total = res.data.total;
        this.initData.currPage = res.data.currPage;
        this.accountData = res.data.pageData;
       
      });
    },
    changPageSize(num) {
      this.initData.currPage = num;
      this.getAccount();
    },
    getToken() {
      this._token = Storage.getSession("access_token");
    },
    getSelectedNodesData(arr, item) {
    },
    choiceMenu(arr) {
    },
    // 分页条
    // 获取历史记录信息
    updateM(){
      modifyAppInfo(this.initData).then(res => {
        this.initData.bePage = res.data.pageNo;
        this.total = res.data.total;
        this.initData.currPage = res.data.currPage;
        this.accountData = res.data.pageData;
      });
    },
    changepage(index) {
      this.initData.bePage = index;
      this.getAccount();
      let _start = (index - 1) * this.pageSize;
      let _end = index * this.pageSize;
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
    show(index) {
      this.fixData.index = index;
      this.modal1 = true;
    },
    confirmSingle(index) {
      this.$Modal.confirm({
        title: "操作警告",
        content: "<p>您确认删除此角色?</p>",
        onOk: () => {
          this.data1.splice(index, 1);
          this.$Message.info("删除成功!");
        },
        onCancel: () => {
          this.$Message.info("取消操作!");
        }
      });
    },
    remove(index) {
      this.data1.splice(index, 1);
    },
    ok() {
      let _this = this;
      _this.data1[_this.fixData.index].name = _this.fixData.name;
      _this.data1[_this.fixData.index].company = _this.fixData.company;

      _this.$options.methods.clearFixData(_this);
      _this.$Message.info("修改成功!");
    },
    cancel() {
      this.$Message.info("取消操作!");
    },
    clearFixData(_this) {
      _this.fixData = { name: "", company: "", index: "" };
    },
    ok2() {
      this.data1.push(this.addData);
      this.$Message.info("您点击了确认");
    },
    cancel2() {
      this.$Message.info("您点击了取消");
    }
  }
};
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
        &:after
          content:''
          clear both
          display block
          visibility hidden
        .condition-item
          float left
          padding 10px 30px 10px 0
          /*设置中心的select框组件*/
          .input-wrapper
            display inline-block
            position relative
            .select-wrapper

              display inline-block
              .set--select
                padding: 0.315rem 0.8rem;
                border: 1px solid #ebebeb;
                border-radius: 0.3rem;
                cursor: pointer;
                .set-select--type
                  display: inline-block
                  min-width 140px 
                  max-width 240px
                .set-com-choose-svg
                  display: inline-block
                  .svg-icon
                    font-size 1.2rem
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




















