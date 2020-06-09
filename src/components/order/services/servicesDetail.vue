<template>
    <div class="servicesDetailPage">
        <p class="order_title">{{i18n.pageTitle}}</p>
        <h3 class="code">{{i18n.number}}：<span>{{serviceInfo.shsn}}</span></h3>
        <div class="info">
            <div class="process">
                <span>{{serviceInfo.lx}}</span>
                <span>{{serviceInfo.zt}}</span>
            </div>
            <P class="date">
                <span>{{serviceInfo.sqrq}}</span>
                <span>{{serviceInfo.shsj}}</span>
            </P>
        </div>
        <Table :columns="columns" :data="serviceList"></Table>
        <ul class="detail">
            <li class="title"><span>{{i18n.serviceInfo}}</span></li>
            <li>{{i18n.number}}：<span>{{serviceInfo.shsn}}</span></li>
            <li>{{i18n.serviceType}}：<span>{{serviceInfo.lx}}</span></li>
            <li>{{i18n.itemTotal}}：<span>{{serviceInfo.qty}}</span></li>
            <li>
                {{i18n.serviceProce}}：<span>{{serviceInfo.zt}}</span>
                <!-- <span v-show="isReturn" class="return" @click="returnInfo">填写退货信息</span> -->
            </li>
            <li>{{i18n.linkMan}}： &nbsp;&nbsp;<span>{{serviceInfo.user_name}}</span></li>
        </ul>
        <!-- 查看上传的图片 -->
        <Modal v-model="modal" draggable  :title="i18n.modalTitle" @on-ok="modal1=false" @on-cancel="modal1=false" class="carousel_servicesDetailPage">
            <swiper :options="swiperOption" ref="mySwiper" v-if="isSwiperReaded"> 
                <swiper-slide  v-for="(item,index) in auditImg" :key="index">
                    <img v-lazy="item.url" alt="" style="width:500px;">
                </swiper-slide>
                <div class="swiper-pagination"  slot="pagination"></div>
                <div class="swiper-button-prev" slot="button-prev" @click="swiper.slidePrev()"></div>
                <div class="swiper-button-next" slot="button-next" @click="swiper.slideNext()"></div>
            </swiper>
        </Modal>
        <!-- 填写退货信息 -->
        <Modal  v-model="modal2"  draggable title="填写退货信息"  @on-cancel="modal2=false" class="logister">
             <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
                <FormItem label="物流公司" prop="company">
                    <Input v-model="formValidate.company" placeholder="请输入物流公司名称..." />
                </FormItem>
                <FormItem label="物流单号" prop="documentNum">
                    <Input v-model="formValidate.documentNum" placeholder="请输入物流单号..." />
                </FormItem>
            </Form>
            <div class="modal_footer" @click="asyncOK">
                <Button>保存</Button>
            </div>
        </Modal>
    </div>
</template>


        



<script>
import {getUrlParams} from  '@/assets/js/tool.js'
export default {
    data() {
        return {
             // 得到网址的参数对象
            urlParams: {},
            // 售后单大体详情
            serviceInfo: {},
            // 售后商品列表
            serviceList: [],
            // 折叠面板标题
            itemImg: this.$t('servicesDetailPage.itemImg'),
            itemName:this.$t('servicesDetailPage.itemName'),
            itemNum:this.$t('servicesDetailPage.itemNum'),
            itemReason: this.$t('servicesDetailPage.itemReason'),
            itemUpload:this.$t('servicesDetailPage.itemUpload'),
            state:this.$t('servicesDetailPage.state'),
            lookDetail: this.$t('servicesDetailPage.lookDetail'),
            modalTitle :this.$t("applyServicesPage.modalTitle"),
            uploadPic: this.$t("applyServicesPage.uploadPic"),
            // 售后商品表头
            columns: [
                {
                    title: this.$t('servicesDetailPage.itemImg'),
                    align: 'center',
                    key: '',
                    // 单元格插入图片
                    render: (h, {row}) => {
                        return h('img', {
                            style: {
                                //设置样式
                                width: row.imgUrl ? '80px' : '',
                                'height': row.imgUrl ? '80px' : '',
                                'border-radius': '5%',
                                border: 0,
                                cursor: 'pointer'
                            },
                            attrs: {
                                //设置属性
                                src: row.imgUrl ? row.imgUrl : '',
                                onerror:'this.src="http://dh.xmcpcn.com/Public/images/none.jpg"'
                            },
                            on: {
                                click: () => {
                                    window.open(row.imgUrl)
                                }
                            }

                        });
                    }

                },
                {
                    title:this.$t('servicesDetailPage.itemName'),
                    align: 'center',
                    key: '',
                    render: (h, params) => {
                        // 鼠标经过有提示
                        return h('div', [
                            h('span', {
                                style: {
                                    display: 'inline-block',
                                    width: '100%',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap',
                                },
                                domProps: {
                                    title: params.row.item_name
                                }
                            }, params.row.item_name),
                            h('span', {
                                style: {
                                    display: params.row.item_en === null ? '' : 'inline-block',
                                    width: '100%',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap',
                                },
                                domProps: {
                                    title: params.row.item_no
                                }
                            }, params.row.item_no)
                        ])
                    }
                },
                {
                    title:this.$t('servicesDetailPage.itemNum'),
                    align: 'center',
                    key: 'qty'
                },
                {
                    title: this.$t('servicesDetailPage.itemReason'),
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
                    title: this.$t('servicesDetailPage.uploadPic'),
                    align: "center",
                    key: "pics",
                    render: (h, { row }) => {
                        return (
                            row.pics.map(item => {
                                return <img src={item.url} class="icon_img" title={this.modalTitle} style="height:50px;cursor:pointer;margin:5px;"  onClick={() => this.picView(item.url)}/>
                            })
                        );
                    }                                        
                },
                /* {
                    title: this.$t('servicesDetailPage.itemUpload'),
                    align: 'center',
                    key: 'picsLen',
                    render: (h, {row}) => {
                        // 鼠标经过有提示
                        return h('div', [
                            h('div', {
                                style: {
                                    width: '100%',
                                    height: '100%',
                                    'text-align': 'center',
                                    'line-height': '95px',
                                    cursor: 'pointer',
                                },
                                domProps: {
                                    title: this.lookDetail
                                },
                                on: {
                                    click: () => {
                                        this.modal = true;
                                        $('.ivu-btn-text').css({display: 'none'})
                                        $('.ivu-btn-primary').css({display: 'none'})
                                        // $('.ivu-btn-primary').css({background: '#d8262c',border: 0})
                                        row.pics.forEach(ele =>　{
                                            ele.url = `http://ximiphoto.oss-cn-hangzhou.aliyuncs.com/shouhou/${ele.filename}?x-oss-process=style/yuan`
                                        })
                                        console.log(row.pics, 'row')
                                        this.auditImg = row.pics;
                                    }
                                }
                            }, row.picsLen)
                        ])
                    }
                }, */
                {
                    title:this.$t('servicesDetailPage.state'),
                    align: 'center',
                    key: 'statusResult',
                },
            ],
            // 是否显示审核上传图片的弹窗
            modal: false,
            // 轮播配置
            swiperOption: {
                loop: true,
                autoplay:true,                                   // 设置为true启动自动切换
                speed: 500,                                     // 切换速度，即slider自动滑动开始到结束的时间（单位ms）
                effect : 'coverflow',
                mousewheel: true,
                pagination: {
                    el: '.swiper-pagination',  // 分页
                    clickable: true,   // 分页小圆点可点击
                }
            },
            isSwiperReaded: true,
            // 当前商品的审核图片
            auditImg: [],
            // 是否显示退货信息按钮
            // isReturn: false,
            // 是否显示物流公司填写弹窗
            modal2: false,
            // 填写物流公司表
            formValidate: {
                company: '', // 物流公司名字
                documentNum : '', // 物流单号
            },
            // 表单验证规则
            ruleValidate: {
                company: [
                    { required: true, message: '物流公司不能为空', trigger: 'blur' }
                ],
                documentNum: [
                    { required: true, message: '物流单号不能为空', trigger: 'blur' },
                ],
            },
            Untried: this.$t('servicesDetailPage.Untried'),
            NotPass: this.$t('servicesDetailPage.NotPass'),
            HavePass: this.$t('servicesDetailPage.HavePass'),
            

        }
    },

    created() {
        // 得到网址的参数
        this.getUrlData();
        // 获取售后单详情
        this.getServiceDetail();
    },
    computed: {
        swiper() {
            return this.$refs.mySwiper.swiper
        },
        i18n() {
            return this.$t('servicesDetailPage')
        }
    },
    mounted() {
        setTimeout(() => {
            this.isSwiperReaded = true;
        }, 500)

    },

    methods:{
        swiperReady() {
            this.isSwiperReaded = true;
        },
        /**
         * 查看上传的图片
         */
        picView(url) {
            window.open(url)
        },
        /**
         * 得到网址的参数
         */
        getUrlData(){
            this.urlParams = getUrlParams();
        },
        /**
         *  获取售后单详情
         */
        getServiceDetail() {
            this.$resetAjax({
                type: 'POST',
                url: `/home/Shouhou/shouhou_view`,
                data: {
                    mid:this.urlParams.mid,
                    lang: localStorage.langSelect
                },
                success: (res) => {
                    let result = JSON.parse(res);
                    if(result.info.zt === '待退货') {
                    } else if(result.info.zt === '待收货') {
                        
                    }
                    // 更改返回的时间为false的时候默认为等待中。
                    if(result.info.shsj === false) {
                        result.info.shsj = '等待中。。。'
                    }
                    this.serviceInfo = result.info[0];
                    result.list.forEach(ele => {
                        ele.imgUrl = `http://img.xmvogue.com/thumb/${ele.item_no}.jpg?x-oss-process=style/440`;
                        switch(ele.status) {
                            case 0:
                                ele.statusResult = this.Untried;
                                this.serviceInfo.status = this.Untried;
                                break;
                            case 1:
                                ele.statusResult = this.NotPass;
                                this.serviceInfo.status = this.NotPass;
                                break;
                            default:
                                ele.statusResult = this.HavePass;
                                this.serviceInfo.status = this.HavePass;
                        };
                        ele.picsLen = ele.pics.length === 0 ? '' : ele.pics.length;
                        ele.pics.forEach(item =>　{
                            item.url = `http://ximiphoto.oss-cn-hangzhou.aliyuncs.com/shouhou/${item.filename}?x-oss-process=style/yuan`
                        })
                    });
                    this.serviceList = result.list;
                },
            })
        },
        /**
         * 填写退货信息准备工作
         */
        returnInfo() {
            $('.ivu-btn-primary').text('保存');
            this.modal2 = true;
        },
        /**
         * 填写退货信息请求
         */
        asyncOK() {
            this.$refs.formValidate.validate((valid) => {
                if (valid) {
                    this.$resetAjax({
                        type: 'POST',
                        url: `/index.php/Somego/User/txth`,
                        data: {
                            mid: this.urlParams.id,   // 当前服务单id
                            gs: this.formValidate.company,  // 退货公司名称
                            dh: this.formValidate.documentNum // 退货公司单号
                        },
                        success: (res) => {
                            this.modal2 = false;
                            this.$Message.success('填写成功，售后收到后将会即时清点');
                            this.getServiceDetail();
                        },
                    })
                } 
            })
        }
    }
}
</script>
