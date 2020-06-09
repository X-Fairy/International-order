<template>
    <div class="salesFlow">
        <p class="order_title">{{i18n.pageTitle}}</p>
        <div class="date">
            <DatePicker format="yyyy/MM/dd" type="daterange" :options="dateRules" placement="bottom-end" :placeholder="i18n.selectDate" style="width: 260px" @on-change="getDateRange"></DatePicker>
            <p @click="getReady" class="check"><Icon type="ios-search" size="24"/></p>
        </div>
        <div class="bills" v-if="isShow">
            <h3 style="margin-top: 0;"><span style="font-weight: bold;">{{billStore}} &nbsp;</span> {{i18n.storeChart}}</h3>
            <div class="echarts_contanier">
                <Echart style="width:100%;height:100%" :options="options" :autoresize="true" />
            </div>
            <h3><span style="font-weight: bold;">{{billStore}} &nbsp;</span> {{i18n.billDetails}} : <span> {{sdate}} </span> - <span> {{edate}}</span></h3>
            <Table :columns="columns" border :data="billsData" height="400"></Table>
            <!-- <ul class="total">
                <li>{{i18n.total}}</li>
                <li>{{QTY}}</li>
                <li>{{AMT0}}</li>
                <li>{{IAMT}}</li>
                <li>{{price1}}</li>
                <li>{{DN1}}</li>
                <li>{{REALAMT}}</li>
            </ul> -->
        </div>
        <div class="naData" v-if="isData">
            {{i18n.noData}}
        </div>

    </div>
</template>

<script>
import NProgress from 'nprogress'   // 引入进度条
import 'nprogress/nprogress.css'    // 引入进度条
export default {
    data() {
        return {
            // 开始时间
            sdate: '',
            // 结束时间
            edate: '',
            // 是否显示查询结果
            isShow: false,
            // 实时账单数据
            billsData:[],
            // 实时账单的店名
            billStore: '',
            // 限制时间选择
            dateRules: {
                disabledDate (date) {
                    return date && date.valueOf() > Date.now();
                }
            },
            // 实时账单表头
            columns: [
                {
                    title: this.$t('salesFlowPage').date,
                    key: 'TIME',
                    align: 'center',
                },
                {
                    title: this.$t('salesFlowPage').Number,
                    key: 'QTY',
                    align: 'center',
                    sortable: true
                },
                {
                    title: this.$t('salesFlowPage').Retail,
                    key: 'AMT0',
                    align: 'center',
                    sortable: true
                },
                {
                    title: this.$t('salesFlowPage').cost,
                    key: 'IAMT',
                    align: 'center',
                    sortable: true
                },
                {
                    title: this.$t('salesFlowPage').Gross,
                    key: 'price1',
                    align: 'center',
                    sortable: true
                },
                {
                    title: this.$t('salesFlowPage').Passenger,
                    key: 'DN1',
                    align: 'center',
                    sortable: true
                },
                {
                    title: this.$t('salesFlowPage').Customer,
                    key: 'REALAMT',
                    align: 'center',
                    sortable: true
                },
            ],  
            // 总数量
            QTY : 0,
            // 总零售额
            AMT0 : 0,
            // 总成本额
            IAMT : 0,
            // 总毛利额
            price1 : 0,
            // 总客流量
            DN1 : 0,
            // 总客单价
            REALAMT : 0,
            Number: this.$t('salesFlowPage.Number'),
            // 图形数据
            options:{
                // 全图默认背景,要打引号
                // backgroundColor: 'lightblue',
                // 标题，每个图表最多仅有一个标题控件
                title: {
                    text: '',
                },
                //  提示框，鼠标悬浮交互时的信息提示
                tooltip: {
                    trigger: 'axis',
                },
                // 数值系列的颜色列表
                color: ['#4dc7c9', '#f4bc8e', '#d87a80'],
                // legend	图例（详见legend），每个图表最多仅有一个图例，混搭图表共享
                legend: {
                    x: 'right',
                    data: [this.$t('salesFlowPage').Number, this.$t('salesFlowPage').money]
                },
                // 网页一打开数据是否采用动画效果显示出来，默认为true，这里animation可以不写
                animation: true,
                // 图表上下位置
                grid: {
                    x: 100, // 靠近左侧横坐标能显示完全
                    y: 100,
                },
                // 工具箱，每个图表最多仅有一个工具箱
                toolbox: {
                    show: true,
                    x: 'center',
                    feature: {
                        mark: { show: true },
                        dataView: { show: true, readOnly: false },
                        magicType: { show: true, type: ['bar', 'line'] },
                        restore: { show: true },
                        saveAsImage: { show: true }
                    },
                },
                xAxis: [
                    {
                        type: 'category',
                        data: [],
                        // 类目起始和结束两端空白策略，见下图，默认为true留空，false则顶头
                        boundaryGap: true,
                        // 坐标轴名称，默认为空
                        name: this.$t('salesFlowPage').classification,
                        nameTextStyle: {
                            color: '#000'
                        },
                        // 坐标轴名称位置
                        nameLocation: 'end',
                        // 分隔线，默认显示 不显示为true
                        splitLine: false,
                        // 坐标轴文本标签选项
                        axisLabel: {
                            // 标签旋转角度，默认为0，不旋转，正值为逆时针，负值为顺时针，可选为：-90 ~ 90
                            rotate: 30,
                            // 	坐标轴文本标签是否可点击
                            clickable: true,
                            // 坐标轴文本标签与坐标轴的间距，默认为8，单位px
                            margin:12,
                            textStyle: {
                                color: '#333'
                            }
                        },
                        // 坐标轴小标记，数值轴和时间轴默认不显示，类目轴默认显示
                        axisTick: {
                            show: true,
                            // 小标记是否显示为间隔，默认等于boundaryGap
                            onGap: true,
                            // 小标记是否显示为在grid内部，默认在外部
                            inside: false,
                            // 小标记属性length控制线长
                            length: 5
                        },
                    },
                ],
                yAxis: [
                    {
                        type: 'value',
                        // 分隔线，默认显示 不显示为true
                        splitLine: false,
                        name: this.$t('salesFlowPage').Number,
                        nameTextStyle: {
                            color: '#000'
                        },
                    }
                ],
                series: [
                    {
                        type: 'line',
                        name: this.$t('salesFlowPage').Number,
                        // 类目间柱形距离，默认为类目间距的20%，可设固定值
                        barCategoryGap: '10%',
                        // barGap 柱间距离，默认为柱形宽度的30%，可设固定值
                        barGap: '6',
                        data: [],
                        // 平滑曲线显示
                        smooth: 'true',
                        // 图形样式，可设置图表内图形的默认样式和强调样式（悬浮时样式）：
                        itemStyle: {
                            // 默认样式,要和最外面的// 数值系列的颜色列表color: ['red', 'blue', 'black'],设置相同
                            // normal: {
                            //     color: 'red'
                            // },
                            // 强调样式（悬浮时样式）：
                            emphasis: {
                                color: 'orange'
                            }
                        },
                        // 标注
                        markPoint : {
                            // 标注图形数据
                            data : [
                                {type : 'max', name: '最大值'},
                                {type : 'min', name: '最小值'}
                            ]
                        },
                        // 系列中的数据标线内容
                        markLine : {
                            data : [
                                {type : 'average', name: '平均值'}
                            ]
                        },
                    },
                    {
                        type: 'line',
                        name: this.$t('salesFlowPage').money,
                        // 平滑曲线显示
                        smooth: 'true',
                        // 类目间柱形距离，默认为类目间距的20%，可设固定值
                        barCategoryGap: '10%',
                        // barGap 柱间距离，默认为柱形宽度的30%，可设固定值
                        barGap: '6',
                        data: [],
                        // 标注
                        markPoint : {
                            // 标注图形数据
                            data : [
                                {type : 'max', name: '最大值'},
                                {type : 'min', name: '最小值'}
                            ]
                        },
                        // 系列中的数据标线内容
                        markLine : {
                            data : [
                                {type : 'average', name: '平均值'}
                            ]
                        },
                    },
                ],
            },
            // 时间选择提醒
            selectDate:this.$t('salesFlowPage.selectDate'),
            // 无数据提示
            isData: false,
            
        }
    },
    
    watch:{
        sdate(val) {
            if(val === '') {
                this.billsData = [];
                this.isShow = false;
            }
        }
    },
    computed: {
        i18n() {
            return this.$t('salesFlowPage')
        }
    },
    methods: {
        /**
         * 准备工作
         */
        getReady() {
            if(this.sdate === '' || this.edate === '') {
                this.$Message.error({
                    content: this.selectDate,
                    duration: 3
                });
                return false;
            }
            this.getRanking();
            // this.saleData();
        },
        /**
         * 得到选择时间
         */
        getDateRange(date) {
            this.sdate = date[0];
            this.edate = date[1];
        },
        /**
         *  门店总销售图表
         */
        getRanking() {
            NProgress.start()
            this.$resetAjax({
                type: 'POST',
                url: '/home/Liushui/mysale',
                data: {
                    sdate: this.sdate,
                    edate: this.edate,
                },
                success: (res) => {
                    NProgress.done()
                    if(res === '' ) {
                        this.isData = true;
                        this.isShow = false;
                        return false;
                    }
                    this.isShow = true;
                    this.isData = false;
                    let result = JSON.parse(res);
                    // 得到金额数据组成一个数组
                    var moneyArr = [];
                    // 得到横坐标数据组成一个数组
                    var titleArr = [];
                    for (let i in result.money) {
                        moneyArr.push(result.money[i]); //属性
                        switch (i) {
                            case '01':
                                i = "家居百货";
                                break;
                            case '02':
                                i = "健康美容";
                                break;
                            case '03':
                                i = "饰品系列";
                                break;
                            case '04':
                                i = "文体礼品";
                                break;
                            case '05':
                                i = "季节产品";
                                break;
                            case '06':
                                i = "精品包饰";
                                break;
                            case '07':
                                i = "儿童玩具";
                                break;
                            case '08':
                                i = "毛绒公仔";
                                break;
                            case '09':
                                i = "数码配件";
                                break;
                            case '10':
                                i = "休闲食品";
                                break;
                            case '14':
                                i = "物料耗材";
                            }
                        titleArr.push(i);
                    }
                    this.options.xAxis[0].data = titleArr; // 横坐标标题
                    this.options.series[1].data = moneyArr;
                    // 得到数量组成一个数组
                    var numArr = []
                    for (let i in result.num) {
                        numArr.push(result.num[i]); //属性
                    }
                    this.options.series[0].data = numArr; // 数量数据
                },
            })
        },
        /**
         * 获取实时账单数据
         */
        saleData() {
             NProgress.start()
            this.$resetAjax({
                type: 'POST',
                url: '/index.php/Somego/User/mysale',
                data: {
                    sdate: this.sdate,
                    edate: this.edate,
                },
                success: (res) => {
                     NProgress.done()
                    this.isShow = true;
                    let result = JSON.parse(res);
                    this.billsData = result;
                    var QTY = 0;
                    var AMT0 = 0;
                    var IAMT = 0;
                    var price1 = 0;
                    var DN1 = 0;
                    var REALAMT = 0;
                    result.forEach(ele => {
                        QTY += ele.QTY; // 数量
                        AMT0 += ele.AMT0; // 零售额
                        IAMT += ele.IAMT; // 成本额
                        price1 += ele.price1; // 毛利额
                        DN1 += ele.DN1; // 客流量
                        REALAMT += ele.REALAMT; // 客单价
                    });
                    this.TIME = '合计',
                    this.QTY = QTY,
                    this.AMT0 = AMT0.toFixed(2),
                    this.IAMT = IAMT.toFixed(2),
                    this.price1 = price1.toFixed(2),
                    this.DN1 = DN1,
                    this.REALAMT = REALAMT.toFixed(2)
                    this.billStore = result[0].NAME;
                },
            })
        },
    }
}
</script>


