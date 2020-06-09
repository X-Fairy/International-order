// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import App from './App'
import router from './router'
import store from './store';
import ViewUI from 'view-design';
import HeaderComponent from '@/components/header.vue';
import FooterComponent from '@/components/footer.vue';
import 'view-design/dist/styles/iview.css';
import '@/assets/style/index.less';
import 'echarts';
import ECharts from 'vue-echarts';
import BaiduMap from 'vue-baidu-map'
import VueAwesomeSwiper from 'vue-awesome-swiper'  // 引用左右轮播
import 'swiper/dist/css/swiper.css'
import scroll from 'vue-seamless-scroll'  // 引入上下轮播
Vue.use(scroll)
import CartPrice from '@/components/common/cart-price';
import locale from 'view-design/dist/locale/en-US';
// import zhLocale from 'iview/src/locale/lang/zh-CN';//导入iview中文语言包
// import enLocale from 'iview/src/locale/lang/en-US';//导入iview英文语言包
import zhLocale from 'view-design/src/locale/lang/zh-CN';//导入iview中文语言包
import enLocale from 'view-design/src/locale/lang/en-US';//导入iview英文语言包
import VueI18n from 'vue-i18n'
Vue.use(VueI18n)
Vue.use(ViewUI);
Vue.use(ElementUI)
import Vuelazyload from 'vue-lazyload'
Vue.use(Vuelazyload, {                 // 图片懒加载
  loading: require('@/assets/images/default2.jpg'),
  error: require('@/assets/images/default2.jpg')
})
import VideoPlayer from 'vue-video-player'
require('video.js/dist/video-js.css')
require('vue-video-player/src/custom-theme.css')
Vue.use(VideoPlayer) // 引入video视频

import VueClipboard from 'vue-clipboard2' // VUE 实现复制内容到剪贴板功能
Vue.use(VueClipboard)  // 复制插件

Vue.locale = () => {};
import '@/assets/style/icon/iconfont.css'
import {getCookie} from '@/assets/js/tool.js'
if (!localStorage.language) {
    localStorage.language = 'en';
}
const i18n = new VueI18n({
    locale: localStorage.language,    // 语言标识
    messages: {
        'zh': $.extend(true, {}, zhLocale, require('./lang/zh_CN.js')),
        'en': $.extend(true, {}, enLocale, require('./lang/EN.js'))
    }
})
Vue.prototype._i18n = i18n;
import Router from 'vue-router'                                      //  解决报这个错Uncaught (in promise) NavigationDuplicated {_name: "NavigationDuplicated", name: "NavigationDuplicat
const routerPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return routerPush.call(this, location).catch(error=> error)
}
/* Vue.use(BaiduMap, {
  // ak 是在百度地图开发者平台申请的密钥 详见 http://lbsyun.baidu.com/apiconsole/key
  ak: 'AW4NMrvKPWEKZbWnVFjz9d7QpjWtiTp3'
}) */
Vue.use(VueAwesomeSwiper, {})
Vue.component('Echart', ECharts);
Vue.component('CartPrice', CartPrice);
Vue.config.productionTip = false

// ajax封装
let resetAjax = (opt) => {
    let defaultOpt = {
        // root: process.env.NODE_ENV === 'development' ? '/word/public/index.php?s=' : '',
        root: '/word/public/index.php?s=',
        xhrFields: {withCredentials: true}, // 使用withCredentials发送跨域请求凭据
        crossDomain: true,  // 跨域
    }
    Object.assign(defaultOpt, opt);
    defaultOpt.url = defaultOpt.root + defaultOpt.url;
    defaultOpt.success = (res) => {
        if(!res) {
            return false;
        }
        try {
            if (JSON.parse(res).errorcode === 3) {
                // 1、处理登录过期
                // 2、跳转到登录页面
                if(location.href.includes('backStage')) {
                    location.href = `${location.origin}/main.html#/backSupport`  // 线上放开
                } else{
                    location.href = `${location.origin}/main.html#/login`  // 线上放开
                }
                return false;
            }
        } catch (error) {
            console.log(error)
        }
        
        opt.success(res);
    }
   /*  defaultOpt.error =(res) => {
        console.log(this)
    } */
    $.ajax(defaultOpt);
}
Vue.prototype.$resetAjax = resetAjax;
Vue.component('HeaderComponent', HeaderComponent);
Vue.component('FooterComponent', FooterComponent);


// 跳转后返回顶部
router.afterEach((to,from,next) => {
    if(to.hash === '#host' || to.hash === '#latest' || to.hash === '#recommend'  || to.hash === '#guess' || to.hash === '#advance' || to.hash === '#prevention') {
        return false;
    }
    window.scrollTo(0,0);
})



import VueWechatTitle from 'vue-wechat-title'    // 页面添加标题
Vue.use(VueWechatTitle)

let data = {
    // 推荐商品数据
    commendList: [],
    // 用户信息数据
    userData: {},
    // 搜索关键词
    keywork:'',
    // 商品大分类数据  比如：家居用品
    goodsType: [],
    // 商品小分类数据  比如：家居用品里面的杯类
    goodsSmallType: [],
    // 商品细分类数据   比如：家居用品里面杯类里的塑料杯
    subdivide:[],
    // header.vue里购物车数据
    headerCartData: {
        copyTableData: [],
        list: [],  // 购物车数据列表
        listNum: '0', // 购物车总数
        listPrice: '0',  // 购物车总金额
        isShowCar: false, // 是否显示购物车
        isHasNoCar: false, // 购物车没有数据
        cartTypeCate:[],  // 购物车分类清单数据 
    },
    // 是否显示默认搜索关键词
    isKeyword: true,
    // 是否显示全部商品列表
    isAllGoods: false,
    account: '',
    // ip系列商品
    ipList: [],
};

router.beforeEach((to, from, next) => {
  data.isAllGoods = (to.fullPath !== '/enter');
  next()
})
/* eslint-disable no-new */
new Vue({
  el: '#app',
  data,
  router,
  store,
  i18n,
  components: { App },
  render: h => h(App),  // 进度条简单配置
  template: '<App/>'
})
