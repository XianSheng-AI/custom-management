<template>
  <div class="hide--box" :class="{'show':comObj.showFlag}">
    <div class="hide-empty">
      <div class="hide-list">
        <div class="hide-list-item">
          <vue-scroll :ops="ops">
            <span class="edu-type"
                  v-for="item in initSelectData_account.data"
                  :key="item.roleNo"
                  @click="responseMethod(item)"
            >{{item.roleName}}</span>
          </vue-scroll>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
    export default {
        props:{
          initSelectData_account:{
            type: Object
          }
        },
        name: "Select-Box-role",
        data() {
            return {
              ops: {
              },
              comObj:{
                showFlag:false
              }
            }
        },
        methods:{
          change(){
            let obj={};
            for(let i=0,len=this.initSelectData_account.data.length;i<len;i++){
            }
          },
          repeatControl(){
            this.$set(this.comObj,'showFlag',!this.comObj.showFlag)
          },
          responseMethod(item){
            this.$set(this.comObj,'showFlag',!this.comObj.showFlag);
            this.$emit('reciveMe',item)
          }
        }
    }
</script>

<style lang="stylus" scoped>
  .hide--box
    z-index: 100
    color: #8590a6
    position: absolute;
    top 2.6rem
    left 0
    background: #fff;
    border: 1px solid #ebebeb;
    border-radius: 4px;
    box-shadow: 0 5px 20px rgba(26,26,26,.1);
    box-sizing border-box
    width: 100%
    overflow: hidden
    visibility: hidden
    opacity:0
    transition opacity .2s ease-out
    &.show
      visibility: visible
      opacity:1
      max-height 10rem
    .hide-empty
      padding:.5rem 0
      .hide-list
        .hide-list-item
          .edu-type
            width: inherit
            display: block
            padding:.6rem 1.4rem
            cursor: pointer;
            font-size 15px
            &:hover
              background: #f6f6f6
</style>
