
<template>
    <div class="bgAdvancePage">
        <div class="top">
            <div class="top_right">
                <div class="item">
                    <span class="item_title">状态：</span>
                    <Select style="width:150px" v-model="statusValue" clearable @on-change="changeStatus">
                        <Option v-for="item in statusList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                </div>
                <div class="item">
                    <span class="item_title">订单号：</span>
                    <Input v-model="numValue" placeholder="订单号" style="width: 150px" @on-enter="nameLook" @on-blur="nameLook"/>
                </div>
                <div class="item">
                    <span class="item_title">门店：</span>
                    <Input v-model="hdidValue" placeholder="门店编码或名称" style="width: 120px" @on-enter="nameLook" @on-blur="nameLook"/>
                </div>
                <div class="item">
                    <span class="item_title">商品：</span>
                    <Input v-model="nameValue" placeholder="商品名称" style="width:120px" @on-enter="nameLook" @on-blur="nameLook"/>
                </div>
                <div class="item">
                    <span class="item_title">地区：</span>
                    <Input v-model="areaValue" placeholder="地区" style="width:120px" @on-enter="nameLook" @on-blur="nameLook"/>
                </div>
                 <div class="item">
                    <span class="item_title">客服：</span>
                    <Input v-model="kefuValue" placeholder="客服" style="width: 120px" @on-enter="nameLook" @on-blur="nameLook"/>
                </div>
                <div class="item">
                    <span class="item_title">时间：</span>
                    <DatePicker type="datetimerange" :value="dateValue" :options="options" @on-change="changeDate" placement="bottom-end" placeholder="请选择时间" style="width: 315px"></DatePicker>
                </div>
            </div>
        </div>
        <div class="table">
            <div class="top_left">
                <!-- <p @click="exportHandle" title="预售订单导出">导出</p> -->
            </div>
            <Table  @on-selection-change="changeSelect" border :height="tableHeight"  :columns="columns" :data="tableData" ></Table>  
        </div>
        <div class="pageContanier">
            <Page :total="total" :page-size="pageSize" @on-change="changePage" :current="currentPage" show-elevator show-total></Page>
        </div>
        <!-- 拒绝订单理由 -->
        <Modal v-model="isRefuer" title="拒绝订单的理由"  @on-ok="passOrder" class="refuse_bgAdvance">
            <Input v-model="refuseMemo" placeholder="请输入拒绝理由" style="width:100%"/>
        </Modal>
        <!-- 预订订单详情 -->
        <Drawer :closable="true" width="1500" v-model="valueDrawer" class="detailClos_bgAdvancePage" title="预售订单详情" :draggable ="true">
            <p class="closaTitle">基本信息</p>
            <div class="demo-drawer-profile">
                <Row>
                    <i-Col span="12">
                        订单号：<span> {{rowData.sheet_no}}</span>
                    </i-Col>
                     <i-Col span="12">
                        数量：<span> {{rowData.order_qty}}</span>
                    </i-Col>
                    
                </Row>
                <Row>
                    <i-Col span="12">
                        门店：<span> {{rowData.buyer}} {{[rowData.hdid]}}</span>
                    </i-Col>
                   
                    <i-Col span="12">
                        客服：<span> {{rowData.user}}</span>
                    </i-Col>
                </Row>
                <Row>
                    
                     <i-Col span="12">
                        客户余额：<span> {{rowData.money}}</span>
                    </i-Col>
                    <i-Col span="12">
                        总金额：<span>{{rowData.sheet_amt}}</span>
                    </i-Col>
                    
                </Row>
                <Row>
                    <i-Col span="12">
                        状态：<span> {{rowData.status}}</span>
                    </i-Col>
                    
                    <i-Col span="12">
                        下单时间：<span> {{rowData.oper_date}}</span>
                    </i-Col>
                </Row>
                <Row>
                    <i-Col span="12">
                        地区：<span> {{rowData.area}}</span>
                    </i-Col>
                </Row>
            </div>
            <Divider />
            <p class="closaTitle">商品信息</p>
            <div class="demo-drawer-profile">
                <Row>
                    <i-Col span="24" class="item_list">
                        <Table border :columns="detailColumns" :data="detailsList"  style="width:100%;"></Table>  
                    </i-Col>
                </Row>
            </div>
        </Drawer>
    </div>
</template>

<script>
import {changeday } from  '@/assets/js/tool.js'    // 转化时间为2019-10-09 这样的格式  
import {changeTime} from  '@/assets/js/tool.js'                    // 转化时间为2019-10-09 00:00:00这样的格式      
import NProgress from 'nprogress'   // 引入进度条
import 'nprogress/nprogress.css'    // 引入进度条
export default {
    data() {
        return {
            // 人员权限
            online: false,
            // 商品总数
            total: 0,
            // 每页条数
            pageSize: 20,
             // 当前页码
            currentPage: 1,
            // 表格高度
            tableHeight:600,
            // 表格数据
            tableData: [],
            // 订单状态
            statusValue: '',
            // 门店编码
            hdidValue: '',
            // 商品名称
            nameValue: '',
            // 订单号
            numValue: '',
            // 客服
            kefuValue: '',
            // 地区
            areaValue: '',
            // 订单状态
            statusList: [
                {
                    value: 0,
                    label: '未审核',
                },
                {
                    value: 1,
                    label: '审核通过',
                },
                {
                    value: 2,
                    label: '审核不通过',
                },
                {
                    value: 3,
                    label: '已传输',
                },
                {
                    value: 5,
                    label: '已关闭',
                },
            ],
            // 表头
            columns: [
                {
                    type: 'selection',
                    width: 60,
                    align: 'center'
                },
                {
                    title: '门店',
                    align: 'center',
                    key: 'buyer',
                    width: 140,
                    render:(h, {row}) => {
                        return (
                            <div>
                                <p title="门店编码">{row.hdid}</p>
                                <p title="门店名称">{row.buyer}</p>
                            </div>
                        )
                    }
                },
                {
                    title: '地区',
                    align: 'center',
                    key: 'area',
                },
                {
                    title: '订单号',
                    align: 'center',
                    key: 'sheet_no',
                    width:180,
                },
                {
                    title: '商品名称',
                    align: 'center',
                    key: 'item_name',
                },
                {
                    title: '图片',
                    align: 'center',
                    key: 'img',
                    render: (h, { row }) => {
                        return (
                            <img v-lazy={row.img} style="width:80px;margin:5px 0;cursor:pointer" alt="" title="点击查看商品大图"  onClick={() => this.lookOrderImg(row.img)}/>);
                    }
                },
                {
                    title: '账户余额(￥)',
                    align: 'center',
                    key: 'money',
                },
                {
                    title: '下单信息',
                    align: 'center',
                    key: 'sheet_amt',
                    width: 160,
                    render: (h, {row}) => {
                        return (
                            <div style="padding-left:8px;">
                                <p style="text-align:left;">数量：{row.order_qty}</p>
                                <p style="text-align:left;">单价：{row.base_price}</p>
                                <p style="text-align:left;">金额：{row.sheet_amt}</p>
                            </div>
                        )
                    }
                },
                {
                    title: '下单时间',
                    align: 'center',
                    key: 'oper_date',
                    width: 180
                },
                {
                    title: '状态',
                    align: 'center',
                    key: 'status',
                },
                {
                    title: '客服',
                    align: 'center',
                    key: 'user',
                },
            ],
            options: {
                disabledDate (date) {
                    return date && date.valueOf() > Date.now();
                }
            },
            // 时间选择
            dateValue: [],
            // 勾选中的订单
            selectData: [],
            // 订单拒绝操作理由
            refuseMemo: '',
            // 是否显示拒绝理由模态框
            isRefuer: false,
            // 当前行的订单号
            rowsSheetno: '',
            // 当前行的拒绝、通过的类型
            rowsNum: 0,
            // 订单详情商品表头
            detailsList:[],
            // 订单详情商品数据
            detailColumns:[
                {
                    title: '商品名称',
                    align: 'center',
                    key: 'item_name',
                },
                {
                    title: '图片',
                    align: 'center',
                    key: 'img',
                    render: (h, { row }) => {
                        return (
                            <img v-lazy={row.img} style="width:80px;margin:5px 0;cursor:pointer" alt="" title="点击查看商品大图"  onClick={() => this.lookOrderImg(row.img)}/>);
                    }
                },
                {
                    title: '数量',
                    align: 'center',
                    key: 'order_qty',
                },
                {
                    title: '单价',
                    align: 'center',
                    key: 'base_price',
                },
                {
                    title: '下单金额',
                    align: 'center',
                    key: 'sheet_amt',
                },
                {
                    title: '预定时间',
                    align: 'center',
                    key: 'oper_date',
                    width: 180
                },
                {
                    title: '截止时间',
                    align: 'center',
                    key: 'deadline',
                    width: 180
                },
                {
                    title: '到货时间',
                    align: 'center',
                    key: 'arrival',
                    width: 180
                },
            ],
            // 订单详情数据
            rowData:{},
            // 是否显示订单详情抽屉框
            valueDrawer: false,

           
        }
    },
    mounted() {
        setTimeout(()=> {
            // 得到浏览器内容高度
            let windowHeight = document.documentElement.clientHeight || document.body.clientHeight;
            this.tableHeight = (windowHeight- 280);
        },100)
        // 调整浏览器的时候
        $(window).on('resize', () => {
            let windowHeight = document.documentElement.clientHeight || document.body.clientHeight;
            this.tableHeight = (windowHeight - 280);
        })
    },
    watch: {
        valueDrawer(val,oldval) {
            if(!val) {
                this.detailsList = [];
                this.rowData = {};
            }
        }
    },
    created() {
        // 权限判断
        this.Identity()
        // 得到已确定订单列表
        this.getOrderList();
    },

    methods: {
        /**
         * 权限判断
         */
        Identity() {
            // 采购、采购总监、夏晓岚、admin 有权限对预售订单进行通过、拒绝操作。
            var arr = [4,5,106,100];
            this.online = arr.includes(Number(localStorage.group_id))
            var item = {
                title: '操作',
                key: 'action',
                align: 'center',
                with: 220,
                render: (h, {row}) => {
                    return (
                        <div>
                            {row.order_status === 0 && 
                                <poptip confirm title="要关闭订单吗 ?" on-on-ok={() => this.colseOrder(row)}  >
                                    <span class='delete' title="关闭订单">关闭</span>
                                </poptip>
                            }
                            {row.order_status === 5 && 
                                <poptip confirm title="要恢复订单吗 ?" on-on-ok={() => this.colseOrder(row)}  >
                                   <span class='delete' title="恢复订单">恢复</span>
                                </poptip>
                            }
                            {row.order_status === 0 && 
                            <poptip confirm title="要删除订单吗 ?" on-on-ok={() => this.deleteOrder(row)}  >
                                <span class='delete' title="删除订单">删除</span>
                            </poptip> 
                            }
                            <span class='detail_row' title="订单详情" onClick={() =>this.detailInfo(row)}>详情</span>   
                        </div>
                    )
                }
            }
            var item2 = {
                title: '操作',
                key: 'action',
                align: 'center',
                width:240,
                render: (h, {row}) => {
                    return (
                        // 采购、采购总监、admin 对未审核的预售订单有通过、拒绝操作功能
                        <div>
                            {row.order_status === 0 && 
                            <poptip confirm title="通过该订单吗 ?" on-on-ok={() => this.passHandle(row, 1)}  >
                                <span class='delete' title="通过订单">通过</span>
                            </poptip> 
                            }
                            {row.order_status === 0 && 
                            <poptip confirm title="拒绝该订单吗 ?" on-on-ok={() => this.passHandle(row, 2)}  >
                                <span class='delete' title="拒绝订单">拒绝</span>
                            </poptip>
                            }
                            {row.order_status === 0 && 
                                <poptip confirm title="要关闭订单吗 ?" on-on-ok={() => this.colseOrder(row)}  >
                                    <span class='delete' title="关闭订单">关闭</span>
                                </poptip>
                            }
                            {row.order_status === 5 && 
                                <poptip confirm title="要恢复订单吗 ?" on-on-ok={() => this.colseOrder(row)}  >
                                   <span class='delete' title="恢复订单">恢复</span>
                                </poptip>
                            }
                            {(row.order_status === 0 || row.order_status === 1 || row.order_status === 5 || row.order_status === 2) && 
                            <poptip confirm title="要删除订单吗 ?" on-on-ok={() => this.deleteOrder(row)}  >
                                <span class='delete' title="删除订单">删除</span>
                            </poptip> 
                            } 
                            <span class='detail_row' title="订单详情" onClick={() =>this.detailInfo(row)}>详情</span>  
                        </div>
                    )
                }
            }
            if(this.online) {
                this.columns.push(item2)
            } else {
                this.columns.push(item)
            }
        },
        /**
         * 订单状态选择
         */
        changeStatus(value) {
            this.statusValue = value;
            this.currentPage = 1; 
            this.getOrderList();
        },
        /**
         * 商品名称查询
         */
        nameLook() {
            this.currentPage = 1; 
            this.getOrderList();
        },
        /**
         * 订单列表
         */
        getOrderList() {
            this.etime === '' || (this.etime === undefined ? '' : changeTime(this.etime));
            this.stime === '' || (this.stime === undefined ? '' : changeTime(this.stime));
            NProgress.start();  // 进度条开始
            this.$resetAjax({
                type: 'POST',
                url: '/admin/presell/get_order',
                data: {
                    page: this.currentPage,
                    hdid: this.hdidValue.trim(),            // 门店编码或门店名称
                    etime: this.etime,                      // 结束时间
                    stime: this.stime,                      // 开始时间
                    name: this.nameValue.trim(),            //商品名称
                    sheet_no: this.numValue.trim(),              // 订单号
                    order_status: this.statusValue,         // 订单状态
                    kefu: this.kefuValue.trim(),                        // 客服
                    area: this.areaValue.trim(),                   // 地区
                },
                success: (res) => {
                    NProgress.done(); // 进度条结束
                    let result = JSON.parse(res).data.data;
                    let list = result.data;
                    list.forEach(ele => {
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
                    });
                    this.tableData = list;
                    this.total = Number(result.total);
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
         * 对订单进行勾选
         */
        changeSelect(data) {
            this.selectData = data;
        },
        /**
         * 订单导出
         */
        exportHandle() {
            if(this.selectData.length === 0) {
                this.$Message.warning({
                    content: '导出前请先勾选订单！',
                    duration: 3
                });
                return false;
            }
        },
        /**
         * 查看订单详情
         */
        detailInfo(row) {
            this.valueDrawer = true;
            this.rowData = row;
            this.detailsList.push(row)
        },
        /**
         * 删除订单
         */
        deleteOrder(data) {
            this.$resetAjax({
                type: 'POST',
                url: `/admin/presell/del_order`,
                data: {
                   sheet_no: data.sheet_no,  // 订单编号

                },
                success: (res) => {
                    let result = JSON.parse(res).errorcode;
                    if(result === 0) {
                        this.$Message.success({
                            content: '删除订单成功',
                            duration: 2
                        });
                        this.getOrderList();
                    } else{
                        this.$Message.success({
                            content: '很抱歉，删除订单失败',
                            duration: 2
                        });
                    }
                },
            })
        },
        /**
         * 通过、拒绝订单操作前判断
         */
        passHandle(row, num) {
            this.rowsSheetno = row.sheet_no;
            this.rowsNum = num;
            if(this.rowsNum === 2) {
                // 说明是拒绝订单，需要输入拒绝理由
                this.isRefuer = true;
            } else {
                this.passOrder()
            }
        },
        /**
         * 通过、拒绝该订单
         */
        passOrder() {
            var data = {};
            if(this.rowsNum === 1) {
                data= {
                   sheet_no: this.rowsSheetno,  // 订单编号
                   check: 1 // 通过1 拒绝2
                }
            } else {
                data= {
                   sheet_no: this.rowsSheetno,  // 订单编号
                   check: 2, // 通过1 拒绝2
                   reason: this.refuseMemo
                }
            }
            this.$resetAjax({
                type: 'POST',
                url: `/admin/presell/audit`,
                data,
                success: (res) => {
                    let result = JSON.parse(res);
                    if(result.errorcode === 0) {
                        this.$Message.success({
                            content: this.rowsNum === 1 ? '您对该订单通过操作成功' : '您对该订单拒绝操作成功',
                            duration: 3
                        });
                        this.getOrderList();
                    } else{
                        this.$Message.success({
                            content: this.rowsNum === 0 ? '很抱歉，对该订单通过操作成功失败' : '很抱歉，对该订单拒绝操作失败',
                            duration: 3
                        });
                    }
                }
            })
        },
        /**
         * 关闭、取消订单
         */
        colseOrder(data) {
            this.$resetAjax({
                type: 'POST',
                url: `/admin/presell/off_order`,
                data: {
                   sheet_no: data.sheet_no,  // 订单编号
                   status: data.order_status === 0 ? 5 : 0
                },
                success: (res) => {
                    let result = JSON.parse(res).errorcode;
                    if(result === 0) {
                        this.$Message.success({
                            content: data.order_status === 0 ? '棒棒哒，关闭订单成功' : '棒棒哒，恢复订单成功',
                            duration: 2
                        });
                        this.getOrderList();
                    } else{
                        this.$Message.success({
                            content: data.order_status === 0 ? '很抱歉，关闭订单失败' : '很抱歉，恢复订单失败',
                            duration: 2
                        });
                    }
                },
            })
        },
        /**
         * 查看商品图片
         */
        lookOrderImg(url) {
            window.open(url);
        },
        /**
         * 选择时间
         */
        changeDate(value) {
            this.dateRange = value;
            this.stime = value[0];
            this.etime = value[1];
            this.getOrderList();
        }
    }
}
</script>
