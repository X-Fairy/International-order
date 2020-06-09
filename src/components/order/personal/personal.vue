<template>
    <div class="personal">
        <p class="order_title">{{i18n.pageTitle}}</p>
        <div class="top">
            <div class="left">
                <div class="portrait">
                    <img src="@/assets/images/portrait.jpg" alt="">
                </div>
                <div class="info">
                    <!--  <span class="changePass" @click="getChange">{{i18n.changePass}}</span> 修改密码隐藏 -->
                    <h3>{{uname}}</h3>
                </div>
            </div>
            <div class="right">
                <ul>
                    <li class="member">{{i18n.vipTitle}}：<span>{{member}} </span></li>
                    <li>{{i18n.hdid}}：<span>{{hdid}} </span></li>
                    <li>{{i18n.Account}}：<span>￥{{account}} </span></li>
                    <li>{{i18n.Integral}}：<span>{{integral}} </span></li>
                    <li>{{i18n.address}}：<span>{{address}} </span></li>
                </ul>
            </div>
        </div>
        <ul class="portal_sub">
            <li v-for="item in list" :key="item.id">
                <div class="sub_left">
                    <img :src="item.imgUrl" alt="">
                </div>
                <div class="sub_right">
                    <p class="sub_right_top">{{item.name}}：<span>{{item.num}}</span></p>
                    <p class="sub_right_bottom" @click="itemClick(item)">{{item.detail}} >><span></span></p>
                </div>
            </li>    
        </ul>
        <!-- 密码修改模态框 -->
        <Modal v-model="passModel"  draggable :title="i18n.changePass" @on-cancel="passModel=false;" class="passModel">
            <Form  ref="formValidate" :model="formValidate" :rules="ruleValidates" :label-width="100"> 
                <!-- <FormItem :label="i18n.oldPass" prop="oldPass"> 
                    <Input v-model="formValidate.oldPass" />
                </FormItem>  -->
                <FormItem :label="i18n.newPass" prop="newPass"> 
                    <Input v-model="formValidate.newPass" type="text" />
                </FormItem> 
                <FormItem :label="i18n.comformPass" prop="againPass"> 
                    <Input v-model="formValidate.againPass" type="password"/>
                </FormItem> 
            </Form>
            <div class="set-goods-footer" slot="footer">
                <Button type="success"  @click="submitPassword('formValidate')">{{i18n.submitPass}}</Button>
                <Button @click="passModel=false;">{{i18n.cancelPass}}</Button>
            </div>
        </Modal>
    </div>
</template>

<script>
import { mapState, mapGetters, mapMutations,mapActions } from 'vuex';
import NProgress from 'nprogress'   // 引入进度条
import 'nprogress/nprogress.css'    // 引入进度条
export default {
    data() {
        return {
            // 用户名
            uname: '',
            // 海鼎编码
            hdid: '',
            // 账户金额
            account: '',
            // 账户积分
            integral: '',
            // 积分
            integral: '', 
            // 余额
            balance: '',
            // 会员
            member: '',
            // 普通会员
            isVip: this.$t('infoPage.isVip'),
             // VIP会员
            vip: this.$t('infoPage.vip'),
            dawn: this.$t('infoPage.dawn'),
            morning: this.$t('infoPage.morning'),
            fore: this.$t('infoPage.fore'),
            noon: this.$t('infoPage.noon'),
            after: this.$t('infoPage.after'),
            even: this.$t('infoPage.even'),
            night: this.$t('infoPage.night'),
            late: this.$t('infoPage.late'),
            // 个人商品情况
            list: this.$t('infoPage.list'),
            // 收藏带过去的参数
            favorite: this.$t('infoPage.favorite'),
            // 是否显示密码修改框
            passModel: false,
            // 密码弹框
            formValidate:{
                oldPass:'',
                newPass:'',
                againPass:''
            },
            oldPassInput:  this.$t('infoPage.oldPassInput') ,
            newPassInput:  this.$t('infoPage.newPassInput') ,
            comforInput:  this.$t('infoPage.comforInput') ,
            // 表单认证
            ruleValidates:{
                oldPass: [
                    { required: true, message: this.$t('infoPage').oldPassInput, trigger: 'blur' }
                ],
                newPass: [
                    { required: true, message: this.$t('infoPage').newPassInput, trigger: 'blur' }
                ],
                againPass: [
                    { required: true, message: this.$t('infoPage').comforInput, trigger: 'blur' }
                ],
            },
            // 密码修改成功
            passSuccessTips: this.$t('infoPage.passSuccessTips') ,
            // 密码修改失败
            passErrorTips: this.$t('infoPage.passErrorTips'),
            // 两次密码输入不相同提示
            noSomepass: this.$t('infoPage.noSomepass'),
            // 收货地址
            address: '',
            // 收藏数量
            collectLen: 0,
        }
    },
    computed: {
        // 引入infoPage里的中英文
        i18n() {
            return this.$t('infoPage') 
        },
        ...mapState([
            'headerCartData'
        ]),
        ...mapGetters([
            'totalPrice',
            'cartNum',
            'num',
            'pageNum'
        ]),
    
    },
    watch: {
        passModel(val) {
            if(!val) {
                this.formValidate = {
                    oldPass:'',
                    newPass:'',
                    againPass:''
                }
            }
        }
    },
    created() {
        NProgress.start();
        // 得到用户收藏情况
       this.getUserCollect();
        // 得到收货地址
        this.getAdress();
        NProgress.done();
    },

  
    methods: {
        ...mapMutations([
            'setCartDataList',
            'setCartDataListNum',
            'setTotalPrice',
            'setCartDataCartTypeCate',
            'setPageNum'
        ]),
        ...mapActions([
            'getDataCard'
        ]),
        getChange() {
            this.passModel = true;
            this.formValidate.newPass = '';
            this.formValidate.againPass = '';
        },
        /**
         * 得到用户信息
         */
        getInfoData() {
            if(localStorage.isvip === '0') {
                this.member = this.isVip;
            } else {
                this.member = this.vip
            }
            this.uname = localStorage.uname;
            this.hdid = localStorage.hdid;
            this.account = localStorage.account;
            this.integral = localStorage.integral;
            this.list[0].num = this.pageNum;
            this.list[1].num = this.collectLen;
            
        },
        /**
         * 事件处理
         */
        itemClick(item) {
            let id = item.id;
            switch(id) {
                case 1:
                    this.$router.push({path: '/cart'});
                    break;
                case 2:
                    this.$router.push({path:'/order/favorite', query: {name2: 'c',name3:'8',title: this.favorite}})
                    break;
            }
        },
        /**
         * 查看密码表单是否验证
         */
        submitPassword(formValidate) {
            this.$refs[formValidate].validate((valid) => {
                if (valid) {
                    this.somePassVer();
                }
            })
        },
        /**
         * 验证两次密码输入是否相同 
         */
        somePassVer() {
            if(this.formValidate.againPass !== this.formValidate.newPass) {
                this.$Message.success({
                    content: this.noSomepass,
                    duration: 3
                });
                setTimeout(() => {
                    this.formValidate.againPass = '';
                }, 2000);
            } else {
                this.checkPass();
            }
        },
        /**
         * 提交密码更改
         */
        checkPass() {
            this.$resetAjax({
                type: 'POST',
                url: '/home/User/setpass',
                data:{
                    pass: this.formValidate.newPass,
                    id: localStorage.uid
                },
                success: (res) => {
                    let result = JSON.parse(res);
                    if(result.errorcode === 0) {
                        this.passModel = false;
                        this.$Message.success({
                            content: this.passSuccessTips,
                            duration: 3
                        });
                    } else {
                        this.$Message.error({
                            content: this.passErrorTips,
                            duration: 3
                        });
                    }
                }
            })
        },
        /**
         * 
         */
        getAdress() {
            this.$resetAjax({
                type: 'POST',
                url: '/home/Liushui/Address',
                success: (res) => {
                    let result = JSON.parse(res);
                    this.address = result[0].ADDRESS;
                }
            })
        },
        /**
         * 得到用户收藏情况
         */
        getUserCollect() {
             this.$resetAjax({
                type: 'POST',
                url: '/Home/Collect/index',
                data: {
                    lang: localStorage.langSelect
                },
                success: (res) => {
                    this.collectLen = JSON.parse(res).list.length;
                    // 得到用户信息
                    this.getInfoData();
                }
             })
        },
    }
}
</script>

