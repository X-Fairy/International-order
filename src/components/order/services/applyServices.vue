

<template>
    <div class="applyServicesPage">
        <p class="order_title">{{i18n.pageTitle}}</p>
        <!-- 步骤条 -->
        <div class="process">
            <p class="step one">{{i18n.selection}}</p>
            <p class="step two">{{i18n.logistics}}</p>
            <p class="step three">{{i18n.complete}}</p>
        </div>
        <!-- 选择商品信息 -->
        <div class="fill">
            <h3>{{i18n.fillInfo}}</h3>
            <div class="style">
                <p class="label_title">{{i18n.saleType}}</p>
                <ul class="service_label">
                    <li v-for="(item,index) in i18n.salesType" :key="index" > 
                        <p :class="{selected: typeIndex === index}" @click="selectSalesType(item,index)">{{item.content}}</p>
                    </li>
                </ul>
            </div>
            <div style="display:flex;">
                <div class="style" v-show="typeIndex!==-1" style="width:48%;display:inline-block;">
                    <p class="label_title">{{i18n.itemCode}}</p>
                    <Input v-model="goodsCode" class="goodsCode" @on-blur="getGoodsInfo"/> 
                </div>
                <div class="style" v-if="isShowGoods" style="width:48%;display:inline-block;">
                    <p class="label_title">{{i18n.itemName}}</p>
                    <Input v-model="goodsName" class="goodsName" disabled/> 
                </div>
            </div>
            <div style="display: flex;">
                <div class="style" v-if="isShowGoods" style="width:48%;display:inline-block;">
                    <p class="label_title">{{i18n.itemNum}}</p>
                    <InputNumber  v-model="goodsNum" :min="1"  class="goodsNum" @on-change="changeGoodsNum" @on-blur="getGoodsNum"></InputNumber>
                </div>
                <div class="style item5" v-show="isShowGoods" style="width:48%;display:inline-block;">
                    <!-- 申请原因 -->
                    <p class="label_title">{{i18n.reason}}</p>
                    <Input v-model="reason" type="textarea" :autosize="{maxRows: 3}" :placeholder="i18n.inputResult" style="border-radius: none;"/>
                </div>
            </div>
            <div class="style" v-if="isShowGoods">
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
        </div>
        <!-- 查看上传的图片 -->
        <Modal v-model="modal" draggable  :title="i18n.modalTitle" @on-ok="modal1=false" @on-cancel="modal1=false">
            <swiper :options="swiperOption" ref="mySwiper" v-if="isSwiperReaded">
                <!-- slides -->
                <swiper-slide  v-for="(item,index) in auditImg" :key="index">
                    <img :src="item" alt="" style="width:100%;">
                </swiper-slide>
                <!-- Optional controls -->
                <div class="swiper-pagination"  slot="pagination"></div>
                <div class="swiper-button-prev" slot="button-prev" @click="swiper.slidePrev()"></div>
                <div class="swiper-button-next" slot="button-next" @click="swiper.slideNext()"></div>
            </swiper>
        </Modal>
        <h3 v-show="serviceList.length !== 0" class="goodsInfo">{{i18n.itemListTitle}}</h3>
        <!-- 添加的商品数据列表 -->
        <div class="goodsList" v-show="serviceList.length !== 0">
            <Table :columns="columns" :data="serviceList"></Table>
        </div>
        <div v-show="isShowHandle" class="footer_apply">
            <p class="addApply" @click="addApply">{{i18n.addBtn}}</p>
            <div class="submit" @click="submitApply">{{i18n.submit}}</div>
        </div>
    </div>
 </template>




<script>
export default {
    data() {
        return {
            // 售后类型选中哪个
            typeIndex:-1,
            // 商品货号
            goodsCode: '',
            // 商品数量
            goodsNum: 0,
            // 选中哪个类型的尖
            typeid: 1,
            // 是否根据商品货号值来显示商品其他信息
            isShowGoods: false,
            // 商品名称
            goodsName: '',
            // 商品数量以什么为规格改变数量
            goodsStep: 1,
            defaultList: [],
            // 当前查看图片弹窗里图片url
            imgUrl: '',
            // 轮播配置
            swiperOption: {
                loop: true,
                autoplay:{
                    disableOnInteraction: false,
                },
                pagination: {
                    el: '.swiper-pagination',  // 分页
                    clickable: true,   // 分页小圆点可点击
                }
            },
            isSwiperReaded: true,
            // 是否显示查看图片弹窗
            visible: false,
            // 上传的图片数据
            uploadList: [],
            // 申请原因
            reason: '',
            uploadData:{},
            action: `/Home/Shouhou/uppic`,
            // 申请的商品数据
            serviceList: [],
            // 当前商品的上传图片
            auditImg: [],
            // 是否显示上传图片的弹窗
            modal: false,
            modalTitle :this.$t("applyServicesPage.modalTitle"),
            // 商品表头数据
            columns: [
                 {
                     title:this.$t("applyServicesPage.colName"),
                     align: 'center',
                     key: 'goodsName',
                 },
                 {
                     title: this.$t("applyServicesPage.colCode"),
                     align: 'center',
                     key: 'goodsCode',
                 },
                 {
                     title: this.$t("applyServicesPage.colNum"),
                     align: 'center',
                     key: 'goodsNum',
                 },
                 {
                     title: this.$t("applyServicesPage.colResult"),
                     align: 'center',
                     key: 'reason',
                     render: (h, {row}) => {
                        let texts = row.reason;
                        if (row.reason !== null) {
                            if (row.reason.length > 12) {
                                texts = row.reason.slice(0,12) + '...';
                            } else {
                                texts = row.reason;
                            }
                        }
                        return h('div', [
                            h('Tooltip', {
                                props: {
                                    placement: 'top',
                                    transfer: true
                                }
                            }, [texts, h('span', {
                                slot: 'content',
                                style: {
                                    whiteSpace: 'normal'
                                }
                            }, row.reason)
                            ])
                        ])
                    }
                 },
                 {
                    title: this.$t("applyServicesPage.pictures"),
                    align: "center",
                    key: "imgDataArr",
                    render: (h, { row }) => {
                        return (
                            row.imgDataArr.map(item => {
                                return <img src={item} class="icon_img" title={this.modalTitle} style="height:50px;cursor:pointer;margin:5px;"  onClick={() => this.picView(item)}/>
                            })
                        );
                    }                                        
                },
                 /* {
                     title:this.$t("applyServicesPage.colPic"),
                     align: 'center',
                     key: 'imgLen',
                     render: (h, {row}) => {
                         // 鼠标经过有提示
                        let text;
                        if(row.imgLen === 0) {
                            text = this.$t('applyServicesPage.picLen');
                        } else {
                            text = row.imgLen
                        }
                         return h('div', [
                             h('div', {
                                 style: {
                                     width: '100%',
                                     height: '100%',
                                     'text-align': 'center',
                                     'line-height': '48px',
                                    //  cursor: 'pointer',
                                 },
                                 domProps: {
                                    title: text === this.$t('applyServicesPage.picLen') ? this.$t("applyServicesPage.noColPic") : this.$t("applyServicesPage.viewPic")
                                 },
                                 on: {
                                     click: () => {
                                        this.modal = true;
                                        $('.ivu-btn-text').css({display: 'none'})
                                        $('.ivu-btn-primary').css({display: 'none'})
                                        // $('.ivu-btn-primary').css({background: '#d8262c',border: 0})
                                        let arr = [];
                                        row.imgData.forEach(ele =>　{
                                            arr.push(`http://ximiphoto.oss-cn-hangzhou.aliyuncs.com/shouhou/${ele}?x-oss-process=style/yuan`)
                                        })
                                        this.auditImg = arr;
                                     }
                                 }
                             }, text)
                         ])
                     }
                 }, */
                 {
                    title: this.$t("applyServicesPage.colHandle"),
                    key: 'action',
                    align: 'center',
                    render: (h, {row}) => {
                        return h('div',
                            [
                            h('Icon', {
                                props: {
                                    type: 'md-trash',
                                    size: 'small'
                                },
                                style: {
                                    cursor: 'pointer',
                                    fontSize:'16px',
                                    cursor: 'pointer',
                                },
                                domProps:{
                                    title: this.delItem,
                                },
                                on: {
                                    click: () => {
                                        let index = row._index;
                                        this.serviceList.splice(index,1)
                                    }
                                }
                            }),
                        ]);
                    }
                }
            ],
             // 是否显示添加提交按钮
             isShowHandle: false,
            //  商品货号输入提醒
            itemCodeTips:  this.$t('applyServicesPage.itemCodeTips'),
            //  商品货号输入有误提醒 
            itemCodeError:  this.$t('applyServicesPage.itemCodeError'),
            // 提醒用户提交前点添加商品信息
            addGoodsTips:  this.$t('applyServicesPage.addGoodsTips'),
            // 添加的删除提醒
            delItem: this.$t('applyServicesPage.delItem'),
            // 申请成功返回语
            applySuccessTips: this.$t('applyServicesPage.applySuccessTips'),
            // 商品货号重复
            imgrepeat: this.$t('applyServicesPage.imgrepeat'),
            // 申请售后理由不能为侬
            reasonTips: this.$t('applyServicesPage.reasonTips'),
            // 最多可以上传2张图片
            maxUpload: this.$t('applyServicesPage.maxUpload'),
            // 上传的图片格式
            maxFormatDec:this.$t('applyServicesPage.maxFormatDec'),
            // 上传的图片大小
            maxSizeDec:this.$t('applyServicesPage.maxSizeDec'),
        
        }
    },
     
     
    mounted () {
        setTimeout(() => {
            this.isSwiperReaded = true;
        }, 500)
    },
    computed: {
        swiper() {
            return this.$refs.mySwiper.swiper
        },
        i18n() {
            return this.$t('applyServicesPage')
        }
    },
    methods: {
        swiperReady() {
            this.isSwiperReaded = true;
        },  
         /**
         * 选择售后类型
         */
         selectSalesType(item, index) {
            this.typeIndex = index;
            this.typeid = item.id;
            this.serviceList.forEach(ele => {
                if(ele.goodsType !== this.typeid) {
                    this.serviceList = [];
                }
            })
             if(this.goodsCode) {
                 this.goodsCode = '';
                 this.isShowGoods = false;
             }
         },
          /**
         * 查看上传的图片
         */
        picView(url) {
            window.open(url)
        },
        /**
         * 根据货号得到商品信息
         */
        getGoodsInfo() {
            this.action =  `${location.origin}/word/public/index.php?s=/Home/Shouhou/uppic`;
            if(this.serviceList.length > 0) {
                this.serviceList.forEach(ele => {
                    if(ele.goodsCode.trim() === this.goodsCode.trim() && this.goodsCode !== '') {
                        this.isShowGoods = false;
                        this.$Message.warning({
                            content: this.imgrepeat,
                            duration: 3
                        });
                        this.goodsCode = '';
                        this.goodsNum = 0;
                        this.goodsName = '';
                        this.reason = '';
                    } else {
                        this.getItemInfo();
                    }
                }) 
            } else {
                this.getItemInfo();
            }
            
        },
        /**
         * 得到商品信息请求
         */
        getItemInfo() {
            this.$resetAjax({
                type: 'POST',
                url: `/home/Shouhou/getItemInfo`,
                data: {
                    item_no: this.goodsCode.trim(),
                    lang: localStorage.langSelect
                },
                success: (res) => {
                    if(res === '-1') {
                        this.$Message.warning({
                            content: this. itemCodeError,
                            duration: 3
                        });
                        this.goodsCode = '';
                    } else {
                        let result = JSON.parse(res)[0];
                        this.goodsName = result.item_name;
                        this.goodsStep = Number(result.purchase_spec);
                        this.goodsNum = Number(result.purchase_spec);
                        this.isShowGoods = true;
                        this.$nextTick(() => {
                            this.$refs.upload.fileList = [];
                            this.uploadList = [];
                        })
                        this.isShowHandle = true;
                    }                  
                },
            })
        },
        /**
         * 输入商品数量
         */
        changeGoodsNum(e) {
            this.goodsNum = Number(e);
        },
        /**
         * 商品数量失焦时
         */
        getGoodsNum() {
        
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
            file.url = `http://ximiphoto.oss-cn-hangzhou.aliyuncs.com/shouhou/${res}?x-oss-process=style/440`;
            this.uploadList = this.$refs.upload.fileList;
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
                // // item_no: this.goodsCode
            }
            let promise = new Promise((resolve) => {
                this.$nextTick(function () {
                    resolve(true);
                });
            });
            return promise; //通过返回一个promis对象解决
            this.upLoadImage();
            const check = this.uploadList.length < 3;
            if (!check) {
                this.$Notice.warning({
                    title: this.maxUpload
                });
            }
            return check;
        },
        /**
         * 上传图片请求接口
         */
        upLoadImage() {
            this.$resetAjax({
                type: 'POST',
                // http://order.xmvogue.com ${location.origin}
                url: `${location.origin}/word/public/index.php?s=/Home/Shouhou/uppic`,
                success: (res) => {
                },
            })
        },
         /**
          * 添加商品申请
          */
         addApply() {
            if(this.goodsName === '') {
                this.$Message.warning({
                    content: this.itemCodeTips,
                    duration: 3
                });
                return false;
            }
            if(this.reason.length === 0) {
                this.$Message.warning({
                    content: this.reasonTips,
                    duration: 3
                });
                return false;
            }
            this.serviceList.push({
                goodsName: this.goodsName,  // 商品名称
                goodsCode: this.goodsCode.trim(),  // 商品条码
                goodsNum: this.goodsNum,   // 商品数量
                reason: this.reason.trim(),       // 售后理由
                imgLen: this.uploadList.length,  // 图片数量
                imgData: this.uploadList.map(ele => ele.response),  // 申请的图片地址
                goodsType: this.typeid     // 申请售后的类型
            });
            this.serviceList.forEach(ele => {
                let arr = [];
                ele.imgData.forEach(item => {
                    arr.push(`http://ximiphoto.oss-cn-hangzhou.aliyuncs.com/shouhou/${item}?x-oss-process=style/440`)
                })
                ele.imgDataArr = arr;
            })
            this.goodsCode = '';
            this.goodsName = '';
            this.goodsNum = 0;
            this.reason = '';
            this.uploadList = []; 
            this.isShowHandle = true;
         },
         /**
          * 提交申请请求
          */
        submitApply() {
            if(this.serviceList.length == 0) {
                this.$Message.warning({
                    content: this.addGoodsTips,
                    duration: 2
                });
                return false;
            }
            let item_noarr = this.serviceList.map(ele => ele.goodsCode);
            let aqtyarr = this.serviceList.map(ele => ele.goodsNum);
            let reasonarr = this.serviceList.map(ele => ele.reason);
            let filename = [];
            if(this.serviceList.length > 0) {
                this.serviceList.forEach(ele => {
                    ele.imgData.forEach(item => {
                        filename.push(item.response)
                    })
                })
            }
            console.log(this.serviceList)
            this.$resetAjax({
                type: 'POST',
                url: `/home/Shouhou/shouhou_add`,
                data: {
                    list: this.serviceList,
                    type: this.typeid, // 售后类型
                    // item_no:item_noarr, // 商品货号
                    // aqty: aqtyarr, // 商品数量 
                    // reason: reasonarr, // 申请售后原因
                    // filename,   // 上传的图片
                },
                success: (res) => {
                    if(res === '1') {
                    // 说明申请售后成功
                    this.$Message.success({
                        content: this.applySuccessTips,
                        duration: 3
                    });
                    setTimeout(() => {
                        this.$router.push({path:'/order/servicesRecords',query: {id:4}})
                    }, 3000);
                    }                  
                },
            })
        }
    }
}
 </script>