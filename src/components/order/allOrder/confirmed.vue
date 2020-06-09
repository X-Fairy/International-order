<template>
    <div class="confirmedPage">
        <p class="order_title">{{i18n.pageTitle}}</p>
        <div class="select">
            <div class="select_left">
                <div class="status">
                    <span class="item_title">{{i18n.status}}：</span>
                    <Select v-model="modelStatus" style="width:200px" @on-change="changeStatus">
                        <Option v-for="item in statusList" :value="item.id" :key="item.id">{{ item.label }}</Option>
                    </Select>
                </div>
                <div class="dateValue">
                    <span class="item_title">{{i18n.date}}：</span>
                    <Select v-model="modelDate" style="width:200px" @on-change="changeDate">
                        <Option v-for="item in DateList" :value="item.id" :key="item.id">{{ item.label }}</Option>
                    </Select>
                </div>
            </div>
        </div>
        <div class="confirmed">
            <div class="pageSimple">
                <div class="pageSimple_left">
                    <a class="synchronous" @click="synchrOrder" v-if="isSynchronous" :title="i18n.synchronouszz">{{i18n.synchronous}}</a>
                    <a class="export" @click="exportCom" :title="i18n.exportTips">{{i18n.export}}</a>
                </div>
                <Page :current="currentPage" :page-size="pageSize" :total="total" @on-change="changePage" simple />
            </div>
            <Table class="table" :columns="columns" :data="confirmedData" :disabled-hover="true" @on-selection-change="changeSelect"></Table> 
        </div>
        <div class="page">
            <Page :total="total" :page-size="pageSize" @on-change="changePage" :current="currentPage" show-elevator show-total></Page>
        </div>
        <!-- 订单导出时需要订单时间、订单号这些额外信息确认框 -->
        <Modal v-model="modalValue" :title="i18n.modalTitle" :mask-closable="false" :ok-text="i18n.typeOk" :cancel-text="i18n.typeNoOk" @on-ok="exportOk(1)" @on-cancel="exportOk(2)" class="comfirmedPage_modal">
            <p>{{i18n.modalContent}}</p>
        </Modal>
    </div>
</template>


<script>
import NProgress from 'nprogress'   // 引入进度条
import 'nprogress/nprogress.css'    // 引入进度条
export default {
    name: 'confirmed',
    data() {
        return {
            // 订单状态
            modelStatus: 0,
            // 订单导出确认订单备注信息
            modalValue: false,
            // 订单选择周期
            modelDate: '',
            // 订单状态数据
            statusList: this.$t('orderListPage.statusList') ,
            // 订单周戎数据
            DateList: this.$t('orderListPage.DateList') ,
            // 已确认订单数据
            confirmedData: [],
            // 商品总数
            total: 0,
            // 每页条数
            pageSize: 20,
             // 当前页码
            currentPage: 1,
            // 未完成订单
            unfinished: this.$t('orderListPage.unfinished') ,
            // 已完成订单
            completed: this.$t('orderListPage.completed') ,
            // 是否有同步过
            isSynchronous:false,
            // 订单同步成功
            synchronousTips: this.$t('orderListPage.synchronousTips'),
            columns: [
                { 
                    type: 'selection',
                    width: 60,
                    align: 'center',
                },
                {
                    title: this.$t('orderListPage.status'),
                    align: 'center',
                    key: 'status',
                    width:320,
                },
                {
                    title: this.$t('orderListPage.orderNum'),
                    align: 'center',
                    key: 'NUM',
                    width:220,
                },
                /* {
                    title: this.$t('orderListPage.buyer'),
                    align: 'center',
                    key: 'buyer',
                }, */
                /* {
                    title: this.$t('orderListPage.discount'),
                    align: 'center',
                    key: 'discount_amt',
                }, */
                {
                    title: this.$t('orderListPage.paid'),
                    align: 'center',
                    key: 'sheet_amt',
                },
                {
                    title: this.$t('orderListPage.submission'),
                    align: 'center',
                    key: 'oper_date',
                },
                {
                    title: this.$t('orderListPage.operation'),
                    align: 'center',
                    key: '',
                    render: (h, { row }) => {
                        return (
                            <p on-click={() => this.lookOrderDetail(row, 2)} style="cursor:pointer;">{this.i18n.lookDetail}</p>
                        )
                    }
                },
            ],
            // 订单导出单号数组
            sheetArr: [],
            // 订单导出必须字段
            fields: ['item_name', 'item_en' ,'goods.item_no' ,'order_qty' ,'valid_price' ,'sub_amt','oper_date'],
            // 勾选提示
            checkTips: this.$t('orderListPage.checkTips'),
            // 订单导出是否需要订单备注等信息传参
            exportType: 0 ,

        }
    },

    created() {
        // 得到订单列表
        this.getOrderList();
    },
    computed: {
        // 引入favoritePage里的中英文
        i18n() {
            return this.$t('orderListPage') 
        },  
    },
    methods: {
        /**
         * 更改订单状态
        */
        changeStatus(item) {
            this.currentPage = 1;
            this.sheetArr = [];
            this.getOrderList();
        },
        /**
         * 更改订单周期
         */
        changeDate(date) {
            this.currentPage = 1;
            this.sheetArr = [];
            this.getOrderList();
        },
        /**
         * 选择订单导出
         */
        changeSelect(selection) {
            this.sheetArr = selection.map(ele => ele.NUM)
        },
        /**
         * 订单导出选择订单信息备注框
         */
        exportCom() {
            if(this.sheetArr.length === 0) {
                this.$Message.success({
                    content: this.checkTips,
                    duration: 3
                });
                return false;
            }
            this.modalValue = true;
        },
        /**
         * 订单导出要导出订单信息备注
         */
        exportOk(type) {
            this.exportType = type;
            this.modalValue = false;
            this.exportOrder();
        },
        /**
         * 导出订单
         */
        exportOrder() {
            location.href = `${location.origin}/word/public/index.php?s=/home/cart/download_order&order=${this.sheetArr}&lang=${localStorage.langSelect}&title=${this.exportType}`;
        },
        /**
         * 得到订单列表
         */
        getOrderList() {
            NProgress.start();  // 进度条开始
            this.$resetAjax({
                type: 'POST',
                url: '/Home/Cart/orderList',
                data: {
                    type: this.modelStatus, // 订单状态
                    page: this.currentPage,
                    lang: localStorage.langSelect,
                    date : this.modelDate,  // 时间周期
                   
                },
                success: (res) => {
                    NProgress.done();  // 进度条开始
                    let result = JSON.parse(res);
                    let list = result.list;
                    this.isSynchronous = result.other.isnew === 2 ?   false : true;
                    if(list.length !== 0) {
                        this.total = result.other.totalPage === undefined ? 0 : Number(result.other.totalPage);
                        list.forEach(ele => {
                            switch(localStorage.langSelect) {
                                case '0':
                                    if(ele.order_status === 0) {
                                        ele.status = '待传输订单';
                                    } else {
                                        ele.status = ele.order_status;
                                    }
                                    break;
                                case '1':
                                    if(ele.order_status === 0) {
                                        ele.status = 'To be Transferred';
                                    } else {
                                        ele.status = ele.order_status;
                                    }
                                    break;
                            }
                            ele.oper_date = ele.FILDATE;
                            ele.sheet_amt = `￥${ele.sheet_amt}`;
                            ele.buyer = ele.STORECODE;
                        });
                        this.confirmedData = list;
                    } else {
                        this.confirmedData = [];
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
        lookOrderDetail(item,num) {
            // 新开页面跳转到商品详情页面
            // this.$router.push({path: '/order/orderDetail',query: {sn: item.NUM, type: this.modelStatus }})
            let routeData = this.$router.resolve({ name: 'orderDetail', query: {sn: item.NUM, type: this.modelStatus }});
            window.open(routeData.href, '_blank');
        },
        /**
         * 同步订单
         */
        synchrOrder() {
            this.$resetAjax({
                type: 'POST',
                url: '/home/Import/sheet',
                success: (res) => {
                    let result = JSON.parse(res);
                    if(result.errorcode === 0) {
                        this.$Message.success({
                            content: this.synchronousTips,
                            duration: 3
                        });
                        this.isSynchronous = false;
                        this.currentPage = 1;
                        this.modelStatus = '';
                        this.getOrderList();
                    }
                },
            })
        }
    }
}
</script>
