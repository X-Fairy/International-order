<template>
    <div class="sendBack" id="sendBack">
        <p class="order_title">{{i18n.pagetitle}}</p>
        <!-- 步骤条 -->
        <div class="process">
            <p class="step one">{{i18n.products}}</p>
            <p class="step two">{{i18n.fill}}</p>
            <p class="step three">{{i18n.complete}}</p>
        </div>
        <h3 class="fill_title" style="margin-top:20px;">{{i18n.goodsBack}}</h3>
        <!-- 产品列表 -->
        <Table :columns="columns" :data="tableData" class="table" border></Table>
        <div class="fill" v-show="isFill">
            <h3 class="fill_title">{{i18n.logistics}}</h3>
            <Form ref="formValidate" :model="formValidate" :rules="ruleValidate">
                <FormItem :label="i18n.company" prop="company" class="style">
                    <Input v-model="formValidate.company" />
                </FormItem>
                <FormItem :label="i18n.oddNum" prop="oddNum" class="style">
                    <Input v-model="formValidate.oddNum" />
                </FormItem>
                <FormItem :label="i18n.freight" prop="freight" class="style">
                    <Input v-model="formValidate.freight" />
                </FormItem>
            </Form>
            <div class="style">
                <p class="label_title">{{i18n.upLoad}}</p>
                <!-- 上传照片 -->
                <div class="demo-upload-list" v-for="(item,index) in uploadList" :key="index">
                    <template v-if="item.status === 'finished'">
                        <img :src="item.url">
                        <div class="demo-upload-list-cover">
                            <Icon type="ios-eye-outline" @click.native="handleView(item)"></Icon>
                            <Icon type="ios-trash-outline" @click.native="handleRemove(item)"></Icon>
                        </div>
                    </template>
                    <template v-else>
                        <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
                    </template>
                </div>
                <Upload
                    ref="upload"
                    :show-upload-list="false"
                    :default-file-list="defaultList"
                    :on-success="handleSuccess"
                    :format="['jpg','jpeg','png']"
                    :max-size="2048"
                    :on-format-error="handleFormatError"
                    :on-exceeded-size="handleMaxSize"
                    :before-upload="handleBeforeUpload"
                    multiple
                    type="drag"
                    :data="uploadData" 
                    :action="action"
                    style="display: inline-block;width:58px;">
                    <div style="width: 58px;height:58px;line-height: 58px;">
                        <Icon type="ios-camera" size="20"></Icon>
                    </div>
                </Upload>
                <Modal :title="i18n.viewPic"  draggable v-model="visible">
                    <img :src="imgUrl" v-if="visible" style="width: 100%">
                </Modal>
            </div>
            <div class="submit" @click="submitApply(formValidate)">{{i18n.submit}}</div>
        </div>
    </div>
</template>
<script>

import {getUrlParams} from  '@/assets/js/tool.js'

export default {
    data() {
        return {
            // 表格表头
            columns: [
                {
                    title: this.$t('sendBackPage.itemName'),
                    key: 'item_name',
                    align: 'center'
                },
                {
                    title: this.$t('sendBackPage.itemCode'),
                    key: 'item_no',
                    align: 'center'
                },
                {
                    title: this.$t('sendBackPage.itemNum'),
                    key: 'tqty',
                    align: 'center'
                }
            ],
            // 表格数据
            tableData: [],
            // 提交成功提示
            applySuccessTips: this.$t('sendBackPage.applySuccessTips'),
            inputcompany:  this.$t('sendBackPage.inputcompany'),
            inputoddNum:  this.$t('sendBackPage.inputoddNum'),
            inputfreight:  this.$t('sendBackPage.inputfreight'),
            // 得到网址的参数对象
            urlParams: {},
            // 物流公司名称
            company: '',
            // 物流单号
            oddNum: '',
            // 运费
            freight: '',
            defaultList: [],
            // 当前查看图片弹窗里图片url
            imgUrl: '',
            // 是否显示查看图片弹窗
            visible: false,
            // 上传的图片数据
            uploadList: [],
            // 申请原因
            reason: '',
            uploadData:{},
            action: `${location.origin}/word/public/index.php?s=/Home/Shouhou/uppic`,
            formValidate:{
                // 物流公司名称
                company: '',
                // 物流单号
                oddNum: '',
                // 运费
                freight: '',
            },
            ruleValidate: {
                company: [
                    { required: true, message: this.$t('sendBackPage.inputcompany'), trigger: 'blur' }
                ],
                oddNum: [
                    { required: true, message: this.$t('sendBackPage.inputoddNum'), trigger: 'blur' },
                ],
                freight: [
                    { required: true, message: this.$t('sendBackPage.inputfreight'), trigger: 'blur' }
                ],
            },
            // 是否显示填写功能
            isFill: false,
            // 数据为空先申请售后记录
            sendbefore: this.$t('sendBackPage.sendbefore'),
            // 最多可以上传2张图片
            maxUpload: this.$t('applyServicesPage.maxUpload'),
            // 上传的图片格式
            maxFormatDec:this.$t('applyServicesPage.maxFormatDec'),
            // 上传的图片大小
            maxSizeDec:this.$t('applyServicesPage.maxSizeDec'),
            
        }
    },
    computed:{
        i18n() {
            return this.$t('sendBackPage')
        }
    },
    mounted () {
        this.uploadList = this.$refs.upload.fileList;
    },

    created() {
        // 得到网址的参数
        this.getUrlData();
        // 得到商品的列表
        this.getGoodsList();
        
       
    },
     methods:{
        /**
         * 得到网址的参数
         */
        getUrlData(){
            this.urlParams = getUrlParams();
        },
        /**
         * 得到商品的列表
         */
        getGoodsList() {
            this.$resetAjax({
                type: 'POST',
                url: `home/Shouhou/sh_express`,
                data: {
                    lang: localStorage.langSelect
                },
                success: (res) => {
                    let result = JSON.parse(res);
                    if(result.list.length === 0 || result.list.length === null) {
                        this.isFill = false;
                        this.$Message.info({
                            background: true,
                            content: this.sendbefore,
                            duration: 8
                        });
                        return false;
                    }
                    this.tableData = result.list;
                    this.isFill = true;
                },
            })
        },
        /**
         * 查看上传的图片
         */
        handleView (item) {
            this.imgUrl = item.url;
            this.visible = true;
        },
        /**
         * 删除上传的图片
         */
        handleRemove (file) {
            const fileList = this.$refs.upload.fileList;
            this.$refs.upload.fileList.splice(fileList.indexOf(file), 1);
        },
        /**
         * 上传的图片成功返回图片的信息
         */
        handleSuccess (res, file) {
            file.url = res;
            file.url = `http://ximiphoto.oss-cn-hangzhou.aliyuncs.com/shouhou/${res}?x-oss-process=style/440`;
        },
        /**
         * 对上传的图片进行格式判断
         */
        handleFormatError (file) {
            this.$Message.warning({
                content: this.maxFormatDec,
                duration: 3
            });
        },
        /**
         * 对上传的图片进行大小判断
         */
        handleMaxSize (file) {
            this.$Message.warning({
                content: this.maxSizeDec,
                duration: 3
            });
        },
        /**
         * 对上传的图片进行数量限制
         */
        handleBeforeUpload () {
            if(this.uploadList.length > 1) {
                this.$Message.warning({
                    content: this.maxUpload,
                    duration: 3
                });
                return false;
            }
            this.uploadData = {
                hdid: this.$root.userData.hdid,
                item_no: this.goodsCode
            }
            let promise = new Promise((resolve) => {
                this.$nextTick(function () {
                    resolve(true);
                });
            });
            return promise; //通过返回一个promis对象解决
            this.upLoadImage();
            const check = this.uploadList.length < 10;
            /* if (!check) {
                this.$Notice.warning({
                    title: '最多可以上传10张图片。'
                });
            } */
            return check;
        },
        /**
         * 上传图片请求接口
         */
        upLoadImage() {
            this.$resetAjax({
                type: 'POST',
                url: `${location.origin}/word/public/index.php?s=/Home/Shouhou/uppic`,
                success: (res) => {

                },
            })
        },
        /**
         * 提交申请判断
         */
        submitApply() {
            this.$refs.formValidate.validate((valid) => {
                if (valid) {
                    this.submitQuery();
                }
            })
        },
        /**
         * 提交请求
         */
        submitQuery() {
            this.$resetAjax({
                type: 'POST',
                url: `/home/Shouhou/sh_express_add`,
                data: {
                    express_name: this.formValidate.company,  // （快递公司名字）
                    express_number: this.formValidate.oddNum,  // （快递单号）
                    express_fee: this.formValidate.freight, // （运费）
                    express_img: this.uploadList.map(ele => ele.url),  //（运费面单），
                    item_no: this.tableData.map(ele => ele.item_no),  // 商品code
                    num: this.tableData.map(ele => ele.tqty),  // 数量
                },
                success: (res) => {
                    if(res === '1') {
                        this.$Message.success({
                            content: this.applySuccessTips,
                            duration: 3
                        });
                        this.$router.push({path: 'servicesRecords'})
                    }
                },
            })
        }
     }
}
</script>
