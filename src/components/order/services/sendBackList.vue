<template>
    <div class="sendBackList">
        <p class="order_title">{{i18n.pagetitle}}</p>
        <div class="service_content" v-if="isShowEmpty===false">
            <div class="pageSimple">
                <Page :total="total" :page-size="pageSize" @on-change="changePage" :current="currentPage" simple></Page>
            </div>
            <ul class="serviceList">
                <li v-for="(item, index) in sendList" :key="index">
                    <div class="top">
                        <h3>{{item.typeContent}} <span>{{item.statusContent}}</span></h3>
                        <p @click="checkDetail(item)" >{{i18n.detailsBtn}}</p>
                    </div>
                    <div class="bottom">
                        <p class="detail"><span class="sqrq">{{i18n.company}}： {{item.express_name}}</span> |  &nbsp; {{i18n.oddNum}}：{{item.express_number}} &nbsp; | &nbsp;  {{i18n.freight}}：￥{{item.express_fee}}<span class="code" @click="checkDetail(item)">{{item.type}}</span></p>
                        <!-- <p class="cancel" @click="undoService(item)">{{i18n.undo}}</p> -->
                    </div>
                </li>
            </ul>
            <div class="page">
                <Page :total="total" :page-size="pageSize" @on-change="changePage" :current="currentPage" show-elevator show-total></Page>
            </div>
        </div>
        <!-- 如果商品数据为空时显示 -->
        <div class="empty_content" v-if="isShowEmpty">
            <div class="emprt_inner">
                <Icon type="ios-alert" class="alert"/>  {{i18n.yets}}
            </div>
        </div>
    </div>
</template>

<script>
import NProgress from 'nprogress'   // 引入进度条
import 'nprogress/nprogress.css'    // 引入进度条
export default {
    data() {
        return {
            // 当前页码
            currentPage: 1,
            // 商品总数
            total: 0,
            // 每页条数
            pageSize: 20,
            // 是否显示内容为空提示的图片
            isShowEmpty: true,
            // 寄回列表数据
            sendList: [],
        }
    },

    computed: {
        i18n() {
            return this.$t('sendBackListPage')
        }
    },
    created() {
        // 得到寄回产品的列表
        this.getRecodes();
    },

    methods:{
        /**
         * 得到寄回产品的列表
        */
        getRecodes() {
            NProgress.start();
            this.isShowEmpty = false;
            this.$resetAjax({
                type: 'POST',
                url: `/home/Shouhou/sh_express_list&p=${this.currentPage}`,
                success: (res) => {
                NProgress.done();
                    let result = JSON.parse(res);
                    result.list.forEach(ele => {
                        switch(localStorage.langSelect) {
                            case '0':
                                switch(ele.type) {
                                    case 1:
                                        ele.typeContent = '调换';
                                        break;
                                    case 2:
                                        ele.typeContent = '坏货';
                                        break;
                                    case 0:
                                        ele.typeContent = '其他原因';
                                        break;
                                }
                                switch(ele.status) {
                                    case 0:
                                        ele.statusContent = '未处理';
                                        break;
                                    case 1:
                                        ele.statusContent = '清点';
                                        break;
                                    case 2:
                                        ele.statusContent = '已完成';
                                        break;
                                }
                                break;
                            case '1':
                                switch(ele.type) {
                                    case 1:
                                        ele.typeContent = 'Exchange Items';
                                        break;
                                    case 2:
                                        ele.typeContent = 'Quality Problems';
                                        break;
                                    case 0:
                                        ele.typeContent = 'Other Reasons';
                                        break;
                                }
                                switch(ele.status) {
                                    case 0:
                                        ele.statusContent = 'To be Handled';
                                        break;
                                    case 1:
                                        ele.statusContent = 'To be reviewed';
                                        break;
                                    case 2:
                                        ele.statusContent = 'Handled';
                                        break;
                                }
                                break;
                        }
                    });
                    this.sendList = result.list;
                    this.total = Number(result.other.totalPage);
                    if(result.list.length === 0 || result.list.length === null) {
                        this.isShowEmpty = true;

                    }
                },
            })
        },
        /**
         *  切换页面
         */
        changePage(index) {
            this.currentPage = index;
            this.getRecodes();
        },
        /**
         * 撤消寄回产品
         */
        undoService(item) {
            this.modal1 = true;
            this.id = item.id;
        },
        /**
         * 查看寄回产品详情
         */
        checkDetail(item) {
            // this.$router.push({path:'/order/sendDetail', query: {mid: item.id}})
            // // 新开页面跳转到申请单详情页面
            let routeData = this.$router.resolve({ name: 'sendDetail', query: {mid: item.id}});
            window.open(routeData.href, '_blank');
        },
    }
}
</script>
