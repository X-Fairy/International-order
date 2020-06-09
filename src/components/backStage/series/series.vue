<template>
    <div class="seriesPage">
        <div class="top">
            <p @click="newAdd">新增</p>
        </div>
        <div class="table">
            <Table :height="tableHeight" border  :columns="columns" :data="tableData" ></Table>  
        </div>
        <div class="pageContanier">
            <Page :total="total" :page-size="pageSize" @on-change="changePage" :current="currentPage" show-elevator show-total></Page>
        </div>
        <Drawer :title="drawerTitle" v-model="drawerValue" width="720" :draggable ="true" :styles="styles" class="seriesDrawer_Page">
            <Form ref="formData" :model="formData" :rules="ruleValidate">
                <Row :gutter="32">
                    <i-Col span="24">
                        <FormItem label="系列中文名" prop="chinese" label-position="top">
                            <Input v-model="formData.chinese"/>
                        </FormItem>
                    </i-Col>
                    <i-Col span="24">
                        <FormItem label="系列英文名" prop="english" label-position="top">
                            <Input v-model="formData.english"/>
                        </FormItem>
                    </i-Col>
                    <i-Col span="24" v-show="drawerTitle === '编辑'">
                        <FormItem label="状态" prop="status" label-position="top" class="statusItem">
                            <Select v-model="formData.status">
                                <Option v-for="item in statusList" :value="item.id" :key="item.id">{{ item.name }}</Option>
                            </Select>
                        </FormItem>
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
import NProgress from 'nprogress'   // 引入进度条
import 'nprogress/nprogress.css'    // 引入进度条
export default {
    data() {
        return {
            // 表格高度
            tableHeight: 700,  
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
                status: '',  // 系列状态
                english: '', // 系列英文名
                chinese: '', // 系列中文名
            },
            // 表单验证
            ruleValidate: {
                english: [
                    { required: true, message: '系列所属英文名不能为空', trigger: 'blur' }
                ],
                chinese: [
                    { required: true, message: '系列所属中文名不能为空', trigger: 'blur' },
                ],
               /*  status: [
                    { required: true, message: '状态选择不能为空', trigger: 'change' }
                ], */
            },
            // 数据表头
            columns: [
                {
                    title: '系列中文名',
                    align: 'center',
                    key: 'name',
                },
                {
                    title: '系列英文名',
                    align: 'center',
                    key: 'name_en',
                },
                {
                    title: '状态',
                    align: 'center',
                    key: 'statusContent',
                },
                {
                    title: '操作',
                    key: 'action',
                    align: 'center',
                    render: (h, {row}) => {
                        return h('div', [
                            h('Icon', {
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
                            }),
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
        }
    },
    watch: {
        drawerValue(val) {
            if(!val) {
                this.formData = {
                    status: '',  // 系列状态
                    english: '', // 系列英文名
                    chinese: '', // 系列中文名
                }
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
        // 得到系列管理数据
        this.getSeriesList();
    },

    methods: {
        /**
         * 新增系列
         */
        newAdd() {
            this.drawerValue = true;
            this.drawerTitle = '增加';
        },
        /**
         * 得到系列管理数据
         */
        getSeriesList() {
            NProgress.start();
            this.$resetAjax({
                type: "GET",
                url: "/admin/Goods/xilieindex",
                data: {
                    page: this.currentPage
                },
                success: (res) => {
                    NProgress.done();
                    let result = JSON.parse(res);
                    this.total = Number(result.total);
                    result.data.forEach(ele => {
                        ele.statusContent = ele.status === 1 ? '上线' : '已撤'
                    });
                    this.tableData = result.data;
                }
            });
        },
        /**
         * 得到系列详情
         */
        getSeriesDetail(row) {
            this.drawerTitle = '编辑';
            this.drawerValue = true;
            this.formData = {
                status: row.status,  // 系列状态
                english: row.name_en, // 系列英文名
                chinese: row.name, // 系列中文名
                id: row.id,
            }
        },
        /**
         * 提交系列前判断是新增还是编辑
         */
        submitSeries(formData) {
            this.$refs[formData].validate((valid) => {
                if (valid) {
                    if(this.drawerTitle === '编辑') {
                        this.editSeries();
                    } else {
                        this.addSeries();
                    }
                }
            })
        },
        /**
         * 新增系列
         */
        addSeries() {
            this.$resetAjax({
                type: "POST",
                url: "/admin/Goods/addxilie",
                data: {
                    name_en: this.formData.english,  // 系列英文名
                    name: this.formData.chinese,    //系列中文名
                },
                success: res => {
                    let result = JSON.parse(res);
                    this.drawerValue = false;
                    this.$Message.success({
                        content: '棒棒哒，新增系列成功',
                        duration: 2
                    });
                    this.getSeriesList();
                }
            });
        },
        /**
         * 编辑系列
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
                        content: '棒棒哒，修改系列成功',
                        duration: 2
                    });
                    this.getSeriesList();
                }
            });
        },
        /**
         * 删除当前项
         */
        deleteSeries(row) {
            this.$resetAjax({
                type: "POST",
                url: "/admin/Goods/delxilie",
                data: {
                    id: row.id,
                },
                success: (res) => {
                    let result = JSON.parse(res);
                    if(result.errorcode === '0') {
                        this.$Message.success({
                            content: '棒棒哒，删除系列成功',
                            duration: 2
                        });
                        this.getSeriesList();
                    }
                }
            });
        },
        /*
        ** 切换分页
        */ 
        changePage(index) {
            this.currentPage = index;
            this.getSeriesList();
        }
    }
}
</script>
