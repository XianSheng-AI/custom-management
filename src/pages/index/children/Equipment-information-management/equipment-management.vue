<template>
  <div id="role-management">
    <!-- 搜索条件 -->
    <div class="condition">
      <div class="condition-empty">
        <div class="condition-item">
          <label for="company" value="类型编号">客户名称 :&nbsp;</label>
          <!-- select封装 -->
          <div class="selectDevice">
            <div class="select-wrapper" @click="showDrive">
              <div class="set--select">
                <span ref="selectRef" class="set-select--type">选择客户</span>
                <span class="set-com-choose-svg">
                  <svgicon iconClass="icon-ICON-"></svgicon>
                </span>
              </div>
            </div>
            <select-box ref="select_box" :selectBox_data="initSelectData" @reciveMe="selectM"></select-box>
          </div>
          <!-- <input class="input-com" 
              name="company" 
              type="text" 
              v-model="findData.roleName"
          >-->
        </div>
        <div class="condition-item">
          <label for="company" value="类型名称">设备类型 :&nbsp;</label>
          <!-- <input class="input-com" name="company" type="text" v-model="findData.deviceTypeName"> -->
          <div class="selectDevice">
            <div class="select-wrapper" @click="showDriveFind">
              <div class="set--select">
                <span ref="selectRefFind" class="set-select--type">选择设备类型</span>
                <span class="set-com-choose-svg">
                  <svgicon iconClass="icon-ICON-"></svgicon>
                </span>
              </div>
            </div>
            <select-box-device-list 
            ref="select_box_find" 
            :selectBox_data_find="initSelectFindData" 
            @reciveFindMe="selectFindM"
            ></select-box-device-list >
          </div>
        </div>
        <div class="condition-item">
          <label for="company" value="类型名称">设备名称 :&nbsp;</label>
          <input class="input-com" name="company" type="text" v-model="findData.deviceName">
        </div>
        <div class="condition-item">
          <label for="company" value="类型名称">设备编号 :&nbsp;</label>
          <input class="input-com" name="company" type="text" v-model="findData.deviceNo">
        </div>
        <!-- 查询按钮 -->
        <div class="sub-btn" @click="getDeviceData()">
          <svgicon iconClass="icon-chazhao" class="do-icon-com"></svgicon>查询
        </div>
      </div>
    </div>
    <!-- 按钮操作组 -->
    <div class="button-group">
      <div class="btn-com" @click="doBottom('geng')">
        <svgicon iconClass="icon-banbengengxin" class="do-icon-com"></svgicon>更新
      </div>
      <div class="btn-com" @click="doBottom('fen')">
        <svgicon iconClass="icon-fenpei1" class="do-icon-com"></svgicon>分配
      </div>
      <div class="btn-com" @click="doBottom('xu')">
        <svgicon iconClass="icon-tianjiawumoxinggongchengliangjilu" class="do-icon-com"></svgicon>续期
      </div>
      <div class="btn-com" @click="doBottom('jin')">
        <svgicon iconClass="icon-jinyong1" class="do-icon-com"></svgicon>禁用
      </div>
    </div>
    <!-- 信息表 @on-selection-change='selectionClick'不能有括号-->
    <Table
      border
      stripe
      ref="selection"
      :loading="loading"
      highlight-row
      :columns="columnsHeader"
      :data="deviceData"
      @on-selection-change="selectionClick"
    ></Table>
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
        设备类型------ {{ lookData.deviceTypeName }}
        <br>
        所属用户------ {{ lookData.deptName }}
        <br>
        设备编号------ {{ lookData.deviceNo }}
        <br>
        设备名称------ {{ lookData.deviceName }}
        <br>
        设备状态------ {{ lookData.deviceStatus }}
        <br>
        是否可用------ {{ lookData.enable }}
        <br>
        有效期至------ {{ lookData.enableTime }}
        <br>
        备注说明------ {{ lookData.descriptions }}
        <br>
      </div>
    </Modal>
    <!-- 续期 -->
    <Modal
      width="234"
      draggable
      v-model="continueBool"
      title="添加续期"
      @on-ok="okContinue"
      @on-cancel="cancelContinue"
    >
      <div class="set-wrapper">
        <DatePicker
          type="date"
          placeholder="Select date"
          style="width: 200px"
          @on-change="changeTime"
        ></DatePicker>
      </div>
    </Modal>
    <!-- 批量续期 -->
    <Modal
      width="234"
      draggable
      v-model="continueAllBool"
      title="批量添加续期"
      @on-ok="okContinueAll"
      @on-cancel="cancelContinueAll"
    >
      <div class="set-wrapper">
        <DatePicker
          type="date"
          placeholder="Select date"
          style="width: 200px"
          @on-change="changeTimeAll"
        ></DatePicker>
      </div>
    </Modal>
    <!-- 批量分配 -->
    <Modal width="432" draggable v-model="modalPushAll" title="批量分配设备" @on-ok="okPushAll" @on-cancel="cancelPushAll">
      <div class="fix-wrapper">
        <div class="modal-new">
          <label for="new">客户名称 :</label>
          <!-- <input type="text" name="new" v-model="fixData.roleName"> -->
          <div class="selectRole">
              <div class="select-wrapper" @click="showBox('more')">
                <div class="set--select">
                  <span ref="ref_more" class="set-select--type">选择客户</span>
                  <span class="set-com-choose-svg">
                    <svgicon iconClass="icon-ICON-"></svgicon>
                  </span>
                </div>
              </div>
              <select-box
                ref="ref_user_all"
                :selectBox_data="initSelectData"
                @reciveMe="selectPushMore"
              ></select-box>
            </div>
        </div>
        
        <!-- <div class="modal-new">
          <label for="new">客户账号 :</label>
          <input type="text" name="new" v-model="fixData.roleName">
          <div class="selectRole">
              <div class="select-wrapper" @click="showBox2">
                <div class="set--select">
                  <span ref="" class="set-select--type">选择账号</span>
                  <span class="set-com-choose-svg">
                    <svgicon iconClass="icon-ICON-"></svgicon>
                  </span>
                </div>
              </div>
            </div>
        </div> -->
       
        <div class="modal-new">
          <label for="new">续期时间 :</label>
           <DatePicker
            type="date"
            placeholder="选择续期时间"
            style="width: 200px"
            @on-change="changeTimeBatchAll"
          ></DatePicker>
        </div>
        <!-- <div class="modal-new">
          <label for="new">是否有效 :</label>
          <input type="text" name="new" v-model="fixData.enable">
          <i-Switch size="large" v-model="addData.enable" @on-change="changeFixEnable">
            <span slot="open">有效</span>
            <span slot="close">无效</span>
          </i-Switch>
        </div> -->
        <!-- <div class="modal-new">
          <label for="new">备注信息 :</label>
          <textarea class="remarks" name="" id="" cols="30" rows="10"></textarea>
          <input type="text" name="new" v-model="addData.descriptions">
        </div> -->
      </div>
    </Modal>
    <!-- 分配 -->
    <Modal width="432" draggable v-model="modalPush" title="分配设备" @on-ok="okPush" @on-cancel="cancelPush">
      <div class="fix-wrapper">
        <div class="modal-new">
          <label for="new">客户名称 :</label>
          <!-- <input type="text" name="new" v-model="fixData.roleName"> -->
          <div class="selectRole">
              <div class="select-wrapper" @click="showBox()">
                <div class="set--select">
                  <span ref="ref_dan" class="set-select--type">选择客户</span>
                  <span class="set-com-choose-svg">
                    <svgicon iconClass="icon-ICON-"></svgicon>
                  </span>
                </div>
              </div>
              <select-box
                ref="ref_user"
                :selectBox_data="initSelectData"
                @reciveMe="selectPushDan"
              ></select-box>
            </div>
        </div>
        
        <!-- <div class="modal-new">
          <label for="new">客户账号 :</label>
          <input type="text" name="new" v-model="fixData.roleName">
          <div class="selectRole">
              <div class="select-wrapper" @click="showBox2">
                <div class="set--select">
                  <span ref="" class="set-select--type">选择账号</span>
                  <span class="set-com-choose-svg">
                    <svgicon iconClass="icon-ICON-"></svgicon>
                  </span>
                </div>
              </div>
          </div>
        </div> -->
        
        <div class="modal-new">
          <label for="new">续期时间 :</label>
           <DatePicker
            type="date"
            placeholder="选择续期时间"
            style="width: 200px"
            @on-change="changeTimeSin"
          ></DatePicker>
        </div>
        <!-- <div class="modal-new">
          <label for="new">是否有效 :</label>
          <input type="text" name="new" v-model="fixData.enable">
          <i-Switch size="large" v-model="addData.enable" @on-change="changeFixEnable">
            <span slot="open">有效</span>
            <span slot="close">无效</span>
          </i-Switch>
        </div> -->
        <!-- <div class="modal-new">
          <label for="new">备注信息 :</label>
          <textarea class="remarks" name="" id="" cols="30" rows="10"></textarea>
          <input type="text" name="new" v-model="addData.descriptions">
        </div> -->
      </div>
    </Modal>
    <!-- 确认批量禁用提示框 -->
    <Modal width="332" draggable v-model="modelStopAll" title="禁用警告"  @on-ok="okStopAll" @on-cancel="cancelStopAll">
      <div>您确定要批量禁用选中的用户吗?</div>
    </Modal>
  </div>
</template>

<script>
import {
  getDeviceByPageInfo,
  apiCompany,
  getRoleList,
  getMenuList,
  getDealerList, // 这里客户名称使用部门管理的下拉用     companyNo赋值给deptNo
  UpdateDeviceInfo, //更新设备信息
  deviceListModify, //有效期
  deviceInfoModify, //分配设备，修改有效期
  setMoreEnable,
  getAppPageInfo,
  getDeviceTypeList
} from "@/request/api";
import selectBox from "@/components/select-box/select-box";
import selectBoxDeviceList from "@/components/select-box/select-box-device-list";
import Storage from "@/util/storage";
export default {
  name: "account-information",
  components: {
    selectBox,
    selectBoxDeviceList
  },
  data() {
    return {
      findData: {
        bePage: 1,
        currPage: 10,
        deviceName: "",
        deviceNo: "",
        deptNo: "",
        typeNo: ""
      },

      // 单个分配
      pushAllData:{
        dealerId: "",
        deviceId: "",
        enableTime: ""
      },

      // 设备分页信息
      deviceData: [
        {
          deptId: "",
          deptName: "",
          deptNo: "",
          descriptions: "",
          deviceId: "",
          deviceName: "",
          deviceNo: "",
          deviceStatus: "",
          deviceTopic: "",
          deviceTypeCode: "",
          deviceTypeId: "",
          deviceTypeName: ""
        }
      ],

      // 批量禁用
      modelStopAll:false,
      stopData:'',

      // 批量分配
      modalPushAll:false,
      batchData:{
        code: "",
          deviceInfoModifyDtoList: [
            {
              dealerId: "",
              deviceId: "",
              enableTime: ""
            }
	        ]
      },
      // 查询
      initSelectFindData:{
         data: [],
        HEI: "13rem"
      },
      // 分配
      modalPush:false,
      initSelectData_user:{
         data: [
          {
            "dealerId": "",    //传入deptNo
            "deviceId": "",
            "enableTime": ""
          }
        ],
        HEI: "13rem"
      },
      initSelectData_account:{
         data: [
          {
            "dealerId": "",    //传入deptNo
            "deviceId": "",
            "enableTime": ""
          }
        ],
        HEI: "13rem"
      },
      

      // 分页条数据
      pageSizeOpts: [5, 10, 15, 20, 25, 30],
      total: 0,
      loading: true,

      // 分页条
      total: 0,

      initSelectData: {
        data: [
          {
            enable: true,
            roleId: "",
            roleName: "",
            roleNo: ""
          }
        ],
        HEI: "13rem"
      },

      // 点击查看
      lookBool: false,
      lookData: {
        deptId: "",
        deptName: "",
        deptNo: "",
        descriptions: "",
        deviceId: "",
        deviceName: "",
        deviceNo: "",
        deviceStatus: "",
        deviceTopic: "",
        deviceTypeCode: "",
        deviceTypeId: "",
        deviceTypeName: "",
        enable: true,
        enableTime: ""
      },
      // 批量修改续期
      allEnableTime:'',
      continueAllBool:false,
      continueAll:{
        	code: "",
          deviceInfoModifyDtoList: [
            {
              dealerId: "",
              deviceId: "",
              enableTime: ""
            }
	        ]
      },
      // 续期
      continueBool: false,
      // continueData:{
      //   "dealerId": "",
      //   "deviceId": "",
      //   "enableTime": ""
      // },
      continueData: {
        dealerId: "",
        deviceId: "",
        enableTime: ""
      },

      _token: "",
      modal1: false,
      modal2: false,
      companyTreeBool: false,
      batchDel: false,
      selectData: null,
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
      //  分页条
      ajaxHistoryData: [],
      // 初始化信息总条数
      dataCount: 0,
      // 每页显示多少条
      pageSize: 1,

      historyData: [
        // {
        //   typeNo: "5465",
        //   typeName: "打印机",
        //   isWork: "是"
        // },
        // {
        //   typeNo: "5465",
        //   typeName: "打印机",
        //   isWork: "是"
        // },
        // {
        //   typeNo: "5465",
        //   typeName: "打印机",
        //   isWork: "是"
        // },
        // {
        //   typeNo: "5465",
        //   typeName: "打印机",
        //   isWork: "是"
        // },
        // {
        //   typeNo: "5465",
        //   typeName: "打印机",
        //   isWork: "是"
        // },
        // {
        //   typeNo: "5465",
        //   typeName: "打印机",
        //   isWork: "是"
        // },
        // {
        //   typeNo: "5465",
        //   typeName: "打印机",
        //   isWork: "是"
        // },
        // {
        //   typeNo: "5465",
        //   typeName: "打印机",
        //   isWork: "是"
        // },
        // {
        //   typeNo: "5465",
        //   typeName: "打印机",
        //   isWork: "是"
        // }
      ],
      choices: [], //在右边需展示出来的数据
      keyTreeData: null,
      menuData: [],
      columnsHeader: [
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
          title: "设备类型",
          key: "deviceTypeName",
          align: "center",
        },
        {
          title: "设备编号",
          key: "deviceNo",
          align: "center",
        },
        {
          title: "设备名称",
          key: "deviceName",
          align: "center",
        },
        {
          title: "客户名称",
          key: "deptName",
          align: "center",
        },
        {
          title: "状态",
          key: "deviceStatus",
          align: "center",
        },
        {
          title: "有效期至",
          key: "enableTime",
          align: "center",
        },
        {
          title: "是否可用",
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
                      this.continue(params.index);
                    }
                  }
                },
                "续期"
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
                      this.pushM(params.index);
                    }
                  }
                },
                "分配"
              )
            ]);
          }
        }
      ]
    };
  },
  created() {
    this.getDealerListM();
    this.getDeviceData();
    // this.getAccount()     //考虑是不用
    this.getDeviceTypeListM();
  },
  computed: {},
  mounted() {},
  methods: {
    // 获取客户账号
    getAccount(){
      getAppPageInfo().then(res=>{
      })
    },
    getDeviceTypeListM(){
      getDeviceTypeList().then(res=>{
        if(res.code==='200'){
          this.initSelectFindData.data=res.data;
          this.initSelectFindData.data.unshift({
            descriptions: '',
            typeCode: '',
            typeId: '',
            typeName: '选择设备类型'
           });

        }
      })

    },
    // 获取经销商(下拉用)
    getDealerListM() {
      getDealerList().then(res => {
        if (res.code === "200") {
          this.initSelectData.data = res.data;
          this.initSelectData.data.unshift({
            id: '',
            companyNo: '',
            companyName: '选择客户',
           });
        }
      });
    },
    getDeviceData() {
      let param = this.findData;
      this.loading=true;
      getDeviceByPageInfo(param).then(res => {
        if (res.code === "200") {
          this.loading = false;
          let data = res.data;
          let findD = this.findData;
          findD.currPage = data.currPage;
          findD.bePage = data.pageNo;
          this.total = data.total;
          this.deviceData = data.pageData;
        }
      });
    },
    // 查询信息里的设备类型
    showDriveFind(){
      this.$refs.select_box_find.repeatControl();
    },
    selectFindM(item){
      this.$refs.selectRefFind.innerText=item.typeName;
      this.findData.typeNo=item.typeCode;
    },
    showDrive() {
      this.$refs.select_box.repeatControl();
    },
    // 选择框
    selectM(item) {
      this.$refs.selectRef.innerText = item.companyName;
      this.findData.deptNo = item.companyNo;
    },

    // 点击查看
    showData(index) {
      this.lookBool = true;
      this.lookData = this.deviceData[index];
    },

    // 确认批量禁用
    okStopAll(){
      let param={};
      param.deviceIds=this.stopData;
      param.enable=false;
      setMoreEnable(param).then(res=>{
        console.log(res)
        if(res.code==='200'){
          this.stopData='';
          this.loading=true;
          this.$Message.info('禁用成功!')
          this.getDeviceData.bind(this)();
        }
      })
      
    },
    // 取消批量禁用
    cancelStopAll(){
      
    },
    //  角色管理--新增按钮-菜单树
    changeMenuStructure(resData, newData) {
      for (let i = 0, len = resData.length; i < len; i++) {
        //  添加属性
        newData[i] = {};
        newData[i].title = resData[i].menuName;
        newData[i].expand = true;
        if (!!resData[i].childMenu) {
          newData[i].children = [];
          this.changeMenuStructure(resData[i].childMenu, newData[i].children);
        }
      }
      return newData;
    },
    getSelectedNodesData(arr, item) {
    },
    choiceMenu(arr) {
    },
    findDataM() {
      let findObj = this.findData;
      getRoleList({
        bePage: 1,
        currPage: this.pageSize,
        deptId: findObj.company,
        roleNo: findObj.roleNo,
        roleName: findObj.roleName
      }).then(res => {
        if (res.code === "200") {};
      });
    },

    // 单页切换分页条
    changepage(index) {
      this.findData.bePage = index;
      this.findDataM();
    },
    // 分页条切换单页显示条数
    changPageSize(index) {
      this.findData.currPage = index;
      this.findDataM();
    },

    // 点击表格里的复选框事件
    selectionClick(arr) {
      this.selectData = arr;
      let modifyList=[];
      let batch=[];

      let da=[];
      for(let i=0,len=arr.length;i<len;i++){

        // 批量分配
        batch.push({deviceId:arr[i].deviceId});
        this.batchData.data=batch;

        modifyList.push({dealerId:arr[i].deptId,deviceId:arr[i].deviceId})
        da.push(arr[i].deviceId);
      }
      this.continueAll.deviceInfoModifyDtoList=modifyList;
      this.stopData=da.join(',');
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

    updateData() {
      let param = this.findData;
      UpdateDeviceInfo(param).then(res => {
        if (res.code === "200") {
          this.loading = false;
          this.$Message.info('更新成功!');
          this.deviceData = res.data.pageData;
        }
      });
    },
    doBottom(who) {
      if (who === "geng") {
        this.loading = true;
        this.updateData.bind(this)();
      }
      // 续期
      if (who === "xu") {
        if(!this.selectData||this.selectData.length===0){
          this.$Message.info("您没有选择任何一项!");
          return;
        }
        this.continueAllBool = true;
      }
      // 批量禁用
      if(who==='jin'){
        if(!this.stopData||this.stopData.length===0){
          this.$Message.info("您没有选择任何一项!");
          return;
        }
        this.modelStopAll=true;
      }
      // 批量分配
      if(who==='fen'){
        if(!this.selectData||this.selectData.length===0){
          this.$Message.info("您没有选择任何一项!");
          return;
        }
        this.modalPushAll=true;
      }
    },
    changeTimeBatchAll(date){
      let batch=this.batchData.data
      let len=batch.length;
      for(let i=0;i<len;i++){
        batch[i].enableTime=date+'16:20:16';
      }

    },
    show(index) {
      this.fixData.index = index;
      this.modal1 = true;
    },

    // 点击单个续期
    continue(index) {
      this.continueData.deviceId = this.deviceData[index].deviceId;
      this.continueData.dealerId = this.deviceData[index].deptId;
      this.continueBool = true;
    },
    // 改变续期触发
    changeTime(date) {
      this.continueData.enableTime = date;
    },
    changeTimeSin(date){
      this.pushAllData.enableTime=date+' 21:30:20';
    },
    // 更改批量修改续期
    changeTimeAll(date){
      // this.allEnableTime=date;
      let arr=this.continueAll.deviceInfoModifyDtoList
      for(let i=0,len=arr.length;i<len;i++){
        arr[i].enableTime=date+' 12:12:12';
      }
    },
    // 确认修改续期
    okContinueAll(){
      // 批量修改续期
      this.loading=true;
      let param=this.continueAll;
      deviceListModify(param).then(res=>{
        if(res.code==='200'){
          this.$Message.info('修改续期成功!')
          this.getDeviceData.bind(this)();
        }
      })
    },
    // 取消批量修改续期
    cancelContinueAll(){

    },
    // 单个更改续期方法
    okContinue() {
      // 需求   前面加上客户(下拉)经销商
      this.loading=true;
      this.continueData.enableTime = this.continueData.enableTime + " 03:11:56";
      this.loading=true;
      deviceInfoModify(this.continueData).then(res => {
        if (res.code === "200") {
          this.$Message.info('修改续期成功!');
          this.getDeviceData.bind(this)();
        }
      });
    },
    // 单个分配客户名称下拉
    selectPushDan(item){
      this.$refs.ref_dan.innerText = item.companyName;
      this.pushAllData.dealerId=item.id;
    },
    // 批量分配客户名称下拉
    selectPushMore(item){
      let len=this.batchData.data.length;
      let da=this.batchData.data;
      for(let i=0;i<len;i++){
        da[i].dealerId=item.id;
      }
      this.$refs.ref_more.innerText = item.companyName;
    },
    // 搜索栏的客户名称下拉
    selectPushM(item){
      this.$refs.choice_user.innerText = item.companyName;
      // this.addData.roleName=item.roleName;
    },

    // 确认批量分配
    okPushAll(){
      this.loading=true;
      deviceListModify(this.batchData).then(res=>{
        console.log(res);
        if(res.code==='200'){
          this.$Message.info('批量分配成功!');
          this.getDeviceData.bind(this)();
        }
      })
    },
    // 取消批量分配
    cancelPushAll(){

    },
    // 点击单个分配按钮
    pushM(ind){
      this.pushAllData.deviceId=this.deviceData[ind].deviceId;
      this.modalPush=true;
    },
    // 点击单个分配,切换显示客户下拉
    showBox(val){
      if(val){
        this.$refs.ref_user_all.repeatControl();
        return;
      }
      this.$refs.ref_user.repeatControl();
    },
    // 点击单个分配,切换显示账号下拉
    showBox2(){

      this.$refs.ref_account.repeatControl();
    },
    // 确认分配设备
    okPush(){
      deviceInfoModify(this.pushAllData).then(res=>{
        if(res.code==='200'){
          this.$Message.info('分配设备成功!');
        }
      })
    },
    // 取消分配设备
    cancelPush(){

    },
    cancelContinue() {},

    confirmBatch() {
      if (this.selectData === null) {
         this.$Message.info('This is a info tip');
        return;
      }
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
      margin 20px auto
  }
  #role-management
    .condition
      margin 16px 0
      &:after
        content:''
        clear both
        display block
        visibility hidden;
      .condition-empty
        width 100%
        // overflow hidden
        .condition-item
          float left
          padding 10px 30px 10px 0

          .selectDevice
            display inline-block
            position relative
            color #8590a6
            .select-wrapper
              display inline-block
              .set--select
                padding: 0.315rem 0.8rem;
                border: 1px solid #8590a69e;
                border-radius: 1rem;
                cursor: pointer;
                .set-select--type
                  transition .3
                  display: inline-block
                  min-width 260px 
                  max-width 280px
                .set-com-choose-svg
                  display: inline-block
                  .svg-icon
                    font-size 1.2rem

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
        // .companyTree
        //   display inline-block
        //   width 14rem
        //   max-width 17rem
        //   & >>> .vue-treeselect__control
        //     border-radius 30px
        //     height 38px
        //     border 1px solid #8590a69e
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
        .remarks
          border-color rgba(133,144,166,0.62)
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
  .fix-wrapper
    padding 0 2rem
    .modal-new
      display flex
      align-items center
      justify-content left
      margin 26px 0
      label 
        font-size 14px
        width 6rem
        color #8590a6
      .remarks
        border-color rgba(133,144,166,0.62)
        border-radius 4px
      input
        border 1px solid #8590a69e
        // background #bdcef1
        font-size 15px
        padding 6px 20px
        border-radius 30px
        text-indent 1px
      .companyTree
        display inline-block
        width 18rem
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
            padding: 0.315rem 0.8rem;
            border: 1px solid #8590a69e;
            border-radius: 1rem;
            cursor: pointer;
            .set-select--type
              display: inline-block
              min-width 152px 
              max-width 200px
            .set-com-choose-svg
              display: inline-block
              .svg-icon
                font-size 1.2rem
</style>



















