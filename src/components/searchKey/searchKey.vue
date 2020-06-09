<template>
    <div class="searchKey">
         <!-- 导航栏 -->
        <div class="type_top">
            <div class="top_inner">
                <Breadcrumb separator=">" class="bg_title">
                    <BreadcrumbItem to="/enter"><i class="icon-liuliangyunpingtaitubiao02 iconfont"></i> {{i18n.home}}</BreadcrumbItem>
                    <BreadcrumbItem class="title_name">{{keyword}}</BreadcrumbItem>
                </Breadcrumb>
            </div>
        </div>
        <!-- 商品列表 -->
        <div class="goods_content">
            <!-- 中国仓的时候会展示商品大类 -->
            <div class="content_inner">
                <!-- 商品分大类 -->
                <div class="cals" v-show="typeValue === 'F'">
                    <span>{{i18n.classSelect}}</span>
                    <ul>
                        <li v-for="(item,index) in classList" :key="item.cls_id" :title="item.cls_name" @click="goodsClass(item.cls_id,index)" :class="{active: currentIndex === index}">{{ item.cls_name }}</li>
                    </ul>
                </div>
                <!-- 配送价选择 -->
                <!-- heat,是热销产品，rec是推荐产品，J是预售产品，这些查询出来的不要配送价选择。 -->
                <div class="clas_price" v-show="typeValue !== 'heat' && typeValue !== 'rec' && typeValue !== 'J' && typeValue !== 'BB'">
                        <span>{{i18n.priceSelect}}：</span>
                        <ul class="price_right">
                            <li v-for="(item, index) in i18n.distributionData" :key="index" :class="{disSelect: disIndex == index}" @click="selectDis(item, index)">{{item.price}}</li>
                        </ul>
                            <!-- <div class="inner_bottom" v-if="typeListData.length !== 0">
                                <div class="bottom_left">分类：</div>
                                <ul class="bottom_right">
                                    <li v-for="(item, index) in typeListData" :key="index" :class="{selected: typeIndex == index}" @click="selectGoodsType(item, index)">{{item.cls_name}}</li>
                                </ul>
                            </div> -->
                    </div>
                <h3 class="recommend">
                    <p>
                        {{i18n.queryResult}}
                    </p>
                    <!-- 查看模式、列表、网格两种模式 -->
                    <div class="recommed_right" style="display:flex;align-items: center;">
                        <span class="check_type" :class="{selected: iconIndex === index}" :title="item.title" v-for="(item,index) in i18n.iconList"  :key="index" @click="changeClass(item,index)" style="margin-right:5px;">
                            <Icon :type="item.icon" size="24"></Icon>
                        </span>
                        <Page  :total="total" :page-size="pageSize" @on-change="changePage" :current="currentPage" simple style="margin-left:15px;"></Page>
                    </div>
                </h3>
                <!-- 商品展示页面 -->
                <ul :class="ulClassStr">
                    <li v-for="(item,index) in goodsData" :key="index">
                        <div style="margin: 0px 0px 18px;border: 1px solid #DEDEDE;position: relative;transition: all .2s ease 0s;">
                            <div class="prod_top" @click="goGoodsDetail(item)">
                                <img v-lazy="item.imgUrl" alt="" @mouseenter="item.isShow='block_class'" @mouseleave="item.isShow='mouse_img'">
                                <!-- 上新商品时间 -->
                                <Tag type="dot" color="#218da0" v-if="item.timeTransform" class="new_time" :title="i18n.newTime">{{item.timeTransform}}</Tag>
                                <!-- 折扣商品倒计时时间 -->
                                <downTime v-show="item.etime !== undefined && item.etime !== '0000-00-00 00:00:00' && typeValue === 'A'" :endTime="new Date(item.etime).getTime()" class="discount_time" :title="i18n.downTimeTips" :itemTime="item.etime" :startTime="new Date(item.time).getTime()" :endMsg="''"/>
                                <!-- 预定商品已拍数量进度条百分比 -->
                                <Tooltip :content="item.progressTip" v-if="typeValue === 'J'"  max-width="200" class="new_Progress" placement="top-start" theme="light" style="width: 100%">
                                    <Progress :percent="item.percent" text-inside  :stroke-color="['#f5582d', '#ffa40d']" status="wrong" :stroke-width="10"/>
                                </Tooltip>
                                <!-- 预定商品截止时间倒计时时间  v-if="item.isDead"-->
                                <Tag type="dot" class="down_time" v-if="typeValue === 'J' && item.isDead">
                                    <downTime v-show="item.deadline !== undefined && item.deadline !== '0000-00-00 00:00:00'" class="down_detail" :endTime="new Date(item.deadline).getTime()" :title="i18n.preColsedDate" :itemTime="item.deadline" :startTime="new Date(item.time).getTime()" :endMsg="''"/>
                                </Tag>
                            </div>
                            <!-- 商品证书说明-->
                            <div class="credential">
                                <a v-for="(ele,index) in item.credential" :key="index" class="certificate" v-show="item.credential.length !== 0">
                                    <Tooltip :content="ele.text" placement="bottom-start" max-width="400">
                                        <!--  :title="i18n.clickView" -->
                                        <img v-for="(list,i) in ele.icon" :src="list" alt="" @click="windowOpen(list)" style="width:25px;height:25px;margin-right:5px;" :key="i">
                                    </Tooltip>
                                </a>
                            </div>
                            <!-- 鼠标移入商品大图 -->
                            <div :class="item.isShow" v-if="ulClassStr === 'content_List'">
                                <img :src="item.imgUrl" alt="">
                            </div>
                            <!-- 预售商品没有收藏功能 -->
                            <p class="isLike" v-if="typeValue !== 'J'" @click="collectGoods(item)">
                                <Icon type="ios-heart" size="30" color="red" v-if="item.like === 1" />
                                <Icon type="ios-heart" size="30" color="rgb(83, 210, 232)" v-else />
                            </p>
                            <div class="prod_info">
                                <!-- 预售产品没有商品编码 item_no -->
                                <div class="prod_title" v-if="item.item_no && typeValue !== 'J'">
                                    <h3>
                                        <span >{{item.item_no}}</span>
                                        <span style="width: 24px;height:20px;display:inline-block;">
                                            <Icon type="md-copy" size="20" class="copy_icon" :title="i18n.copyContent" v-clipboard:copy="item.item_no" v-clipboard:success="onCopy" v-clipboard:error="onError" />
                                        </span>
                                    </h3>
                                </div>
                                <div class="prod_name" :title="item.item_name">
                                    <p>{{item.item_name}}</p>
                                </div>
                                <div class="prod_price">
                                    <p class="unit">{{i18n.unit}}
                                        <span v-show="item.discount">￥{{item.discount}}</span>
                                        <span :class="item.discount ? 'baseLine' : ''">￥{{item.base_price}}</span>
                                    </p>
                                    <p class="export">{{i18n.export}}<span>￥{{item.ling }}</span></p>
                                </div>
                                <addCartPrice :multipleNum="item.spec" :InitPrice="item.spec" @onChange="shopChange($event,item)" class="change_num"></addCartPrice>
                                <!-- 预售商品没有加购物功能 -->
                                <div class="prod_handle" v-if="typeValue !== 'J'">
                                    <span v-show="!item.isAddShow" style="color:#ed4014;font-size:15px;"><Icon type="md-flash" />{{i18n.Shortage}}</span>
                                    <a class="add_handle" v-show="item.isAddShow">
                                        <span @click="addShop(item)" class="add_shop">{{i18n.addCart}} </span>
                                        <span :title="i18n.cnumTips" class="cnum_tips" :style="item.cnum === 0 ? 'color:#333' : 'color:#D92524'">[ {{item.cnum}} ]</span>
                                        <Icon type="md-trash" size="24" v-show="item.cnum !== 0" class="trash" @click="delCart(item)" :title="i18n.delTips" />
                                      
                                    </a>
                                </div>
                                <!-- 没有超过预售截止时间、有预售目标数量的，有预定功能 -->
                                <div class="prod_handle" v-if="typeValue === 'J' && item.isDead">
                                    <a class="add_handle">
                                        <span class="add_shop" @click="orderGoods(item)" :title="i18n.clickOrder">{{i18n.addOrder}}</span>
                                        <span :title="item.cnumTitle" class="cnum_tips" :style="item.goods_order === 0 ? 'color:#333' : 'color:#dd0017'">[ {{item.goods_order}} ]</span>
                                       
                                    </a>
                                </div>
                                <!-- 没有超过预售截止时间，没有预售目标数量的，有预定功能 -->
                                <p class="prod_handle"  v-if="typeValue === 'J' && !item.isDead" style="font-size:16px;color:#d92524;">{{i18n.preColsed}}</p>
                                <!-- <div class="order_num" v-if="typeValue === 'J'">
                                    <p class="order_total">{{item.cnum}} {{i18n.totalTotal}}</p>
                                    <p :title="item.cnumTitle" class="cnum_tips">{{i18n.userOrder}}： {{item.goods_order}}</p>
                                </div> -->
                            </div>
                        </div>
                    </li>
                </ul>
                <!-- 如果商品数据为空时显示 -->
                <div class="empty_content" v-show="isShowEmpty" style="display: flex;justify-content: center;font-size: 20px;margin: 100px 0 30px 0;color: #0e434c;">
                    <p>{{i18n.emptyData}}</p>
                </div>
                <div class="pageContanier" v-if="isPageShow&&total!==0">
                    <Page :total="total" :page-size="pageSize" @on-change="changePage" :current="currentPage" show-elevator show-total></Page>
                </div>
            </div>
        </div>
        
    </div>
</template>

<script>
import {getUrlParams} from  '@/assets/js/tool.js'
import addCartPrice from '../common/addCart-price.vue'   // 引入input加购购物车
import { mapState, mapActions } from 'vuex';
import NProgress from 'nprogress'   // 引入进度条
import 'nprogress/nprogress.css'    // 引入进度条
import downTime from '@/components/cart/downTime'  // 倒计时
export default {
    components: {
        addCartPrice,
        downTime
    },
    data() {
        return {
            // 商品大类选择
            calssValue: "",
            // 选择到哪个价格
            disIndex:0,
            // 中国仓时商品大类的数据
            classList: [],
            // 商品大类选中哪个
            currentIndex: 0,
            // 加购物车成功
            addSuccTip: this.$t('searchPage.addSuccTip'),
            // 加购物车失败
            adderrTip: this.$t('searchPage.adderrTip'),
            // 收藏成功提示
            collectSuccess: this.$t('searchPage.collectSuccess'),
            // 收藏失败提示
            collectError: this.$t('searchPage.collectError'),
            // 得到网址的参数对象
            urlParams: {},
            defaultImg: 'http://dh.xmcpcn.com/Public/images/none.jpg',
            // 查看模式
            iconList: [
                {
                    title: '网格模式',
                    icon: 'grid'
                },
                {
                    title: '列表模式',
                    icon: 'navicon-round'
                }
            ],
            // 点击选中哪个查看模式
            iconIndex: 0,
            // 商品展示样式名称
            ulClassStr: 'line_list',
            // 商品数据
            goodsData: [],
            // 商品总数
            total: 0,
            // 每页条数
            pageSize: 20,
             // 当前页码
            currentPage: 1,
            // 是否显示内容为空提示的图片
            isShowEmpty: false,
            // 带过来的关键词
            keyword: '',
            // 是否要分页展示
            isPageShow: true,
            // 活动和搜索各自区分
            typeValue: '',
            // 单个商品购物车删除成功提示
            delItemSuccess:this.$t('searchPage.delItemSuccess'), 
            // 单个商品购物车删除失败提示
            delItemError: this.$t('searchPage.delItemError'),
            // 复制成功提示
            copySuccess: this.$t('searchPage.copySuccess'),
            // 复制失败提示
            copyError: this.$t('searchPage.copyError'),
            // 预定商品成功提示
            orderSuccTips:this.$t('searchPage.orderSuccTips'),
            // 预定商品失败提示
            orderErrorTips: this.$t('searchPage.orderErrorTips'),
            // 预定商品余额不足，预定失败提示
            balanceLow: this.$t('searchPage.balanceLow'),
            // 删除预售商品成功提示
            orderDelSucc: this.$t('searchPage.orderDelSucc'),
            // 删除预售商品失败提示
            orderDelErr: this.$t('searchPage.orderDelErr'),
            price_min:'',
            price_max:'',
            // 加购的规格不是倍数
            mastSpec:this.$t('searchPage.mastSpec'),
            // 打折商品折扣
            discountID: '',
        }
    },

    created() {
        // 得到网址参数
        this.getUrlParams();
    },
    watch: {
        '$route' (to, from) {
            // 配送价点击显示
            this.disIndex = 0;
            // 最低价格
            this.price_min = "";
            // 最高价格
            this.price_max = "";
            // 商品类别选择
            this.calssValue = '';
            // 商品大类点击显示为0
            this.currentIndex = 0;
            this.getUrlParams();
        }
    },
    computed: {
        i18n() {
            return this.$t('searchPage')
        },
        ...mapState([
            'headerCartData'
        ]),
        // 购物车页面展示数据
        cartData() {
            let data = {
                list: [],
                num: 0,
                totalPrice: 0
            };
            data.list.forEach(item => {
                data.num += Number(item.num);
                // 放大100倍，防止js小数点计数有问题
                data.totalPrice += Number(item.org_xj) * 100;
            });
            data.totalPrice = data.totalPrice / 100;
            return data;
        }
    },
    methods: {
        defImg() {
            let img = event.srcElement;
            img.src = this.defaultImg;
            img.onerror = null; //防止闪图
        },
        ...mapActions([
            'getCartInfo'
        ]),
        /**
         * 获取商品类别
         */
        getAllCategories(callback) {
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
                    typeof callback === 'function' && callback()
                }
            })
        },
        // 复制成功时的回调函数
        onCopy (e) {
            this.$Message.success({
                content: this.copySuccess,
                duration: 3
            });
        },
        // 复制失败时的回调函数
        onError (e) {
            this.$Message.error({
                content: this.copyError,
                duration: 3
            });
        },
        /**
         * 打开证书图标大图
         */
        windowOpen(url) {
            window.open(url)
        },
        /**
         * 选择类别
         */
        goodsClass(cls_id,index) {
            this.currentIndex = index;
            this.calssValue = cls_id;
            this.currentPage = 1;
            this.sameQuery("1", 0);
        },
        /**
         * 根据网址参数进行分析
         */
        getUrlParams() {
            this.urlParams = getUrlParams(); 
            this.keyword = this.urlParams.keyword;
            this.typeValue = this.urlParams.select;  
            this.discountID = this.typeValue === 'D' ? this.urlParams.discount : '';
            NProgress.start();  // 进度条开始
            this.isShowEmpty = false;
            this.currentPage = 1;
            this.switchList();
        },
        /**
         * 得到预售商品
         */
        getPreSale() {
            this.$resetAjax({
                type: 'GET',
                url: `/home/Presell/index`,
                data: {
                    page: this.currentPage,
                    lang: localStorage.langSelect,
                },
                success: (res) => {
                    NProgress.done(); // 进度条结束
                    let result = JSON.parse(res).data;
                    if(result.data !== null && result.data.length !== 0) {
                        result.data.forEach(ele => {
                            ele.imgUrl = ele.img;
                            ele.spec = ele.lot_spec;
                            ele.carNum = ele.lot_spec;
                            ele.ling = ele.sale_price;
                            ele.cnum  = ele.goods_order === null ? 0 : ele.goods_order;
                            ele.order_num = ele.order_num === null ? 0 : ele.order_num;
                            ele.isShow = 'mouse_img';
                            ele.isDead = false;  // 预售商品是否已超过预售截止时间
                            switch(localStorage.langSelect) {
                                case '0':
                                    ele.cnumTitle =`该商品您已预定${ele.goods_order}件`;
                                    ele.progressTip = `预购数量：${ele.target} 件（已预购${ele.order_num}件）`
                                    break;
                                case '1':
                                    ele.cnumTitle = `You have reserved ${ele.goods_order} pieces of this product`;
                                    ele.progressTip = `Pre-order amount: ${ele.target} pieces (${ele.order_num} pieces are pre-ordered)`
                                    break;
                            }
                            ele.percent = Number(((ele.order_num / ele.target) * 100 ).toFixed(2))
                            // 当预售商品没有到截止时间并且有预售目标数量，且已预定的数量不能超过目标预售数量，才能够进行预定
                            if((Date.parse(ele.deadline) > Date.parse(ele.time)) && ele.target > 0 && Number(ele.order_num) < Number(ele.target) && ele.percent < 100) {
                                ele.isDead = true;
                            }
                        });
                        this.goodsData = result.data;
                        // 复杂分页里的商品总数
                        this.isPageShow = true;
                        this.total = Number(result.total);
                    } else {
                        this.goodsData = [];
                        this.isShowEmpty = true;
                        this.total = 0;
                    }
                   
                },
            })
        },
        /**
         * 预定商品请求
         */
        orderGoods(item) {
            this.$resetAjax({
                type: 'POST',
                url: '/home/presell/checkout',
                data: {
                    gid: item.id,     // 预定商品编码
                    qty: item.carNum, // 预定商品数量
                },
                success: (res) => {
                    let result = JSON.parse(res);
                    let msg = result.errorcode;
                    switch(msg) {
                        case 0:
                            this.$Message.success({
                                content: this.orderSuccTips,
                                duration: 3
                            });
                            this.getCartInfo({
                                vm: this
                            });
                            item.cnum = Number(result.data.totle_order); // 当前用户预定该商品的数量
                            item.order_num = Number(result.data.num); // 该件商品的所有用户下单总数
                            item.percent = Number(((item.order_num / item.target) * 100 ).toFixed(2))
                            item.goods_order = Number(result.data.totle_order);
                            switch(localStorage.langSelect) {
                                case '0':
                                    item.cnumTitle =`该商品您已预定${item.goods_order}件`;
                                    item.progressTip = `预购数量：${item.target} 件（已预购${item.order_num}件）`
                                    break;
                                case '1':
                                    item.cnumTitle = `You have reserved ${item.goods_order} pieces of this product`;
                                    item.progressTip = `Pre-order amount: ${item.target} pieces (${item.order_num} pieces are pre-ordered)`
                                    break;
                            }
                             // 当预售商品没有到截止时间并且有预售目标数量，且已预定的数量不能超过目标预售数量，才能够进行预定
                            if(item.percent >= 100) {
                                item.isDead = false;
                            }
                            break;
                        case 4 :
                        // 定金不足
                            this.$Message.error({
                                content: this.balanceLow,
                                duration: 3
                            });
                            break;
                        case 5 :
                        // 预售结束
                            this.$Message.error({
                                content: this.orderErrorTips,
                                duration: 3
                            });
                            break;
                    }
                },
            })
        },
        /**
         * 删除该预售商品订单
         */
        delOrder(item) {
            this.$resetAjax({
                type: 'POST',
                url: '/home/presell/delorder',
                data: {
                    gid: item.id,     // 预定商品编码
                },
                success: (res) => {
                    let result = JSON.parse(res);
                    let msg = result.errorcode;
                    switch(msg) {
                        case 0:
                            this.$Message.success({
                                content: this.orderDelSucc,
                                duration: 3
                            });
                            this.getCartInfo({
                                vm: this
                            });
                            item.cnum = Number(result.data.num); // 当前购物车该商品的数量
                            break;
                        default:
                            this.$Message.error({
                                content: this.orderDelErr,
                                duration: 3
                            });
                            break;
                    }
                },
            })
        },
        /**
         * 得到热卖产品数据
         */
        getHeatGoods() {
            this.$resetAjax({
                type: 'POST',
                url: `/Home/Goods/heat&page=${this.currentPage}`,
                data: {
                    lang: localStorage.langSelect,
                },
                success: (res) => {
                    NProgress.done(); // 进度条结束
                    let result = JSON.parse(res);
                    if(result.list !== null && result.list.length !== 0) {
                        result.list.forEach(ele => {
                            ele.imgUrl = `https://ximiphoto.oss-cn-hangzhou.aliyuncs.com/thumb/${ele.item_no}.jpg?x-oss-process=style/300`;
                            ele.spec = Number(ele.purchase_spec)
                            ele.carNum = ele.purchase_spec;
                            ele.ling = ele.sale_price;
                            ele.isShow = 'mouse_img';
                            // 是否有加购操作
                            ele.isAddShow = true;
                            // ele.cnumTitle =`购物车已有${ele.cnum}件`;
                        });
                        this.goodsData = result.list;
                        // 复杂分页里的商品总数
                        this.isPageShow = true;
                        this.total = Number(result.count);
                    } else {
                        this.goodsData = [];
                        this.isShowEmpty = true;
                        this.total = 0;
                    }
                   
                },
            })
        },
        /**
         * 得到推荐产品数据
         */
        getRecGoods() {
            this.$resetAjax({
                type: 'POST',
                url: `/Home/Goods/Recommend&page=${this.currentPage}`,
                data: {
                    lang: localStorage.langSelect,
                },
                success: (res) => {
                    NProgress.done(); // 进度条结束
                    let result = JSON.parse(res);
                    if(result.list !== null && result.list.length !== 0) {
                        result.list.forEach(ele => {
                            ele.imgUrl = `https://ximiphoto.oss-cn-hangzhou.aliyuncs.com/thumb/${ele.item_no}.jpg?x-oss-process=style/300`;
                            ele.spec = Number(ele.purchase_spec)
                            ele.carNum = ele.purchase_spec;
                            ele.ling = ele.sale_price;
                            ele.isShow = 'mouse_img';
                            // 是否有加购操作
                            ele.isAddShow = true;
                            // ele.cnumTitle =`购物车已有${ele.cnum}件`;
                        });
                        this.goodsData = result.list;
                        // 复杂分页里的商品总数
                        this.isPageShow = true;
                        this.total = Number(result.count);
                    } else {
                        this.goodsData = [];
                        this.isShowEmpty = true;
                        this.total = 0;
                    }
                },
            })
        },
        /**
         * 得到IP系列商品数据
         */
        getIPListData() {
            this.$root.ipList.forEach(ele => {
                if(String(ele.id) === this.typeValue) {
                    this.keyword  = ele.name;
                }
            })
            this.$resetAjax({
                type: 'GET',
                url: `/home/Goods/get_goods`,
                data: {
                    page: this.currentPage,       // 分页
                    lang: localStorage.langSelect, // 中英文
                    ip: this.typeValue,  // ip系列ID
                },
                success: (res) => {
                    NProgress.done(); // 进度条结束
                    let result = JSON.parse(res);
                    if(result.msg === 'error') {
                        this.goodsData = [];
                        this.total = 0;
                        return false;
                    } 
                    result.data.data.forEach(ele => {
                        ele.imgUrl = `http://hwimg.xmvogue.com/thumb/${ele.item_no}.jpg?x-oss-process=style/440`,
                        ele.spec = Number(ele.spec);
                        ele.carNum = ele.spec;
                        ele.isShow = 'mouse_img';
                        // 是否有加购操作
                        ele.isAddShow = true;
                        // ele.cnumTitle =`购物车已有${ele.cnum}件`;
                    });
                    this.goodsData = result.data.data;
                    this.keyword = result.name;
                    // 复杂分页里的商品总数
                    this.isPageShow = true;
                    this.total = Number(result.data.total);
                }
            })
        },
        /**
         * 清除购物车里的该商品
         */
        delCart(item) {
            NProgress.start();
            this.$resetAjax({
                type: 'POST',
                url: `/Home/Cart/delCart`,
                data: {
                    uid: localStorage.uid,
                    sn: item.item_no
                },
                success: (res) => {
                    NProgress.done();
                    let result = JSON.parse(res).result;
                    if(result === 'ok') {
                        this.$Message.success({
                            content: this.delItemSuccess,
                            duration: 3
                        });
                        /* this.getDataCard({
                            vm: this,
                            inland: '',
                            page: 1
                        }); */
                        // 获取头部购物车商品总数量和总金额
                        this.getCartInfo({
                            vm: this
                        }); 
                        item.cnum = 0;
                    } else{
                        this.$Message.error({
                            content: this.delItemError,
                            duration: 3
                        });
                    }
                },
            })
        },
        /**
         * 得到搜索商品结果数据
         */
        getGoodsData() {
            this.$resetAjax({
                type: 'POST',
                url: `/Home/user/search&ser_key=${this.keyword.trim()}&p=${this.currentPage}`,
                data: {
                    lang: localStorage.langSelect,
                },
                success: (res) => {
                    NProgress.done(); // 进度条结束
                    let result = JSON.parse(res);
                    this.keyword = result.get.ser_key;
                    if(result.list !== null && result.list.length !== 0) {
                        result.list.forEach(ele => {
                            ele.imgUrl = `https://ximiphoto.oss-cn-hangzhou.aliyuncs.com/thumb/${ele.item_no}.jpg?x-oss-process=style/300`;
                            ele.spec = Number(ele.spec)
                            ele.carNum = ele.spec;
                            ele.isShow = 'mouse_img';
                            // display_flag=0代表下线 
                            // ele.stock_num - ele.cart_num - ele.sale_num >= ele.spec; 用来判断是否有库存
                            // 如果是下线或者库存不足，不能加购操作
                            ele.isAddShow = ele.display_flag &&  ele.stock_num - ele.cart_num - ele.sale_num - ele.cnum !== 0 &&  ele.stock_num - ele.cart_num - ele.sale_num - ele.cnum> 0;
                            // ele.cnumTitle =`购物车已有${ele.cnum}件`;
                        });
                        this.goodsData = result.list;
                        // 复杂分页里的商品总数
                        this.isPageShow = true;
                        this.total = Number(result.other.totalPage);
                    } else {
                        this.goodsData = [];
                        this.isShowEmpty = true;
                        this.total = 0;
                    }
                },
            })
        },
        /**
         * 预售商品进行收藏、取消收藏操作
         */
        advanceCollect(data, index) {
            this.$resetAjax({
                type: 'POST',
                url : '/home/Presell/addlike',
                data: {
                    gid: data.id
                },
                success: (res) => {
                    let result = JSON.parse(res);
                    if(result.errorcode === 0) {
                        this.$Message.success(this.collectSuccess);
                        data.like = data.like === 1 ? 0 : 1;
                    }
                }
            })
        },
        /**
         * 普通商品收藏商品判断
         */
        collectGoods(data,index) {
            switch(this.typeValue) {
                case 'J':
                    // 判断是预售商品还是常规商品
                    this.advanceCollect(data,index);
                    break;
                default:
                    switch(data.like) {
                        case 0:
                            this.addcollect(data);  // 收藏请求
                            break;
                        case 1:
                            this.delcollect(data); // 取消收藏请求
                            break;
                    }
                    break;
            }
        },
        /**
         * 普通商品收藏请求
         */
        addcollect(item) {
            this.$resetAjax({
                type: 'POST',
                url : '/Home/Collect/add',
                data: {
                    sn: item.item_no,
                    uid: localStorage.uid,
                },
                success: (res) => {
                    let result = JSON.parse(res).result;
                    if(result === 'ok') {
                        item.like = 1;
                        this.$Message.success(this.collectSuccess);
                    }
                }
            })
        },
        /**
         * 取消收藏请求
         */
        delcollect(item) {
            this.$resetAjax({
                type: 'POST',
                url: '/Home/Collect/del',
                data: {
                    sn: item.item_no,
                    uid:localStorage.uid,
                },
                success: (res) => {
                    let result = JSON.parse(res);
                    item.like = 0;
                    this.$Message.warning(this.collectError);
                },
            })
        },
        /**
         * 点击查看模式
         */
        changeClass(item,index) {
            this.iconIndex = index;
            if(index === 0) {
                // 网格形式
                this.ulClassStr = 'line_list';
            } else {
                // 列表形式
                this.ulClassStr = 'content_List';
            }
        },
        /**
         * 点击面包屑
         */
        clickBread(item, index) {
            if(item.name === '首页') {
                this.$root.keyword = '';
            }
            this.getGoodsData(item.name);
        },
        /**
         * 跳转到商品详情
         */
        goGoodsDetail(item) {
            let nonum;
            if(this.typeValue === 'J') {
                // 预售商品没有item_no,商品编码
                nonum = item.id;
                // this.$router.push({path: '/goodsDetail',query: {item_no:nonum,advance: 1}})
                var routeData = this.$router.resolve({ name: 'goodsDetail', query: {item_no:nonum,advance: 1}});
                window.open(routeData.href, '_blank');
            } else {
                nonum = item.item_no;
                // 新开页面跳转到商品详情页面
                // this.$router.push({path: '/goodsDetail',query: {item_no:nonum}})
                var routeData = this.$router.resolve({ name: 'goodsDetail', query: {item_no:nonum}});
                window.open(routeData.href, '_blank');
            }
        },
        /**
         * 更该商品的数量
         */
        shopChange(val, item) {
            item.carNum = val;
        },
        /**
         * 加入购物车请求
         */
        addShop(item) {
            if(item.carNum < item.spec) {
                this.$Message.warning({
                    content: this.mastSpec,
                    duration: 3
                })
                return false;
            }
            NProgress.start();
            this.$resetAjax({
                type: 'POST',
                url: '/Home/Cart/addCart',
                data: {
                    sn: item.item_no,
                    num: item.carNum,
                    max_buy: 40, //最大数量加购物
                },
                success: (res) => {
                    NProgress.done();
                    let result = JSON.parse(res);
                    let msg = result.msg;
                    switch(msg) {
                        case 'ok':
                            // 如果库存不够，添加购物车只能成功一部分，给用户提示
                            if(Number(result.num) !== Number(item.carNum)) {
                                switch(localStorage.langSelect) {
                                    case '0':
                                        this.$Message.success({
                                            content: `很抱歉，由于库存不够，${result.num}件商品添加成功`,
                                            duration: 3
                                        });
                                        break;
                                    case '1':
                                        this.$Message.success({
                                            content: `Sorry, ${result.num} items added successfully due to insufficient inventory`,
                                            duration: 3
                                        });
                                        break;
                                }
                            } else {
                                this.$Message.success({
                                    content: this.addSuccTip,
                                    duration: 3
                                });
                            }
                            item.cnum += Number(result.num); // 当前购物车该商品的数量
                            /* this.getDataCard({
                                vm: this,
                                inland: '',
                                page: 1
                            });  */
                            // 获取头部购物车商品总数量和总金额
                            this.getCartInfo({
                                vm: this
                            });
                            break;
                        default :
                            this.$Message.error({
                                content: this.adderrTip,
                                duration: 3
                            });
                            break;
                    }
                },
            })
        },
         /**
         *  切换页面
         */
        changePage(index) {
            this.currentPage = index;
            NProgress.start(); // 进度条结束
            this.isShowEmpty = false;
            this.isPageShow = false;
            // 查看是哪种商品列表
            this.switchList()
        },
        /**
         * 单击配送价里的价格区间
         */
        selectDis(item, index) {
            this.urlParams = getUrlParams(); 
            this.disIndex = index;
            this.currentPage = 1;
            this.price_min = item.min_price;
            this.price_max = item.max_price;
            this.switchList();
        },
        /**
         * 一折特价清仓(不退换)、三折特价清仓、新品上线、全部商品、最新补货、中国仓产品、1件起订、防疫用品
         */
        sameQuery(type,disNum) {
            this.isShowEmpty = false;
            var data = {};
            switch(type) {
                case "0":
                    // 全部商品
                    data = {
                        page:this.currentPage,
                        lang: localStorage.langSelect,
                        id:0,
                        price_min: this.price_min,  // 最小价格
                        price_max: this.price_max,  // 最大价格
                        type:type  // 接口类型，商品分类的接口
                    }
                    break;
                case "1": {
                    // 中国仓产品
                    data = {
                        page: this.currentPage,
                        lang: localStorage.langSelect,
                        class: this.calssValue,
                        price_min: this.price_min,  // 最小价格
                        price_max: this.price_max,  // 最大价格
                        type:type  // 接口类型，商品分类的接口
                    }
                    break;
                }
                case "2": {
                    // 一件起订
                    data = {
                        page: this.currentPage,
                        lang: localStorage.langSelect,
                        price_min: this.price_min,  // 最小价格
                        price_max: this.price_max,  // 最大价格
                        type:type  // 接口类型，商品分类的接口
                    }
                    break;
                }
                case "3": {
                    // 1折优惠、三折优惠
                    data = {
                        page: this.currentPage,
                        lang: localStorage.langSelect,
                        off: Number(this.discountID),
                        price_min: this.price_min,  // 最小价格
                        price_max: this.price_max,  // 最大价格
                        type:type  // 接口类型，商品分类的接口
                    }  
                    break;
                }
                case "4": {
                    // 最新补货
                    data = {
                        page: this.currentPage,
                        lang: localStorage.langSelect,
                        price_min: this.price_min,  // 最小价格
                        price_max: this.price_max,  // 最大价格
                        type:type  // 接口类型，商品分类的接口
                    }
                    break;
                }
                case "5": {
                    // 新品上线
                    data = {
                        page: this.currentPage,
                        lang: localStorage.langSelect,
                        price_min: this.price_min,  // 最小价格
                        price_max: this.price_max,  // 最大价格
                        type:type  // 接口类型，商品分类的接口
                    }
                    break;
                }
                case "6": {
                    // 防疫用品
                    data = {
                        page: this.currentPage,
                        lang: localStorage.langSelect,
                        price_min: this.price_min,  // 最小价格
                        price_max: this.price_max,  // 最大价格
                        type:type  // 接口类型，商品分类的接口
                    }
                    break;
                }
            }
            this.dataQurty(data,type);
        },
        /**
         * 一折特价清仓(不退换)、三折特价清仓、新品上线、全部商品、最新补货、中国仓产品、1件起订这些接口请求
         * @param {Object} data 接口参数对象
         * @param {String} type 根据这个type来请求哪一个接口
         */
        dataQurty(data,type) {
            NProgress.start();  // 进度条开始
            this.$resetAjax({
                type: 'POST',
                url: `/home/category/get_goods_list`,
                data,
                success: (res) => {
                    NProgress.done();  // 进度条开始
                    let result = JSON.parse(res).data;
                    if(result.list.length === 0) {
                        this.goodsData = [];
                        this.total = 0;
                        this.isShowEmpty = true;
                        return false;
                    } 
                   this.transData(type,result)
                }
            })
        },
        /**
         * 一折特价清仓(不退换)、三折特价清仓、新品上线、全部商品、最新补货、中国仓产品、1件起订这些接口请求返回结果进行转换
         * @param {String} type 根据这个type来请求哪一个接口
         * @param {Object} result 接口返回的数据
         */
        transData(type,result) {
            // type: 0表示全部商品、1表示中国仓商品、2表示一件起订、3表示1折或者3折特价清仓、4表示最新补货
            result.list.forEach(ele => {
                ele.imgUrl = `http://hwimg.xmvogue.com/thumb/${ele.item_no}.jpg?x-oss-process=style/440`,
                ele.spec = Number(ele.spec);
                ele.carNum = ele.spec;
                ele.isShow = 'mouse_img';
                ele.base_price = ele.price;
                // 是否有加购操作
                ele.isAddShow = true;
                ele.credential.forEach(item => {
                    let form = item.form;
                    switch (form) {
                        case 3:
                            switch (localStorage.langSelect) {
                            case "0":
                                item.text = `证书+报告：${item.name}`;
                                break;
                            case "1":
                                item.text = `Certificates & Reports：${item.name}`;
                                break;
                            }
                            break;
                        case 2:
                            switch (localStorage.langSelect) {
                            case "0":
                                item.text = `证书：${item.name}`;
                                break;
                            case "1":
                                item.text = `Certificate(s)：${item.name}`;
                                break;
                            }
                            break;
                        case 1:
                            switch (localStorage.langSelect) {
                            case "0":
                                item.text = `报告：${item.name}`;
                                break;
                            case "1":
                                item.text = `Report(s)：${item.name}`;
                                break;
                            }
                        }
                });
                this.goodsData = result.list;
                this.total = Number(result.count);
            });
            if(type === '5') {
                // 新品上新type为5需要上新时间显示
                result.list.forEach(ele => {
                    let time = ele.time;
                    ele.timeTransform = `${time.substring(0,4)}-${time.substring(4,6)}-${time.substring(6,8)}   ${time.substring(8,10)}:${time.substring(10,12)}:${time.substring(12,14)}`
                })
            }
            this.goodsData = result.list;
            this.total = Number(result.count);
        },
        /**
         * 判断是哪一个接口请求
         */
        switchList() {
            switch(this.typeValue) {
                case  'A':
                    // 新产品上线
                    this.isPageShow = true;
                    if(localStorage.langSelect === '0') {
                        this.keyword = '新品上线'
                    } else {
                        this.keyword = 'New Arrivals'
                    }
                    this.sameQuery('5',0);
                    break;
                case  'B':
                    // 最新补货
                    this.isPageShow = true;
                    if(localStorage.langSelect === '0') {
                        this.keyword = '最新补货'
                    } else {
                        this.keyword = 'Latest Replenishment'
                    }
                    this.sameQuery('4',0);
                    break;
                case '3':
                    // 地区最畅销商品
                    
                    break;
                case 'C':
                    // 3折特价清仓(不退换)
                    if(localStorage.langSelect === '0') {
                        this.keyword = '3折特价清仓(不退换)'
                    } else {
                        this.keyword = '70% Off Clearance'
                    }
                    this.isPageShow = true;
                    this.sameQuery('3',3);
                    break;
                case 'D':
                    // 1折特价清仓(不退换)
                    /* if(localStorage.langSelect === '0') {
                        this.keyword = '1折特价清仓(不退换)'
                    } else {
                        this.keyword = '90% Off Clearance'
                    } */
                    this.isPageShow = true;
                    this.sameQuery('3', this.discountID);
                    break;
                case 'E':
                    // 一件起订
                    if(localStorage.langSelect === '0') {
                        this.keyword = '一件起订'
                    } else {
                        this.keyword = '1 Unit (Min. Order)'
                    }
                    this.isPageShow = true;
                    this.sameQuery('2',0);
                    break;
                case  'K':
                    // 防疫用品
                    this.isPageShow = true;
                    if(localStorage.langSelect === '0') {
                        this.keyword = '防疫用品'
                    } else {
                        this.keyword = 'Epidemic Prevention Supplies'
                    }
                    this.sameQuery('6', 0);   // 要分页
                    break;
                case 'F':
                    // 中国仓产品
                    this.isPageShow = true;
                    if(localStorage.langSelect === '0') {
                        this.keyword = '中国仓产品'
                    } else {
                        this.keyword = 'China Warehouse Products'
                    }
                    this.getAllCategories(()=> {
                        this.sameQuery('1',0);
                        this.classList = this.$root.goodsType.concat();
                            switch(localStorage.langSelect) {
                                case "0":
                                    this.classList.unshift({
                                        cls_id: "",
                                        cls_name: "全部商品"
                                    })
                                break;
                                case "1":
                                    this.classList.unshift({
                                        cls_id: "",
                                        cls_name: "All Merchandise"
                                    })
                                break;

                            }
                    })  
                    break;
                case 'BB':
                    // 输入的关键字
                    console.log(this.keyword)
                    this.isPageShow = true;
                    this.getGoodsData();  // 要分页
                    break;
                case 'AA':
                    // 查询所有商品
                    this.isPageShow = true;
                    if(localStorage.langSelect === '0') {
                        this.keyword = '全部商品'
                    } else {
                        this.keyword = 'All Merchandise'
                    }
                    this.sameQuery('0',0);
                    break;
                case '0':
                    // 固定查询输入的关键字
                    this.isPageShow = true;
                    this.getGoodsData();  // 要分页
                    break;
                case 'heat':
                    // 首页里的热销产品
                    if(localStorage.langSelect === '0') {
                        this.keyword = '热销产品'
                    } else {
                        this.keyword = 'HOT-SALE PRODUCTS'
                    }
                    this.isPageShow = true;
                    this.getHeatGoods();  // 要分页
                    break;
                case 'rec':
                    // 首页里的推荐产品
                    if(localStorage.langSelect === '0') {
                        this.keyword = '推荐产品'
                    } else {
                        this.keyword = 'RECOMMENDED PRODUCTS'
                    }
                    this.isPageShow = true;
                    this.getRecGoods();  // 要分页
                    break;
                case  'J':
                    // 预售商品
                    this.isPageShow = true;
                    if(localStorage.langSelect === '0') {
                        this.keyword = '预售商品'
                    } else {
                        this.keyword = 'Pre-Order Products'
                    }
                    this.getPreSale();   // 要分页
                    break;
                default:
                    // IP系列产品
                    this.isPageShow = true;         // 要分页
                    this.getIPListData();
                    break;
            }
        }
    },

    
}
</script>
