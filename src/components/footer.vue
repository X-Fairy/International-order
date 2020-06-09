<template>
    <div class="footer">
       <div class="footer_content">
          <ul>
              <li v-for="(item,index) in footers" :key="index">{{$t(item)}}</li>
          </ul>
          <p @click="openGw" class="gw">{{$t('footerPage.name')}}</p>
       </div>
    </div>
</template>
<script>
import bus from '@/assets/js/eventBus.js'
export default {
    data(){
        return{
            footers: ['footers.xibin', 'footers.bing','footers.duckduckGo','footers.apple','footers.youtube','footers.ilike','footers.swicon','footers.window','footers.orange']
        }
    },

    mounted(){
       
    },
    computed: {
       
    },
    methods: {
        openGw() {
           window.open('http://www.xmcpcn.com/')
       }
    }
}
</script>

