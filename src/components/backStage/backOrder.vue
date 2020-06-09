<template>
    <div class="backOrder">
        <div class="top">
            <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
                <FormItem label="类型：" prop="type">
                    <Select v-model="formValidate.type"  @on-change="changeType" style="width:120px">
                        <Option v-for="item in statusList" :value="item.id" :key="item.id">{{ item.label }}</Option>
                    </Select>
                </FormItem>
                <FormItem label="订单号：" prop="sheet_no" style="margin-left:10px;">
                    <Input v-model="formValidate.sheet_no" placeholder="订单号..." style="width:165px" @on-enter="enterInput" @on-blur="enterInput"/>
                </FormItem>
                <FormItem label="编码：" prop="hdidKey">
                    <Input v-model="formValidate.hdidKey" placeholder="门店编码..." style="width:165px" @on-enter="enterInput" @on-blur="enterInput"/>
                </FormItem>
                <FormItem label="名称：" prop="nameKey">
                    <Input v-model="formValidate.nameKey" placeholder="门店名称.." style="width:165px" @on-enter="enterInput" @on-blur="enterInput" />
                </FormItem>
                <FormItem label="客服：" prop="kefu">
                    <Input v-model="formValidate.kefu" placeholder="客服.." style="width:165px" @on-enter="enterInput" @on-blur="enterInput" />
                </FormItem>
                <FormItem label="日期：" prop="dateRange">
                    <DatePicker :value="formValidate.dateRange" :options="options"  format="yyyy-MM-dd HH:mm:ss" type="daterange" placement="bottom-end" placeholder="Select date" style="width: 310px" @on-change="changeDateRange"></DatePicker>
                </FormItem>
               <!--  <FormItem>
                    <p  @click="handleSubmit('formValidate')" class="lookup">查询</p>
                </FormItem> -->
            </Form>
        </div>
        <div class="table">
            <div class="top_left" v-show="total !== 0">
                <p class="lookup" @click="beforeHandle(1)" title="多个订单导出">导出</p>
                <p class="lookup" @click="beforeHandle(3)" title="多个订单上传海鼎">上传</p>
                <p class="lookup" @click="beforeHandle(5)" title="多个订单生成购物车商品">生成</p>
                <p class="lookup" @click="beforeHandle(4)" title="复制订单到门店中">复制</p>
                <p class="lookup" @click="beforeHandle(6)" title="多个订单设置新单">新单</p>
                <p class="lookup" @click="beforeHandle(7)" title="多个订单设置补单">补单</p>
                <p class="lookup" @click="beforeHandle(2)" title="多个订单删除">删除</p>
            </div>
            <Table border :height="tableHeight"  :columns="columns" :data="orderData" :row-class-name="rowClassName" @on-selection-change="selectChange"></Table>  
        </div>
        <div class="pageContanier">
            <Page :total="total" :page-size="pageSize" @on-change="changePage" :current="currentPage" show-elevator show-total></Page>
        </div>
        <!-- 订单详情框 -->
        <Drawer :closable="true" width="1500" v-model="value4" class="detailClos" :title="i18n.pageTitle" :draggable ="true">
            <p class="closaTitle">{{i18n.detailName}}</p>
            <p class="closastate">{{detailsObj.order_status}}</p>
            <div class="demo-drawer-profile">
                <Row>
                    <i-Col span="12">
                        {{i18n.receiving}}：<span> {{detailsObj.buyer}}</span>
                    </i-Col>
                    <i-Col span="12">
                        {{i18n.time}}：<span> {{detailsObj.oper_date}}</span>
                    </i-Col>
                </Row>
                <Row>
                    <i-Col span="12">
                        {{i18n.orderNum}}：<span> {{detailsObj.sheet_no}}</span>
                        
                    </i-Col>
                    <i-Col span="12">
                       {{i18n.Amount}}：<span class="col_price"> {{detailsObj.yhh_amt}}</span>
                    </i-Col>
                </Row>
            </div>
            <Divider />
            <p class="closaTitle">{{i18n.commodity}}</p>
            <div class="demo-drawer-profile">
                <Row>
                    <i-Col span="24" style="margin:15px 0;">
                        <a @click="loadCer" class="loadCer">证书下载</a>
                    </i-Col>
                </Row>
                <Row>
                    <i-Col span="24" class="item_list">
                        <Table border :columns="detailColumns" :data="detailsList" @on-selection-change="selectItem" style="width:100%;"></Table>  
                        <!-- <img v-lazy="item.imgUrl" alt="" class="col_img" @click="lookOrderImg(item.imgUrl)" :title="i18n.lookImg">
                        <div class="item_describe">
                            <span title="商品名" style="white-space: pre-wrap;word-break: break-word;width: 280px;text-align: center;">{{item.item_name}}</span>
                            <span>{{item.item_no}}</span>
                            <span>{{item.order_qty}} × {{item.base_price}}</span>
                            <span>{{item.yh_sub}}</span>
                        </div> -->
                    </i-Col>
                </Row>
            </div>
        </Drawer>
        <!-- 生成的model商品数量和条码 -->
        <Modal v-model="model" :title="exportTitle" class="created_retrievePage">
            <Input v-model="createValue" type="textarea" :autosize="true" placeholder="Enter something..." />
        </Modal>
        <!-- 往门店中导入订单要选择门店、输入订单号 -->
        <Modal v-model="orderModel" title="生成前信息填写" class="orderModel_retrievePage" style="width:500px;">
            <div class="input_item">
                <span>门店编码：</span>
                <Input  v-model="storeHdid" placeholder="请输入门店编码..." style="width: 400px" />
            </div>
            <div class="input_item">
                <span>订单编号：</span>
                <Input v-model="rowEnter" :autosize="true" disabled type="textarea" placeholder="一行一个订单号..." style="width: 400px" />
            </div>
            <div class="demo-drawer-footer">
                <Button style="margin-right: 8px" @click="orderModel = false">取消</Button>
                <Button type="primary" @click="asyncOK">确认</Button>
            </div>
        </Modal>
        <!-- 多个订单上传导入海鼎 -->
        <Modal v-model="isViewUp" title="导入结果" class="orderModel_retrievePage">
            <div v-for="(item,index) in canData" :key="index" style="display: flex;justify-content: space-between;">
                <p> {{item.code}}</p>
                <span>{{item.tips}}</span>
            </div>
            <p style="font-size: 16px;margin: 20px 0;">
                温馨提示：一共有<span style="color:red;"> {{canData.length}} </span>条订单上传海鼎成功，<span style="color:red;"> {{nocanData.length}} </span>条订单上传海鼎失败。
            </p>
        </Modal>
    </div>
</template>

<script>
import {changeday } from  '@/assets/js/tool.js'    // 转化时间为2019-10-09 这样的格式  
import {changeTime} from  '@/assets/js/tool.js'                    // 转化时间为2019-10-09 00:00:00这样的格式  
import{getLastYearYestdy} from  '@/assets/js/tool.js'    
import {getNumBox} from '@/assets/js/tool.js'  
import NProgress from 'nprogress'   // 引入进度条
import 'nprogress/nprogress.css'    // 引入进度条
export default {
    data() {
        return {
            // 订单生成商品数量弹窗框标题
            exportTitle:'',
            formValidate: {
                // 订单类型
                type: '01',
                // 海鼎编码查询
                hdidKey: '',
                // 订单号
                sheet_no: '',
                // 门店名称
                nameKey: '',
                // 日期选择
                dateRange: [], 
                // 起始日期
                stime: getLastYearYestdy(new Date()) ,
                etime: changeTime(new Date()),
                kefu: '',
            },
            // 是否显示商品数量导出框
            model: false,
            // 导出的订单值
            createValue: '',
            // 当前行的订单号
            rowNum: '',
            // 当前行是新单还是补单
            rowNew : 2,
            // 当前行的订单号数组
            rowNumArr: [],
            ruleValidate: {
                stime: [
                    { required: true, message: '起始时间不能为空。', trigger: 'blur', pattern: /.+/ }
                ],
                etime: [
                    { required: true, message: '结束时间不能为空。', trigger: 'blur', pattern: /.+/ }
                ],
                dateRange: [
                    {
                        type: 'array', 
                        required: true, 
                        fields: {
                            0: {required: true, message: '时间不能为空', trigger: 'change', pattern: /.+/},
                            1: {required: true, message: '时间不能为空', trigger: 'change', pattern: /.+/},
                        } 
                    },
                ]
            },
            // 订单类型数据
            statusList: [
                {
                    label: '已传输',
                    id: '02',
                },
                {
                    label: '待传输',
                    id: '01',
                },
            ],
            details: this.$t('backOrderPage.details'),
            del: this.$t('backOrderPage.del'),
            deleteTips: this.$t('backOrderPage.deleteTips'),
            // 未确定订单
            undetermined: this.$t('backOrderPage.undetermined'),
            // 单个订单删除成功提示
            delItemSuccess:this.$t('backOrderPage.delItemSuccess'), 
            // 单个订单删除失败提示
            delItemError: this.$t('backOrderPage.delItemError'),
            // 商品总数
            total: 0,
            // 每页条数
            pageSize: 20,
             // 当前页码
            currentPage: 1,
            // 表格高度
            tableHeight:600,
            // 表格数据
            orderData: [],
            // 订单总价格
            totalMoney: 0,
            // 订单列表勾选
            selectData: [],
            // 表头
            columns: [
                {
                    type: 'selection',
                    width: 100,
                    align: 'center'
                },
                 {
                    title: '门店编码',
                    align: 'center',
                    key: 'STORECODE',
                },
                {
                    title: '门店名称',
                    align: 'center',
                    key: 'NAME',
                    width: 180
                },
                {
                    title:'订单号',
                    align: 'center',
                    key: 'NUM',
                    width: 220
                },
                {
                    title: `状态`,
                    align: 'center',
                    key: 'status',
                },
                {
                    title: '',
                    align: 'center',
                    key: 'sheet_amt',
                    width: 200,
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
                    title: '下单时间',
                    align: 'center',
                    key: 'oper_date',
                    width: 180
                },
                /* {
                    title: '备注',
                    align: 'center',
                    key: 'memo',
                    render: (h, {row}) => {
                        let texts = row.memo
                        if (row.memo != null) {
                            if (row.memo.length > 9) {
                                texts = row.memo.slice(0, 9) + '...' // 进行数字截取
                            } else {
                                texts = row.memo
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
                        },row.memo)
                        ])
                        ])
                    }
                }, */
                {
                    title: '客服',
                    align: 'center',
                    key: 'kefu',
                },
                {
                    title: '操作',
                    key: 'action',
                    width: 280,
                    align: 'center',
                    render: (h, {row}) => {
                        let iclass = '';
                        let ititle = '';
                        if(this.formValidate.type === '01' && row.isnew === 0) {
                            iclass = 'iconfont icon-xin newIcon';
                            ititle = '设置补单'
                        } else if(this.formValidate.type === '01' && row.isnew === 1) {
                            iclass = 'iconfont  icon-serviceposunbuji newIcon';
                            ititle = '设置新单'
                        } else {
                            iclass = '';
                            ititle = '';
                        }
                        return h('div', [
                             h('i', {
                                class: iclass,
                                domProps:{
                                    title: ititle,
                                },
                                on: {
                                    click: () => {
                                        this.rowNum = row.NUM;
                                        this.rowNew = row.isnew ? 0 : 1;
                                        this.setOrder(row)
                                    }
                                }
                            }),
                             h('Icon', {
                                props: {
                                    type: 'md-archive',
                                    size: '25',
                                    color: '#218da0'
                                },
                                class: 'look',
                                domProps:{
                                    title: '生成商品和数量',
                                },
                                on: {
                                    click: () => {
                                        this.rowNumArr = [];
                                        this.rowNumArr.push(row.NUM)
                                        this.exportOrder();
                                    }
                                }
                            }),
                            h('Icon', {
                                props: {
                                    type: row.order_status === 0 ? 'ios-cloud-upload' : '',
                                    size: '25',
                                    color: '#218da0'
                                },
                                class: 'look',
                                domProps:{
                                    title: '上传到海鼎',
                                },
                                on: {
                                    click: () => {
                                        this.rowNum = row.NUM;
                                        this.upLoadHdid(row.NUM,'one');
                                    }
                                }
                            }),
                            h('Icon', {
                                props: {
                                    type: 'ios-list-box',
                                    size: '25',
                                    color: '#218da0'
                                },
                                class: 'look',
                                domProps:{
                                    title: this.details,
                                },
                                on: {
                                    click: () => {
                                        let index = row._index;
                                        let trNodes = $('.ivu-table-row td');
                                        trNodes.removeClass('td-click');
                                        $('.ivu-table-row').eq(index).find('td').addClass('td-click');
                                        this.rowNum = row.NUM;
                                        this.getDetailData()
                                        // this.$router.push({path:'/backStage/backOrderDetail', query: {type: this.type, sn: row.NUM}});
                                    }
                                }
                            }),
                            h('span', [
                                h('Poptip', {
                                    class: 'handle',
                                    props: {
                                        confirm: true,
                                        transfer: true,
                                        placement: 'top',
                                        title: this.deleteTips,
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
                                            this.rowNum = row.NUM;
                                            this.deleteCart()
                                        },
                                        'on-cancel': ()=>{
                                            // 取消删除
                                        }
                                    }
                                },
                                [
                                    h('Icon',{
                                        props: {
                                            type: row.order_status === 0 ? 'ios-trash' : '',
                                            size: '26',
                                            color: '#333'
                                        },
                                        class: 'delete'
                                    })
                                ])
                            ]),
                        ]);
                    }
                }
            ],
            value4: false,
            // 订单详情
            detailsObj: {
                buyer: '', // 账户名
            },
            // 订单详情商品信息
            detailsList: [],
            options: {
                disabledDate (date) {
                    return date && date.valueOf() > Date.now();
                }
            },
            // 证书勾选数据
            cerLoadData: [],
            // 订单导入的门店编码
            storeHdid: '',
            // 订单导入到门店中弹框
            orderModel:false,
            // 订单导入到门店中的订单单号
            rowEnter: '',
            // 要上传到海鼎的数据
            upData: [],
            // 要上传海鼎成功的数据
            canData: [],
            // 上传海鼎失败的数据
            nocanData: [],
            // 是否显示导入海鼎订单编辑框
            isViewUp: false,
            // 导出时选择哪种语言
            exportLang: 0,

            
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
    computed: {
        i18n() {
            return this.$t('backOrderPage')
        },
        detailColumns() {
            let arrColumns =  [
                {
                    type: 'selection',
                    width: 60,
                    align: 'center'
                },
                /* {
                    title: '订单号',
                    align: 'center',
                    key: 'sheet_no',
                    width: 200,
                }, */
                {
                    title: '编码',
                    align: 'center',
                    key: 'item_no',
                    width:160,
                },
                {
                    title: '名称',
                    align: 'center',
                    key: 'item_name',
                },
                {
                    title: '商品图片',
                    align: 'center',
                    key: 'imgUrl',
                    width: '120',
                    render: (h, { row }) => {
                        return (<img onClick={() => this.lookOrderImg(row,1)} src={`http://img.xmvogue.com/thumb/${row.item_no}.jpg?x-oss-process=style/80`} title="点击查看图片大图" style="width:80px;height:80px;margin-top: 8px;cursor:pointer;"/>);
                    } 
                },
                {
                    title: '证书',
                    align: 'center',
                    key: 'credential',
                    width: 200,
                    render: (h, { row }) => {
                            /* return (
                                // 错误写法
                                <img v-for={item in row.icon} src={item} style="width:50px;height:50px" />
                            ); */
                            if(row.credential.length === 0) {
                                return (<p>无</p>)
                            }
                            return (
                                row.credential.map(item => {
                                    return <img src={item.icon} class="icon_img" style="height:50px;" title="点击查看证书大图" onClick={() => this.lookOrderImg(item,2)}/>
                                })
                            );
                        }
                    ,
                },
                {
                    title: '单价',
                    align: 'center',
                    key: 'base_price',
                },
                {
                    title: '小计',
                    align: 'center',
                    key: 'yh_sub',
                },
                /* {
                    title: '备注',
                    align: 'center',
                    key: 'memo',
                    render: (h, {row}) => {
                        let texts = row.memo
                        if (row.memo != null) {
                            if (row.memo.length > 9) {
                                texts = row.memo.slice(0, 9) + '...' // 进行数字截取
                            } else {
                                texts = row.memo
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
                        },row.memo)
                        ])
                        ])
                    }
                }, */
            ]
            let item =  {
                title: '数量',
                align: 'center',
                key: 'order_qty',
            };
            let item2 =  {
                title: '数量',
                key: 'order_qty',
                align: 'center',
                render: (h, {row}) => {
                    // return h('div', [
                    //     h('InputNumber', {
                    //         props: {
                    //             size: 'small',
                    //             value: row.order_qty,
                    //             min: 0,
                    //             step: row.purchase_spec,
                    //         },
                    //         style: {
                    //             'text-align': 'center'
                    //         },
                    //         on: {
                    //             'on-change': (e) => {// eslint-disable-line
                    //             console.log(e)
                    //                 row.order_qty = e;
                    //                 this.changeNum(row);
                    //             },
                    //         },
                    //     }),
                    // ]);
                    return (
                       <input onBlur={() => this.changeNum(row,event)} value={row.order_qty} style="text-align: center;width: 100px; height: 30px;" class="inputRow" />
                    )
                }
            };
            if(this.formValidate.type === '02') {
                arrColumns.splice(5,0,item)
            } else {
                arrColumns.splice(5,0,item2)
            }
            return arrColumns
        }
        
    },
    created() {
        // 得到初始时间
        this.formValidate.dateRange = [this.formValidate.stime, this.formValidate.etime];
        // 得到已确定订单列表
        this.getOrderList();
    },
    watch: {
        isViewUp(val,oldVal) {
            if(!val) {
                this.nocanData = [];
                this.upData = [];
                this.canData = []; 
                this.rowNum = '';
            }
        },
        orderModel(val,oldVal) {
            if(!val) {
                this.rowEnter = '';
                this.storeHdid = '';
            }
        }
    },
    methods: {
        /**
         * 多个订单导出和删除判断有没有勾选订单
         */
        beforeHandle(data) {
            if(this.selectData.length === 0) {
                switch(data) {
                    case 1:
                        this.$Message.warning({
                            content: '多项订单导出前，请先勾选订单!',
                            duration: 4
                        });
                        break;
                    case 2:
                        this.$Message.warning({
                            content: '多项订单删除前，请先勾选订单!',
                            duration: 4
                        });
                        break;
                    case 3:
                        this.$Message.warning({
                            content: '多项订单上传海鼎前，请先勾选订单!',
                            duration: 4
                        });
                        break;
                    case 4:
                        this.$Message.warning({
                            content: '往门店导进订单前，请先勾选订单!',
                            duration: 4
                        });
                        break;
                    case 5:
                        this.$Message.warning({
                            content: '多个订单生成购物车商品和数量前，请先勾选订单!',
                            duration: 4
                        });
                        break;
                    case 6:
                        this.$Message.warning({
                            content: '设置多个订单为新单前，请先勾选订单!',
                            duration: 4
                        });
                        break;
                    case 7:
                        this.$Message.warning({
                            content: '设置多个订单为补单前，请先勾选订单!',
                            duration: 4
                        });
                        break;
                }
                return false;
            }
            this.rowNumArr = this.selectData.map(ele => ele.NUM);
            this.rowNum = this.rowNumArr.join(',');
            switch(data) {
                case 1:
                    this.confirm();
                    break;
                case 2:
                    this.deleteCart();
                    break;
                case 3:
                    this.moreHaiding();
                    break;
                case 4:
                // 根据订单号往门店中导进订单中的商品数量
                    this.readOrder();
                    break;
                case 5:
                // 根据订单生成购物车商品和数量
                    this.exportOrder();
                    break;
                case 6:
                // 设置新单
                    this.setNewOrder();
                    break;
                 case 7:
                // 设置补单
                    this.setSupplement();
                    break;
            }
        },
        confirm () {
            this.$Modal.confirm({
                title: '温馨提示',
                content: '<p>请选择订单导出语言</p>',
                okText: '中文',
                cancelText: '英文',
                onOk: () => {
                    this.exportLang = 0;
                    this.exportmore();
                },
                onCancel: () => {
                    this.exportLang = 1;
                    this.exportmore();
                }
            });
        },
        /**
         * 多个订单设置新单
         */
        setNewOrder() {
            this.rowNew = 0;
            this.setOrder();
        },
        /**
         * 多个订单设置补单
         */
        setSupplement() {
            this.rowNew = 1;
            this.setOrder();
        },
        /**
         * 勾选订单上传到海鼎
         */
        moreHaiding() {
            var arr = this.selectData.map(ele => ele.NUM);
            // 要导入的海鼎的多个订单数据
            this.upData = arr;
            arr.forEach(ele => {
                this.upLoadHdid(ele,'more')
            })
        },
        /**
         * 把订单导进门店里去准备工作
         */
        readOrder() {
            this.orderModel = true;
            this.rowEnter = this.selectData.map(ele => ele.NUM).join('\n');
        },
        /**
         * 把订单导进门店里去请求
         */
        asyncOK() {
            if(this.storeHdid.length === 0) {
                this.$Message.error({
                    content: '门店编码不能为空。',
                    duration: 4
                });
                return false;
            }
            NProgress.start()
            this.$resetAjax({
                type: 'POST',
                url: '/admin/dingdan/copy_order',
                data: {
                    hdid: this.storeHdid, // 门店编码
                    orderList: this.rowEnter.split('\n').join(',')  // 订单号，用逗号隔开的字符口串
                },
                success: (res) => {
                    NProgress.done()
                    this.orderModel = false;    
                    let result = JSON.parse(res);
                    if(result.errorcode === 0) {
                        this.$Message.success({
                            content: '订单导入门店操作成功。',
                            duration: 4
                        });
                    }
                    this.rowEnter = '';
                    this.formValidate.etime = '';
                    this.formValidate.stime = '';
                    this.getOrderList();
                }
            })
        },
        /**
         * 表格勾选
         */
        selectChange(selection) {
            this.selectData = selection;
        },
        /**
         * 多个订单勾选导出
         */
        exportmore() {
            location.href = `http://order.xmvogue.com/word/public/index.php?s=/admin/dingdan/download_order&order=${this.rowNum}&lang=${this.exportLang}`;
        },
        /**
         *  订单导出生成购物车商品数量
         */
        exportOrder() {
            NProgress.start(); // 进度条结束
            this.exportTitle = `订单生成的商品和数量`
            this.$resetAjax({
                type: 'POST',
                url: '/admin/dingdan/getOrderNum',
                data: {
                    sn: this.rowNumArr,  // 订单数组
                },
                success: (res) => {
                    NProgress.done(); // 进度条结束
                    this.model = true;
                    let result = JSON.parse(res);
                    var arr = [];
                    result.data.forEach(ele => {
                        arr.push(`${ele.item_no},${ele.order_qty}`)
                    })
                    this.createValue = arr.join('\n');
                },
            })
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
            this.detailsList.forEach(ele => {
                // 说明有商品有证书
                if(!ele._disabled) {  
                    flag = true;
                    return false;
                }
            })
            if(!flag) {
                //  console.log('说明无证书')
                this.$Message.error({
                    content: '抱歉，所选择的商品无证书',
                    duration: 3
                });
                return false;
            } 
            if(!this.cerLoadData.length) {
                // 未勾选商品证书
                this.$Message.error({
                    content: '证书下载前请先进行勾选',
                    duration: 3
                });
                return false;
            }
            let cerStr = this.cerLoadData.join(',');
            location.href = `http://order.xmvogue.com/word/public/index.php?s=/admin/dingdan/download&gid=${cerStr}`
        },
        /**
         * 给表格补单新单添加背景色区别开
         */
        rowClassName (row, index) {
            if (row.isnew === 1) {
                return 'demo-table-info-row';
            } 
        },
        /**
         * 查询判断必填字段
         */
        handleSubmit(formValidate) {
            this.$refs.formValidate.validate((valid) => {
                if (valid) {
                    // 对当前选择进行判断
                    this.isSearchGet();
                }
            })
        },
        /**
         * 订单详情中修改商品数量
         */
        changeNum(row,event) {
            if(event.target.value % row.purchase_spec !== 0) {
                this.$Message.warning({
                    content: '修改的数量要为规格的倍数',
                    duration: 3,
                })
                return false;
            }
            this.$resetAjax({
                type: 'POST',
                url: `admin/dingdan/change_order`,
                data: {
                    flow_id:row.flow_id,
                    num: event.target.value
                },
                success: (res) => {
                    NProgress.done();
                    let result = JSON.parse(res);
                    if(result.errorcode === 0) {
                        this.$Message.success({
                            content: '棒棒哒，修改商品数量成功！',
                            duration: 2
                        });
                    } else {
                        this.$Message.error({
                            content: result.data,
                            duration: 3
                        });
                    }
                    this.getDetailData();
                },
                error: (res) => {
                }
            })
        },
        /**
         * 判断是查询状态还是列表查询状态
         */
        isSearchGet() {
            this.formValidate.stime = changeTime(this.formValidate.dateRange[0]);
            this.formValidate.etime = changeTime(this.formValidate.dateRange[1]);
            this.currentPage = 1;
            this.getOrderList();   // 列表状态
        },
        /**
         * 更改订单状态
         */
        changeType() {
            this.currentPage = 1;
            this.getOrderList();
        },
        enterInput() {
            this.currentPage = 1;
            this.getOrderList();
        },
        /**
         * 订单列表
         */
        getOrderList() {
            NProgress.start();  // 进度条开始
            this.$resetAjax({
                type: 'POST',
                url: '/Admin/Dingdan/index',
                data: {
                    page: this.currentPage,  // 页码
                    type: this.formValidate.type, // 订单类型
                    etime: this.formValidate.etime, // 结束时间
                    stime: this.formValidate.stime, // 开始时间
                    hdid: this.formValidate.hdidKey.trim(),  // 编码
                    name: this.formValidate.nameKey.trim(), // 名称
                    kefu: this.formValidate.kefu.trim(),
                    sheet_no: this.formValidate.sheet_no.trim(), //订单号
                },
                success: (res) => {
                    NProgress.done(); // 进度条结束
                    let result = JSON.parse(res);
                    let list = result.list;
                    list.forEach(ele => {
                        if(this.formValidate.type === '02') {
                            ele.status = ele.order_status;
                        } else {
                            ele.status = '待传输';

                        }
                        ele.oper_date = ele.FILDATE;
                        ele.kefu = ele.kefu ? ele.kefu : '无'
                    });
                    // 订单总价格
                    this.totalMoney = getNumBox(list.map(ele => Number(ele.sheet_amt))).toFixed(2);
                    this.orderData = list;
                    this.total = Number(result.other.totalPage);
                },
            })
        },
        /**
         * 设置补单、设置新单
         */
        setOrder() {
            NProgress.start();
            this.$resetAjax({
                type: 'GET',
                url: `/admin/dingdan/setnew`,
                data: {
                    sn: this.rowNum,  // 订单号
                    val: this.rowNew
                },
                success: (res) => {
                    NProgress.done();
                    let result = JSON.parse(res);
                    if(result.errorcode === 0) {
                        this.$Message.success({
                            content: this.rowNew ? '设置补单成功' : '设置新单成功',
                            duration: 3
                        });
                        this.selectData = [];
                        this.rowNum = '';
                        this.getOrderList();
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
         * 上传数据到海鼎
         */
        upLoadHdid(num,info) {
            NProgress.start();
            this.$resetAjax({
                type: 'GET',
                url: `admin/Transhd/transorder&no=${num}`,
                success: (res) => {
                    NProgress.done();
                    // 说明是单个订单数据导入海鼎
                    if(info === 'one') {
                        switch(res) {
                            case 'ok':
                                this.$Message.success({
                                    content: '上传海鼎成功',
                                    duration: 2
                                });
                                this.getOrderList();
                                break;
                            case -1005:
                                // -1005说明订单里有商品未调拨到国际仓
                                this.$Message.error({
                                    content: '订单里有商品未调拨到国际仓，上传海鼎失败。',
                                    duration: 3
                                });
                                break;
                             case -1007:
                                // -1007订单不允许重复提交
                                this.$Message.error({
                                    content: '订单不允许重复提交，上传海鼎失败。',
                                    duration: 3
                                });
                                break;
                            case -1011:
                                // -1007订单不允许重复提交
                                this.$Message.error({
                                    content: '读取库存失败，上传海鼎失败。',
                                    duration: 3
                                });
                                break;
                             case -4002:
                                // -1007订单不允许重复提交
                                this.$Message.error({
                                    content: '临时明细表中没有数据，无法接收，上传海鼎失败。',
                                    duration: 3
                                });
                                break;
                            case -1006:
                                // -1006 订单商品数量价格有误
                                this.$Message.error({
                                    content: '订单中商品数量价格不允许为负值，上传海鼎失败。',
                                    duration: 3
                                });
                                break;
                        }
                        return false;
                    }
                    // 说明是多个订单数据导入到海鼎里
                    switch(res) {
                        case 'ok':
                            this.canData.push({
                                code: num,
                                tips: '上传海鼎成功'
                            })
                            break;
                        case -1005:
                            this.nocanData.push({
                                code: num,
                                tips: '订单里有商品未调拨到国际仓，上传海鼎失败'
                            })
                            break;
                        case -1007:
                            this.nocanData.push({
                                code: num,
                                tips: '订单不允许重复提交，上传海鼎失败'
                            })
                            break;
                        case -1011:
                            this.nocanData.push({
                                code: num,
                                tips: '读取库存失败，上传海鼎失败'
                            })
                            break;
                        case -4002:
                                // -1007订单不允许重复提交
                                this.nocanData.push({
                                    code: num,
                                    tips: '临时明细表中没有数据，无法接收，上传海鼎失败'
                                })
                            break;
                        case -1006:
                                // -1006 订单商品数量价格有误
                                this.nocanData.push({
                                    code: num,
                                    tips: '订单中商品数量价格不允许为负值，上传海鼎失败'
                                })
                                break;
                    } 
                    if(this.canData.length + this.nocanData.length === this.upData.length) {
                        this.isViewUp = true;
                        this.getOrderList();
                    }
                },
            })
        },
        /**
         * 删除订单
         */
        deleteCart() {
            this.$resetAjax({
                type: 'POST',
                url: `/Admin/Dingdan/del`,
                data: {
                   NUM: this.rowNum,
                },
                success: (res) => {
                    let result = JSON.parse(res).res;
                    if(result === 'ok') {
                        this.$Message.success({
                            content: this.delItemSuccess,
                            duration: 2
                        });
                        this.rowNum = '';
                        this.selectData = [];
                        this.getOrderList();
                    } else{
                        this.$Message.error({
                            content: this.delItemError,
                            duration: 2
                        });
                    }
                },
            })
        },
        /**
         * 得到订单详情数据
         */
        getDetailData() {
            NProgress.start(); // 进度条结束
            this.$resetAjax({
                type: 'POST',
                url: '/Admin/Dingdan/orderView',
                data: {
                    sn: this.rowNum,
                    lang: 1,
                    type: this.formValidate.type
                },
                success: (res) => {
                    NProgress.done(); // 进度条结束
                    this.value4 = true;
                    let result = JSON.parse(res);
                    let info = result.info;
                    this.detailsObj.buyer = info.buyer;
                    this.detailsObj.hdid = info.hdid;
                    this.detailsObj.oper_date = info.oper_date;
                    this.detailsObj.sheet_no = info.sheet_no;
                    this.detailsObj.order_status = info.order_status ===  0 ? '未传输' : info.order_status;
                    this.detailsObj.yhh_amt = info.yhh_amt;
                    result.list.forEach(ele => {
                        ele.imgUrl = `http://img.xmvogue.com/thumb/${ele.item_no}.jpg?x-oss-process=style/800`;
                         // 如果有证书或报告返回值就可以进行勾选下载证书
                        ele._disabled = ele.credential.length ? false : true;
                    })
                    this.detailsList = result.list;
                },
            })
        },
        /**
         * 查看商品图片
         */
        lookOrderImg(row,data) {
            if(data === 1) {
                window.open(`http://img.xmvogue.com/thumb/${row.item_no}.jpg?x-oss-process=style/800`);
            } else {
                window.open(row.icon);
            }
        },
        /**
         * 选择时间
         */
        changeDateRange(value) {
            this.formValidate.dateRange = value;
            this.formValidate.stime = value[0];
            let end = value[1];
            this.formValidate.etime = `${end.substring(0,10)} 23:59:59`
            this.formValidate.dateRange = [this.formValidate.stime, this.formValidate.etime]
            this.getOrderList();
        }
    }
}
</script>
