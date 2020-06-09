<template>
    <div class="retrievePage">
        <div class="top">
            <div class="top_left">
                <p @click="newCreate">部分生成</p>
                <p @click="AllCreate">全部生成</p>
                <p @click="moreDel">多项删除</p>
            </div>
            <div class="top_right">
                <div class="item">
                    <span style="width: 58px;display: inline-block;">海鼎：</span>
                    <Input v-model="hdid" placeholder="请输入海鼎编码..." @on-enter="hdidEnter" @on-blur="hdidEnter"/>
                </div>
                <div class="item">
                    <span>日期：</span>
                    <DatePicker type="daterange" split-panels placeholder="请选择日期..." :options="options" @on-change="changeDate" style="width: 300px"></DatePicker>
                </div>
            </div>
        </div>
        <div class="table">
            <Table :height="tableHeight" border  :columns="columns" :data="tableData" @on-selection-change="changeTable"></Table>  
        </div>
        <div class="pageContanier">
            <Page :total="total" :page-size="pageSize" @on-change="changePage" :current="currentPage" show-elevator show-total></Page>
        </div>
        <!-- 生成的model -->
        <Modal v-model="model" title="生成的商品编码和数量" class="created_retrievePage" draggable >
            <Input v-model="createValue" type="textarea" :autosize="{minRows: 1,maxRows:30}"  placeholder="Enter something..." />
        </Modal>
    </div>
</template>

<script>
import {changeday} from  '@/assets/js/tool.js'
import NProgress from 'nprogress'   // 引入进度条
import 'nprogress/nprogress.css'    // 引入进度条
export default {
    data() {
        return {
            // 日期限制
            options: {
                disabledDate (date) {
                    return date && date.valueOf() >= Date.now();
                }
            },
            // 表格高度
            tableHeight: 700,  
            // 表格数据 
            tableData: [], 
            // 数据表头
            columns: [
                {
                    type: 'selection',
                    width: 60,
                    align: 'center'
                },
                {
                    title: "编码",
                    align: "center",
                    key: "sphh",
                },
                {
                    title: "名称",
                    align: "center",
                    key: "item_name",
                },
                {
                    title: "图片",
                    align: "center",
                    key: "imgUrl",
                    render: (h, { row }) => {
                        return (<img src={row.imgUrl} onClick={() => this.lookImage(row.sphh)}  style="cursor: pointer;width:80px;height:80px;margin: 5px 0;" title="查看商品主图" />);
                    } 
                },
                {
                    title: "单价",
                    align: "center",
                    key: "price",
                },
                {
                    title: "数量",
                    align: "center",
                    key: "num",
                },
                {
                    title: "小计",
                    align: "center",
                    key: "sub",
                },
                {
                    title: "加购时间",
                    align: "center",
                    key: "addtime",
                },
                {
                    title: '操作',
                    key: 'action',
                    align: 'center',
                    render: (h, {row}) => {
                        return h('div', [
                            h('span', [
                                h('Poptip', {
                                    class: 'handle',
                                    props: {
                                        confirm: true,
                                        transfer: true,
                                        placement: 'top',
                                        title: '确定要删除 ？',
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
                                            this.cidStr = row.cid;
                                            this.deleteGoods()
                                        },
                                        'on-cancel': ()=>{
                                            // 取消删除
                                        }
                                    }
                                },
                                 [
                                    h('Icon',{
                                        props: {
                                           type: 'ios-trash',
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
            // hdid
            hdid: '',
            // 商品cid集合
            cidStr: '',
            // 勾选中的商品
            selection: [],
            // 生成的字符串
            createValue: '',
            // 是否显示生成model
            model:false,
            // 总数
            total: 0,
            // 每页条数
            pageSize: 50,
            // 当前页码
            currentPage: 1,
            // 开始时间
            stime: '',
            // 结束时间
            etime: '',
            
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
        this.getCartData();
    },
    methods: {
        /**
         * hdid输入
         */
        hdidEnter() {
            this.currentPage = 1; 
            this.getCartData();
        },
        getCartData() {
            NProgress.start();
            var stime = String(this.stime).substring(0,String(this.stime).length - 3);
            var etime =  String(this.etime).substring(0,String(this.etime).length - 3);
            console.log(stime)
            this.$resetAjax({
                type: "GET",
                url: "/admin/dingdan/cart_history",
                data: {
                    hdid: this.hdid,
                    stime,
                    etime,
                    page: this.currentPage
                },
                success: (res) => {
                    NProgress.done();
                    let result = JSON.parse(res).data;
                    result.data.forEach(ele => {
                        ele.addtime = changeday(ele.addtime*1000);
                        ele.sub = ele.sub.toFixed(2);
                        ele.imgUrl = `http://img.xmvogue.com/thumb/${ele.sphh}.jpg?x-oss-process=style/80`
                    });
                    this.tableData = result.data;
                    this.total = Number(result.total)
                }
            });
        },
        /*
        ** 切换分页
        */ 
        changePage(index) {
            this.currentPage = index;
            this.getCartData();
        },
        /**
         * 日期选择
         */
        changeDate(date) {
            this.currentPage = 1;
            if(date[0].length === 0) {
                this.stime = '';
                this.etime = ''
            } else {
                this.stime = Date.parse(new Date(date[0]));
                this.etime = Date.parse(new Date(date[1]));
            }
            this.getCartData();

        },
        /**
         * 部分生成购物车商品
         */
        newCreate() {
            if(this.tableData.length === 0) {
                this.$Message.error({
                    content: '暂时没有商品可以生成，请先在右侧进行商品搜索',
                    duration: 3
                });
                return false;
            }
            if(this.selection.length === 0 ) {
                this.$Message.error({
                    content: '请先勾选您要生成的商品',
                    duration: 3
                });
                return false;
            }
            let arr = [];
            this.selection.forEach(ele => {
                arr.push(`${ele.sphh},${ele.num}`)
            })
            this.createValue = arr.join('\n');
            this.model = true;
        },
        /**
         * 全部生成购物车
         */
        AllCreate() {
            NProgress.start();
            var stime = String(this.stime).substring(0,String(this.stime).length - 3);
            var etime =  String(this.etime).substring(0,String(this.etime).length - 3);
            this.$resetAjax({
                type: "GET",
                url: "/admin/dingdan/get_cart_bak",
                data: {
                    hdid: this.hdid,
                    stime,
                    etime,
                    page: this.currentPage
                },
                success: (res) => {
                    NProgress.done();
                    let result = JSON.parse(res).data;
                    let arr2 = [];
                    result.forEach(ele => {
                        arr2.push(`${ele.sphh},${ele.num}`)
                    })
                    this.createValue = arr2.join('\n');
                    this.model = true;
                }
            });
        },
        /**
         * 多项选中
         */
        changeTable(selection) {
            this.selection = selection;
        },
        /**
         * 查看商品图片
         */
        lookImage(imgUrl) {
            window.open(`http://img.xmvogue.com/thumb/${imgUrl}.jpg?x-oss-process=style/800`)
        },
        /**
         * 多项删除操作
         */
        moreDel() {
            if(this.tableData.length === 0) {
                this.$Message.error({
                    content: '暂时没有商品可以进行删除，请先在右侧进行商品搜索',
                    duration: 3
                });
                return false;
            }
            if(this.selection.length === 0 ) {
                this.$Message.error({
                    content: '请先勾选您要删除的商品',
                    duration: 3
                });
                return false;
            }
            this.cidStr = this.selection.map(ele => ele.cid).join(',');
            this.deleteGoods();
        },
        /**
         * 删除请求
         */
        deleteGoods() {
            this.$resetAjax({
                type: "GET",
                url: "//admin/dingdan/cart_delete",
                data: {
                    cid: this.cidStr,
                },
                success: (res) => {
                    let result = JSON.parse(res).errorcode;
                    if(result === 0) {
                        this.$Message.success({
                            content: '棒棒哒，该商品删除成功',
                            duration: 3
                        });
                    }
                    this.cidStr = '';
                    this.getCartData();
                }
            });
        },
    }

}
</script>
