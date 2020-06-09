


 <template>
    <div class="loginPage">
        <div class="header">
            <div class="header_inner">
                <img src='@/assets/images/login/go_home.png' alt="" style="height:45px;">
                <div class="site_right">
                    <!-- <i class="icon-qiu iconfont"></i> -->
                    <span>{{i18n.siteTips}}</span>
                    <Select v-model="siteValue" style="width:300px" @on-change="changeSite">
                        <Option v-for="item in i18n.siteData" :value="item.id" :key="item.id">{{ item.label }}</Option>
                    </Select>
                </div>
            </div>
        </div>
        <div class="content">
            <div class="content_inner">
                <div class="login">
                    <h3 class="sign">{{i18n.loginBtnText}}</h3>
                    <Form ref="loginForm" :model="loginForm" :rules="ruleValidate" :label-width="20" class="loginForm">
                        <xmInput v-model="loginForm.mail" :label="i18n.mail" validateKey="mail" icon="icon-icoyonghuming" />
                        <div class="passInput">
                            <xmInput v-model="loginForm.password" :label="i18n.password" validateKey="password" icon="icon-mima1" :type="passType"/>
                            <i class="iconfont icon-htmal5icon08 noCheck" @click="passType='text'" v-if="passType==='password'"></i>
                            <i class="iconfont icon-chakan check" @click="passType='password'" v-else></i>
                        </div>
                        <FormItem class="code_img" prop="seccode">
                            <Input class="input" v-model="loginForm.seccode" @keyup.enter.native="getSeccode" @on-blur="getSeccode"/>
                            <div class="divIdentifyingCode" @click="getIdentifyingCode(true)">
                                <img id="imgIdentifyingCode" :alt="i18n.changeClick" :title="i18n.changeClick" :src="imgSrc"/>
                            </div>
                        </FormItem>
                        <FormItem class="remember_pass">
                            <Checkbox v-model="remeberValue">{{i18n.remeberPass}}</Checkbox>
                            <div class="right" :title="i18n.choice">
                                <Dropdown class="langChoice">
                                    <a href="javascript:void(0)">
                                    <img :src="LangImg" alt="">
                                    {{langText}}
                                    </a>
                                    <DropdownMenu slot="list">
                                        <DropdownItem v-for="item in langList"  :key="item.value" @click.native="choiceDown(item)">
                                            <img :src="item.src" alt="" style="width: 30px;margin-right:10px;">{{item.label}}
                                        </DropdownItem>
                                    </DropdownMenu>
                                </Dropdown>
                            </div>
                        </FormItem>
                        <FormItem>
                            <p class="submit" @click="submit('loginForm')">{{i18n.loginHandle}}</p>
                        </FormItem>
                    </Form>
                </div>
            </div>
        </div>
        <!-- 引入底部 -->
        <Footer></Footer>
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
            siteValue: 4,
            // 表单内容
            loginForm: {
                mail: '',
                password: '',
                seccode: '',
            },
            // 引入密码提示
            passwordtip: this.$t('loginPage.passwordtip'),
            // 引入邮箱提示
            mailtip: this.$t('loginPage.mailtip'),
            // 引入验证码提示
            seccodetip: this.$t('loginPage.seccodetip'),
            // 验证码验证失败提示
            seccodeerror: this.$t('loginPage.seccodeerror'),
            // 登录返回时账号错误提示
            usererror: this.$t('loginPage.usererror'),
            // 登录返回时密码错误提示
            passerror: this.$t('loginPage.passerror'),
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
            // 语言图片
            LangImg: require('@/assets/images/ovearheader/china.png'),
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
            // 默认密码
            passType: 'password',
            // 验证码图片
            imgSrc: '', 
            // 选中哪个语言 
            langSelect: 1,
            // 验证码是否通过
            isGoSubmit: false,
            // 是否记住密码
            remeberValue: false,
            isCheckYzm: false,
        }
    },
     computed:{
        // 引入loginPage里的中英文
        i18n() {
            return this.$t('loginPage')
        },
        setSite() {
            switch(location.href) {
                case 'http://cn.xmvogue.com/main.html#/login':
                    // 中国大陆
                    this.siteValue = 0; 
                    break;
                 case 'http://hk.xmvogue.com/main.html#/login':
                     //  中国香港
                    this.siteValue = 1; 
                    break;
                 case 'http://hk.xmvogue.com/main.html#/login':
                    //  迪拜，中东国家
                    this.siteValue = 2; 
                    break;
                 case  'http://in.xmvogue.com/main.html#/login':
                    //  印度
                    this.siteValue = 3;  
                    break;
                case 'http://us.xmvogue.com//main.html#/login':
                    //  美西
                    this.siteValue = 5;  
                    break;
                case 'http://order.xmvogue.com/main.html#/login':
                    //  公司
                    this.siteValue = 4; 
                    break;
                default:
                    // 本地测试用。
                    this.siteValue = 4;
                    break;
            } 
            return this.siteValue; 
        }
    },
    mounted() {
        // 验证码图片出现   等待页面结构渲染完毕再进行渲染验证码图片
        this.getIdentifyingCode(true);
    },
    created() {
        // 判断是否记住密码
        this.remeberPass();
        // 判断选中哪个语言
        this.judgeSelect();
    },
    methods: {
        /**
         * 站点选择
         */
        changeSite() {
            switch(this.siteValue) {
                case 0:
                    // 中国大陆
                    location.href = 'http://cn.xmvogue.com/main.html#/login'; 
                    break;
                 case 1:
                     //  中国香港
                    location.href = 'http://hk.xmvogue.com/main.html#/login'; 
                    break;
                 case 2:
                    //  迪拜，中东国家
                    location.href = 'http://db.xmvogue.com/main.html#/login'; 
                    break;
                 case 3:
                    //  印度
                    location.href = 'http://in.xmvogue.com/main.html#/login'; 
                    break;
                case 5:
                    //  美西
                    location.href = 'http://us.xmvogue.com//main.html#/login'; 
                    break;
                case 4:
                    //  公司
                    location.href = 'http://order.xmvogue.com/main.html#/login'; 
                    break;
            } 
        },
        /**
         * 判断是否记住密码
         */
        remeberPass() {
            let isRember = localStorage.remember;
            if(isRember === 'true') {
                this.remeberValue = true;
                this.loginForm.mail = localStorage.user;
                this.loginForm.password = localStorage.pass;
            } else {
                this.remeberValue = false;
                this.loginForm.mail = '';
                this.loginForm.password = '';
            }
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
                    break;
                case 1:
                    this.LangImg = require('@/assets/images/ovearheader/usa.png');
                    this.langText = 'English';
                    break;
                
            }
        },
       /**
         * 窗口代码
         * @param {Boolean} bRefresh 是否刷新
         */
        getIdentifyingCode(bRefresh) {
            this.imgSrc = '';
            let identifyCodeSrc = `${location.origin}/word/public/index.php?s=home/Login/Verification`;    // 适应不同的网站域名
            // 在数据变化后要执行的某个操作，而这个操作需要使用随数据改变而改变的DOM结构的时候，这个操作都应该放进Vue.nextTick()的回调函数中。
            this.$nextTick(()=>{
                this.imgSrc = identifyCodeSrc;
			})
        },
        /*
        *   切换语言
        */
        choiceDown(item) {
            localStorage.language = '';
            this.$i18n.locale = (item.value === 0) ? 'zh' : 'en';
            localStorage.language = this.$i18n.locale;
            this.langSelect = item.value;
            location.reload();
            this.judgeSelect();
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
                    code: this.loginForm.seccode.trim(),
                },
                success: (res) => {
                    let result = JSON.parse(res);
                    if(result.res === 'error') {
                        this.getIdentifyingCode(true);
                        this.isGoSubmit = false;
                        if(location.href.includes('http://localhost')) { 
                            this.$Message.error({
                                content: this.seccodeerror,
                                duration: 2
                            });
                            this.submit('loginForm')
                            return false;
                        }
                        this.$Message.error({
                            content: this.seccodeerror,
                            duration: 2
                        });
                        this.loginForm.seccode = '';          // 本地注释，线上放开
                        return false;
                    }
                    this.isGoSubmit = true;
                    this.submit('loginForm');
                }
            })
        },
        /**
         * 提交
         */
        submit(loginForm) {
            this.$refs.loginForm.validate((valid) => {
                if(location.href.includes('http://localhost')) {
                    if (valid) {                        // 本地放开，线上注释
                        this.loginIn();
                    } 
                    return false;
                }
                if(!this.isGoSubmit) {                  // 本地注释，线上放开
                    this.loginForm.seccode = ''; 
                    return false;
                }
                if (valid && this.isGoSubmit) {         // 本地注释，线上放开
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
                url: '/Home/Login/login',
                data: { 
                    user: this.loginForm.mail.trim(),
                    pass: this.loginForm.password.trim()
                },
                success: (res) => {
                    let result = JSON.parse(res);
                    let tip = result.res;
                    switch(tip) {
                        case 'ok' :
                            let data = result.data;
                            localStorage.hdid = data.hdid;     // 用户海鼎编码
                            localStorage.isvip = data.isvip;     // 用户是否为vip用户
                            localStorage.max_buy = data.max_buy;     // 用户最大购买量
                            localStorage.uid = data.uid;              // 用户uid
                            localStorage.uname = data.uname;            // 登录用户名
                            localStorage.langSelect = this.langSelect;  // 语言
                            localStorage.cost_num = data.cost_num; // 用户因为私货进行的扣款金额
                            localStorage.firstPlayFlag = "0"; // 用来判断私货提示框是否已提醒过（只能提醒一次），0表示未提醒过，1表示已提醒 
                            this.$root.userData = data;
                            // 判断是否记住密码
                            if(this.remeberValue) {
                                localStorage.remember = true;
                                localStorage.user = this.loginForm.mail;
                                localStorage.pass = this.loginForm.password;
                            } else {
                                localStorage.remember = false;
                                localStorage.user = '';
                                localStorage.pass = '';
                            }
                            this.$router.push('/enter');
                            break;
                        case 'error1':
                            this.$Message.error({
                                content: this.usererror,
                                duration: 2
                            });
                            this.loginForm.seccode = '';  
                            this.getIdentifyingCode(true);
                            break;
                        case 'error0':
                            this.$Message.error({
                                content: this.passerror,
                                duration: 2
                            });
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
 