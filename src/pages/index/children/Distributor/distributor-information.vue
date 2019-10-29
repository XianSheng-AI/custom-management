<template>
    <div id="role-management">
    
        <!-- 按钮操作组 -->
        
        <div class="button-group">
          <div class="btn-com" @click="getTree('ok')">
        <svgicon iconClass="icon-banbengengxin" class="do-icon-com"></svgicon>更新
      </div>
          <div class="btn-com" @click="doBottom('dao')"><svgicon iconClass="icon-daochu" class="do-icon-com"></svgicon>导出</div>
        </div>
        <div class="content">
          <Tree :data="distributorTreeData"  ref="tree" @on-select-change="choiceCompany()" :render="renderContent"></Tree>
        </div>
        <!-- 查看图层 -->
        <Modal
          draggable
          width="560"
          v-model="lookBool"
          title="查看经销商"
          @on-ok="lookOk">
          <div class="set-wrapper">
            <!-- 需要设置UI -->
            logo            {{ lookData.logo }} <br />
            企业编码        {{ lookData.companyNo }} <br />
            企业名称        {{ lookData.companyName }}<br />
            企业地址        {{ lookData.dealerAddress }}<br />
            时区            {{ lookData.timeZone }}<br />
            联系人名称       {{ lookData.linkMan }}<br />
            联系邮件地址     {{ lookData.email }}<br />
            上级经销商ID     {{ lookData.fatherDealerId }}<br />
            上级经销商名称  {{ lookData.fatherDealerName }}<br />
            上级经销商编号   {{ lookData.fatherDealerNo }}<br />
            是否可用        {{ lookData.enable }}<br />
            经销商ID        {{ lookData.id }}<br />
            所属行业        {{ lookData.industry }}<br />
            服务器IP        {{ lookData.serviceIp }}<br />
            服务端口        {{ lookData.servicePort }}<br />
            经销商角色       {{ lookData.dealerRole }}<br />
            备注信息        {{ lookData.descriptions }}<br />
          </div>
        </Modal>
        <!-- 新增 -->
        <Modal width="432" draggable v-model="modalAdd"  title="新增经销商">
          <div class="fix-wrapper">
          <Form v-model="addData" :rules="ruleForm">
            <FormItem label="经销商编码" prop="companyNo">
                <Input type="text" name="new" v-model="addData.companyNo"></Input>
            </FormItem>
            <FormItem label="经销商名称" prop="companyName">
                <Input type="text" name="new" v-model="addData.companyName"></Input>
            </FormItem>
            <FormItem label="联系人名称" prop="linkMan">
                <Input type="text" name="new" v-model="addData.linkMan"></Input>
            </FormItem>
            <FormItem label="联系邮箱" prop="email">
              <Input type="text" name="new" v-model="addData.email"></Input>
            </FormItem>
            <FormItem label="上级经销商名称" prop="fatherDealerName">
              <Input type="text" name="new" v-model="addData.fatherDealerName" readonly="readonly"></Input>
            </FormItem>
            <FormItem label="是否有效" prop="enable">
              <div class="modal-new">
                <i-Switch size="large" v-model="addData.enable" @on-change="changeEnable">
                  <span slot="open">有效</span>
                  <span slot="close">无效</span>
                </i-Switch>
              </div>
            </FormItem>
            <FormItem label="请输入经销商ID" prop="id">
              <Input type="text" name="new" v-model="addData.id"></Input>
              <!-- 必填-可编辑 -->
            </FormItem>
            <FormItem label="企业地址" prop="dealerAddress">
              <Input type="text" name="new" v-model="addData.dealerAddress"></Input>
            </FormItem>
            <FormItem label="服务器IP" prop="serviceIp">
              <Input type="text" name="new" v-model="addData.serviceIp"></Input>
            </FormItem>
            <FormItem label="端口" prop="servicePort">
              <Input type="text" name="new" v-model="addData.servicePort"></Input>
            </FormItem>
            <FormItem label="备注信息" prop="descriptions">
              <Input type="text" name="new" v-model="addData.descriptions"></Input>
            </FormItem>
          </Form>
          </div>
          <div slot="footer">
          <Button type="text" @click="concelAddFun">取消</Button>
            <Button type="primary" @click="confirmAddFun">确定</Button>
          </div>
        </Modal>
    </div>

</template>

<script>
import {
  getDealerInfoById,
  getDealerTree,
  saveDealerInfo,
  modifyDealer
} from '@/request/api'
import Env from '@/request/env'
  
import Storage from '@/util/storage'
import V from '@/util/validates'
export default {
  components:{
  },
  name:'distributor-information',
  data(){
  // 经销商名称验证
  const validateDealer = (rule, value, callback) => {
    
    
    let val=this.addData.companyName;
    if (val === ''||val===undefined) {
      this.companyNameBool=false;
      return callback(new Error('经销商名称不能为空!'));
    }
    this.companyNameBool=true;
    callback();
  };
  // 经销商编码验证
  const validateDealerNo = (rule, value, callback) => {
    let val=this.addData.companyNo;
    if (val === ''||val===undefined) {
      this.companyNoBool=false;
      return callback(new Error('经销商编码不能为空!'));
    }
    getDealerInfoById({id:val}).then(res=>{
      if(res.data){
        return callback(new Error('经销商编码已重复!'));
      }
    })

    this.companyNoBool=true;
    callback();
  };
  // 联系人验证
  const validateLinkMan = (rule, value, callback) => {
    let val=this.addData.linkMan;
      if (val === ''||val===undefined) {
        this.linkManBool=false;
         return callback(new Error('联系人名称不能为空!'));
      }
      this.linkManBool=true;
      callback();
  };
  // // 邮箱验证
  const validateEmail = (rule, value, callback) => {
      let val=this.addData.email;
      if (!val) {
          this.emailBool=false;
          return callback(new Error('请输入正确的邮箱!'));
      }
      if(!V.validate(val,'email')){
        this.emailBool=false;
          return callback(new Error('邮箱格式不正确!'));
      }
      this.emailBool=true;
      callback();
  };
  // 经销商Id验证
  const validateId = (rule, value, callback) => {
    let val=this.addData.id;
      if (val === ''||val===undefined) {
        this.idBool=false;
         return callback(new Error('请输入正确的经销商Id!'));
      }
      this.idBool=true;
      callback();
  };
  // // 企业地址验证
  const validateDealerAddress = (rule, value, callback) => {
      let val=this.addData.dealerAddress;
      if (val === ''||val===undefined) {
        this.dealerAddressBool=false;
         return callback(new Error('请输入正确的企业地址!'));
      }
        this.dealerAddressBool=true;
      callback();
  };
  // // 服务器IP验证
  const validateServiceIp = (rule, value, callback) => {
    let val=this.addData.serviceIp;
      if (val === ''||val===undefined) {
          this.serviceIpBool=false;
         return callback(new Error('请输入正确IP!'));
      }
          this.serviceIpBool=true;

      callback();
  };
  // // 服务器端口验证
  const validateServicePort = (rule, value, callback) => {
      let val=this.addData.servicePort;
      if (val === ''||val===undefined) {
        this.servicePortBool=false;
         return callback(new Error('请输入正确的服务器端口!'));
      }
        this.servicePortBool=true;

      callback();
  };
   return {
     lookBool:false,         //查看图层
     lookData:{
      "companyName": "",
      "companyNo": "",
      "dealerAddress": "",
      "dealerRole": "",
      "descriptions": "",
      "email": "",
      "enable": true,
      "fatherDealerId": "",
      "fatherDealerName": "",
      "fatherDealerNo": "",
      "id": "",
      "industry": "",
      "linkMan": "",
      "logo": "",
      "serviceIp": "",
      "servicePort": "",
      "timeZone": ""
     },

    // 新增
    companyNoBool:false,
    companyNameBool:false,
    linkManBool:false,
    emailBool:false,
    idBool:false,
    dealerAddressBool:false,
    serviceIpBool:false,
    servicePortBool:false,

    modalAdd:false,
    logo:'http://39.98.200.121/images/define.png',
    addData:{
      clientId: "",
      companyName: "",
      companyNo: "",
      dealerAddress: "",
      dealerRole: "",
      descriptions: "",
      email: "",
      enable: true,
      fatherDealerId: "",
      fatherDealerName: "",
      fatherDealerNo: "",
      id: "",
      industry: "",
      linkMan: "",
      secret: "",
      serviceIp: "",
      servicePort: "",
    },
    addDataTem:{
      clientId: "",
      companyName: "",
      // companyNo: "",
      dealerAddress: "",
      dealerRole: "",
      descriptions: "",
      email: "",
      enable: true,
      // fatherDealerId: "",
      // fatherDealerName: "",
      // fatherDealerNo: "",
      id: "",
      industry: "",
      linkMan: "",
      secret: "",
      serviceIp: "",
      servicePort: "",
    },
    ruleForm: {
      companyName: [
          {required: true, validator: validateDealer, trigger: 'blur' }
      ],
      companyNo: [
          {required: true, validator: validateDealerNo, trigger: 'blur' }
      ],
      linkMan: [
          { required: true, validator: validateLinkMan, trigger: 'blur' }
      ],
      email: [
          { required: true, validator: validateEmail, trigger: 'blur' }
      ],
      id: [
          {required: true, validator: validateId, trigger: 'blur' }
      ],
      dealerAddress: [
          {required: true, validator: validateDealerAddress, trigger: 'blur' }
      ],
      serviceIp: [
          {required: true, validator: validateServiceIp, trigger: 'blur' }
      ],
      servicePort: [
          {required: true, validator: validateServicePort, trigger: 'blur' }
      ]
    },


    

    // 上传图片
    actionUrl:'',
    defaultList: [
      {
          'name': 'trusttag.png',
          'url': 'http://39.98.200.121/images/trusttag.png'
      }
    ],
    imgName: '',
    visible: false,
    uploadList: [],


     modal1:false,
     modal2:false,
     companyTreeBool:false,
     batchDel:false,
     batchDelData:null,
     selectBool:false,
     treeBoolMenu:true,
    distributorTreeData: [
                    {
                        title: 'parent 1',
                        expand: true,
                        // companyNo:'',
                        menuNo:'',
                        id:'',
                        companyName:'',
                        render: (h, { root, node, data }) => {
                            return h('span', {
                                style: {
                                    display: 'inline-block',
                                    width: '100%'
                                }
                            }, [
                                h('span', [
                                    h('span',data.title)
                                ]),
                                h('span', {
                                    style: {
                                        display: 'inline-block',
                                        // float: 'left',
                                        marginRight: '128px'
                                    }
                                }),
                                h('Button', {
                                props: Object.assign({},  {
                                  type: 'primary',
                                  size: 'small',
                                }),
                                style: {
                                  marginRight: '8px'
                                },
                                on: {
                                  click: () => { 
                                      this.lookBool=true;
                                      getDealerInfoById({
                                        id:data.id
                                      }).then((res)=>{
                                        this.lookData=res.data;
                                      })
                                    }
                                }
                              }, '查看'),
                                h('Button', {
                                props: Object.assign({},  {
                                  type: 'primary',
                                  size: 'small',
                                }),
                                style: {
                                  marginRight: '8px'
                                },
                                on: {
                                  click: () => { 
                                      this.modalAdd=true;
                                      this.addDealer(data)
                                    }
                                }
                              }, '新增'),
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
                      key: 'roleNo'
                  },
                  {
                      title: '角色名称',
                      key: 'roleName'
                  },
                  {
                      title: '操作',
                      slot: 'action',
                      width: 180,
                      align: 'center'
                  }
              ],
   
   }
  },
 
  created() {
  },

  mounted(){
    this.getTree();
    this.$Message.config({
      top: 20,
      duration: 4
    });
  },
  methods:{
    // iview验证
    handleSubmit (name) {
      this.$refs[name].validate((valid) => {
          if (valid) {
              this.$Message.success('Success!');
          } else {
              this.$Message.error('Fail!');
          }
      })
    },
    // iview验证
    handleReset (name) {
        this.$refs[name].resetFields();
    },
    lookOk(){
      this.lookBool=false;
    },
    getTree(has){
      if(has){
        modifyDealer().then((res)=>{
          this.distributorTreeData[0].title=res.data.companyName;
          this.distributorTreeData[0].companyNo=res.data.companyNo;
          this.distributorTreeData[0].id=res.data.id;
          this.distributorTreeData[0].fatherDealerId=res.data.id;
          this.distributorTreeData[0].fatherDealerNo=res.data.companyNo;
          this.distributorTreeData[0].children=this.getchildren(res.data.childDealer);
        })
      }else{
        getDealerTree().then((res)=>{
          this.distributorTreeData[0].title=res.data.companyName;
          this.distributorTreeData[0].companyNo=res.data.companyNo;
          this.distributorTreeData[0].id=res.data.id;
          this.distributorTreeData[0].fatherDealerId=res.data.id;
          this.distributorTreeData[0].fatherDealerNo=res.data.companyNo;
          this.distributorTreeData[0].children=this.getchildren(res.data.childDealer);
        })
      }
    
    },
    getchildren (data) {
      const redata = [];
      for(let i=0,len=data.length;i<len;i++){
        let dx={
          title:'',
          expand:true,
          id:'',
          companyNo:'',
          children:[]
        }
        dx.title=data[i].companyName;
        dx.id=data[i].id;
        dx.companyNo=data[i].companyNo;
        if(!!data[i].childDealer){
          dx.children=this.getchildren(data[i].childDealer);
        }
        redata.push(dx);
      }
      return redata;
    },
    renderContent (h, { root, node, data }) {
      return h('span', {
          style: {
              display: 'inline-block',
              width: '100%',
              textAlign:'left'
          }
      }, [
          h('span', [
              h('span',data.title)
          ]),
          h('span', {
              style: {
                  display: 'inline-block',
                  // float: 'right',
                  marginLeft: '10%'
              }
          }, [
              h('Button', {
                props: Object.assign({},  {
                  type: 'primary',
                  size: 'small',
                }),
                style: {
                  marginRight: '8px'
                },
                on: {
                  click: () => { 
                      this.lookBool=true;
                      getDealerInfoById({
                        id:data.id
                      }).then((res)=>{
                        this.lookData=res.data;
                      })
                    }
                }
              }, '查看'),
          ])
      ]);
  },
  
  addDealer(data){
    this.addData={};
    this.addData.fatherDealerName=data.title;
    this.addData.fatherDealerId=data.fatherDealerId;
    this.addData.fatherDealerNo=data.fatherDealerNo;
  },
  changeEnable(bool){
    this.addDealer.enable=bool;
  },
  doBlur(value,type){
    let _this=this;
    if(type==='ip'){
      if(!V.validate(value,'ip')){
        _this.$Message.info('您的服务器IP格式不正确!');
        return true;
      }
    }
    if(type==='port'){
      if(!V.validate(value,'port')){
        _this.$Message.info('您的服务器端口不正确!');
        return;
      }
    }
    if(type==='email'){
      if(!V.validate(value,'email')){
        _this.$Message.info('您的Email邮箱不正确!');
        return;
      }
    }
  },
  valiData(type){
    let _this=this;
    let param={};
    param=_this.addData;
    if(type==='ip'){
      if(!V.validate(param.serviceIp,'ip')){
        _this.$Message.info('您的服务器IP格式不正确!');
        return true;
      }
    }
    if(type==='port'){
      if(!V.validate(param.servicePort,'port')){
        _this.$Message.info('您的服务器端口不正确!');
        return;
      }
    }
  },
  concelAddFun(){
    this.modalAdd=false;
  },
  confirmAddFun(){
    if(
      this.companyNameBool&&this.companyNoBool&&this.linkManBool&&this.emailBool&&this.idBool&&this.dealerAddressBool&&
      this.serviceIpBool&&this.serviceIpBool
    ){
      let param={};
      param=this.addData;
      this.modalAdd=false;
      saveDealerInfo(param).then(res=>{
        if(res.code==='200'){
          this.$Message.info('新增经销商成功!');
          this.getTree.bind(this)();
        }
      })
      return;
    }
    this.$Message.info('信息填写不正确或不完整或未修改,请检查！')
  },
  okAdd(){
    let _this=this;
    let param={};
    param=this.addData;

    saveDealerInfo(param).then(res=>{
      if(res.code==='200'){
        this.$Message.info('新增经销商成功!');
        this.getTree.bind(this)();
      }
    })
  },
  cancelAdd(){

  },
    choiceCompany(){

    },
    // 点击更新
    updateM(){
      modifyDealer().then(res=>{
        if(res.code==='200'){
          this.$Message.info('经销商信息更新成功!');
          this.getTree.bind(this)('ok');
        }
      })
    },
    doBottom(who){
      if(who==='dao'){
        
      }
    },
    // 转化显示的数据
    changeShowMenuStructure(resData,newData){
     for(let i=0,len=resData.length;i<len;i++){
       //  添加属性
       newData[i]={};
       newData[i].title=resData[i].menuName;
       newData[i].expand=true;
       newData[i].ff='54'
       if(!!resData[i].childMenu){
         newData[i].children=[]
         this.changeShowMenuStructure(resData[i].childMenu,newData[i].children)
       }
     }
     return newData
    },
    // 转化转化后的数据
    changeTransformMenuStructure(resData,num){
     for(let i=0,len=resData.length;i<len;i++){
       //  添加属性
       if(i===2){
         i=1;
       }
       if(resData[i].menuId==='4656'){
         alert(resData)
       }
       resData[i].index=num;
       num++;
       if(resData[i].menuId=='6543'){
       }
       if(!!resData[i].childMenu){
        this.changeTransformMenuStructure(resData[i].childMenu,num)
       }
     }

     return resData
    },

    append (data) {
        const children = data.children || [];
        children.push({
            title: 'appended node',
            expand: true
        });
        this.$set(data, 'children', children);
    },
    remove (root, node, data) {
        const parentKey = root.find(el => el === node).parent;
        const parent = root.find(el => el.nodeKey === parentKey).node;
        const index = parent.children.indexOf(data);
        parent.children.splice(index, 1);
    }
  }
    
}
</script>

<style lang='stylus' scoped>
  #role-management >>> .ivu-form .ivu-form-item-label{
    padding-right:20px !important;
  }
#menu-management >>> .ivu-tree ul li span:nth-child(2):hover{
  background #cae7ff
} 
#menu-management >>> .ivu-tree ul li span{
  padding 4px
  border-radius 4px
}
  #role-management
    .button-group
      overflow hidden
      margin 26px 0
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
    .content
      & /deep/ .ivu-tree ul
        text-align : left ;
        font-size:12px
    & /deep/ .ivu-form-item
      margin-bottom 0
  .fix-wrapper
    padding 0 2.8rem
    & /deep/ .ivu-form-item-content
      margin-left 100px
    & /deep/ .ivu-form-item
      margin-bottom 23px
    .modal-new
      display flex
      align-items center
      justify-content left
      margin 6px 0
      

      label 
        font-size 14px
        width 7rem
        color #8590a6
      input
        font-size 15px
        padding 6px 0
        border-bottom 1px solid #00000052;
      .default
        // border-color #c5c8ce
        border 1px solid #c5c8ce
        color #c5c8ce
        cursor no-drop
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
            padding: 0.315rem 0.8rem;
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
 .demo-upload-list{
        display: inline-block;
        width: 60px;
        height: 60px;
        text-align: center;
        line-height: 60px;
        border: 1px solid transparent;
        border-radius: 4px;
        overflow: hidden;
        background: #fff;
        position: relative;
        box-shadow: 0 1px 1px rgba(0,0,0,.2);
        margin-right: 4px;
    }
    .demo-upload-list img{
        width: 100%;
        height: 100%;
    }
    .demo-upload-list-cover{
        display: none;
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        background: rgba(0,0,0,.6);
    }
    .demo-upload-list:hover .demo-upload-list-cover{
        display: block;
    }
    .demo-upload-list-cover i{
        color: #fff;
        font-size: 20px;
        cursor: pointer;
        margin: 0 2px;
    }
    // 样式穿透
    .ivu-form-item{
      margin-bottom:0px
    }

    .ivu-form-item-content{
      margin-left:100px
    }

      
</style>
