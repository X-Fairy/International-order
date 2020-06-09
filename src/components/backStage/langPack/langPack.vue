<template>
    <div class="langPack">
        <div class="top">
            <p @click="newAdd">新增</p>
        </div>
        <div class="table">
            <Table :height="tableHeight" border  :columns="columns" :data="tableData" ></Table>  
        </div>
        <div class="pageContanier">
            <Page :total="total" :page-size="pageSize" @on-change="changePage" :current="currentPage" show-elevator show-total></Page>
        </div>
        <Drawer :title="drawerTitle" v-model="drawerValue" width="720" :draggable ="true" :styles="styles" class="langDrawer">
            <Form :model="formData">
                <Row :gutter="32">
                    <i-Col span="24">
                        <FormItem label="sentence" label-position="top">
                            <Input v-model="formData.sentence" :disabled="isDisabled" />
                        </FormItem>
                    </i-Col>
                    <i-Col span="24">
                        <FormItem label="chinese" label-position="top">
                            <Input v-model="formData.chinese" :disabled="isDisabled"/>
                        </FormItem>
                    </i-Col>
                    <i-Col span="24">
                        <FormItem label="english" label-position="top">
                            <Input v-model="formData.english"/>
                        </FormItem>
                    </i-Col>
                    <i-Col span="24">
                        <FormItem label="french" label-position="top">
                            <Input v-model="formData.french"/>
                        </FormItem>
                    </i-Col>
                    <i-Col span="24">
                        <FormItem label="russian" label-position="top">
                            <Input v-model="formData.russian"/>
                        </FormItem>
                    </i-Col>
                    <i-Col span="24">
                        <FormItem label="spanish" label-position="top">
                            <Input v-model="formData.spanish"/>
                        </FormItem>
                    </i-Col>
                </Row>
            </Form>
            <div class="demo-drawer-footer">
                <Button style="margin-right: 8px" @click="drawerValue = false">取消</Button>
                <Button type="primary" @click="submitLang">提交</Button>
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
            // 数据表头
            columns: [
                {
                    title: '中文',
                    align: 'center',
                    key: 'Chinese',
                },
                {
                    title: '英文',
                    align: 'center',
                    key: 'English',
                },
                {
                    title: '法语',
                    align: 'center',
                    key: 'French',
                },
                {
                    title: '俄语',
                    align: 'center',
                    key: 'Russian',
                },
                {
                    title: '西班牙语',
                    align: 'center',
                    key: 'Spanish',
                },
                {
                    title: '路径',
                    align: 'center',
                    key: 'sentence',
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
                                        this.getLangDetail(row)
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
                                            this.deleteCart(row)
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
            // 抽屉数据
            formData: {
                sentence: '',
                spanish: '',
                russian: '',
                french: '',
                english: '',
                chinese: '',
            },
            // 总数
            total: 0,
            // 每页条数
            pageSize: 20,
            // 当前页码
            currentPage: 1,
            // 是否显示抽屉
            drawerValue: false,
            // 是否允许编辑中文
            isDisabled: true,
        }
    },
    watch: {
        drawerValue(val) {
            if(!val) {
                this.formData = {
                    sentence: '',
                    Spanish: '',
                    Russian: '',
                    french: '',
                    English: '',
                    Chinese: '',
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
        // 得到语言包数据
        this.getLangData();
    },

    methods: {
        /**
         * 新增语言
         */
        newAdd() {
            this.drawerValue = true;
            this.drawerTitle = '增加';
            this.isDisabled = false;
        },
        /**
         * 得到语言包数据
         */
        getLangData() {
            NProgress.start()
            this.$resetAjax({
                type: "GET",
                url: "/admin/Lang/langlist",
                success: res => {
                    NProgress.done()
                    let result = JSON.parse(res);
                    this.tableData = result.list;
                    this.total = result.other.totalPage;
                }
            });
        },
        /**
         * 得到语言详情
         */
        getLangDetail(row) {
            NProgress.start()
            this.drawerTitle = '编辑';
            this.isDisabled = true;
            this.drawerValue = true;
            this.$resetAjax({
                type: "POST",
                url: "/admin/Lang/reg",
                data: {
                    id: row.id,
                },
                success: res => {
                    NProgress.done()
                    let result = JSON.parse(res);
                    let info = result[0];
                    this.formData = {
                        chinese: info.Chinese,
                        english: info.English,
                        french: info.French,
                        russian: info.Russian,
                        spanish: info.Spanish,
                        id: info.id,
                        sentence: info.sentence
                    }
                }
            });
        },
        /**
         * 提交语言前判断是新增还是编辑
         */
        submitLang() {
            if(this.drawerTitle === '编辑') {
                this.editLang();
            } else {
                this.addLang();
            }
        },
        /**
         * 新增语言
         */
        addLang() {
            this.$resetAjax({
                type: "POST",
                url: "/admin/lang/addlang",
                data: {
                    sentence: this.formData.sentence,
                    group_id: localStorage.group_id,
                    Chinese: this.formData.chinese,
                },
                success: res => {
                    let result = JSON.parse(res);
                    this.drawerValue = false;
                    this.$Message.success({
                        content: '新增成功',
                        duration: 2
                    });
                    this.getLangData();
                }
            });
        },
        /**
         * 编辑语言
         */
        editLang() {
            this.$resetAjax({
                type: "POST",
                url: "/admin/Lang/editlang",
                data: {
                    id: this.formData.id,
                    english: this.formData.english,
                    spanish: this.formData.spanish,
                    french: this.formData.french,
                    russian: this.formData.russian,
                },
                success: res => {
                    let result = JSON.parse(res);
                    this.drawerValue = false;
                    this.$Message.success({
                        content: '修改成功',
                        duration: 2
                    });
                    this.getLangData();
                }
            });
        },
        /**
         * 删除当前项
         */
        deleteCart(row) {
            this.$resetAjax({
                type: "POST",
                url: "/admin/lang/dellang",
                data: {
                    id: row.id,
                },
                success: res => {
                    let result = JSON.parse(res);
                    if(result.res === 'ok') {
                        this.$Message.success({
                            content: '删除成功',
                            duration: 2
                        });
                        this.getLangData();
                    }
                }
            });
        },
        // 分页
        changePage(index) {
            this.currentPage = index;
            this.getLangData();
        }
    }
}
</script>
