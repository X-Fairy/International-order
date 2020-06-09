<template>
    <div id="external_container" @click="isLogin">
        <!-- 头部 -->
        <Header></Header>
        <!-- 中间内容 -->
        <div id="main-content">
            <!-- <keep-alive :include="keepAliveIncludes"> -->
                <router-view v-if="isGetUserData"/>
            <!-- </keep-alive> -->
        </div>
        <fixed></fixed>
        <!-- 底部 -->
        <Footer></Footer>
        <!-- 提示 -->
        <!-- <tip v-if="$root.tip.isShow" :tipContent="$root.tip.content"></tip> -->
       
    </div>
</template>

<script>
import { mapActions } from 'vuex';
import Footer from './footer.vue'
import Header from './header.vue'
import fixed from './fixed.vue'
import tip from './tip.vue'
import {setCookie} from  '@/assets/js/tool.js' 
import {getCookie} from  '@/assets/js/tool.js'
import {getNumBox} from  '@/assets/js/tool.js'

export default {
    components: {
        Header,
        Footer,
        tip,
        fixed
       
    },
    data() {
        return {
            isShowClass: true,
            isGetUserinfo: true, // 修改为true
            isGetGoodsType: false,
            dawn: this.$t('infoPage.dawn'),
            morning: this.$t('infoPage.morning'),
            fore: this.$t('infoPage.fore'),
            noon: this.$t('infoPage.noon'),
            after: this.$t('infoPage.after'),
            even: this.$t('infoPage.even'),
            night: this.$t('infoPage.night'),
            late: this.$t('infoPage.late'),
            loginTips: this.$t('infoPage.loginTips'),
            langSelect: '',
            keepAliveIncludes: ['enter']
        }
    },

    computed: {
        // 获取到所有基础数据，再渲页面，请求其他数据
        isGetUserData() {
            return this.isGetUserinfo && this.isGetGoodsType;
        },
        i18n() {
            return this.$t('infoPage')
        },
    },
    created() {
        this.langSelect = localStorage.langSelect;
        // 判断用户是否已登录 
        this.isLogin();
        // 获取商品分类
        this.getGoodsType();
         // 得到时间问候语
        this.getHello();
        // 得到用户数据
        this.getUserinfo();
    },
    
    methods: {
        ...mapActions([
            'getDataCard'
        ]),
        open(data) {
            this.isShowClass = data;
        },
        /**
         * 判断用户是否已登录
         */
        isLogin() {
            if(localStorage.uid === '') {
                // 未登录
                this.$Message.error({
                    content: this.loginTips,
                    duration: 3
                });
                this.$router.push({path: '/login'})
                return false;
            } 
            if(localStorage.uid === undefined) {
                // 未登录
                this.$Message.error({
                    content: this.loginTips,
                    duration: 3
                });
                this.$router.push({path: '/login'})
                return false;
            }

        },
        /**
         * 得到时间问候语
         */
        getHello() {
            var now = new Date();
            var hour = now.getHours(); 
            if(hour < 6){
                localStorage.helloDate = this.dawn;
            }  else if (hour < 9){
                localStorage.helloDate = this.morning;
            }  else if (hour < 12){
                localStorage.helloDate = this.fore;
            }  else if (hour < 14){
                localStorage.helloDate = this.noon;
            }  else if (hour < 17){
                localStorage.helloDate = this.after;
            } else if (hour < 19){
                localStorage.helloDate = this.even;
            }  else if (hour < 22){
                localStorage.helloDate = this.night;
            } else {
                localStorage.helloDate = this.late;
            } 
        },
        /**
         * 得到用户数据
         */
        getUserinfo() {
            this.$resetAjax({
                type: 'POST',
                url: '/Home/index/xinxi',
                success: (res) =>{
                    // 成功得到用户信息，存入userData
                    let info = JSON.parse(res)
                    this.$root.userData = Object.assign({}, this.$root.userData, info);
                    this.isGetUserinfo = true;
                }
            })
        },
        /**
         * 得到商品分类
         */
        getGoodsType() {
            this.isGetGoodsType = true;
        },
    }
}
</script>

<style lang="less" scoped>
    #main-content{
        background: #fff;
    }
</style>



