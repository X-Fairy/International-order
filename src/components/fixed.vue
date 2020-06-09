<template>
    <div class="fixedPage">
        <ul  class="fixed_part">
            <li @click="$router.push({path: '/cart'})" :title="i18n.shopcar">
                <Badge :count="pageNum">
                    <Avatar shape="square" icon="ios-cart-outline" />
                </Badge>
            </li>
            <li @click="$router.push({path: '/order/reverse'})" :title="i18n.OrderTips" >
                <Badge :count="presellNum">
                    <Avatar shape="square" icon="ios-stopwatch-outline"/>
                </Badge>
            </li>
            <li v-for="(item) in fixedData" :key="item.id" @click="itemClick(item.id)">
                <Icon :type="item.icon"></Icon>
            </li>
        </ul>
        <Modal v-model="isCheck" class="model_check" :title="i18n.title" draggable >
            <p>
                <Input v-model="searchCode" @on-enter="searchGoods" :placeholder="i18n.inputTip" />
                <span class="icon" @click="searchGoods"><Icon type="ios-search"></Icon></span>
            </p>
        </Modal>
    </div>
</template>

<script>
import { mapState, mapGetters, mapMutations,mapActions } from 'vuex';
export default {
    data() {
        return {
            // 固定数据
            fixedData: [
                {
                    icon: 'ios-search',
                    id: 2,
                },
                {
                    icon: 'ios-arrow-up',
                    id: 3,
                },
            ],
            // 是否显示查询框
            isCheck: false,
            // 编码查询字段
            searchCode: '',
            // 输入字段为空提示
            keyworkTip: this.$t('fixedPage.keyworkTip') ,
            totalNum: 0,
        }
    },
    computed: {
        // 引入fixedPage里的中英文
        i18n() {
            return this.$t('fixedPage') 
        },
        ...mapState([
            'headerCartData'
        ]),
        ...mapGetters([
            'totalPrice',
            'cartNum',
            'pageNum',
            'presellNum'
        ]),
    },
    created() {
    },
    watch: {
        isCheck(val) {
            if(!val) {
                this.searchCode = '';
            }
        }
    },
    methods: {
        ...mapMutations([
            'setCartDataList',
            'setCartDataListNum',
            'setTotalPrice',
            'setCartDataCartTypeCate',
            'setPageNum',
            'setPresellNum'
        ]),
        ...mapActions([
            'getDataCard'
        ]),
        itemClick(id) {
            switch(id) {
                case 2:
                    this.isCheck = true;
                    this.goCheck();
                    break;
                case 3:
                    this.topBack();
                    break;
            }
        },
        goCheck() {

        },
        /**
         * 回到顶部
         */
        topBack() {
            let distance = document.documentElement.scrollTop || document.body.scrollTop; //获得当前高度
            let step = distance/50; //每步的距离
            (function jump(){
                if(distance > 0){
                    distance-=step;
                    // document.documentElement.scrollTop = distance;
                    // document.body.scrollTop = distance;
                    window.scrollTo(0,distance);
                    setTimeout(jump,10)
                }
            })();
        },
        /**
         *  搜索商品
         */
        searchGoods() {
            if(this.searchCode === '') {
                this.$Message.warning({
                    content: this.keyworkTip,
                    duration: 3
                });
                return false;
            }
            this.isCheck = false;
            this.$root.keywork = this.searchCode;
            this.$router.push({path: '/searchKey', query: {keyword: this.$root.keywork,select: 0}});
            this.searchCode = '';
        },
    }
}
</script>



