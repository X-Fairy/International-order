<template>
    <div id="typeList">
        <div class="inner">
            <!-- 导航栏 -->
            <Breadcrumb separator=">" class="bg_title">
                <BreadcrumbItem to="/enter" class="home_title"><i class="icon-liuliangyunpingtaitubiao02 iconfont"></i> {{i18n.home}}</BreadcrumbItem>
                <BreadcrumbItem v-for="(item,index) in breadName" :key="index"  :class="item.breadClass" @click.native="clickBread(item,index)">{{item.cls_name}}</BreadcrumbItem>
            </Breadcrumb>
            <!-- <h3 class="bg_title">{{urlParams.name}}</h3> -->
            <div class="typeList_content">
                <!-- 左侧导航栏 -->
                <div class="type_nav">
                    <Collapse v-model="panelValue">
                        <Panel v-for="(item,index) in panelData" :name="String(index+1)" :hide-arrow="false"  :key="index" >
                            <p class="pannel_name"  @click="panelClick(item.cls_id)"  :title="item.cls_name">{{item.cls_name}}</p>
                            <span class="icon_more" ></span>
                            <p slot="content" v-for="ele in item.child" v-show="item.child.length !== 0"  :key="ele.cls_id" :class="{'active':ind === ele.cls_id}" @click="changeBgc(ele.cls_id)" >
                                <span class="spot"></span>
                                <span>{{ele.cls_name}}</span>
                            </p>
                        </Panel>
                    </Collapse>
                </div>
                <!-- 右侧商品列表 -->
                <div class="type_container">
                    <div class="type_middle">
                        <div class="price_left">{{i18n.priceSelect}}：</div>
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
                    <div class="type_top">
                        <p>{{i18n.checkReasult}}</p>
                        <div class="top_right">
                            <span class="check_type" :class="{selected: iconIndex === index}" :title="item.title" v-for="(item,index) in i18n.iconList"  :key="index" @click="changeClass(item,index)" style="margin-right:5px;">
                                <Icon :type="item.icon" size="24"></Icon>
                            </span>
                            <Page :total="total" :page-size="pageSize" @on-change="changePage" class="simple_Page" :current="currentPage" simple style="display:flex;justify-content: flex-end;padding: 10px;"></Page>
                        </div>
                    </div>
                    <!-- 如果商品数据为空时显示 -->
                    <div class="empty_content" v-show="isShowEmpty" style="display: flex;justify-content: center;font-size: 20px;margin-top: 100px;color: #0e434c;">
                        <!-- <div class="emprt_inner" style="width:1200px;margin:0 auto;display:flex;justify-content: center;">
                            <img style="width:400px;height:300px;" src="@/assets/images/fail.gif" alt="">
                        </div> -->
                        <p>{{i18n.emptyData}}</p>
                    </div>
                    <ul :class="ulClass">
                        <li v-for="(item,index) in goodsData" :key="index">
                            <div class="item_content">
                                <div class="prod_top" @click="goGoodsDetail(item.item_no)"   @mouseenter="item.isShow=true" @mouseleave="item.isShow=false">
                                    <img v-lazy="item.imgUrl" alt="" :title="i18n.lookDetail">
                                </div>
                                <!-- 商品证书说明-->
                                <div class="credential">
                                    <a v-for="(ele,index) in item.credential" :key="index" class="certificate" v-show="item.credential.length !== 0">
                                        <Tooltip :content="ele.text" placement="bottom-start"  max-width="400">
                                            <!--  :title="i18n.clickView" -->
                                            <img v-for="(list,i) in ele.icon" :src="list" @click="windowOpen(list)" alt="" style="width:25px;height:25px;margin-right:5px;" :key="i">
                                        </Tooltip>
                                    </a>
                                </div>
                                <!-- 鼠标移入商品大图 -->
                                <div class="mouse_img">
                                    <img :src="item.imgUrl" alt="" v-if="item.isShow && ulClass === 'content_List'">
                                </div>
                                <p class="isLike" @click="collectGoods(item)">
                                    <Icon type="ios-heart" size="30" color="red" v-if="item.like === 1" />
                                    <Icon type="ios-heart" size="30" color="rgb(83, 210, 232)" v-else />
                                </p>
                                <div class="prod_info">
                                    <h3 class="prod_code">
                                        {{item.item_no}}
                                        <span style="width: 24px;height:20px;display:inline-block;">
                                            <Icon type="md-copy" size="20" class="copy_icon" :title="i18n.copyContent" v-clipboard:copy="item.item_no" v-clipboard:success="onCopy" v-clipboard:error="onError" />
                                        </span>
                                    </h3>
                                    <h3 class="prod_name" :title="item.item_name">{{item.item_name}}</h3>
                                    <div class="prod_price" :class="langClass">
                                        <p class="unit">
                                            <span class="unit_title">{{i18n.unit}}</span>
                                            <span v-show="item.discount">￥{{item.discount}}</span>
                                            <span :class="item.discount ? 'baseLine' : ''">￥{{item.base_price}}</span>
                                        </p>
                                        <p class="export">
                                            <span class="unit_title">{{i18n.export}}</span>
                                            <span>￥{{item.ling }}</span>
                                        </p>
                                    </div>
                                    <addCartPrice :multipleNum="item.spec" :InitPrice="item.spec" @onChange="shopChange($event,item)" class="change_num"></addCartPrice>
                                    <div class="prod_handle">
                                        <a class="add_handle">
                                            <span @click="addShop(item)" class="add_shop">{{i18n.addCart}} </span>
                                            <span :title="i18n.cnumTips" class="cnum_tips" :style="item.cnum === 0 ? 'color:#333' : 'color:#dd0017'">[ {{item.cnum}} ]</span>
                                            <Icon type="md-trash" size="24" v-show="item.cnum !== 0" class="trash" @click="delCart(item)" :title="i18n.delTips" />
                                            <!-- <span :title="i18n.cnumTips" class="cnum_tips">[ {{item.cnum}} ]</span>
                                            <Poptip
                                                confirm
                                                :title="i18n.delTips"
                                                @on-ok="delCart(item)"
                                                @on-cancel="''">
                                                <Icon type="md-trash" size="24" v-show="item.cnum !== 0" class="trash"/>
                                            </Poptip> -->
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </li>
                    </ul>
                    <div class="pageContanier" v-show="total !== 0">
                        <Page :total="total" :page-size="pageSize" @on-change="changePage" :current="currentPage" show-elevator show-total></Page>
                    </div>
                </div>
            </div>
        </div>
       
       
        <!-- <div v-if="isSpin" style="width: 100%;display:flex;justify-content: center;">
            <img style="width:400px; height:400px;" src="@/assets/images/gif/5a69d591e14e73ce7aeccf9bd00ce91b.gif" alt="">
        </div> -->
        <!-- 商品列表 -->
        <!-- <div class="goods_content" v-if="!isSpin&&isShowEmpty==false">
            <div class="content_inner">
                <h3 class="recommend">
                    <p>
                        推荐
                    </p>
                    <div class="recommed_right" style="display:flex;align-items: center;">
                        <span class="check_type" :class="{selected: iconIndex === index}" :title="item.title" v-for="(item,index) in iconList"  :key="index" @click="changeClass(item,index)" style="margin-right:5px;"><Icon :type="item.icon" size="20"></Icon></span>
                        <Page :total="total" :page-size="pageSize" @on-change="changePage" :current="currentPage" simple style="margin-left:15px;"></Page>
                    </div>
                </h3>
                <ul :class="ulClass">
                    <li v-for="(item,index) in goodsData" :key="index">
                        <div class="img" @click="goGoodsDetail(item.item_no)">
                            <img :src="item.imgUrl" alt="" class="img_content" @error="defImg()">
                            <div class="goods_info">
                                <h3>{{item.item_name}}</h3>
                                <p>{{item.item_no}}</p>
                            </div>
                        </div>
                        <div class="add_shop">
                            <div class="add_left">
                                <p>零售：<span class="retail">￥{{item.ling}}</span></p>
                            </div>
                            <div class="add_right">
                                引用加入购物车组件 -->
                                <!-- <addCartPrice :multipleNum="item.spec" :InitPrice="item.spec" @onChange="shopChange($event,item)"></addCartPrice>
                                <img src="@/assets/images/enter/add_icon.png" alt=""  title="加入购物车" @click="addShop(item)">
                                <span class="cnum" :title="item.cnumTitle"  v-if="item.cnum !== 0" @click="addShop(item)">{{item.cnum}}</span>
                            </div>
                        </div>
                    </li>
                </ul>
                <div class="pageContanier">
                    <Page :total="total" :page-size="pageSize" @on-change="changePage" :current="currentPage" show-elevator show-total></Page>
                </div>
            </div> -->
        <!-- </div> -->
        <!-- 如果商品数据为空时显示 -->
        <!-- <div class="empty_content" v-show="isShowEmpty">
            <div class="emprt_inner" style="width:1200px;margin:0 auto;display:flex;justify-content: center;">
                <img style="width:400px;height:400px;" src="https://img.zcool.cn/community/01b35f5b320c11a80120b95969bc40.gif" alt="">
            </div>
        </div> -->
        <!-- 全部加入购物车 请输入最小起订量倍数-->
        <Modal v-model="modal"  draggable :title="i18n.addAllTips" class="addAllModal">
            <input  v-model="num" style="width: 100%; padding: 5px 15px;border:1px solid #218da0;" type="number" min="1" :placeholder="i18n.addAllTips">
            <div class="ivu-modal-footer-own">
                <button class="ivu-btn ivu-btn-text" @click="modal=false">
                    <span>取消</span>
                </button> 
                <Button :loading="loading"  class="ivu-btn ivu-btn-primary" @click="addAll">
                    <span>确定</span>
                </Button>
            </div>
        </Modal>
    </div>
</template>


<script>
import collImg from '@/assets/images/enter/lover.png'  // 引入取消收藏图标 
import cancelImg from '@/assets/images/goodsDetail/lover2.png'  // 引入收藏图标  
import {getUrlParams} from  '@/assets/js/tool.js'
import addCartPrice from '../common/addCart-price.vue'   // 引入input加购购物车
import { mapState, mapActions } from 'vuex';
import NProgress from 'nprogress'   // 引入进度条
import 'nprogress/nprogress.css'    // 引入进度条
export default {
    components: {
        addCartPrice
    },
    data() {
        return {
            // 点击选中哪个价格
            disIndex: 0,
            // 快捷加购时确定按钮是否加载显示
            loading: false,
            // 得到网址的参数对象
            urlParams: {},
            // 商品面包屑
            breadName: [],
            // 左侧折叠面板默认选中哪个
            tst: '1',
            panelValue:'1',
            panelData: [],
            defaultImg: 'http://dh.xmcpcn.com/Public/images/none.jpg',
            ind: '',
            indac: '',
            // 加购物车成功
            addSuccTip: this.$t('typeListPage.addSuccTip'),
            // 加购物车失败
            adderrTip: this.$t('typeListPage.adderrTip'),
            // 收藏成功提示
            collectSuccess: this.$t('typeListPage.collectSuccess'),
            // 收藏失败提示
            collectError: this.$t('typeListPage.collectError'),
            // 点击分类里变色
            typeIndex: -1,
            // 配送价点击变色
            disIndex: 0,
            // 点击选中哪个查看模式
            iconIndex:0,
            // 商品展示样式名称
            ulClass: 'type_list',
            // 商品分类数据
            typeListData: [],
            // 商品数据
            goodsData: [],
            isFirstEnter: true,
            // 价格区间最小值
            min_price: '',
            // 价格区间最大值
            max_price: '', 
            // 商品总数
            total: 0,
            // 每页条数
            pageSize: 20,
             // 当前页码
            currentPage: 1,
            // 是否显示数据加载中
            isSpin: true,
            // 是否显示内容为空提示的图片
            isShowEmpty: false,
            flag:true,
            // 弹出框
            modal:false,
            // 全部加入购物车数量
            num:'1',
            // 分类的id
            cateId:'',
            arr:[],
             // 单个商品购物车删除成功提示
            delItemSuccess:this.$t('typeListPage.delItemSuccess'), 
            // 单个商品购物车删除失败提示
            delItemError: this.$t('typeListPage.delItemError'),
            // 复制成功提示
            copySuccess: this.$t('typeListPage.copySuccess'),
            // 复制失败提示
            copyError: this.$t('typeListPage.copyError'),
            // 加购的规格不是倍数
            mastSpec:this.$t('typeListPage.mastSpec'),
            // 英文下的样式
            langClass: '',

        }
    },

    computed: {
        ...mapState([
            'headerCartData'
        ]),
        // 引入typeListPage里的中英文
        i18n() {
            return this.$t('typeListPage') 
        },
        
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
    filters: {
        flt(val) {
            // console.log(val, 'filter')
            return val
        }
    },
    watch: {
        $route(val,oldval) {
            // if(val.name === 'typeList') {
                this.currentPage = 1;
                this.min_price = '';
                this.max_price = '';
                this.disIndex = 0;
                let that = this;
                this.getGoodsType(function () {
                    that.getUrlData(val.query.cls_id);
                });
                // this.getUrlData(val.query.cls_id);
            // }
            
        },
        modal(val) {
            if(!val) {
                this.loading = false;
            }
        }
    },
    mounted() {
        this.langClass = (localStorage.langSelect === '1' && this.iconIndex === 0) ? 'enClass' : '';
    },
    created() {
        this.urlParams = getUrlParams(); 
        let that = this;
        this.getGoodsType(function () {
            // 得到网址的参数
            that.getUrlData(that.urlParams.cls_id);
        });
        document.addEventListener('keydown', this.handleKeyDown)
        document.addEventListener('keyup', this.handleKeyUp)
    },
    destroyed() {
        document.removeEventListener('keydown', this.handleKeyDown)
        document.removeEventListener('keyup', this.handleKeyUp)
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
         * 得到商品分类
         */
        getGoodsType(callback) {
            this.$resetAjax({
                type: 'POST',
                url: '/Home/Category/categories_tree1',
                data: {
                    type: localStorage.langSelect,  // 中英文
                    uid: localStorage.uid,
                },
                success: (res) => {
                    let result = JSON.parse(res)
                    result.forEach(ele => {
                        ele.isSelected = false; // 添加一个属性，让商品每一个大分类为false，方便后续鼠标经过大分类里的小分类大分类颜色为红色
                    });
                    this.$root.goodsType = result;   // 得到商品大分类
                    typeof callback === 'function' && callback();
                }
            })
        },
        /**
         * 得到网址的参数
         */
        getUrlData(cls_id){
            this.cateId = cls_id;
            this.typeListData = []; 
            let clsLen = cls_id.length;
            this.panelData = [];
            switch(clsLen) {
                case 2:
                    this.$root.goodsType.forEach(ele =>  {
                        if(ele.cls_id === this.cateId) {
                            this.panelData = ele.child;
                            this.panelValue = '1';
                        }
                    })
                    break;
                case 4:
                    this.$root.goodsType.forEach(item => {
                        (item.child || []).forEach(list =>{
                            if(list.cls_id === cls_id) {
                                // this.panelData = list.child;   // 分类数据
                                this.panelData.push(list); // 分类数据
                                this.ind = cls_id;
                                this.panelValue = '1';
                            }
                        })
                    })
                    break;
                case 6:
                    this.$root.goodsType.forEach(ele =>  {
                        (ele.child || []).forEach(item => {
                            (item.child || []).forEach(list => {
                                if(list.cls_id === cls_id) {
                                    this.panelData.push(item); // 分类数据
                                    this.ind = cls_id;
                                    this.panelValue = '1';
                                }
                            })
                        })
                        
                    })
                    break;
            }
            this.getTypeLists(cls_id);
        },
        /**
         * 打开证书图标大图
         */
        windowOpen(url) {
            window.open(url)
        },
        /**
         * 一级点击
         */
        panelClick(cls_id) {
            this.cateId = cls_id;
            this.currentPage = 1;
            this.ind = '';
            this.min_price = '';
            this.max_price = '';
            this.disIndex = 0;
            this.getTypeLists(this.cateId)
        },
        /**
         * 二级点击
         */
        changeBgc (cls_id) {
            this.currentPage = 1;
            this.ind = cls_id;
            this.cateId = cls_id;
            this.min_price = '';
            this.max_price = '';
            this.disIndex = 0;
            this.getTypeLists(cls_id)
        },
        /**
         * 生成样式
         */
        clickBgc (index) {
            this.indac = index;
        },
        // 快捷键
        handleKeyDown(e) {
            if(this.arr.length > 0) { // a-z按键长按去重
                if(this.arr.indexOf(e.key.toLowerCase()) >= 0) {
                    return
                }
            }
            this.arr.push(e.key.toLowerCase())
            this.keydown = this.arr.join('+');
            if(this.keydown === 'control+enter') {
                this.keydown = '';
                this.modal = true;
            }
        },
        handleKeyUp(e) {
            this.arr.splice(this.arr.indexOf( e.key.toLowerCase() ),1);
            this.keydown = this.arr.join('+');
        },
        /**
         *  全部加入购物车
         */ 
        addAll() {
            this.loading = true;
            this.$resetAjax({
                type: 'GET',
                url: '/Home/Category/addall',
                data: {
                    cat: this.cateId,
                    num: this.num,
                    uid: localStorage.uid
                },
                success: (res) => {
                    this.loading = false;
                    if(res == 1){
                        this.modal = false;
                        this.$Message.success({
                            content: this.addSuccTip,
                            duration: 3
                        });
                        // 重新请求购物车数据
                        // this.getDataCard({
                        //     vm: this,
                        //     inland: '',
                        //     page: 1
                        // }); 
                        // 获取头部购物车商品总数量和总金额
                        this.getCartInfo({
                            vm: this
                        }); 
                        this.getUrlData(this.cateId); // 重新渲染当前页面
                    } else{
                        this.$Message.error({
                            content: this.adderrTip,
                            duration: 3
                        });
                    }
                },
            })
        },
        /**
         * 得到分类商品数据 (新)
         */
        getTypeLists(id) {
            this.isSpin = true;
            this.isShowEmpty = false;
            NProgress.start();  // 进度条开始
            this.$resetAjax({
                type: 'POST',
                url: `/home/category/get_goods_list`,
                data: {
                    lang: localStorage.langSelect,
                    page:this.currentPage, // 页码
                    class:id,  // 商品类别码
                    price_min: this.min_price,  // 最小价格
                    price_max: this.max_price,  // 最大价格
                    type:0  // 接口类型，商品分类的接口
                },
                success: (res) => {
                    NProgress.done();  // 进度条开始
                    let result = JSON.parse(res).data;
                    let lenName = result.name.length;
                    result.name.forEach((ele,index) => {
                        ele.breadClass = index === lenName - 1 ? '' : 'title_name';
                    }) 
                    this.breadName = result.name;
                    if(result.list.length === 0) {
                        this.goodsData = [];
                        this.total = 0;
                        this.isShowEmpty = true;
                        return false;
                    } 
                    result.list.forEach(item => {
                        item.imgUrl = `http://hwimg.xmvogue.com/thumb/${item.item_no}.jpg?x-oss-process=style/440`;
                        item.spec = Number(item.spec);
                        item.carNum = Number(item.spec);
                        item.isShow = false;
                        item.base_price = item.price;
                        item.credential.forEach(ele => {
                            let form = ele.form;
                            switch (form) {
                                case 3:
                                    switch (localStorage.langSelect) {
                                    case "0":
                                        ele.text = `证书+报告：${ele.name}`;
                                        break;
                                    case "1":
                                        ele.text = `Certificates & Reports:：${ele.name}`;
                                        break;
                                    }
                                    break;
                                case 2:
                                    switch (localStorage.langSelect) {
                                    case "0":
                                        ele.text = `证书：${ele.name}`;
                                        break;
                                    case "1":
                                        ele.text = `Certificate(s)：${ele.name}`;
                                        break;
                                    }
                                    break;
                                case 1:
                                    switch (localStorage.langSelect) {
                                    case "0":
                                        ele.text = `报告：${ele.name}`;
                                        break;
                                    case "1":
                                        ele.text = `Report(s)：${ele.name}`;
                                        break;
                                    }
                                }
                        });
                    })
                    this.total = Number(result.count);
                    this.goodsData  = result.list;
                
                    // this.isSpin = false;
                    // if(result.list !== null && result.list.length !== 0) {
                    //     let resultList = result.list;
                    //     resultList.forEach(ele => {
                    //         ele.imgUrl = `https://ximiphoto.oss-cn-hangzhou.aliyuncs.com/thumb/${ele.item_no}.jpg?x-oss-process=style/300`,
                    //         ele.collImg = collImg,  // 使用取消收藏icon
                    //         ele.cancelImg = cancelImg // 使用收藏icon
                    //         ele.isCollect = true; //是否显示取消收藏icon
                    //         ele.spec = Number(ele.spec);
                    //         ele.carNum = ele.spec;
                    //         ele.cnumTitle =`购物车已有${ele.cnum}件`;
                    //     });
                    //     this.goodsData = resultList;
                    // }  else {
                    //     this.goodsData = [];
                    //     this.isShowEmpty = true;
                    // }
                    // // 复杂分页里的商品总数
                    

                },
            })
        },
        /**
         * 收藏商品判断
         */
        collectGoods(data,index) {
            if(data.like) {
                data.like = 0;
                this.delcollect(data); // 取消收藏请求
            } else {
                data.like = 1;
                this.addcollect(data);  // 收藏请求
            }
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
                        // 重新请求购物车数据
                        // this.getDataCard({
                        //     vm: this,
                        //     inland: '',
                        //     page: 1
                        // }); 
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
         * 收藏请求
         */
        addcollect(item) {
            this.$resetAjax({
                type: 'POST',
                url: '/Home/Collect/add',
                data: {
                    sn: item.item_no,
                    uid: localStorage.uid,
                },
                success: (res) => {
                    let result = JSON.parse(res);
                    this.$Message.success(this.collectSuccess);
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
                    uid: localStorage.uid,
                },
                success: (res) => {
                    let result = JSON.parse(res);
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
                this.ulClass = 'type_list';
                if(localStorage.langSelect === '1') {
                    this.langClass = 'enClass';
                }
            } else {
                // 列表形式
                this.ulClass = 'content_List';
                this.langClass = '';
            }
        },
        /**
         * 单击配送价里的价格区间
         */
        selectDis(item, index) {
            this.disIndex = index;
            this.currentPage = 1;
            this.min_price = item.min_price;
            this.max_price = item.max_price;
            this.getTypeLists(this.cateId)
        },
        /**
         * 单击分类里的商品名称
         */
        selectGoodsType(item, index) {
            this.urlParams.cls_id = item.cls_id;
            this.currentPage = 1;
            this.typeIndex = index ;
            this.$router.push({path: `/typeList?cls_id=${item.cls_id}`});
        },
         /**
         *  切换页面
         */
        changePage(index) {
            this.currentPage = index;
            this.getTypeLists(this.cateId)
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
                           // 重新请求购物车数据
                            /* this.getDataCard({
                                vm: this,
                                inland: '',
                                page: 1
                            }); */
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
         * 跳转到商品详情
         */
        goGoodsDetail(nonum) {
            // 新开页面跳转到商品详情页面
            // this.$router.push({path: '/goodsDetail', query: {item_no: nonum}})
            let routeData = this.$router.resolve({ name: 'goodsDetail', query: {item_no:nonum}});
            window.open(routeData.href, '_blank');
        },
        /**
         * 点击面包屑
         */
        clickBread(item,index) {
            // 当该面包屑索引大于2时，点击第一个没有反应，强制让它请求。
            if(item.cls_no === this.urlParams.cls_id && this.breadName.length > 2) {
                this.getUrlData(this.urlParams.cls_id)
                return false;
            }
            if(item.breadClass === "title_name") {
                this.$router.push({path: '/typeList', query: {cls_id: item.cls_no,name: item.cls_name}})
            }
        }
    },
}
</script>
