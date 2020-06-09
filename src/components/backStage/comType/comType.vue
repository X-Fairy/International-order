<template>
    <div class="comTypePage">
        <div class="top">
            <!-- <p @click="newAdd">新增</p> -->
            <Button type="primary" title="点击同步类别" @click="syncType" class="sync_type">同步</Button>
            <div class="item">
                <span style="font-size:15px;">查询： </span>
                <Input v-model="keyword" placeholder="请输入类别编码 / 英文名 / 中文名..." style="width: 260px" @on-enter="judgeLook" @on-blur="judgeLook"/>
            </div>
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
                        <FormItem label="类别中文名" prop="chinese" label-position="top">
                            <Input v-model="formData.chinese"/>
                        </FormItem>
                    </i-Col>
                    <i-Col span="24">
                        <FormItem label="类别英文名" prop="english" label-position="top">
                            <Input v-model="formData.english"/>
                        </FormItem>
                    </i-Col>
                    <!-- <i-Col span="24" v-show="drawerTitle === '编辑'">
                        <FormItem label="状态" prop="status" label-position="top" class="statusItem">
                            <Select v-model="formData.status">
                                <Option v-for="item in statusList" :value="item.id" :key="item.id">{{ item.name }}</Option>
                            </Select>
                        </FormItem>
                    </i-Col> -->
                </Row>
            </Form>
            <div class="demo-drawer-footer">
                <Button style="margin-right: 8px" @click="drawerValue = false">取消</Button>
                <Button type="primary" @click="submitSeries('formData')">提交</Button>
            </div>
        </Drawer>    
        <!-- 修改关联类别模态框 -->
        <Modal v-model="clsModal"  draggable  :title="modalTitle" @on-ok="submitCls" @on-cancel="clsModal=false;">
            <Select v-model="clsValue" filterable>
                <Option v-for="item in selectData" :value="item.cls_no" :key="item.cls_no">{{ item.cls_name }}</Option>
            </Select>
        </Modal>
    </div>
</template>

<script>
import NProgress from "nprogress"; // 引入进度条
import "nprogress/nprogress.css"; // 引入进度条
export default {
    data() {
        return {
            // 关键字查询
            keyword: '',
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
            // 下拉数据
            selectData: [],
            // 是否显示模态框
            clsModal: false,
            // 关联类别选择哪个
            clsValue: '',
            // 模态框标题
            modalTitle: '',
            // 当前行cls_no
            modalId: '',
            // 抽屉数据
            formData: {
                status: '',  // 类别状态
                english: '', // 类别英文名
                chinese: '', // 类别中文名
            },
            // 表单验证
            ruleValidate: {
                english: [
                    { required: true, message: '类别所属英文名不能为空', trigger: 'blur' }
                ],
                chinese: [
                    { required: true, message: '类别所属中文名不能为空', trigger: 'blur' },
                ],
               /*  status: [
                    { required: true, message: '状态选择不能为空', trigger: 'change' }
                ], */
            },
            // 数据表头
            columns: [
                {
                    title: '类别编码',
                    align: 'center',
                    key: 'cls_no',
                },
                {
                    title: '类别(中文)',
                    align: 'center',
                    key: 'cls_cn',
                },
                {
                    title: '类别(英文)',
                    align: 'center',
                    key: 'cls_name',
                },
                /* {
                    title: '关联类别',
                    align: 'center',
                    key: 'like_id',
                    render: (h, {row}) =>{
                        return (<div onClick={() => this.editLike(row)}  class="edit" style="cursor: pointer;">{row.like_id}</div>);
                    }
                }, */
                /* {
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
                            }), */
                            /* h('span', [
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
                            ]), */
                       /*  ]);
                    }
                }
 */
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
                    status: '',  // 类别状态
                    english: '', // 类别英文名
                    chinese: '', // 类别中文名
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
        // 得到类别数据
        this.getSeriesList();
        // 得到编辑类别下拉数据
        // this.getSelectData();
    },

    methods: {
        judgeLook() {
            this.currentPage = 1;
            this.getSeriesList();
        },
        /**
         * 类别同步
         */
        syncType() {
            this.$resetAjax({
                type: "GET",
                url: "/admin/cls/sync_cls",
                success: (res) => {
                    let result = JSON.parse(res);
                    if(result.errorcode === 0) {
                        this.$Message.success({
                            content: '类别数据同步成功',
                            duration: 3
                        });
                        this.getSeriesList();
                    }
                }
            });
        },
        /**
         * 新增类别
         */
        newAdd() {
            this.drawerValue = true;
            this.drawerTitle = '增加';
        },
        /**
         * 修改关联id
         */
        editLike(row) {
            this.clsModal = true;
            this.modalTitle = row.cls_name;
            this.modalId = row.cls_no;
            this.clsValue = row.like_id;
        },
        /**
         * 得到编辑类别下拉数据
         */
        /* getSelectData() {
            this.$resetAjax({
                type: "GET",
                url: "/admin/cls/get_all_cls",
                success: (res) => {
                    let result = JSON.parse(res);
                    this.selectData = result;
                   console.log(this.selectData)
                }
            });
        }, */
        /**
         * 提交编辑类别下拉数据请求
         */
        submitCls() {
            this.$resetAjax({
                type: "POST",
                url: "/admin/cls/like",
                data: {
                    like_id: this.clsValue,
                    cls_no: this.modalId
                },
                success: (res) => {
                    let result = JSON.parse(res);
                    if(result.errorcode === '0') {
                        this.clsModal = false;
                        this.$Message.success({
                            content: '棒棒哒，修改成功',
                            duration: 3
                        });
                        this.getSeriesList();
                    }
                    
                   
                }
            });
        },
        /**
         * 得到类别管理数据
         */
        getSeriesList() {
            NProgress.start();
            this.$resetAjax({
                type: "GET",
                url: "/admin/cls/index",
                data: {
                    page: this.currentPage,
                    keyword: this.keyword
                },
                success: (res) => {
                    NProgress.done();
                    let result = JSON.parse(res);
                    this.total = Number(result.total);
                    result.data.forEach(ele => {
                        ele.like_id = ele.like_id === null ? '无' : ele.like_id
                    });
                    this.tableData = result.data;
                }
            });
        },
        /**
         * 得到类别详情
         */
        getSeriesDetail(row) {
            this.drawerTitle = '编辑';
            this.drawerValue = true;
            this.formData = {
                english: row.cls_name, // 类别英文名
                chinese: row.cls_cn, // 类别中文名
                id: row.cls_no,
            }
        },
        /**
         * 提交类别前判断是新增还是编辑
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
         * 新增类别
         */
        addSeries() {
            this.$resetAjax({
                type: "POST",
                url: "/admin/Goods/addxilie",
                data: {
                    name_en: this.formData.english,  // 类别英文名
                    name: this.formData.chinese,    //类别中文名
                },
                success: res => {
                    let result = JSON.parse(res);
                    this.drawerValue = false;
                    this.$Message.success({
                        content: '棒棒哒，新增类别成功',
                        duration: 2
                    });
                    this.getSeriesList();
                }
            });
        },
        /**
         * 编辑类别   已完成
         */
        editSeries() {
            this.$resetAjax({
                type: "POST",
                url: "/admin/cls/like",
                data: {
                    cls_name:this.formData.english,
                    cls_cn:this.formData.chinese,
                    cls_no: this.formData.id,
                },
                success: (res) => {
                    let result = JSON.parse(res);
                    if(result.errorcode === '0') {
                        this.drawerValue = false;
                        this.$Message.success({
                            content: '棒棒哒，修改类别成功',
                            duration: 2
                        });
                        this.getSeriesList();
                    }
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
                            content: '棒棒哒，删除类别成功',
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
