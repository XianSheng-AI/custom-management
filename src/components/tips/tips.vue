<template>
  
    <div class="tips" :class="{'active':initstyle.color}">
      <div class="wrapper">
        <div class="containner">
           <transition name="fade">
            <h2 class="text"
              :style="{ background: initstyle.bg_color,color:initstyle.color}"
            >{{ tipsMsg.text }}</h2>
           </transition>
        </div>
      </div>
      <!-- 装饰 -->
      <!-- <div class="decorate">
        <div class=""></div>
      </div> -->
    </div>
 
</template>

<script>
export default {
// blue------通过
// orange----请输入。。
// red-------账号或密码不正确/验证码不正确/不足6位数
  name:'',
  props:['tipsMsg'],
  data(){
   return {
     initstyle:{
       color:'',
       bg_color:''
     },
     success:{
       color:'#67c23a',
       bg_color:'#f0f9eb'
     },
     warning:{
       color:'#E6A23C',
       bg_color:'#ffecd8'
     },
     error:{
       color:'#F56C6C',
       bg_color:'#fef0f0'
     }
   }
  },
  methods:{
    initTips(){
      let tips=this.tipsMsg;
      if(tips){
        if(tips.typed==='w'){
          this.initstyle=this.warning;
        };
        if(tips.typed==='s'){
          this.initstyle=this.success;
        };
        setTimeout(()=>{this.initstyle={color:'',bg_color:''}},2000)
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
  .tips
    position absolute
    left 50%
    top 10%
    margin-left -112px
    transition .4s
    opacity 0
    &.active
      // transition 4s
      transform translateY(20px)
      opacity 1
    .wrapper
      .containner
        text-align center
        .text
          font-size 15px
          padding 16px 50px
          border-radius 10px
          color #67c23a
          box-shadow: 6px 6px 10px rgba(0,0,0,0.4)
          
</style>
