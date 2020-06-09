

<template>
    <div id="goodsDetail">
        <div class="pro_header" :class="{fixClass : scrollTop > 195}">
            <div class="proHeader_inner">
                <li @click="$router.push({path: '/enter'})" class="home_title">
                    <i class="icon-liuliangyunpingtaitubiao02 iconfont"></i> {{i18n.home}} > </li>
                <li v-for="item in titleList" :key="item.cls" class="pro_name before_second" @click="$router.push({path: '/typeList', query: {cls_id: item.cls,name: item.title}})">{{item.title}}
                    <Icon type="ios-arrow-forward" />
                </li>
                <li class="pro_name">{{item_name}}</li>
                <!-- <h3 class="pro_name">{{major}} <Icon type="md-arrow-round-forward" /> {{middle }} <Icon type="md-arrow-round-forward" /> {{item_name}}</h3> -->
            </div>
        </div>
        <div class="pro_detail">
            <div class="detail_inner">
                <div class="pro_left summary" ref="box" v-show="isVideo">
                    <!-- scroll 放大时页面是否可滚动  淘宝放大镜插件-->
                    <pic-zoom :url="imgSrc" :scale="3" scroll show-edit @click.native="isShow=true"></pic-zoom>
                    <!-- <img  v-lazy="imgSrc" alt="" @error="defImg()"> -->
                </div>
                <!-- 视频加载失败且不是预售商品都不能显示商品视频 object-fit:fill-->
                <div class="video_left" v-show="!isVideo && advance !=='1'" style="position:relative;/*需要用padding来维持16:9比例,也就是9除以16*/height: 0;">
                    <!-- position: absolute;top:0;left: 0; -->
                    <video :src="videoUrl" preload="auto" :poster="imgSrc" ref="video" controls="controls" controlslist="nodownload"  style="width: 800px;height: 100%;outline: none;"></video>
                </div>
                <!-- <div v-show="!isVideo && advance !=='1'" class="video_left">
                    <video-player  class="video-player vjs-custom-skin" ref="videoPlayer" :playsinline="true" :options="playerOptions"></video-player>
                </div> -->
                <div class="pro_right">
                    <h3 class="pro_name">
                        {{item_name}}
                    </h3>
                    <ul class="pro_list">
                        <li class="proCode" v-if="credential.length !== 0">
                            <span class="dt">{{i18n.credential}}：</span>
                            <!-- @click="upLoadCredent(item)"  -->
                            <a v-for="(item,index) in credential" :key="index" class="certificate" v-show="credential.length !== 0" style="height:40px;">
                                <Tooltip :content="item.text" placement="top" max-width="500">
                                    <!--  :title="i18n.clickView" -->
                                    <img v-for="(ele,index) in item.icon" :src="ele" alt="" style="width:50px;height:50px;margin-right:5px;border: 1px solid #eee;" :key="index">
                                </Tooltip>
                            </a>
                            <span v-show="credential.length === 0" style="color:#5c6b77;">{{i18n.noneCertifica}}</span>
                        </li>
                        <li class="proCode" v-if="item_no">
                            <span class="dt">{{i18n.itemNum}}：</span>
                            <span>{{item_no}}</span>
                            <Icon type="md-copy" size="20" class="copy_icon" :title="i18n.copyContent" v-clipboard:copy="item_no" v-clipboard:success="onCopy" v-clipboard:error="onError" />
                        </li>
                        <li class="pro_info" v-show="hs_code">
                            <span class="dt">{{i18n.hs_code}}：</span>
                            <span>{{hs_code}}</span>
                        </li>
                        <li class="pro_info" v-show="material" style="display:flex;">
                            <span class="dt" style="flex-shrink:0;">{{i18n.material}}：</span>
                            <span>{{material}}</span>
                        </li>
                        <li class="pro_info" v-show="stuffing" style="display:flex;">
                            <span class="dt" style="flex-shrink:0;">{{i18n.stuffing}}：</span>
                            <span>{{stuffing}}</span>
                        </li>
                        <li class="pro_info" v-show="lwh">
                            <span class="dt">{{i18n.size}}：</span>
                            <span>{{lwh}}</span>
                        </li>
                        <li class="pro_info" v-show="weight">
                            <span class="dt">{{i18n.weight}}：</span>
                            <span>{{weight}}</span>
                        </li>
                        <li class="pro_info" v-show="expiration && expiration !== 'NaN-NaN-NaN'">
                            <span class="dt">{{i18n.expiration}}：</span>
                            <span>{{expiration}}</span>
                        </li>
                        <li>
                            <span class="dt">{{i18n.specifications}}：</span>
                            <span>{{spec}}</span>
                        </li>
                        <li>
                            <span class="dt">{{i18n.number}}：</span>
                            <span>{{purchase_spec}}</span>
                        </li>
                        <li v-show="advance === '1'">
                            <span class="dt" >{{i18n.orderedNum}}：</span>
                            <span>{{orderedNum}}</span>
                        </li>
                        <li v-show="advance === '1'">
                            <span class="dt" > {{i18n.cycleTime}}：</span>
                            <span>{{ deadlineText}}</span>
                        </li>
                        <li v-show="advance === '1'">
                            <span class="dt" > {{i18n.deadlineTime}}：</span>
                            <span>{{deadline}}</span>
                        </li>
                        <li>
                            <span class="dt">{{i18n.trade}}：</span>
                            <span class="wholesale" :class="discount ? 'baseLine' : ''">￥{{ base_price}}</span>
                        </li>
                        <li v-show="discount">
                            <span class="dt">{{i18n.discount}}：</span>
                            <span class="wholesale">￥{{ discount}}</span>
                        </li>
                        
                        <li>
                            <span class="dt"> {{i18n.selling}}：</span>
                            <span>￥{{ sale_price}}</span>
                        </li>
                        <!-- 商品属性列表 -->
                        <li v-for="(item,s) in otherData" :key="s">
                            <span class="dt"> {{item.name}}：</span>
                            <!-- @on-change="bindRadio(item,s)"  -->
                            <Button v-for="(ele,index) in item.list" :key="index" :class="ele.selectClass ? 'selectClass' : 'dt_name'" :disabled="ele.show">
                                <a @click="clickRadio(item,s)">{{ele.value}}</a>
                            </Button>
                            <!-- <RadioGroup :value="item.value" type="button"  @click.native="clickRadio(item,s)">
                                <Radio v-for="(ele,index) in item.list" :label="ele.value" :key="index" :disabled="ele.show"></Radio>
                            </RadioGroup> -->
                        </li>
                        <li class="add_shop">
                            <span class="dt">{{i18n.quantity}}：</span>
                            <!-- 引用加入购物车组件 -->
                            <addCartPrice :multipleNum="spec" :InitPrice="spec" @onChange="shopChange($event)" />
                            <!-- <p title="加入购物车" @click="addShop"><img src="@/assets/images/goodsDetail/addShopCar.png" alt=""></p> -->
                            <!-- <span class="cnum" :title="this.cnumTitle" @click="addShop" v-if="this.cnum !== 0">{{this.cnum}}</span> -->
                        </li>
                        <li class="handle">
                            <!-- advance为1表示预售商品详情 -->
                            <!-- 缺货、下线、预售商品 -->
                            <p v-if="surplus" class="shortage">
                                <Icon type="ios-alert-outline" color="yellow" size="26" />{{i18n.Shortage}}
                            </p>
                            <p class="add_cart" v-if="!surplus && advance !=='1'"  :title="i18n.cnumTips">
                                <span @click="addShop(item_no,carNum)" class="add_shop"> {{i18n.addCart}} </span>
                                <span class="cart_tips" @click="addShop(item_no,carNum)">[ {{goodsCnum}} ]</span>
                                <Poptip confirm :title="i18n.delTips" @on-ok="delCart(item_no,carNum)" @on-cancel="''">
                                    <Icon type="md-trash" size="24" v-show="goodsCnum !== 0" class="trash" />
                                </Poptip>
                            </p>
                            <!-- 预售商品有预定功能 -->
                            <p class="add_cart" v-if="advance==='1' && isDead" style="cursor:pointer"  :title="cnumTitle">
                                <span @click="orderGoods" class="add_shop"> {{i18n.addOrder}}</span>
                                <span class="cart_tips" @click="orderGoods">[ {{goodsCnum}} ]</span>
                                <Poptip confirm :title="i18n.delOrderTips" @on-ok="delOrder" @on-cancel="''">
                                    <Icon type="md-trash" size="24" v-show="goodsCnum !== 0" class="trash" />
                                </Poptip>
                            </p>
                            <!-- 预售商品没有预售功能 -->
                            <p class="pre_closed" v-if="advance==='1' && !isDead">{{i18n.preColsed}}</p>
                            <!-- 预售商品没有收藏功能 v-if="advance !== '1'"-->
                            <div class="collect_handle" v-if="advance !== '1'">
                                <p @click="collectGoodsDetail">
                                    <img src="@/assets/images/goodsDetail/lover.png" alt="" v-if="like===0">
                                    <img src="@/assets/images/goodsDetail/lover2.png" alt="" v-else>
                                    <span>{{i18n.collection}}</span>
                                </p>
                                <!-- <img class="imgMove" src="@/assets/images/goodsDetail/lover2.png" alt="" v-if="isLover" @click="collectGoods"> -->
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
        <!-- 商品详情图 -->
        <div class="pro-infomation">
            <div class="infomation_inner">
                <h3 class="info_title" @click="describeClick" :class="{active:clickindex === 1}"><span>{{i18n.describe}}</span></h3>
                <!--<ul class="info_title">
                    <li @click="describeClick" :class="{active:clickindex === 1}">{{i18n.describe}} </li>
                     <li @click="infomatinClick" :class="{active:clickindex === 2}">{{i18n.information}}</li>
                </ul> -->
                <div style="display:flex;justify-content: space-between;">
                    <div class="img_contanier">
                        <ul class="note">
                            <li v-if="features">
                                <label>{{i18n.features}}</label>
                                <span>{{features}}</span>
                            </li>
                            <li v-if="usage">
                                <label>{{i18n.usage}}</label>
                                <span>{{usage}}</span>
                            </li>
                            <li v-if="notes">
                                <label>{{i18n.notes}}</label>
                                <span>{{notes}}</span>
                            </li>
                        </ul>
                        <div class="detail_video" v-show="isVideoDetail" style="position:relative;padding-bottom:56.25%;    /*需要用padding来维持16:9比例,也就是9除以16*/height: 0;">
                            <video :src="detailVideoUrl" :poster="imgSrc" ref="video2" controls preload controlslist="nodownload" style="position: absolute;top:0;left: 0;width: 100%;height: 100%;outline: none;"></video>
                        </div>
                        <!-- <div class="detail_video" v-show="isVideoDetail">
                            <video-player  class="video-player vjs-custom-skin" ref="videoPlayer" :playsinline="true" :options="detailOptions"></video-player>
                        </div> -->
                        <img v-lazy="DetailImgUrl" alt="" @error="defImg()" style="width:800px;">
                    </div>
                    <div class="relation" v-if="relationData.length">
                        <ul class="relation_inner">
                            <li class="rel_title">{{i18n.related}}</li>
                            <li v-for="(item, index) in relationData" :key="index" class="rel_item">
                                <div>
                                    <div class="rel_top" :title="i18n.lookDetail" @click="goGoodsDetail(item.item_no)">
                                        <img v-lazy="item.relImg" alt="" @error="defImg()">
                                    </div>
                                    <p class="isLike" @click="collectGoods(item)">
                                        <Icon type="ios-heart" size="30" color="red" v-if="item.like === 1" />
                                        <Icon type="ios-heart" size="30" color="rgb(83, 210, 232)" v-else />
                                    </p>
                                    <div class="rel_bottom">
                                        <div class="rel_left">
                                            <p class="rel_name" :title="item.item_name">{{item.item_name}}</p>
                                            <p class="rel_code">
                                                {{item.item_no}}
                                                <span style="width: 24px;height:20px;display:inline-block;">
                                                    <Icon type="md-copy" size="20" class="copy_icon" :title="i18n.copyContent" v-clipboard:copy="item.item_no" v-clipboard:success="onCopy" v-clipboard:error="onError" />
                                                </span>
                                            </p>
                                            <div class="rel_price" :class="langClass">
                                                <p>
                                                    <span class="sale_title">{{i18n.trade}}：</span>
                                                    <span class="price_num" v-show="item.discount">￥{{item.discount}}</span>
                                                    <span class="price_num" :class="item.discount ? 'baseLine' : ''">￥{{item.base_price}}</span>
                                                </p>
                                                <p class="sale">
                                                    <span class="sale_title">{{i18n.selling}}：</span>
                                                    <span class="price_num">￥{{item.sale_price}}</span>
                                                </p>
                                            </div>
                                        </div>
                                        <div class="rel_right">
                                            <addCartPrice :multipleNum="item.spec" :InitPrice="item.spec" @onChange="shopChangeItem($event,item)"></addCartPrice>
                                            <p class="add_had">
                                                <span @click="addShopItem(item,item.carNum)" class="add_shop">{{i18n.addCart}} </span>
                                                <span :title="i18n.cnumTips" class="cart_tips">[ {{item.cnum}} ]</span>
                                                <Poptip confirm :title="i18n.delTips" @on-ok="delCartItem(item)" @on-cancel="''">
                                                    <Icon type="md-trash" size="24" v-show="item.cnum !== 0" class="trash" />
                                                </Poptip>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
        <Modal v-model="isShow" :styles="{top: '20px'}" :title="i18n.imgTitle" @on-cancel="isShow=false;" class="modal_big_click">
           <img :src="imgSrc" width="440px"/>
        </Modal>
    </div>
</template>

<script>
import { getUrlParams } from "@/assets/js/tool.js";
import addCartPrice from "../common/addCart-price.vue"; // 引入input加购购物车
import { mapState, mapActions } from "vuex";
import PicZoom from "vue-piczoom"; // 引入图片放大组件
import NProgress from "nprogress"; // 引入进度条
import "nprogress/nprogress.css"; // 引入进度条
export default {
    components: {
        addCartPrice,
        PicZoom // 图片放大组件
    },
    data() {
        return {
            // 是否显示图片
            isShow: false,
            // 当前商品货号
            radio0: "",
            radio1: "",
            radio2: "",
            currentNo: "",
            // 得到网址的参数对象
            urlParams: {},
            // 商品名称
            item_name: "",
            // 商品详情里的购物车数量
            goodsCnum: 0,
            // 商品货号
            item_no: "",
            usage: '',
            features: '',
            notes: '',
            // 材质
            material: "",
            // 海关编码
            hs_code: "",
            // 大类
            major: "",
            // 中类
            middle: "",
            // 尺寸：
            lwh: "",
            // 条形码
            barcode: "",
            // 库存数量
            stock_num: 0,
            // 商品是否上下线
            display_falg: false,
            // 非预售商品是否可以加入购物车，是否有足购的货物加入购物车
            surplus: false,
            // 商品填充物
            stuffing: "",
            // 证书地址
            credential: [],
            // 重量
            weight: "",
            // defaultImg: "http://dh.xmcpcn.com/Public/images/none.jpg",
            defaultImg: 'https://uh.edu/pharmacy/_images/directory-staff/no-image-available.jpg',
            // 商品规格
            spec: 0,
            // 预售商品截止时间
            deadline: '',
            // 预售商品截止时间天数
            deadlineText: '',
            // 加入购物车的数量
            carNum: 0,
            // 购物车已有当前商品的数量提示语
            cnumTitle: "",
            // 购物车已有当前商品的数量
            cnum: 0,
            // 预售商品已定数量
            orderedNum: 0,
            // 预售商品是否有预定功能
            isDead: false,
            // 预定生产周期
            cycleTime: '',
            // 箱规数量
            purchase_spec: 0,
            // 批发价
            base_price: "",
            // 销售价
            sale_price: "",
            // 注意事项
            expiration: "",
            // 商品其他款式数据
            otherData: [],
            // 商品产品图
            imgSrc: "",
            // 商品详情图片
            DetailImgUrl: "",
            // 是否喜欢
            like: 7,
            // 滚动条高度
            scrollTop: "0",
            // 同类推荐数据
            relationData: [],
            // 加购物车成功
            addSuccTip: this.$t("goodsDetailPage.addSuccTip"),
            // 加购物车失败
            adderrTip: this.$t("goodsDetailPage.adderrTip"),
            // 描述
            describe: this.$t("goodsDetailPage.describe"),
            // 资讯
            information: this.$t("goodsDetailPage.information"),
            // 收藏成功提示
            collectSuccess: this.$t("goodsDetailPage.collectSuccess"),
            // 收藏失败提示
            collectError: this.$t("goodsDetailPage.collectError"),
            // 点击到哪个li
            clickindex: 1,
            // 商品详情类别分类数据
            titleList: [],
            // 单个商品购物车删除成功提示
            delItemSuccess: this.$t("goodsDetailPage.delItemSuccess"),
            // 单个商品购物车删除失败提示
            delItemError: this.$t("goodsDetailPage.delItemError"),
            // 复制成功提示
            copySuccess: this.$t("goodsDetailPage.copySuccess"),
            // 复制失败提示
            copyError: this.$t("goodsDetailPage.copyError"),
            // 判断是不是预售商品
            advance: 0,
            // 预售商品的id
            advanceId: -1,
            // 预定商品成功提示
            orderSuccTips: this.$t("goodsDetailPage.orderSuccTips"),
            // 预定商品失败提示
            orderErrorTips: this.$t("goodsDetailPage.orderErrorTips"),
            // 预定商品余额不足，预定失败提示
            balanceLow: this.$t("goodsDetailPage.balanceLow"),
            // 删除预售商品成功提示
            orderDelSucc: this.$t("goodsDetailPage.orderDelSucc"),
            // 删除预售商品失败提示
            orderDelErr: this.$t("goodsDetailPage.orderDelErr"),
            all: [],
            activeList: "",
            activeindex: -1,
            activeOther: -1,
            likeid: "",
            // 加购的规格不是倍数
            mastSpec:this.$t('goodsDetailPage.mastSpec'),
            // 在售商品视频是否加载成功
            isVideo: true,
            // 主图视频地址
            videoUrl: '',
            playerOptions : {
                playbackRates: [0.7, 1.0, 1.5, 2.0], //播放速度
                autoplay: false, //如果true,浏览器准备好时开始回放。
                muted: false, // 默认情况下将会消除任何音频。
                loop: false, // 导致视频一结束就重新开始。
                preload: 'auto', // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
                language: 'zh-CN',
                aspectRatio: '4:3', // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
                fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
                sources: [{
                    type: "",
                    src: ''//url地址   
                    // src: "" //url地址
                }],
                poster: '', //你的封面地址
                // width: document.documentElement.clientWidth,
                notSupportedMessage: '此视频暂无法播放，请稍后再试', //允许覆盖Video.js无法播放媒体源时显示的默认信息。
                controlBar: {
                    timeDivider: true,
                    durationDisplay: true,
                    remainingTimeDisplay: false,
                    fullscreenToggle: true  //全屏按钮
                }
            },
            // 详情商品视频配置
            detailOptions:{
                playbackRates: [0.7, 1.0, 1.5, 2.0], //播放速度
                autoplay: false, //如果true,浏览器准备好时开始回放。
                muted: false, // 默认情况下将会消除任何音频。
                loop: false, // 导致视频一结束就重新开始。
                preload: 'auto', // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
                language: 'zh-CN',
                aspectRatio: '4:3', // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
                fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
                sources: [{
                    type: "",
                    src: ''//url地址   
                    // src: "" //url地址
                }],
                poster: '', //你的封面地址
                // width: document.documentElement.clientWidth,
                notSupportedMessage: '此视频暂无法播放，请稍后再试', //允许覆盖Video.js无法播放媒体源时显示的默认信息。
                controlBar: {
                    timeDivider: true,
                    durationDisplay: true,
                    remainingTimeDisplay: false,
                    fullscreenToggle: true  //全屏按钮
                }
            },
            // 是否显示详情视频
            isVideoDetail: false,
            // 详情视频地址
            detailVideoUrl: '',
            // 在售商品折扣价
            discount: '',
            // 英文下的样式
            langClass: '',
        }
    },

    created() {
        // 得到网址的参数
        this.getUrlData();
    },
    watch: {
        $route(val) {
            // 解决由当前商品详情页面跳转到其他页面时，还会用undefined来请求商品详情。
            if (val.name !== "goodsDetail") {
                return false;
            }
            this.getUrlData();
        }
    },
    computed: {
        // 引入goodsDetailPage里的中英文
        i18n() {
            return this.$t("goodsDetailPage");
        }
    },
    mounted() {
        // 禁止视频画中画、下载功能
        this.$refs.video["disablePictureInPicture"] = true;
        this.$refs.video2["disablePictureInPicture"] = true;
        window.addEventListener("scroll", this.btn_pos);
        this.langClass = localStorage.langSelect === '1' ? 'enClass' : '';
    },
    methods: {
        /**
         *  图片加载失败后的图片路径取值
         */
        defImg() {
            let img = event.srcElement;
            img.src = this.defaultImg;
            img.onerror = null; //防止闪图
        },
        /**
         *  获取购物车
         */
        ...mapActions([
            "getCartInfo"
        ]),
        /*
        * 复制成功时的回调函数
        */ 
        onCopy(e) {
            this.$Message.success({
                content: this.copySuccess,
                duration: 3
            });
        },
        /*
        * 复制失败时的回调函数
        */
        onError(e) {
            this.$Message.error({
                content: this.copyError,
                duration: 3
            });
        },
        /**
         * 得到网址的参数
         */
        getUrlData() {
            this.urlParams = getUrlParams();
            this.advance = this.urlParams.advance;
            this.getGoodsInfo(this.urlParams.item_no);
            this.currentNo = this.urlParams.item_no;
        },
        /**
         * 下载证书
         */
        upLoadCredent(item) {
            window.open(item.src);
        },
        clickRadio(item,index) {
            this.bindRadio(item,index)
        },
        /**
         * 根据点击查看判断其他属性哪个是有商品的
         */
        bindRadio(item, index) {
            var obj = {};
            obj[item.type] = item.value;
            this.$resetAjax({
                type: "POST",
                url: "/home/goods/check_choice",
                data: {
                    likeid: this.likeid,  // 同款商品likeid
                    need_attr:obj
                },
                success: res => {
                    let result = JSON.parse(res);
                    if(result.errorcode === 0) {
                        // 说明匹配到其他属性，这些属性是可以点击的商品属性
                        this.canClick(item,result.data)
                    }
                }
            });
        },
        /**
         * 非预售商品，点击其中一个属性后，把其他不可以选择的属性进行禁止掉
         *  @param {Object} data 当前所点击的那个属性对象
         * @param {Object} canData 当前其他可以点击的属性对象
         */
        canClick(data, canData) {
            this.otherData.forEach(ele => {
                ele.list.forEach(item => {
                    item.show = item.value === canData[ele.type][0];
                })
            })
        },
        /**
         * 得到商品详情
         */
        getGoodsInfo(item_no) {
            let type;
            let url;
            let data;
            if (this.advance === "1") {
                // 说明是预售商品
                (type = "POST"),
                (url = `/home/Presell/info`),
                (data = {
                    lang: localStorage.langSelect,
                    id: item_no
                });
            } else {
                (type = "POST"),
                (url = `/Home/Goods/index&id=${item_no}`),
                (data = {
                    lang: localStorage.langSelect,
                });
            }
            NProgress.start(); // 进度条开始
            this.$resetAjax({
                type,
                url,
                data,
                success: res => {
                    NProgress.done(); // 进度条结束
                    let result = JSON.parse(res);
                    if (this.advance === "1") {
                        // 预售商品详情处理
                        this.transAdvance(result);
                    } else {
                        // 非预售商品详情处理
                        this.transOrdinary(result);
                    }
                }
            });
        },
        /**
         * 预售商品详情处理
         */
        transAdvance(result) {
            let info = result.data;
            this.isVideo = true;                            // 不显示商品视频   
            this.item_name = info.item_name;                // 商品名
            this.base_price = info.base_price;              // 进货价
            this.sale_price = info.sale_price;              // 售价
            this.material = info.material;                  // 材质
            this.lwh = info.lwh || info.lwh_en;             // 尺寸：
            this.weight = info.weight;                      // 重量
            this.spec = info.purchase_spec;                 // 规格
            this.purchase_spec = info.lot_spec;             // 箱规
            this.stock_num = -1;                            // 判断是否有添加购物车功能
            this.display_falg = true;
            this.imgSrc = info.img;                         // 商品主图
            this.DetailImgUrl = info.details_img;           // 商品详情页长图
            this.features = info.features;                  // 商品特征
            this.notes = info.notes;                        // 注意事项
            this.usage = info.caution;                      // 用法
            this.expiration = info.expiration;              // 保质期
            this.like = info.like;                          // 是否收藏
            this.stuffing = info.stuffing;                  // 商品填充物
            this.advanceId = info.id;                       // 预售该商品的id
            this.deadline = info.deadline;                  //预售截止时间
            this.cycleTime = info.lead_time;                // 预定生产周期
            switch(localStorage.langSelect) {
                case '0':
                    this.deadlineText = `${this.cycleTime}天`;
                    break;
                case '1':
                    this.deadlineText = `${this.cycleTime} Days `;
            }
            this.goodsCnum = info.num = info.num === null ? 0 : Number(info.num); // 该商品已预定的数量
            info.order_num = info.order_num === null ? 0 : info.order_num;
            this.orderedNum = info.order_qty;
            //  当预售商品没有到截止时间并且有预售目标数量，且已预定的数量不能超过目标预售数量，才能够进行预定
            if((Date.parse(info.deadline) > Date.parse(info.time)) && info.target > 0 && Number(info.order_num) < Number(info.target)) {
                this.isDead = true;
            }
            switch (localStorage.langSelect) {
                case "0":
                    this.cnumTitle = `该商品您已预定${info.num}件`;
                    break;
                case "1":
                    this.cnumTitle = `You have reserved ${info.num} pieces of this product`;
                    break;
            }
        },
        /**
         * 非预售商品详情数据处理
         */
        transOrdinary(result) {
            // 商品详情里商品分类导航栏数据处理
            this.transGoodsCls(result.cls);
            // 商品详情里相关产品数据处理
            this.transRecommend(result.relation);
            // 商品详情商品基本信息数据处理
            this.transBasic(result.info);
            // 商品同款属性对照表
            let contrast = result.list_attr;
            // 商品同款属性数据处理
            if(result.list_attr && result.attr) {
                this.specArr(result.list_attr, result.attr);
            }
        },
        /**
         * 非预售商品详情里相关产品推荐数据处理
         * @param {Object} data 相关产品推荐数据
         */
        transRecommend(data) {
            // 获取同类推荐数据
            data.forEach(ele => {
                ele.relImg = `http://hwimg.xmvogue.com/thumb/${ele.item_no}.jpg?x-oss-process=style/440`;
                ele.carNum = Number(ele.spec);
            });
            this.relationData = data;
        },
        /**
         * 非预售商品详情里商品类别导航栏数据处理
         * @param {Object} data 商品类别处理
         */
        transGoodsCls(data) {
            if(data.length !== 0) {
                var clsResult = data;
                this.titleList = clsResult;
                this.major = clsResult[0].title;
                this.middle = clsResult[1].title;
            } else {
                var clsResult = [];
                this.titleList = [];
                this.major = '';
                this.middle = '';
            }
        },
        /**
         *  非预售商品详情商品基本信息数据处理
         *  @param {Object} data 商品基本信息数据处理
         */
        transBasic(info) {
            this.item_name = info.item_name; // 商品名称
            this.likeid = info.likeid;  // 商品同款所属ID
            this.barcode = `http://order.xmvogue.com/word/public/index.php?s=home/Cart/barcode_create&sn=${info.item_no}`;
            this.item_no = info.item_no;            // 商品id
            this.sale_price = info.sale_price;      // 售价
            this.base_price = info.base_price;      // 进货价
            this.material = info.material;          // 材质
            this.hs_code = info.hs_code;            // 海关编码
            this.weight = info.weight;              // 重量
            this.lwh = info.lwh;                    // 尺寸：
            this.discount = info.discount;          // 折扣
            this.advance = '0'
            info.credential_new.forEach(ele => {
                let form = ele.form;
                switch (form) {
                    case 3:
                        switch (localStorage.langSelect) {
                        case "0":
                            ele.text = `证书+报告：${ele.name}`;
                            break;
                        case "1":
                            ele.text = `Certificates & Reports：${ele.name}`;
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
            this.credential = info.credential_new;              // 证书地址
            this.goodsCnum = Number(info.cnum);                 // 商品详情里的购物车数量
            this.like = info.like;
            this.features = info.features;
            this.usage = info.usage;
            this.notes = info.notes;
            this.spec = Number(info.spec);                      // 规格
            this.purchase_spec = Number(info.lot_spec);         // 箱规数量
            this.carNum = Number(info.spec);
            this.stock_num = Number(info.stock_num);
            // 商品是否下线 1表示上线
            this.display_falg = info.display_flag === 1 ? true : false;
            // 判断是否可以加入第三种判断
            if( (Number(info.sale_num) + Number(info.cnum) - this.stock_num) < 0 && this.display_falg && this.advance !== '1' && this.stock_num !== 0) {
                // 说明要显示不能加购的提示按钮
                this.surplus = false;
            } else {
                // 说明要显示提示可以加够的按钮
                this.surplus = true;
            }
             // 查看图片是否可以显示
            let img = new Image();
            img.src = `https://ximiphoto.oss-cn-hangzhou.aliyuncs.com/thumb/${info.item_no}.jpg?x-oss-process=style/800`;
            img.onload = () => {
                // 图片可以展示显示图片
                this.imgSrc = `https://ximiphoto.oss-cn-hangzhou.aliyuncs.com/thumb/${info.item_no}.jpg?x-oss-process=style/800`; // 商品产品图
            };
            img.onerror = () => {
                // 图片不可以展示显示默认图片
                // this.imgSrc = "http://dh.xmcpcn.com/Public/images/none.jpg";
                this.imgSrc = 'https://uh.edu/pharmacy/_images/directory-staff/no-image-available.jpg'
            };
            this.playerOptions.poster = info.img;
            if(info.video) {
                this.detailVideoUrl = info.video;
                this.detailOptions['sources'][0]['src'] = info.video;
                this.isVideoDetail = true;
            } else {
                this.isVideoDetail = false;
            }
            this.videoUrl = `https://ximiphoto.oss-cn-hangzhou.aliyuncs.com/video/${info.item_no}.mp4`;
            this.DetailImgUrl = `http://hwimg.xmvogue.com/detail/${info.item_no}-.jpg?x-oss-process=style/800`; // 商品详情图片
            // 判断视频是否加载成功
            this.isVideoShow()
        },
        /**
         * 判断在售商品视频是否加载成功
         * @param videoUrl {String} 商品条码拼接成的视频地址
         * @param infoImg {String} 商品条码拼接成的主图地址
         */
        isVideoShow() {
            let that = this;
            var video = document.createElement('video');
            video.onload = function() {
            }
            video.onerror = function() {
                that.isVideo = true;
                that.playerOptions.poster =  '';
                that.playerOptions['sources'][0]['src'] = '';
            }
            video.src = that.videoUrl;
            //不同浏览器情况不同，这里判断在该浏览器是否可以播放
            video.oncanplaythrough = function() {
                that.isVideo = false;
                that.playerOptions.poster = that.imgSrc;
                that.playerOptions['sources'][0]['src'] = that.videoUrl;
            };
        },
        /**
         * 商品同款数据处理
         */
        getSameGoods(contrast, resultAttr) {
            // 商品同款属性数据
            resultAttr.forEach(ele => {
                ele.activeClass = -1;
                contrast.forEach(con => {
                    if (ele.attr_type === con.type) {
                        ele.typeName = con.name;
                    }
                    });
                    ele.border = true;
                    let newArr = [];
                    ele.list.forEach(item => {
                    item.activeStr = -1;
                    item.item_nos = [item.item_no];
                    // 对商品属性名去重，例如 两个棉去重变成一个棉
                    let isIn = false;
                    newArr.forEach(ele => {
                        if (ele.attr_name === item.attr_name) {
                            ele.item_nos.push(item.item_no);
                            isIn = true;
                        }
                    });
                    !isIn && newArr.push(item);
                });
                ele.list = newArr;
            });
            this.otherData = resultAttr;
            
        },
        /**
         * 商品同款属性数据处理
         * @param {Array} list_attr 商品有几个属性数组
         * @param {Array} goodsAttr 商品对应的属性数组
         */
        specArr(list_attr, attr) {
            let that = this;
            list_attr.forEach((item, index)=> {
                let arr = [];
                attr.forEach((eve, k) => {
                    let goods = eve.attr;
                    goods.forEach((dvd, s) => {
                        dvd.show = false;
                        if (item.type == dvd.attr_type) {
                            arr.push(dvd);
                        }
                    });
                });
                let content = that.distinct(arr);
                item.list = content;
            });
            list_attr.forEach((item, index)=> {
                let items = item.list;
                item.value = "";
                items.forEach((eve, k) =>{
                    attr.forEach((hvh, h) => {
                        let goods = hvh.attr;
                        if (that.currentNo == hvh.item_no) {
                            goods.forEach((dvd, s) => {
                                if (eve.value == dvd.value) {
                                    item.value = dvd.value;
                                   
                                }
                            });
                        }
                    });
                });
            });
            this.all = attr;
            list_attr.forEach(ele => {
                ele.list.forEach(item =>  {
                    item.selectClass = false;
                    if(item.value === ele.value) {
                        item.selectClass = true;
                    }
                })
            })
            this.otherData = list_attr;
        },
        distinct(arr) {
            const res = new Map();
            return arr.filter(arr => !res.has(arr.value) && res.set(arr.value, 1));
        },
        /**
         * 切换商品选择
         */
        changeBorder(data) {
            this.otherData.forEach(ele => {
                if (ele.attr1 === data || ele.attr2 === data) {
                    this.$router.push({path: "/goodsDetail",query: { item_no: ele.item_no }
                });
                }
            });
        },
        /**
         * 更该商品的数量
         */
        shopChange(val) {
            this.carNum = val;
        },
        shopChangeItem(val, item) {
            item.carNum = val;
        },
        /**
         * 相关产品里删除购物车里的商品
         */
        delCartItem(item) {
            NProgress.start();
            this.$resetAjax({
                type: "POST",
                url: `/Home/Cart/delCart`,
                data: {
                    uid: localStorage.uid,
                    sn: item.item_no
                },
                success: res => {
                    NProgress.done();
                    let result = JSON.parse(res).result;
                    if (result === "ok") {
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
                    } else {
                        this.$Message.error({
                            content: this.delItemError,
                            duration: 3
                        });
                    }
                }
            });
        },
        /**
         * 商品详情清除购物车里的该商品
         */
        delCart(item_no, carNum) {
            NProgress.start();
            this.$resetAjax({
                type: "POST",
                url: `/Home/Cart/delCart`,
                data: {
                    uid: localStorage.uid,
                    sn: item_no
                },
                success: res => {
                    NProgress.done();
                let result = JSON.parse(res).result;
                if (result === "ok") {
                    this.$Message.success({
                        content: this.delItemSuccess,
                        duration: 3
                    });
                    this.goodsCnum = 0;
                    /* this.getDataCard({
                        vm: this,
                        inland: '',
                        page: 1
                    }); */
                    // 获取头部购物车商品总数量和总金额
                    this.getCartInfo({
                        vm: this
                    }); 
                } else {
                    this.$Message.error({
                        content: this.delItemError,
                        duration: 3
                    });
                }
                }
            });
        },
        /**
         * 预定商品请求
         */
        orderGoods() {
            this.$resetAjax({
                type: "POST",
                url: "/home/presell/checkout",
                data: {
                    gid: this.advanceId, // 预定商品编码
                    qty: this.spec // 预定商品数量
                },
                success: res => {
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
                            this.goodsCnum = Number(result.data.totle_order); // 当前用户预定该商品的数量
                            this.orderedNum = Number(result.data.num); // 该件商品的所有用户下单总数
                            switch(localStorage.langSelect) {
                                case '0':
                                    this.cnumTitle =`该商品您已预定${this.orderedNum}件`;
                                    break;
                                case '1':
                                    this.cnumTitle = `You have reserved ${this.orderedNum} pieces of this product`;
                                    break;
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
                }
            });
        },
        /**
         * 删除该预售商品订单
         */
        delOrder() {
            this.$resetAjax({
                type: "POST",
                url: "/home/presell/delorder",
                data: {
                    gid: this.advanceId // 预定商品编码
                },
                success: res => {
                    let result = JSON.parse(res);
                    let msg = result.errorcode;
                    switch (msg) {
                        case 0:
                            this.$Message.success({
                                content: this.orderDelSucc,
                                duration: 3
                            });
                            this.getCartInfo({
                                vm: this
                            });
                            this.goodsCnum = Number(result.data.num); // 当前购物车该商品的数量
                            break;
                        default:
                            this.$Message.error({
                                content: this.orderDelErr,
                                duration: 3
                            });
                            break;
                    }
                }
            });
        },
        /**
         * 相关产品加入购物车
         */
        addShopItem(item, carNum) {
            if(item.carNum < item.spec) {
                this.$Message.warning({
                    content: this.mastSpec,
                    duration: 3
                })
                return false;
            }
            NProgress.start();
            this.$resetAjax({
                type: "POST",
                url: "/Home/Cart/addCart",
                data: {
                    sn: item.item_no,
                    num: carNum,
                    max_buy: 40 //最大数量加购物
                },
                success: res => {
                    NProgress.done();
                    let result = JSON.parse(res);
                    let msg = result.msg;
                    switch (msg) {
                        case "ok":
                            // 如果库存不够，添加购物车只能成功一部分，给用户提示
                            if (Number(result.num) !== Number(item.carNum)) {
                                switch (localStorage.langSelect) {
                                    case "0":
                                        this.$Message.success({
                                            content: `很抱歉，由于库存不够，${result.num}件商品添加成功`,
                                            duration: 3
                                        });
                                        break;
                                    case "1":
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
                            // // 重新请求购物车数据
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
                        default:
                            this.$Message.error({
                                content: this.adderrTip,
                                duration: 3
                            });
                            break;
                    }
                // if(JSON.parse(res).msg === 'ok') {
                //     this.cnum = Number(this.carNum) + Number(this.cnum)
                //     this.cnumTitle = `购物车已有${this.cnum}件`
                //     this.$Message.success('添加成功');
                //     this.getDataCard({vm: this}); // 重新请求购物车数据
                // } else {
                //     this.$Message.error(JSON.parse(res).msg);
                // }
                }
            });
        },
        /**
         * 商品详情加入购物车
         */
        addShop(item_no, carNum) {
            NProgress.start();
            this.$resetAjax({
                type: "POST",
                url: "/Home/Cart/addCart",
                data: {
                    sn: item_no,
                    num: carNum,
                    max_buy: 40 //最大数量加购物
                },
                success: res => {
                    NProgress.done();
                    let result = JSON.parse(res);
                    let msg = result.msg;
                    switch (msg) {
                        case "ok":
                            if (Number(result.num) !== Number(carNum)) {
                                switch (localStorage.langSelect) {
                                case "0":
                                    this.$Message.success({
                                        content: `很抱歉，由于库存不够，${result.num}件商品添加成功`,
                                        duration: 3
                                    });
                                    break;
                                case "1":
                                    this.$Message.info({
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
                            this.goodsCnum += Number(result.num); // 当前购物车该商品的数量
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
                        default:
                            this.$Message.error({
                                content: this.adderrTip,
                                duration: 3
                            });
                            break;
                    }
                    // if(JSON.parse(res).msg === 'ok') {
                    //     this.cnum = Number(this.carNum) + Number(this.cnum)
                    //     this.cnumTitle = `购物车已有${this.cnum}件`
                    //     this.$Message.success('添加成功');
                    //     this.getDataCard({vm: this}); // 重新请求购物车数据
                    // } else {
                    //     this.$Message.error(JSON.parse(res).msg);
                    // }
                }
            });
        },
        /**
         * 点击描述选中
         */
        describeClick() {
            this.clickindex = 1;
        },
        /**
         * 点击其他资讯选中
         */
        infomatinClick() {
            this.clickindex = 2;
        },
        /**
         * 相关产品跳转到商品详情
         */
        goGoodsDetail(nonum) {
            // 新开页面跳转到商品详情页面
            this.$router.push({ path: "/goodsDetail", query: { item_no: nonum } });
            location.reload();
            // let routeData = this.$router.resolve({ name: 'goodsDetail', query: {item_no:nonum}});
            // window.open(routeData.href, '_blank');
        },
        /**
         * 预售商品进行收藏、取消收藏操作
         */
        advanceCollect() {
            this.$resetAjax({
                type: "POST",
                url: "/home/Presell/addlike",
                data: {
                    gid: this.advanceId
                },
                success: res => {
                    let result = JSON.parse(res);
                    if (result.errorcode === 0) {
                        this.$Message.success(this.collectSuccess);
                        this.like = this.like === 1 ? 0 : 1;
                    }
                }
            });
        },
        /**
         * 产品详情里收藏商品判断
         */
        collectGoodsDetail() {
            switch (this.advance) {
                case "1":
                    // 判断是预售商品还是常规商品
                    this.advanceCollect();
                    break;
                default:
                    if (this.like) {
                        this.like = 0;
                        this.delcollect(this); // 取消收藏请求
                    } else {
                        this.like = 1;
                        this.addcollect(this); // 收藏请求
                    }
                    break;
            }
        },
        /**
         * 相关产品里收藏商品判断
         */
        collectGoods(data) {
            if (data.like) {
                data.like = 0;
                this.delcollect(data); // 取消收藏请求
            } else {
                data.like = 1;
                this.addcollect(data); // 收藏请求
            }
        },
        /**
         * 收藏请求
         */
        addcollect(item) {
            this.$resetAjax({
                type: "POST",
                url: "/Home/Collect/add",
                data: {
                    sn: item.item_no,
                    uid: localStorage.uid
                },
                success: res => {
                    let result = JSON.parse(res);
                    this.$Message.success(this.collectSuccess);
                }
            });
        },
        /**
         * 取消收藏请求
         */
        delcollect(item) {
            this.$resetAjax({
                type: "POST",
                url: "/Home/Collect/del",
                data: {
                    sn: item.item_no,
                    uid: localStorage.uid
                },
                success: res => {
                    let result = JSON.parse(res);
                    this.$Message.warning(this.collectError);
                }
            });
        },
        /*
        *   获取滚动条高度
        */
        btn_pos() {
            //滚动条的高度
            this.scrollTop =
                document.body.scrollTop || document.documentElement.scrollTop;
        },
    },

    destroyed() {
        //离开这个界面之后，删除，不然会有问题
        window.removeEventListener("scroll", this.btn_pos);
    }
};
</script>

<style lang="less" scoped>
/deep/ .ivu-tooltip-inner{
max-width: 500px;
}
</style>
