
<template>
    <div class="imgLoadPage">
        <div class="top">
            温馨提示：请先在下方左侧的空白文本框中输入<span>订单号（例如：151111586397354299w）</span>，一行一个订单号进行回车输入，然后再点击查看按钮，便可以在下方右侧查看订单图片地址。
        </div>
        <div class="middle">
            <div class="left">
                <Input v-model="value" type="textarea" placeholder="请在此输入订单号，一行一个订单号" />
                <Button type="primary" @click="lookUP">查看</Button>
            </div>
            <div class="right">
                <Input v-model="url" type="textarea" placeholder="请先在左侧输入订单号点击查看按钮，方可在此处查看到订单图片地址" />
            </div>
        </div>

    </div>

</template>

<script>
import NProgress from 'nprogress'   // 引入进度条
import 'nprogress/nprogress.css'    // 引入进度条
import {unique} from "@/assets/js/tool.js";
export default {
    data() {
        return {
            // 订单号
            value: '',
            // 商品图片
            url: '',
        }
    },
    methods: {
        /**
         * 重量导出提交 
         */
        lookUP() {
            if(this.value.length === 0) {
                this.$Message.warning({
                    content: '左侧输入框订单号不能为空 !',
                    duration: 4
                });
                return false;
            }
            NProgress.start();
            // 字符串转化成数组
            let arr = this.value.trim().split('\n');
            // 数组去重再转化成字符串
            let str = unique(arr).join(',')
            this.$resetAjax({
                type: "POST",
                url: "/admin/dingdan/download_photo",
                data:{
                    sheet_nos: str
                },
                success: (res) => {
                    NProgress.done();
                    let result = JSON.parse(res).data;
                    this.value = '';
                    if(result.length === 1) {
                        this.url = result[0].join(',').replace(/,/g, "");
                    } else {
                        result.forEach(ele => {
                            this.url += `${ele.join(',').replace(/,/g, "")}`
                        });
                    }
                }
            });
        }
        
    }
}
</script>

