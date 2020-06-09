<template>
    <div class="sellWell">
        <p class="order_title">{{i18n.pageTitle}}<span></span></p>
        <div class="date">
             <Select v-model="modelNum" style="width:200px;height:40px;" class="numSelect" :placeholder="i18n.inputNum" @on-change="isShow=false">
                <Option v-for="item in i18n.selectNumData" :value="item.id" :key="item.id">{{ item.label }}</Option>
            </Select>
            <DatePicker format="yyyy-MM-dd" type="daterange" :options="dateRules" placement="bottom-end" :placeholder="i18n.selectDate" style="width: 200px" @on-change="getDateRange"></DatePicker>
            <p @click="getReady" class="check">{{i18n.check}}</p>
        </div>
        <div v-if="isSpin" style="width: 100%;display:flex;justify-content: center;">
            <img style="width:500px; height:500px;" src="@/assets/images/gif/15475f70f1817ee6ccc8bf7f1110488b.gif" alt="">
        </div>
        <div class="goodsType" v-if="isShow">
            <h3><span style="font-weight: bold;">&nbsp;</span> {{i18n.topSales}}</h3>
            <Table :columns="columns" :data="goodsData"></Table>
        </div>
        <!-- 如果商品数据为空时显示 -->
        <div class="empty_content" v-show="isShowEmpty">
            {{i18n.noData}}
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            // 数据选择数据
            selectNumData: [
                {
                    id: 10,
                    label: '10条热销商品'
                },
                {
                    id: 20,
                    label: '20条热销商品'
                },
                {
                    id: 50,
                    label: '50条热销商品'
                },
                {
                    id: 100,
                    label: '100条热销商品'
                },
            ],
            // 选择的商品条数
            modelNum: 10,
            // 限制时间选择
            dateRules: {
                disabledDate (date) {
                    return date && date.valueOf() > Date.now();
                }
            },
            // 开始时间
            sdate: '',
            // 结束时间
            edate: '',
            // 是否显示查询出来的排名
            isShow: false,
            // 是否显示查询中
            isSpin: false,
            columns: [
                {
                    title: '热销排名',
                    key: '',
                    align: 'center',
                    render: (h, params) => {
                        // 鼠标经过有提示
                        return h('div', [
                            h('span', {
                            }, params.row._index + 1 )
                        ])
                    }
                },
                {
                    title: '商品类型',
                    key: 'type',
                    align: 'center',
                },
                {
                    title: '名称',
                    key: 'NAME',
                    align: 'center',
                },
                {
                    title: '数量',
                    key: 'QTY',
                    align: 'center',
                },
                {
                    title: '价格',
                    key: 'REALAMT',
                    align: 'center',
                },
            ],
            // 商品数据
            goodsData: [],
            // 是否显示空数据提示
            isShowEmpty: false,
            
        }
    },
    created() {

    },
    computed: {
        i18n() {
            return this.$t('sellWellPage')
        }
    },
    methods: {
        /**
         * 得到选择时间
         */
        getDateRange(date) {
            this.isShow = false;
            this.sdate = date[0];
            this.edate = date[1];
        },
        /**
         * 准备工作
         */
        getReady() {
            if(this.sdate === '' || this.edate === '') {
                this.$Message.warning('抱歉，请选择正确的时间范围');
                return false;
            }
            this.getRankingData();
        },
        /**
         * 得到分类排行数据
         */
        getRankingData() {
            this.isSpin = true;
            this.$resetAjax({
                type: 'POST',
                url: `home/Liushui/ranking`,
                data: {
                    sdate: this.sdate,
                    edate: this.edate,
                    // num: this.modelNum
                },
                success: (res) => {
                    this.isSpin = false;
                    let result = JSON.parse(res);
                    if(result.length !== 0) {
                        this.isShowEmpty = false;
                        this.isShow = true;
                        result.forEach(ele => {
                            switch(ele.SORT) {
                                case '01':
                                    ele.type = '家居百货';
                                    break;
                                case '02':
                                    ele.type = '健康美容';
                                    break;
                                case '04':
                                    ele.type = '文体礼品';
                                    break;
                                case '03':
                                    ele.type = '饰品系列';
                                    break;
                                case '05':
                                    ele.type = '季节性产品';
                                    break;
                                case '06':
                                    ele.type = '精品包饰';
                                    break;
                                case '07':
                                    ele.type = '儿童玩具';
                                    break;
                                case '08':
                                    ele.type = '毛绒公仔';
                                    break;
                                case '09':
                                    ele.type = '数码配件';
                                    break;
                                case '81':
                                    ele.type = '家居百货';
                                    break;
                                case '82':
                                    ele.type = '健康美容';
                                    break;
                                case '84':
                                    ele.type = '文体礼品';
                                    break;
                                case '83':
                                    ele.type = '饰品系列';
                                    break;
                                case '85':
                                    ele.type = '季节性产品';
                                    break;
                                case '86':
                                    ele.type = '精品包饰';
                                    break;
                                case '87':
                                    ele.type = '儿童玩具';
                                    break;
                                case '88':
                                    ele.type = '毛绒公仔';
                                    break;
                                case '89':
                                    ele.type = '数码配件';
                                    break;
                                case '10':
                                    ele.type = '休闲食品';
                                    break;
                                case '14':
                                    ele.type = '物料耗材';
                                    break;
                                
                            }
                        });
                        this.goodsData = result;
                    } else {
                        this.isShowEmpty = true;
                        this.isShow = false;
                    }
                },
            })
        }
    }
}
</script>