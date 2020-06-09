<template>
    <!-- 提示框 -->
    <div class="tip">
        <Button type="primary" class="success">{{tipContent}}</Button>
    </div>
</template>

<script>
export default {
    props: {
        // 提示框文本
        tipContent: String,
        required: true,
    }
}
</script>


<style lang="less" scoped>
.success{
        z-index: 1000000;
        position: fixed;
        left:45%;
        top: 50%;
        margin: 0 auto;
        height: 44px;
        font-size: 16px;
        padding: 5px 10px;
        background-color: #1596ad;
        border:0;
    }
</style>