
 <!-- 后台登录页面 -->
 <template>
    <div class="backSupport">
            <div class="content_inner">
                <div class="login">
                    <h3 class="sign">国际订货后台系统</h3>
                    <Form ref="loginForm" :model="loginForm" :rules="ruleValidate" :label-width="20" class="loginForm">
                        <xmInput v-model="loginForm.mail" label="用户名" validateKey="mail" icon="icon-icoyonghuming" />
                        <div class="passInput">
                            <xmInput v-model="loginForm.password" label="密码" validateKey="password" icon="icon-mima1" :type="passType"/>
                            <i class="iconfont icon-htmal5icon08 noCheck" @click="passType='text'" v-if="passType==='password'"></i>
                            <i class="iconfont icon-chakan check" @click="passType='password'" v-else></i>
                        </div>
                        <FormItem class="code_img" prop="seccode">
                            <Input class="input" v-model="loginForm.seccode" @on-blur="getSeccode" @keyup.enter.native="getSeccode"/>
                            <div class="divIdentifyingCode" @click="getIdentifyingCode(true)">
                                <img id="imgIdentifyingCode" alt="点击更换 !" title="点击更换 !" :src="imgSrc"/>
                            </div>
                        </FormItem>
                        <FormItem class="remember_pass">
                            <Checkbox v-model="backRember" style="font-size:16px;">记住密码</Checkbox>
                        </FormItem>
                        <FormItem>
                            <p class="submit" @click="submit('loginForm')">登录</p>
                        </FormItem>
                    </Form>
                </div>
            </div>
    </div>
 </template>
 
 <script>
import xmInput from '@/components/_common/xmInput'
import Footer from './footer.vue'

 export default {
    components: {
        xmInput,
        Footer
    },
    data () {
        return {
            // 表单内容
            loginForm: {
                mail: '',
                password: '',
                seccode: '',
            },
            // 表单验证
            ruleValidate: {
                mail: [
                    { required: true, message: this.$t('loginPage').mailtip, trigger: 'blur' }
                ],
                password: [
                    { required: true, message: this.$t('loginPage').passwordtip, trigger: 'blur' },
                ],
                seccode: [
                    { required: true, message: this.$t('loginPage').seccodetip, trigger: 'blur' },
                ]
            },
            // 默认密码
            passType: 'password',
            // 验证码图片
            imgSrc: '', 
            // 选中哪个语言 
            langSelect: 1,
            // 验证码是否通过
            isGoSubmit: false,
            // 是否记住密码
            backRember: false,
            isCheckYzm: false,
        }
    },
    mounted() {
        // 判断是否记住密码
        this.remeberBack();
        // 验证码图片出现   等待页面结构渲染完毕再进行渲染验证码图片
        this.getIdentifyingCode(true);
    },
   
    methods: {
        /**
         * 判断是否记住密码
         */
        remeberBack() {
            let isRember = localStorage.remBack;
            if(isRember === 'true') {
                this.backRember = true;
                this.loginForm.mail = localStorage.userBack;
                this.loginForm.password = localStorage.passBack;
            } else {
                this.backRember = false;
                this.loginForm.mail = '';
                this.loginForm.password = '';
            }
        },
       /**
         * 窗口代码
         * @param {Boolean} bRefresh 是否刷新
         */
        getIdentifyingCode(bRefresh) {
            this.imgSrc = "";
            let identifyCodeSrc = `${location.origin}/word/public/index.php?s=admin/Login/Verification`;
            this.$nextTick(() => {
                this.imgSrc = identifyCodeSrc;
            })
        },
        /**
         * 判断是否验证
         */
        getSeccode() {
            if (this.isCheckYzm) {
                return false;
            }
            this.isCheckYzm = true;
            // 3s内不再执行下面函数
            setTimeout(() => {
                this.isCheckYzm = false;
            }, 3000)
            this.$resetAjax({
                type: 'POST',
                url: '/Home/Login/check',
                data: { 
                    code: this.loginForm.seccode,           //验证码
                },
                success: (res) => {
                    let result = JSON.parse(res);
                    if(result.res === 'error') {
                        this.getIdentifyingCode(true);
                        this.isGoSubmit = false;
                        if(location.href.includes('http://localhost')) {
                            // 本地代码走这步
                            this.$Message.error('验证码输入有误.');
                            this.submit('loginForm')
                        } else {
                            // 线上代码走这步
                            this.$Message.error('验证码输入有误.');
                            this.loginForm.seccode = '';    // 本地注释，线上放开
                        }
                        return false;
                    } 
                    this.isGoSubmit = true;
                    this.submit('loginForm')
                }
            })
        },
        /**
         * 提交
         */
        submit(loginForm) {
            this.$refs.loginForm.validate((valid) => {
                if(location.href.includes('http://localhost')) {
                    // 本地代码走这步
                    if (valid) {                                // 本地放开，线上注释
                        this.loginIn();
                    }  
                    return false;
                }
                // 线上代码走这步
                if(!this.isGoSubmit) {                          // 本地注释，线上放开
                    this.loginForm.seccode = '';
                    return false;
                }
                if (valid && this.isGoSubmit) {                // 本地注释，线上放开
                    this.loginIn();
                } 
            })
        },
        /**
         * 登录请求
         */
        loginIn() {
            this.$resetAjax({
                type: 'POST',
                url: '/admin/Login/Login',
                data: { 
                    user: this.loginForm.mail,
                    pass: this.loginForm.password
                },
                success: (res) => {
                    let result = JSON.parse(res);
                    let tip = result.res;
                    switch(tip) {
                        case 'ok' :
                            let data = result.data;
                            localStorage.group_id = data.group_id;
                            localStorage.hdcode = data.hdcode;
                            localStorage.backName = data.name;
                            localStorage.group_id = data.group_id;
                            // localStorage.headerTitle = [];              // 页头点击的标题
                            localStorage.currendIndx = -1;              // 后台导航栏左侧的选中index
                            localStorage.role = data.group_id;           // 商品管理后台中是否有商品上线设置功能
                            // 判断是否记住密码
                            if(this.backRember) {
                                localStorage.remBack = true;
                                localStorage.userBack = this.loginForm.mail;
                                localStorage.passBack = this.loginForm.password;
                            } else {
                                localStorage.remBack = false;
                                localStorage.userBack = '';
                                localStorage.passBack = '';
                            }
                            this.$router.push('/backStage');
                            break;
                        case 'error':
                            this.$Message.error(result.msg);
                            this.loginForm.seccode = '';  
                            this.getIdentifyingCode(true);
                            break;
                    }
                }
            })
        }
    }
 }
 </script>
 