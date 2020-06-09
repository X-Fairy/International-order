<template>
    <div class="authority">
        <div class="top">
            <p class="lookup" @click="show">新增</p>
            <div class="right">
                <span style="margin-right:5px;">URL： </span>
                <Input v-model="keyword" placeholder="请输入URL" @on-enter="enterKey" @on-blur="enterKey" />
            </div>
        </div>
        <div class="table">
            <Table border :height="tableHeight" :columns="columns" :data="orderData"></Table>
        </div>
        <div class="pageContanier">
            <Page :total="total" :page-size="pageSize" :current="currentPage" @on-change="changePage" show-elevator show-total></Page>
        </div>
        <Drawer :title="titleName" v-model="value3" width="720" :styles="styles" class="adver_clos" draggable>
            <Form :model="formData" ref="formData" :rules="ruleValidate">
                <Row :gutter="32">
                    <i-Col span="24">
                        <FormItem label="标题" prop="title" label-position="top">
                            <Input v-model="formData.title" />
                        </FormItem>
                    </i-Col>
                    <i-Col span="24">
                        <FormItem label="类型" prop="type" label-position="top">
                            <Select v-model="formData.type">
                                <Option v-for="item in typeList" :value="item.id" :key="item.id">{{item.title}}</Option>
                            </Select>
                        </FormItem>
                    </i-Col>
                    <i-Col span="24">
                        <FormItem label="父级" prop="fid" label-position="top">
                            <Select v-model="formData.fid" filterable>
                                <Option :value="''" :key="''">不选</Option>
                                <Option v-for="item in fidData" :value="item.id" :key="item.id">{{item.title}}</Option>
                            </Select>
                        </FormItem>
                    </i-Col>
                    <i-Col span="24" v-if="formData.type==1">
                        <FormItem label="URL" prop="name" label-position="top">
                            <Input v-model="formData.name" :disabled="titleName!=='新增'" />
                        </FormItem>
                    </i-Col>

                    <i-Col span="24">
                        <FormItem label="图标" prop="icon" label-position="top">
                            <Input v-model="formData.icon"  :disabled="titleName!=='新增'" />
                        </FormItem>
                    </i-Col>
                    <i-Col span="24">
                        <FormItem label="排序" label-position="top" class="order_Item">
                            <InputNumber :min="1" v-model="formData.order"></InputNumber>
                        </FormItem>
                    </i-Col>
                </Row>
            </Form>
            <div class="demo-drawer-footer">
                <Button style="margin-right: 8px" @click="value3 = false">取消</Button>
                <Button type="primary" @click="submitJudge(formData)">提交</Button>
            </div>
        </Drawer>
    </div>
</template>

<script>
import { changeday } from "@/assets/js/tool.js"; // 转化时间为2019-10-09 这样的格式
import { changeTime } from "@/assets/js/tool.js"; // 转化时间为2019-10-09 00:00:00这样的格式
import NProgress from "nprogress"; // 引入进度条
import "nprogress/nprogress.css"; // 引入进度条

export default {
    data() {
        return {
        // URL查询
        keyword:'',
        // 用户名查询
        user: "",
        // 表格高度
        tableHeight: 600,
        // 表格数据
        orderData: [],
        fidData: [],
        activeId: -1,
        modal1: false,
        modal2: false,
        //   侧边栏状态
        value3: false,
        //   身份列表
        typeList: [],
        //   侧面栏样式
        styles: {
            height: "calc(100% - 55px)",
            overflow: "auto",
            paddingBottom: "53px",
            position: "static"
        },
        typeList: [
            {
                id: 1,
                title: "open"
            },
            {
                id: 2,
                title: "spread"
            }
        ],
        //  新增表单数据
        formData: {
            type: "", //类型
            fid: 0, // 父级id
            title: "", // 标题
            name: "", // 链接
            icon: "" , // 图标
            order: 1,  // 排序
        },
        //   新增表单验证
        ruleValidate: {
            title: [{ required: true, message: "请输入标题", trigger: "blur" }],
            type: [{ required: true, message: "请选择类型", trigger: "blur" }],
            name: [{ required: true, message: "请输入链接", trigger: "blur" }],
            icon: [{  required: true,message: "请输入图标",trigger: "blur"}]
        },

        titleName: "新增",
        // 表头
        columns: [
            {
                title: "标题",
                align: "center",
                key: "title"
            },
            {
                title: "ID",
                align: "center",
                key: "id"
            },
            {
                title: "导航级别",
                align: "center",
                key: "type"
            },
            {
                title: "fid",
                align: "center",
                key: "fid"
            },
            {
                title: "URL",
                align: "center",
                key: "name"
            },
            {
                title: "Icon",
                align: "center",
                key: "icon"
            },

            {
            title: this.$t("backOrderPage.operation"),
            key: "action",
            width: 320,
            align: "center",
            render: (h, { row }) => {
                return h("div", [
                    h("Icon", {
                        props: {
                            type: "ios-create",
                            size: "25",
                            color: "#218da0"
                        },
                        class: "look",
                        domProps: {
                            title: "点击编辑"
                        },
                        on: {
                            click: () => {
                                this.modal1 = true;
                                this.bindmodel(row);
                            }
                        }
                    }),
                    h("span", [
                        h(
                        "Poptip",
                        {
                            class: "handle",
                            props: {
                                confirm: true,
                                transfer: true,
                                placement: "top",
                                title: "确定要删除吗？",
                                type: "error",
                                size: "small",
                                width: "150",
                                vModel: true
                            },
                            domProps: {
                                title: "删除"
                            },
                            style: {
                                cursor: "pointer"
                            },
                            on: {
                                "on-ok": () => {
                                    // 确定删除
                                    this.deleteCart(row);
                                },
                            }
                        },
                        [
                            h("Icon", {
                                props: {
                                    type: "ios-trash",
                                    size: "26",
                                    color: "#333"
                                },
                                class: "delete"
                                })
                            ]
                        )
                    ])
                ]);
            }
            }
        ],
        // 分页总数
        total: 0,
        // 页码数量
        pageSize:20,
        // 页码
        currentPage:1,
        };
    },
    mounted() {
        setTimeout(() => {
            // 得到浏览器内容高度
            let windowHeight =
            document.documentElement.clientHeight || document.body.clientHeight;
            this.tableHeight = windowHeight - 240;
            }, 100);
            // 调整浏览器的时候
            $(window).on("resize", () => {
            let windowHeight =
            document.documentElement.clientHeight || document.body.clientHeight;
            this.tableHeight = windowHeight - 240;
        });
    },

    created() {
        // 获取父级数据
        this.getFatherData();
        // 获取权限列表数据
        this.loadData();
    },

    methods: {
        /**
         * URL进行搜索
         */
        enterKey() {
            this.currentPage = 1;
            this.loadData();
        },
        // 打开侧边栏
        show() {
            this.titleName = "新增";
            this.value3 = true;
            this.formData = {
                type: "", //类型
                fid: "", // 父级id
                title: "", // 标题
                name: "", // 链接
                icon: ""  , // 图标
                order: 1,  // 排序

            };
        },
        // 获取权限列表
        loadData() {
            NProgress.start();
            this.$resetAjax({
                type: "GET",
                url: "/Admin/admin/rulelist",
                data: {
                    page: this.currentPage,
                    keyword: this.keyword, // URL
                },
                success: res => {
                    NProgress.done(); // 进度条结束
                    let result = JSON.parse(res);
                    let list = result.data;
                    this.orderData = list;
                    this.total = result.total;
                }
            });
        },
        // 获取父级数据
        getFatherData() {
            NProgress.start();
            this.$resetAjax({
                type: "GET",
                url: "/Admin/admin/rulelist",
                success: res => {
                    NProgress.done(); // 进度条结束
                    let result = JSON.parse(res);
                    this.fidData = result.filter(ele => ele.fid===0)
                }
            });
        },
        /**
         * 切换页码
         */
        changePage(index) {
            this.currentPage = index;
            this.loadData();
        },
        // 新增
        submitJudge(data) {
            let url;
            if (this.titleName == "新增") {
                url = "/Admin/admin/addrule";
            } else {
                url = "/Admin/admin/updaterule";
            }
            this.$resetAjax({
                type: "POST",
                url: url,
                data: data,
                success: res => {
                let result = JSON.parse(res);
                if (result.errorcode == "0") {
                    this.value3 = false;
                    this.loadNav();
                    if (this.titleName == "新增") {
                        this.$Message.success({
                            content: "棒棒哒，新增成功",
                            duration: 2
                        });
                    } else {
                        this.$Message.success({
                            content: "棒棒哒，修改成功",
                            duration: 2
                        });
                    }
                    
                } else {
                    this.value3 = true;
                    this.$Message.error({
                        content: result.msg,
                        duration: 2
                    });
                }
                }
            });
        },
        /**
         * 删除
         */
        deleteCart(data) {
            this.$resetAjax({
                type: "POST",
                url: "/Admin/admin/delrule",
                data: {
                    id: data.id
                },
                success: res => {
                    let result = JSON.parse(res);
                    if (result.errorcode == "0") {
                        this.loadData();
                        this.loadNav();
                        this.$Message.success({
                            content: "删除成功",
                            duration: 2
                        });
                    } else {
                        this.$Message.error({
                            content: result.msg,
                            duration: 2
                        });
                    }
                }
            });
        },
        /**
         * 刷新导航
         */
        loadNav() {
            location.reload();
        },
        /**
         * 编辑
         */
        bindmodel(row) {
            this.titleName = "编辑";
            this.value3 = true;
            this.activeId = row.id;
            let data = {
                title: row.title, // 标题
                name: row.name, // 链接
                icon: row.icon, // 链接
                type: row.type,
                fid: row.fid,
                id: row.id,
                order: row.order
            };
            this.formData = data;
            },
        }
};
</script>
<style>
    .ivu-modal-footer {
        display: none;
    }
    .demo-drawer-footer {
        border-top: 1px solid #e8e8e8;
        padding: 10px 16px;
        text-align: right;
        background: #fff;
    }
</style>
