<template>
    <div class="supportDetail">
        <div class="order_title">
            <p class="support" @click="$router.push({path:'/order/supportRecords'})">服务记录 </p>
            <span class="line">| </span>
            <p class="records">服务详情</p>
            <span class="stip">用心服务，微笑服务，以客户为标准，为中心点，客户就是上帝。</span>
        </div>
        <h3 class="code">服务单号：<span>{{detailData.id}}</span></h3>
        <div class="info">
            <div class="process">
                <span style="disply:inline-block;width:50%;text-align: center;">已提交</span>
                <span style="disply:inline-block;width:50%;text-align: center;">{{detailData.resultInfo}}</span>
            </div>
            <P class="date">
                <span style="disply:inline-block;width:50%;text-align: center;">{{detailData.qtime}}</span>
                <span style="disply:inline-block;width:50%;text-align: center;">{{detailData.rtime}}</span>
            </P>
            <Collapse v-model="value1" @on-change="changePanel">
                <Panel name="1">
                    {{pannelTitle}}
                    <Timeline slot="content">
                        <TimelineItem color="#83c44e">
                            您的服务单{{detailData.resultInfo}}。如您有其他疑问请联系网管，网管信息员将竭诚为您服务。
                            {{detailData.rtime}} 
                        </TimelineItem>
                        <TimelineItem color="#e0e0e0">您的服务申请已提交。{{detailData.qtime}} </TimelineItem>
                    </Timeline>
                </Panel>
            </Collapse>
        </div>
        <ul class="detail">
            <li class="title">本服务由 <span>技术网管</span> 为您提供</li>
            <li>服务编号：{{detailData.id}}</li>
            <li>申请人员：{{detailData.store}}</li>
            <li>联系电话：{{detailData.tel}} </li>
            <li>QQ号码：{{detailData.qq}} </li>
            <li>问题描述：{{detailData.problem}} </li>
            <li>解决方法：{{detailData.method}} </li>
            <li>申请时间：{{detailData.qtime}} </li>
            <li>回复时间：{{detailData.rtime}}</li>
            <li>信息人员：{{detailData.wangguan}}</li>
        </ul>
    </div>
</template>

<script>
import {getUrlParams} from  '@/assets/js/tool.js'
export default {
    data() {
        return {
            // 服务数据
            detailData: {},
            // 得到网址的参数对象
            urlParams: {},
            // 折叠面板标题
            pannelTitle: '展开服务详情',
            // 折叠面板默认打开哪个
            value1: '0',
        }
    },
    created() {
        // 得到网址的参数
        this.getUrlData();
        
    },

    methods: {
        /**
         * 得到网址的参数
         */
        getUrlData(){
            this.urlParams = getUrlParams();
            // 得到服务数据
            this.getDetailData();
        },
        /**
         * 得到服务数据
         */
        getDetailData() {
            this.$resetAjax({
                type: 'GET',
                url: `/index.php/Somego/User/support_view`,
                data: {
                    sid: this.urlParams.id
                },
                success: (res) => {
                    let result = JSON.parse(res);
                    if(result.info.rtime === null) {
                        result.info.resultInfo = '等待回复中。。。'
                        result.info.rtime = '等待回复中。。。'
                    } else{
                        result.info.resultInfo = '已审核。。。'
                    }
                    this.detailData = result.info;
                },
            })
        },
        /**
         * 展示收起折叠面板
         */
        changePanel(index) {
            if(index.length === 2) {
                // 说明是展开服务详情，这时要显示收起服务详情
                this.pannelTitle = '收起服务详情';
            } else {
                this.pannelTitle = '展开服务详情';
            }
        },
    }
}
</script>
