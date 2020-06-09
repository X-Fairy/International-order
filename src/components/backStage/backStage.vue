<template>
    <div class="backStage" @click="isLogin">
        <!-- 左边菜单 -->
        <navBar :class="objClass" :fontChange="fontChange"/>
        <!-- 右边内容 -->
        <div class="ivu-layout" :class="objClass">
            <!-- 头部 -->
            <navHeader  @click.native="close($event)" :isOpenIcon="isOpenIcon"></navHeader><!--修改-->
            <router-view />
        </div>
    </div>
</template>

<script>
import navBar from '@/components/nav_bar'
import navHeader from '@/components/nav_header'
export default {
    components: {
        navBar,
        navHeader
    },
    data() {
        return {
            // 点击的元素所含有的classname值是否存在
            index: -1,
            // 关闭展开时的样式
            objClass: '',
            // 是否显示关闭icon
            isOpenIcon: false,
            // 左侧导航栏样式
            fontChange: true
        }
    },
    mounted() {
        // 判断用户是否已登录 
        this.isLogin();
        // 先把本地语言设置成中文
        localStorage.langSelect = 0;
        localStorage.language = this.$i18n.locale = 'zh';
        // 刷新页面，重新执行main.js
        // location.reload();
    },
    methods:{
        /**
         * 判断用户是否已登录
         */
        isLogin() {
            if(localStorage.hdcode === '') {
                // 未登录
                this.$Message.error({
                    content: '登录过期，2秒后为您跳转到登录页面',
                    duration: 2
                });
                this.$router.push({path: '/backSupport'});
                return false;
            }
            if(localStorage.hdcode === undefined) {
                // 未登录
                this.$Message.error({
                    content: '登录过期，2秒后为您跳转到登录页面',
                    duration: 2
                });
                this.$router.push({path: '/backSupport'});
                return false;
            }
        },
        close($event) {
            this.index = $event.target.className.indexOf('nav_icon');
            if(this.index !== -1 && this.objClass === '') {
                this.objClass = 'active';
                this.isOpenIcon = false;
                this.fontChange = false;
                return false;
            }
            if(this.objClass === 'active' && this.index !== -1) {
                this.objClass = '';
                this.isOpenIcon = true;
                this.fontChange = true;
                return false;
            }
        }
    }
}
</script>

