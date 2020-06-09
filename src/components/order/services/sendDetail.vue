
  <template>
    <div class="sendDetail">
        <p class="order_title">{{i18n.pagetitle}}</p>
        <h3 class="code">{{i18n.sender}}：<span>{{serviceInfo.hdid}}</span></h3>
        <div class="info">
            <div class="process">
                <span>{{serviceInfo.type}}</span>
                <span>{{serviceInfo.status}}</span>
            </div>
            <P class="date">
                <span  :title="i18n.express_date">{{serviceInfo.addtime}}</span>
                <span>{{serviceInfo.oper_date}}</span>
            </P>
        </div>
        <Table :columns="columns" :data="serviceList"></Table>
        <ul class="detail">
            <li class="title">{{i18n.sendInfo}}</li>
            <li>{{i18n.sender}}：<span>{{serviceInfo.hdid}}</span></li>
            <li>{{i18n.express_name}}：<span>{{serviceInfo.express_name}}</span></li>
            <li>{{i18n.express_number}}：<span>{{serviceInfo.express_number}}</span></li>
            <li>{{i18n.express_fee}}：<span>￥{{serviceInfo.express_fee}}</span> </li>
           
        </ul>
        <!-- 查看上传的图片 -->
        <Modal v-model="modal"  draggable :title="i18n.modalTitle" @on-ok="modal1=false" @on-cancel="modal1=false">
            <swiper :options="swiperOption" ref="mySwiper" v-if="isSwiperReaded">
                <!-- slides -->
                <swiper-slide  v-for="(item,index) in auditImg" :key="index">
                    <img v-lazy="item.url" alt="" style="width:500px;height:500px;">
                </swiper-slide>
                <!-- Optional controls -->
                <div class="swiper-pagination"  slot="pagination"></div>
                <div class="swiper-button-prev" slot="button-prev" @click="swiper.slidePrev()"></div>
                <div class="swiper-button-next" slot="button-next" @click="swiper.slideNext()"></div>
            </swiper>
        </Modal>
        <!-- 填写退货信息 -->
        <Modal  v-model="modal2" draggable  title="填写退货信息"  @on-cancel="modal2=false" class="send_logister">
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
import NProgress from 'nprogress'   // 引入进度条
import 'nprogress/nprogress.css'    // 引入进度条
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
            itemImg: this.$t('sendDetailPage.itemImg'),
            itemName:this.$t('sendDetailPage.itemName'),
            itemNum:this.$t('sendDetailPage.itemNum'),
            itemReason: this.$t('sendDetailPage.itemReason'),
            itemUpload:this.$t('sendDetailPage.itemUpload'),
            state:this.$t('sendDetailPage.state'),
            lookDetail: this.$t('sendDetailPage.lookDetail'),
            // 售后商品表头
            columns: [
                {
                    title: this.$t('sendDetailPage.itemImg'),
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
                    title:this.$t('sendDetailPage.itemName'),
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
                    title:this.$t('sendDetailPage.itemNum'),
                    align: 'center',
                    key: 'qty'
                },
                {
                    title: this.$t('sendDetailPage.itemReason'),
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
                /* {
                    title: this.$t('sendDetailPage.itemUpload'),
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
                                        $('.ivu-btn-primary').text('关闭');
                                        $('.ivu-btn-primary').css({background: '#d8262c',border: 0})
                                        row.pics.forEach(ele =>　{
                                            ele.url = `http://ximiphoto.oss-cn-hangzhou.aliyuncs.com/shouhou/${ele.filename}?x-oss-process=style/yuan`
                                        })
                                        this.auditImg = row.pics;
                                    }
                                }
                            }, row.picsLen)
                        ])
                    }
                }, */
                /* {
                    title:this.$t('sendDetailPage.state'),
                    align: 'center',
                    key: 'statusResult',
                    
                }, */
            ],
            // 是否显示审核上传图片的弹窗
            modal: false,
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
            Untried: this.$t('sendDetailPage.Untried'),
            NotPass: this.$t('sendDetailPage.NotPass'),
            HavePass: this.$t('sendDetailPage.HavePass'),
            

        }
    },

    created() {
        // 得到网址的参数
        this.getUrlData();
        // 获取寄回产品详情
        this.getSendDetail();
    },
    computed: {
        swiper() {
            return this.$refs.mySwiper.swiper
        },
        i18n() {
            return this.$t('sendDetailPage')
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
         * 得到网址的参数
         */
        getUrlData(){
            this.urlParams = getUrlParams();
        },
        /**
         *  获取售后单详情
         */
        getSendDetail() {
            NProgress.start();
            this.$resetAjax({
                type: 'POST',
                url: `/home/Shouhou/sh_express_view&mid=${this.urlParams.mid}`,
                success: (res) => {
                    NProgress.done();
                    let result = JSON.parse(res);
                    switch(localStorage.langSelect) {
                            case '0':
                                switch(result.info.type) {
                                    case 1:
                                        result.info.type = '调换';
                                        break;
                                    case 2:
                                        result.info.type = '坏货';
                                        break;
                                    case 0:
                                        result.info.type = '其他原因';
                                        break;
                                }
                                switch(result.info.status) {
                                    case 0:
                                        result.info.status = '未处理';
                                        break;
                                    case 1:
                                        result.info.status = '清点';
                                        break;
                                    case 2:
                                        result.info.status = '已完成';
                                        break;
                                }
                                break;
                            case '1':
                                switch(result.info.type) {
                                    case 1:
                                        result.info.type = 'Exchange commodities';
                                        break;
                                    case 2:
                                        result.info.type = 'quality problem';
                                        break;
                                    case 0:
                                        result.info.type = 'Other Reasons ';
                                        break;
                                }
                                switch(result.info.status) {
                                    case 0:
                                        result.info.status = 'Unhandled';
                                        break;
                                    case 1:
                                        result.info.status = 'Inventory';
                                        break;
                                    case 2:
                                        result.info.status = 'Completed';
                                        break;
                                }
                                break;
                        }
                    this.serviceInfo = result.info;
                    result.list.forEach(ele => {
                        ele.imgUrl = `http://img.xmvogue.com/thumb/${ele.item_no}.jpg?x-oss-process=style/440`
                        if(ele.reason === null) {
                            switch(localStorage.langSelect) {
                                case '0':
                                    ele.reason = '无';
                                    break;
                                case '1':
                                    ele.reason = 'Null';
                            }

                        }
                    })
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
