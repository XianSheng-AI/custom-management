<template>
    <Breadcrumb>
        <BreadcrumbItem :to="{path:item.path}" 
        v-for="item in breadList" :key="item.path">
            {{ item.meta.title }}
        </BreadcrumbItem>
    </Breadcrumb>
</template>

<script>
export default {
  name:'',
  data(){
   return {
    breadList: []
   }
  },
  created () {
         this.getBreadcrumb()
  },
  mounted(){

  },
   watch: {
         $route () {
             this.getBreadcrumb()
         }
     },
  methods:{
      getBreadcrumb(){
          let matched = this.$route.matched.filter(item => item.name);
          this.breadList = matched
      }
  },
  
}
</script>

<style scoped>

</style>
