<template>
    <div class="reservePage">
        <div class="top">
            <div class="top_left">
                <p @click="newAdd">新增</p>
            </div>
            <div class="top_select">
                 <div class="item">
                    <span class="item_title">状态：</span>
                    <Select style="width:150px" v-model="statusValue" clearable @on-change="changeStatus">
                        <Option v-for="item in statusList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                </div>
                <div class="item">
                    <span class="item_title">名称：</span>
                    <Input v-model="keyValue" placeholder="请输入商品名称/条码" style="width: 150px" @on-change="currentPage=1" @on-enter="getReserveData" @on-blur="getReserveData"/>
                </div>
                <div class="item">
                    <span class="item_title">时间：</span>
                    <DatePicker v-model="timeValue" format="yyyy-MM-dd  HH:mm:ss" type="daterange" placement="bottom-end" placeholder="请选择截止时间" style="width: 320px" @on-change="changeDateRange"></DatePicker>
                </div>
            </div>
        </div>
        <div class="table">
            <Table :height="tableHeight" border  :columns="columns" :data="reserveList" ></Table>  
        </div>
        <div class="pageContanier">
            <Page :total="total" :page-size="pageSize" @on-change="changePage" :current="currentPage" show-elevator show-total></Page>
        </div>
        <!-- 预定商品增加、编辑抽屉 -->
        <Drawer :title="drawerTitle" v-model="valueDrawer" width="720" :mask-closable="true" :styles="styles" class="reservePage_drawer" draggable @on-close="valueDrawer=false;">
            <Form :model="formData" ref="formData" :rules="ruleValidate">
                <Row :gutter="32">
                    <i-Col span="12">
                        <FormItem label="名称（中文）" prop="item_name" label-position="top">
                            <Input v-model="formData.item_name" placeholder="请输入商品中文名称" />
                        </FormItem>
                    </i-Col>
                    <i-Col span="12">
                        <FormItem label="名称（英文）" prop="item_en" label-position="top">
                            <Input v-model="formData.item_en" placeholder="请输入商品英文名称" />
                        </FormItem>
                    </i-Col>
                </Row>
                <Row :gutter="32" class="specil_col">
                    <i-Col span="12">
                        <FormItem label="规格" prop="purchase_spec" label-position="top">
                            <InputNumber :min="1" v-model="formData.purchase_spec" placeholder="请输入商品规格数量"></InputNumber>
                        </FormItem>
                    </i-Col>
                    <i-Col span="12">
                        <FormItem label="箱规" prop="lot_spec" label-position="top">
                            <InputNumber :min="1" v-model="formData.lot_spec" placeholder="请输入商品箱规数量"></InputNumber>
                        </FormItem>
                    </i-Col>
                </Row>
                <Row :gutter="32" class="specil_col">
                    <i-Col span="12">
                        <FormItem label="条码" prop="item_no" label-position="top">
                            <Input  v-model="formData.item_no" placeholder="请输入商品条码" />
                        </FormItem>
                    </i-Col>
                    <i-Col span="12">
                        <FormItem label="预售目标数量" prop="target" label-position="top">
                            <InputNumber :min="1" v-model="formData.target" placeholder="请输入预售目标数量"></InputNumber>
                        </FormItem>
                    </i-Col>
                </Row>
                 <Row :gutter="32" class="specil_col">
                    <i-Col span="12">
                        <FormItem label="生产周期" prop="lead_time" label-position="top">
                            <InputNumber :min="1" v-model="formData.lead_time" placeholder="请输入生产周期"></InputNumber>
                        </FormItem>
                    </i-Col>
                </Row>
                <Row :gutter="32" class="specil_col">
                    <i-Col span="12">
                        <FormItem label="进价" prop="base_price" label-position="top">
                            <InputNumber :min="0" v-model="formData.base_price" placeholder="请输入商品进价金额"></InputNumber>
                        </FormItem>
                    </i-Col>
                    <i-Col span="12">
                        <FormItem label="售价" prop="sale_price" label-position="top">
                            <InputNumber :min="0" v-model="formData.sale_price" placeholder="请输入商品售价金额"></InputNumber>
                        </FormItem>
                    </i-Col>
                </Row>
                <Row :gutter="32" class="specil_col">
                    <i-Col span="12">
                        <FormItem label="预计到货日期" prop="arrival" label-position="top">
                            <DatePicker type="date" :options="options" v-model="formData.arrival" placeholder="请选择预计到货日期" ></DatePicker>
                        </FormItem>
                    </i-Col>
                    <i-Col span="12">
                        <FormItem label="预售截止日期" prop="deadline" label-position="top">
                            <DatePicker type="date" :options="options" v-model="formData.deadline" placeholder="请选择预售截止日期" ></DatePicker>
                        </FormItem>
                    </i-Col>
                </Row>
                <Row :gutter="32">
                    <i-Col span="12">
                        <FormItem label="材质（中文）" prop="material" label-position="top">
                            <Input v-model="formData.material" placeholder="请输入商品中文材质" />
                        </FormItem>
                    </i-Col>
                    <i-Col span="12">
                        <FormItem label="材质（英文）" prop="material_en" label-position="top">
                            <Input v-model="formData.material_en" placeholder="请输入商品英文材质" />
                        </FormItem>
                    </i-Col>
                </Row>
                <Row :gutter="32">
                    <i-Col span="12">
                        <FormItem label="尺寸（中文）" prop="lwh" label-position="top">
                            <Input v-model="formData.lwh" placeholder="请输入商品中文尺寸" />
                        </FormItem>
                    </i-Col>
                    <i-Col span="12">
                        <FormItem label="尺寸（英文）" prop="lwh_en" label-position="top">
                            <Input v-model="formData.lwh_en" placeholder="请输入商品英文尺寸" />
                        </FormItem>
                    </i-Col>
                </Row>
                <Row :gutter="32">
                    <i-Col span="12">
                        <FormItem label="重量（中文）" prop="weight" label-position="top">
                            <Input v-model="formData.weight" placeholder="请输入商品中文重量" />
                        </FormItem>
                    </i-Col>
                    <i-Col span="12">
                        <FormItem label="重量（英文）" prop="weight_en" label-position="top">
                            <Input v-model="formData.weight_en" placeholder="请输入商品英文重量" />
                        </FormItem>
                    </i-Col>
                </Row>
                <Row :gutter="32">
                    <i-Col span="12">
                        <FormItem label="填充物（中文）" prop="stuffing" label-position="top">
                            <Input v-model="formData.stuffing" placeholder="请输入商品中文填充物" />
                        </FormItem>
                    </i-Col>
                    <i-Col span="12">
                        <FormItem label="填充物（英文）" prop="stuffing_en" label-position="top">
                            <Input v-model="formData.stuffing_en" placeholder="请输入商品英文填充物" />
                        </FormItem>
                    </i-Col>
                </Row>
                <Row :gutter="32">
                    <i-Col span="12">
                        <FormItem label="警告语（中文）" prop="caution" label-position="top">
                            <Input v-model="formData.caution" type="textarea" :autosize="true" placeholder="请输入商品中文警告语" />
                        </FormItem>
                    </i-Col>
                    <i-Col span="12">
                        <FormItem label="警告语（英文）" prop="caution_en" label-position="top">
                            <Input v-model="formData.caution_en" type="textarea" :autosize="true" placeholder="请输入商品英文警告语" />
                        </FormItem>
                    </i-Col>
                </Row> 
                <Row :gutter="32">
                    <i-Col span="12">
                        <FormItem label="产品特点 （中文）" prop="features" label-position="top">
                            <Input v-model="formData.features" type="textarea" :autosize="true" placeholder="请输入商品中文产品特点 " />
                        </FormItem>
                    </i-Col>
                    <i-Col span="12">
                        <FormItem label="产品特点 （英文）" prop="features_en" label-position="top">
                            <Input v-model="formData.features_en" type="textarea" :autosize="true" placeholder="请输入商品英文产品特点 " />
                        </FormItem>
                    </i-Col>
                </Row>
                <Row :gutter="32">
                    <i-Col span="12">
                        <FormItem label="使用方法（中文）" prop="usage" label-position="top">
                            <Input v-model="formData.usage" type="textarea" :autosize="true" placeholder="请输入商品中文使用方法" />
                        </FormItem>
                    </i-Col>
                    <i-Col span="12">
                        <FormItem label="使用方法（英文）" prop="usage_en" label-position="top">
                            <Input v-model="formData.usage_en" type="textarea" :autosize="true" placeholder="请输入商品英文使用方法" />
                        </FormItem>
                    </i-Col>
                </Row>   
                <Row :gutter="32">
                    <i-Col span="12">
                        <FormItem label="注意事项（中文）" prop="notes" label-position="top">
                            <Input v-model="formData.notes" type="textarea" :autosize="true" placeholder="请输入商品中文注意事项" />
                        </FormItem>
                    </i-Col>
                    <i-Col span="12">
                        <FormItem label="注意事项（英文）" prop="notes_en" label-position="top">
                            <Input v-model="formData.notes_en" type="textarea" :autosize="true" placeholder="请输入商品英文注意事项" />
                        </FormItem>
                    </i-Col>
                </Row>   
                <Row :gutter="32">
                    <i-Col span="12">
                        <div class="style">
                            <p class="label_title">上传商品主图</p>
                            <!-- 上传照片 -->
                            <div class="demo-upload-list" v-for="(item,index) in uploadList" :key="index">
                                <template v-if="item.status === 'finished'">
                                    <img :src="item.url" style="width:80px;" />
                                    <div class="demo-upload-list-cover">
                                        <Icon type="ios-eye-outline" @click.native="handleView(item,'主图')"></Icon>
                                        <Icon type="ios-trash-outline" @click.native="handleRemove(index,'主图')"></Icon>
                                    </div>
                                </template>
                                <template v-else>
                                    <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
                                </template>
                            </div>
                            <Upload ref="upload" v-if="isShowUpload1" :show-upload-list="false" :default-file-list="defaultList" :on-success="handleSuccess" :format="['jpg','jpeg','png']" :max-size="2048" :on-format-error="handleFormatError" :on-exceeded-size="handleMaxSize" type="drag" :data="uploadData" :action="action" style="display: inline-block;width:58px;">
                                <div style="width: 58px;height:58px;line-height: 58px;">
                                    <Icon type="ios-camera" size="20"></Icon>
                                </div>
                            </Upload>
                            <Modal title="查看图片" v-model="visible" draggable >
                                <img :src="imgUrl" style="width: 100%" />
                            </Modal>
                        </div>
                    </i-Col>
                    <i-Col span="12">
                        <div class="style">
                            <p class="label_title">上传商品详情页图片</p>
                            <!-- 上传照片 -->
                            <div class="demo-upload-list" v-for="(item,index) in upDetaiList" :key="index">
                                <template v-if="item.status === 'finished'">
                                    <img :src="item.url" style="height:80px;" />
                                    <div class="demo-upload-list-cover">
                                        <Icon type="ios-eye-outline" @click.native="handleView(item, '详情')"></Icon>
                                        <Icon type="ios-trash-outline" @click.native="handleRemove(index, '详情')"></Icon>
                                    </div>
                                </template>
                                <template v-else>
                                    <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
                                </template>
                            </div>
                            <Upload ref="upload2" v-if="isShowUpload2"  :show-upload-list="false" :default-file-list="defaultList2" :on-success="detailSuccess" :format="['jpg','jpeg','png']" :max-size="2048" :on-format-error="handleFormatError" :on-exceeded-size="handleMaxSize" type="drag" :data="uploadDetailData" :action="action" style="display: inline-block;width:58px;">
                                <div style="width: 58px;height:58px;line-height: 58px;">
                                    <Icon type="ios-camera" size="20"></Icon>
                                </div>
                            </Upload>
                            <Modal title="查看图片" v-model="visible2" draggable >
                                <img :src="detailsImgUrl" v-if="visible2" style="width: 100%" />
                            </Modal>
                        </div>
                    </i-Col>
                </Row> 
            </Form>
            <div class="demo-drawer-footer">
                <Button style="margin-right: 8px" @click="valueDrawe=false">取消</Button>
                <Button type="primary" @click="submitReady('formData')">提交</Button>
            </div>
        </Drawer>  
    </div>  
</template>
<script>
import {changeday} from  '@/assets/js/tool.js'
import { changeTime } from "@/assets/js/tool.js"; // 转化时间为2019-10-09 00:00:00这样的格式
import NProgress from 'nprogress'   // 引入进度条
import 'nprogress/nprogress.css'    // 引入进度条
export default {
    data() {
        return {
            // 预定数据
            reserveList: [],
            // 表格高度
            tableHeight: 700,  
            // 表格数据 
            tableData: [], 
            // 名称、条码
            keyValue: '',
            // 时间选择
            timeValue:[],
            // 开始时间
            stime: '',
            // 结束时间
            etime: '',
            options: {
                disabledDate (date) {
                    return date && date.valueOf() < Date.now();
                }
            },
            // 商品状态
            statusList:[
                {
                    value: 0,
                    label: '正在预定',
                },
                {
                    label: '预定失败',
                    value: 1,
                },
                {
                    label: '预定完成',
                    value: 2,
                },
            ],
            // 状态选择
            statusValue: 0,
            // 数据表头
            columns: [
                {
                    title: "名称",
                    align: "center",
                    key: "item_name",
                    width: 300,
                    render: (h, {row}) => {
                        return (
                            <div>
                                <p title="中文">{row.item_name}</p>
                                <p title="英文">{row.item_en}</p>
                            </div>
                        )
                    }
                },
                {
                    title: '主图',
                    align: 'center',
                    key: 'img',
                    render: (h, { row }) => {
                        return (<img src={row.img} onClick={() => this.lookImage(row,'主图')}  style="cursor: pointer;width:80px;height:80px;margin: 5px 0;" title="查看商品主图" />);
                    }  
                },
                {
                    title: '详情图',
                    align: 'center',
                    key: 'img',
                    render: (h, { row }) => {
                        return (
                            <div onClick={() => this.lookImage(row,'详情图')}  title={row.details_img ? '查看商品详情图' : ''}  style="cursor: pointer;">
                                <img src={row.details_img} style="height:80px;margin: 5px 0;"/>
                            </div>
                        );
                    }  
                },
                {
                    title: "数量",
                    align: "center",
                    key: "",
                    render: (h, { row }) => {
                        return (
                            <div style="padding-left:25px;">
                                <p style="text-align: left;">目标：{row.target}</p>
                                <p style="text-align: left;">已定：{row.order_num}</p>
                                <p style="text-align: left;">整箱：{row.lot_spec}</p>
                                <p style="text-align: left;">整包：{row.purchase_spec}</p>
                            </div>
                        );
                    } 
                },
                {
                    title: "价格",
                    align: "center",
                    key: "base_price",
                    render: (h, { row }) => {
                        return (
                            <div>
                                <p>进价：{row.base_price}</p>
                                <p>售价：{row.sale_price}</p>
                            </div>
                        );
                    } 
                },
                {
                    title: "生产周期",
                    align: "center",
                    key: "lead_time",
                    render: (h, { row }) => {
                        return (<p>{row.lead_time}</p>);
                    } 
                },
                {
                    title: "预售时间",
                    align: "center",
                    key: "deadline",
                    width: 260,
                    render: (h, { row }) => {
                        return (
                            <div>
                                <p>到货：{row.arrival}</p>
                                <p>截止：{row.deadline}</p>
                            </div>
                        );
                    } 
                },
                {
                    title: "上线",
                    align: "center",
                    key: "display_flag",
                    render:(h,{row})=>{
                        return h('i-switch',{
                            props:{
                                value: row.display_flag === 1 ? true : false,
                                size:'large',
                                'true-color':"#218da0",
                                'false-color': "#aba2a2",
                            },
                            scopedSlots:{
                                open:()=>h('span','上线'),
                                close:()=>h('span','下线')
                            },
                            on: {
                                'on-change': (value) => {//触发事件是on-change,用双引号括起来，
                                    //参数value是回调值，并没有使用到
                                    this.changeDisplay(row,value) //params.index是拿到table的行序列，可以取到对应的表格值
                                }
                            },
                        })
                    }
                },
                {
                    title: '操作',
                    key: 'action',
                    align: 'center',
                    render: (h, {row}) => {
                        return (
                            <div>
                                {row.status === 2 && <icon type="md-archive" size='26' color= '#333' title="导出订单" class='handle' onClick={() => this.exportOrder(row)}/>}
                                <icon type="ios-create" size='28' color= '#218da0' title="编辑"  class= 'look' onClick={() => this.getGoosDetail(row)}/>
                                <poptip confirm title="要删除订单吗 ?" on-on-ok={() => this.deleteSeries(row)}  >
                                    <icon type="ios-trash" size='28' color= '#333' title="删除" class='delete'/>
                                </poptip>
                            </div>
                        )
                    }
                }

            ],
            // 表单验证
            ruleValidate: {
                item_name: [
                    { required: true, message: '商品中文名称不能为空', trigger: 'blur' }
                ],
                item_en: [
                    { required: true, message: '商品英文名称不能为空', trigger: 'blur' }
                ],
                target: [
                    { required: true,type:'number',  message: '商品预售目标数量不能为空', trigger: 'blur' }
                ],
                lead_time: [
                    { required: true,type:'number',  message: '生产周期不能为空', trigger: 'blur' }
                ],
                deadline: [
                    { required: true, type:'date',message: '预售截止时间不能为空', trigger: 'change' }
                ],
                arrival: [
                    { required: true, type:'date', message: '预计到货时间不能为空', trigger: 'change' }
                ],
            },
            // 总数
            total: 0,
            // 每页条数
            pageSize: 20,
            // 当前页码
            currentPage: 1,
            // 是否显示添加商品表格
            isTable: false,
            // 是否显示预定商品增、编辑抽屉
            valueDrawer: false,
            // 预定商品增、编辑抽屉标题
            drawerTitle: '新增',
            styles: {
                height: 'calc(100% - 55px)',
                overflow: 'auto',
                paddingBottom: '53px',
                position: 'static'
            },
            // 预定商品参数
            formData: {
                item_name: '',  // 中文名  
                item_en: '',        // 英文名        
                purchase_spec: 0,  // 规格       
                lot_spec: 0,       // 箱规     
                base_price: 0,     // 进价      
                sale_price: 0,     // 售价    
                target: 1,         // 预售目标数量
                lead_time:1,       // 生产周期
                item_no:'',        // 条码
                material: '',       // 材质     
                material_en: '',    // 材质
                lwh: '',            // 尺寸       
                lwh_en: '',         // 尺寸
                weight: '',         // 重量       
                weight_en: '',      // 重量
                stuffing: '',       // 填充物       
                stuffing_en: '',    // 填充物
                features: '',       // 产品特点      
                features_en: '',    // 产品特点
                usage: '',          // 使用方法      
                usage_en: '',       // 使用方法
                notes: '',          // 注意事项       
                notes_en: '',       // 注意事项
                caution: '',        // 警告语      
                caution_en: '',     // 警告语    
                deadline: '',     // 预售截止时间 
                arrival: '',      //  预计到货时间
                img: '',            // 主图路径      
                details_img: '',    // 详情页图片
            },
            // 上传的图片主图数据
            uploadList: {},
             // 上传的图片默认数据
            defaultList: [],
            defaultList2: [],
            // 是否显示查看主图弹窗
            visible: false,
            visible2: false,
            // 上传的图片主图对象
            uploadData: {},
            uploadDetailData: {},
            // 上传的图片详情大图数据
            upDetaiList: {},
            // 上传的图片详情大图链接
            detailsImgUrl: '',
            // 上传的主图图片链接
            imgUrl: '',
            // 图片上传接口
            action: `http://order.xmvogue.com/word/public/index.php?s=admin/Presell/upload`,
            // 当前行商品id 
            rowId: 0,
            // 
            isShowUpload1: true,
            isShowUpload2: true,
        }
    },
    watch: {
        'valueDrawer'(val) {
            if(!val) {
                // 预定商品参数
                this.formData = {
                    item_name: '',  // 中文名  
                    item_en: '',        // 英文名        
                    purchase_spec: 0,  // 规格       
                    lot_spec: 0,       // 箱规     
                    base_price: 0,     // 进价      
                    sale_price: 0,     // 售价  
                    target: 1,         // 预售目标数量   
                    lead_time:1,       // 生产周期
                    item_no:'',        // 条码
                    material: '',       // 材质     
                    material_en: '',    // 材质
                    lwh: '',            // 尺寸       
                    lwh_en: '',         // 尺寸
                    weight: '',         // 重量       
                    weight_en: '',      // 重量
                    stuffing: '',       // 填充物       
                    stuffing_en: '',    // 填充物
                    features: '',       // 产品特点      
                    features_en: '',    // 产品特点
                    usage: '',          // 使用方法      
                    usage_en: '',       // 使用方法
                    notes: '',          // 注意事项       
                    notes_en: '',       // 注意事项
                    caution: '',        // 警告语      
                    caution_en: '',     // 警告语    
                    deadline: '',      // 预售截止时间   
                    arrival: '',       //  预计到货时间
                    img: '',            // 主图路径      
                    details_img: '',    // 详情页图片
                }
                this.uploadList = {};
                this.defaultList = [];
                this.defaultList2 = [];
                // 上传的图片主图对象
                this.uploadData = {};
                this.uploadDetailData = {};
                // 上传的图片详情大图数据
               this.upDetaiList = {};
                // 上传的图片详情大图链接
                this.detailsImgUrl = '';
                // 上传的主图图片链接
               this.imgUrl = '';
            }
        }
    },
    mounted() {
        setTimeout(()=> {
            // 得到浏览器内容高度
            let windowHeight = document.documentElement.clientHeight || document.body.clientHeight;
            this.tableHeight = (windowHeight- 250);
        },100)
        // 调整浏览器的时候
        $(window).on('resize', () => {
            let windowHeight = document.documentElement.clientHeight || document.body.clientHeight;
            this.tableHeight = (windowHeight - 250);
        })
    },
    created() {
        // 得到商品预定列表数据
        this.getReserveData();
    },

    methods: {
        /**
         * 商品状态选择
         */
        changeStatus() {
            this.currentPage = 1;
            this.getReserveData();
        },
        /**
         * 时间选择
         */
        changeDateRange(value) {
            this.timeValue = value;
            this.stime = value[0];
            this.etime = value[1];
            this.currentPage = 1;
            this.getReserveData();
        },
        /**
         * 得到商品预定列表数据
         */
        getReserveData() {
            NProgress.start();
            this.etime === '' || (this.etime === undefined ? '' : changeTime(this.etime));
            this.stime === '' || (this.stime === undefined ? '' : changeTime(this.stime));
            this.$resetAjax({
                type: "POST",
                url: "/admin/Presell/index",
                data: {
                    page: this.currentPage,                 // 分页
                    key: this.keyValue,                     // 商品名称、英文、条码
                    stime: this.stime,                      // 截止开始时间
                    etime: this.etime,                      // 截止结束时间
                    status: this.statusValue,               // 商品状态
                },
                success: (res) => {
                    NProgress.done();
                    let result = JSON.parse(res);
                    result.data.forEach(ele => {
                        ele.deadline = ele.deadline === "NaN-NaN-NaN" || ele.deadline === "/" ? '' : ele.deadline;
                        ele.arrival = ele.arrival === "NaN-NaN-NaN" || ele.arrival === "/" ? '' : ele.arrival;
                        ele.order_num = ele.order_num ? ele.order_num : 0
                    })
                    this.total = result.total;
                    this.reserveList = result.data;
                }
            });
        },
        /**
         * 新增预定商品
         */
        newAdd() {
            this.valueDrawer = true;
            this.drawerTitle = '新增';
            this.isShowUpload1 = true;
            this.isShowUpload2 = true;
        },
        /**
         * 得到商品详情
         */
        getGoosDetail(row) {
            this.valueDrawer = true;
            this.drawerTitle = '编辑';
            this.formData = row;
            this.formData = {
                item_name: row.item_name,                           // 中文名  
                item_en: row.item_name,                             // 英文名        
                purchase_spec: Number(row.purchase_spec),           // 规格       
                lot_spec:  Number(row.lot_spec),                    // 箱规     
                base_price: Number(row.base_price),                 // 进价      
                sale_price: Number(row.sale_price),                 // 售价    
                target: Number(row.target),                         // 预售目标数量 
                lead_time: Number(row.lead_time),                   // 生产周期
                item_no:row.item_no,                                // 条码
                material: row.material,                             // 材质     
                material_en: row.material_en,                       // 材质
                lwh: row.lwh,                                       // 尺寸       
                lwh_en: row.lwh_en,                                 // 尺寸
                weight: row.weight,                                 // 重量       
                weight_en: row.weight_en,                           // 重量
                stuffing: row.stuffing,                             // 填充物       
                stuffing_en: row.stuffing_en,                       // 填充物
                features: row.features,                             // 产品特点      
                features_en: row.features_en,                       // 产品特点
                usage: row.usage,                                   // 使用方法      
                usage_en: row.usage_en,                             // 使用方法
                notes: row.notes,                                   // 注意事项       
                notes_en: row.notes_en,                             // 注意事项
                caution: row.caution,                               // 警告语      
                caution_en: row.caution_en,                         // 警告语    
                deadline: row.deadline,                             // 预售截止时间
                arrival: row.arrival,                               //  预计到货时间 
                img: row.img,                                       // 主图路径      
                details_img: row.details_img,                       // 详情页图片
            }
            this.uploadList = [{
                name: '',
                url: row.img,
                status: "finished"
            }];
            this.upDetaiList = [{
                name: '',
                url: row.details_img,
                status: "finished"
            }]
            this.rowId = row.id;
            this.isShowUpload1 = false;
            this.isShowUpload2 = false;
        },
        /**
         * 导出商品
         */
        exportOrder(row) {
            location.href = `http://order.xmvogue.com/word/public/index.php?s=/admin/presell/download_order&gid=${row.id}`;
        },
        /**
         * 新增、编辑预定商品提交前准备
         */
        submitReady(formData) {
            this.$refs.formData.validate((valid) => {
                if (valid) {
                    if(!this.formData.img) {
                        this.$Message.error({
                            content: '提交失败，请上传商品主图',
                            duration: 3
                        });
                        return false;
                    }
                    if(!this.formData.details_img) {
                        this.$Message.error({
                            content: '提交失败，请上传商品详情图',
                            duration: 3
                        });
                        return false;
                    }
                    this.goodsQuery();
                } else {
                    this.$Message.error('规定商品属性未填入，请检查');
                }
            })
        },
        /**
         * 设置是否上线
         */
        changeDisplay(row,value) {
            let display = value === true ? 1 : 0;
            this.$resetAjax({
                type: "POST",
                url: "/admin/Presell/set_display",
                data: {
                    id:row.id,  // 商品id
                    display,  // 是否上线
                },
                success: res => {
                    let result = JSON.parse(res);
                    if(result.errorcode === 0) {
                        // this.getCommodity();
                        this.$Message.success({
                            content: '设置成功',
                            duration: 3
                        });
                        row.display_flag = row.display_flag === 1 ? 0: 1 ;
                    } else {
                        this.$Message.error({
                            content: '很抱歉，设置失败',
                            duration: 3
                        });
                    }
                }
            });
        },
        /**
         * 预定商品编辑、提交
         */
        goodsQuery() {
            let url;
            let data;
            this.formData.deadline = changeday(this.formData.deadline);
            this.formData.arrival = changeday(this.formData.arrival);
            if(this.drawerTitle === '新增') {
                url = 'admin/Presell/add';
                data = this.formData;
            } else {
                url = 'admin/Presell/update';
                this.formData.id = this.rowId; // 商品id
                data = this.formData;
                
            }
            this.$resetAjax({
                type: "POST",
                url,
                data,
                success: (res) => {
                    let result = JSON.parse(res);
                    switch(result.errorcode) {
                        case 0:
                            if(this.drawerTitle === '新增') {
                                this.$Message.success({
                                    content: '新增预定商品成功',
                                    duration: 3
                                });
                            } else {
                                this.$Message.success({
                                    content: '修改预定商品成功',
                                    duration: 3
                                });
                            }
                            this.getReserveData();
                            this.valueDrawer = false;
                            break;
                        default:
                            if(this.drawerTitle === '新增') {
                                this.$Message.error({
                                    content: '新增预定商品失败',
                                    duration: 3
                                });
                            } else {
                                this.$Message.error({
                                    content: '修改预定商品失败',
                                    duration: 3
                                });
                            }
                            break;
                    }
                }
            });
        },
        /**
         * 查找预定数据
         */
        lookUp() {
            this.currentPage = 1;
        },
        /**
         * 查看抽屉根据编码查询出来的商品的大图
         */
        lookImage(row,info) {
            let url;
            if(info === '主图') {
                url = row.img;
            } else {
                url = row.details_img;
            }
            window.open(url)
        },
        /**
         * 删除当前项
         */
        deleteSeries(row) {
            this.$resetAjax({
                type: "POST",
                url: "/admin/presell/del_goods",
                data: {
                    id: row.id,
                },
                success: (res) => {
                    let result = JSON.parse(res);
                    if(result.errorcode === 0) {
                        this.$Message.success({
                            content: '棒棒哒，删除预定商品成功',
                            duration: 2
                        });
                        this.getReserveData();
                    }
                }
            });
        },
        /*
        ** 切换分页
        */ 
        changePage(index) {
            this.currentPage = index;
            this.getReserveData();
        },
        /**
         * 查看上传的图片
         */
        handleView(item,info) {
            if(info === '主图') {
                this.imgUrl = item.url;
                this.visible = true;
            } else {
                this.detailsImgUrl = item.url;
                this.visible2 = true;
            }
        },
        /**
         * 删除上传的图片
         */
        handleRemove(index, info) {
            if(info === '主图') {
                this.uploadList.splice(index, 1);
                this.formData.img = '';
                this.isShowUpload1 = true;
            } else {
                this.upDetaiList.splice(index, 1);
                this.formData.details_img = '';
                this.isShowUpload2 = true;
            }
        },
        /**
         * 上传的图片主图成功返回图片的信息
         */
        handleSuccess(res, file) {
            file.url = `${res.src}?x-oss-process=style/800`;
            this.uploadList = this.$refs.upload.fileList;
            this.formData.img = file.url;
            this.isShowUpload1 = false;
        },
        /**
         * 上传的图片详情成功返回图片的信息
         */
        detailSuccess(res,file) {
            file.url = `${res.src}?x-oss-process=style/800`;
            this.upDetaiList = this.$refs.upload2.fileList;
            this.formData.details_img = file.url;
            this.isShowUpload2 = false;
        },
        /**
         * 对上传的图片进行格式判断
         */
        handleFormatError(file) {
            this.$Notice.warning({
                title: "图片格式不正确",
                desc: "上传图片格式不正确，请选择JPG或PNG."
            });
        },
        /**
         * 对上传的图片进行大小判断
         */
        handleMaxSize(file) {
            this.$Message.error({
                content: "上传的图片超出文件大小限制",
                duration: 2
            });
        },  
    }
}
</script>
