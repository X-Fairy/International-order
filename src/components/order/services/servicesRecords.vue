<template>
    <div class="servicesRecordsPage">
        <h3 class="order_title">{{i18n.pageTitle}}</h3>
        <button class="addBtn" @click="$router.push({path: '/order/applyServices'})">{{i18n.addBtn}}</button>
        <button class="addBtn" @click="sycnData" v-if="isShow">{{i18n.sycnh}}</button>
        <div class="service_content" v-if="isShowEmpty===false">
            <div class="pageSimple">
                <Page :total="total" :page-size="pageSize" @on-change="changePage" :current="currentPage" simple></Page>
            </div>
            <ul class="serviceList">
                <li v-for="(item, index) in serviceData" :key="index">
                    <Icon v-show="item.isDel" class="del" type="trash-a" size="20" @click="undoService(item)"></Icon>
                    <div class="top">
                        <h3>{{item.zt}} <span>{{item.lx}}</span></h3>
                        <p @click="checkDetail(item)" >{{i18n.detailsBtn}}</p>
                    </div>
                    <div class="bottom">
                        <p class="detail"><span class="sqrq">{{item.sqrq}}</span> |  &nbsp; 
                            {{i18n.quantity}}：{{item.qty}} &nbsp;   |
                            &nbsp;{{i18n.amount}}：¥{{item.amt}} &nbsp; 
                            | &nbsp;  {{i18n.number}}： 
                            <span class="code" @click="checkDetail(item)">{{item.id}}</span>
                        </p>
                        <p class="cancel" v-show="item.isDel" @click="undoService(item)">{{i18n.undo}}</p>
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
        <!-- 撤消申请单 -->
        <Modal v-model="modal1"  draggable :title="i18n.undoTitle" @on-ok="undoQuery" @on-cancel="modal1=false" class="undoServices_model">
            <p style="font-size:16px;">{{i18n.undoContent}}</p>
        </Modal>
    </div>
</template>

<script>
import NProgress from 'nprogress'   // 引入进度条
import 'nprogress/nprogress.css'    // 引入进度条
export default {
    data() {
        return {
            // 申请单列表数据
            serviceData: [],
            // 商品总数
            total: 0,
            // 每页条数
            pageSize: 20,
             // 当前页码
            currentPage: 1,
            // 是否显示内容为空提示的图片
            isShowEmpty: true,
            // 是否显示撤消确定弹窗
            modal1: false,
            // 当前撤消的服务id
            id: '',
            // 撤消申请成功提示
            undoSuccessTips: this.$t('servicesPage.undoSuccessTips'),
            // 同步数据成功提示
            sycnhTips: this.$t('servicesPage.sycnhTips'),
            // 是否同步过
            isShow: false,
        }
    },

    created() {
        // 得到服务单列表
        this.getServicesList();
    },
    computed: {
        i18n() {
            return this.$t('servicesPage')
        }
    },

    methods: {
        /**
         * 同步数据
         */
        sycnData() {
            this.$resetAjax({
                type: 'POST',
                url: `home/shouhou/sync`,
                success: (res) => {
                    let result = JSON.parse(res);
                    if(result.errorcode === 0) {
                        this.$Message.success({
                            content: this.sycnhTips,
                            duration: 3
                        });
                        this.getServicesList();
                    }
                }
            })
        },
        /**
         * 得到服务单列表
         */
        getServicesList() {
            this.isShowEmpty = false;
            NProgress.start();
            this.$resetAjax({
                type: 'POST',
                url: `/home/Shouhou/shouhou&p=${this.currentPage}`,
                data: {
                    lang:localStorage.langSelect
                },
                success: (res) => {
                    NProgress.done();
                    let result = JSON.parse(res);
                    this.isShow = result.other.sync_sh === 0 ? true : false;
                    if(result.list !== null && result.list.length !== 0) {
                        result.list.forEach(ele => {
                            ele.isDel = false;
                            ele.isShowSend = false;
                            if(ele.zt === '待审核' || ele.zt === 'To be audited') {
                                // 待审核可以删除
                                ele.isDel = true;
                            } 
                        });
                        this.serviceData = result.list;
                        this.total = Number(result.other.totalPage);
                    } else {
                        this.isShowEmpty = true;
                        this.serviceData = [];
                    }
                }
            })
        },
        /**
         *  切换页面
         */
        changePage(index) {
            this.currentPage = index;
            this.getServicesList();
        },
        /**
         * 撤消当前服务单准备工作
         */
        undoService(item) {
            this.modal1 = true;
            this.id = item.id;
        },
        /**
         * 撤消服务单请求
         */
        undoQuery() {
            this.$resetAjax({
                type: 'POST',
                url: `Home/Shouhou/shouhou_del&id=${this.id}`,
                success: (res) => {
                    this.modal1 = false;
                    if(res === '1') {
                        this.$Message.success({
                            content: this.undoSuccessTips,
                            duration: 3
                        });
                        this.getServicesList();
                    } else {
                        this.$Message.info(res);
                    }
                }
            })
        },
        /**
         * 查看申请服务详情
         */
        checkDetail(item) {
            // this.$router.push({path:'/order/servicesDetail', query: {mid: item.id}})
            // // 新开页面跳转到申请单详情页面
            let routeData = this.$router.resolve({ name: 'servicesDetail', query: {mid: item.id}});
            window.open(routeData.href, '_blank');
        },
    }
}
</script>
