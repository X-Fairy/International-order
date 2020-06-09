<template>
    <FormItem @click.native="focusInput" :prop="validateKey">
        <i :class="['iconfont', icon,'login_icon', {mail_icon: selected}]" style="font-size:22px;"><span>{{label}}</span></i>
        <!-- :class="{mail_shadow: selected}"   -->
        <Input ref="input" :value="value" :type="type" @on-change="changeHandler" @on-blur="blurInput" @on-focus="isFocus=true;"/>
    </FormItem>
</template>

<script>
export default {
    props: {
        label: {
            type: String,
            default: '标签',
        },
        icon: {
            // icon-youxiang
            type: String,
            default: '',
        },
        value: {
            type: String,
            default: '',
        },
        type: {
            type: String,
            default: 'text'
        },
        validateKey: {
            type: String,
            default: '',
        }
    },
    model: {
        prop: 'value',
        event: 'change'
    },
    data() {
        return {
            // 是否聚焦
            isFocus: false, 
        }
    },

    computed: {
        selected() {
            return this.isFocus || this.value.length > 0
        },
    },
    methods: {
        /**
         * input失去焦点 
         */
        blurInput() {
            this.isFocus = false;
        },
        /**
         * input事件上报 
         */
        changeHandler(e) {
            this.$emit('change', e.target.value)
        },
        /**
         * input聚焦 
         */ 
        focusInput() {
            this.isFocus = true;
            this.$refs.input.focus();
        }
    }
    
}
</script>

<style lang="less" scoped>
.mail_shadow{
    box-shadow: 2px 2px 4px rgba(32,140,159,.4);
}
.mail_icon{
    font-size: 14px;
    top:-22px !important;
    color:#080158 ;
}
</style>

