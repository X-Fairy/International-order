<template>
    <div id="order_contanier">
        <!-- 中间内容 -->
        <div>
            <router-view />
        </div>
       
    </div>
</template>

<script>
import order from '@/components/order/order.vue'


export default {
    components: {
        order,
        
       
    },
    data() {
        return {
          
        }
    },
    
    methods: {
        
    }
}
</script>

<style lang="less" scoped>

   
        
    
</style>



