<template>
    <div class="cart-wrap">
        <span @click="reduce" class="reduceIcon"><Icon type="md-remove" /></span>
        <input type="text" :value="price" @blur="blurHandler" @keypress="pressHandler" @input="inputHandler" @paste="pasteHandler" @focus="isShowGroup=true;"/>
        <span @click="increase" class="addIcon"><Icon type="md-add" /></span>
    </div>
</template>

<script>

export default {
    name: 'addCartPrice',

    props: {
        // 默认商品数量 
        multipleNum: {
            type: Number,
            // default: 6
        },
        // 总价
        InitPrice: {
            type: Number | String,
            default: 0
        }
    },
    data() {
        return {
            price: '0',
            // 是否显示加减数量按钮
            // isShowGroup: false,
            addtip: this.$t('fixedPage.addtip')
        }
    },

    created() {
        this.price = String(this.InitPrice);
    },

    watch: {
        //  price(val) {
        //     this.$emit('onChange', val);
        // },
        InitPrice(val) {
            this.price = String(this.InitPrice);
        }
    },
    computed: {
        // 购物车页面展示数据
        cartData() {
            let data = {
                list: [],
                num: 0,
                totalPrice: 0
            };
            data.list.forEach(item => {
                data.num += Number(item.num);
                // 放大100倍，防止js小数点计数有问题
                data.totalPrice += Number(item.org_xj) * 100;
            });
            data.totalPrice = data.totalPrice / 100;
            return data;
        }
    },

    methods: {
        /**
         * 减少数量
         */
        reduce() {
            this.price = Number(+this.price - this.multipleNum);
            if (this.price >= this.multipleNum) {
                this.price = this.price.toString();
                this.$emit('onChange', this.price);
            } else {
                this.price = this.multipleNum.toString();
            }
        },
        /**
         * 增加数量
         */
        increase() {
            this.price = Number(+this.price + this.multipleNum).toString();
            this.$emit('onChange', this.price);
        },
        /**
         * 键盘弹下时
         */
        pressHandler(e) {
            if (!(e.charCode >= 48 && e.charCode <= 57)) {
                e.preventDefault();
            }
        },
        /**
         * 输入时
         */
        inputHandler(e) {
            switch(e.inputType) {
                case 'insertFromPaste':
                    let oldVal = this.price;
                    e.target.value = oldVal;
                    break;
                case 'insertCompositionText':
                case 'insertText':
                    if (isNaN(Number(e.data))) {
                        let oldVal = this.price;
                        e.target.value = oldVal;
                    } else {
                        this.price = Number(e.target.value).toString();
                        this.$emit('onChange', this.price);
                    }
                    break;
                case 'deleteContentBackward':
                    let oldPrice = this.price;
                    this.price = Number(e.target.value).toString();
                    if (e.target.value.length === 0) {
                        this.price = e.target.value = '0';
                    } 
                    if (oldPrice !== e.target.value) {
                        this.$emit('onChange', this.price);
                    }
                    break;
                default:
                    this.price = Number(e.target.value).toString();
                    this.$emit('onChange', this.price);
            }
        },
        /**
         * 复制粘贴时
         */
        pasteHandler(e) {
            e.clipboardData.items[0].getAsString((str) => {
                if (!isNaN(Number(str))) {
                    e.target.value += str;
                    this.price = Number(e.target.value).toString();
                    this.$emit('onChange', this.price);
                }
            })
        },
        /**
         * 失去焦点时
         */
        blurHandler(e) {
            if (e.target.value % this.multipleNum !== 0) {
                this.$Message.error(this.addtip);
                let nextNum = e.target.value - (e.target.value % this.multipleNum);
                if (nextNum > this.multipleNum) {
                    this.price = e.target.value = nextNum.toString();
                } else {
                    this.price = e.target.value = this.multipleNum.toString();
                }
            }
            this.$emit('onBlur', this.price);
        },
    }

}
</script>

<style lang="less" scoped>

// .cart-wrap{
//     display: flex;
//     height: 50px;
//     width: 120px;
//     .input-btn{
//         width: 100px;
//         height: 50px;
//         background: #fff;
//         border: 0;
//         position: relative;
//         input{
//             height: 35px;
//             padding: 0 5px;
//             width: 100px;
//             border: 1px solid #ddd;
//             border-radius: 4px;
//             &:focus{
//                 border:1px solid #ddd;
//                 box-shadow: none;
//             }
//         }
//     }
//     .ivu-btn-group{
//         position: absolute;
//         width: 29px;
//         height: 35px;
//         border-left: 1px solid #ddd;
//         right: 66px;
//         top: 7px;
//     }
//     .addIcon,.reduceIcon{
//         background: #fff !important;
//         color: #000;
//         border: 0;
//         width: 31px;
//         height: 15px;
//         display: inline-block;
//         text-align: center;
//         font-size: 14px;
//         line-height: 14px;
//         margin-left: 0;
       
//     }
//     .addIcon{
//         position: absolute;
//         top: 1px;
//         right: -3px;
//     }
//     .reduceIcon{
//         position: absolute;
//         border-bottom: 0;
//         bottom: 2px;
//         right: -3px;
        
//     }
//     .ivu-btn{
//         transition:none;
//         padding: 0;
//         box-shadow: 0;
//         border-radius:  0 !important;
//     }
//     .ivu-btn-group:not(.ivu-btn-group-vertical) .ivu-btn-primary:first-child:not(:last-child) {
//         border-right-color: #ddd;
//     }
//     .ivu-btn-group:not(.ivu-btn-group-vertical) .ivu-btn-primary+.ivu-btn, .ivu-btn-group:not(.ivu-btn-group-vertical) .ivu-btn-primary:last-child:not(:first-child) {
//         border-left-color: #ddd;
//     }
//     // input{
//     //     width: 50px;
//     //     text-align: center;
//     //     border: 0;
//     //     background: #fff;
//     //     outline: none;
//     // }
//     // .input-btn{
//     //     padding: 0;
//     //     margin: 0;
//     //     height: 32px;
//     //     background: #fff;
//     //     border: 1px solid #ddd;
//     // }
//     // .addIcon,.reduceIcon{
//     //     background: #fff !important;
//     //     color:#000;
//     //     border: 1px solid #ddd;
//     //     border-right: 0;
//     // }
//     // .ivu-btn-group:not(.ivu-btn-group-vertical) .ivu-btn-primary+.ivu-btn{
//     //     border: 1px solid #ddd;
//     // }
//     // .ivu-btn-group:not(.ivu-btn-group-vertical) .ivu-btn-primary:last-child:not(:first-child){
//     //     border: 1px solid #ddd;
//     // }
// }
</style>
