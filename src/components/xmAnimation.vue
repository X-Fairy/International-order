<template>
    <div>
        <slot name="animation"></slot>
    </div>
</template>

<script>
export default {
    data() {
        return {
            // 所有需要监听的div
            aniNode: []
        }
    },

    mounted() {
        this.aniNode = this.$el.querySelectorAll('.ani-session');
        this.listenerScroll();
        window.addEventListener('scroll', this.listenerScroll);
    },

    beforeDestroy() {
        window.removeEventListener('scroll', this.listenerScroll);
    },

    methods: {
        listenerScroll() {
            // 滚动条高度
            let _scrollTop = document.documentElement.scrollTop;
            // 页面高度
            let _clientHeight = document.documentElement.clientHeight;
            // 滚动条底部到页面底部的距离：滚动条+页面高度；
            let _scrollBot = _scrollTop + _clientHeight;
            this.aniNode.forEach(node => {
                // 元素到顶部的距离
                let _top = $(node).offset().top - 100;
                (_scrollBot >= _top) && $(node).addClass('ani-active');
            });
        }
    }
}
</script>

<style lang="less" scoped>
.ani-session{
    opacity: 0;
    transform: translate(0,100px);
    transition-timing-function: cubic-bezier(.175,.885,.32,1.275);
    transition-duration: 1s;
}
.ani-session.ani-active{
    transform: translate(0,0);
    transition-delay: .2s;
    opacity: 1;
}
</style>
