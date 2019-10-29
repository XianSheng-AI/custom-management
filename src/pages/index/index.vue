<template>
    <div class="wrapper">
        <header class="header">
            <div class="logo-wrapper">
                <div class="logo">logo</div>
            </div>
            
            <div class="internationalize">
                <Select v-model='model1' style="width:100px">
                    <Option v-for="item in cityList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>
            </div>
            <div id="sign-out" @click="signOut">
                    <svgicon iconClass="icon-tuichu2" class="out-svg"></svgicon>
            </div>
        </header>
        <div class="body-wrapper">
            <div class="menu-wrapper">
            <Menu class="line" :theme="theme2">
                    <Submenu :name="item.menuNo" v-for="(item,index) in menuData" :key="index">
                        <template slot="title">
                            <svgicon iconClass="icon-suoyoukehu" class="do-icon-com"></svgicon>
                            {{item.menuName}}
                        </template>
                        <router-link v-for="(ite,ind) in item.children" :to="ite.menuUrl" :key="ind" class="link-com">
                            <MenuItem :name="ite.menuNo">
                                {{ite.menuName}}
                            </MenuItem>
                        </router-link>
                    </Submenu>
                </Menu>
            </div>
            <div class="containner">
                <div class="containner-top">
                    <div class="breadcrumb">
                        <MyBreadcrumb></MyBreadcrumb>
                    </div>
                    <!-- 面包屑导航右边 -->
                </div>
                <router-view></router-view>
            </div>

        </div>
        <!-- 退出账户提示 -->
        <Modal
          width="332"
          v-model="logOutBool"
          title="退出账户警告"
          @on-ok="okOut"
          @on-cancel="cancelOut">
          <div>您确定要退出账号吗??</div>
        </Modal>
       
    </div>
</template>
<script>

import MyBreadcrumb from '@/components/breadcrumb/breadcrumb.vue'
// import { Submenu,Menu,MenuItem } from 'iview'
import {logOut,getMenuList,getAllMenuList} from '@/request/api';
import storage from '@/util/storage';
import base from '../../request/env';
import axios from 'axios'


export default {
    name:'index',
    data(){
        return {
            theme2: 'dark',
            logOutBool:false,
            cityList: [
                {
                    value: 'zhonguo',
                    label: '中国'
                },
                {
                    value: 'London',
                    label: 'London'
                },
                {
                    value: 'Sydney',
                    label: 'Sydney'
                },
                {
                    value: 'Ottawa',
                    label: 'Ottawa'
                },
                {
                    value: 'Paris',
                    label: 'Paris'
                },
                {
                    value: 'Canberra',
                    label: 'Canberra'
                }
            ],
            model1: 'zhonguo',
            menuData:[]
        }
    },
    components:{
        MyBreadcrumb
    },
    methods:{
        signOut(){
            this.logOutBool=true;
        },
        okOut(){
            let access_token=storage.getSession('access_token');
            let url=base.baseURL+'/oauth/token?access_token='+access_token;
           return axios.delete(url, {
            params: null,
            headers: {
                'Access-Control-Allow-Origin':'*',
                'Access-Control-Allow-Methods': 'PUT,POST,GET,DELETE,OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type,Content-Length, Authorization, Accept,X-Requested-With',
                'cache-control':'no-cache'
                }//设置header信息
            }).then((res) => {
                if(res.data='注销成功'){
                    this.$router.push({path:'/login'});
                }
            })
        },
        cancelOut(){

        },
        initMenu(){
            getMenuList().then(res=>{
                if(res.code==='200'){
                    this.menuData=res.data;
                }
            })
        }
    },
    created(){
        this.initMenu();
    }
}
</script>
<style lang="stylus" scoped>
.body-wrapper
    width :100%;
    height:100%;
    // background red;
    display flex;
    justify-content center
    &:after
        content: ".";
        clear: both;
        display: block;
        overflow: hidden;
        font-size: 0;
        height: 0;

.wrapper
    width 100%
    height 100%
    overflow hidden
    background-color #f6f6f673
    .header
        width 100%;
        height 80px;
        background-color #ffffff 
        box-sizing border-box
        // overflow hidden
        position relative
        .logo-wrapper
            background #495164 
            float left
            width 240px
            text-align center
            .logo
                width 100%
                height 80px
                color #ffffff
                font-size 33px
                line-height 80px
        .internationalize
            position absolute
            right 10%
            top 30%
        #sign-out
            z-index 1000
            position absolute
            right 3%
            top 27%
            
            background #ffffff42
            padding 2px
            margin-left -16px
            border-radius 20px
            cursor pointer
            transition .3s
            &:hover
                background #515a6e2e
            .out-svg
                font-size 2rem
    .menu-wrapper
        position relative
        height 100%
        .line
            height 888px
            .link-com
                position relative
                // .icon-com
                //     position absolute
                //     left 28%
        
    .containner
        width 88.4%
        height 872px
        padding-left 20px
        // padding 0 0 0 20px
        // margin 0 0 0 20px
        .containner-top
            background-color #f6f6f673
            overflow hidden
            .breadcrumb
                padding 14px 0
                float left
                font-size 12px

</style>

