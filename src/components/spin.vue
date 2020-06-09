<template>
    <!-- 加载提示中提示框 -->
    <div class="demo-spin-col">
        <Spin fix>
            <Icon type="load-c" size=18 class="demo-spin-icon-load"></Icon>
            <div style="font-size:16px;color:#1d8c9f;">数据正在加载中,请稍侯...</div>
        </Spin>
    </div>
</template>

<script>
export default {
    props: {
        
    }
}
</script>


<style lang="less" scoped>
.demo-spin-col{
    height: 100px;
    position: relative;
    border: 1px solid #eee;
}
.demo-spin-icon-load{
    animation: ani-demo-spin 1s linear infinite;
}
.demo-spin-col {
    height: 100px;
    position: relative;
    border: 1px solid #eee;
    height: 100%;
}
.ivu-spin-fix .ivu-spin-main {
    position: absolute;
    top: 45%;
    left: 45%;
    transform: translate(-50%,-50%);
}
</style>
