// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import '../static/style/normalize.css'   //引入公共样式
import 'babel-polyfill'   //可使用ES6所有特性
import tips from './components/tips/tips'
//引入nprogress
import NProgress from 'nprogress'
import 'nprogress/nprogress.css' //这个样式必须引入
// import ElementUI from 'element-ui';
// import 'element-ui/lib/theme-chalk/index.css';
import '../static/icon/iconfont'
// import iView from 'iview';
import 'iview/dist/styles/iview.css';
import svgicon from '../src/components/svgicon/svgicon'
// import 'babel-polyfill'
import './util/storage'
import './iview/iview.js'
import VueScroll from 'vuescroll/dist/vuescroll-native';
import 'vuescroll/dist/vuescroll.css';
import '../vendor/Blob';
import '../vendor/Export2Excel';

// NProgress.inc(0.2)
// NProgress.configure({ easing: 'ease', speed: 500, showSpinner: false })

// import 'vue-scroll/dist/vue-scroll';
// Vue.use(VueScroll);
Vue.use(VueScroll, {
  // mode: 'native',
  ops: {
    vuescroll: {
      mode: 'native',
      sizeStrategy: 'percent',
    },
    scrollPanel: {
      scrollingX: false,
    },
    rail: {
      background: '#c8c4f4',
      opacity: 0,
      /** Rail's size(Height/Width) , default -> 6px */
      size: '6px',
    },
    bar: {
      background : '#b3b3b3',
      keepShow: false,
    }
  }, // 在这里设置全局默认配置
  name: 'vueScroll' // 在这里自定义组件名字，默认是vueScroll

});
// Vue.use(VueRouter);
// Vue.use(iView);

// The routing configuration
// const RouterConfig = {
//     routes: Routers
// };
// const router = new VueRouter(RouterConfig);

Vue.component('tips',tips);
Vue.component('svgicon',svgicon);
Vue.config.productionTip = false;
// Vue.use(ElementUI)
import {Message} from 'iview'
Vue.component('Message',Message);

Vue.prototype.$Message = Message
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
