<template>
    <div class="orderDetailPage">
        <p class="order_title">{{i18n.pageTitle}}</p>
        <div class="orD_main">
            <h3 class="orD_title">{{status}}</h3>
            <div class="orD_top">
                <p class="orD_order">{{i18n.orderNum}}：<span>{{orderId}}</span> </p>
                <div class="order_stastu">{{i18n.time}}：<span>{{oper_date}}</span> </div>
            </div>
            <div class="orD_goods">
                <h3>{{i18n.commodity}}</h3>
                <!-- <a class="load" :title="i18n.loadCer" @click="loadCer">{{i18n.loadCer}}</a> -->
            </div>
            <Table class="table" :columns="columns" :data="orderDetailData.goodsData" :disabled-hover="true" @on-selection-change="selectItem"></Table> 
            <!-- <ul>
                <li v-for="(item, index) in orderDetailData.goodsData" :key="index">
                    <div class="img" :title="i18n.lookDetail" @click="goDetail(item.item_no)">
                        <img v-lazy="item.imgUrl" alt="">
                    </div>
                    <p class="orD_name" :title="i18n.lookDetail" @click="goDetail(item.item_no)">{{item.item_name}}</p>
                    <p class="orD_name">{{item.item_en}}</p>
                    <p class="encoded" :title="i18n.lookDetail" @click="goDetail(item.item_no)">{{item.item_no}}</p>
                    <p class="orD_num">{{item.price}}￥× {{item.item_num}}{{i18n.piece}}</p>
                    <p class="orD_total">￥ {{item.sub_amt}}</p>
                </li>
            </ul> -->
            <div class="explain">{{i18n.totalPrice}}： <span class="totalPrice">￥{{totalPrice}}</span><span></span></div>
        </div>
    </div>
</template>


<script>
import {getUrlParams} from  '@/assets/js/tool.js'
import {getNumBox} from  '@/assets/js/tool.js'
import NProgress from 'nprogress'   // 引入进度条
import 'nprogress/nprogress.css'    // 引入进度条
export default {
    data() {
        return {
            // 得到网址的参数对象
            urlParams: {},
            // 当前订单状态id
            modelStatus: 3,
            // 订单状态
            status: '',
            // 订单完成时间
            oper_date: '',
            defaultImg: 'http://dh.xmcpcn.com/Public/images/none.jpg',
            // 订单号
            orderId: '',
            // 订单详情数据
            orderDetailData: {
                goodsData: []
            },
            columns: [
                /* {
                    type: 'selection',
                    width: 60,
                    align: 'center'
                }, */
                {
                    title: this.$t('orderDetailPage.imgItem'),
                    align: 'center',
                    key: 'imgUrl',
                    // 单元格插入图片
                    render: (h, {row}) => {
                        return h('img', {
                            style: {
                                //设置样式
                                width:  '80px',
                                height:  '80px',
                                'border-radius': '5%',
                                border: 0,
                                cursor: 'pointer',
                                margin: '8px 0 2px'
                            },
                            attrs: {
                                //设置属性
                                src:row.imgUrl,
                                onerror:'this.src="http://dh.xmcpcn.com/Public/images/none.jpg"'
                            },
                            domProps: {
                                title: this.$t('orderDetailPage.lookDetail')
                            },
                            on: {
                                click: () => {
                                    this.goDetail(row.item_no)
                                }
                            }
                        });
                    }
                },
                {
                    title: this.$t('orderDetailPage.nameItem'),
                    align: 'center',
                    key: 'item_name',
                    render: (h, {row}) => {
                        // 鼠标经过有提示
                        return h('div', [
                            h('span', {
                                style: {
                                   cursor: 'pointer'
                                },
                                class: 'hoverClass',
                                domProps: {
                                    title: this.$t('orderDetailPage.lookDetail')
                                },
                                on: {
                                    click: () => {
                                        this.goDetail(row.item_no);
                                    }
                                }
                            }, `${row.item_name}`)
                        ])
                    }
                },
                {
                    title: this.$t('orderDetailPage.codeItem'),
                    align: 'center',
                    key: 'item_no',
                    render: (h, {row}) => {
                        // 鼠标经过有提示
                        return h('div', [
                            h('span', {
                                style: {
                                   cursor: 'pointer'
                                },
                                class: 'hoverClass',
                                domProps: {
                                    title: this.$t('orderDetailPage.lookDetail')
                                },
                                on: {
                                    click: () => {
                                        this.goDetail(row.item_no);
                                    }
                                }
                            }, `${row.item_no}`)
                        ])
                    }
                },
                {
                    title: this.$t('orderDetailPage.certificatename'),
                    key: "credential",
                    align: 'center',
                    render: (h, {row}) => {
                        let imgs = row.credential;  // 图片数组
                        let text = '';
                        imgs.forEach(ele => {
                            if(ele.form === 1) {
                                switch(localStorage.langSelect) {
                                    case '1':
                                        ele.tips = `Report(s): ${ele.name}`;
                                        break;
                                    case '0':
                                        ele.tips = `报告: ${ele.name}`;
                                        break;
                                }
                            }
                            else{
                                switch(localStorage.langSelect) {
                                    case '1':
                                        ele.tips = `Certificate(s): ${ele.name}`;
                                        break;
                                    case '0':
                                        ele.tips = `证书: ${ele.name}`;
                                        break;
                                }
                            }
                        })
                        switch(localStorage.langSelect) {
                            case '1':
                                text = 'Null'
                                break;
                            case '0':
                                text = '无'
                                break;
                        }
                        let noText = row.credential.length ? '' : text;
                        return h('div', [imgs.map(item=>{
                            return h('img',  {
                                attrs: {
                                    src: item.icon, 
                                    style: 'width: 80px;height: 80px;cursor:pointer;'
                                },
                                domProps: {
                                    title: item.tips
                                },
                                on: {
                                    click: () => {
                                        window.open(item.icon)
                                    }
                                }
                            },);
                            }),
                            h('span', {
                            }, noText)
                        ]);
                    }
                },
                {
                    title: this.$t('orderDetailPage.numItem'),
                    align: 'center',
                    key: 'order_qty'
                },
                {
                    title: this.$t('orderDetailPage.unitItem'),
                    align: 'center',
                    key: 'price'
                },
                {
                    title: this.$t('orderDetailPage.subtotalItem'),
                    align: 'center',
                    key: 'sub_amt'
                }
            ],
            // 该订单详情总价
            totalPrice: '0',
            orderSuccess: this.$t('orderDetailPage.orderSuccess') ,
            adopt:this.$t('orderDetailPage.adopt') ,
            distributing:this.$t('orderDetailPage.distributing') ,
            shipped: this.$t('orderDetailPage.shipped') ,
            transportation: this.$t('orderDetailPage.transportation') ,
            receiving: this.$t('orderDetailPage.receiving') ,
            fulfillment: this.$t('orderDetailPage.fulfillment') ,
            void: this.$t('orderDetailPage.void') ,
            pretrial: this.$t('orderDetailPage.pretrial') ,
            // 下载证书勾选的数据
            cerLoadData: [],
            // 下载证书勾选为空提示
            loadTips:this.$t('orderDetailPage.loadTips') ,
            // 当前商品没有证书可以下载 
            noLoadTips: this.$t('orderDetailPage.noLoadTips') ,
        }
    },

    created() {
        // 得到网址的参数
        this.getUrlData();
    },
    computed: {
        // 引入favoritePage里的中英文
        i18n() {
            return this.$t('orderDetailPage') 
        },
    },

    /* watch: {
        $route(to, from) {
            if(to.name == 'orderDetail' && from.name == 'confirmed') {
                this.getUrlData();
            } else {
                return false;
            }
        }
    }, */

    methods:{
        defImg() {
            let img = event.srcElement;
            img.src = this.defaultImg;
            img.onerror = null; //防止闪图
        },
        /**
         * 勾选商品变化 
         */
        selectItem(selection) {
            this.cerLoadData = selection.map(ele => ele.gid)
        },
        /**
         * 下载证书
         */
        loadCer() {
            let flag = false;
            this.orderDetailData.goodsData.forEach(ele => {
                // 说明有商品有证书
                if(!ele._disabled) {  
                    flag = true;
                    return false;
                }
            })
            if(!flag) {
                //  console.log('说明无证书')
                this.$Message.error({
                    content: this.noLoadTips,
                    duration: 3
                });
                return false;
            } 
            if(!this.cerLoadData.length) {
                // 未勾选商品证书
                this.$Message.error({
                    content: this.loadTips,
                    duration: 3
                });
                return false;
            }
            let cerStr = this.cerLoadData.join(',');
            location.href = `http://order.xmvogue.com/word/public/index.php?s=/home/cart/download&gid=${cerStr}`
        },
        /**
         * 得到网址的参数
         */
        getUrlData(){
            this.urlParams = getUrlParams();
            this.modelStatus = this.urlParams.type;
            this.getOrder();
        },
        /*
        * 得到订单详情
        */ 
        getOrder() {
            NProgress.start();  // 进度条开始
            this.$resetAjax({
                type: 'POST',
                url: '/Home/Cart/orderView',
                data: {
                    sn: this.urlParams.sn,
                    type:this.modelStatus, // 订单类型，是未确定订单还是已确定订单
                    lang: localStorage.langSelect,
                },
                success: (res) => {
                    NProgress.done();  // 进度条开始
                    let result = JSON.parse(res);
                    let list = result.list;
                    this.getComplete(list,result);
                },
            })
       },
        /*
        * 订单详情
        */ 
        getComplete(list,result) {
            let info = result.info;
            let track = result.track;
            this.oper_date = info.oper_date;
            this.orderId = info.sheet_no;
            this.totalPrice = info.sheet_amt;
            this.status = list[0].order_status;
            let status = info.status;
            switch(status) {
                case '1700':
                    this.status = this.orderSuccess;
                    break;
                case '2200':
                    this.status = this.adopt;
                    break;
                case '100':
                    this.status = this.distributing;
                    break;
                case '700':
                    this.status = this.shipped;
                    break;
                case '701':
                    this.status =  this.transportation;
                    break;
                case '1000':
                    this.status = this.receiving;
                    break;
                case '300':
                    this.status = this.fulfillment;
                    break;
                case '110':
                    this.status = this.void;
                    break;
                case '1710':
                    this.status = this.pretrial;
                    break;
                
            }
            list.forEach(ele => {
                ele.item_name = ele.item_name;
                ele.imgUrl = `http://img.xmvogue.com/thumb/${ele.item_no}.jpg?x-oss-process=style/80`;
                ele.item_num = ele.order_qty;
                // 如果有证书或报告返回值就可以进行勾选下载证书
                ele._disabled = ele.credential.length ? false : true;
                ele.price = `￥${ele.price}` 
                ele.sub_amt = `￥${ele.yh_sub}` 

            })
            this.orderDetailData.goodsData = list;
        },
        /**
         * 跳转到商品详情
         */
        goDetail(item_no) {
            // 新开页面跳转到商品详情页面
            this.$router.push({path:'/goodsDetail', query: {item_no:item_no}})
            // let routeData = this.$router.resolve({ name: 'goodsDetail', query: {item_no:item_no}});
            // window.open(routeData.href, '_blank');
        }

    }
}
</script>
