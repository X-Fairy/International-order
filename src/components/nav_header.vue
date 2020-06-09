<template>
    <div class="nav_header">
       <div class="left">
           <i class="icon-unwind iconfont nav_icon" v-if="isOpenIcon"></i>
           <i class=" icon-weibiaoti25 iconfont nav_icon" v-else></i>
           <p>订货系统后台 <Icon type="ios-arrow-forward" /><span> {{headerTitle}}</span></p>
           <!-- <p @click="goHome">
               <i class="icon-liuliangyunpingtaitubiao02 iconfont" id="close_icon"></i>
               <span>{{i18n.home}}</span>
           </p> -->
       </div>
       <div class="right">
           <!-- 全屏显示、全屏退出 -->
           <i class="icon-Group- iconfont expand" title="退出全屏" v-show="fullscreen===true" @click="handleFullScreen"></i>
           <i class="icon-caozuo-quanping-zhankai iconfont expand" title="全屏显示" @click="handleFullScreen" v-show="fullscreen===false"></i>
           <Dropdown class="own_info">
                <a href="javascript:void(0)">
                    {{helloDate}}{{uname}}
                    <Icon type="chevron-down"></Icon>
                </a>
                <DropdownMenu slot="list">
                    <DropdownItem class="list_footer">
                        <a @click="loginOut" style="display:inline-block;">{{i18n.signOut}}</a>
                    </DropdownItem>
                </DropdownMenu>
            </Dropdown>
           <!-- <Dropdown style="margin-left: 20px" class="langChoice">
                <a href="javascript:void(0)">
                    {{i18n.choice}}
                <img :src="LangImg" alt="">
                {{langText}}
                </a>
                <DropdownMenu slot="list">
                    <DropdownItem v-for="item in langList"  :key="item.value" @click.native="choiceDown(item)">
                        <img :src="item.src" alt="" style="width: 25px;height:25px;margin-right:10px;">{{item.label}}
                    </DropdownItem>
                </DropdownMenu>
            </Dropdown> -->
       </div>
    </div>
</template>

<script>
import Bus from '@/assets/js/eventBus.js';     // 组件传值
export default {
    props: ['isOpenIcon'],
    data() {
        return {
            // 页面标题
            headerTitle: '',
            // 选中哪个语言 
            langSelect: 1,
            // 问候语
            helloDate: '',
            // 用户名
            uname: localStorage.backName,
            // 语言名称
            langText: 'English',
            // 语言数据
            langList: [
                {
                    value: 0,
                    label: '中文',
                    src: require('@/assets/images/ovearheader/china.png'),
                },
                {
                    value: 1,
                    label: 'English',
                    src: require('@/assets/images/ovearheader/usa.png'),
                },
            ],
            dawn: this.$t('backHeaderPage.dawn'),
            morning: this.$t('backHeaderPage.morning'),
            fore: this.$t('backHeaderPage.fore'),
            noon: this.$t('backHeaderPage.noon'),
            after: this.$t('backHeaderPage.after'),
            even: this.$t('backHeaderPage.even'),
            night: this.$t('backHeaderPage.night'),
            late: this.$t('backHeaderPage.late'),
            // 退出失败提示
            loginOutTip: this.$t('backHeaderPage').loginOutTip,
            // 是否是全屏显示
            fullscreen: false
        }
    },
    
    computed: {
        i18n() {
            return this.$t('backHeaderPage')
        }
    },
    created() {
        Bus.$on('msg', (e) => {
            localStorage.headerTitle = e;
            this.headerTitle = localStorage.headerTitle;        // 接收兄弟组件之间传值
        })
        this.headerTitle = localStorage.headerTitle;        // 接收兄弟组件之间传值
        // 判断选中哪个语言
        this.judgeSelect();
        // 得到时间问候语
        this.getHello();
    },
    methods: {
        /**
         * 全屏显示
         */
        handleFullScreen(){
            let element = document.documentElement;
            if (this.fullscreen) {
                if (document.exitFullscreen) {
                document.exitFullscreen();
                } else if (document.webkitCancelFullScreen) {
                document.webkitCancelFullScreen();
                } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
                } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
                }
            } else {
                if (element.requestFullscreen) {
                element.requestFullscreen();
                } else if (element.webkitRequestFullScreen) {
                element.webkitRequestFullScreen();
                } else if (element.mozRequestFullScreen) {
                element.mozRequestFullScreen();
                } else if (element.msRequestFullscreen) {
                // IE11
                element.msRequestFullscreen();
                }
            }
            this.fullscreen = !this.fullscreen;
        },
        /**
         * goHome
         */
        goHome() {
            localStorage.langSelect = localStorage.langBack;
            this.$router.push({path: '/enter'});
            location.reload();
        },
        /**
         * 判断选中哪个语言
         */
        judgeSelect() {
            this.langSelect = localStorage.language === 'zh' ? 0 : 1;
            switch(this.langSelect) {
                case 0:
                    this.LangImg = require('@/assets/images/ovearheader/china.png');
                    this.langText = '中文';
                    localStorage.langSelect = 0;
                    break;
                case 1:
                    this.LangImg = require('@/assets/images/ovearheader/usa.png');
                    this.langText = 'English';
                    localStorage.langSelect = 1;
                    break;
                
            }
            /* this.$resetAjax({
                type: 'POST',
                url: '/Admin/Lang/clang',
                data: { 
                    type: localStorage.langSelect,
                },
                success: (res) => {
                    let result = JSON.parse(res);
                }
            }) */
        },
        /*
        *   切换语言
        */
        choiceDown(item) {
            location.reload();
            localStorage.language = '';
            this.$i18n.locale = (item.value === 0) ? 'zh' : 'en';
            localStorage.language = this.$i18n.locale;
            this.langSelect = item.value;
            this.judgeSelect();
        },
        /**
         * 得到时间问候语
         */
        getHello() {
            var now = new Date();
            var hour = now.getHours(); 
            if(hour < 6){
                this.helloDate = this.dawn;
            }  else if (hour < 9){
                this.helloDate = this.morning;
            }  else if (hour < 12){
                this.helloDate = this.fore;
            }  else if (hour < 14){
                this.helloDate = this.noon;
            }  else if (hour < 17){
                this.helloDate = this.after;
            } else if (hour < 19){
                this.helloDate = this.even;
            }  else if (hour < 22){
                this.helloDate = this.night;
            } else {
                this.helloDate = this.late;
            } 
        },
        /**
        * 退出登录 
         */
        loginOut() {
            this.$resetAjax({
                type: 'POST',
                url: `/admin/Login/logout`,
                data: {
                    hdcode: localStorage.hdcode,
                },
                success: (res) => {
                    let result = JSON.parse(res);
                    if(result.res === 'ok') {
                        localStorage.group_id = '';  
                        localStorage.hdcode = '';      
                        localStorage.backName = '';  
                        localStorage.currendIndx = -1;  
                        localStorage.group_id = '';  
                        // 商品管理后台中是否有商品上线设置功能
                        localStorage.role = '';
                        // 判断是否记住密码
                        if(localStorage.remBack === 'true') {
                            localStorage.userBack = localStorage.userBack;
                            localStorage.passBack = localStorage.passBack;
                        } else {
                            localStorage.userBack = '';
                            localStorage.passBack = '';
                        }
                        this.$Message.success({
                            content: '退出登录成功',
                            duration: 1500
                        });
                        setTimeout(() => {
                            this.$router.push('/backSupport');
                            this.$nextTick(() => {
                                location.reload();
                            })
                        }, 1500);
                    }
                }
            })
        },
    }
}
</script>
