<template>
    <div class="seriesCommodityPage">
        <div class="top">
            <p @click="newAdd">新增</p>
            <div class="right">
                <span style="font-size:15px;">查找：</span>
                <Select v-model="seriesValue" clearable filterable style="width:200px" @on-change="changeSeries" placeholder="请选择系列...">
                    <Option v-for="item in seriesList" :value="item.id" :key="item.id">{{ item.label }}</Option>
                </Select>
                <!-- <a class="lookup" @click="lookUp">查找</a> -->
            </div>
        </div>
        <div class="table">
            <Table :height="tableHeight" border  :columns="columns" :data="tableData" ></Table>  
        </div>
        <div class="pageContanier">
            <Page :total="total" :page-size="pageSize" @on-change="changePage" :current="currentPage" show-elevator show-total></Page>
        </div>
        <Drawer :title="drawerTitle" v-model="drawerValue" width="720" :draggable ="true" :styles="styles" class="seriesCommodity_page">
            <Form ref="formData" :model="formData" :rules="ruleValidate">
                <Row :gutter="32">
                    <i-Col span="24">
                        <FormItem label="系列类型" label-position="top" class="statusItem">
                            <Select v-model="formData.statusType">
                                <Option v-for="item in seriesList.slice(1)" :value="item.id" :key="item.id">{{ item.label }}</Option>
                            </Select>
                        </FormItem>
                    </i-Col>
                    <i-Col span="24">
                        <FormItem label="商品编码" prop="code" label-position="top">
                            <Input v-model="formData.code" @on-blur="codeCheck" />
                        </FormItem>
                    </i-Col>
                    <a class="addToValue" @click="addToValue">添加</a>
                    <i-Col span="24" v-show="isTable">
                        <p class="closaTitle">商品列表</p>
                        <Table  border :columns="goodsColumns" :data="addList" @on-selection-change="submitBorder"></Table>  
                    </i-Col>
                </Row>
            </Form>
            <div class="demo-drawer-footer">
                <Button style="margin-right: 8px" @click="drawerValue = false">取消</Button>
                <Button type="primary" @click="submitSeries('formData')">提交</Button>
            </div>
        </Drawer>    
    </div>
</template>

<script>
import NProgress from "nprogress"; // 引入进度条
import "nprogress/nprogress.css"; // 引入进度条
export default {
    data() {
        return {
            // 系列数据
            seriesList: [],
            // 选中的系列
            seriesValue: '',
            // 表格高度
            tableHeight: 700,  
            // 抽屉里展示编码查询出来的商品表格表头
            goodsColumns:[
                {
                    type: 'selection',
                    width: 60,
                    align: 'center'
                },
                {
                    title: '名称',
                    align: 'center',
                    key: 'item_name',
                },
                {
                    title: '编码',
                    align: 'center',
                    key: 'item_no',
                },
                {
                    title: '价格',
                    align: 'center',
                    key: 'spec',
                },
                {
                    title: '图片',
                    align: 'center',
                    key: 'pic',
                    render: (h, { row }) => {
                        return (<img src={row.pic} onClick={() => this.lookImage(row.pic)}  style="cursor: pointer;width:80px;height:80px;margin: 5px 0;" title="查看商品大图" />);
                    }       
                },
            ],
            // 抽屉里展示编码查询出来的商品数据
            tableGoods: [],
            // 表格数据 
            tableData: [], 
            // 状态数据
            statusList: [
                {
                    name: '上线',
                    id: 1,
                },
                {
                    name: '已撤',
                    id: 0,
                },
            ],
            // 抽屉数据
            formData: {
                statusType: 1,  // 系列商品状态
                code: '', // 系列商品中文名
            },
            // 表单验证
            ruleValidate: {
                code: [
                    { required: true, message: '商品编码不能为空', trigger: 'blur' },
                ],
            },
            // 数据表头
            columns: [
                {
                    title: '编码',
                    align: 'center',
                    key: 'item_no',
                },
                {
                    title: '名称',
                    align: 'center',
                    key: 'item_name',
                },
                {
                    title: 'IP类型',
                    align: 'center',
                    key: 'ipType',
                },
                {
                    title: '图片',
                    align: 'center',
                    key: 'imgUrl',
                    render: (h, { row }) => {
                        return (<img src={row.imgUrl} onClick={() => this.lookImage(row.imgUrl)}  style="cursor: pointer;width:80px;height:80px;margin: 5px 0;" title="查看商品大图" />);
                    }  

                },
                {
                    title: '操作',
                    key: 'action',
                    align: 'center',
                    render: (h, {row}) => {
                        return h('div', [
                            /* h('Icon', {
                                props: {
                                    type: 'ios-create',
                                    size: '25',
                                    color: '#218da0'
                                },
                                class: 'look',
                                domProps:{
                                    title: '点击编辑',
                                },
                                on: {
                                    click: () => {
                                        this.getSeriesDetail(row)
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
                                        title: '确定要删除 ？',
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
                                            // 确定删除
                                            this.deleteSeries(row)
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
            // 抽屉详情
            drawerTitle: '',
            styles: {
                height: 'calc(100% - 55px)',
                overflow: 'auto',
                paddingBottom: '53px',
                position: 'static'
            },
            // 总数
            total: 0,
            // 每页条数
            pageSize: 20,
            // 当前页码
            currentPage: 1,
            // 是否显示抽屉
            drawerValue: false,
            // 要添加的商品数据
            addList: [],
            // 是否显示添加商品表格
            isTable: false,
            // 勾选后的马上提交的商品
            selectData: [],
        }
    },
    watch: {
        drawerValue(val) {
            if(!val) {
                this.formData = {
                    code: '', // 商品编码
                    statusType: 1, // 系列类型
                }
                this.tableGoods = [];
                this.addList = [];
                this.isTable = false;
            }
        },
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
        // 得到系列管理列表数据
        this.getSeriesData();
        // 得到系列商品管理数据
        this.getSerComList();
    },

    methods: {
        /**
         * 得到系列管理列表数据
         */
        getSeriesData() {
            NProgress.start()
            this.$resetAjax({
                type: "GET",
                url: "/admin/Goods/get_all_ip",
                success: (res) => {
                    NProgress.done()
                    let result = JSON.parse(res);
                    result.forEach(ele => {
                        ele.label = `${ele.name}(${ele.name_en})`
                    });
                    result.unshift({
                        id: 0,
                        label: '全部',
                    })
                    this.seriesList = result;
                }
            });
        },
        /**
         * 新增系列商品
         */
        newAdd() {
            this.drawerValue = true;
            this.drawerTitle = '增加';
        },
        /**
         * 得到系列商品管理数据
         */
        getSerComList() {
            this.$resetAjax({
                type: "POST",
                url: "/admin/Goods/ip_list",
                data: {
                    page: this.currentPage,
                    ip: this.seriesValue,
                },
                success: (res) => {
                    let result = JSON.parse(res);
                    this.total = Number(result.total);
                    result.data.forEach(ele => {
                        this.seriesList.forEach(item => {
                            ele.imgUrl = `http://img.xmvogue.com/thumb/${ele.item_no}.jpg?x-oss-process=style/800`
                            if(ele.IP === item.id) {
                                ele.ipType = `${item.name} (${item.name_en})`;

                            }
                        })
                    });
                    this.tableData = result.data;
                }
            });
        },
        /**
         * 查找系列数据
         */
        lookUp() {
            this.currentPage = 1;
            this.getSerComList();
        },
        /**
         * 列表切换系列类型查询
         */
        changeSeries(select) {
            this.seriesValue = select === 0 ? '' : select;
            this.currentPage = 1;
            this.getSerComList();
        },
        /**
         * 查看编码是否正确
         */
        codeCheck() {
            this.$resetAjax({
                type: "POST",
                url: "/Admin/Goods/srarch",
                data: {
                    p: 1,
                    no: this.formData.code, // 商品编码
                },
                success: (res) => {
                    let result = JSON.parse(res);
                    if(result.list.length === 0) {
                        this.$Message.error({
                            content: '很抱歉，商品编码输入错误',
                            duration: 3
                        });
                        return false;
                    } 
                    result.list.forEach(ele => {
                        ele.typeid = this.formData.statusType;
                        this.tableGoods.push(ele)
                    });
                }
            });
        },
        /**
         * 是否添加到准备系列产品
         */
        addToValue() {
            this.isTable = true;
            this.formData.code = '';
            this.addList = this.tableGoods;
        },
        /**
         * 勾选商品
         */
        submitBorder(selection) {
            this.selectData = selection;
        },
        /**
         * 查看抽屉根据编码查询出来的商品的大图
         */
        lookImage(url) {
            window.open(url)
        },
        /**
         * 得到系列商品详情
         */
        getSeriesDetail(row) {
            this.drawerTitle = '编辑';
            this.drawerValue = true;
            this.formData = {
                statusType: row.statusType,  // 系列状态
                code: row.code, // 商品编码
                id: row.id,
            }
        },
        /**
         * 提交系列商品前判断是新增还是编辑
         */
        submitSeries(formData) {
            if(this.selectData.length === 0) {
                this.$Message.error({
                    content: '很抱歉，系列产品设置提交前请先勾选商品',
                    duration: 2
                });
                return false;
            }
            this.submitAddIp();
        },
        /**
         * 设置系列产品提交
         */
        submitAddIp() {
            this.$resetAjax({
                type: "POST",
                url: "/admin/Goods/add_ip",
                data: {
                    goods: this.selectData.map(ele => ele.item_no),
                    ip: this.selectData[0].typeid
                },
                success: res => {
                    let result = JSON.parse(res);
                    this.drawerValue = false;
                    this.$Message.success({
                        content: '棒棒哒，新增系列商品成功',
                        duration: 2
                    });
                    this.getSerComList();
                }
            });
        },
        /**
         * 新增系列商品
         */
        addSeries() {
            this.$resetAjax({
                type: "POST",
                url: "/admin/Goods/ip_list",
                data: {
                    name_en: this.formData.english,  // 系列商品英文名
                    name: this.formData.chinese,    //系列商品中文名
                },
                success: res => {
                    let result = JSON.parse(res);
                    this.drawerValue = false;
                    this.$Message.success({
                        content: '棒棒哒，新增系列商品成功',
                        duration: 2
                    });
                    this.getSerComList();
                }
            });
        },
        /**
         * 编辑系列商品
         */
        editSeries() {
            this.$resetAjax({
                type: "POST",
                url: "/admin/Goods/updatexilie",
                data: {
                    id: this.formData.id,
                    name_en: this.formData.english,
                    name: this.formData.chinese,
                    status: this.formData.status
                },
                success: (res) => {
                    let result = JSON.parse(res);
                    this.drawerValue = false;
                    this.$Message.success({
                        content: '棒棒哒，修改系列商品成功',
                        duration: 2
                    });
                    this.getSerComList();
                }
            });
        },
        /**
         * 删除当前项
         */
        deleteSeries(row) {
            this.$resetAjax({
                type: "POST",
                url: "/admin/Goods/del_goods",
                data: {
                    goods: row.item_no,
                },
                success: (res) => {
                    let result = JSON.parse(res);
                    if(result.result === 'ok') {
                        this.$Message.success({
                            content: '棒棒哒，删除系列商品成功',
                            duration: 2
                        });
                        this.getSerComList();
                    }
                }
            });
        },
        /*
        ** 切换分页
        */ 
        changePage(index) {
            this.currentPage = index;
            this.getSerComList();
        }
    }
}
</script>
