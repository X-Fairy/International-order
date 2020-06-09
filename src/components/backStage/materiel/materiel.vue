

<template>
    <div class="materielPage">
        <div class="top">
            <div class="top_select">
                <div class="item">
                    <span class="item_title">编码： </span>
                    <Input v-model="codeValue" placeholder="请输入门店编码..." style="width: 200px" @on-enter="codeEnter" @on-blur="codeEnter" />
                </div>
                <div class="item">
                    <span class="item_title">日期： </span>
                    <DatePicker :value="daterange" format="yyyy-MM-dd" type="daterange" placement="bottom-end" placeholder="请选择日期..." style="width: 240px" @on-change="changeDate"></DatePicker>
                </div>
            </div>
        </div>
        <div class="table">
            <Table border :height="tableHeight" :columns="columns" :data="tableData"></Table>
        </div>
    </div>    
</template>

<script>
import NProgress from "nprogress"; // 引入进度条
import "nprogress/nprogress.css"; // 引入进度条
export default {
    data() {
        return {
            // 日期选择
            daterange: [],
            // 门店编码
            codeValue: '',
            // 表格高度
            tableHeight: 700,  
            // 表格数据 
            tableData: [], 
            // 总金额
            totalMoney: 0,
            // 表头数据
            columns:[
                {
                    title: '商品编码',
                    align: 'center',
                    key: 'GDCODE',
                },
                {
                    title: '商品名称',
                    align: 'center',
                    key: 'NAME',
                },
                {
                    title: '商品图片',
                    align: 'center',
                    key: 'GDCODE',
                    render: (h, { row }) => {
                        return (<img onClick={() => this.lookImg(row)} src={`http://img.xmvogue.com/thumb/${row.GDCODE}.jpg?x-oss-process=style/80`} title="点击查看图片大图" style="width:80px;height:80px;margin-top: 8px;cursor:pointer;"/>);
                    } 
                },
                {
                    title: '进价',
                    align: 'center',
                    key: 'base_price',
                },
                {
                    title: '数量',
                    align: 'center',
                    key: 'QTY',
                },
                {
                    title: '金额',
                    align: 'center',
                    key: 'TOTAL',
                    renderHeader: (h,params)=>{
                        return h('div',[
                            h('strong','金额'),
                            h('span', {
                                style: {
                                    marginLeft: '15px',
                                    color: '#1d8c9f',
                                    fontSize: '14px',
                                    marginTop: '10px',
                                    display: 'inline-block'
                                },
                            },`(合: ￥${this.totalMoney})`)
                        ])
                    },
                },
                {
                    title: '日期',
                    align: 'center',
                    key: 'fdate',
                },
            ],
            // 开始时间
            sdate: '',
            // 结束时间
            edate: '',
            

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
    methods: {
        /**
         * 编码搜索
         */
        codeEnter() {
            if(this.codeValue.length === 0) {
                this.$Message.error({
                    content: '很抱歉，门店编码不能为空',
                    duration: 3
                });
                return false;
            }
            this.getTableData();
        },
        /**
         * 时间查询
         */
        changeDate(date) {
            this.sdate = date[0];
            this.edate = date[1];
            if(this.codeValue.length === 0) {
                this.$Message.error({
                    content: '很抱歉，门店编码不能为空',
                    duration: 3
                });
                return false;
            }
            this.getTableData();
        },
        /**
         * 获取删除订单列表
         */
        getTableData() {
            NProgress.start();
            this.$resetAjax({
                type: "GET",
                url: "/admin/dingdan/wuliao",
                data:{
                    sdate: this.sdate, // 开始时间
                    edate: this.edate, // 结束时间
                    sissid: this.codeValue.trim(), // 门店编码
                },
                success: (res) => {
                    NProgress.done();
                    let result = JSON.parse(res).data;
                    this.tableData = result.list;
                    this.totalMoney = result.amt.toFixed(2);
                }
            });
        },
        /**
         * 查看商品大图
         */
        lookImg(row) {
            window.open(`http://img.xmvogue.com/thumb/${row.GDCODE}.jpg?x-oss-process=style/800`)
        }
        
    }
}
</script>