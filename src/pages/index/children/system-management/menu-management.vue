<template>
  <div id="menu-management" style="width:27%">
    <Tree id="treeEl" :data="data5" :render="renderContent"></Tree>
    <Modal width="360" draggable v-model="saveMenuBool" title="添加菜单" @on-ok="okSave" @on-cancel="cancelSave">
      <!-- 添加菜单 -->
        <div class="fix-wrapper">
          <Form v-model="saveMenuData" :rules="ruleForm">
            <FormItem label="菜单图标" prop="iconPath">
              <Input type="text" name="new" v-model="saveMenuData.iconPath"></Input>
            </FormItem>
            <FormItem label="菜单编码" prop="menuNo">
              <Input type="text" name="new" v-model="saveMenuData.menuNo"></Input>
            </FormItem>
            <FormItem label="菜单名称" prop="menuName">
              <Input type="text" name="new" v-model="saveMenuData.menuName"></Input>
            </FormItem>
            <FormItem label="上级菜单信息" prop="higherLevelName">
              <Input type="text" name="new" v-model="saveMenuData.higherLevelName" readonly></Input>
            </FormItem>
            <FormItem label="菜单URL" prop="menuUrl">
              <Input type="text" name="new" v-model="saveMenuData.menuUrl" ></Input>
            </FormItem>
            <FormItem label="是否有效" prop="checked">
              <div class="modal-new">
                <i-Switch size="large" @on-change="changeFixEnable" v-model="checked">
                  <span slot="open" checked>有效</span>
                  <span slot="close">无效</span>
                </i-Switch>
              </div>
            </FormItem>
            <FormItem label="备注" prop="checked">
              <textarea style="border: 1px solid #dcdee2;border-radius:6px;width:100%" name="" id="" cols="30" rows="2"></textarea>
            </FormItem>
          </Form>
        </div>
        <div slot="footer">
            <Button type="text" @click="concelFun">取消</Button>
            <Button type="primary" @click="confirmFun">确定</Button>
        </div>
      <!-- </Modal> -->
    </Modal>
    <!-- 编辑菜单信息 -->
    <Modal width="360" draggable v-model="saveMenuEdtorBool" title="编辑菜单信息">
      <!-- 编辑菜单 -->
        <div class="fix-wrapper">

          <Form v-model="saveMenuEdtorData" :rules="ruleEditForm"  >
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
          </Form>
        </div>
        <div slot="footer">
            <Button type="text" @click="concelEditFun">取消</Button>
            <Button type="primary" @click="confirmEditFun">确定</Button>
        </div>
    </Modal>
    <!-- 点击单个删除按钮 -->
    <Modal width="332" draggable v-model="modalDel" title="删除菜单警告" @on-ok="okDel" @on-cancel="cancelDel">
      <div>您确定删除此菜单吗??</div>
    </Modal>
  </div>
</template>

<script>
import {
  getDeptPageInfo,
  getDeptList,
  getMenuById,
  getMenuPageInfo,
  getAllMenuList,
  saveMenu,
  deleteMenuId,
  getMenuByNo
} from "@/request/api";
import Storage from "@/util/storage";
export default {
  data() {
     // 菜单编码验证
    const validateMenuNo = async (rule, value, callback) => {
      let val=this.saveMenuData.menuNo;
      let fl=this.addMenuNoBool;   //false
      if (val === ''||val===undefined) {
        this.addMenuNoBool=false;
        return callback(new Error('菜单编码不能为空!'));
      }
      await getMenuByNo({menuNo:val}).then(res=>{
        if(res.data){
          this.addMenuNoBool=false;
          return callback(new Error('菜单编码重复!'));
        }
      })
      this.addFlag=true;
      this.addMenuNoBool=true;
      callback();
    };
     // 菜单名称验证
    const validateMenuName = (rule, value, callback) => {
      let val=this.saveMenuData.menuName;
      let fl=this.addMenuNameBool;   //false
      if (val === ''||val===undefined) {
        this.addMenuNameBool=false;
        return callback(new Error('菜单名称不能为空!'));
      }
      this.addMenuNameBool=true;
      callback();
    };
     // 菜单URL验证
    const validateMenuUrl = (rule, value, callback) => {
      let val=this.saveMenuData.menuUrl;
      let fl=this.addMenuUrlBool;   //false
      if (val === ''||val===undefined) {
        this.addMenuUrlBool=false;
        return callback(new Error('菜单URL不能为空!'));
      }
      this.addMenuUrlBool=true;
      callback();
    };

    // 菜单编辑
    // 菜单编码验证
    const validateEditMenuNo = async (rule, value, callback) => {
      let val=this.saveMenuEdtorData.menuNo;
      let fl=this.editMenuNoBool;   //false
      if (val === ''||val===undefined) {
        this.editMenuNoBool=false;
        return callback(new Error('菜单编码不能为空!'));
      }
      await getMenuByNo({menuNo:val}).then(res=>{
        if(res.data){
          this.editMenuNoBool=false;
          return callback(new Error('菜单编码重复!'));
        }
      })
      this.editMenuNoBool=true;
      callback();
    };
     // 菜单名称验证
    const validateEditMenuName = (rule, value, callback) => {
      let val=this.saveMenuEdtorData.menuName;
      let fl=this.editMenuNameBool;   //false
      if (val === ''||val===undefined) {
        this.editMenuNameBool=false;
        return callback(new Error('菜单名称不能为空!'));
      }
      this.editMenuNameBool=true;
      callback();
    };
     // 菜单URL验证
    const validateEditMenuUrl = (rule, value, callback) => {
      let val=this.saveMenuEdtorData.menuUrl;
      let fl=this.editMenuUrlBool;   //false
      if (val === ''||val===undefined) {
        this.editMenuUrlBool=false;
        return callback(new Error('菜单URL不能为空!'));
      }
      this.editMenuUrlBool=true;
      callback();
    };
    

    
    return {
      addMenuNoBool:false,
      addMenuNameBool:false,
      addMenuUrlBool:false,

      editMenuNoBool:false,
      editMenuNameBool:false,
      editMenuUrlBool:false,



      addFlag:false,
      editFlag:false,
      // 保存菜单
      saveMenuData: {
        descriptions: "",
        enable: true,
        higherLevelName: "",
        higherLevelNo: "",
        iconPath: "",
        menuName: "",
        menuNo: "",
        menuUrl: ""
      },
      saveMenuDataTem: {
        descriptions: "",
        enable: true,
        iconPath: "",
        menuName: "",
        menuNo: "",
        menuUrl: ""
      },
      flag:true,
      // 添加菜单
      ruleForm: {
        menuNo: [
            {required: true, validator: validateMenuNo, trigger: 'blur' }
        ],
        menuName: [
            {required: true, validator: validateMenuName, trigger: 'blur' }
        ],
        menuUrl: [
            {required: true, validator: validateMenuUrl, trigger: 'blur' }
        ],
      },
      // 编辑菜单
      ruleEditForm:{
        menuNo: [
            {required: true, validator: validateEditMenuNo, trigger: 'blur' }
        ],
        menuName: [
            {required: true, validator: validateEditMenuName, trigger: 'blur' }
        ],
        menuUrl: [
            {required: true, validator: validateEditMenuUrl, trigger: 'blur' }
        ],
      },

      formCustom: {
        title: "",
        expand: true
      },
      ruleCustom: {
        title: [
          {
            required: true,
            message: "The name cannot be empty",
            trigger: "blur"
          }
        ]
      },
      // 删除菜单
      modalDel: false,
      delData: {
        menuId: ""
      },
      // 添加菜单
      saveMenuBool: false,
      saveMenuData: {},
      selectData: "0101010",
      saveMenuEdtorData: {
      descriptions: "",
      enable: true,
      higherLevelName: "",
      higherLevelNo: "",
      iconPath: "",
      menuName: "",
      menuNo: "",
      menuUrl: ""
      },
      checked:true,
      // 修改菜单
      modalFix:false,
      saveMenuEdtorBool:false,

      data5: [
        {
          // title: 'parent 1',
          expand: true,
          iconName: "icon-shouye1",
          menuId: "402809816a42a72d016a42bc0f900002",
          menuName: "首页",
          menuNo: "custorm_001",
          menuUrl: null,
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
                h("span", [h("span", data.title)]),
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
      buttonProps: {
        type: "default",
        size: "small"
      },
      dataTrue: [
        {
          childMenu: [
            {
              childMenu: [{}],
              descriptions: "",
              enable: true,
              fatherMenu: {},
              iconPath: "",
              menuId: "",
              menuName: "",
              menuNo: "",
              menuUrl: ""
            }
          ],
          descriptions: "",
          enable: true,
          fatherMenu: {},
          iconPath: "",
          menuId: "",
          menuName: "",
          menuNo: "",
          menuUrl: ""
        }
      ]
    };
  },
  mounted() {
    this.initMenu();
  },
  methods: {
    initMenu() {
      getAllMenuList().then(res => {
        this.$set(
          this.data5[0],
          "children",
          this.$options.methods.getchildren(res.data)
        );
      });
    },
    // 转换显示树结构
    getchildren(data,father) {
      const redata = [];
      for (let i = 0, len = data.length; i < len; i++) {
        let dx = {
          title: "",
          expand: true, 
          iconName: "icon-shouye1",
          menuId: "402809816a42a72d016a42bc0f900002",
          menuName: "首页",
          menuNo: "custorm_001",
          menuUrl: null,
          children: []
        };
        if(!!father){
          dx.higherLevelName=father.higherLevelName;
          dx.higherLevelNo=father.higherLevelNo;
        };
        dx.title = data[i].menuName;
        dx.descriptions=data[i].descriptions;
        dx.menuName=data[i].menuName;
        dx.menuId = data[i].menuId;
        dx.menuNo = data[i].menuNo;
        dx.menuUrl = data[i].menuUrl;
        dx.iconName = data[i].iconName;
        if (data[i].children.length>0) {
          let father={};
          father.higherLevelName=data[i].menuName;
          father.higherLevelNo=data[i].menuNo;
          dx.children = this.getchildren(data[i].children,father);
        }
        redata.push(dx);
      }
      return redata;
    },
    ok() {
      const children = this.selectData.children || [];
      children.push({
        title: this.formCustom.title,
        expand: this.formCustom.expand
      });
      this.$set(this.selectData, "children", children);
      this.$refs.clearText.value = "";
    },
    onKeyuserNameInput: function(event) {
      let a = (this.title = event.target.value);
      this.formCustom.title = a;
    },
    cancel() {},
    renderContent(h, { root, node, data }) {
      return h(
        "span",
        {
          style: {
            display: "inline-block",
            width: "100%",
            textAlign: "left"
          }
        },
        [
          h("span", [
            h(
              "span",
              {
                style: {
                  float: "left"
                }
              },
              data.title
            )
          ]),
          h(
            "span",
            {
              style: {
                display: "inline-block",
                float: "right",
                marginRight: "32px"
              }
            },
            [
              h(
                "Button",
                {
                  props: Object.assign(
                    {},
                    {
                      type: "primary",
                      size: "small"
                    }
                  ),
                  style: {
                    marginRight: "8px"
                  },
                  on: {
                    click: () => {
                      this.albumCategoryAdd(data);
                    }
                  }
                },
                "添加"
              ),
              h(
                "Button",
                {
                  props: Object.assign(
                    {},
                    {
                      type: "primary",
                      size: "small"
                    }
                  ),
                  style: {
                    marginRight: "8px"
                  },
                  on: {
                    click: () => {
                      this.albumCategoryEdit(data);
                    }
                  }
                },
                "编辑"
              ),
              h(
                "Button",
                {
                  props: Object.assign(
                    {},
                    {
                      type: "primary",
                      size: "small"
                    }
                  ),
                  style: {
                    marginRight: "8px"
                  },
                  on: {
                    click: () => {
                      this.modalDel = true;

                      this.delMenu(data);
                    }
                  }
                },
                "删除"
              )
            ]
          )
        ]
      );
    },
    confirmFun(){
      if(this.addMenuNoBool&&this.addMenuNameBool&&this.addMenuUrlBool){
        saveMenu(this.saveMenuData).then(res => {
          if (res.code === "200") {
            this.saveMenuBool=false;
            this.$Message.info('保存成功!');
            this.initMenu.bind(this)();
          }
        });
        return;
      }
      this.$Message.info('信息未填写正确或不完整或未修改,请检查!');
    },
    concelFun(){
      this.saveMenuBool=false;
    },
    confirmEditFun(){
      // editMenuNoBool:false,
      // editMenuNameBool:false,
      // editMenuUrlBool:false,
      if(this.saveMenuEdtorData.menuNo){
        this.editMenuNoBool=true;
      }
      if(this.saveMenuEdtorData.menuName){
        this.editMenuNameBool=true;
      }
      if(this.saveMenuEdtorData.menuUrl){
        this.editMenuUrlBool=true;
      }
      if(this.editMenuNoBool&&this.editMenuNameBool&&this.editMenuUrlBool){
        saveMenu(this.saveMenuData).then(res => {
          if (res.code === "200") {
            this.saveMenuEdtorBool=false;
            this.$Message.info('编辑成功!');
            this.initMenu.bind(this)();
          }
        });
        return;
      }
      this.$Message.info('信息未填写正确或不完整或未修改,请检查!');
      
    },
    concelEditFun(){
      this.saveMenuEdtorBool=false;
    },
    // 确认修改
    okFix(){
      
    },
    // 取消修改
    cancelFix(){

    },
    // 点击菜单删除
    delMenu(data) {
      this.delData.menuId = data.menuId;
    },
    // 确认删除菜单
    okDel() {

      let param = {};
      let _this=this;
      param.menuId = this.delData.menuId;
      deleteMenuId(param).then(res=>{
        if(res.code==='200'){
          _this.$Message.info('菜单删除成功!');
          _this.initMenu.bind(_this)();
        }
      })
    },
    // 取消删除菜单
    cancelDel() {},

    // 切换是否有效
    changeFixEnable(bool){
      this.saveMenuData.enable=bool;
      this.saveMenuEdtorData.enable=bool;
    },

    albumCategoryAdd(data) {
      this.saveMenuData=this.saveMenuDataTem;
      this.saveMenuData.higherLevelNo=data.higherLevelNo
      let param = {};
      let da=this.saveMenuData
      this.$set(da,'higherLevelName',data.higherLevelName);
      param.enable = true;
      this.saveMenuBool = true;
      this.selectData = data;
    },
    okSave() {
      saveMenu(this.saveMenuData).then(res => {
        if (res.code === "200") {
          this.$Message.info('保存成功!');
          this.initMenu.bind(this)();
        }
      });
    },
    cancelSave() {},
    albumCategoryEdit(data) {
      this.saveMenuEdtorBool = true;
      let da={};
      da.menuId=data.menuId;
      getMenuById(da).then(res=>{
        this.saveMenuEdtorData=res.data
        this.saveMenuData=res.data
      })
      

      let param={};
      
      param.descriptions=data.descriptions;
      param.enable=data.enable;
      param.higherLevelName = data.higherLevelName;
      param.higherLevelNo = data.higherLevelNo;
      param.iconPath = data.iconPath;
      param.menuId = data.menuId;
      param.menuName = data.menuName;
      param.menuNo = data.menuNo;
      param.menuUrl = data.menuUrl;
      this.saveMenuEdtorData=param;
      this.saveMenuData=param;
      
    },

    changeFixEdtorEnable(bool){
      this.saveMenuData.enable=bool;
    }
  }
};
</script>
<style scoped lang="stylus">
  #treeEl >>> .ivu-tree-arrow{
    transform: translate(-8px,-10px)
  }


    
    
#menu-management >>> .ivu-tree ul li span:nth-child(2):hover{
  background #cae7ff
} 
#menu-management >>> .ivu-tree ul li span{
  padding 4px
  border-radius 4px
}
  .fix-wrapper
    .modal-new
      display flex
      align-items center
      justify-content left
      margin 26px 0
      .menu-url
        display inline-block
        width 36px
        height 36px
        background #2d8cf0
      label 
        font-size 14px
        width 6rem
        color #8590a6
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
              min-width 140px 
              max-width 200px
            .set-com-choose-svg
              display: inline-block
              .svg-icon
                font-size 1.2rem
</style>
