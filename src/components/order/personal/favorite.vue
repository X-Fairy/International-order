<template>
    <div class="favoritePage">
        <p class="order_title">{{i18n.pageTitle}}</p>
        <div class="clear">
            <!-- <div class="select">
                <p>{{i18n.advance}}</p>
                <Select v-model="advanceValue" style="width:200px" :placeholder="i18n.advanceInfo" @on-change="advanceType">
                    <Option v-for="(item,index) in i18n.advanceData" :value="index" :key="item.title">{{ item.title }}</Option>
                </Select>
            </div> -->
            <p @click="modal1 = true" class="clearLover" v-if="isClearLover">{{i18n.clearFavorite}}</p>
        </div>
        <div class="empty" v-if="!isClearLover">
            <img class="empty_left" src="@/assets/images/favorite/empty_favorite.png" alt="">
            <div class="empty_right">
                <p class="emptyTips">{{i18n.emptyTip}}</p>
                <p class="empty_go">
                    <a @click="goAll">{{i18n.goAdd}}</a>
                    <span style="margin-bottom: 15px;color: #868686;font-size: 16px;">{{i18n.goLook}}</span>
                </p>
            </div>
        </div>
        <ul class="collect_list" v-if="isClearLover">
            <li v-for="item in collectData" :key="item.item_no" class="list">
                <div class="item_li">
                    <div class="img">
                        <img v-lazy="item.imgUrl" alt="" :title="i18n.lookDetail" @click="goGoodsDetail(item.item_no)">
                    </div>
                    <div class="info">
                        <p class="code" v-if="item.item_no">
                            {{item.item_no}}
                            <span style="width: 24px;height:20px;display:inline-block;">
                                <Icon type="md-copy" size="20" class="copy_icon" :title="i18n.copyContent" v-clipboard:copy="item.item_no" v-clipboard:success="onCopy" v-clipboard:error="onError" />
                            </span>
                        </p>
                        <p class="name" :title="i18n.lookDetail" @click="goGoodsDetail(item.item_no)">{{item.item_name}}</p>
                        <div class="price" :class="langClass">
                            <p class="base">
                                <span class="unit_title">{{i18n.unit}}</span>
                                <span v-show="item.discount">￥{{item.discount}}</span>
                                <span :class="item.discount ? 'baseClass': ''">￥{{item.base_price}}</span>
                            </p>
                            <p>
                                <span class="unit_title">{{i18n.export}}</span>
                                <span>￥{{item.sale_price}}</span>
                            </p>
                        </div>
                        <div class="handle">
                            <p class="del" @click="delColldct(item)">{{i18n.delete}}</p>
                            <p class="check" @click="goGoodsDetail(item.item_no)">{{i18n.details}}</p>
                        </div>
                        <div class="prod_handle">
                            <addCartPrice :multipleNum="item.spec" :InitPrice="item.spec" @onChange="shopChange($event,item)"></addCartPrice>
                            <p class="add_handle">
                                <span class="add_shop" @click="addShop(item)" >{{i18n.addCart}}  </span>
                                <span :title="i18n.cnumTips" class="cnum_tips" :style="item.cnum === 0 ? 'color:#333' : 'color:#dd0017'">[ {{item.cnum}} ]</span>
                                <Icon type="md-trash" size="24" v-show="item.cnum !== 0" class="trash" @click="delCart(item)" :title="i18n.delTips" />
                                <!-- <span :title="i18n.cnumTips" class="cart_tips">[ {{item.cnum}} ]</span>
                                <Poptip
                                    confirm
                                    :title="i18n.delTips"
                                    @on-ok="delCart(item)"
                                    @on-cancel="''">
                                    <Icon type="md-trash" size="24" v-show="item.cnum !== 0" class="trash"/>
                                </Poptip> -->
                            </p>
                        </div>
                    </div>
                </div>
            </li>
        </ul>
        <Modal v-model="modal1" draggable  :title="i18n.deleTipsTitle" @on-ok="clearLover" @on-cancel="modal1=false" class="clearCollect">
            <p>{{i18n.tipsContent}}</p>
        </Modal>
    </div>
</template>


<script>
import { mapState, mapGetters, mapActions } from 'vuex';
import addCartPrice from '../../common/addCart-price.vue'   // 引入input加购购物车
import NProgress from 'nprogress'   // 引入进度条
import 'nprogress/nprogress.css'    // 引入进度条
export default {
    components: {
        addCartPrice,
    },
    data() {
        return {
            // 选择是否是预售
            advanceValue: 1,
            // 页面标题
            pageTitle: this.$t('favoritePage.pageTitle'),
             // 加购物车成功
            addSuccTip: this.$t('favoritePage.addSuccTip'),
            // 加购物车失败
            adderrTip: this.$t('favoritePage.adderrTip'),
            // 收藏成功提示
            collectSuccess: this.$t('favoritePage.collectSuccess'),
            // 收藏失败提示
            collectError: this.$t('favoritePage.collectError'),
            // 清空收藏提示
            clearTip: this.$t('favoritePage.clearTip'),
            // 单个商品购物车删除成功提示
            delItemSuccess:this.$t('favoritePage.delItemSuccess'), 
            // 单个商品购物车删除失败提示
            delItemError: this.$t('favoritePage.delItemError'),
            // 复制成功提示
            copySuccess: this.$t('favoritePage.copySuccess'),
            // 复制失败提示
            copyError: this.$t('favoritePage.copyError'),
            // 收藏的数据
            collectData:[],
            modal1: false,
            // 是否显示清空收藏夹按钮
            isClearLover: false,
            defaultImg: 'http://dh.xmcpcn.com/Public/images/none.jpg',
            // 所有收藏数据
            favoriteData: {},
            // 加购的规格不是倍数
            mastSpec:this.$t('goodsDetailPage.mastSpec'),
             // 英文下的样式
            langClass: '',
        }
    },
    mounted() {
        this.langClass = localStorage.langSelect === '1' ? 'enClass' : '';
    },
    created() {
        // 获取收藏数据
        this.getCollectData();
    },
    computed: {
        // 引入favoritePage里的中英文
        i18n() {
            return this.$t('favoritePage') 
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
            // 找到分类相同的数据
            this.headerCartData.list.forEach(item => {
                if (!!this.teamClsId) {
                    item.cls_id === this.teamClsId && data.list.push(item);
                } else if(!!this.teamHuodong) {
                    item.huodong === this.teamHuodong && data.list.push(item);
                } else {
                    data.list.push(item);
                }
            });
            data.list.forEach(item => {
                data.num += Number(item.num);
                // 放大100倍，防止js小数点计数有问题
                data.totalPrice += Number(item.xj) * 100;
            });
            data.totalPrice = data.totalPrice / 100;
            return data;
        }
    },

    methods: {
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
        defImg() {
            let img = event.srcElement;
            img.src = this.defaultImg;
            img.onerror = null; //防止闪图
        },
        /**
         * 去全部商品页面
         */
        goAll() {
            let name = '';
            if(localStorage.langSelect === '0') {
                name = '全部商品';
            } else {
                name = 'All merchandise'
            }
            this.$router.push({path: '/searchKey', query: {keyword: name, select: 'AA'}});
        },
        /**
         * 查看商品详情
         */
        goGoodsDetail(nonum) {
            // 新开页面跳转到商品详情页面
            this.$router.push({path: '/goodsDetail',query: {item_no:nonum}})
            // let routeData2 = this.$router.resolve({ name: 'goodsDetail', query: {item_no:nonum}});
            // window.open(routeData2.href, '_blank');
        },
        /**
         * 获取收藏数据
         */
        getCollectData() {
            NProgress.start();
            this.$resetAjax({
                type: 'POST',
                url: '/Home/Collect/index',
                data: {
                    lang: localStorage.langSelect
                },
                success: (res) => {
                    NProgress.done();
                    this.favoriteData = JSON.parse(res);
                    // 判断是常规商品收藏还是预期商品收藏
                    this.advanceType();
                },
            })
        },
        /**
         * 判断是常规商品收藏还是预期商品收藏
         */
        advanceType() {
            if(this.advanceValue) {
                // 表示常规商品收藏数据
                this.transRoutine();
            } else {
                // 表示预售商品数据
                this.transAdvance()
            }
        },
        /**
         * 常规商品收藏数据处理
         */
        transRoutine() {
            let result = this.favoriteData.list;
            switch(result.length) {
                case 0:
                    this.isClearLover = false;
                    this.collectData = [];
                    break;
                default:
                    this.isClearLover = true;
                    result.forEach(ele => {
                        ele.imgUrl = `http://hwimg.xmvogue.com/thumb/${ele.item_no}.jpg?x-oss-process=style/440`,
                        ele.carNum = Number(ele.spec);
                    });
                    this.collectData = result;
            }
        },
        /**
         * 预售商品数据处理
         */
        transAdvance() {
            let result = this.favoriteData.list_presell;
            switch(result.length || result === '[]') {
                case 0:
                    this.isClearLover = false;
                    this.collectData = [];
                    break;
                default:
                    this.isClearLover = true;
                    result.forEach(ele => {
                        ele.imgUrl = (ele.img).replace("800","440"),
                        ele.carNum = Number(ele.purchase_spec);
                    });
                    this.collectData = result;
            }
        },
        /**
         * 更该商品的数量
         */
        shopChange(val, item) {
            item.carNum = val;
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
                        item.cnum = 0;
                        /* this.getDataCard({
                            vm: this,
                            inland: '',
                            page: 1
                        }); */
                        // 获取头部购物车商品总数量和总金额
                        this.getCartInfo({
                            vm: this
                        }); 
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
                            this.$Message.success({
                                content: this.adderrTip,
                                duration: 3
                            });
                            break;
                    }
                },
            })
        },
        /**
         * 取消收藏请求
         */
        delColldct(item) {
            this.$resetAjax({
                type: 'POST',
                url: '/Home/Collect/del',
                data: {
                    sn: item.item_no,
                    uid:localStorage.uid,
                },
                success: (res) => {
                    let result = JSON.parse(res);
                    this.$Message.warning({
                        content: this.collectError,
                        duration: 3
                    });
                    // this.$Message.success('很不舍,您取消了收藏该宝贝');
                    this.getCollectData()
                },
            })
        },
        /**
         * 清空收藏夹请求
         */
        clearLover() {
            this.modal1 = false;
            this.$resetAjax({
                type: 'POST',
                url: '/Home/Collect/clear',
                data: {
                    uid: localStorage.uid,
                },
                success: (res) => {
                    let result = JSON.parse(res);
                    if(result.result === 'ok') {
                        this.$Message.success({
                            content: this.clearTip,
                            duration: 3
                        });
                        this.isClearLover = false;
                        this.getCollectData()
                    }
                },
            })
        }
    }
}
</script>
