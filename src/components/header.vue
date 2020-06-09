<template>
    <div id="app_header">
        <div class="header_inner">
            <!-- 用户名，退出 -->
            <div class="slite_left">
                <Dropdown class="own_info">
                    <a href="javascript:void(0)">
                       {{i18n.helloContent}} {{username}}
                        <Icon type="ios-arrow-down"></Icon>
                    </a>
                    <DropdownMenu slot="list">
                        <DropdownItem class="list_footer">
                           <p class="login_out_header" @click="loginOut">{{i18n.signOut}}</p>
                        </DropdownItem>
                    </DropdownMenu>
                </Dropdown>
                 <!-- 全屏显示、全屏退出 -->
                <i class="icon-Group- iconfont expand" :title="i18n.outEXpand" v-show="fullscreen===true" @click="handleFullScreen"></i>
                <i class="icon-caozuo-quanping-zhankai iconfont expand" :title="i18n.expandShow" @click="handleFullScreen" v-show="fullscreen===false"></i>
            </div>
            <!-- 管理中心及切换语言 -->
            <div class="site_right">
                <!-- <p class="back-stage" @click="goBackStage">{{i18n.backmanagement}}</p> -->
                <p class="account">{{i18n.account}}
                    <span @click="getAccount" v-if="!isAccount" class="check">{{i18n.lookAccount}}</span>
                    <span v-else>￥{{$root.account}}</span>
                </p>
                <Dropdown>
                    <a href="javascript:void(0)">
                        {{i18n.management}} <Icon type="ios-arrow-down"></Icon>
                    </a>
                    <DropdownMenu slot="list">
                        <DropdownItem>
                            <span @click="$router.push({path:'/order/confirmed', query: {name2: 'a',name3:'1',title: i18n.order}})">{{i18n.order}}</span>
                        </DropdownItem>
                        <DropdownItem>
                            <span @click="$router.push({path:'/order/salesFlow', query: {name2: 'b',name3:'3',title: i18n.salesFlow}})">{{i18n.StoreBusiness}}</span> 
                        </DropdownItem>
                        <DropdownItem>
                            <span @click="$router.push({path:'/order/personal', query: {name2: 'c',name3:'6',title: i18n.myPerson}})">{{i18n.personCenter}}</span> 
                        </DropdownItem>
                        <DropdownItem>
                            <span @click="$router.push({path:'/order/applyServices', query: {name2: 'd',name3:'11',title: i18n.applicationService}})">{{i18n.saleService}}</span>
                        </DropdownItem>
                        <!-- <DropdownItem class="list_footer">
                           <span @click="$router.push({path:'/order/salesFlow', query: {name2: 'b',name3:'3',title: '销售流水'}})">门店营业报表</span> 
                        </DropdownItem>
                        <DropdownItem class="list_footer">
                           <span @click="$router.push({path:'/order/favorite', query: {name2: 'c',name3:'8',title: '我的收藏夹'}})">个人中心</span> 
                        </DropdownItem>
                        <DropdownItem class="list_footer">
                           <span @click="$router.push({path:'/order/applyServices', query: {name2: 'd',name3:'11',title: '申请服务'}})">售后服务</span>
                        </DropdownItem> -->
                    </DropdownMenu>
                </Dropdown>
                <Dropdown style="margin-left: 20px" class="langChoice">
                    <a href="javascript:void(0)">
                        {{i18n.choice}}
                       <img :src="LangImg" alt="">
                       {{langText}}
                        <Icon type="ios-arrow-down"></Icon>
                    </a>
                    <DropdownMenu slot="list">
                        <DropdownItem v-for="item in langList"  :key="item.value" @click.native="choiceDown(item)">
                            <img :src="item.src" alt="" style="width:30px;margin-right:10px;">{{item.label}}
                        </DropdownItem>
                    </DropdownMenu>
                </Dropdown>
            </div>
        </div>
        <div class="search">
            <div class="search_top">
                <div class="inner_top">
                    <div class="inner_left" :title="i18n.goHome">
                        <a @click="$router.push({path: '/enter'})" :class='animationType' @mouseenter="animateEnter"  @mouseleave="animateLeave">
                            <img src="@/assets/images/login/go_home.png" style="height:40px;"/>
                        </a>
                    </div>
                    <!-- 查询商品 -->
                    <div class="inner_right">
                       <div style="display:flex;">
                            <Input v-model="genrename" @on-enter="searchGoods('BB')">
                                <Select v-model="genre" slot="prepend" :placeholder="i18n.placeholdertip" @on-change="changeGen(genre)">
                                    <Option v-for="item in genreList" :value="item.value" :key="item.value">{{item.name}}</Option>
                                </Select>
                            </Input>
                            <Button slot="append" icon="ios-search" @click="searchGoods('BB')" style="z-index:99;"></Button>
                       </div>
                        <div>
                            <a class="newArrivals" v-for="(item,index) in i18n.lineList" :key="index" :title="item.label" @click="specialSearch(item.label, 'BB')">{{item.label}}</a>
                        </div>
                    </div>
                    <!-- 购物车 -->
                    <div @click="$router.push({path: '/cart'})" class="shopcar">
                        <div class="shopcart_left">
                            <i class="iconfont icon-gouwuche" style="font-size:36px;margin-right:10px;"></i>
                        </div>
                        <div class="shopcart_right">
                            <p>{{i18n.quality}}<span>{{pageNum}}</span></p>
                            <p>{{i18n.amount}}<span>￥{{listPrice}}</span></p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="search_bottom">
                <div class="inner_bottom">
                    <ul class="inner_middle">
                        <!-- <li class="home_page" @click="$router.push({path: '/enter'})"><i class="icon-liuliangyunpingtaitubiao02 iconfont" style="font-size:20px;"></i>{{i18n.home}}</li> -->
                        <!-- v-if="$root.isAllGoods" -->
                        <li  @mouseenter="isShowGoods=true"  @mouseleave="allGoodsLeave" @click="searchGoods('AA')">
                            <a>{{i18n.classification}}</a>
                            <Icon type="arrow-down-b" size="16" style="color:#fff;"></Icon>
                        </li>
                        <li>
                            <i class="iconfont icon-yushouhuore" style="color:#f56c6c;font-size: 22px;"></i>
                            <a class="newArrivals" @click="specialSearch(i18n.advance, 'J')">
                                {{i18n.advance}}
                            </a>
                        </li>
                        <li>
                            <i class="iconfont icon-xinpin" style="color:#f4ea2a;font-size: 22px;"></i>
                            <a class="newArrivals" @click="specialSearch(i18n.NewArrivals, 'A')">{{i18n.NewArrivals}}</a>
                        </li>
                        <li>
                            <i class="iconfont icon-fangyikouzhaocopyx" style="color:#1afa29;font-size: 26px;"></i>
                            <a class="newArrivals" @click="specialSearch(i18n.prevention, 'K')">
                                {{i18n.prevention}}
                            </a>
                        </li>
                        <li v-if="$root.ipList.length!==0">
                            <Dropdown>
                                <a href="javascript:void(0)">
                                    {{i18n.IpGoods}}
                                    <Icon type="ios-arrow-down"></Icon>
                                </a>
                                <DropdownMenu slot="list" class="ipList">
                                    <DropdownItem v-for="item in $root.ipList" :key="item.id" @click.native="searchGoods(item.id)">{{item.name}}</DropdownItem>
                                </DropdownMenu>
                            </Dropdown>
                        </li>
                        <li v-if="discountData.length!==0" class="discount_list">
                            <Dropdown>
                                <a href="javascript:void(0)">
                                    <Icon type="md-pricetags" size="24" color="#40fff8"/>
                                    {{i18n.discountName}}
                                    <Icon type="ios-arrow-down"></Icon>
                                </a>
                                <DropdownMenu slot="list" class="ipList">
                                    <DropdownItem v-for="(item,index) in discountData" :key="index" @click.native="$router.push({path: '/searchKey', query: {keyword:item.name, discount:item.id, select: 'D'}});">{{item.name}}</DropdownItem>
                                </DropdownMenu>
                            </Dropdown>
                        </li>
                        <li>
                            <svg t="1586842993005" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="16378" height="30"><path d="M799.06584 627.755322c-11.405371 0-22.902722-4.323004-31.640708-13.06099L707.914848 555.184047c-17.383994-17.475972-17.383994-45.805443 0-63.189436l59.510284-59.510285c17.383994-17.475972 45.805443-17.383994 63.189437 0l59.510285 59.510285c17.475972 17.383994 17.475972 45.805443 0 63.189436L830.706548 614.694332c-8.737986 8.737986-20.235336 13.06099-31.640708 13.06099z m0-174.483787c-2.759364 0-5.518728 1.011767-7.63424 3.127279l-59.510285 59.510285c-4.231025 4.231025-4.231025 11.037456 0 15.268481l59.510285 59.510285c4.231025 4.231025 11.037456 4.231025 15.268481 0l59.510285-59.510285c4.231025-4.231025 4.231025-11.037456 0-15.268481l-59.510285-59.510285c-2.115512-2.115512-4.874876-3.127279-7.634241-3.127279zM224.93416 628.67511c-11.405371 0-22.902722-4.323004-31.640708-13.06099l-59.510285-59.510285c-17.383994-17.383994-17.383994-45.805443 0-63.189436l59.510285-59.510285c17.383994-17.475972 45.805443-17.383994 63.189437 0l59.510284 59.510285c17.383994 17.383994 17.383994 45.805443 0 63.189436L256.574868 615.61412c-8.737986 8.737986-20.235336 13.06099-31.640708 13.06099z m0-174.483787c-2.759364 0-5.518728 1.011767-7.634241 3.127279l-59.510285 59.510285c-4.231025 4.231025-4.231025 11.037456 0 15.268481l59.510285 59.510285c4.231025 4.231025 11.037456 4.231025 15.268481 0l59.510285-59.510285c4.231025-4.231025 4.231025-11.037456 0-15.268481l-59.510285-59.510285c-2.115512-2.115512-4.874876-3.127279-7.63424-3.127279z" fill="#840000" p-id="16379"></path><path d="M759.606934 567.049313L552.470673 774.093596c-23.730531 23.730531-62.269649 23.730531-86.092159 0L259.334232 567.049313c-23.730531-23.730531-23.730531-62.269649 0-86.092159l207.136261-207.136261c23.730531-23.730531 62.269649-23.730531 86.092159 0l207.136261 207.136261c23.638552 23.730531 23.638552 62.269649-0.091979 86.092159z" fill="#FF4633" p-id="16380"></path><path d="M509.424594 808.861583c-20.787209 0-40.286715-8.094135-55.003324-22.810743L247.285009 579.006557c-30.353005-30.353005-30.353005-79.745621 0-110.098626l207.044282-207.136261c30.353005-30.353005 79.745621-30.353005 110.098626 0l207.136262 207.136261c14.716608 14.716608 22.810743 34.216114 22.810742 55.003324 0 20.787209-8.094135 40.286715-22.810742 55.003323L564.427917 786.05084c-14.624629 14.716608-34.216114 22.810743-55.003323 22.810743z m0-535.868499c-11.221414 0-22.442828 4.231025-30.996857 12.877032L271.291476 492.914399c-17.108057 17.108057-17.108057 44.977634 0 62.085691l207.136261 207.044283c8.278092 8.278092 19.315548 12.877032 30.996857 12.877032s22.718764-4.59894 30.996856-12.877032l207.136261-207.044283c8.278092-8.278092 12.877032-19.315548 12.877033-30.996856 0-11.773287-4.59894-22.718764-12.877033-31.088835L540.513429 285.870116c-8.554029-8.554029-19.867421-12.877032-31.088835-12.877032zM509.240636 158.939369c-9.381838 0-16.9241-7.634241-16.9241-16.924099v-125.09117c0-9.381838 7.634241-16.9241 16.9241-16.9241 9.381838 0 16.9241 7.634241 16.924099 16.9241v125.09117c0 9.381838-7.542262 16.9241-16.924099 16.924099z" fill="#840000" p-id="16381"></path><path d="M570.498518 970.008443v-102.09647c0-34.492051-28.237492-62.637564-62.637564-62.637564-34.492051 0-62.637564 28.237492-62.637564 62.637564v102.188449c0 16.280248 13.244947 29.525195 29.525195 29.525196h66.316716c16.188269-0.091979 29.433217-13.336926 29.433217-29.617175z" fill="#FFAC33" p-id="16382"></path><path d="M540.973323 1016.457738h-66.316717c-25.662086 0-46.449295-20.879188-46.449294-46.449295v-102.09647c0-43.873888 35.687775-79.653642 79.653642-79.653642 43.873888 0 79.653642 35.687775 79.653642 79.653642v102.09647c-0.091979 25.662086-20.879188 46.449295-46.541273 46.449295z m-33.112369-194.259229c-25.202192 0-45.713464 20.511273-45.713465 45.713464v102.09647c0 6.89841 5.610707 12.509117 12.509117 12.509117h66.316717c6.89841 0 12.509117-5.610707 12.509117-12.509117v-102.09647c0.091979-25.202192-20.419294-45.713464-45.621486-45.713464z" fill="#840000" p-id="16383"></path><path d="M425.553723 314.597855l23.999109-23.999109 293.127243 293.127243-23.999109 23.999109z" fill="#840000" p-id="16384"></path><path d="M353.483733 386.781899l23.999109-23.999109 293.127243 293.127243-23.999109 23.999109z" fill="#840000" p-id="16385"></path><path d="M279.070123 461.199188l23.999109-23.999109 293.127243 293.127243-23.999109 23.999109z" fill="#840000" p-id="16386"></path><path d="M278.967107 583.868557l293.127243-293.127244 23.998189 23.999109-293.127243 293.127243z" fill="#840000" p-id="16387"></path><path d="M351.15207 655.941306l293.127244-293.127243 23.999109 23.999109-293.127244 293.127243z" fill="#840000" p-id="16388"></path><path d="M425.56936 730.350317l293.127243-293.127243 23.999109 23.999109-293.127243 293.127243z" fill="#840000" p-id="16389"></path><path d="M507.125124 199.042127m-52.611875 0a52.611875 52.611875 0 1 0 105.223749 0 52.611875 52.611875 0 1 0-105.223749 0Z" fill="#FF3000" p-id="16390"></path><path d="M507.125124 268.578101c-38.35516 0-69.627953-31.180814-69.627953-69.627953 0-38.35516 31.180814-69.627953 69.627953-69.627953s69.627953 31.180814 69.627952 69.627953-31.272793 69.627953-69.627952 69.627953z m0-105.223749c-19.683464 0-35.687775 16.004312-35.687776 35.687775s16.004312 35.687775 35.687776 35.687775 35.687775-16.004312 35.687775-35.687775-16.004312-35.687775-35.687775-35.687775z" fill="#840000" p-id="16391"></path><path d="M408.523848 155.81209c-20.879188 2.391449-39.734842-12.417138-42.402228-33.204347-18.487739 4.506961-31.088835 22.166891-28.881343 41.574418 2.483428 20.971167 21.431061 36.05569 42.402227 33.572263 20.971167-2.483428 36.05569-21.431061 33.572263-42.402228 0-0.091979 0-0.183958-0.091979-0.367915-1.471661 0.367915-3.0353 0.643852-4.59894 0.827809z" fill="#840000" p-id="16392"></path><path d="M251.056139 205.020749c13.06099 31.272793-1.655618 67.144525-32.744453 80.389473 15.176502 26.673853 48.196892 38.447139 77.170215 26.305937 31.45675-13.06099 46.357316-49.208659 33.204347-80.665409-13.06099-31.45675-49.208659-46.357316-80.665409-33.204347-0.183958 0.091979-0.275936 0.183958-0.459894 0.183957 1.287703 2.29947 2.483428 4.59894 3.495194 6.990389z" fill="#840000" p-id="16393"></path></svg>
                            <a class="newArrivals" @click="specialSearch(i18n.chinaProduct, 'F')">{{i18n.chinaProduct}}</a>
                        </li>
                        <!-- <li>
                            <a class="newArrivals" @click="specialSearch(i18n.Latest, 'B')">{{i18n.Latest}}</a>
                        </li>
                        <li>
                            <a class="newArrivals" @click="specialSearch(i18n.oneOrder, 'E')">{{i18n.oneOrder}}</a>
                        </li> -->
                        <!-- <li>
                            <a class="newArrivals" @click="$router.push({path: '/searchKey', query: {keyword: i18n.clearance, select: 'D'}})">{{i18n.clearance}}</a>
                        </li> -->
                        <!-- <li v-for="(item,index) in $root.goodsType" :key="index" :title="item.cls_name"  @click="goTypeList(item)">
                            <a>{{item.cls_name}}</a>
                        </li> -->
                    </ul>
                    <p class="signOut" @click="isLoginReady=true;">{{i18n.signOut}}</p>
                    <div class="goods_list" v-if="isShowGoods" :class="{objClass:$root.isAllGoods}"  @mouseleave="allGoodsLeave">
                        <div class="googs_inner" @mouseleave="mouseLeaveTitle" @mouseenter="goodsMouseEnter">
                            <ul class="goods_inner_title">
                                <li v-for="(item,index) in $root.goodsType" :key="index" :class=" {active:current === index}" :title="item.cls_name" @mouseenter="mouseOverTitle(item,index)" @click="goTypeList(item)">
                                    <a >
                                        {{item.cls_name}}
                                    </a>
                                    <Icon type="ios-arrow-forward" />
                                </li>
                            </ul>
                            <div class="list_type"  v-if="isShowList">
                                <ul class="type_contanier">
                                    <li v-for="(item,index) in $root.goodsSmallType" :key="index" class="list_type_detail">
                                        <span class="detail_name">
                                            <a @click="goTypeList(item)" :title="item.cls_name" class="second_cla">{{item.cls_name}} </a>
                                            <Icon type="ios-arrow-forward" />
                                        </span>
                                        <a class="detail_item" v-for="(ele,i) in item.child" @click="goTypeList(ele)"  :key="i" :title="ele.cls_name">
                                            <a class="three_cla">{{ele.cls_name}}</a>
                                            <span> |</span>
                                        </a> 
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- 退出提示 -->
        <Modal v-model="isLoginReady" draggable  :title="i18n.outTips" @on-ok="loginOut" @on-cancel="isLoginReady" class="app_header_loginOut">
            <p style="font-size:16px;">{{i18n.determine}}</p>
        </Modal>
    </div>
</template>

<script>
import { mapState, mapGetters, mapMutations,mapActions } from 'vuex';
import bus from '@/assets/js/eventBus.js'
import {delCookie} from  '@/assets/js/tool.js'
import "@/assets/style/animate.less";                             // 引入动画样式
import NProgress from 'nprogress'   // 引入进度条
import 'nprogress/nprogress.css'    // 引入进度条
export default {
    data(){
        return {
            isAccount: false,
            // 是否显示退出登录提示框
            isLoginReady: false,
            current: -1,
            // 初始的动画效果
            animationType:"animated", 
            helloText:'',
            // 用户名
            username: localStorage.uname,
            // 退出失败提示
            loginOutTip: this.$t('headerPage').loginOutTip,
            // 选中哪个语言 
            langSelect: 3,
            // 语言图片
            LangImg: require('@/assets/images/ovearheader/china.png'),
            // 语言名称
            langText: '',
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
            // 商品类别
            genre: '',
            // 活动数据
            genreList: this.$t('headerPage').genreList,
            // 搜索框关键词
            genrename: '',
            // 推荐商品
            recommendList: this.$t('headerPage').recommendList,
            // 不能输入空商品名查询
            keyworkTip: this.$t('headerPage').keyworkTip,
            // 输入框里固定数据
            inputData: [],
            isShowCar: false,
            // 是否显示商品分类
            isShowList: false,
            // 是否显示左侧大的商品分类数据
            isShowGoods: false,
            // 时间延迟
            mousetimer: null,
            // 鼠标移入购物车白色购物车是否存在
            isShowEnter: true,
            // 退出登录成功提示
            loginOutSuccess: this.$t('headerPage.loginOutSuccess'),
            // ip系列数据
            IpListData: [],
            // 是否是全屏显示
            fullscreen: false,
            // 折扣商品数据
            discountData: [],
        }
    },
    mounted() {
        $(document).on('mousedown.input', () => {
            this.$root.isKeyword = true;
        });
    },
    destroyed() {
        $(document).off('mousedown.input');
    },
    computed: {
        // 引入headerPage里的中英文
        i18n() {
            return this.$t('headerPage') 
        },
        ...mapState([
            'headerCartData',
        ]),
        ...mapGetters([
            'totalPrice',
            'cartNum',
            'listNum',
            'pageNum',
            'listPrice',
        ]),
        optionSingleHeight () {
            return {
                 // （什么都不设置默认的）
                // singleHeight: 40,     // （带停顿的）
                waitTime:3500 ,        // （停顿时间）
                // direction: 0 ,         // （从上往下的）
                // // direction:2,           // （左右的）
                step:1,           //  （调整速度的）0
                // hoverStop:false       //  (鼠标停留停止 离开继续运行（反之则停止）)
            }
        }
             
    },
    watch: {
        /* '$root.isAllGoods'(val) {
            console.log(val, this.$root.isAllGoods)
            this.isShowGoods = !val;
        }, */
        isShowGoods(val) {
            if(!val) {
                this.current = -1;
            }
        }

    },
   created() {
        this.isShowGoods = false;
        // 获取头部购物车商品总数量和总金额
        this.getCartInfo({
            vm: this
        });
        this.username = localStorage.uname;
        // 判断登录进来选中哪种语言
        this.judgeLanguage();
        // 获取商品类别
        this.getAllCategories();
        // 获取推荐商品
        this.getCommendData();
        // 得到ip类型数据
        this.getIpList();
        // 得到折扣类型数据
        this.getDiscount();
   },
    methods: {
        ...mapMutations([
            'setCartDataList',
            'setCartDataListNum',
            'setTotalPrice',
            'setCartDataCartTypeCate',
            'setPageNum',
        ]),
        ...mapActions([
            'getDataCard',
            'getCartInfo'
        ]),
        /**
         * 得到用户账户余额
         */
        getAccount() {
            NProgress.start()
            this.$resetAjax({
                type: 'POST',
                url: '/Home/Index/get_amt',
                success: (res) =>{
                    NProgress.done()
                    this.isAccount = true;
                    localStorage.account = res;
                    this.$root.account = res;
                }
            })
        },
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
        specialSearch(label, num) {
            $('.ivu-select-selected-value').text(this.i18n.placeholdertip)
            this.$router.push({path: '/searchKey', query: {keyword: label, select: num}})
        },
        /**
         * 背景图动起来
         */
        animateEnter() {
            this.animationType = 'animated pulse'
        },
        /**
         * 背景图恢复原样
         */
        animateLeave() {
            this.animationType = 'animated bounce'
        },
        /**
         * 去后台页面
         */
        goBackStage() {
            localStorage.langBack = localStorage.langSelect;
            this.$router.push({path: '/backStage'});
        },
        /**
         * 得到ip类型数据
         */
        getIpList() {
            this.$resetAjax({
                type: 'GET',
                url: `/home/Goods/get_all_ip`,
                success: (res) => {
                    let arr = [];
                    let result = JSON.parse(res);
                    result.forEach(ele => {
                        switch(localStorage.langSelect) {
                            case '0':
                                arr.push({
                                    id: ele.id,
                                    name: ele.name
                                }) ;
                                break;
                            case '1':
                                arr.push({
                                    id: ele.id,
                                    name: ele.name_en
                                }) ;
                                break;
                        }
                    })
                    this.IpListData = arr;
                    this.$root.ipList = arr;
                }
            })
        },
        /**
         * 得到折扣类型数据
         */
        getDiscount() {
            this.$resetAjax({
                type: 'GET',
                url: `/home/goods/get_off_list`,
                success: (res) => {
                    let result = JSON.parse(res);
                    let arr = [];
                    result.data.sort().forEach((ele,index) => {
                        if(localStorage.langSelect === '0') {
                            arr.push({
                                id: parseInt(Number(ele)),
                                name: `${Number(ele)} 折特价清仓`
                            })
                        } else {
                            arr.push({
                                id: parseInt(Number(ele)),
                                name: `${10-Number(ele)}0% Off Clearance`
                            })
                        }
                    })
                    this.discountData = arr;
                }
            })
        },
        /**
         * 判断登录进来选中哪种语言
         */
        judgeLanguage() {
            let lang = localStorage.language;
            switch(lang) {
                case 'zh':
                    this.langSelect = 0;
                    localStorage.langSelect = this.langSelect;
                    this.LangImg = require('@/assets/images/ovearheader/china.png');
                    this.langText = '中文';
                    break;
                case 'en': 
                    this.langSelect = 1;
                    localStorage.langSelect = this.langSelect;
                    this.langText = 'English';
                    this.LangImg = require('@/assets/images/ovearheader/usa.png');
                    break;
            }
            
        },
        /**
        * 退出登录 
         */
        loginOut() {
            this.$resetAjax({
                type: 'POST',
                url: `/Home/Login/logout`,
                data: {
                    uid: localStorage.uid,
                },
                success: (res) => {
                    let result = JSON.parse(res);
                    let code = result.res;
                    switch(code) {
                        case 'code0':
                            localStorage.uid = '';         // 用户uid
                            localStorage.hdid = '';        // 用户hdid
                            localStorage.isvip = '';       // 用户是否是vip用户
                            localStorage.max_buy = '';     // 用户最大购物商品数量
                            localStorage.language = '';  // 用户在用语言
                            localStorage.uname = '';       // 用户姓名
                            localStorage.account = '';     // 用户余额
                            localStorage.collectLen = '';  // 用户收藏商品数量
                            localStorage.integral = '';    // 用户积分
                            localStorage.cartNum = '';     // 购物车数量
                            localStorage.langSelect = '';   // 默认英文
                            localStorage.cost_num = ''; // 用户因为私货被扣款的金额
                             localStorage.firstPlayFlag = "0"; // firstPlayFlag用来判断私货提示框是否已提醒过（只能提醒一次），0表示未提醒过，1表示已提醒 
                             this.$Message.success({
                                content: this.loginOutSuccess,
                                duration: 1.5
                            });
                            // 判断是否记住密码
                            if(localStorage.remember === 'true') {
                                localStorage.user = localStorage.user;
                                localStorage.pass = localStorage.pass;
                            } else {
                                localStorage.user = '';
                                localStorage.pass = '';
                            }
                            setTimeout(() => {
                                this.$router.push('/login');
                                this.$nextTick(() => {
                                    location.reload();
                                })
                            }, 1800);
                            break;
                        case 'code1':
                            this.$Message.error(this.loginOutTip);
                            break;
                    }
                },
            })
        },
        /**
         * 获取商品类别
         */
        getAllCategories() {
            if(this.$root.goodsType.length !== 0) {
                return false;
            }
            this.$resetAjax({
                type: 'POST',
                url: '/Home/Category/categories_tree1',
                data: {
                    type: localStorage.langSelect,  // 中英文
                },
                success: (res) => {
                    let result = JSON.parse(res)
                    result.forEach(ele => {
                        ele.isSelected = false; // 添加一个属性，让商品每一个大分类为false，方便后续鼠标经过大分类里的小分类大分类颜色为红色
                    });
                    this.$root.goodsType = result;   // 得到商品大分类
                }
            })
        },
        /**
        * 获取推荐商品
        */
        getCommendData() {
            this.$resetAjax({
                type: 'POST',
                url: '/Home/Goods/Recommend',
                data: {
                    lang: localStorage.langSelect,
                    uid: localStorage.uid
                },
                success: (res) => {
                    let result = JSON.parse(res);
                    result.forEach(ele => {
                        ele.imgUrl = `https://ximiphoto.oss-cn-hangzhou.aliyuncs.com/thumb/${ele.item_no}.jpg?x-oss-process=style/800`;
                        ele.spec = Number(ele.purchase_spec);
                        ele.carNum = Number(ele.purchase_spec);
                    });
                    this.$root.commendList = result;
                },
            })
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
            localStorage.langSelect = this.langSelect;
            this.judgeLanguage();
        },
        /**
         *  鼠标移入大盒子商品数据
         */
        goodsMouseEnter() {
            clearTimeout(this.mousetimer)
        },
        /**
         * 离开所有商品
         */
        allGoodsLeave() {
            this.mousetimer = setTimeout(() => {
                this.isShowGoods = false;
            }, 100);
        },
        /**
         * 鼠标移入商品标题
         */
        mouseOverTitle(item,index) {
            // 得到商品小分类
            this.current = index;
            this.$root.goodsSmallType = item.child;
            this.isShowList = true;
        },
        /**
         * 鼠标移出商品标题
         */
        mouseLeaveTitle() {
            this.isShowList = false;
            if(this.$root.isAllGoods) {
                this.isShowGoods = false;
            }
        },
        /**
         * 查询框左边下拉框
         */
        changeGen(value) {
            let name = '';
            this.genreList.forEach(ele => {
                if(ele.value === value) {
                    name = ele.name;
                }
            })
            this.genrename = '';
            $('.ivu-select-selected-value').text(name)
            switch(value) {
                case 'A':
                    // 新产品上线
                    this.$router.push({path: '/searchKey', query: {keyword:name, select:'A'}});
                    break;
                case'B':
                    // 最新补货
                    this.$router.push({path: '/searchKey', query: {keyword:name, select: 'B'}});
                    break;
                /* case 3:
                    // 地区最畅销商品
                    this.$router.push({path: '/searchKey', query: {keyword:name, select: 3}});
                    break; */
                case 'C':
                    // 3折特价清仓(不退换)
                    this.$router.push({path: '/searchKey', query: {keyword:name, select: 'C'}});
                    break;
                case 'D':
                    // 1折特价清仓(不退换)
                    this.$router.push({path: '/searchKey', query: {keyword:name, select: 'D'}});
                    break;
                case 'E':
                    // 一件起订
                    this.$router.push({path: '/searchKey', query: {keyword:name, select: 'E'}});
                    break;
                case 'F':
                    // 中国仓产品
                    this.$router.push({path: '/searchKey', query: {keyword:name, select:'F'}});
                    break;
            }
        },
        /**
         *  搜索商品
         */
        searchGoods(data) {
            $('.ivu-select-selected-value').text(this.i18n.placeholdertip)
            $('.ivu-select-placeholder').text(this.i18n.placeholdertip)
            // this.genre = '';
            // 全部商品
            if(data === 'AA') {
                let name = '';
                if(localStorage.langSelect === '0') {
                    name = '全部商品';
                } else {
                    name = 'All merchandise'
                }
                this.$router.push({path: '/searchKey', query: {keyword: name, select: 'AA'}});
                return false;
            }
            // 商品查询
            if(data === 'BB') {
                if(this.genrename === '') {
                    this.$Message.warning({
                        content: this.keyworkTip,
                        duration: 3
                    });
                    return false;
                }
                this.$root.keywork = this.genrename;
                this.$root.isKeyword = false; // 让输入框里的默认关键词消失
                let value = 0;
                this.genrename = "";
                this.$router.push({path: '/searchKey', query: {keyword: this.$root.keywork, select: 'BB'}})
                return false;
            }
            // IP系列
            let ipName = '';
            this.$root.ipList.forEach(ele => {
                if(ele.id === data) {
                    ipName = ele.name;
                }
            })
            this.$router.push({path: '/searchKey', query: {keyword: ipName, select: data}})
        },
        /**
         * 鼠标经过购物车弹窗里面的li
         */
        mouseenterLi(item) {
            item.shopDelIcon = true;
        },
        /**
         * 跳转到商品分类页面
         */
        goTypeList(item) {
            $('.ivu-select-selected-value').text(this.i18n.placeholdertip)
            this.isShowGoods = false; //鼠标点击商品分类时把商品分类显示左右商品分类隐藏 
            this.genrename = this.$root.keywork = '';
            this.$router.push({path: '/typeList', query: {cls_id: item.cls_id,name: item.cls_name}})
        },
        
    }
    
}
</script>

