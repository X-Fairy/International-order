<template>
    <div class="retrieveOrder">
        <div class="top">
            <div class="item">
                <p>门店：</p>
                <Input v-model="hdid" placeholder="请输入门店编码.." style="width:200px" @on-enter="enterCode" @on-blur="enterCode" />
            </div>
        </div>
        <div class="table">
            <Table border :height="tableHeight" :columns="columns" :data="tableData"></Table>
        </div>
         <div class="pageContanier">
            <Page :total="total" :page-size="pageSize" @on-change="changePage" :current="currentPage" show-elevator show-total></Page>
        </div>
        <Drawer title="已删除订单详情" v-model="drawerValue" width="720" :draggable ="true" :styles="styles" class="retrieveOrder_drawer">
            <Row :gutter="32">
                <i-Col span="12" class="drawerExport">
                    <p>单号：{{orderNum}} （{{orderBuyer}}）</p>
                </i-Col>
                <i-Col span="12" class="drawerExport btn_a">
                    <a @click="exportOrder">导出</a>
                </i-Col>
                <i-Col span="12" class="info">
                    <p>金额：<span>{{orderMoney}}</span> 元</p>
                </i-Col>
                <i-Col span="12" class="info date">
                    <p>下单： {{orderDate}} </p>
                </i-Col>
                <i-Col span="24" class="list_title">
                    <p>订单商品列表</p>
                </i-Col>
                <i-Col span="24" class="item_list">
                    <Table border :columns="detailColumns" :data="orderList" style="width:100%;"></Table>  
                </i-Col>
            </Row>
            <div class="demo-drawer-footer">
                <Button style="margin-right: 8px" @click="drawerValue=false">关闭</Button>
            </div>
        </Drawer>
    </div>
</template>


<script>
import NProgress from 'nprogress'   // 引入进度条
import 'nprogress/nprogress.css'    // 引入进度条
export default {
    data() {
        return {
            // 删除订单列表
            retrieveData: [],
            // 门店编码
            hdid: '',
            // 表格高度
            tableHeight: 700,  
            // 表格数据 
            tableData: [], 
             // 商品总数
            total: 0,
            // 每页条数
            pageSize: 30,
             // 当前页码
            currentPage: 1,
            // 表头数据
            columns:[
                {
                    title: '门店编码',
                    align: 'center',
                    key: 'hdcode',
                },
                {
                    title: '订单号',
                    align: 'center',
                    key: 'ordersn',
                    render: (h, {row}) =>{
                        return (<div onClick={() => this.orderDetail(row)} class="look" title="点击查看订单详情">{row.ordersn}</div>);
                    }
                },
                {
                    title: '提交时间',
                    align: 'center',
                    key: 'ctime',
                },
                {
                    title: '删除时间',
                    align: 'center',
                    key: 'dtime',
                },
                {
                    title: '订单导出',
                    align: 'center',
                    key: 'dtime',
                    render: (h, {row}) =>{
                        return (<div onClick={() => this.rowExport(row)} class="export" title="点击导出订单">
                            <icon type="md-download" size="25" />
                        </div>);
                    }
                },
            ],
            // 抽屉开关
            drawerValue:false,
            styles: {
                height: 'calc(100% - 55px)',
                overflow: 'auto',
                paddingBottom: '53px',
                position: 'static'
            },
            // 抽屉详情订单号
            orderNum: '',
            // 下单金额
            orderMoney: 0,
            // 下单时间
            orderDate: '',
            // 下单人：
            orderBuyer: '',
            // 下单商品列表
            orderList: [],
            // 下单详情表头
            detailColumns: [
                {
                    type: 'index',
                    align: 'center'
                },
                {
                    title: '编码',
                    align: 'center',
                    key: 'item_no',
                },
                {
                    title: '图片',
                    align: 'center',
                    key: 'item_no',
                    render: (h, { row }) => {
                        return (<img onClick={() => this.lookImg(row)} src={`http://img.xmvogue.com/thumb/${row.item_no}.jpg?x-oss-process=style/80`} title="点击查看图片大图" style="width:80px;height:80px;margin-top: 8px;cursor:pointer;"/>);
                    } 
                },
                {
                    title: '名称',
                    align: 'center',
                    key: 'item_name',
                },
                {
                    title: '价格',
                    align: 'center',
                    key: 'base_price',
                },
                {
                    title: '数量',
                    align: 'center',
                    key: 'qty',
                },
                {
                    title: '金额',
                    align: 'center',
                    key: 'sub_amt',
                },
            ]
           

        }
    },
    watch:  {
        drawerValue(val) {
            if(!val) {
                this.orderList = [];
                this.orderBuyer = '';
                this.orderDate = '';
                this.orderNum = '';
                this.orderMoney = 0;
            }
        }
    },
    mounted() {
        setTimeout(()=> {
            // 得到浏览器内容高度
            let windowHeight = document.documentElement.clientHeight || document.body.clientHeight;
            this.tableHeight = (windowHeight- 250);
        },100)
        // 调整浏览器的时候
        $(window).on('resize', () => {
            let windowHeight = document.documentElement.clientHeight || document.body.clientHeight;
            this.tableHeight = (windowHeight - 250);
        })
    },
    created() {
        // 获取删除订单列表
        this.getTableData();
    },

    methods: {
        /**
         * 输入门店列表
         */
        enterCode() {
            this.currentPage = 1;
            this.getTableData();
        },
        /**
         * 获取删除订单列表
         */
        getTableData() {
            NProgress.start();
            this.$resetAjax({
                type: "GET",
                url: "/admin/dingdan/find_order",
                data: {
                    hdid: this.hdid,
                    page: this.currentPage
                },
                success: (res) => {
                    NProgress.done();
                    let result = JSON.parse(res).data;
                    this.tableData = result.list;
                    this.total = Number(result.count);
                }
            });
        },
        /**
         * 切换页码
         */
        changePage(index) {
            this.currentPage = index;
            this.getTableData();
        },
        /**
         * 查看删除订单详情
         */
        orderDetail(row) {
            NProgress.start();
            this.drawerValue = true;
            this.orderDate = row.ctime;  // 下单时间
            this.$resetAjax({
                type: "POST",
                url: "/admin/dingdan/find_order_view",
                data: {
                    file_name: row.ordersn,  // 订单编号
                },
                success: (res) => {
                    NProgress.done();
                    let result = JSON.parse(res);
                    this.orderMoney = result.amt.toFixed(2);  //下单金额
                    this.orderBuyer = result.buyer;   // 下单人
                    result.list.forEach(ele => {
                        ele.sub_amt = ele.sub_amt.toFixed(2);
                    });
                    this.orderList = result.list;     // 下单商品列表
                    this.orderNum = result.ordersn;   // 订单号
                }
            });
        },
        /**
         * 删除订单里导出订单
         */
        rowExport(row) {
            window.open(`http://order.xmvogue.com/word/public/uploads/txt/${row.ordersn}`)
        },
        /**
         * 导出订单
         */
        exportOrder() {
            window.open(`http://order.xmvogue.com/word/public/uploads/txt/${this.orderNum}.txt`)
        },
        /**
         * 查看商品大图
         */
        lookImg(row) {
            window.open(`http://img.xmvogue.com/thumb/${row.item_no}.jpg?x-oss-process=style/800`)
        }
    }
}
</script>
