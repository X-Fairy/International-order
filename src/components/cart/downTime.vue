<template>
    <!-- 倒计时组件 -->
    <div class="downTime-wrapper">
        <!-- 这里是显示还未结束时的内容，这里只是我这得布局，你可以随意。 -->
        <div class="time" v-show="!isShow">
            <!-- <span class="hour">{{myDay}}</span> :  -->
            <span class="hour">{{myHours}}h</span>:<span class="minute">{{myMinutes}}m</span>:<span class="second">{{mySeconds}}s</span>
        </div>
        <!-- 这里是显示结束后的内容 -->
        <span class="second" v-show="isShow">{{clocker}}</span>
    </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex';
import NProgress from "nprogress"; // 引入进度条
import "nprogress/nprogress.css"; // 引入进度条
export default {
  name: 'downTime',

    props: { // 接收父组件传递过来的参数,这里传了  结束时间 - 开始时间 - 结束后显示的内容
        endTime: {
            type: Number
        },
        startTime: {
            type: Number
        },
        endMsg: {
            type: String
        },
        itemNo: {
            type: String
        }
    },

    data () {
        return {
            isShow: false, // 控制显示结束或还未结束显示的内容
            clocker: '', // 结束后显示的内容
            timeObj: null, // 时间对象,下方会用到
            myDay: 0, // 我定义来接收计算出来的 天 的
            myHours: 0, // 我定义来接收计算出来的 小时 的
            myMinutes: 0, // 我定义来接收计算出来的 分钟 的
            mySeconds: 0,// 我定义来接收计算出来的 秒钟 的
            // 单个商品删除成功提示
            delItemSuccess:this.$t('cartPage.delItemSuccess'), 
            // 单个商品删除失败提示
            delItemError: this.$t('cartPage.delItemError'),
        }
    },
    computed: {
        i18n() {
            return this.$t('cartPage') 
        },
    },
    mounted () {
        
        // 计算时间差
        let timeLag = (this.endTime - this.startTime) / 1000
        // 判断当前是否时分秒的值是否大于10
        let add = num => {
        return num < 10 ? '0' + num : num
        }
        // 时间倒计时运算的方法
        let timeFunction = () => {
        let time = timeLag--
        this.timeObj = { // 时间对象
            seconds: Math.floor(time % 60),
            minutes: Math.floor(time / 60) % 60,
            hours: Math.floor(time / 60 / 60) % 24,
            days: Math.floor(time / 60 / 60 / 24)
        }
        // 计算出时分秒
        this.myDay = `${add(this.timeObj.days)}`
        this.myHours = `${add(this.timeObj.hours)}`
        this.myHours = Number(this.myHours) + ( Number(this.myDay * 24))
        this.myMinutes = `${add(this.timeObj.minutes)}`
        this.mySeconds = `${add(this.timeObj.seconds)}`
        // 当时间差小于等于0时,停止倒计时
        if (time <= 0) {
            this.isShow = true
            this.clocker = this.endMsg || ''
            clearInterval(go)
                this.deleteCart(this.itemNo)
            }
        }
        // 开始执行倒计时
        timeFunction()
            // 每一秒执行一次
            let go = setInterval(() => {
                timeFunction()
            }, 1000)
    },
        methods: {
            ...mapActions([
                'getDataCard'
            ]),
            /**
             * 删除单个购物车数据
             */
            deleteCart(item_no) {
                NProgress.start();
                this.$resetAjax({
                    type: 'POST',
                    url: `/Home/Cart/delCart`,
                    data: {
                        uid: localStorage.uid,
                        sn: item_no
                    },
                    success: (res) => {
                        NProgress.done();
                        let result = JSON.parse(res).result;
                        if(result === 'ok') {
                            this.$Message.success({
                                content: this.delItemSuccess,
                                duration: 3
                            });
                            this.getDataCard({
                                vm: this,
                                inland: '',
                                page: 1
                            });
                        } 
                        // else{
                        //     this.$Message.error({
                        //         content: this.delItemError,
                        //         duration: 3
                        //     });
                        // }
                    },
                })
            },
        }
        
}
</script>

<style lang="scss" scoped>
    .downTime-wrapper{
        font-size: 18px;
        .second{
            color: rgb(235, 62, 61);
        }
    }
</style>