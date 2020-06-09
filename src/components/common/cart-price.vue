<template>
    <div class="cart-price-wrap">
        <ButtonGroup>
            <Button type="primary" @click.native="reduce" :disabled="price <= multipleNum" class="reduceIcon">━</Button>
            <Button class="input-btn">
                <input type="text" :value="price" @blur="blurHandler" @keypress="pressHandler" @input="inputHandler" @paste="pasteHandler"/>
            </Button>
            <Button type="primary" @click.native="increase" class="addIcon">➕</Button>
        </ButtonGroup>
    </div>
</template>

<script>
export default {
    name: 'CartPrice',

    props: {
        multipleNum: {
            type: Number,
            // default: 6
        },
        InitPrice: {
            type: Number | String,
            default: 0
        }
    },
    data() {
        return {
            price: '0'
        }
    },

    created() {
        this.price = String(this.InitPrice);
    },

    watch: {
        /* price(val) {
            this.$emit('onChange', val);
        } */
    },

    methods: {
        reduce() {
            this.price = Number(+this.price - this.multipleNum);
            if (this.price > this.multipleNum) {
                this.price = this.price.toString();
                this.$emit('onChange', this.price);
            } else {
                this.price = this.multipleNum.toString();
            }
        },

        increase() {
            this.price = Number(+this.price + this.multipleNum).toString();
            this.$emit('onChange', this.price);
        },

        pressHandler(e) {
            if (!(e.charCode >= 48 && e.charCode <= 57)) {
                e.preventDefault();
            }
        },

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

        pasteHandler(e) {
            e.clipboardData.items[0].getAsString((str) => {
                if (!isNaN(Number(str))) {
                    e.target.value += str;
                    this.price = Number(e.target.value).toString();
                    this.$emit('onChange', this.price);
                }
            })
        },

        blurHandler(e) {
            // this.$Message.error(`亲亲，购买数量必须是${this.multipleNum}的倍数哦`);
            if (e.target.value % this.multipleNum !== 0) {
                let nextNum = e.target.value - (e.target.value % this.multipleNum);
                if (nextNum > this.multipleNum) {
                    this.price = e.target.value = nextNum.toString();
                } else {
                    this.price = e.target.value = this.multipleNum.toString();
                }
            }
            this.$emit('onBlur', this.price);
        }
    }

}
</script>

<style lang="less" scoped>
.cart-price-wrap{
    display: flex;
    input{
        width: 50px;
        text-align: center;
        border: 0;
        background: #fff;
        outline: none;
    }
    .input-btn{
        padding: 0;
        margin: 0;
        height: 32px;
        background: #fff;
        border: 1px solid #ddd;
    }
    .addIcon,.reduceIcon{
        background: #fff;
        color:#000;
        border: 1px solid #ddd;
    }
    .ivu-btn-group:not(.ivu-btn-group-vertical) .ivu-btn-primary+.ivu-btn{
        border: 1px solid #ddd;
    }
    .ivu-btn-group:not(.ivu-btn-group-vertical) .ivu-btn-primary:last-child:not(:first-child){
        border: 1px solid #ddd;
    }
    .ivu-btn-group:not(.ivu-btn-group-vertical) .ivu-btn-primary:first-child:not(:last-child) {
        border-right-color: #fff;
    }
}
</style>
