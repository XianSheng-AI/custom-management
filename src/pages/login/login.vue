<template>
    <div id="login">
        <div class="lo-wrapper">
            <div class="lo-box">
                <!-- 装饰 decorate -->
                <div class="decorate-line">
                    <!-- left -->
                    <div class="line-com line-"></div>
                    <div class="line-com line--"></div>
                    <div class="line-com dot"></div>
                    <!-- right -->
                    <div class="line-com line2-"></div>
                    <div class="line-com line2--"></div>
                </div>
                <div class="lo-com lo-box-left">
                    
                    <div class="lo-icon">
                         <!-- <img src="" alt=""> -->
                         <div class="lo-icon-"></div>
                    </div>
                    <h1 class="lo-name">万物互联</h1>
                </div>
                <div class="lo-com lo-box-right">
                    <div class="lo-form-wrapper">
                        <div class="form-com">
                            <span class="form-label">账号</span>
                            <input class="input-com form-account" type="text"
                                v-model="form_data.username"
                            >
                        </div>
                        <div class="form-com">
                            <span class="form-label">密码</span>
                            <input class="input-com form-password" type="password"
                                v-model="form_data.password"
                            >
                        </div>
                        <div class="submit-btn" @click="login()">登录</div>
                    </div>
                </div>
    
            </div>
        </div>
        <tips :tips-msg="tips" ref="tips"></tips>
    </div>
</template>
<script>
import V from '@/util/validates'
import { apiLogin } from '../../request/api'
import storage from '@/util/storage';
import base from '../../request/env'
export default {
    name:'login',
    data(){
        return {
            tips:{
                text:'',
                typed:''
            },
            form_data:{
                username:'',
                password:'',
                vCode:'',
            }
        }
    },
    methods:{
    
        login(){
            
            if(!V.validate(this.form_data.username,'require')){
                this.tips.text='账号不能为空！';
                this.tips.typed='w';
                this.$refs.tips.initTips();
                
                return;
            }
            if(!V.validate(this.form_data.password,'require')){
                this.tips.text='密码不能为空！';
                this.tips.typed='w';
                this.$refs.tips.initTips();
                return;
            }
            if(!V.validate(this.form_data.password,'password')){
                this.tips.text='密码不能小于6位！';
                this.tips.typed='w';
                this.$refs.tips.initTips();
                return;
            }
           
            //  cb_zzl
            //  changshanzhaozl
            let this_=this;
            apiLogin({
                grant_type:'password',
                username:this.form_data.username,
                password:this.form_data.password,
            }).then(res=>{;
                
                this.$Message.info('登陆成功!');
                let {entries} = Object;
                for(let [key,value] of entries(res)){
                    storage.setSession(key,value);
                }
                for(let [key,value] of entries(this.form_data)){
                    storage.setSession(key,value);
                }
                this.$router.push({path:'/index'});
                // 存储登录token
            }).catch(err=>{
                if(err.error){
                    this_.$Message.info('账号或密码错误，请检查!');
                }
            })
            return;
        }
    }
}
</script>
<style lang="stylus" scoped>
#login
    width 100%
    height 968px
    background-image url('../../../static/images/login/login_bg.jpg')
    background-size cover
    position relative
    overflow hidden
    .lo-wrapper
        width 50%
        height 600px
        margin 10% auto
        .lo-box
            height 100%
            position relative
            .decorate-line
                .line-com
                    border-radius 13px
                    height 26px
                    position absolute
                    background-color #BFE3D7
                    box-shadow 12px 18px 10px rgba(0,0,0,.4)
                    z-index 1
                    &.line-
                        width 80px
                        left -8%
                        bottom 38%
                    &.line--
                        width 60px
                        left -4%
                        bottom 48%
                    &.dot
                        width 26px
                        height 26px
                        left  -10%
                        top 20%
                    &.line2-
                        background-color #ffffff
                        height 80px
                        width 26px
                        right 12%
                        top -12%
                    &.line2--
                        background-color #ffffff
                        width 26px
                        height 60px
                        right 4%
                        top -8%
            .lo-com
                z-index 1
                width 50%
                height 71%
                border-radius 10px
                box-shadow 12px 10px 10px rgba(0,0,0,.4)
                position relative
                &.lo-box-left
                    float left
                    background #BFE3D7 
                    .lo-icon
                        display block
                        .lo-icon-
                            width 140px
                            height 140px
                            background #54DBA0
                            margin 30% auto 10% 
                            border-radius 10px
                    .lo-name
                        color #54DBA0
                &.lo-box-right
                    background #ffffff
                    float right
                    .lo-form-wrapper
                        height 100px
                        width 68%
                        height 66%
                        margin 12% auto
                        .form-com
                            width 100%
                            border-bottom 1px solid rgba(0,0,0,.2)
                            .form-label
                                color rgba(0,0,0,.4)
                            .input-com
                                width 80%
                                height 50px
                                margin-top 8%
                                text-align center
                            &.validate-code
                                position relative
                                width 100%
                                .form-validate-code
                                    width 40%
                                    margin-left 6%
                                .code
                                    margin-top 6.6%
                                    width 82px
                                    height 46px
                                    float right
                                    background #54DBA0
                                    line-height 46px
                                    color #eeeeee
                                    border-radius 10px
                        .submit-btn
                            width 100%
                            height 50px
                            background #54DBA0
                            margin-top 16%
                            border-radius 10px
                            color #ffffff
                            line-height 50px
                            font-size 18px
                            cursor pointer

</style>

