<template>
    <div id="enterPage">
        <!-- 引入动画组件 等页面数据加载完了再出现动画 -->
       <!--  <xmAnimation v-if="isLoadAllData"> 
            <template slot="animation"> -->
            <!--  slot="animation" -->
                <!-- banner 动画必备样式，不可更改ani-session -->
                <div class="banner" id="banner">
                    <div class="banner_inner">
                        <!--  animated fadeInLeft -->
                        <div class="swiper_conver">
                            <swiper :options="swiperOption" ref="mySwiper" v-if="isSwiperReaded"  @mouseenter="swipermySwiperEnter" @mouseleave="swipermySwiperLeave">
                                <swiper-slide  v-for="(item,index) in bannerData" :key="index">
                                    <div class="banner_background" :style="{background: `url(${item.bannerImg})`}"></div>
                                </swiper-slide>
                            </swiper>
                        </div>
                        <!-- 广告模块 -->
                        <!--  animated fadeInRight -->
                        <ul class="promotion">
                            <li v-for="(item,index) in advertising " :key="index">
                                <img v-lazy="item.imgUrl" alt="" @click="goCorresGoods(item)">
                            </li>
                            <li style="width:100%;position:relative;padding-bottom:56.25%;    /*需要用padding来维持16:9比例,也就是9除以16*/height: 0;">
                                <video :src="videoSrc" id="videoPlay" preload="auto" ref="video" controls="controls" muted  controlslist="nodownload" style="position: absolute;top:0;left: 0;width: 100%;height: 100%;object-fit:fill;outline: none;"></video>
                            </li>
                        </ul>
                    </div>
                </div>
                <!-- 锚点 --> 
                <Anchor show-ink class="anchor_contanier" v-if="isCreateAnchor">
                    <AnchorLink href="#prevention" :title="i18n.prevention" v-if="epidemicData.length!==0"/>
                    <AnchorLink href="#latest" :title="i18n.latestlink"></AnchorLink>
                    <AnchorLink href="#host" :title="i18n.hostlink" />
                    <AnchorLink href="#recommend" :title="i18n.recommendlink" />
                    <AnchorLink href="#advance" :title="i18n.advance" v-if="advaceData.length!==0"/>
                    <AnchorLink href="#guess" :title="i18n.guesslink"></AnchorLink>
                </Anchor>
                <div class="adver" >
                    <div class="adver_inner">
                        <img src="@/assets/images/adver.jpg" alt="" @click="$router.push({path: '/searchKey', query: {keyword: i18n.prevention, select: 'K'}})">
                    </div>
                </div>
                <!-- 防疫用品  动画必备样式，不可更改ani-session-->
                <div class="host" id="prevention" >
                    <div class="host_inner" v-if="epidemicData.length > 0">
                        <h3 class="host_title"><span>{{i18n.prevention}}</span> </h3>
                        <p class="see_more" :title="i18n.lookMoreTips" @click="$router.push({path: '/searchKey', query: {keyword: i18n.prevention, select: 'K'}})">{{i18n.lookMore}}</p>
                        <ul>
                            <li v-for="(item,index) in epidemicData" :key="index">
                                <div style="margin: 0px 0px 36px;box-shadow: 2px 2px 8px rgba(0,0,0,.2);">
                                    <div class="prod_top"  @click="goGoodsDetail(item.item_no)">
                                        <img v-lazy="item.imgUrl" alt="" :title="i18n.lookDetail">
                                    </div>
                                    <div class="prod_info">
                                        <div class="prod_title">
                                            <h3>
                                                {{item.item_no}}
                                                <span style="width: 24px;height:20px;display:inline-block;">
                                                    <Icon type="md-copy" size="20" class="copy_icon" :title="i18n.copyContent" v-clipboard:copy="item.item_no" v-clipboard:success="onCopy" v-clipboard:error="onError" />
                                                </span>
                                            </h3>
                                            <p class="isLike" @click="collectGoods(item)">
                                                <Icon type="ios-heart" size="30" color="red" v-if="item.like === 1" />
                                                <Icon type="ios-heart" size="30" color="rgb(83, 210, 232)" v-else />
                                            </p>
                                        </div>
                                        <!--  @click="goGoodsDetail(item.item_no)" :title="i18n.lookDetail" -->
                                        <h3 class="prod_name"  :title="item.item_name">{{item.item_name}}</h3>
                                        <div class="prod_price">
                                            <p class="unit">
                                                {{i18n.unit}}
                                                <span v-show="item.discount">￥{{item.discount}}</span>
                                                <span :class="item.discount ? 'baseLine' : ''">￥{{item.base_price}}</span>
                                            </p>
                                            <p class="export">{{i18n.export}}<span>￥{{item.sale_price}}</span></p>
                                        </div>
                                    </div>
                                    <div class="prod_handle">
                                        <addCartPrice :multipleNum="item.spec" :InitPrice="item.spec" @onChange="shopChange($event,item)"></addCartPrice>
                                        <a class="add_handle">
                                            <span @click="addShop(item)" class="add_shop">{{i18n.addCart}} </span>
                                            <span :title="i18n.cnumTips" class="cnum_tips" :style="item.cnum === 0 ? 'color:#333' : 'color:#dd0017'">[ {{item.cnum}} ]</span>
                                            <Icon type="md-trash" size="24" v-show="item.cnum !== 0" class="trash" @click="delCart(item)" :title="i18n.delTips" />
                                        </a>
                                    </div>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
                  <!-- 最新产品 -->
                <div class="host" id="latest">
                    <div class="host_inner">
                        <h3 class="host_title"><span>{{i18n.latest}}</span></h3>
                        <p class="see_more" :title="i18n.lookMoreTips" @click="$router.push({path: '/searchKey', query: {keyword: i18n.NewArrivals, select: 'A'}})">{{i18n.lookMore}}</p>
                        <ul>
                            <li v-for="(item,index) in latestList" :key="index">
                                <div style="margin: 0px 0px 36px;box-shadow: 2px 2px 8px rgba(0,0,0,.2);">
                                    <div class="prod_top"  @click="goGoodsDetail(item.item_no)">
                                        <img v-lazy="item.imgUrl" alt="" :title="i18n.lookDetail">
                                    </div>
                                    <div class="prod_info">
                                        <div class="prod_title">
                                            <h3>
                                                {{item.item_no}}
                                                <span style="width: 24px;height:20px;display:inline-block;">
                                                    <Icon type="md-copy" size="20" class="copy_icon" :title="i18n.copyContent" v-clipboard:copy="item.item_no" v-clipboard:success="onCopy" v-clipboard:error="onError" />
                                                </span>
                                            </h3>
                                            <p class="isLike" @click="collectGoods(item)">
                                                <Icon type="ios-heart" size="30" color="red" v-if="item.like === 1" />
                                                <Icon type="ios-heart" size="30" color="rgb(83, 210, 232)" v-else />
                                            </p>
                                        </div>
                                        <!--  @click="goGoodsDetail(item.item_no)" :title="i18n.lookDetail" -->
                                        <h3 class="prod_name" :title="item.item_name">{{item.item_name}}</h3>
                                        <div class="prod_price">
                                            <p class="unit">
                                                {{i18n.unit}}
                                                <span v-show="item.discount">￥{{item.discount}}</span>
                                                <span :class="item.discount ? 'baseLine' : ''">￥{{item.base_price}}</span>
                                            </p>
                                            <p class="export">{{i18n.export}}<span>￥{{item.ling}}</span></p>
                                        </div>
                                    </div>
                                    <div class="prod_handle">
                                        <addCartPrice :multipleNum="item.spec" :InitPrice="item.spec" @onChange="shopChange($event,item)"></addCartPrice>
                                        <a class="add_handle">
                                            <span @click="addShop(item)" class="add_shop">{{i18n.addCart}} </span>
                                            <span :title="i18n.cnumTips" class="cnum_tips" :style="item.cnum === 0 ? 'color:#333' : 'color:#dd0017'">[ {{item.cnum}} ]</span>
                                            <Icon type="md-trash" size="24" v-show="item.cnum !== 0" class="trash" @click="delCart(item)" :title="i18n.delTips" />
                                        </a>
                                    </div>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
                <!-- 热卖产品  动画必备样式，不可更改ani-session-->
                <div class="host"  id="host">
                    <div class="host_inner">
                        <h3 class="host_title"><span>{{i18n.host}}</span> </h3>
                        <p class="see_more" :title="i18n.lookMoreTips" @click="lookMoreGoods('heat')">{{i18n.lookMore}}</p>
                        <ul>
                            <li v-for="(item,index) in hostList" :key="index">
                                <div style="margin: 0px 0px 36px;box-shadow: 2px 2px 8px rgba(0,0,0,.2);">
                                    <div class="prod_top"  @click="goGoodsDetail(item.item_no)">
                                        <img v-lazy="item.imgUrl" alt="" :title="i18n.lookDetail">
                                    </div>
                                    <div class="prod_info">
                                        <div class="prod_title">
                                            <h3>
                                                {{item.item_no}}
                                                <span style="width: 24px;height:20px;display:inline-block;">
                                                    <Icon type="md-copy" size="20" class="copy_icon" :title="i18n.copyContent" v-clipboard:copy="item.item_no" v-clipboard:success="onCopy" v-clipboard:error="onError" />
                                                </span>
                                            </h3>
                                            <p class="isLike" @click="collectGoods(item)">
                                                <Icon type="ios-heart" size="30" color="red" v-if="item.like === 1" />
                                                <Icon type="ios-heart" size="30" color="rgb(83, 210, 232)" v-else />
                                            </p>
                                        </div>
                                        <!-- @click="goGoodsDetail(item.item_no)"  -->
                                        <h3 class="prod_name" :title="item.item_name">{{item.item_name}}</h3>
                                        <div class="prod_price">
                                            <p class="unit">
                                                {{i18n.unit}}
                                                <span v-show="item.discount">￥{{item.discount}}</span>
                                                <span :class="item.discount ? 'baseLine' : ''">￥{{item.base_price}}</span>
                                            </p>
                                            <p class="export">{{i18n.export}}<span>￥{{item.sale_price}}</span></p>
                                        </div>
                                    </div>
                                    <div class="prod_handle">
                                        <addCartPrice :multipleNum="item.spec" :InitPrice="item.spec" @onChange="shopChange($event,item)"></addCartPrice>
                                        <a class="add_handle">
                                            <span @click="addShop(item)" class="add_shop">{{i18n.addCart}} </span>
                                            <span :title="i18n.cnumTips" class="cnum_tips" :style="item.cnum === 0 ? 'color:#333' : 'color:#dd0017'">[ {{item.cnum}} ]</span>
                                            <Icon type="md-trash" size="24" v-show="item.cnum !== 0" class="trash" @click="delCart(item)" :title="i18n.delTips" />
                                           
                                        </a>
                                    </div>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div> 
                <!-- 推荐产品 动画必备样式，不可更改ani-session-->
                <div class="host" id="recommend">
                    <div class="host_inner">
                        <h3 class="host_title"><span>{{i18n.recommend}}</span></h3>
                        <p class="see_more" :title="i18n.lookMoreTips" @click="lookMoreGoods('rec')">{{i18n.lookMore}}</p>
                        <ul>
                            <li v-for="(item,index) in commendList" :key="index">
                                <div style="margin: 0px 0px 36px;box-shadow: 2px 2px 8px rgba(0,0,0,.2);">
                                    <div class="prod_top"  @click="goGoodsDetail(item.item_no)">
                                        <img v-lazy="item.imgUrl" alt="" :title="i18n.lookDetail">
                                    </div>
                                    <div class="prod_info">
                                        <div class="prod_title">
                                            <h3>
                                                {{item.item_no}}
                                                <span style="width: 24px;height:20px;display:inline-block;">
                                                    <Icon type="md-copy" size="20" class="copy_icon" :title="i18n.copyContent" v-clipboard:copy="item.item_no" v-clipboard:success="onCopy" v-clipboard:error="onError" />
                                                </span>
                                            </h3>
                                            <p class="isLike" @click="collectGoods(item)">
                                                <Icon type="ios-heart" size="30" color="red" v-if="item.like === 1" />
                                                <Icon type="ios-heart" size="30" color="rgb(83, 210, 232)" v-else />
                                            </p>
                                        </div>
                                        <!--  @click="goGoodsDetail(item.item_no)" :title="i18n.lookDetail" -->
                                        <h3 class="prod_name" :title="item.item_name">{{item.item_name}}</h3>
                                        <div class="prod_price">
                                            <p class="unit">
                                                {{i18n.unit}}
                                                <span v-show="item.discount">￥{{item.discount}}</span>
                                                <span :class="item.discount ? 'baseLine' : ''">￥{{item.base_price}}</span>
                                            </p>
                                            <p class="export">{{i18n.export}}<span>￥{{item.sale_price }}</span></p>
                                        </div>
                                    </div>
                                    <div class="prod_handle">
                                        <addCartPrice :multipleNum="item.spec" :InitPrice="item.spec" @onChange="shopChange($event,item)"></addCartPrice>
                                        <a class="add_handle">
                                            <span @click="addShop(item)" class="add_shop">{{i18n.addCart}} </span>
                                            <span :title="i18n.cnumTips" class="cnum_tips" :style="item.cnum === 0 ? 'color:#333' : 'color:#dd0017'">[ {{item.cnum}} ]</span>
                                            <Icon type="md-trash" size="24" v-show="item.cnum !== 0" class="trash" @click="delCart(item)" :title="i18n.delTips" />
                                        </a>
                                    </div>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
                <!-- 猜你喜欢 动画必备样式，不可更改ani-session -->
                <!-- <div class="banner_bottom" id="guess" v-show="bannerBottom.length > 0">
                    <div class="bottom_inner"  @mouseenter="swiperBottomEnter" @mouseleave="swiperBottomLeave">
                        <h3>{{i18n.guess}}</h3>
                        <swiper :options="swiperbottom" ref="swiperbottom" v-if="isSwiperBottom">

                            <swiper-slide  v-for="(item,index) in bannerBottom" :key="index">
                                <div class="banner_background" :style="{background: `url(${item.bannerImg})`}"></div>
                            </swiper-slide>

                            <div class="swiper-pagination2"  slot="pagination"></div>
                            <div class="swiper-button-prev" slot="button-prev" @click="swiper.slidePrev()">
                                <Icon type="ios-arrow-back" size="24" color="#333"/>
                            </div>
                            <div class="swiper-button-next" slot="button-next" @click="swiper.slideNext()">
                                <Icon type="ios-arrow-forward" size="24" color="#333" />
                            </div>
                        </swiper>
                    </div>
                </div> -->
                <!-- 预售商品 -->
                <div class="host" id="advance" v-if="advaceData.length!==0">
                    <div class="host_inner">
                        <h3 class="host_title"><span>{{i18n.advance}}</span> </h3>
                        <p class="see_more" :title="i18n.lookMoreTips" @click="lookMoreGoods('advance')">{{i18n.lookMore}}</p>
                        <ul>
                            <li v-for="(item,index) in advaceData" :key="index">
                                <div style="margin: 0px 0px 36px;box-shadow: 2px 2px 8px rgba(0,0,0,.2);">
                                    <div class="prod_top"  @click="$router.push({path: '/goodsDetail',query: {item_no:item.id,advance: 1}})">
                                        <img v-lazy="item.imgUrl" alt="" :title="i18n.lookDetail">
                                        <!-- 预定商品已拍数量进度条百分比 -->
                                        <Tooltip :content="item.progressTip"  max-width="200" class="new_time" placement="top-start" theme="light" style="width: 100%">
                                            <Progress :percent="item.percent" text-inside  :stroke-color="['#f5582d', '#ffa40d']" status="wrong" :stroke-width="10"/>
                                        </Tooltip>
                                        <!-- 预定商品截止时间倒计时时间 -->
                                        <Tag type="dot" class="down_time" v-if="item.isDead">
                                            <downTime v-show="item.deadline !== undefined && item.deadline !== '0000-00-00 00:00:00'" class="down_detail" :endTime="new Date(item.deadline).getTime()" :title="i18n.downTimeTips" :itemTime="item.deadline" :startTime="new Date(item.time).getTime()" :endMsg="''"/>
                                        </Tag>
                                    </div>
                                    <div class="prod_info">
                                        <!--  @click="$router.push({path: '/goodsDetail',query: {item_no:item.id,advance: 1}})" :title="i18n.lookDetail" -->
                                        <h3 class="prod_name" :title="item.item_name">{{item.item_name}}</h3>
                                        <div class="prod_price">
                                            <p class="unit">{{i18n.unit}}<span>￥{{item.base_price}}</span></p>
                                            <p class="export">{{i18n.export}}<span>￥{{item.sale_price }}</span></p>
                                        </div>
                                    </div>
                                    <!-- 超过预售截止时间，没有预定功能 -->
                                    <div class="prod_handle" v-if="item.isDead">
                                        <addCartPrice :multipleNum="item.spec" :InitPrice="item.spec" @onChange="shopChange($event,item)"></addCartPrice>
                                        <a class="add_handle" >
                                            <span @click="orderGoods(item)" class="add_shop">{{i18n.addOrder}}</span>
                                            <span :title="item.cnumTitle" class="cnum_tips" :style="item.goods_order === 0 ? 'color:#333' : 'color:#dd0017'">[ {{item.goods_order}} ]</span>
                                        </a>
                                    </div>
                                    <p class="prod_handle"  v-else style="font-size:16px;color:#d92524;">{{i18n.preColsed}}</p>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
                <!-- 浏览记录 -->
                <div class="commend_goods" v-show="recodesList.length > 0" id="guess">
                    <div class="comment_inner" @mouseenter="swiperEnter" @mouseleave="swiperLeave">
                        <h3 class="comment_title">{{i18n.commentTitle}}</h3>
                        <swiper :options="swiperRecodes" ref="swiperRecodes" v-if="isSwiperRecodes">
                            <!-- slides -->
                            <swiper-slide v-for="(item,index) in recodesList" :key="index">
                                <div class="slide_item">
                                    <div class="prod_top">
                                        <img :src="item.imgUrl" alt="" :title="i18n.lookDetail" @click="goGoodsDetail(item.item_no)">
                                        <p class="isLike" @click="collectGoods(item)">
                                            <Icon type="ios-heart" size="30" color="red" v-if="item.like === 1" />
                                            <Icon type="ios-heart" size="30" color="rgb(83, 210, 232)" v-else />
                                        </p>
                                    </div>
                                    <div class="prod_info">
                                        <p class="prod_title">
                                            {{item.item_no}}
                                            <span style="width: 24px;height:20px;display:inline-block;">
                                                <Icon type="md-copy" size="20" class="copy_icon" :title="i18n.copyContent" v-clipboard:copy="item.item_no" v-clipboard:success="onCopy" v-clipboard:error="onError" />
                                            </span>
                                        </p>
                                        <!--  @click="goGoodsDetail(item.item_no)" :title="i18n.lookDetail" -->
                                        <h3 class="prod_name" :title="item.item_name">
                                            {{item.item_name}}
                                        </h3>
                                        <div class="prod_price">
                                            <p class="unit">
                                                {{i18n.unit}}
                                                <span v-show="item.discount">￥{{item.discount}}</span>
                                                <span :class="item.discount ? 'baseLine' : ''">￥{{item.base_price}}</span>
                                            </p>
                                            <p class="export">{{i18n.export}}
                                                <span>￥{{item.sale_price }}</span>
                                            </p>
                                        </div>
                                        <div class="prod_handle">
                                            <addCartPrice :multipleNum="item.spec" :InitPrice="item.spec" @onChange="shopChange($event,item)"></addCartPrice>
                                            <p class="add_handle">
                                                <span @click="addShop(item)">{{i18n.addCart}} </span>
                                                <span :title="i18n.cnumTips" class="cnum_tips" :style="item.cnum === 0 ? 'color:#333' : 'color:#dd0017'"> [ {{item.cnum}} ]</span>
                                                <Icon type="md-trash" size="24" v-show="item.cnum !== 0" class="trash" @click="delCart(item)" :title="i18n.delTips" />
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </swiper-slide>
                            <!-- Optional controls -->
                            <div class="swiper-pagination2" slot="pagination"></div>
                            <div class="swiper-button-prev swiper-button-blue" slot="button-prev" @click="swiper.slidePrev()">
                                <Icon type="ios-arrow-back" size="24" color="#333" />
                            </div>
                            <div class="swiper-button-next swiper-button-blue" slot="button-next" @click="swiper.slideNext()">
                                <Icon type="ios-arrow-forward" size="24" color="#333" />
                            </div>
                        </swiper>
                    </div>
                </div>
        <!-- </template>
        </xmAnimation> -->
    </div> 
</template>


<script>
import CartPrice from '@/components/common/cart-price';
import addCartPrice from '../common/addCart-price.vue'   // 引入input加购购物车
import { mapState, mapActions } from 'vuex';
import xmAnimation from '@/components/xmAnimation'
import "@/assets/style/animate.less"; 
import NProgress from 'nprogress'   // 引入进度条
import 'nprogress/nprogress.css'    // 引入进度条
import downTime from '@/components/cart/downTime'  // 倒计时
export default {
    name: 'enter',
    components: {
        CartPrice,
        addCartPrice,
        xmAnimation,  // 引入动画组件
        downTime
    },

    data() {
        return {
            isCreateAnchor: false,
            hostAnima: '',
            // 轮播配置
            swiperOption: {
                loop: true,
                autoplay:{
                    disableOnInteraction: false,
                },
                pagination: {
                    el: '.swiper-pagination',  // 分页
                    clickable: true,   // 分页小圆点可点击
                }
            },
            isSwiperRecodes: false,
            // 浏览记录数据
            recodesList: [],
            swiperRecodes: {
                loop: true,
                slidesPerView: 4,
                slidesPerGroup: 1,
                autoplay: {
                disableOnInteraction: false
                },
                pagination: {
                // el: '.swiper-pagination2',  // 分页
                // clickable: true,   // 分页小圆点可点击
                // slidesPerView : 3,
                // centeredSlides : true,
                // slidesPerView : 'auto',
                // slidesPerGroup : 1,
                // spaceBetween : 20,
                }
            },
            swiperbottom: {
                loop: true,
                slidesPerView : 3,
                slidesPerGroup : 1,
                autoplay:{
                    disableOnInteraction: false,
                },
                navigation: {
                    nextEl: '.swiper-button-next',
                    prevEl: '.swiper-button-prev',
                },
                pagination: {
                    el: '.swiper-pagination2',  // 分页
                    // clickable: true,   // 分页小圆点可点击
                    // slidesPerView : 3,
                    // centeredSlides : true,
                    // slidesPerView : 'auto',
                    // slidesPerGroup : 1,
                    // spaceBetween : 20,
                }
            },
            isSwiperReaded: false,
            isSwiperBottom: false,
            // banner图片数据
            bannerData: [],
            // banner里的广告位
            advertising: [],
            // 图片懒加载
            defaultImg: 'http://dh.xmcpcn.com/Public/images/none.jpg',
            // 热卖产品数据
            hostList: [],
            // 推荐产品数据
            commendList: [],
            // 最新产品数据
            latestList: [],
            // 防疫用品数据
            epidemicData: [],
            // 底部轮播数据
            bannerBottom: [],
             // 加购物车成功
            addSuccTip: this.$t('enterPage.addSuccTip'),
            // 加购物车失败
            adderrTip: this.$t('enterPage.adderrTip'),
            // 单个商品购物车删除成功提示
            delItemSuccess:this.$t('enterPage.delItemSuccess'), 
            // 单个商品购物车删除失败提示
            delItemError: this.$t('enterPage.delItemError'),
            // 收藏成功提示
            collectSuccess: this.$t('enterPage.collectSuccess'),
            // 收藏失败提示
            collectError: this.$t('enterPage.collectError'),
            // 点击图片查看商品详情：
            lookDetail: this.$t('enterPage.lookDetail'),
            oneLoad: false,
            threeLoad: false,
            fourthLoad: false,
            fiveLoad: false,
            sixLoad: false,
            // 复制成功提示
            copySuccess: this.$t('enterPage.copySuccess'),
            // 复制失败提示
            copyError: this.$t('enterPage.copyError'),
            // 预售商品数据
            advaceData: [],
            // 预定商品成功提示
            orderSuccTips:this.$t('enterPage.orderSuccTips'),
            // 预定商品失败提示
            orderErrorTips: this.$t('enterPage.orderErrorTips'),
            // 预定商品余额不足，预定失败提示
            balanceLow: this.$t('enterPage.balanceLow'),
            // 删除预售商品成功提示
            orderDelSucc: this.$t('enterPage.orderDelSucc'),
            // 删除预售商品失败提示
            orderDelErr: this.$t('enterPage.orderDelErr'),
            // 添加的数量不是商品的规格数
            mastSpec:this.$t('enterPage.mastSpec'),
            // banner右侧视频数据
            videoSrc: [],
        }
    },
    computed: {
        mySwiper() {
            return this.$refs.mySwiper.swiper
        },
        swiper() {
            return this.$refs.swiperRecodes.swiper;
        },
        // swiperbottom() {
        //     return this.$refs.swiperbottom.swiper
        // },
        // 引入headerPage里的中英文
        i18n() {
            return this.$t('enterPage') 
        },
        isLoadAllData() {
            // 全部数据加载好，才会出现动画
            return this.oneLoad &&  this.threeLoad && this.fourthLoad && this.fiveLoad && this.sixLoad
        }
    },
    mounted() {
        $('.ivu-select-selected-value').text(this.i18n.placeholdertip)
        setTimeout(() => {
            this.isSwiperReaded = true;
            this.isSwiperBottom = true;
            this.isSwiperRecodes = true;
        }, 500)
        // 禁止视频画中画、下载功能
        this.$refs.video["disablePictureInPicture"] = true;
    },
    created() {
        // firstPlayFlag用来判断私货提示框是否已提醒过（只能提醒一次），0表示未提醒过，1表示已提醒 
        if(Number(localStorage.cost_num) > 0 && localStorage.firstPlayFlag === "0") {
            localStorage.firstPlayFlag = "1";
            this.instance();
        }
        /* this.$nextTick(function() {
            window.addEventListener("scroll", this.onScroll);
        }); */
        NProgress.start();
        // 获取轮播图片
        this.getBannerData();
        // // 获取最新产品数据
        this.getlatestList();
        // // 获取热销产品数据
        this.getHostList();
        // // 获取推荐产品数据
        this.getCommendList();
        // // 获取底部banner
        this.getBannerBottom();
        // // 获取预售商品信息
        this.getAdvanceSale();
        // 获取防疫商品数据
        this.getEpidemicData();
        NProgress.done();
    },

    methods: {
        ...mapActions([
            'getCartInfo',
        ]),
        goCorresGoods(item) {
            let str = item.app_act.substring(item.app_act.indexOf('|') + 1)
            if(str.length === 2) {
                this.$router.push({path: '/typeList', query: {cls_id: str,name: ''}})
            } else {
                this.$router.push({ path: "/goodsDetail", query: { item_no: str } });  
            }
        },
        onScroll() {
            // let scrollBottom = this.getScrollHeight() - this.getClientHeight() - this.getScrollTop();
            // console.log(this.getScrollHeight(), this.getClientHeight(),this.getScrollTop())
           
            // if(scrollBottom <= 450 && this.epidemicData.length === 0) {
            //     this.getEpidemicData();
            // }
            // if(scrollBottom <= 450 && this.latestList.length === 0) {
            //     this.getlatestList();
            // }
        },
        // 获取文档完整的高度
        getScrollHeight() {
            return Math.max(
                document.body.scrollHeight,
                document.documentElement.scrollHeight
            );
        },
        // 获取当前可视范围的高度
        getClientHeight() {
            let clientHeight = 0;
            if (document.body.clientHeight && document.documentElement.clientHeight) {
                clientHeight = Math.min(
                    document.body.clientHeight,
                    document.documentElement.clientHeight
                );
            } else {
                clientHeight = Math.max(
                document.body.clientHeight,
                document.documentElement.clientHeight
                );
            }
            return clientHeight;
        },
        // 获取滚动条当前的位置
        getScrollTop() {
            let scrollTop = 0;
            if (document.documentElement && document.documentElement.scrollTop) {
                scrollTop = document.documentElement.scrollTop;
            } else if (document.body) {
                scrollTop = document.body.scrollTop;
            }
            return scrollTop;
        },
         /**
        *  鼠标移入浏览记录轮播禁止轮播
        */
        swiperEnter() {
            this.$refs.swiperRecodes.swiper.autoplay.stop();
        },
        /**
        *  鼠标移出浏览记录轮播禁止轮播
        */
        swiperLeave() {
            this.$refs.swiperRecodes.swiper.autoplay.start();
        },
        swiperReady() {
            this.isSwiperReaded = true;
            this.isSwiperBottom = true;
        },
        // 复制成功时的回调函数
        onCopy (e) {
            this.$Message.success({
                content: this.copySuccess,
                duration: 3
            });
        },
        instance () {
            let title = '';
            let content = '';
            if(localStorage.langSelect === "0") {
                title = '温馨提示：';
                content = `<p>敬爱的用户，由于您店铺私货原因，账户有${localStorage.cost_num}元未返。</p>`
            } else{
                title = 'Reminder：';
                content = `<p>Dear user, due to your store's private goods, the account has ${localStorage.cost_num} yuan not returned .</p>`
            }
            this.$Modal.warning({
                title: title,
                content: content
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
         * 获取防疫商品数据
         */
        getEpidemicData() {
            NProgress.start();
            this.$resetAjax({
                type: 'POST',
                url: '/home/goods/goods_prevention',
                data: {
                    lang: localStorage.langSelect,
                    uid: localStorage.uid
                },
                success: (res) => {
                    NProgress.done();
                    this.fourthLoad = true;
                    let result = JSON.parse(res);
                    result.forEach(ele => {
                        ele.cnumTitle = 0;
                        ele.isShow = false;
                        ele.imgUrl = `http://hwimg.xmvogue.com/thumb/${ele.item_no}.jpg?x-oss-process=style/440`
                        ele.spec = Number(ele.purchase_spec);
                        ele.carNum = Number(ele.purchase_spec);
                    });
                    this.epidemicData = result;
                },
            })
        },
        /**
         * 获取预售商品信息
         */
        getAdvanceSale() {
            this.$resetAjax({
                type: 'GET',
                url: `/home/Presell/index`,
                data: {
                    page: 1,
                    lang: localStorage.langSelect,
                },
                success: (res) => {
                    let result = (JSON.parse(res).data);
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
                        this.advaceData = result.data.splice(0,8);
                    }
                },
            })
        },
         /**
         * 预定商品请求
         */
        orderGoods(item) {
            if(item.carNum < item.spec) {
                this.$Message.warning({
                    content: this.mastSpec,
                    duration: 3
                })
                return false;
            }
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
                             // 当预售商品没有到截止时间并且有预售目标数量，且已预定的数量不能超过目标预售数量，才能够进行预定
                            if(item.percent >= 100) {
                                item.isDead = false;
                            }
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
         * 热销和推荐查看更多商品
         */
        lookMoreGoods(info) {
            if(info === 'advance') {
                this.$router.push({path: '/searchKey', query: {keyword: this.i18n.advance, select: 'J'}});
                return false;
            }
            this.$router.push({path: '/searchKey', query: {keyword: info, select: info}})
        },
        /**
         *  鼠标移入底部轮播禁止轮播
        */
        swipermySwiperEnter() {
            this.$refs.mySwiper.swiper.autoplay.stop();
        },
        /**
         *  鼠标移出底部轮播开始轮播
        */
        swipermySwiperLeave() {
            this.$refs.mySwiper.swiper.autoplay.start();
        },
        /**
         *  鼠标移入底部轮播禁止轮播
        */
        swiperBottomEnter() {
            this.$refs.swiperbottom.swiper.autoplay.stop();
        },
        /**
         *  鼠标移出底部轮播开始轮播
        */
        swiperBottomLeave() {
            this.$refs.swiperbottom.swiper.autoplay.start();
        },
        /**
         *  获取banner头部轮播图片
         */
        getBannerData() {
            this.$resetAjax({
                type: 'POST',
                url: '/Home/Index/index',
                success: (res) => {
                    this.oneLoad = true;
                    let result = JSON.parse(res);
                    this.videoSrc = result.vedio.link;
                    result.gdgg.forEach(ele => {
                        ele.bannerImg = `http://img.xmvogue.com/ggao/${ele.pic}?x-oss-process=style/yuan`
                    });
                    this.bannerData = result.gdgg;
                    result.right.forEach(ele => {
                        ele.imgUrl = `http://img.xmvogue.com/ggao/${ele.pic}?x-oss-process=style/yuan`;
                    });
                    this.advertising = result.right.reverse().splice(0,1);
                },
            })
        },
        /**
         * 获取热销产品数据
         */
        getHostList() {
            this.$resetAjax({
                type: 'POST',
                url: '/Home/Goods/heat',
                data: {
                    lang: localStorage.langSelect,
                    uid: localStorage.uid
                },
                success: (res) => {
                    this.fourthLoad = true;
                    let result = JSON.parse(res);
                    result.forEach(ele => {
                        ele.cnumTitle = 0;
                        ele.isShow = false;
                        ele.imgUrl = `http://hwimg.xmvogue.com/thumb/${ele.item_no}.jpg?x-oss-process=style/440`
                        ele.spec = Number(ele.purchase_spec);
                        ele.carNum = Number(ele.purchase_spec);
                    });
                    this.hostList = result;
                },
            })
        },
        /**
         * 获取最新产品数据
         */
        getlatestList() {
            this.$resetAjax({
                type: 'POST',
                url: '/Home/Index/goodsgg',
                data: {
                    lang: localStorage.langSelect,
                    uid: localStorage.uid
                },
                success: (res) => {
                    this.threeLoad = true;
                    let result = JSON.parse(res);
                    result.forEach(ele => {
                        ele.imgUrl = `http://hwimg.xmvogue.com/thumb/${ele.item_no}.jpg?x-oss-process=style/440`,
                        ele.isShow = false;
                        ele.spec = Number(ele.spec);
                        ele.carNum = Number(ele.spec);
                    });
                    this.latestList = result;
                },
            })
        },
        /**
         * 获取推荐产品数据
         */
        getCommendList() {
            this.$resetAjax({
                type: 'POST',
                url: '/Home/Goods/Recommend',
                data: {
                    lang: localStorage.langSelect,
                    uid: localStorage.uid
                },
                success: (res) => {
                    this.fiveLoad = true;
                    let result = JSON.parse(res);
                    result.forEach(ele => {
                        ele.imgUrl = `http://hwimg.xmvogue.com/thumb/${ele.item_no}.jpg?x-oss-process=style/440`;
                        ele.spec = Number(ele.purchase_spec);
                        ele.carNum = Number(ele.purchase_spec);
                    });
                    this.commendList = result;
                },
            })
        },
        /**
         * 获取底部banner
         */
        getBannerBottom() {
            this.$resetAjax({
                type: 'POST',
                url: '/home/goods/guess_like',
                data: {
                    lang: localStorage.langSelect
                },
                success: (res) => {
                    this.sixLoad = true;
                    let result = JSON.parse(res).data;
                    if(result.list.length > 0) {
                        result.list.forEach(ele => {
                            ele.imgUrl = `https://ximiphoto.oss-cn-hangzhou.aliyuncs.com/thumb/${ele.item_no}.jpg?x-oss-process=style/800`;
                            ele.spec = Number(ele.spec);
                            ele.carNum = Number(ele.spec);
                        })
                        this.recodesList = result.list;
                    }
                },
            })
        },
        /**
         * 图片懒加载
         */
        defImg() {
            let img = event.srcElement;
            img.src = this.defaultImg;
            img.onerror = null; //防止闪图
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
                                        this.$Message.warning({
                                            content: `很抱歉，由于库存不够，${result.num}件商品添加成功`,
                                            duration: 3
                                        });
                                        break;
                                    case '1':
                                        this.$Message.warning({
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
                            // this.getDataCard({
                            //     vm: this,
                            //     inland: '',
                            //     page: 1
                            // });
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
            this.$router.push({path: '/goodsDetail', query: {item_no: nonum}})
            // let routeData = this.$router.resolve({ name: 'goodsDetail', query: {item_no:nonum}});
            // window.open(routeData.href, '_blank');
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
         * 点击公告版去公告页面
         */
        goNewsPage(item) {
            this.$router.push({path: 'news', query: {id: item.id}})
        }
    },
    // 进入该页面enter页面
    beforeRouteEnter(to, from, next) {
        next(vm => {
            vm.isCreateAnchor = true;
        })
    },
    // 离开该页面enter页面
    beforeRouteLeave (to, from, next) {
        this.isCreateAnchor = false;
        next();
    },
}


 


    



    
</script>
