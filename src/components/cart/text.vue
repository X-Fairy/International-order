<template>
    <div id="cart">
        <div class="cart_title">
            <!-- 面包屑-->
            <div class="title_inner">
                <Breadcrumb separator=">" class="page_title">
                    <BreadcrumbItem to="/enter">
                        <i class="icon-liuliangyunpingtaitubiao02 iconfont"></i> {{i18n.home}}</BreadcrumbItem>
                    <BreadcrumbItem class="title_name">{{i18n.pagetitle}}</BreadcrumbItem>
                </Breadcrumb>
                <!-- <p @click="$router.push({path:'/order/confirmed',query: {id: 2}})" class="own_order">{{i18n.order}}</p> -->
                <div class="inner_top_right">
                    <Page :total="typeNum" show-elevator simple :current="currentPage" :page-size="pageSize" @on-change="changePage" />
                </div>
            </div>
        </div>
        <div class="cart_list" v-show="Number(listPrice) !== 0.00 || Number(listPrice) !== 0">
            <div class="list_inner">
                <div class="inner_top">
                    <!-- 购物车分类清单 -->
                    <!-- <ul class="classification">
                        <li v-for="(item,index) of headerCartData.cartTypeCate" :key="index"  :class="{selected: cateIndex == index}" @click="getCate(item,index)">
                            <h3>{{item.title}}</h3>
                            <p>￥{{item.amt}}</p>
                        </li>
                    </ul> -->
                    <!-- 多项删除、清空、导入购物车 -->
                    <div v-if="Number(listPrice) !== 0.00 || Number(listPrice) !== 0">
                        <a @click="moreDel" class="emptyCart">{{i18n.moreDel}}</a>
                        <a @click="modal1=true" class="emptyCart">{{i18n.emptyCart}}</a>
                        <a @click="ImportModal=true" class="importCart">{{i18n.importCart}}</a>
                        <a @click="leadingCart" class="importCart">{{i18n.leading}}</a>
                    </div>
                    <!-- 商品查询、仓库选择、商品类选择 -->
                    <div style="display:flex;align-items:center;">
                        <div style="display:flex;align-items:center;margin-right:25px;">
                            <span class="castips">{{i18n.inlandSelect}}</span>
                            <Select v-model="inlandValue" style="width:100px" :placeholder="i18n.inlandPlace" @on-change="changeInland">
                                <Option v-for="item in i18n.inlandList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                            </Select>
                        </div>
                        <div style="display:flex;align-items:center;margin-right:20px;">
                            <span class="castips" style="margin-right:5px;">{{i18n.barCode}}</span>
                            <Input v-model="keyword" :placeholder="i18n.barTips" style="width: 165px" @on-enter="getKeyword" @on-blur="getKeyword" />
                        </div>
                        <div style="display:flex;align-items:center;">
                            <span class="castips">{{i18n.castips}}</span>
                            <!-- change-on-select  当此项为 true 时，点选每级菜单选项值都会发生变化，具体见上面的示例 v-model="selectValue" -->
                            <Cascader :placeholder="i18n.cascaderMsg" v-model="selectValue" @on-change="changeCas" change-on-select :data="dowmMenuList" clearable filterable class="cascader_container"></Cascader>
                        </div>
                    </div>
                </div>
                <!-- 中文显示 -->
                <!-- <div v-if="teamShowZh" class="item_tip">
                    购物车中 <span style="color:#d8262c">{{teamTitle}} </span>有 
                    <span style="color:#d8262c">{{cartData.list.length}}</span> 款商品 , 共 
                    <span style="color:#d8262c">{{cartData.num}} </span>件 ,
                    合计金额：<span style="color:#d8262c">{{cartData.totalPrice}}</span> 元。
                </div> -->
                <!-- 英文显示 -->
                <!-- <div v-if="teamShowEn" class="item_tip">
                    There are <span style="color:#d8262c">{{teamTitle}}</span> in the shopping cart,
                    <span style="color:#d8262c">{{cartData.list.length}}</span> items  in total,
                    total amount： <span style="color:#d8262c"> {{cartData.totalPrice}} </span> yuan.
                </div> -->
                <BigdataTable :columns="columns" :tableData="headerCartData.list" v-show="Number(listPrice) !== 0.00 || Number(listPrice) !== 0">
                    <template slot="item">
                        <!-- console.log(this.headerCartData.cascaderData)filterCartData.list -->
                        <tr v-for="(item,index) in headerCartData.list" :class="item.nosubmit ? 'ivu-table-row' : 'ivu-table-row displayClass'" :key="index" :title="item.nosubmitTips">
                            <td class="ivu-table-column-center" style="width:80px;">
                                <Checkbox v-model="item._checked" @on-change="checkDel" />
                            </td>
                            <td class="ivu-table-column-center">
                                <div class="ivu-table-cell" v-lazy-container="{ selector: 'img' }">
                                    <img :data-src="item.imgUrl" :title="i18n.lookDetail" @click="imgClick(item)" style="width: 80px; height: 80px; border-radius: 5%; border: 0px; cursor: pointer;" />
                                </div>
                            </td>
                            <td class="ivu-table-column-center">
                                <div class="ivu-table-cell">
                                    <!-- <img v-lazy="item.barCode" alt=""> -->
                                    <span class="item_no">{{item.item_no}}</span>
                                </div>
                            </td>
                            <td class="ivu-table-column-center cell_name">
                                <div class="ivu-table-cell">
                                    <span @click="imgClick(item)" :title="i18n.lookDetail" class="item_name">{{item.item_name}}</span>
                                </div>
                            </td>
                            <td class="ivu-table-column-center">
                                <div class="ivu-table-cell">
                                    <div class="item_price" :title="i18n.nowPrice">￥{{item.price}}</div>
                                    <div class="item_orgprice" :title="i18n.orgPrice">￥{{item.org_price}}</div>
                                </div>
                            </td>
                            <td class="ivu-table-column-center">
                                <div class="ivu-table-cell">
                                    <p> {{i18n.cartonNum}}：{{item.lot_spec}}</p>
                                    <p>{{i18n.specNum}}：{{item.spec}}</p>
                                </div>
                            </td>
                            <td class="ivu-table-column-center">
                                <div class="ivu-table-cell changeNum">
                                    <InputNumber :max="item.maxNum" :active-change="false" :min="item.spec" v-model="item.num" :step="item.spec" @on-change="changeNumGoods(item)"></InputNumber>
                                    <!-- <CartPrice :key="item.item_no" :InitPrice="item.num" :multipleNum="Number(item.spec)" @onChange="cartPriceChange(item,index,$event)" /> -->
                                </div>
                            </td>
                            <td class="ivu-table-column-center">
                                <div class="ivu-table-cell">
                                    <div class="item_price" :title="i18n.nowXj">￥{{item.xj}}</div>
                                    <div class="item_orgprice" :title="i18n.orgXj">￥{{item.org_xj}}</div>
                                </div>
                            </td>
                            <td class="ivu-table-column-center">
                                <div class="ivu-table-cell">
                                    <Tooltip :content="i18n.downTimeTips" placement="top" max-width="276px" style="word-break: keep-all;">
                                        <!-- 时间倒计时，这里传的是时间戳 -->
                                        <downTime :endTime="new Date(item.expire).getTime()" :startTime="new Date(item.time).getTime()" :endMsg="''" :itemNo="item.item_no" />
                                    </Tooltip>
                                    <!-- <span>{{item.expire}}</span> -->
                                </div>
                            </td>
                            <td class="ivu-table-column-center">
                                <div class="ivu-table-cell">
                                    <Poptip confirm :transfer="true" placement='top' :title='i18n.delete' type='error' size='small' width='150' :vModel="true" @on-ok="oneDel(item)">
                                        <Icon class="iconfont icon-icon-trash-2" />
                                    </Poptip>
                                </div>
                            </td>
                        </tr>
                    </template>
                </BigdataTable>
                <!-- <Table class="table" @on-selection-change="changeSelect" :columns="columns" :data="cartData.list" :disabled-hover="true" show-summary></Table> -->
            </div>
        </div>
        <div id="J_oft" style="margin-bottom:25px;" v-show="Number(listPrice) !== 0.00 || Number(listPrice) !== 0">
            <div :class="['cart-bar', {fixedClass: isFixed}]">
                <div class="bar_inner">
                    <div class="bar_left">
                        <a @click="$router.push({path: 'enter'})">{{i18n.Continue}}</a>
                        <!-- {{filterCartData.list.length}}  款商品类型       {{filterCartData.num}}   总件数-->
                        <p v-if="footerZH">购物车有
                            <span> {{typeNum}} </span> 款商品类型，共有
                            <span> {{listNum}} </span> 件</p>
                        <p v-if="footerEN">
                            There are
                            <span> {{typeNum}} </span> type(s) of product(s) in the Shopping Cart and a total of
                            <span> {{listNum}} </span> item(s).
                            <!-- There are <span> {{typeNum}} </span> types of shopping cart, <span> {{listNum}} </span> in total -->
                        </p>
                    </div>
                    <div class="bar_right">
                        <!-- {{filterCartData.totalPrice}} -->
                        <p>{{i18n.total}}：
                            <span>￥{{partPrice}}</span>
                        </p>
                        <!-- :disabled="disabled" -->
                        <Button :class="{settlement : disabled == true}" @click="payResult" v-if="partPrice !== 0">{{i18n.settlement}}</Button>
                        <!-- <div class="first_sel" v-show="disabled == false">
                            <span>请勾选需要结算的商品</span>
                            <Icon type="chevron-down"></Icon>
                        </div> -->
                    </div>
                </div>
            </div>
        </div>
        <div class="bottom_page" v-show="Number(listPrice) !== 0.00 || Number(listPrice) !== 0">
            <div class="bottom_page_inner">
                <Page :total="typeNum" show-elevator :current="currentPage" :page-size="pageSize" @on-change="changePage" show-total />
            </div>
        </div>
        <!-- 没有购物车商品显示 -->
        <div class="tip_main" v-show="Number(listPrice) === 0.00 || Number(listPrice) === 0">
            <div class="tip_inner">
                <div class="img">
                    <img src="@/assets/images/tip_cart.png" alt="">
                </div>
                <div class="tip_cont">
                    <p class="empty_title">{{i18n.emptyTips}}</p>
                    <p class="collect">{{i18n.operate}} ：
                        <a @click="ImportModal=true" class="importCart">{{i18n.importCart}}</a>
                    </p>
                    <p class="collect">{{i18n.look}} ：
                        <a @click="$router.push({path:'/order/confirmed', query: {name2: 'a',name3:'1',title: i18n.myorder}})"> {{i18n.order}}</a>
                    </p>
                    <p class="collect">{{i18n.look}} ：
                        <a @click="$router.push({path:'/order/favorite', query: {name2: 'c',name3:'8',title: i18n.favorite}})"> {{i18n.collection}}</a>
                    </p>
                    <p class="collect">{{i18n.look}} ：
                        <a @click="goAllGoods"> {{i18n.allGoods}}</a>
                    </p>
                </div>
            </div>
        </div>
        <!-- 清空购物车提醒 -->
        <Modal v-model="modal1" :title="i18n.deleTipsTitle" draggable  @on-ok="emptyCart" @on-cancel="modal1=false" class="deleAll_modal">
            <p>{{i18n.tipsContent}}</p>
        </Modal>
        <!-- 购物车导入模块 -->
        <Modal v-model="ImportModal" draggable transfer :title="i18n.importTitle" class="importModal_cartPage">
            <Input v-model="importValue" type="textarea" :rows="18" :placeholder="i18n.importPlace" v-if="isShowImport"/>
            <ul v-else class="import_result">
                <li v-for="(item,index) in importArr" :key="index">
                    <span>{{item.code}}
                        <Icon :type="item.icon" />
                    </span>
                    <span style="margin-right:10px;background: #eee;border-radius: 4px;padding: 0px 10px;">{{item.tips}}</span>
                </li>
                <li v-if="isResult" class="export_result">
                    <p v-show="isChina">温馨提示：一共有<span> {{canData.length}} </span>款商品导入成功，<span> {{noCanData.length}} </span>款商品导入失败。</p>
                    <p v-show="isEnglish">Tip： A total of <span> {{canData.length}} </span> products were imported successfully, and <span> {{noCanData.length}} </span> products failed to import.</p>
                </li>
            </ul>
            <div class="export_loading" v-if="isLoading">
                <img src='http://hbimg.b0.upaiyun.com/b9dbc34d699a2eb32c54283812cf9d5b4f936d2572f0f-pUsofd_fw658' />
                <span>{{i18n.exportLoading}}</span>
            </div>
            <!-- <div class="export_result" v-if="isResult">
                <p v-show="isChina">温馨提示：一共有<span> {{canData.length}} </span>款商品导入成功，<span> {{noCanData.length}} </span>款商品导入失败。</p>
                <p v-show="isEnglish">Tip： A total of <span> {{canData.length}} </span> products were imported successfully, and <span> {{noCanData.length}} </span> products failed to import.</p>
            </div> -->
            <div class="importModal_footer">
                <a @click="ImportModal=false" class="footer_cancel">{{i18n.cancel}}</a>
                <a @click="blurImport" v-if="isShowFooter" class="footer_ok">{{i18n.okText}}</a>
            </div>
        </Modal>
        <!-- 推荐商品 -->
        <div class="commend_goods">
            <div class="comment_inner" @mouseenter="swiperEnter" @mouseleave="swiperLeave">
                <h3 class="comment_title">{{i18n.commentTitle}}</h3>
                <swiper :options="swiperbottom" ref="swiperbottom" v-if="isSwiperBottom">
                    <!-- slides -->
                    <swiper-slide v-for="(item,index) in $root.commendList" :key="index">
                        <div class="slide_item">
                            <div class="prod_top">
                                <!-- <span>{{item}}</span> -->
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
                                <h3 class="prod_name" @click="goGoodsDetail(item.item_no)" :title="i18n.lookDetail">{{item.item_name}}</h3>
                                <div class="prod_price">
                                    <p class="unit">{{i18n.unit}}
                                        <span>￥{{item.base_price}}</span>
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
                                        <Icon type="md-trash" size="24" v-show="item.cnum !== 0" class="trash" @click="deleteCart(item)" :title="i18n.delTips" />
                                        <!-- <span :title="i18n.cnumTips" class="cnum_tips" v-show="item.cnum !== 0">[ {{item.cnum}} ]</span>
                                        <Poptip confirm :title="i18n.delTips" @on-ok="deleteCart(item)" @on-cancel="''">
                                            <Icon type="md-trash" size="28" v-show="item.cnum !== 0" class="trash"/>
                                        </Poptip> -->
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
        <!-- 选择按商品大类、中类、小类结算还是全部结算 -->
        <Modal v-model="payModel" draggable  :title="i18n.payTitle" @on-ok="goSettlement" @on-cancel="payModel=false;" class="cartpaymodel">
            <Select v-model="payVal">
                <Option v-for="item in i18n.payList" :value="item.value" :key="item.value" :placeholder="i18n.payTitle">{{ item.label }}</Option>
            </Select>
        </Modal>
    </div>
</template>


<script>
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";
import { getNumBox, transformArrTo, group } from "@/assets/js/tool.js";
import { debug } from "util";
import addCartPrice from "../common/addCart-price.vue"; // 引入input加购购物车
import BigdataTable from "@/components/common/i-bigdata-table"; // 引入table原生组件
import downTime from "@/components/cart/downTime"; // 倒计时
import NProgress from "nprogress"; // 引入进度条
import "nprogress/nprogress.css"; // 引入进度条
export default {
    components: {
        addCartPrice,
        BigdataTable,
        downTime
    },
    data() {
        return {
            // 购物车结算方式，按商品大中类或者全部结算
            payVal: 2,
            // 是否显示商品结算方式类选择弹窗
            payModel: false,
            // 是否显示页脚确定
            isShowFooter: true,
            value1: 3,
            // 商品条码或名称
            keyword: "",
            // 商品大中类数据
            dowmMenuList: [],
            // 商品分页页码
            currentPage: 1,
            // 页码条数
            pageSize: 50,
            // 商品大中类级别所选中的cls或者clss
            selectValue: [],
            // 选中哪个仓
            inlandValue: 2,
            // 推荐产品数据
            commendList: [],
            isSwiperBottom: false,
            swiperbottom: {
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
            // 当前选中的语言
            langSelect: localStorage.langSelect,
            // 单个商品删除成功提示
            delItemSuccess: this.$t("cartPage.delItemSuccess"),
            // 单个商品删除失败提示
            delItemError: this.$t("cartPage.delItemError"),
            // 多项删除没有勾选提示
            moreDelTip: this.$t("cartPage.moreDelTip"),
            //  删除商品的id
            delId: "",
            // 更该商品数量达到上限提示
            changeNumTip: this.$t("cartPage.changeNumTip"),
            // 修改商品数量要为规格的倍数提示
            mastSpec:this.$t("cartPage.mastSpec"),
            // 更该商品数量成功
            changeNumTipSuss: this.$t("cartPage.changeNumTipSuss"),
            // 中文时显示几款商品类型
            footerZH: localStorage.langSelect === "0",
            // 英文时显示几款商品类型
            footerEN: localStorage.langSelect === "1",
            // 清空购物车成功提示
            clearSuccTip: this.$t("cartPage.clearSuccTip"),
            // 清空购物车失败提示
            clearErrorTip: this.$t("cartPage.clearErrorTip"),
            // 购物车结算成功提示
            settlementSuccess: this.$t("cartPage.settlementSuccess"),
            // 购物车结算失败提示
            SettlementFailure: this.$t("cartPage.SettlementFailure"),
            // 加购物车成功
            addSuccTip: this.$t("cartPage.addSuccTip"),
            // 加购物车失败
            adderrTip: this.$t("cartPage.adderrTip"),
            // 收藏成功提示
            collectSuccess: this.$t("cartPage.collectSuccess"),
            // 收藏失败提示
            collectError: this.$t("cartPage.collectError"),
            // 购物车已存在该商品，导入失败
            cartHas: this.$t("cartPage.cartHas"),
            // 暂无库存，导入失败
            noStock: this.$t("cartPage.noStock"),
            // 该商品不存在，导入失败
            noGoods: this.$t("cartPage.noGoods"),
            // 导入成功,棒棒哒
            guideTips: this.$t("cartPage.guideTips"),
            // 导入的数量不是商品规格数，导入失败',
            importNum: this.$t("cartPage.importNum"),
            // 库存不足加购提示
            stockTips: this.$t("cartPage.stockTips"),
            // 商品数量小于0导入失败提示
            minZero: this.$t("cartPage.minZero"),
            // 导入时商品必须是规格数的倍数提示
            specTips: this.$t("cartPage.specTips"),
            // 导入时超出最大购买量
            beyondTips: this.$t("cartPage.beyondTips"),
            // 导入时该商品不存在提示
            existTips:this.$t("cartPage.existTips"),
            // 导入时该商品已下线提示
            displayTips: this.$t("cartPage.displayTips"),
            // 导入时商品条码数量限制
            maxInport:this.$t("cartPage.maxInport"),
            // 购物车列表表头
            columns: [
                {
                    type: "selection",
                    align: "center"
                },
                {
                    title: this.$t("cartPage.imgItem"),
                    align: "center",
                    key: "imgUrl",
                    // 单元格插入图片
                    render: (h, { row }) => {
                        return h("img", {
                            style: {
                                //设置样式
                                width: "80px",
                                height: "80px",
                                "border-radius": "5%",
                                border: 0,
                                cursor: "pointer"
                            },
                            attrs: {
                                //设置属性
                                src: row.imgUrl,
                                onerror:
                                'this.src="http://dh.xmcpcn.com/Public/images/none.jpg"'
                            },
                            on: {
                                click: () => {
                                    // 新开页面跳转到商品详情页面
                                    let routeData = this.$router.resolve({
                                        name: "goodsDetail",
                                        query: { item_no: row.item_no }
                                    });
                                    window.open(routeData.href, "_blank");
                                }
                            }
                        });
                    }
                },
                {
                title: this.$t("cartPage.codeItem"),
                align: "center",
                key: "barCode",
                // render: (h, {row}) => {
                //     // 鼠标经过有提示
                //     return h('div', [
                //         h('span', {
                //             style: {
                //                fontSize: '14px',
                //                cursor: 'pointer'
                //             },
                //             domProps: {
                //                 title: '点击查看商品详情',
                //             },
                //             on: {
                //                 click: () => {
                //                     // // 新开页面跳转到商品详情页面
                //                     // let routeData = this.$router.resolve({ name: 'goodsDetail', query: {item_no:row.item_no}});
                //                     // window.open(routeData.href, '_blank');
                //                 }
                //             }
                //         }, `${row.item_no}`)
                //     ])
                // }
                },
                {
                title: this.$t("cartPage.nameItem"),
                align: "center",
                key: "item_name",
                render: (h, { row }) => {
                    // 鼠标经过有提示
                    return h("div", [
                    h(
                        "span",
                        {
                        style: {
                            fontSize: "14px",
                            cursor: "pointer"
                        },
                        domProps: {
                            title: "点击查看商品详情"
                        },
                        on: {
                            click: () => {
                            // 新开页面跳转到商品详情页面
                            let routeData = this.$router.resolve({
                                name: "goodsDetail",
                                query: { item_no: row.item_no }
                            });
                            window.open(routeData.href, "_blank");
                            }
                        }
                        },
                        `${row.item_name}`
                    )
                    ]);
                }
                },
                {
                title: this.$t("cartPage.unitItem"),
                align: "center",
                key: "",
                render: (h, { row }) => {
                    // 鼠标经过有提示
                    return h("div", [
                    h(
                        "div",
                        {
                        style: {
                            width: "100%",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap"
                        },
                        domProps: {
                            title: "现单价"
                        }
                        },
                        `￥${row.price}`
                    ),
                    h(
                        "div",
                        {
                        style: {
                            "text-decoration": "line-through",
                            color: "#ccc",
                            fontSize: "14px",
                            marginTop: "-3px"
                        },
                        domProps: {
                            title: "原单价"
                        }
                        },
                        `￥${row.org_price}`
                    )
                    ]);
                }
                },
                {
                title: this.$t("cartPage.carton"),
                align: "center",
                key: ""
                },
                {
                title: this.$t("cartPage.numItem")
                /*  render: (h, {row, index}) => {
                                return h('CartPrice', {
                                    props: {
                                        InitPrice: row.num,
                                        multipleNum: Number(row.spec)
                                    },
                                    on: {
                                        onChange:(price) => {
                                            row.num = price;
                                            this.changeNum(index, row);
                                        },
                                        onBlur:(price) => {
                                            
                                        },
                                    }
                                })
                            } */
                },
                {
                    title: this.$t("cartPage.subtotalItem"),
                    align: "center",
                    key: "",
                    render: (h, { row }) => {
                        // 鼠标经过有提示
                        return h("div", [
                        h(
                            "div",
                            {
                            style: {
                                width: "100%",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap"
                            },
                            domProps: {
                                title: "现总价"
                            }
                            },
                            `￥${row.xj}`
                        ),
                        h(
                            "div",
                            {
                            style: {
                                "text-decoration": "line-through",
                                color: "#ccc",
                                fontSize: "14px",
                                marginTop: "-3px"
                            },
                            domProps: {
                                title: "原总价"
                            }
                            },
                            `￥${row.org_xj}`
                        )
                    ]);
                }
                },
                {
                    title: this.$t("cartPage.countDown"),
                    align: "center",
                    key: "expire",
                    render: (h, { row }) => {
                        return h("div", [
                            h(
                                "span",
                                {
                                style: {
                                    fontSize: "14px",
                                    cursor: "pointer"
                                },
                                on: {
                                    click: () => {}
                                }
                                },
                                `${row.expire}`
                            )
                        ]);
                    }
                },
                {
                    title: this.$t("cartPage.operation"),
                    align: "center",
                    key: "",
                    render: (h, params) => {
                        return h("div", [
                            h("span", [
                                h(
                                "Poptip",
                                {
                                    class: "handle delete",
                                    props: {
                                        confirm: true,
                                        transfer: true,
                                        placement: "top",
                                        title: "确定删除吗 ?",
                                        type: "error",
                                        size: "small",
                                        width: "150",
                                        vModel: true
                                    },
                                    domProps: {
                                        title: "删除"
                                    },
                                    style: {
                                        cursor: "pointer"
                                    },
                                    on: {
                                        "on-ok": () => {
                                            // 确定删除
                                            this.deleteCart(params.row);
                                        },
                                        "on-cancel": () => {
                                            // 取消删除
                                        }
                                    }
                                },
                                [
                                    h("Icon", {
                                        props: {
                                            type: "trash-b",
                                            size: 25
                                        }
                                    })
                                ]
                                )
                            ])
                    ]);
                }
                }
            ],
            // 购物车数据
            tableData: [],
            // 购物车清单分类对应的商品数据
            cartTypeData: [],
            // 清单分类点中哪个
            cateIndex: -1,
            // 是否选择了商品
            disabled: true,
            // 已选择几项
            selectionData: [],
            // bar是否固定到底部
            isFixed: 0,
            // 商品大分类的cls_id
            teamClsId: "",
            // 商品的活动
            teamHuodong: "",
            // 分类清单的标题
            teamTitle: "",
            // 是否显示中文分类清单里的内容
            teamShowZh: false,
            // 是否显示英文文分类清单里的内容
            teamShowEn: false,
            // 是否显示加减按钮
            isShowGroup: false,
            // 是否显示清空购物车弹窗
            modal1: false,
            // 是否显示购物车导入商品弹窗
            ImportModal: false,
            // 导入商品编码和数量
            importValue: "",
            // 商品导入数组
            importArr: [],
            // 是否显示商品导入输入框
            isShowImport: true,
            // 复制成功提示
            copySuccess: this.$t("cartPage.copySuccess"),
            // 复制失败提示
            copyError: this.$t("cartPage.copyError"),
            // 购物车商品要导入的数据
            arrExport: [],
            // 购物车商品经过判断后可以导入的数据
            canData: [],
            // 购物车商品经过判断后不可以导入的数据
            noCanData: [],
            // 是否显示商品正在导入到购物车中。。。
            isLoading: false,
            // 导入结果总结是否显示
            isResult: false,
            // 是否显示中文购物车导入结果提示
            isChina: false,
            // 是否显示英文购物车导入结果提示
            isEnglish: false,
            // 加购的规格不是倍数
            mastSpec:this.$t('cartPage.mastSpec'),
        };
    },
    mounted() {
        window.addEventListener("scroll", this.btnpPos);
            setTimeout(() => {
            this.isSwiperBottom = true;
        }, 500);
        // 默认让仓库显示国内和国外
        this.inlandValue = 2;
    },
    created() {
        // 请求购物车商品类别数据
        this.getTypeData();
        // 得到购物车数据
        this.getDataCard({
            vm: this,
            inland: this.inlandValue,
            page: this.currentPage,
            keyword: this.keyword
        });
        // 得到头部购物车数据，以防购物车数据过期造成的不统一
        this.getCartInfo({
            vm: this
        });
    },
    watch: {
        ImportModal(val, oldVal) {
            if (!val) {
                this.importArr = [];
                this.importValue = "";
                this.isShowImport = true;
                this.isResult = false;
            }
        },
        // importArr(val, oldval) {
        //     this.isShowFooter = val.length ? false : true;
        // },
        payModel(val, oldval) {
            if (!val) {
                this.payVal = 2;
            }
        }
    },
    computed: {
        swiper() {
            return this.$refs.swiperbottom.swiper;
        },
        ...mapState(["headerCartData"]),
        ...mapGetters([
            "num", // 总条数
            "pageNum", // 总页数
            "listPrice", // 总金额
            "listNum", // 商品总件数
            "partPrice", // 购物车当前仓、当前商品类、当前分页金额
            "typeNum" // 购物车商品款数
        ]),
        i18n() {
            return this.$t("cartPage");
        },
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
            } else if (!!this.teamHuodong) {
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
        },
        // 下拉菜单
        /* dowmMenuList() {
                // console.log(this.headerCartData.cascaderData)
                let arr = this.headerCartData.cascaderData.map(item => ({
                    value: item.cls,
                    label: item.title,
                    // 
                    children: item.child || []
                }));
                arr.forEach(item => {
                    item.children.forEach(ele => {
                        ele.value = ele.cls;
                        ele.label = ele.title;
                    });
                });
                console.log(arr)
                return arr;
            }, */
        // 过虑后的购物车数据根据商品大中类
        filterCartData() {
            let data = {
                list: [],
                num: 0,
                totalPrice: 0
            };
            let casLen = this.selectValue.length;
            if (casLen === 0) {
                data.list = this.cartData.list;
            } else if (casLen === 1) {
                // 获取到商品大类数据
                data.list = this.cartData.list.filter(
                ele => ele.cls_id === this.selectValue[0]
                );
            } else {
                // 获取到商品中类数据
                data.list = this.cartData.list.filter(
                ele => ele.clss_id === this.selectValue[1]
                );
            }
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
        ...mapActions(["getDataCard", "getCartInfo"]),
        ...mapMutations([
            "setCartDataList",
            "setCartDataListNum",
            "setTotalPrice",
            "setCartDataCartTypeCate",
            "setPageNum",
            "setPartPrice",
            "setTypeNum"
        ]),
        /**
        * 根据商品编码和名称来搜索
        */
        getKeyword() {
            this.selectValue = [];
            this.inlandValue = 2;
            this.getDataCard({
                vm: this,
                inland: 2,
                page: 1,
                keyword: this.keyword
            });
        },
        /**
        * 请求购物车商品类别数据
        */
        getTypeData() {
            this.$resetAjax({
                type: "POST",
                url: "/home/cart/getcate",
                data: {
                    lang: localStorage.langSelect
                },
                success: res => {
                let result = JSON.parse(res).data;
                if (result) {
                    let arr = result.map(item => ({
                        value: item.cls,
                        label: item.title,
                        //
                        children: item.child || []
                    }));
                    arr.forEach(item => {
                        item.children.forEach(ele => {
                            ele.value = ele.cls;
                            ele.label = ele.title;
                        });
                    });
                    this.dowmMenuList = arr;
                }
                }
            });
        },
        /**
        * 商品数量改变
        */
        changeNumGoods(item) {
            // 加购的数量不能超过最大库存量
            if (item.num > item.maxNum) {
                this.$Message.warning({
                    content: this.stockTips,
                    duration: 4
                });
                this.getDataCard({
                    vm: this,
                    inland: this.inlandValue,
                    page: this.currentPage,
                    keyword: this.keyword,
                    cls: this.selectValue[this.selectValue.length - 1]
                });
                return false;
            }
            // 加购的数量要为规格的倍数
            if((item.num % item.spec) !== 0) {
                this.$Message.warning({
                    content: this.mastSpec,
                    duration: 4
                });
                this.getDataCard({
                    vm: this,
                    inland: this.inlandValue,
                    page: this.currentPage,
                    keyword: this.keyword,
                    cls: this.selectValue[this.selectValue.length - 1]
                });
                return false;
            }
            this.changeNum(item);
        },
        /**
        * 级联数据切换
        */
        changeCas(value, selectedData) {
            this.keyword = "";
            this.getDataCard({
                vm: this,
                inland: this.inlandValue,
                page: 1,
                cls: value[value.length - 1],
                keyword: ""
            });
        },
        // 复制成功时的回调函数
        onCopy(e) {
            this.$Message.success({
                content: this.copySuccess,
                duration: 3
            });
        },
        // 复制失败时的回调函数
        onError(e) {
            this.$Message.error({
                content: this.copyError,
                duration: 3
            });
        },
        /**
        * 切换页码
        */
        changePage(index) {
            this.currentPage = index;
            this.getDataCard({
                vm: this,
                inland: this.inlandValue,
                page: this.currentPage,
                cls: this.selectValue[this.selectValue.length - 1],
                keyword: this.keyword
            });
        },
        /**
        * 选择地区
        */
        changeInland(data) {
            this.currentPage = 1;
            this.inlandValue = data;
            this.getDataCard({
                vm: this,
                inland: this.inlandValue,
                page: this.currentPage,
                cls: this.selectValue[this.selectValue.length - 1],
                keyword: this.keyword
            });
        },
        /**
        *  鼠标移入畅销轮播禁止轮播
        */
        swiperEnter() {
            this.$refs.swiperbottom.swiper.autoplay.stop();
        },
        /**
        *  鼠标移出畅销轮播开始轮播
        */
        swiperLeave() {
            this.$refs.swiperbottom.swiper.autoplay.start();
        },
        /**
        * 获取推荐商品
        */
        getCommendData() {
            this.$resetAjax({
                type: "POST",
                url: "/Home/Goods/Recommend",
                data: {
                    lang: localStorage.langSelect,
                    uid: localStorage.uid
                },
                success: res => {
                let result = JSON.parse(res);
                result.forEach(ele => {
                    ele.imgUrl = `http://hwimg.xmvogue.com/thumb/${ele.item_no}.jpg?x-oss-process=style/440`;
                    ele.spec = Number(ele.purchase_spec);
                    ele.carNum = Number(ele.purchase_spec);
                });
                this.commendList = result;
                }
            });
        },
        imgClick(row) {
            // this.$router.push({path: './goodsDetail',query: {item_no:row.item_no}})
            // 新开页面跳转到商品详情页面
            let routeData = this.$router.resolve({
                name: "goodsDetail",
                query: { item_no: row.item_no }
            });
            window.open(routeData.href, "_blank");
            },
        /**
        * 修改购物车单项数量
        */
        cartPriceChange(row, index, price) {
            let beforeNum = row.num;
            row.num = price;
            this.changeNum(index, row, beforeNum);
        },
        /*
        *   获取滚动条高度
        */
        btnpPos() {
            //滚动条的高度
            var scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
            // 滚动条自身的高度
            // var scrollHeight = document.body.scrollHeight || document.documentElement.scrollHeight;
            // 页面高度
            var clientHeight = document.body.clientHeight || document.documentElement.clientHeight;
            var barTop = $("#J_oft") === null ? 0 : $("#J_oft").offset().top; //获取div距离顶部的距离
            this.isFixed = barTop - clientHeight > scrollTop;
        },
        /*
        *  选项变化时
        */
        changeSelect(selection) {
            this.selectionData = selection;
            if (this.selectionData.length !== 0) {
                this.disabled = false;
            } else {
                this.disabled = true;
            }
        },
        /**
        *  更该购物车单行项的数量
        */
        changeNum(row) {
            clearTimeout(window.cartTimer);
            window.cartTimer = setTimeout(() => {
                this.$resetAjax({
                type: "POST",
                url: `/Home/Cart/changenums`,
                data: {
                    sn: row.item_no,
                    num: row.num,
                    uid: localStorage.uid
                },
                success: res => {
                    let result = JSON.parse(res).result;
                    switch (result) {
                    case "ok":
                        this.$Message.success({
                            content: this.changeNumTipSuss,
                            duration: 3
                        });
                        this.getCartInfo({
                            vm: this
                        });
                        // 重新请求购物车数据
                        this.getDataCard({
                            vm: this,
                            inland: this.inlandValue,
                            page: this.currentPage,
                            keyword: this.keyword,
                            cls: this.selectValue[this.selectValue.length - 1]
                        });
                        break;
                    case "error":
                        // 重新请求购物车数据
                        this.$Message.error({
                            content: this.changeNumTip,
                            duration: 3
                        });
                        this.getDataCard({
                            vm: this,
                            inland: this.inlandValue,
                            page: this.currentPage,
                            keyword: this.keyword,
                            cls: this.selectValue[this.selectValue.length - 1]
                        });
                    }
                }
                });
            }, 500);
        },
        /**
        * 点击清单分类变色
        */
        getCate(item, index) {
            if (item.cls === undefined) {
                this.teamClsId = "";
            } else {
                this.teamClsId = item.cls;
            }
            this.teamHuodong = item.huodong;
            this.cateIndex = index;
            this.teamTitle = item.title;
            let lang = localStorage.langSelect;
            switch (lang) {
                case "0":
                    this.teamShowZh = true;
                    this.teamShowEn = false;
                break;
                case "1":
                    this.teamShowZh = false;
                    this.teamShowEn = true;
                break;
            }
        },
        /**
        * 点击单个商品删除操作
        */
        oneDel(item) {
            this.delId = item.item_no;
            this.deleteCart();
        },
        /**
        * 勾选单个商品项
        */
        checkDel() {},
        /**
        * 多项删除点击操作
        */
        moreDel() {
            var arrcheck = this.headerCartData.list.filter(ele => ele._checked);
            if (arrcheck.length === 0) {
                this.$Message.error({
                    content: this.moreDelTip,
                    duration: 3
                });
                return false;
            }
            var idArr = [];
            this.headerCartData.list.forEach(ele => {
                ele._checked && idArr.push(ele.item_no);
            });
            this.delId = idArr.join(",");
            this.deleteCart();
        },
        /**
        * 删除购物车商品数据
        */
        deleteCart() {
            NProgress.start();
            this.$resetAjax({
                type: "POST",
                url: `/Home/Cart/delCart`,
                data: {
                    uid: localStorage.uid,
                    sn: this.delId
                },
                success: res => {
                    NProgress.done();
                    let result = JSON.parse(res).result;
                    if (result === "ok") {
                        this.$Message.success({
                            content: this.delItemSuccess,
                            duration: 3
                        });
                        // item.cnum = 0;
                        this.getCartInfo({
                            vm: this
                        });
                        this.getDataCard({
                            vm: this,
                            inland: this.inlandValue,
                            page: this.currentPage,
                            keyword: this.keyword,
                            cls: this.selectValue[this.selectValue.length - 1]
                        });
                        // this.getTypeData();
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
        * 清空购物车
        */
        emptyCart() {
            this.modal1 = false;
            NProgress.start();
            this.$resetAjax({
                type: "POST",
                url: `/Home/Cart/clear`,
                data: {
                    uid: localStorage.uid
                },
                success: res => {
                    NProgress.done();
                    let result = JSON.parse(res).result;
                    if (result === "ok") {
                        this.$Message.success({
                            content: this.clearSuccTip,
                            duration: 3
                        });
                        this.inlandValue = 2;
                        this.currentPage = 1;
                        this.getCartInfo({
                            vm: this
                        });
                        this.getDataCard({
                            vm: this,
                            inland: this.inlandValue,
                            page: this.currentPage,
                            keyword: this.keyword
                        });
                        this.getTypeData();
                    } else {
                        this.$Message.error({
                            content: this.clearErrorTip, 
                            duration: 3
                        });
                    }
                }
            });
        },
        blurImport() {
            this.canData = [];
            this.noCanData = [];
            this.importArr = [];
            this.isShowImport = false;
            this.arrExport = transformArrTo(
                (this.importValue.trim()).replace(/[\r\n]/g, ",").split(",")
            );
            let arr = this.importValue.split('\n');
            let arr2 = [];
            let arr3 = [];
            arr.forEach(ele => {
                arr2.push(ele.split(','))
            })
            arr2.forEach(ele => {
                if(ele[1]) {
                    arr3.push(ele.join(','))
                } else {
                    this.importArr.push({
                        code:  ele[0],
                        tips: '商品无数量',
                        icon: "ios-close-circle-outline"
                    });
                    // 购物车商品不可以导入的数据
                    this.noCanData.push(ele)
                }
            })
            this.importValue = arr3.join('\n');

            this.importCart();
        },
        /**
        * 导入购物车
        */
        importCart() {
            let item = {};
            
            
            // 分成数组500个这样去请求
            this.addNewArr()
            /* if(this.arrExport.length > 501) {
                this.$Message.error({
                    content: this.maxInport, 
                    duration: 3
                });
                return false;
            } */
           /*  this.arrExport.forEach(ele => {
                item = {
                    item_no: ele[0],
                    carNum: ele[1]
                };
                this.judgeHas(item);
            });
            this.isLoading = true; */
        },
        addNewArr() {
            var arrTotal = this.importValue.trim().split('\n');
            var newArr = group(arrTotal,500);
            newArr.forEach(ele => {
                this.exportNew(ele)
            });
        },
        exportNew(data) {
            NProgress.start();
            this.isLoading = true;
            this.$resetAjax({
                type: "POST",
                url: "/home/cart/cart_Import",
                data: {
                    list: data
                },
                success: res => {
                    NProgress.done();
                    this.isShowImport = false;
                    let result = JSON.parse(res);
                    result.forEach(ele => {
                        switch (ele.result) {
                            case "ok":
                            // 导入成功
                                this.importArr.push({
                                    code: ele.no,
                                    tips: this.guideTips,
                                    icon: "md-checkmark-circle"
                                });
                                // 购物车商品可以导入的数据
                                this.canData.push(data);
                                // item.cnum += Number(item.carNum); // 当前购物车该商品的数量
                                break;
                            case "error":
                                // 库存不够
                                this.importArr.push({
                                    code:  ele.no,
                                    tips: this.stockTips,
                                    icon: "ios-close-circle-outline"
                                });
                                // 购物车商品不可以导入的数据
                                this.noCanData.push(data)
                                break;
                            case "error2":
                                // 超过最大购买量
                                this.importArr.push({
                                    code:  ele.no,
                                    tips: this.beyondTips,
                                    icon: "ios-close-circle-outline"
                                });
                                // 购物车商品不可以导入的数据
                                this.noCanData.push(data)
                                break;
                            case "error3":
                                // 该商品不存在
                                this.importArr.push({
                                    code:  ele.no,
                                    tips: this.existTips,
                                    icon: "ios-close-circle-outline"
                                });
                                // 购物车商品不可以导入的数据
                                this.noCanData.push(data)
                                break;
                            case "error4":
                                // 导入的数量要规格的倍数
                                this.importArr.push({
                                    code:  ele.no,
                                    tips: this.specTips,
                                    icon: "ios-close-circle-outline"
                                });
                                // 购物车商品不可以导入的数据
                                this.noCanData.push(data)
                                break;
                            case "error5":
                                // 不能为0
                                this.importArr.push({
                                    code:  ele.no,
                                    tips: this.minZero,
                                    icon: "ios-close-circle-outline"
                                });
                                // 购物车商品不可以导入的数据
                                this.noCanData.push(data)
                                break;
                            case "error6":
                                // 商品下线
                                this.importArr.push({
                                    code:  ele.no,
                                    tips: this.displayTips,
                                    icon: "ios-close-circle-outline"
                                });
                                // 购物车商品不可以导入的数据
                                this.noCanData.push(data)
                                break;
                        }

                    })
                    console.log(this.canData.length, '可以导')
                    console.log(this.noCanData.length, '不可以导')
                    console.log(this.arrExport.length, '全部')
                    if(this.canData.length + this.noCanData.length === this.arrExport.length) {
                        this.isLoading = false;
                        this.isResult = true;
                        NProgress.done();
                        switch(localStorage.langSelect) {
                            case "0" :
                                this.isChina = true;
                                this.isEnglish = false;
                                break;
                            case "1" :
                                this.isEnglish = true;
                                this.isChina = false;
                                break;
                        }
                        this.inlandValue = 2;
                        this.currentPage = 1;
                        NProgress.start();
                        this.getCartInfo({
                            vm: this
                        });
                        this.getDataCard({
                            vm: this,
                            inland: this.inlandValue,
                            page: 1,
                            keyword: ""
                        });
                        this.getTypeData();
                        NProgress.done();
                    }
                }
            })
        },
        /**
        * 判断购物车该商品是否能导入购物车
        */
        judgeHas(item) {
            this.importArr = [];
            NProgress.start();
            this.$resetAjax({
                type: "POST",
                url: "/Home/Cart/panduan",
                data: {
                    sphh: item.item_no,
                    uid: localStorage.uid
                },
                success: res => {
                    NProgress.done();
                    let result = JSON.parse(res).result;
                    this.isShowImport = false;
                    if (result === "ok") {
                        this.addShopImport(item);
                    }
                    if (result === "error1") {
                        // 商品下线
                        this.importArr.push({
                            code: item.item_no,
                            tips: this.displayTips,
                            icon: "ios-close-circle-outline"
                        });
                        // 购物车商品不可以导入的数据
                        this.noCanData.push(item)
                    }
                    if (result === "error2") {
                        // 暂无库存，导入失败
                        this.importArr.push({
                            code: item.item_no,
                            tips: this.noStock,
                            icon: "ios-close-circle-outline"
                        });
                        // 购物车商品不可以导入的数据
                        this.noCanData.push(item)
                    }
                    if (result === "error3") {
                        // 没有该商品，导入失败
                        this.importArr.push({
                            code: item.item_no,
                            tips: this.noGoods,
                            icon: "ios-close-circle-outline"
                        });
                        // 购物车商品不可以导入的数据
                        this.noCanData.push(item)
                    }
                    // 如果全部不能导入，就直接不去进行导入加入购物车操作
                    if(this.canData.length + this.noCanData.length === this.arrExport.length) {
                        this.isLoading = false;
                        this.isResult = true;
                        switch(localStorage.langSelect) {
                            case "0" :
                                this.isChina = true;
                                this.isEnglish = false;
                                break;
                            case "1" :
                                this.isEnglish = true;
                                this.isChina = false;
                                break;
                        }
                    }
                }
            });
        },
        /**
        * 导入加入购物车
        */
        addShopImport(item) {
            NProgress.start();
            this.$resetAjax({
                type: "POST",
                url: "/Home/Cart/addCart",
                data: {
                    sn: item.item_no,
                    num: item.carNum,
                    max_buy: 40 //最大数量加购物
                },
                success: res => {
                    NProgress.done();
                    let msg = JSON.parse(res).result;
                    // 判断可以导入的商品是否导入成功
                    switch (msg) {
                        case "ok":
                        // 导入成功
                            this.importArr.push({
                                code: item.item_no,
                                tips: this.guideTips,
                                icon: "md-checkmark-circle"
                            });
                            // 购物车商品可以导入的数据
                            this.canData.push(item);
                            // item.cnum += Number(item.carNum); // 当前购物车该商品的数量
                            break;
                        case "error":
                            // 库存不够
                            this.importArr.push({
                                code: item.item_no,
                                tips: this.stockTips,
                                icon: "ios-close-circle-outline"
                            });
                            // 购物车商品不可以导入的数据
                            this.noCanData.push(item)
                            break;
                        case "error2":
                            // 超过最大购买量
                            this.importArr.push({
                                code: item.item_no,
                                tips: this.beyondTips,
                                icon: "ios-close-circle-outline"
                            });
                            // 购物车商品不可以导入的数据
                            this.noCanData.push(item)
                            break;
                        case "error3":
                            // 该商品不存在
                            this.importArr.push({
                                code: item.item_no,
                                tips: this.existTips,
                                icon: "ios-close-circle-outline"
                            });
                            // 购物车商品不可以导入的数据
                            this.noCanData.push(item)
                            break;
                        case "error4":
                            // 导入的数量要规格的倍数
                            this.importArr.push({
                                code: item.item_no,
                                tips: this.specTips,
                                icon: "ios-close-circle-outline"
                            });
                            // 购物车商品不可以导入的数据
                            this.noCanData.push(item)
                            break;
                        case "error5":
                            // 不能为0
                            this.importArr.push({
                                code: item.item_no,
                                tips: this.minZero,
                                icon: "ios-close-circle-outline"
                            });
                            // 购物车商品不可以导入的数据
                            this.noCanData.push(item)
                            break;
                        case "error6":
                            // 商品下线
                            this.importArr.push({
                                code: item.item_no,
                                tips: this.displayTips,
                                icon: "ios-close-circle-outline"
                            });
                            // 购物车商品不可以导入的数据
                            this.noCanData.push(item)
                            break;
                    }
                    
                    /* console.log(this.canData, '可以导入的数据')
                    console.log(this.noCanData, '不可以导入的数据')
                    console.log(this.arrExport, '要导入的数据') */
                    if(this.canData.length + this.noCanData.length === this.arrExport.length) {
                        this.isLoading = false;
                        this.isResult = true;
                        switch(localStorage.langSelect) {
                            case "0" :
                                this.isChina = true;
                                this.isEnglish = false;
                                break;
                            case "1" :
                                this.isEnglish = true;
                                this.isChina = false;
                                break;
                        }
                        this.inlandValue = 2;
                        this.currentPage = 1;
                        NProgress.start();
                        this.getCartInfo({
                            vm: this
                        });
                        this.getDataCard({
                            vm: this,
                            inland: this.inlandValue,
                            page: 1,
                            keyword: ""
                        });
                        this.getTypeData();
                        NProgress.done();
                    }
                   
                }
            });
        },
        /**
         * 购物车数据导出
         */
        leadingCart() {
            location.href = `${location.origin}/word/public/index.php?s=/home/cart/download_cart`
        },
        /**
        * 购物车提交前选择哪个商品类（大类、中类、小类、全部）结算
        */
        payResult() {
            this.payModel = true;
        },
        /**
        * 购物车结算
        */
        goSettlement() {
            /* if(Number(this.filterCartData.num) === 0 ) {
                this.$Message.error({
                    content: this.SettlementFailure,
                    duration: 3
                });
                return false;
            } */
            NProgress.start();
                this.$resetAjax({
                    type: "POST",
                    url: "/Home/Cart/jiesuan",
                    data: {
                        cls: this.teamClsId, // 结算分类产品里的商品
                        yh: "0",
                        clss:this.selectValue.length > 0 ? this.selectValue.pop() : this.selectValue,
                        inland: this.inlandValue === 2 ? "" : this.inlandValue, // 哪个地区   没发inland的值的话我就默认是国际仓的没发inland的值的话我就默认是国际仓的
                        separation: this.payVal // 根据哪个类别来进行结算
                    },
                    success: res => {
                        NProgress.done();
                        if (res === "User") {
                            this.$Message.success({
                                content: this.settlementSuccess,
                                duration: 2
                            });
                            this.teamClsId = "";
                            this.selectValue = [];
                            setTimeout(() => {
                                this.getCartInfo({
                                    vm: this
                                });
                                /* console.log(this.inlandValue)
                                        if(this.inlandValue.length === 0) {
                                            this.inlandValue = -1;
                                        } else {
                                        this.inlandValue = this.inlandValue === 0 ? 1 : 0;
                                    } */
                                this.getDataCard({
                                    vm: this,
                                    inland: this.inlandValue,
                                    page: 1
                                });
                                // 请求购物车商品类别数据
                                this.getTypeData();
                            }, 2);
                        } else {
                            this.$Message.error({
                                content: this.SettlementFailure,
                                duration: 3
                            });
                        }
                    }
                });
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
                type: "POST",
                url: "/Home/Cart/addCart",
                data: {
                    sn: item.item_no,
                    num: item.carNum,
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
                        item.cnum += Number(result.num); // 当前购物车该商品的数量
                        this.inlandValue = 2;
                        this.getCartInfo({
                            vm: this
                        });
                        // 重新请求购物车数据
                        this.getDataCard({
                            vm: this,
                            inland: this.inlandValue,
                            page: 1
                        });
                        // 请求购物车商品类别数据
                        this.getTypeData();
                        break;
                        default:
                        this.$Message.error({
                            content: this.adderrTip,
                            duration: 3
                        });
                        break;
                    }
                }
            });
        },
        /**
        * 更该商品的数量
        */
        shopChange(val, item) {
            item.carNum = val;
        },
        /**
        * 收藏商品判断
        */
        collectGoods(data, index) {
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
                    this.$Message.success({
                        content: this.collectSuccess,
                        duration: 3
                    });
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
                    this.$Message.warning({
                        content: this.collectError,
                        duration: 3
                    });
                }
            });
        },
        /**
        * 跳转到商品详情
        */
        goGoodsDetail(nonum) {
            // 新开页面跳转到商品详情页面
            // this.$router.push({path: '/goodsDetail',query: {item_no:nonum}})
            let routeData = this.$router.resolve({
                name: "goodsDetail",
                query: { item_no: nonum }
            });
            window.open(routeData.href, "_blank");
        },
        /**
        * 查看所有商品
        */
        goAllGoods() {
            let name = localStorage.langSelect === "0" ? "全部商品" : "All merchandise";
            this.$router.push({
                path: "/searchKey",
                query: { keyword: name, select: "AA" }
            });
        },
        /**
        * 点击面包屑
        */
        clickBread(item, index) {
            this.getDataCard({
                vm: this,
                inland: this.inlandValue,
                page: this.currentPage
            });
        }
    },
    destroyed() {
        //离开这个界面之后，删除，不然会有问题
        window.removeEventListener("scroll", this.btnpPos);
        clearTimeout(window.cartTimer);
    }
};
</script>
