<template>
    <div class="JournalPage">
        <div class="top">
            <div class="right">
                <div class="item">
                    <span class="item_title">对象： </span>
                    <Select v-model="model" style="width:200px"  @on-change="changeModel">
                        <Option v-for="item in logList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                </div>
                <div class="item">
                    <span class="item_title">编码： </span>
                    <Input v-model="codeValue" placeholder="请输入商品编码..." style="width: 200px" @on-enter="codeEnter"  @on-blur="codeEnter"/>
                </div>
                <div class="item">
                    <span class="item_title">时间： </span>
                    <DatePicker v-model="dateRange" type="datetimerange" :options="options" @on-change="getSelectTime" placeholder="请选择时间区间..." style="width: 320px"></DatePicker>
                </div>
            </div>
        </div>
        <div class="table">
            <Table  border :height="tableHeight"  :columns="columns" :data="tableData"></Table>  
        </div>
        <div class="pageContanier">
            <Page :total="total" :page-size="pageSize" @on-change="changePage" :current="currentPage" show-elevator show-total ></Page>
        </div>
    </div>
</template>
<script>
import NProgress from 'nprogress'   // 引入进度条
import 'nprogress/nprogress.css'    // 引入进度条
import {changeTime } from  '@/assets/js/tool.js'    // 转化时间为2019-10-09 这样的格式  
import {unique} from '@/assets/js/tool.js'  // 数组去重
export default{
    data(){
        return {
            // 商品编码
            codeValue :'', 
            // 选中哪个日记
            model:1, 
            //日记类型
            logList: [
                {
                    label: '商品禁配',
                    value: 1,
                },
                {
                    label: '商品上线',
                    value: 2,
                },
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
            // 总数
            total: 0,
            // 每页条数
            pageSize: 20,
            // 当前页码
            currentPage: 1,
            // 表格高度
            tableHeight:600,
            stime: '',
            etime: '',
            // 地区数据
            areaList: [],
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
    computed: {
        columns() {
            var colItem = [];
            if(this.model === 1) {
                colItem = [
                    {
                        title: '商品编码',
                        align: 'center',
                        key: 'item_no',
                        width:150,
                    },
                    {
                        title: '图片',
                        key: 'imgUrl',
                        align: 'center',
                        render: (h, { row }) => {
                            return (<img v-lazy={`http://img.xmvogue.com/thumb/${row.item_no}.jpg?x-oss-process=style/80`} title="点击查看图片大图" onClick={() => this.CheckImage(row.item_no)} style="width:80px;cursor:pointer;margin:5px 0;"/>);
                        } 
                    },
                    {
                        title: '原来禁配地区',
                        align: 'center',
                        key: 'lastStr',
                        width:360,
                    },
                    {
                        title: '现在禁配地区',
                        align: 'center',
                        key: 'nowStr',
                        width:360,
                    },
                    {
                        title: '未禁配地区',
                        align: 'center',
                        key: 'surplus',
                        width: 360,
                    },
                    {
                        title: '操作时间',
                        align: 'center',
                        key: 'time',
                        width:180,
                    },
                    {
                        title: '操作人',
                        align: 'center',
                        key: 'player',
                    },
                ]
            } else {
                colItem = [
                    {
                        title: '商品编码',
                        align: 'center',
                        key: 'item_no',
                    },
                    {
                        title: '图片',
                        key: 'imgUrl',
                        align: 'center',
                        render: (h, { row }) => {
                            return (<img v-lazy={`http://img.xmvogue.com/thumb/${row.item_no}.jpg?x-oss-process=style/80`} title="点击查看图片大图" onClick={() => this.CheckImage(row.item_no)} style="width:80px;cursor:pointer;margin:5px 0;"/>);
                        } 
                    },
                    {
                        title: '原来',
                        align: 'center',
                        key: 'last',
                    },
                    {
                        title: '现在',
                        align: 'center',
                        key: 'now',
                    },
                    {
                        title: '操作时间',
                        align: 'center',
                        key: 'time',
                    },
                    {
                        title: '操作人',
                        align: 'center',
                        key: 'player',
                    },
                ]
            }
            return colItem;
        }
    },
   
    created() {
        // 得到国家列表,异步请求, 这个函数getCerArea()传入一个函数getLogList(),表示getCerArea()这个执行后再执行getLogList()这个函数.
        this.getCerArea(()=> {
            // 获取操作日志   this.getLogList();就表示callback参数
            this.getLogList();
        });
    },
    methods:{
        /**
         * 得到地区列表
         * @param {Function} callback getCerArea()当前这个方法得到数据以后再执行callback这个回调函数
         */
        getCerArea(callback) {
            this.$resetAjax({
                type: "GET",
                url: "/Admin/Credential/getcountry",
                success: res => {
                    let result = JSON.parse(res);
                    this.areaList = result;
                    // 如果callback是函数类型 就执行这个callback回调函数,也就是执行这个this.getLogList()方法
                    typeof callback === 'function' && callback();
                }
            });
        },
        /**
         * 选中哪个日记类型
         */
        changeModel(data) {
            this.currentPage = 1;
            this.getLogList()
        },
        /**
         * 获取操作日志
         */
        getLogList() {
            NProgress.start();
            this.$resetAjax({
                type: 'POST',
                url: '/admin/goods/get_log',
                data: { 
                    stime: this.stime,
                    etime: this.etime,
                    item_no: this.codeValue.trim(),
                    page: this.currentPage,  //  页码
                    field: this.model === 1 ? 'ban_area' : 'display_flag'

                },
                success: (res) => {
                    NProgress.done();
                    let result = JSON.parse(res).data;
                    if(this.model === 2) {
                        // 上线数据操作
                        this.transDisplay(result)
                        return false;
                    } 
                    // 禁配地区数据处理
                    this.transMatch(result);
                }
            })
        },
        /**
         * 上线操作日志返回数据处理
         */
        transDisplay(result) {
            // 上线
            result.data.forEach(ele => {
                ele.last = ele.last === "1" ? '上线' : '下线'
                ele.now = ele.now === "1" ? '上线' : '下线'
            });
            this.tableData = result.data;
            this.total = result.total;
        },
        /**
         * 禁配地区数据处理
         */
        transMatch(result) {
            // 禁配地区设置
            var arrCode = this.areaList.map(ele => ele.code);
            result.data.forEach((item,index) => {
                // 剩余的禁配地区
                item.surplus = "无";
                var arr = item.now.split(',');
                var arrSur = [];
                arrSur = arrCode.filter(item=>{
                    return arr.indexOf(item) === -1
                });
                var surplusArr = [];
                arrSur.forEach(ele => {
                    this.areaList.forEach(list => {
                        if(ele === list.code) {
                            surplusArr.push(list.name)
                        }
                    })
                })
                item.surplus = surplusArr.join(',')
                // 现在的禁配地区
                if(item.now === "") {
                    item.nowStr = "无";
                }  else{
                    var arrnow = [];
                    arr.forEach(ele => {
                        this.areaList.forEach(list => {
                            if(ele === list.code) {
                                arrnow.push(list.name);
                            }
                        })
                    })
                    item.nowStr = arrnow.join(',');
                } 
                // 原来的禁配地区
                if(item.last === "") {
                    item.lastStr = '无'
                }  else{
                    var arrlast = [];
                    var arr2 = item.last.split(',');
                    arr2.forEach(ele => {
                        this.areaList.forEach(list => {
                            if(ele === list.code) {
                                arrlast.push(list.name)
                            }
                        })
                    })
                    item.lastStr = arrlast.join(',');
                }
            })
            this.tableData = result.data;
            this.total = result.total;
        },
        /**
         * 查看商品图片
         */
        CheckImage(itemNo) {
            window.open(`http://img.xmvogue.com/thumb/${itemNo}.jpg?x-oss-process=style/800`)
        },
        // 获取时间
        getSelectTime(data) {
            this.currentPage = 1;
            if(data[0].length === 0 || data[1].length === 0) {
                this.stime = '';
                this.etime = '';
            } else {
                this.stime = changeTime(this.dateRange[0])
                let end = changeTime(this.dateRange[1]);
                this.etime = `${end.substring(0,10)} 23:59:59`
                this.dateRange = [this.stime, this.etime]
            }
            this.getLogList();
        },
        /**
         * 根据客户编码进行搜索
         */
        codeEnter() {
            this.currentPage = 1;
            this.getLogList();
        },
        // 换页
        changePage(index) {
            this.currentPage = index;
            this.getLogList();
        },
    }
}
</script>