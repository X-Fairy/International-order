<template>
    <div class="stock">
        <p class="order_title">{{i18n.Inventory}}</p>
        <h3>{{i18n.check}}</h3>
        <div class="stock_contanier">
            <div class="style">
                <p class="label_title">{{i18n.lookType}}</p>
                <ul class="service_label">
                    <li v-for="(item,index) in i18n.stockType" :key="index" > 
                        <p :class="{selected: typeIndex === index}" @click="selectSalesType(item,index)">{{item.title}}</p>
                    </li>
                    <li class="checkAll" v-if="isShowAll" @click="getAllStock">{{i18n.check}}</li>
                </ul>
            </div>
            <div class="style" style="margin-top:-12px;" v-if="isShowCode">
                <p class="label_title" style="margin-bottom: 0;">{{i18n.barCode}}</p>
                <Input v-model="goodsCode" class="goodsCode" placeholder="请输入要查询的商品条码..." /><span @click="getGoods('条码')" class="check"><Icon type="ios-search-strong" size="24px"></Icon></span> 
            </div>
            <div class="style" style="margin-top:-12px;"  v-if="isShowName">
                <p class="label_title" style="margin-bottom: 0;">{{i18n.barName}}</p>
                <Input v-model="goodsName" class="goodsName" placeholder="请输入要查询的商品名称..." /><span @click="getGoods('名称')" class="check"><Icon type="ios-search-strong" size="24px"></Icon></span>
            </div>
            <h3 v-if="isShow">【 {{storeName}} 】{{i18n.Proportion}} ({{storeTime}})</h3>
            <div v-if="isShow" class="detail">
                <Echart style="width:100%;height:100%" :options="options" :autoresize="true"/>
            </div>
            <!-- <div class="table" v-if="isTable">
                <h2>{{storeName}} {{storeTime}}商品分类库存金额数量明细 </h2>
                <Table :columns="columns" :data="goodsData"></Table>
            </div> -->
            <!-- 总库存详情显示  -->
            <div class="stock_list" v-if="isTable">
                <h3 style="margin-top:0;">【 {{storeName}}】 {{i18n.Merchandise}} ({{storeTime}}){{i18n.detailmore}}</h3>
                <ul class="detail_stock" >
                    <!-- <li class="title"><span>{{storeName}}</span> 商品分类库存<span> {{storeTime}}</span> 金额数量明细</li> -->
                    <li v-for="(item,index) in goodsData" :key="index">
                        {{item.name}}：
                        <span class="num">{{item.num}} {{i18n.piece}}</span> 
                        <span class="value">￥  {{item.value}} </span> 
                    </li>
                </ul>
                <div class="explain">{{i18n.Aggregate}}：<span class="totalPrice">{{numTotal}}</span>{{i18n.piece}}</div>
                <div class="explain" style="padding-top: 5px;">{{i18n.totalSum}}：<span class="totalPrice">￥ {{valueTotal}}</span></div>
            </div>
            <!-- 商品id,商品名称查询库存展示 -->
            <div class="search" v-if="isShowSearch">
                <h3>{{i18n.InventoryDetail}}</h3>
                <ul>
                    <li v-for="(item, index) in goodsData" :key="index">
                        <div class="img" @click="goDetail(item.CODE2)">
                            <img :src="item.imgUrl" alt=""  @error="defImg()">
                        </div>
                        <p class="orD_name" title="点击查看商品详情" @click="goDetail(item.CODE2)">{{item.NAME}}</p>
                        <p class="encoded" title="点击查看商品详情">{{item.CODE2}}</p>
                        <p class="orD_num">{{item.QTY}} 件</p>
                        <p class="orD_total">{{item.RTLPRC}} 元</p>
                    </li>
                </ul>
                <div class="explain">{{i18n.Aggregate}}：<span class="totalPrice">{{numTotal}}</span> {{i18n.piece}}  </div>
                <div class="explain" style="padding-top: 5px;">{{i18n.totalSum}}： <span class="totalPrice">￥ {{valueTotal}}</span></div>
            </div>
        </div>
        <div v-if="isSpin" style="width: 100%;display:flex;justify-content: center;">
            <img style="width:500px; height:500px;" src="@/assets/images/gif/15475f70f1817ee6ccc8bf7f1110488b.gif" alt="">
        </div>
        <!-- 如果商品数据为空时显示 -->
        <div class="empty_content" v-show="isShowEmpty">
            <div class="emprt_inner" style="width:100%px;margin:0 auto;display:flex;justify-content: center;">
                <img style="width:400px;height:400px;" src="https://img.zcool.cn/community/01b35f5b320c11a80120b95969bc40.gif" alt="">
            </div>
        </div>
    </div>
</template>

<script>
import {getNumBox} from  '@/assets/js/tool.js'
import NProgress from 'nprogress'   // 引入进度条
import 'nprogress/nprogress.css'    // 引入进度条
export default {
    data() {
        return {
            // 是否显示正在加载中
            isSpin: false,
            // 选中哪个类型
            typeIndex: -1,
            // 商品条码
            goodsCode: '',
            // 商品名称
            goodsName: '',
            // 是否显示库存查询按钮
            isShowAll: false,
            // 是否显示条码输入
            isShowCode: false,
            // 是否显示名称输入
            isShowName: false,
            // 是否显示请求回来的内容
            isShow: false,
            // 门店名称
            storeName : '',
            // 库存截止时间
            storeTime: '',
            options: {
                title : {
                    text: ``,
                    x:'center',
                },
                tooltip : {
                    trigger: 'item',
                    formatter: "{a} <br/>{b} : {c} ({d}%)"
                },
                legend: {
                    orient: 'vertical',
                    right: 0,
                    top: 40,
                    bottom: 20,
                    data: []
                },
                series : [
                    {
                        name: '库存金额占比',
                        type: 'pie',
                        radius : '65%',
                        selectedMode: 'single',
                        center: ['40%', '50%'],
                        data:[],
                        itemStyle: {
                            emphasis: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            },
                            normal:{
                                color:function(params) {
                                //自定义颜色
                                var colorList =['#c23531','#2f4554', '#61a0a8', '#d48265', '#91c7ae','#749f83', '#ca8622','#249cf9', '#67e0e3','#fdb628','#30ace1','#2f646e']
                                    return colorList[params.dataIndex]
                                }
                            }
                        }
                    }
                ]
            },
            // 所有商品分类数据
            titleArr: [],
            // 得到金额数据组成一个数组
            stockData : [],
            // 商品有数量和金额的数据
            goodsData: [],
            // 库存总数
            numTotal: 0,
            // 库存总金额
            valueTotal: 0,
            columns: [
                {
                    title: '分类名',
                    key: 'name',
                    align: 'center',
                },
                {
                    title: '数量',
                    key: 'num',
                    align: 'center',
                    sortable: true,
                    renderHeader: (h,params)=>{
                        return h('div',[
                            h('strong','数量'),
                            h('span', {
                                style: {
                                    marginLeft: '15px',
                                    color: '#1d8c9f',
                                    fontSize: '14px',
                                    marginTop: '10px',
                                    display: 'inline-block'
                                },
                            },`(总计: ${this.numTotal})`)
                        ])
                    },
                },
                {
                    title: '金额',
                    key: 'value',
                    align: 'center',
                    sortable: true,
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
                            },`(总额: ${this.valueTotal} )`)
                        ])
                    },
                }
            ], 
            // 表格是否有数据并根据这个来判断显示表格
            isTable: false,
            // 是否提示返回数据为空
            isShowEmpty: false,        
            // 是否显示搜索商品得到库存的信息
            isShowSearch: false, 
            
        }
    },
    computed: {
        i18n() {
            return this.$t('stockPage')
        }
    },
    methods: {
        defImg() {
            let img = event.srcElement;
            img.src = this.defaultImg;
            img.onerror = null; //防止闪图
        },
        /**
         * 选择售后类型
         */
        selectSalesType(item, index) {
            this.isShow = false;
            this.isTable = false;
            this.isShowEmpty = false;
            this.isShowSearch = false;
            NProgress.start();  // 进度条开始
            this.typeIndex = index;
            switch(this.typeIndex) {
                case 0:
                    this.isShowAll = true;
                    this.isShowCode = false;
                    this.isShowName = false;
                    this.goodsCode = '';
                    this.goodsName = '';
                    break;
                case 1:
                    this.isShowAll = false;
                    this.isShowCode = true;
                    this.isShowName = false;
                    this.goodsName = '';
                    this.goodsCode = '';
                    break;
                case 2:
                    this.isShowAll = false;
                    this.isShowCode = false;
                    this.isShowName = true;
                    this.goodsCode = '';
                    this.goodsName = '';
                    break;
            }
        },
        /**
         * 查询前判断传值是否为空
         */
        getGoods(data) {
            if(data === '名称' && this.goodsName === '') {
                this.$Message.warning('抱歉, 商品名称不能为空....');
                return false;
            }
            if(data === '条码' && this.goodsCode === '') {
                this.$Message.warning('抱歉, 商品条码不能为空....');
                return false;
            }
            this.getStock();
        },
        /**
         * 搜索商品编码或者商品名称得到库存数据
         */
        getStock() {
            this.isSpin = true;
            this.isShowEmpty = false;
            this.$resetAjax({
                type: 'POST',
                url: `/index.php/Somego/User/appStock?code=${this.goodsCode}`,
                data: {
                    name: this.goodsName, // 商品名称
                },
                success: (res) => {
                    this.isSpin = false; // 正在加载提示数据隐藏
                    // 如果返回的数据为空
                    if(res === '[]') {
                        this.isShow = false; // 饼图隐藏
                        this.isShowSearch = false; // 表格隐藏
                        this.isShowEmpty = true; // 显示空数据提示
                        return false;
                    } else {
                        // 如果有数据返回 
                        this.isTable = false; // 隐藏总库存得到的表格显示
                        this.isShowSearch = true;  // 显示表格数据
                        let result = JSON.parse(res);
                        this.goodsData = [];
                        let obj = {};
                        result.forEach(ele => {
                            obj = {
                                NAME : ele.NAME,
                                QTY : ele.QTY,
                                value : ele.RTLPRC,
                                imgUrl: ele.imgUrl = `https://ximiphoto.oss-cn-hangzhou.aliyuncs.com/thumb/${ele.CODE2}.jpg?x-oss-process=style/440`,
                                CODE2: ele.CODE2,
                                RTLPRC: ele.RTLPRC,
                            };
                            this.goodsData.push(obj); // 得到表格数据
                            this.storeName = '';  // 让店名为空
                            this.storeTime = '';  // 让查询到的时间为空
                        })
                        this.valueTotal = getNumBox(result.map(ele => Number(ele.RTLPRC))); // 得到所有库存总金额
                        this.numTotal = getNumBox(result.map(ele => Number(ele.QTY)));   // 得到所有库存总数
                    }
                    
                }
            })
        },
        /**
         * 得到门店所有商品库存
         */
        getAllStock() {
            NProgress.start();  // 进度条开始
            this.isShowEmpty = false;
            this.$resetAjax({
                type: 'POST',
                url: `home/Liushui/allStock`,
                success: (res) => {
                    this.isShow = true; // 让饼图显示
                    NProgress.done();  // 进度条结束
                    this.isTable = true; // 隐藏表格
                    let result = JSON.parse(res);
                    this.workData(result); // 进行数据分析
                }
            })
        },
        /**
         * 对返回的数据进行处理
         */
        workData(result) {
            // 得到金额数据组成一个数组
            this.stockData = [];
            // 得到横坐标数据组成一个数组
            this.titleArr = [];
            for (let i in result.money) {
                let value = result.money[i];
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
                this.titleArr.push(i);
                this.stockData.push({value:value, name: i }); //属性
            }
            this.options.legend.data = this.titleArr; // 所有商品分类数据
            this.options.series[0].data = this.stockData; // 商品分类的金额
            this.storeName = result.zong.name; // 得到店名
            this.storeTime = result.zong.time; // 得到店名查询的时间
            this.valueTotal = result.zong.money; // 得到库存总金额
            this.numTotal = result.number.num; // 得到库存总数
            // this.options.title.text = `【 ${this.storeName} 】总库存金额占比 (截止到${this.storeTime})`; // 饼图标题
            let numArr = [];
            for (let i in result.num) {
                let num = result.num[i];
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
                numArr.push({num: num, name: i}); // 得到数量集合的商品分类数据
            }
            this.goodsData = this.stockData.concat(); // 得到数量和金额集合的商品分类数据
            numArr.forEach((ele,i) =>{
                this.goodsData.forEach((item, index) => {
                    if(ele.name === item.name) {
                        item.num = ele.num
                    }
                })
            });
        },
        /**
         * 跳转到商品详情
         */
        goDetail(CODE2) {
            // 新开页面跳转到商品详情页面
            let routeData = this.$router.resolve({ name: 'goodsDetail', query: {item_no:CODE2}});
            window.open(routeData.href, '_blank');
        }
    },
    

}
</script>
