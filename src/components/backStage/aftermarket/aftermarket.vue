<template>
    <div class="aftermarket">
        <div class="top">
            <p class="merge" @click="mergeSale">合并</p>
            <div class="right">
                <div class="item">
                    <div class="item">
                        <span class="item_title">时间选择： </span>
                        <DatePicker v-model="dateRange" type="daterange" :options="options" @on-change="getSelectTime" placeholder="请选择时间区间..." style="width: 220px"></DatePicker>
                    </div>
                    <span class="item_title">售后类型： </span>
                    <Select v-model="saleType" clearable style="width:120px" @on-change="typeChange">
                        <Option v-for="item in typeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                </div>
                <div class="item">
                    <span class="item_title">审核状态： </span>
                    <Select v-model="auditState" clearable style="width:120px" @on-change="stateChange">
                        <Option v-for="item in stateList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                </div>
                 <div class="item">
                    <span class="item_title">客户编码： </span>
                    <Input v-model="codeValue" placeholder="请输入客户编码" style="width: 120px" @on-enter="codeEnter" @on-blur="codeEnter"/>
                </div>
            </div>
        </div>
        <div class="table">
            <Table  border :height="tableHeight"  :columns="columns" :data="tableData" @on-selection-change="changeSelection"  ></Table>  
        </div>
        <div class="pageContanier">
            <Page :total="total" :page-size="pageSize" @on-change="changePage" :current="currentPage" show-elevator show-total ></Page>
        </div>
        <!-- 售后详情抽屉 -->
        <Drawer :closable="true" width="1500" v-model="detailValue" class="after_detailClos" title="售后详情" :draggable ="true" @on-close="closeDrawer">
            <p class="closaTitle">基本信息 >></p>
            <div class="demo-drawer-profile">
                <Row>
                    <i-Col span="12">
                        客户：<span> {{salesObj.user_name}}</span>
                    </i-Col>
                    <i-Col span="12">
                        数量：<span> {{salesObj.qty}}</span>
                    </i-Col>
                </Row>
                 <Row>
                    <i-Col span="12">
                        客服：<span> {{salesObj.kefu}}</span>
                    </i-Col>
                    <i-Col span="12">
                        金额：<span class="col_price">{{salesObj.szamt}}</span>
                    </i-Col>
                </Row>
                <Row>
                    <i-Col span="12">
                        理由：<span style="color:#F90;"> {{salesObj.lx}}</span>
                    </i-Col>
                    <i-Col span="12">
                        时间：<span>{{salesObj.sqrq}}</span>
                    </i-Col>
                </Row>
                <Row>
                    <i-Col span="12">
                        状态：<span>{{salesObj.zt}}</span>
                        <!-- <span @click="accountBooks" class="accountBtn" :title="salesObj.chjg ? '部分上账' : '上账清单'">
                            {{salesObj.chjg ? '部分上账' : '上账清单'}} <span v-if="salesObj.chjg === 1">￥{{salesObj.szamt}}</span>
                        </span> -->
                    </i-Col>
                </Row>
            </div>
            <Divider />
            <p class="closaTitle" style="margin-bottom:25px;">商品信息 >></p>
            <div class="demo-drawer-profile">
                <Table border :columns="columns1" :data="goodList"></Table>
            </div>
            <p class="closaTitle" v-if="isOrder">售后信息  >></p>
            <div class="demo-drawer-profile" v-if="isOrder">
                <Table border :columns="orderColus" :data="orderData"></Table>
            </div>
        </Drawer>
        <!-- 拒绝理由 -->
        <Modal v-model="refuseValue" title="提示" @on-ok="refuseQuery" @on-cancel="refuseValue=false" draggable class="after_refuse">
            <Input v-model="reasonKey" placeholder="请输入您拒绝的理由..." style="width:480px" />
        </Modal>
        <!-- 完成订单操作确认 -->
        <Modal v-model="compleValue" title="提示" @on-ok="complete" @on-cancel="compleValue=false;" class="completeModel_aftermarket">
            <p style="font-size:16px;">确定完成该售后吗? 不能撤销的,请慎重操作 !!!</p>
        </Modal>
        <!-- 上账清单抽屉框 -->
        <Drawer :closable="true" width="1500" v-model="isAccount" class="after_detailClos" title="上账清单" :draggable ="true" @on-close="closeDrawer">
            <p class="closaTitle">基本信息 >></p>
            <div class="demo-drawer-profile">
                <Row>
                    <i-Col span="24">
                        客户姓名：<span>{{accountData.user_name}}</span>
                    </i-Col>
                    <i-Col span="24">
                        申请日期：<span>{{accountData.sqrq}} </span>
                    </i-Col>
                </Row>
                 <Row>
                    <i-Col span="24">
                        售后类型：<span style="color:#F90;">{{accountData.lx}} </span>
                    </i-Col>
                    <!-- <i-Col span="12">
                        退货信息：
                        <span v-if="accountData.thsj === ''">退货时间：{{accountData.thsj}}，物流公司：{{accountData.thgs}}，物流单号：{{accountData.thdh}}</span>
                        <span v-else>无</span>
                    </i-Col> -->
                </Row>
                <Row>
                    <!-- <i-Col span="24">
                        是否清点：
                        <span v-if="accountData.qdid === 0" style="color:#093">已清点{{accountData.qdid}}</span>
                        <span v-else>未清点</span>
                    </i-Col> -->
                    <i-Col span="24">
                        不退货账：
                        <span v-if="accountData.chjg === 1" style="color:#093">已上账</span>
                        <Poptip confirm :title="`确定要上账吗 (￥${accoutTotal}) ?`" @on-ok="goAccount"  v-if="accountData.chjg === 0" >
                            <span v-if="accountData.chjg === 0" class="accountBtn" title="上账">上账</span>
                        </Poptip>
                    </i-Col>
                    <!-- <i-Col span="24">
                        需退货账：
                        <span v-if="accountData.chjg === 2">已上账</span>
                        <span v-if="accountData.chjg === 1">上账</span>
                    </i-Col> -->
                </Row>
            </div>
            <p class="closaTitle" style="margin-bottom:25px;">商品信息 >></p>
            <div class="demo-drawer-profile">
                <Table border :columns="accColumns" :data="accoutList"></Table>
                <p style="padding: 20px 60px;font-size: 18px;display: flex;justify-content: flex-end;">总计：<span style="color:red;font-size:20px;">￥{{accoutTotal}}</span></p>
            </div>
        </Drawer>
    </div>
</template>
<script>
import NProgress from 'nprogress'   // 引入进度条
import 'nprogress/nprogress.css'    // 引入进度条
import {changeday } from  '@/assets/js/tool.js'    // 转化时间为2019-10-09 这样的格式  
export default{
    data(){
        return {
            // 拒绝模态框
            refuseValue:false,
            // 确认售后完成模态框
            compleValue:false,
            // 当前行售后的id
            rowId: '',
            // 对该售后进行拒绝的理由
            reasonKey: '',
            // 搜索时客户编码
            codeValue :'',   
            //选择的售后类型
            saleType :'',        
            // 售后类型列表
            typeList:[
                {value:'1',label:"调换货物"},
                {value:'2',label:'退回次品'},
                {value:'3',label:'物流破损'},
            ],
            // 选择的审核状态
            auditState:'1',    
            // 售后状态列表
            stateList:[
                {value:'1',label:'待审核'},
                {value:'2',label:'部分通过'},
                {value:'3',label:'全部通过'},
                {value:'4',label:'全部拒绝'},
            ],
            options: {
                disabledDate (date) {
                    return date && date.valueOf() > Date.now();
                }
            },
            // 选择的时间范围
            dateRange:[],
            // 售后列表表格数据
            tableData:[],
            // 售后列表表头
            columns: [
                {
                    type: 'selection',
                    width: 75,
                    align: 'center'
                },
                {
                    title: '店名',
                    align: 'center',
                    width: 180,
                    key: 'user_name',
                },
                {
                    title: '编码',
                    align: 'center',
                    key: 'sissid',
                },
                
                {
                    title: '售后类型',
                    align: 'center',
                    key: 'typeValue',
                },
                {
                    title: '商品数量',
                    align: 'center',
                    key: 'qty',
                },
                {
                    title: '商品金额',
                    align: 'center',
                    key: 'szamt',
                },
                {
                    title: '售后原因',
                    align: 'center',
                    key: 'lx',
                },
                {
                    title: '售后进度',
                    align: 'center',
                    key: 'zt',
                },
                {
                    title: '审核情况',
                    align: 'center',
                    key: 'status',
                },
                
                    {
                    title: '申请时间',
                    align: 'center',
                    key: 'sqrq',
                },
                {
                    title: '操作',
                    key: 'action',
                    align: 'center',
                    width: 200,
                    render: (h, { row }) => {
                       return (
                            <div style="text-align: center;">
                                {(row.yt === 2 && row.sendhd === 0) && (<span class="row_btn_two"  style="margin-right:8px;" onClick={() => this.confirm(row)}>完成</span>)}
                                {(row.yt === 2 && row.sendhd !== 0) && (<span style="margin-right:8px;">已完成</span>)}
                                <span title="点击查看详情" class="row_btn" onClick={() => this.getSalesReady(row)}>详情</span>
                            </div>
                        );
                    } 
                }
            ],
            // 总数
            total: 0,
            // 每页条数
            pageSize: 20,
            // 当前页码
            currentPage: 1,
            // 表格高度
            tableHeight:600,
            // 售后详情抽屉是否显示
            detailValue: false,
            // 审核id
            handleId: '',
            // 售后详情商品表格头部
            columns1: [
                {
                    title: '条码',
                    align: 'center',
                    key: 'item_no',
                    width: 140,
                },
                {
                    title: '商品名称',
                    align: 'center',
                    key: 'item_name',
                },
                {
                    title: '商品图片',
                    align: 'center',
                    key: 'imgUrl',
                    render: (h,  {row})=> {
                    return h('img', {
                        style: {
                            //设置样式
                            width: row.imgUrl ? '80px' : '',
                            'height': row.imgUrl ? '80px' : '',
                            'border-radius': '5%',
                            border: 0,
                            cursor: 'pointer',
                            padding: '5px'
                        },
                        attrs: {
                            //设置属性
                            src: row.imgUrl ? row.imgUrl : ''
                        },
                        domProps: {
                            title: row.imgUrl ? '点击查看大图' : '',
                        },
                        on: {
                            click: () => {
                                window.open(row.imgUrl)
                            }
                        }
                    });
                }
                },
                {
                    title: '单价',
                    align: 'center',
                    key: 'base_price',
                },
                {
                    title: '数量',
                    align: 'center',
                    key: 'qty',
                },
                {
                    title: '库存',
                    align: 'center',
                    key: 'kucun',
                },
                {
                    title: '原因',
                    align: 'center',
                    key: 'reason',
                    render: (h, {row}) => {
                        let texts = row.reason;
                        if (row.reason !== null) {
                            if (row.reason.length > 12) {
                                texts = row.reason.slice(0,12) + '...';
                            } else {
                                texts = row.reason;
                            }
                        }
                        return h('div', [
                            h('Tooltip', {
                                props: {
                                    placement: 'top',
                                    transfer: true
                                }
                            }, [texts, h('span', {
                                slot: 'content',
                                style: {
                                    whiteSpace: 'normal'
                                }
                            }, row.reason)
                            ])
                        ])
                    }
                },
                {
                    title: "图片说明",
                    align: "center",
                    key: "pics",
                    render: (h, { row }) => {
                        return (
                            row.pics.map(item => {
                                return <img src={item.picsUrl} class="icon_img" title="查看大图" style="height:50px;cursor:pointer;margin:5px;" onClick={() => this.picView(item.picsUrl)}/>
                            })
                        )
                    }                                        
                },
                {
                    title: '最后出库',
                    key: 'stock',
                    align: 'center',
                    render: (h, {row}) => {
                        return h('div', [
                            h('span', {
                                style: {
                                    cursor: 'pointer'
                                },
                                class: 'refuse_icon',
                                domProps:{
                                    title: '点击获取最后出库',
                                },
                                on: {
                                    click: () => {
                                        // 得到最后出库数据
                                        this.getLastStock(row);
                                        
                                    }
                                }
                            },row.stock),
                        ]);
                    }
                },
                 {
                    title: '拒绝理由',
                    align: 'center',
                    key: 'jjreason',
                    render: (h, {row}) => {
                        return <p style="color:red;">{row.jjreason}</p>
                    }
                },
                {
                    title: '操作',
                    key: 'action',
                    align: 'center',
                    width: 180,
                    render: (h, {row}) => {
                        return (
                            <div>
                                {
                                    row.status === 0 && 
                                    <div>
                                        <span onClick={() =>this.rowClick(row,2)} title="点击对该售后审核通过" class="row_btn">通过</span>
                                        <span onClick={() =>this.rowClick(row, 0)} title="点击对该售后审核不通过" class="row_btn_two">拒绝</span>
                                    </div>
                                }
                                {
                                    row.status === 1 && 
                                    <div>
                                        <span onClick={() =>this.rowClick(row, 1)} title="点击撤销该售后" class="row_btn">撤销</span>
                                    </div>
                                }
                                {
                                    row.isreturn === 1 && 
                                    <div>
                                        <span onClick={() =>this.rowClick(row, 1)} title="点击撤销该售后" class="row_btn">撤销</span>
                                        <span>需退货</span>
                                    </div>
                                }
                                {
                                    row.isreturn === 2 && 
                                    <div>
                                        <span onClick={() =>this.rowClick(row, 1)} title="点击撤销该售后" class="row_btn">撤销</span>
                                        <span>不退货</span>
                                    </div>
                                }
                                {
                                    (row.isreturn !== 2 && row.isreturn !== 1 && row.status !== 0 && row.status !== 1) &&
                                    <div>
                                        <span onClick={() =>this.returnGoods(row, 1)} title="点击对该售后需退货操作" class="row_btn">需退货</span>
                                        <span onClick={() =>this.returnGoods(row, 2)} title="点击对该售后不退货操作" class="row_btn_two">不退货</span>
                                    </div>
                                }
                            </div>
                        )
                    }
                }
            ],
            // 退货详情商品表格数据
            goodList:[],
            // 售后详情数据
            salesObj: {},
            // 详情里的订单表头
            orderColus:[
                {
                    title: '时间',
                    align: 'center',
                    key: 'AA',
                },
                {
                    title: '订单号',
                    align: 'center',
                    key: 'NUM',
                },
                {
                    title: '货号',
                    align: 'center',
                    key: 'GDCODE',
                },
                {
                    title: '数量',
                    align: 'center',
                    key: 'QTY',
                },
                {
                    title: '单价',
                    align: 'center',
                    key: 'PRICE',
                },
                {
                    title: '小计',
                    align: 'center',
                    key: 'SRCTOTAL',
                },
                {
                    title: '活动',
                    align: 'center',
                    key: 'NOTE',
                },
            ],
            // 订单信息数据
            orderData: [],
            // 是否显示订单信息
            isOrder: false,
            // 合并售后列表的id
            mergeidStr: '',
            // 是否显示上账清单抽屉框
            isAccount:false,
            // 上账清单里的商品表头
            accColumns:[
                {
                    title: '条码',
                    align: 'center',
                    key: 'item_no',
                },
                {
                    title: '商品名',
                    align: 'center',
                    key: 'item_name',
                },
                {
                    title: '退货数',
                    align: 'center',
                    key: 'qty',
                },
                {
                    title: '清点数',
                    align: 'center',
                    key: 'uqty',
                },
                {
                    title: '可上账数',
                    align: 'center',
                    key: 'szqty',
                    render: (h, {row})=> {
                        return (
                            <input value={row.qty} onBlur={() => this.changeAccNum(row,event)} style="width: 90px;height: 30px;text-align: center;"/>
                        )
                    }
                },
                {
                    title: '单价',
                    align: 'center',
                    key: 'base_price',
                },
                {
                    title: '小计',
                    align: 'center',
                    key: 'xj',
                },
            ],
            // 上账清单里的商品表格数据
            accoutList:[],
            // 上账清单里的基本信息
            accountData:{},
            // 上账的总金额
            accoutTotal: 0,
        }
    },
    mounted() {
        setTimeout(()=> {
            // 得到浏览器内容高度
            let windowHeight = document.documentElement.clientHeight || document.body.clientHeight;
            this.tableHeight = (windowHeight- 240);
        },100)
        // 调整浏览器的时候
        $(window).on('resize', () => {
            let windowHeight = document.documentElement.clientHeight || document.body.clientHeight;
            this.tableHeight = (windowHeight - 240);
        })
    },

    watch: {
        detailValue(val) {
            if(!val) {
                // 如果抽屉关掉了，就把订单详情表格给隐藏
                this.isOrder = false;
            }
        }
    },
    created() {
        // 获取售后列表
        this.getSalesList();
    },
    methods:{
        /**
         * 订单完成操作确认
         */
        confirm(row) {
            this.rowId = row.id;
            this.compleValue = true;
        },
        /**
         * 订单完成操作请求
         */
        complete() {
            NProgress.start();
            this.$resetAjax({
                type: 'GET',
                url: '/admin/aftersale/sh_hd',
                data: { 
                    mid: this.rowId, // 当前行售后的ID

                },
                success: (res) => {
                    NProgress.done();
                    let result = JSON.parse(res).errorcode;
                    switch(result) {
                        case 0:
                            this.$Message.success({
                                content: `操作成功`,
                                duration: 3
                            });
                            this.getSalesList();
                            break;
                        case 1:
                            this.$Message.error({
                                content: `操作失败，不能重复操作'`,
                                duration: 3
                            });
                            break;
                        case 2:
                            this.$Message.error({
                                content: `操作失败，调换单不用传送到海鼎`,
                                duration: 3
                            });
                            break;
                    }
                }
            })
        },
        /**
         * 查看上传的图片
         */
        picView(url) {
            window.open(url)
        },
        /**
         * 获取售后列表
         */
        getSalesList() {
            let sdate = '';
            let edate = '';
            if(this.dateRange.length === 0 || this.dateRange[0] === '') {
                sdate = '';
                edate = '';
            } else {
                sdate = changeday(this.dateRange[0])
                edate = changeday(this.dateRange[1])
            }
            NProgress.start();
            this.$resetAjax({
                type: 'POST',
                url: '/Admin/Aftersale/list',
                data: { 
                    sdate,
                    edate,
                    hdid: this.codeValue.trim(),
                    status: this.auditState, // 1待审核 2部分通过 3 全部通过 4全部拒绝
                    type: this.saleType,//售后类型1调换，2次品,
                    page: this.currentPage  //  页码

                },
                success: (res) => {
                    NProgress.done();
                    let result = JSON.parse(res);
                    result.data.forEach(ele => {
                        switch(ele.type) {
                            case 1:
                                ele.typeValue = '调换货物';
                                break;
                            case 2:
                                ele.typeValue = '退回次品';
                                break;
                            case 3:
                                ele.typeValue = '物流破损';
                                break;
                        }
                        
                // <td><if condition="($vo.wt eq '1') AND ($vo.yt eq '2')"><span class="yellow"></span>
                // <elseif condition="($vo.shsj neq '') AND ($vo.wt neq '1')" /><span class="green">通过</span>
                // <elseif condition="($vo.wt eq '1') AND ($vo.yt neq '2')" /><span class="red">全部拒绝</span><else />未审</if></td>
                        /* if(ele.wt === '1' && ele.yt === '2') {
                            ele.speed = '部分通过';
                            return false;
                        }
                        if(ele.shsj !== '' && ele.wt !== '1') {
                            ele.speed = '通过';
                            return false;
                        }
                        if(ele.wt === '1' && ele.yt !== '2') {
                            ele.speed = '全部拒绝';
                            return false;
                        }
                        ele.speed = '未审'; */
                    });
                    this.tableData = result.data;
                    this.total = result.count;
                }
            })
        },
        /**
         * 查看详情准备工作
         */
        getSalesReady(row) {
            this.rowId = row.id;
            this.detailValue = true;
            this.getSalesDetail();
        },
        /**
         * 查看详情
         */
        getSalesDetail() {
            this.$resetAjax({
                type: 'GET',
                url: '/Admin/Aftersale/details',
                data: { 
                    mid: this.rowId,
                },
                success: (res) => {
                    let result = JSON.parse(res);
                    this.salesObj = result.info;
                    this.salesObj.szamt = result.hjamt.toFixed(2);
                    result.list.forEach(ele =>{
                        ele.imgUrl = `http://hwimg.xmvogue.com/thumb/${ele.item_no}.jpg?x-oss-process=style/440`;
                        ele.pics.forEach(item => {
                            item.picsUrl =   `http://ximiphoto.oss-cn-hangzhou.aliyuncs.com/shouhou/${item.filename}?x-oss-process=style/yuan`
                        })
                        ele.stock = '获取'; // 最后出库数据
                        ele.refuseMemo = '';
                    })
                    this.goodList = result.list;
                }
            })

        },
        /**
         * 订单详情里部分上账操作还是上账清单操作
         */
        accountBooks() {
            this.detailValue = false;
            this.isAccount = true;
            this.$resetAjax({
                type: 'GET',
                url: '/admin/aftersale/szpage',
                data: {
                    id: this.rowId,
                },
                success: (res) => {
                    let result = JSON.parse(res);
                    this.accountData = result.data.sinfo;
                    this.accountData.sztype = result.data.sztype;
                    this.accoutTotal = result.data.amt;
                    result.data.dlist.forEach(ele => {
                        ele.xj = Number(ele.qty) * Number(ele.base_price)
                    })
                    this.accoutList = result.data.dlist;
                }
            })
        },
        // 获取选择的售后类型
        typeChange(data) {
            this.currentPage = 1;
            this.getSalesList();
        },
        // 选择的审核状态
        stateChange(data) {
            this.currentPage = 1;
            this.getSalesList();
        },
        // 获取时间
        getSelectTime(data) {
            this.currentPage = 1;
            this.getSalesList();
        },
        /**
         * 根据客户编码进行搜索
         */
        codeEnter() {
            this.currentPage = 1;
            this.getSalesList();
        },
        // 换页
        changePage(index) {
            this.currentPage = index;
            this.getSalesList();
        },
        /**
         * 对售后详情里进行操作准备判断
         */
        rowClick(row,num) {
            this.handleId = row.id;
            switch(num) {
                case 2:
                    // 审核该售后通过操作
                    this.handle(2);
                    break;
                case 1:
                    // 对该售后进行撤销操作
                    this.revoke();
                    break;
                case 0:
                    // 对该售后进行拒绝操作
                    this.refuseValue = true;
                    break;
                
            }
        },
        /**
         * 售后详情里商品表格需退货、不退货操作请求
         */
        returnGoods(row,num) {
            this.handleId = row.id;
            this.$resetAjax({
                type: 'POST',
                url: '/Admin/Aftersale/isreturn',
                data: {
                    id: this.handleId,
                    lx: num,   // 需退货1  不退货2
                },
                success: (res) => {
                    let result = JSON.parse(res);
                    if(result.errorcode === 0) {
                        this.$Message.info("提交成功");
                    }
                    this.getSalesDetail();
                }
            })
        },
        /**
         * 撤消请求
         */
        revoke() {
            this.$resetAjax({
                type: 'GET',
                url: '/Admin/Aftersale/cancel',
                data: {
                    id: this.handleId,
                    reason: this.reasonKey,
                },
                success: (res) => {
                    this.$Message.info({
                        content: "撤销该售后操作成功",
                        duration: 3,
                    });
                    this.getSalesDetail();
                }
            })
        },
        /**
         * 通过或拒绝售后
         */
        handle(num) {
            let data = {};
            if(num === 1) {
                data = {
                    id: this.handleId,
                    lx: num,
                    reason: this.reasonKey,
                }
            } else {
                data = {
                    id: this.handleId,
                    lx: num,
                }
            }
            this.$resetAjax({
                type: 'POST',
                url: '/Admin/Aftersale/audit',
                data,
                success: (res) => {
                    let result = JSON.parse(res);
                    if(result.errorcode === 0) {
                        if(num === 2) {
                            this.$Message.info("您已批准当前售后通过");
                        } else {
                            this.$Message.info("您已拒绝当前售后通过")
                        }
                        this.getSalesDetail();
                    }
                }
            })
        },
        /**
         * 得到最后出库数据
         */
        getLastStock(row) {
            this.$resetAjax({
                type: 'GET',
                url: '/Admin/Aftersale/get_cktime',
                data: {
                    sissid: this.salesObj.sissid,
                    item_no: row.item_no
                },
                success: (res) => {
                    if(res !== '无信息') {
                        row.stock = res;
                    } else {
                        row.stock = '暂无信息'
                    }
                    
                }
            })
        },
        /**
         * 拒绝提交准备
         */
        refuseQuery() {
            this.refuseValue = false;
            this.handle(1)
        },
        /**
         * 查看商品条码
         */
        getOrderList(row) {
            NProgress.start(); // 进度条结束
            this.$resetAjax({
                type: 'GET',
                url: '/Admin/Aftersale/order_history',
                data: {
                    item_no: row.item_no,
                    sissid: this.salesObj.sissid
                },
                success: (res) => {
                    NProgress.done(); // 进度条结束
                    this.isOrder = true;
                    let result = JSON.parse(res);
                    this.orderData = result.list;
                }
            })
        },
        /**
         * 合并勾选时得到数据
         */
        changeSelection(selection) {
            this.mergeidStr = (selection.map(ele => ele.id)).join(',')
        },
        /**
         * 合并售后
         */
        mergeSale() {
            if(this.mergeidStr.length === 0) {
                this.$Message.warning('请先勾选您要合并的售后单子');
                return false;
            }
            this.$resetAjax({
                type: 'GET',
                url: '/Admin/Aftersale/hebing',
                data: {
                    listr: this.mergeidStr, // 合并售后列表的id
                },
                success: (res) => {
                    let result = JSON.parse(res);
                    if(result.errorcode === 0) {
                        this.$Message.warning('合并成功');
                    } else{
                        this.$Message.warning(result.msg);
                    }
                }
            })
        },
        /**
         * 关闭抽屉
         */
        closeDrawer() {
            this.getSalesList();
        },
        /**
         * 上账清单里的上账操作
         */
        goAccount() {
            this.$resetAjax({
                type: 'GET',
                url: '/admin/aftersale/shsz',
                data: {
                    id: this.accountData.id,
                    sztype: this.accountData.sztype,
                },
                success: (res) => {
                    let result = JSON.parse(res);
                    if(result.errorcode === 0) {
                        this.$Message.success({
                            content: `上账操作成功`,
                            duration: 3,
                        })
                        this.accountBooks();
                    } else {
                        this.$Message.warning({
                            content: `抱歉，${result.data}`,
                            duration: 3,
                        })
                    }
                }
            })
        },
        /**
         * 修改上账清单里表格中的商品可上账数量
         */
        changeAccNum(row,event) {
            var num = event.target.value;
            if(num <= 0) {
                this.$Message.warning({
                    content: '抱歉，上账数量不能少于0',
                    duration: 3,
                })
                event.target.value = row.qty;
                return false;
            }
            if(num > row.qty) {
                this.$Message.warning({
                    content: '抱歉，上账数量不能大于商品数量',
                    duration: 3,
                })
                event.target.value = row.qty;
                return false;
            }
            this.$resetAjax({
                type: 'GET',
                url: '/admin/aftersale/update_szqty',
                data: {
                    id: this.accountData.id,// 当前上账的售后id
                    item_no: row.item_no,   // 上账的商品条码
                    szqty: num              // 上账数量
                },
                success: (res) => {
                    let result = JSON.parse(res);
                    if(result.rs === 'ok') {
                        this.$Message.success({
                            content: `修改上账数量成功`,
                            duration: 3,
                        })
                        row.xj = Number(num) * Number(row.base_price);
                        this.accoutTotal = result.amt;
                    } else {
                        this.$Message.warning({
                            content: `抱歉，${res.rs}`,
                            duration: 3,
                        })
                    }
                }
            })
        },
    }
}
</script>