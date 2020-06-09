<template>
    <div id="order">
        <div class="order_top">
            <div class="top_inner">
                <Breadcrumb separator="<b class='demo-breadcrumb-separator'>></b>">
                    <BreadcrumbItem to="/enter"><i class="icon-liuliangyunpingtaitubiao02 iconfont"></i>{{i18n.home}}</BreadcrumbItem>
                    <BreadcrumbItem to="" v-for="(item,index) in orderBreadList" :key="index" @click.native="clickBread(item, index)">{{item.name}}</BreadcrumbItem>
                </Breadcrumb>
            </div>
        </div>
        <div class="order_contanier">
            <div class="contanier_inner">
                <div class="inner_left">
                    <div class="order_nav" v-for="(item, index) in i18n.navList" :key="index">
                        <h3>{{item.title}}</h3>
                        <ul>
                            <li v-for="ele in item.lists" :key="ele.id" :class="{active: currendIndex == ele.id}" @click="clickNavLi(ele,item)">{{ele.name}}</li>
                        </ul>
                    </div>
                </div>
                <div class="order_content">
                    <!-- 这里放入第三级路由 -->
                    <router-view />
                </div>
            </div>
        </div>
    </div>
</template>


<script>
import {getUrlParams} from  '@/assets/js/tool.js'

export default {
    
    data() {
        return{
            value1:' 1',
            // 得到网址的参数对象
            urlParams: {},
            // 管理中心里面的面包屑数据
            orderBreadList: [],
            // 当前所点击的是哪一个
            currendIndex: '1',
            navList: this.$t('orderHomePage.navList') 
        }
       
    },

    watch: {
        $route(val) {
            if(val) {
                this.isSureLI()
            }
        }
    },
    computed: {
        // 引入orderHomePage里的中英文
        i18n() {
            return this.$t('orderHomePage') 
        },
    },
    created() {
        this.isSureLI();
    },
    methods: {
        /**
         * 根据网址传来的参数来确定选中哪个nav里内容
         */
        isSureLI() {
            this.urlParams = getUrlParams(); 
            let name2 = this.urlParams.name2;
            let name3 = this.urlParams.name3;
            let title = this.urlParams.title;
            this.navList.forEach(list => {
                list.lists.forEach(ele => {
                    if(list.id === name2 && ele.id === name3) {
                        this.orderBreadList = [
                            {
                                name: `${list.title}`,
                                path: `/order/favorite?name2=${name2}&name3=${name3}`
                            },
                            {
                                name: `${ele.name}`,
                                path: `/order/favorite?name2=${name2}&name3=${name3}`
                            }
                        ]
                        this.currendIndex = ele.id;
                    }
                })
               
            });
        },
        /**
         * 点击面包屑
         */
        clickBread(item, index) {
            this.isSureLI();
        },
        /**
         * 点击左侧导航栏上的li
         */
        clickNavLi(ele,item) {
            // 单击哪个li变色
            this.currendIndex = ele.id;
            this.navList.forEach(gn => {
                gn.lists.forEach(listItem => {
                    if(gn.id === item.id && listItem.id == ele.id) {
                        this.orderBreadList = [
                            {
                                name: `${gn.title}`,
                                // path: `/order/favorite?name2=${list.id}&name3=${listItem.name}`
                            },
                            {
                                name: `${listItem.name}`,
                                // path: `/order/favorite?name2=${list.id}&name3=${listItem.name}`
                            },
                        ]
                    }
                })
            });
           this.navSwitch();
        },
        /**
         * 跳转路由
         */
        navSwitch() {
            switch(this.currendIndex) {
                case '0':
                    this.$router.push({path: '/order/reverse'});  // 预售商品订单
                    break;
                case '1':
                    this.$router.push({path: '/order/confirmed'});  // 在售商品订单
                    break;
                case '3':
                    this.$router.push({path: '/order/salesFlow'}); // 销售流水
                    break;
                case '4':
                    this.$router.push({path: '/order/Stock'});   // 库存统计
                    break;
                case '5':
                    this.$router.push({path: '/order/sellWell'});  // 热销排名 
                    break;
                case '6':
                    this.$router.push({path: '/order/personal'});
                    break;
                case '8':
                    this.$router.push({path: '/order/favorite'});
                    break;
                case '11':
                    this.$router.push({path: '/order/applyServices'});  // 申请售后
                    break;
                case '12':
                    this.$router.push({path: '/order/servicesRecords'});  // 售后记录
                    break;
                case '13':
                    this.$router.push({path: '/order/sendBack'});  // 寄回产品
                    break;
                case '15':
                    this.$router.push({path: '/order/sendBackList'});  // 寄回产品列表
                    break;
                case '14':
                    this.$router.push({path: '/order/network'});  // 极速服务
                    break;
            }
        }
    }
}
</script>
