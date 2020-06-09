<template>
    <div class="storesMent">
        <div class="top">
             <div class="top_left">
                <p @click="addBtnClick">新增</p>
            </div>
            <div class="top_select">
                <div class="item">
                    <span class="item_title">门店编码： </span>
                    <Input v-model="codeValue" placeholder="请输入门店编码" style="width: 200px" @on-enter="judgeLook" @on-blur="judgeLook"/>
                </div>
                <div class="item">
                    <span class="item_title">用户名： </span>
                    <Input v-model="nameValue" placeholder="请输入用户名" style="width: 200px" @on-enter="judgeLook" @on-blur="judgeLook"/>
                </div>
                <!-- <div class="item">
                    <span class="item_title">地区 : </span>
                    <Select v-model="areaValue" clearable style="width:120px" @on-change="codeValue='';nameValue='';radioLabel='';">
                        <Option value="">全部</Option>
                        <Option v-for="item in areaList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                </div>
                <div class="item">
                    <span class="item_title">客户类型 : </span>
                    <Select v-model="custoValue" clearable style="width:120px" @on-change="codeValue='';nameValue='';radioLabel='';">
                        <Option value="">全部</Option>
                        <Option v-for="item in customerList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                </div> -->
                <!-- <p class="lookup" @click="judgeLook">查询</p> -->
            </div>
        </div>
        <div class="table">
            <Table v-if="isTable"  border :height="tableHeight"  :columns="columns" :data="tableData" ></Table>  
        </div>
        <div class="pageContanier">
            <Page :total="total" :page-size="pageSize" @on-change="changePage" :current="currentPage" show-elevator show-total></Page>
        </div>
        <!-- 门店新增抽屉 -->
        <Drawer :title="drawerTitle" v-model="isDrawer" width="720" :styles="styles" class="storeDrawer" :draggable ="true">
            <Form :model="formData" ref="formData" :rules="ruleValidate">
                <Row :gutter="32">
                    <i-Col span="24">
                        <FormItem label="门店编码 ：" prop="store_code" label-position="top">
                            <Input v-model="formData.store_code" type="number"/>
                        </FormItem>
                    </i-Col>
                    <i-Col span="24">
                        <FormItem label="门店名称 ：" prop="store_name" label-position="top">
                            <Input v-model="formData.store_name" />
                        </FormItem>
                    </i-Col>
                    <i-Col span="24">
                        <FormItem label="国家/地区 ：" prop="country" label-position="top">
                            <Select v-model="formData.country" filterable>
                                <Option v-for="(item,index) in countryList" :value="item.code" :key="index">{{ item.name }}</Option>
                            </Select>
                        </FormItem>
                    </i-Col>
                    <i-Col span="24">
                        <FormItem label="最大限购数 ：" prop="max_buy" label-position="top">
                            <InputNumber :min="1" v-model="formData.max_buy"></InputNumber>
                        </FormItem>
                    </i-Col>
                </Row>
                <Row :gutter="32">
                    <i-Col span="24">
                        <FormItem label="密码 ：" prop="store_pass" label-position="top">
                            <Input v-model="formData.store_pass" type="password" />
                        </FormItem> 
                    </i-Col>
                    <i-Col span="24">
                        <FormItem label="订单保留 ：" prop="retention" label-position="top">
                            <RadioGroup v-model="formData.retention">
                                <Radio label="3">3天</Radio>
                                <Radio label="7">7天</Radio>
                            </RadioGroup>
                        </FormItem>
                    </i-Col>
                    <!-- <i-Col span="8">
                        <FormItem label="国内客户 :" prop="domestic"  label-position="top">
                            <RadioGroup v-model="formData.domestic">
                                <Radio label="1">是</Radio>
                                <Radio label="2">否</Radio>
                            </RadioGroup>
                        </FormItem>
                    </i-Col> -->
                    
                </Row>
                <Row :gutter="32">
                    <i-Col span="24">
                        <FormItem label="网站界面 ：" prop="Interface"  label-position="top">
                            <RadioGroup v-model="formData.Interface">
                                <Radio label="中文">中文</Radio>
                                <Radio label="英文">英文</Radio>
                            </RadioGroup>
                        </FormItem> 
                    </i-Col>
                </Row>
            </Form>
            <div class="demo-drawer-footer">
                <Button style="margin-right: 8px" @click="isDrawer = false">取消</Button>
                <Button type="primary" @click="handleSubmit(formData)">保存</Button>
            </div>
        </Drawer>       
        <!-- 密码修改模态框 -->
        <Modal v-model="passModel" title="重置密码" @on-cancel="passModel=false;" class="passModal_storePage" draggable >
            <Form  ref="formValidate" :model="formValidate" :rules="ruleValidates" :label-width="80"> 
                <!-- <FormItem label="当前密码" prop="old"> 
                    <Input v-model="formValidate.old" />
                </FormItem>  -->
                <FormItem label="修改密码" prop="new"> 
                    <Input v-model="formValidate.new" type="text" />
                </FormItem> 
                <FormItem label="确定密码" prop="again"> 
                    <Input v-model="formValidate.again" type="password" />
                </FormItem> 
            </Form>
            <div class="set-goods-footer" slot="footer">
                <Button type="success"  @click="submitChangePassword('formValidate')">确认更改</Button>
                <Button @click="passModel=false;">取消</Button>
            </div>
        </Modal>
        <!-- 国家修改模态框 -->
        <Modal v-model="countryModal" :title="countryTitle" draggable  @on-ok="editCountry" @on-cancel="countryModal=false;" class="countryModel_storesMent">
            <Select v-model="countryValue" filterable>
                <Option v-for="(item,index) in countryList" :value="item.code" :key="index">{{ item.name }}</Option>
            </Select>
        </Modal>
    </div>
</template>
<script>
import NProgress from 'nprogress'   // 引入进度条
import 'nprogress/nprogress.css'    // 引入进度条
export default {
    data () {
        return {
            // 客服数据
            serverList: [],
            // 当前用户id
            userid:'',
             // 地区选择
            areaValue: '', 
            // 用户名输入
            nameValue: '',   
             // 编码查询
            codeValue: '',  
            //  是否显示表格
            isTable: true,  
            // 地区数据
            areaList: [
                {
                    value: 1,
                    label: '国内',
                },
                {
                    value: 2,
                    label: '海外',
                },
            ],   
            // 国家选择数据
            countryList: [],
            // 选中哪个客户类型
            custoValue: '',
            // 客户数据类型
            customerList: [
                {
                    value: 1,
                    label: '大客户',
                },
                {
                    value: 2,
                    label: '普通客户',
                },
            ],
            // 表格高度
            tableHeight: 600,   
            // 表头
            columns: [
                {
                    title: '店名',
                    align: 'center',
                    key: 'user_name',
                },
                {
                    title: '编码',
                    align: 'center',
                    key: 'hdid',
                },
                 {
                    title: '国家',
                    align: 'center',
                    key: 'countryname',
                    render: (h, {row}) => {
                        return h('div', [
                            h('div', {
                                class: 'country',
                                style: {
                                    cursor: this.isOnline ? 'normal' : 'pointer'
                                },
                                domProps:{
                                    title: this.isOnline ? row.countryname :  '点击修改国家' ,
                                },
                                on: {
                                    click: () => {
                                        // 客服、客服总监、客服主管暂时没有权限对国家进行编辑操作
                                        if(!this.isOnline) {
                                            // 编辑国家准备
                                            this.editReady(row)
                                        } else {
                                            return false;
                                        }
                                    }
                                }
                            },row.countryname),
                        ])
                    }
                },
                {
                    title: '私货扣款',
                    align: 'center',
                    key: 'cost_num',
                    render: (h, {row}) => {
                        return h('div', [
                            h('InputNumber', {
                                props: {
                                    type: 'primary',
                                    size: 'small',
                                    value: Number(row.cost_num),
                                    min: 0.00,
                                },
                                domProps:{
                                    title: '修改用户因私货扣款金额，请慎重操作！' ,
                                },
                                on: {
                                    'on-change': e => {// eslint-disable-line
                                        // e的值就是InputNumber改变后的值
                                        this.editCost(row.user_id, e);
                                    },
                                },
                            }),
                        ]);
                    }, 
                },
                {
                    title: '客服',
                    align: 'center',
                    key: 'kefu_name',
                    render: (h, {row}) => {
                        var data = this.serverList;
                        return h('div', [
                            h("Select",{
                                props:{
                                    value: row.kefu_id,
                                    filterable: true,
                                },
                                style: {
                                    width:"100%",
                                    'text-align': 'center'
                                },
                                 domProps:{
                                    title: '选择修改客服，请慎重操作！',
                                },
                                on: {'on-change':(event) => {
                                        this.selectCustore(event,row);
                                    } 
                                },
                            },
                            data.map(function (item) {
                                //默认情况下都为select中的option选项
                                return [h( "Option",{
                                    props: {
                                        value: item.id,
                                        key: item.id
                                    }
                                },item.user)]
                            })
                        )]);
                    }
                },
                {
                    title: '最大订货',
                    align: 'center',
                    key: 'max_buy',
                    render:(h,{row})=>{
                        return h('div',[
                            h('span', {
                            },row.max_buy+'个规格'),
                        ])
                    }
                },
                {
                    title: '订单保留',
                    align: 'center',
                    key: 'order_day',
                    render:(h,{row})=>{
                        return h('div',[
                            h('span', {
                            },row.order_day+'天'),
                        ])
                    }
                },
                {
                    title: '操作',
                    key: 'action',
                    align: 'center',
                    render: (h, {row}) => {
                        return h('div', [
                            h('Icon', {
                                props: {
                                    type: 'ios-eye',
                                    size: '25',
                                    color: '#218da0'
                                },
                                class: 'look',
                                domProps:{
                                    title: '点击修改密码',
                                },
                                on: {
                                    click: () => {
                                        this.passModel=true;
                                        this.userid=row.user_id;
                                    }
                                }
                            }),
                            /* h('Icon', {
                                props: {
                                    type: 'md-contact',
                                    size: '25',
                                    color: '#218da0'
                                },
                                class: 'look',
                                domProps:{
                                    title: '点击修改权限',
                                },
                                on: {
                                    click: () => {
                                        
                                    }
                                }
                            }), */
                            h('span', [
                                h('Poptip', {
                                    class: 'handle',
                                    props: {
                                        confirm: true,
                                        transfer: true,
                                        placement: 'top',
                                        title: '确定删除吗 ?',
                                        type: 'error',
                                        size: 'small',
                                        width: '150',
                                        vModel: true
                                    },
                                    domProps:{
                                        title:'删除'
                                    },
                                    style: {
                                        cursor: 'pointer'
                                    },
                                    on: {
                                        'on-ok': ()=>{
                                            this.delStoresLIst(row);
                                        },
                                        'on-cancel': ()=>{
                                            // 取消删除
                                        }
                                    }
                                },
                                [
                                    h('Icon',{
                                        props: {
                                        type: 'ios-trash',
                                            size: '26',
                                            color: '#333'
                                        },
                                        class: 'delete'
                                    })
                                ])
                            ]),
                        ]);
                    }
                }
            ],
            // 表格数据
            tableData: [],    
            // 总数
            total: 0,
            // 每页条数
            pageSize: 20,
            // 当前页码
            currentPage: 1,
             // 编辑新增抽屉
            isDrawer: false,    
             // 抽屉标题
            drawerTitle: '新增', 
            styles: {
                height: 'calc(100% - 55px)',
                overflow: 'auto',
                paddingBottom: '53px',
                position: 'static'
            },
            formData: {
                store_code: '',        // 门店编码
                store_name: '',     // 门店名称
                max_buy: 1,       // 最大限购数
                store_pass: '',       // 密码
                country: '',
                retention: '7',   // 订单保留
                // domestic: '',    // 是否是国内客户
                Interface: '英文',   // 网站界面
            },
            ruleValidate: {
                store_code: [
                    { required: true, message: '门店编码不能为空', trigger: 'blur' },
                    { type: 'string', min: 5, max: 5, message: '门店编码为5位数', trigger: 'blur' },
                ],
                store_name: [
                    { required: true, message: '门店名称不能为空', trigger: 'blur' },
                ],
                store_pass: [
                    { required: true, message: '密码不能为空', trigger: 'blur' }
                ],
                retention: [
                    { required: true, message: '请选择订单保留天数', trigger: 'change' }
                ],
                country: [
                    { required: true, message: '请选择国家或地区', trigger: 'change' }
                ],
                Interface: [
                    { required: true, message: '请选择网站界面语言', trigger: 'change' }
                ],
                
            },
            // 是否显示密码模态框更改
            passModel: false,
            // 新的密码
            newPassValue: '',
            // 密码弹框
            formValidate:{
                old:'',
                new:'',
                again:''
            },
            // 表单认证
            ruleValidates:{
                old: [
                    { required: true, message: '密码不能为空', trigger: 'blur' }
                ],
                new: [
                    { required: true, message: '新密码不能为空', trigger: 'blur' }
                ],
                again: [
                    { required: true, message: '确认密码不能为空', trigger: 'blur' }
                ],
            },
            // 原始密码正确
            changePassword:false,
            // 国家关键字输入
            countryValue: '',
            // 国家修改模态框是否显示
            countryModal: false,
            // 国家模态框标题
            countryTitle: '',
            // 国家修改门店编码
            countryHdid: '',
            // 是否有修改国家的权限
            isOnline: false,
        }
    },
    watch: {
        // 新增框关闭，对应的里面信息为空
        isDrawer(val) {
            if(!val) {
                this.formData = {
                    store_code: '',        // 门店编码
                    store_name: '',     // 门店名称
                    store_pass: '',       // 密码
                    retention: '7',   // 订单保留
                    country: '',    // 国家
                    Interface: '英文',   // 网站界面
                    max_buy: 1,       // 最大限购数
                }
            }
        },
        // 密码框关闭，对应的里面信息为空
        passModel(val) {
            if(!val) {
                this.formValidate = {
                    new : '',
                    again : ''
                }
            }
        },
        // 国家模态框关闭，对应的信息为空
        countryModal(val) {
            if(!val) {
                this.countryValue = '';
                this.countryTitle = '';
            }
        }
    },
    mounted() {
        setTimeout(()=> {
            // 得到浏览器内容高度
            let windowHeight = document.documentElement.clientHeight || document.body.clientHeight;
            this.tableHeight = (windowHeight- 240);
        },100)
        // 调整浏览器的时候
        $(window).on('resize', () => {
            let windowHeight = document.documentElement.clientHeight || document.body.clientHeight;
            this.tableHeight = (windowHeight - 240);
        })
    },
    created() {
        // 客服、客服总监、客服主管暂时没有权限对国家进行编辑操作
        var arr = [1,2,3]
        this.isOnline = arr.includes(Number(localStorage.group_id))
        // 得到国家列表
        this.getCountryList(()=> {
            // 得到门店列表
            this.getStoresLIst();
            // 获取客服列表
            this.getCustSerList();
        });
    },

    methods: {
        /**
         * 获取客服列表
         */
        getCustSerList() {
            this.$resetAjax({
                type: 'GET',
                url: '/admin/Users/kefu',
                success: (res) => {
                    let result = JSON.parse(res);
                    this.serverList = result;
                }
            })
        },
        /**
         * 修改客服请求
         */
        selectCustore(data,row) {
            this.$resetAjax({
                type: 'POST',
                url: '/admin/Users/setKefu',
                data: {
                    id: data, // 客服
                    uid: row.user_id
                },
                success: (res) => {
                    let result = JSON.parse(res);
                    if(result.errorcode === '0') {
                        this.$Message.success({
                            content: '棒棒哒，客服修改成功',
                            duration: 3
                        });
                        this.getStoresLIst();
                    } else {
                        row.kefu_name = '';
                    }
                }
            })
        },
        /**
         * 修改用户扣款金额
         */
        editCost(user_id,e) {
            this.$resetAjax({
                type: 'POST',
                url: 'admin/users/set_cost',
                data: {
                    uid: user_id,
                    num: e
                },
                success: (res) => {
                    let result = JSON.parse(res);
                    if(result.errorcode === 0) {
                        this.$Message.success({
                            content: '私货扣款金额设置成功',
                            duration: 3
                        });
                        this.getStoresLIst();
                    }
                }
            })
        },
        /**
         * 得到国家列表
         */
        getCountryList(callback) {
            this.$resetAjax({
                type: 'GET',
                url: 'admin/Users/cc',
                success: (res) => {
                    let result = JSON.parse(res);
                    this.countryList = result;
                    typeof callback === 'function' && callback()
                }
            })
        },
        // 验证密码
        checkPass(){
            // this.$resetAjax({
            //     url: '/admin/users/checkPsd',
            //     type: 'POST',
            //     data:{
            //         userid:this.userid,
            //         password:this.formValidate.old,
                    
            //     },
            //     success: (res) => {
            //         if(JSON.parse(res).errorcode==1){
            //             this.$Message.error('原始密码输入错误');
            //             return  false;
            //         }
            //         if(JSON.parse(res).errorcode==0){
                        
            //         }
            //     }
            // })
            if(this.formValidate.new === this.formValidate.again){
                this.$resetAjax({
                    url: '/admin/users/setPsd',
                    type: 'POST',
                    data:{
                        userid:this.userid,
                        password:this.formValidate.new
                    },
                    success: (res) => {
                        if(JSON.parse(res).errorcode == 0) {
                            this.$Message.success('修改成功！');
                            this.passModel=false
                        } else if(JSON.parse(res).errorcode == 1) {
                            this.$Message.error('修改错误');
                            this.passModel=true;
                        }
                    }
                });
            } else{
                this.$Message.error('两次密码输入不一致');
            }
        },
        /**
         * 判断是根据哪个来进行查询
         */
        judgeLook() {
            this.currentPage = 1;
            this.getStoresLIst();

        },
        /**
         * 国家修改准备
         */
        editReady(row) {
            this.countryModal = true;
            this.countryTitle = `店名：【${row.user_name}】`;
            this.countryValue = row.countryname === '无' ?  '' : row.country;
            this.countryHdid = row.hdid;
        },
        /**
         * 国家修改请求
         */
        editCountry() {
            this.$resetAjax({
                type: 'POST',
                url: 'admin/Users/edit',
                data:{
                    hdid:this.countryHdid,        // 门店编码
                    country: this.countryValue  // 国家
                },
                success: (res) => {
                    let result = JSON.parse(res);
                    if(result.errorcode === 'ok') {
                        this.$Message.success('修改国家成功 !');
                        this.countryModal = false;
                        this.getStoresLIst();
                    }
                }
            })
        },
        /**
         * 判断有没有验证
         */
        handleSubmit(formData) {
            this.$refs.formData.validate((valid) => {
                if (valid) {
                    this.addSubmit();
                } 
            })
        },
        /**
         * 新增请求
         */
        addSubmit() {
            this.$resetAjax({
                type: 'POST',
                url: '/admin/users/add',
                data:{
                    hdid:this.formData.store_code,        // 门店编码
                    name:this.formData.store_name,     // 门店名称
                    max_buy: this.formData.max_buy,   // 最大限购数量
                    password:this.formData.store_pass,       // 密码
                    order_day:this.formData.retention,   // 订单保留
                    lang:this.formData.Interface,   // 网站界面
                    country: this.formData.country, // 国家  
                },
                success: (res) => {
                    if(JSON.parse(res).errorcode==0){
                        this.isDrawer = false;
                        this.$Message.success('新增门店成功 !');
                        this.getStoresLIst();
                    }else if(JSON.parse(res).errorcode==1){
                        this.isDrawer =true;
                        this.$Message.success('新增门店失败 !');
                    }else if(JSON.parse(res).errorcode==3){
                        this.isDrawer =true;
                        this.$Message.success('门店以存在 !');
                    }
                    
                }
            })
        },
        /**
         * 更换新的密码提交
         */
         submitChangePassword(formValidate){
            this.$refs[formValidate].validate((valid) => {
                if (valid) {
                    this.checkPass();
                } else {
                    this.$Message.error('表单验证失败，无法修改密码');
                }
            })
        },
        /**
         * 获取门店列表
         */
        getStoresLIst() {
            NProgress.start();  // 进度条开始
            this.isTable = true;
            this.$resetAjax({
                type: 'GET',
                url: '/admin/users/index',
                data:{
                    page:this.currentPage,
                    name:this.nameValue,
                    hdid:this.codeValue  // 门店编码
                },
                success: (res) => {
                    NProgress.done(); 
                    let result = JSON.parse(res);
                    result.data.forEach(ele => {
                        this.countryList.forEach(item => {
                            if(item.code === ele.country && ele.country !== null) {
                                ele.countryname = `${item.name} ( ${item.code} )`;
                            } 
                        })
                        if(ele.countryname === undefined) {
                            ele.countryname = '无'
                        }
                        ele.kefu_name = ele.kefu_name === null ?　'无' : ele.kefu_name;
                    });
                    this.total = result.total;
                    this.tableData = result.data;

                }
            })
        },
        /**
         * 商品返回数据处理
         */
        transData(res) {
            NProgress.done(); // 进度条结束
            this.isTable = true;
            
        },
        /**
         * 新增商品
         */
        addBtnClick() {
            this.isDrawer = true;
            this.drawerTitle = '新增';
        },
        /**
         * 查看商品详情
         */
        getDetailData(row) {
            this.isFooter = false;
            this.drawerTitle = row.item_name;
            this.isDrawer = true;
            this.$resetAjax({
                type: 'POST',
                url: '/Admin/Goods/reg',
                data: {
                    item_no: row.item_no,  // 页码
                },
                success: (res) => {
                    let result = JSON.parse(res)[0];
                    
                }
            })

        },
        /**
         * 删除商品
         */
        delStoresLIst(row) {
            this.$resetAjax({
                type: 'POST',
                url: '/admin/users/delete',
                data: {
                    userid: row.user_id,  // 页码
                },
                success: (res) => {
                    if(JSON.parse(res).errorcode==0){
                        this.$Message.success('删除成功 !');
                        this.getStoresLIst();
                    }else {
                        this.$Message.success('删除失败 !');
                    }
                }
            })
        },
        // 分页
        changePage(index){
            this.currentPage=index;
            this.getStoresLIst();
        }
    }
        
}
</script>
