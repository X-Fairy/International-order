
<template>
    <div class="reverseListPage">
        <p class="order_title">{{i18n.pageTitle}}</p>
        <div class="confirmed">
            <div class="pageSimple">
                <Page :current="currentPage" :page-size="pageSize" :total="total" @on-change="changePage" simple />
            </div>
            <Table class="table" :columns="columns" :data="tableData" :disabled-hover="true"></Table> 
        </div>
        <div class="page">
            <Page :total="total" :page-size="pageSize" @on-change="changePage" :current="currentPage" show-elevator show-total></Page>
        </div>
    </div>
</template>


<script>
import NProgress from 'nprogress'   // 引入进度条
import 'nprogress/nprogress.css'    // 引入进度条
import {getNumBox} from  '@/assets/js/tool.js'
export default {
    data() {
        return {
            lookImg: this.$t('advancePage.lookImg'),
            // 已确认订单数据
            tableData: [],
            // 商品总数
            total: 0,
            // 每页条数
            pageSize: 20,
             // 当前页码
            currentPage: 1,
            // 预定商品成功提示
            orderSuccTips:this.$t('advancePage.orderSuccTips'),
            // 删除预售商品成功提示
            orderDelSucc: this.$t('advancePage.orderDelSucc'),
            // 删除预售商品失败提示
            orderDelErr: this.$t('advancePage.orderDelErr'),
            // 表头数据
            columns: [
                {
                    title: this.$t('advancePage.orderNum'),
                    align: 'center',
                    key: 'sheet_no',
                    width:190,
                },
                {
                    title: this.$t('advancePage.status'),
                    align: 'center',
                    key: 'status',
                },
                {
                    title: this.$t('advancePage.imgUrl'),
                    align: 'center',
                    key: 'img',
                    render: (h, { row }) => {
                        return (
                            <img v-lazy={row.img} style="height:80px;margin:5px 0;cursor:pointer" alt="" title={this.lookImg}  onClick={() => this.goDetails(row)}/>);
                    }
                },
                {
                    title: this.$t('advancePage.qty'),
                    align: 'center',
                    key: 'order_qty',
                },
                {
                    title: this.$t('advancePage.discount'),
                    align: 'center',
                    key: 'base_price',
                },
                {
                    title: this.$t('advancePage.paid'),
                    align: 'center',
                    key: 'sheet_amt',
                    
                },
                {
                    title: this.$t('advancePage.submission'),
                    align: 'center',
                    key: 'oper_date',
                    width: 180,
                },
                /* {
                    title: this.$t('advancePage.operation'),
                    align: 'center',
                    key: '',
                    render: (h, {row}) => {
                        return h('div', [
                            h('span', [
                                h('Poptip', {
                                    class: 'handle delete',
                                    props: {
                                        confirm: true,
                                        transfer: true,
                                        placement: 'top',
                                        title: this.$t('advancePage.delOrderTips'),
                                        type: 'error',
                                        size: 'small',
                                        width: '150',
                                        vModel: true
                                    },
                                    domProps:{
                                        title:'删除'
                                    },
                                    style: {
                                        cursor: 'pointer'
                                    },
                                    on: {
                                        'on-ok': ()=>{
                                            // 确定删除
                                            this.delOrder(row)
                                        },
                                        'on-cancel': ()=>{
                                            // 取消删除
                                        }
                                    }
                                }, [
                                    h('Icon',{
                                        props: {
                                            type: 'ios-trash',
                                            size: 25,
                                        }
                                    })
                                ])
                            ]),
                        ]);
                    }
                }, */
            ]
        }
    },

    created() {
        // 得到订单列表
        this.getOrderList();
    },
    computed: {
        i18n() {
            return this.$t('advancePage') 
        },
    },
    methods: {
        /**
         * 得到订单列表
         */
        getOrderList() {
            NProgress.start();  // 进度条开始
            this.tableData = [];
            this.total = 0;
            this.$resetAjax({
                type: 'POST',
                url: '/home/presell/get_order',
                data: {
                    page: this.currentPage,
                   
                },
                success: (res) => {
                    NProgress.done();  // 进度条开始
                    let result = JSON.parse(res).data.data;
                    let list = result.data;
                    this.total = result.total;
                    if(list.length) {
                        list.forEach(ele => {
                            ele.sheet_amt = `￥${ele.sheet_amt}`;
                            ele.base_price = `￥${ele.base_price}`;
                            switch(localStorage.langSelect) {
                                case '0':
                                    switch(ele.order_status) {
                                        case 0:
                                            ele.status = '待审核';
                                            break;
                                        case 1:
                                            ele.status = '审核通过';
                                            break;
                                        case 2:
                                            ele.status = '审核不通过';
                                            break;
                                        case 3:
                                            ele.status = '已传输';
                                            break;
                                        case 5:
                                            ele.status = '已关闭';
                                            break;
                                    }
                                    break;
                                case '1':
                                    switch(ele.order_status) {
                                        case 0:
                                            ele.status = 'To be Reviewed';
                                            break;
                                        case 1:
                                            ele.status = 'Pre-Ordered';
                                            break;
                                        case 2:
                                            ele.status = 'Order Submission Failed';
                                            break;
                                        case 3:
                                            ele.status = 'Transferred';
                                            break;
                                        case 5:
                                            ele.status = 'Order Deleted';
                                            break;
                                    }
                                    break;
                            }
                        });
                        let arr = result.data.map(ele => Number(ele.order_qty));
                        this.tableData = list;
                    } else {
                        this.tableData = [];
                    }
                },
            })
        },
         /**
         *  切换页面
         */
        changePage(index) {
            this.currentPage = index;
            this.getOrderList();
        },
        /**
        * 查看已确认订单详情
         */
        goDetails(row) {
            this.$router.push({path: '/goodsDetail',query: {item_no:row.id,advance: 1}})
            /* 新开页面跳转到商品详情页面
            this.$router.push({path: '/order/orderDetail',query: {sn: item.NUM, type: this.modelStatus }})
            let routeData = this.$router.resolve({ name: 'orderDetail', query: {sn: item.NUM, type: this.modelStatus }});
            window.open(routeData.href, '_blank'); */
        },
        /**
         * 删除该预售商品订单
         */
        delOrder(row) {
            this.$resetAjax({
                type: 'POST',
                url: '/home/presell/delorder',
                data: {
                    gid: row.id,     // 预定商品编码
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
                            let index = row._index;
                            this.total = this.total -1 ;
                            this.tableData.splice(index,1)
                            this.getCartInfo({
                                vm: this
                            });
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
    }
}
</script>
