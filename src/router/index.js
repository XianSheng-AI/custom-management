import Vue from 'vue'
import Router from 'vue-router'
// import HelloWorld from '@/components/HelloWorld'
import index from '@/pages/index/index'
import login from '@/pages/login/login'
// 经销商
import distributorInformation from '@/pages/index/children/Distributor/distributor-information'
import accountInformation from '@/pages/index/children/Distributor/account-information'

// 系统管理
import departmentManagement from '@/pages/index/children/system-management/department-management';
import userManagement from '@/pages/index/children/system-management/user-management';
import menuManagement from '@/pages/index/children/system-management/menu-management';
import roleManagement from '@/pages/index/children/system-management/role-management';
// 统计功能
//     需求更改     即将到期改为设备一览      删除 在线用户统计   用户使用分频次   留着  设备使用情况
// 设备管理
import onlineUserStatistics from '@/pages/index/children/Statistics/online-user-statistics'      // 在线用户统计
// import userUseFrequency from '@/pages/index/children/Statistics/user-use-frequency'              // 用户使用频次统计
import equipmentUsage from '@/pages/index/children/Statistics/equipment-usage'                   // 设备使用情况 
import expireSoonUser from '@/pages/index/children/Statistics/expire-soon-user'                  // 即将到期用户一览 
// import userUsageCount from '@/pages/index/children/user-usage-count';
// import expiryUsers from '@/pages/index/children/expiry-users';


import equipmentTypeManagement from '@/pages/index/children/Equipment-information-management/equipment-type-management';   //设备类型管理
import equipmentManagement from '@/pages/index/children/Equipment-information-management/equipment-management';       //设备管理
Vue.use(Router)


// 备忘录: 小图标使用新版QQ动态里的小图标
export default new Router({
  routes: [
    {
      path: '/',
      name: 'login',
      redirect:'login'
    },
    {
      path: '/index',
      name: 'index',
      meta:{
        title:'首页'
      },
      component: index,
      children:[
        {
          path:'',
          meta:{
            title:'设备管理'
          },
          redirect:'equipment-management'
        },
        {
          path:'distributor-information',
          name:'distributor-information',
          meta:{
            title:'经销商信息'
          },
          component: distributorInformation,
        },
        {
          path:'account-information',
          name:'account-information',
          meta:{
            title:'账号信息'
          },
          component: accountInformation,
        },
        {
          path:'department-management',
          name:'department-management',
          meta:{
            title:'部门管理'
          },
          component: departmentManagement,
        },
        {
          path:'user-management',
          name:'user-management',
          meta:{
            title:'用户管理'
          },
          component: userManagement,
        },
        {
          path:'role-management',
          name:'role-management',
          meta:{
            title:'角色管理'
          },
          component: roleManagement
        },
        {
          path:'menu-management',
          name:'menu-management',
          meta:{
            title:'菜单管理'
          },
          component: menuManagement
        },
        {
          path:'role-management',
          name:'role-management',
          meta:{
            title:'角色管理'
          },
          component: roleManagement
        },
        // {
        //   path:'online-user-statistics',
        //   name:'onlineUserStatistics',
        //   meta:{
        //     title:'在线用户统计'
        //   },
        //   component: onlineUserStatistics
        // },
        // {
        //   path:'user-use-frequency',
        //   name:'userUseFrequency',
        //   meta:{
        //     title:'用户使用频次统计'
        //   },
        //   component: userUseFrequency
        // },
        {
          path:'equipment-usage',
          name:'equipmentUsage',
          meta:{
            title:'设备使用情况'
          },
          component: equipmentUsage
        },
        {
          path:'expire-soon-user',
          name:'expireSoonUser',
          meta:{
            title:'即将到期用户一览'
          },
          component: expireSoonUser
        },
        {
          path:'equipment-type-management',
          name:'equipmentTypeManagement',
          meta:{
            title:'设备类型管理'
          },
          component: equipmentTypeManagement
        },
        {
          path:'equipment-management',
          name:'equipment-management',
          meta:{
            title:'设备管理'
          },
          component: equipmentManagement
        }
      ]
      
    },
    {
      path: '/login',
      name: 'login',
      component: login
    }
    
  ]
})
