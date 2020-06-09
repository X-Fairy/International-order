<template>
    <div class="attributePage">
        <div class="top">
            <p class="lookup" @click="show">新增</p>
        </div>
        <div class="table">
            <Table v-if="isTable" border :height="tableHeight" :columns="columns" :data="attrsList"></Table>
        </div>
        <Drawer :title="titleName" v-model="valueDrawer" width="720" :styles="styles" class="adver_clos" draggable>
            <Form :model="formData" ref="formData" :rules="ruleValidate">
                <Row :gutter="32">
                    <i-Col span="24">
                        <FormItem label="中文" prop="zhName" label-position="top">
                            <Input v-model="formData.zhName" placeholder="请在此输入商品属性名（中文）" />
                        </FormItem>
                    </i-Col>
                    <i-Col span="24">
                        <FormItem label="英文" prop="enName" label-position="top">
                            <Input v-model="formData.enName" placeholder="请在此输入商品属性名（英文）"   />
                        </FormItem>
                    </i-Col>
                </Row>
            </Form>
            <div class="demo-drawer-footer">
                <Button style="margin-right: 8px" @click="valueDrawer = false">取消</Button>
                <Button type="primary" @click="submitJudge('formData')">提交</Button>
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
            // 表格高度
            tableHeight: 700,
            // 表格数据
            attrsList: [],
            //   侧边栏状态
            valueDrawer: false,
            styles: {
                height: "calc(100% - 55px)",
                overflow: "auto",
                paddingBottom: "53px",
                position: "static"
            },
            //   表单数据
            formData: {
                zhName: "",  // 属性中文名
                enName: ""   // 属性英文名
            },
            //   验证
            ruleValidate: {
                zhName: [{required: true,message: "请输入属性中文名",trigger: "blur"}],
                enName: [{required: true,message: "请输入属性英文名",trigger: "blur"}]
            },
            titleName: "新增",
            // 表头
            columns: [
                {
                    title: "属性（中文）",
                    align: "center",
                    key: "name"
                },
                {
                    title: "属性（英文）",
                    align: "center",
                    key: "en_name"
                },
                {
                    title: '操作',
                    key: "action",
                    width: 320,
                    align: "center",
                    render: (h, { row }) => {
                        return h("div", [
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
            // 是否显示表格
            isTable: false,
        }
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
        // 获取属性列表
        this.getAttrList();
    },

    methods: {
        /**
         * 获取属性列表
         */
        getAttrList() {
            NProgress.start()
            this.$resetAjax({
                type: "GET",
                url: "/admin/goods/get_attr_type",
                success: res => {
                    let result = JSON.parse(res);
                    NProgress.done(); // 进度条结束
                    this.isTable = true;
                    this.attrsList = result;
                }
            });
        },
        // 打开侧边栏
        show() {
            this.valueDrawer = true;
            this.checkAll = false;
        },
        // 新增提交
        submitJudge(formData) {
            this.$refs.formData.validate((valid) => {
                if (valid) {
                    this.$resetAjax({
                        type: "POST",
                        url: "/admin/goods/add_attr",
                        data: {
                            name: this.formData.zhName,
                            en_name: this.formData.enName,
                        },
                        success: res => {
                        let result = JSON.parse(res);
                        if (result.errorcode == "0") {
                            this.valueDrawer = false;
                            this.$Message.success({
                                content: "新增商品属性成功",
                                duration: 2
                            });
                            this.getAttrList();
                        } else {
                            this.valueDrawer = true;
                            this.$Message.error({
                                content: result.msg,
                                duration: 2
                            });
                        }
                        }
                    });
                } 
            })
        },
        /**
         * 删除
         */
        deleteCart(data) {
            this.$resetAjax({
                type: "POST",
                url: "/admin/goods/del_attr",
                data: {
                    id: data.id
                },
                success: res => {
                    let result = JSON.parse(res);
                    if (result.errorcode == "0") {
                        this.$Message.success({
                            content: "删除属性成功",
                            duration: 2
                        });
                        this.getAttrList();
                    }
                }
            });
        },
    }
};
</script>
