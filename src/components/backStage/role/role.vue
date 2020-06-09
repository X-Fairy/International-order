<template>
    <div class="rolePage">
        <div class="top">
            <p class="lookup" @click="show">新增</p>
        </div>
        <div class="table">
            <Table v-if="isTable" border :height="tableHeight" :columns="columns" :data="orderData"></Table>
        </div>
        <div class="pageContanier">
            <Page :total="total" :page-size="pageSize" :current="currentPage" show-elevator show-total></Page>
        </div>
        <Drawer :title="titleName" v-model="value3" width="720" :styles="styles" class="adver_clos" draggable>
            <Form :model="formData" ref="formData" :rules="ruleValidate">
                <Row :gutter="32">
                    <i-Col span="24">
                        <FormItem label="身份" prop="title" label-position="top">
                            <Input v-model="formData.title" />
                        </FormItem>
                    </i-Col>
                    <i-Col span="24">
                        <div style="border-bottom: 1px solid #e9e9e9;padding-bottom:6px;margin-bottom:6px;">
                            权限:
                            <Checkbox :indeterminate="indeterminate" :value="checkAll" @click.prevent.native="handleCheckAll">全选</Checkbox>
                        </div>
                        <CheckboxGroup v-model="ruleValue">
                            <Checkbox :label="item.id" v-for="(item,index) in resultData" :key="index">{{item.title}}</Checkbox>
                        </CheckboxGroup>
                    </i-Col>
                </Row>
            </Form>
            <div class="demo-drawer-footer">
                <Button style="margin-right: 8px" @click="value3 = false">取消</Button>
                <Button type="primary" @click="submitJudge(formData)">提交</Button>
            </div>
        </Drawer>
        <Modal v-model="modal1" :title="modalTitle" draggable >
            <Row :gutter="32">
                <i-Col span="24">
                    <div style="border-bottom: 1px solid #e9e9e9;padding-bottom:6px;margin-bottom:6px;">
                        权限：
                        <Checkbox :indeterminate="indeterminate" :value="checkAll" @click.prevent.native="handleCheckAll">全选</Checkbox>
                    </div>
                    <CheckboxGroup v-model="ruleValue">
                        <Checkbox :label="item.id" v-for="(item,index) in resultData" :key="index">{{item.title}}</Checkbox>
                    </CheckboxGroup>
                </i-Col>
            </Row>
            <div class="demo-drawer-footer">
                <Button style="margin-right: 8px" @click="modal1 = false">取消</Button>
                <Button type="primary" @click="amendPass">提交</Button>
            </div>
        </Modal>
    </div>
</template>

<script>
import { changeday } from "@/assets/js/tool.js"; // 转化时间为2019-10-09 这样的格式
import { changeTime } from "@/assets/js/tool.js"; // 转化时间为2019-10-09 00:00:00这样的格式
import NProgress from "nprogress"; // 引入进度条
import "nprogress/nprogress.css"; // 引入进度条

export default {
    data() {
        /**
         * 再次新密码验证
         */
        const validatePassCheck = (rule, value, callback) => {
            if (value == undefined) {
                return callback(new Error("请再次输入新密码"));
            } else if (value !== this.formNum.newpass) {
                return callback(new Error("两次密码不一致"));
            } else {
                callback();
            }
        };
        return {
            // 用户名查询
            user: "",
            // 商品总数
            total: 0,
            // 每页条数
            pageSize: 20,
            // 当前页码
            currentPage: 1,
            // 表格高度
            tableHeight: 600,
            // 表格数据
            orderData: [],
            activeId: -1,
            modal1: false,
            //   表单数据
            formNum: {
                pass: "", // 标题
                newpass: "" // 链接
            },
            resultData: [],
            //   侧边栏状态
            value3: false,
            //   身份列表
            typeList: [],
            //   侧面栏样式
            indeterminate: true,
            checkAll: false,
            styles: {
                height: "calc(100% - 55px)",
                overflow: "auto",
                paddingBottom: "53px",
                position: "static"
            },
            //   表单数据
            formData: {
                title: "", // 类别
                rules: ""
            },
            ruleValue: [],
            //   验证
            ruleValidate: {
                title: [{required: true,message: "请输入标题",trigger: "blur"}]
            },
            //   验证密码
            ruleValidate1: {
                newpass: [{required: true,message: "请输入新密码",trigger: "blur"}],
                newpass1: [{required: true,validator: validatePassCheck,trigger: "blur"}]
            },
            titleName: "新增",
            // 表头
            columns: [
                {
                    title: "身份",
                    align: "center",
                    key: "title"
                },
                {
                    title: "状态",
                    align: "center",
                    key: "status"
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
                                    title: "编辑权限"
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
            // 是否显示表格
            isTable: false,
            // 编辑权限标题
            modalTitle: '',
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
        this.loadData();
        this.loadRule();
    },

    methods: {
        // 打开侧边栏
        show() {
            this.value3 = true;
            this.indeterminate = true;
            this.checkAll = false;
            this.ruleValue = [];
        },
        // 获取身份列表
        loadData() {
            NProgress.start()
            this.$resetAjax({
                type: "GET",
                url: "/Admin/admin/grouplist",
                success: res => {
                    let result = JSON.parse(res);
                    NProgress.done(); // 进度条结束
                    this.isTable = true;
                    let list = result;
                    this.orderData = list;
                    this.total = list.length;
                }
            });
        },
        /**
         * 获取权限
         */
        loadRule() {
            NProgress.start()
            this.$resetAjax({
                type: "GET",
                url: "/Admin/admin/getrule",
                success: res => {
                    NProgress.done(); // 进度条结束
                    let result = JSON.parse(res);
                    let list = result;
                    this.resultData = list;
                }
            });
        },
        // 新增提交
        submitJudge(data) {
            var str = JSON.stringify(this.ruleValue);
            this.$resetAjax({
                type: "POST",
                url: "/Admin/admin/addgroup",
                data: {
                    title: data.title,
                    rules: this.stripscript(str)
                },
                success: res => {
                let result = JSON.parse(res);
                if (result.errorcode == "0") {
                    this.value3 = false;
                    this.loadData();
                    this.$Message.success({
                        content: "提交成功",
                        duration: 2
                    });
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
                url: "/Admin/admin/delgroup",
                data: {
                    id: data.id
                },
                success: res => {
                    let result = JSON.parse(res);
                    if (result.errorcode == "0") {
                        this.loadData();
                        this.loadNav();
                    }
                }
            });
        },
        /**
         * 打开用户名弹窗
         */
        bindmodel(row) {
            this.modalTitle = `【${row.title}】权限： `
            this.activeId = row.id;
            this.ruleValue = [];
            this.indeterminate = true;
            this.checkAll = false;
            let list = row.rules.split(",");
            let ruleValue = this.ruleValue;
            let resultData = this.resultData;
            list.forEach(function(item, index) {
                resultData.forEach(function(data, num) {
                    if (item == data.id) {
                        ruleValue.push(data.id);
                    }
                });
            });
        },
        /**
         * 筛选特殊字符串
         */
        stripscript(s) {
            var pattern = new RegExp(
                "[`~!@#$^&*()=|{}':;'\\[\\].<>/?~！@#￥……&*（）&mdash;—|{}【】‘；：”“'。、？]"
            );
            var rs = "";
            for (var i = 0; i < s.length; i++) {
                rs = rs + s.substr(i, 1).replace(pattern, "");
            }
            return rs;
        },
        /**
         * 增加权限
         */
        amendPass() {
            var str = JSON.stringify(this.ruleValue);
            this.$resetAjax({
                type: "POST",
                url: "/Admin/admin/setrule",
                data: {
                    id: this.activeId,
                    rule: this.stripscript(str)
                },
                success: res => {
                let result = JSON.parse(res);
                if (result.errorcode == "0") {
                    this.loadData();
                    this.loadNav();
                    this.$Message.success({
                        content: "提交成功",
                        duration: 2
                    });
                    this.modal1 = false;
                } else {
                    this.modal1 = true;
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
            window.location.reload();
        },
        /**
         *全选
        */
        handleCheckAll() {
            if (this.indeterminate) {
                this.checkAll = false;
            } else {
                this.checkAll = !this.checkAll;
            }
            this.indeterminate = false;
            if (this.checkAll) {
                let ruleValue = this.ruleValue;
                let resultData = this.resultData;
                resultData.forEach(function(data, num) {
                    ruleValue.push(data.id);
                });
            } else {
                this.ruleValue = [];
            }
        }
    }
};
</script>
<style>
    .ivu-checkbox-group-item {
        display: inline-block;
        margin: 10px;
    }

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
