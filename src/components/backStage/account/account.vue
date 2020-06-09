<template>
    <div class="accountPage">
        <div class="top">
            <p class="lookup" @click="show">新增</p>
            <div class="right">
                <p class="hdid_input">
                    <span class="title">用户名：</span>
                    <Input v-model="user" style="width: 180px" placeholder="请输入用户名" @on-enter="lookUp" @on-blur="lookUp" />
                </p>
                <!-- <p class="lookup" @click="lookUp">查询</p> -->
            </div>
        </div>
        <div class="table">
            <Table v-if="isTable" border :height="tableHeight" :columns="columns" :data="orderData"></Table>
        </div>
        <div class="pageContanier">
            <Page :total="total" :page-size="pageSize" :current="currentPage" show-elevator show-total></Page>
        </div>
        <Drawer :title="titleName" v-model="value3" width="720" :styles="styles" class="adver_clos" draggable>
            <Form :model="formData" ref="formData" :rules="formDataRuleVal">
                <Row :gutter="32">
                    <i-Col span="24">
                        <FormItem label="用户名" prop="user" label-position="top">
                            <Input v-model="formData.user" />
                        </FormItem>
                    </i-Col>
                    <i-Col span="24">
                        <FormItem label="密码" prop="pass" label-position="top">
                            <Input v-model="formData.pass" type="password" />
                        </FormItem>
                    </i-Col>
                    <i-Col span="24">
                        <FormItem label="海鼎编码" prop="hdcode" label-position="top">
                            <Input v-model="formData.hdcode" />
                        </FormItem>
                    </i-Col>
                    <i-Col span="24">
                        <FormItem label="身份" prop="groupid" label-position="top">
                            <Select v-model="formData.groupid" filterable>
                                <Option v-for="item in typeList" :value="item.id" :key="item.id">{{item.title}}</Option>
                            </Select>
                        </FormItem>
                    </i-Col>
                </Row>
            </Form>
            <div class="demo-drawer-footer">
                <Button style="margin-right: 8px" @click="value3 = false">取消</Button>
                <Button type="primary" @click="submitJudge('formData')">提交</Button>
            </div>
        </Drawer>
        <Modal v-model="modal1" title="修改密码" draggable>
            <Form :model="formNum" ref="formNum" :rules="ruleValidate1">
                <Row :gutter="32">
                    <i-Col span="24">
                        <FormItem label="新密码" prop="newpass" label-position="top">
                            <Input v-model="formNum.newpass" type="password" />
                        </FormItem>
                        <FormItem label="再次输入新密码" prop="newpass1" label-position="top">
                            <Input v-model="formNum.newpass1" type="password" />
                        </FormItem>
                    </i-Col>
                </Row>
            </Form>
            <div class="demo-drawer-footer">
                <Button style="margin-right: 8px" @click="modal1 = false">取消</Button>
                <Button type="primary" @click="amendPass">提交</Button>
            </div>
        </Modal>
        <Modal v-model="modal2" title="修改身份" draggable>
            <Form :model="formData" ref="formData" :rules="ruleValidate">
                <Row :gutter="32">
                    <i-Col span="24">
                        <FormItem label="身份" prop="groupid" label-position="top">
                            <Select v-model="formData.groupid" filterable>
                                <Option v-for="item in typeList" :value="item.id" :key="item.id">{{item.title}}</Option>
                            </Select>
                        </FormItem>
                    </i-Col>
                </Row>
            </Form>
            <div class="demo-drawer-footer">
                <Button style="margin-right: 8px" @click="modal2 = false">取消</Button>
                <Button type="primary" @click="amendType">提交</Button>
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
      modal2: false,
      // 表单数据
      formNum: {
        pass: "", // 标题
        newpass: "" // 链接
      },
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
      //   表单数据
      formData: {
        user: "", // 类别
        pass: "", // 标题
        hdcode: "", // 链接
        groupid: ""
      },
      ruleValidate: {},
      //   验证
      formDataRuleVal: {
        user: [{ required: true, message: "请输入用户名", trigger: "blur" }],
        pass: [{ required: true, message: "请输入密码", trigger: "blur" }],
        hdcode: [
          { required: true, message: "请输入海鼎密码", trigger: "blur" }
        ],
        type: [
          {
            required: true,
            message: "请选择身份",
            trigger: "change",
            pattern: /.+/
          }
        ],
        groupid: [
          {
            required: true,
            message: "请选择身份",
            trigger: "change",
            pattern: /.+/
          }
        ]
      },
      //   验证密码
      ruleValidate1: {
        newpass: [
          {
            required: true,
            message: "请输入新密码",
            trigger: "blur"
          }
        ],
        newpass1: [
          {
            required: true,
            validator: validatePassCheck,
            trigger: "blur"
          }
        ]
      },
      titleName: "新增",
      // 表头
      columns: [
        {
          title: "账号",
          align: "center",
          key: "user"
        },
        {
          title: "海鼎编码",
          align: "center",
          key: "hdcode"
        },
        {
          title: "身份",
          align: "center",
          key: "title"
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
                  title: "修改密码"
                },
                on: {
                  click: () => {
                    this.modal1 = true;
                    this.bindmodel(row);
                  }
                }
              }),
              h("Icon", {
                props: {
                  type: "md-contact",
                  size: "25",
                  color: "#218da0"
                },
                class: "look",
                domProps: {
                  title: "修改身份"
                },
                on: {
                  click: () => {
                    this.modal2 = true;
                    this.bindType(row);
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
                      "on-cancel": () => {
                        // 取消删除
                      }
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
      isTable: false
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
  watch: {},

  created() {
    // 得到账号列表
    this.userList();
    this.loadData();
  },

  methods: {
    /**
     * 查询判断
     */
    lookUp() {
      this.currentPage = 1;
      this.userList();
    },
    /**
     * 查询得到得到账号列表
     */
    userList() {
      NProgress.start(); // 进度条开始
      this.isTable = false;
      this.$resetAjax({
        type: "GET",
        url: "/Admin/admin/index",
        data: {
          p: this.currentPage,
          user: this.user // 用户名
        },
        success: res => {
          NProgress.done(); // 进度条结束
          this.isTable = true;
          let result = JSON.parse(res);

          let list = result.data;
          this.orderData = list;
          this.total = Number(result.total);
        }
      });
    },
    // 打开侧边栏
    show() {
      this.value3 = true;
    },
    // 获取身份列表
    loadData() {
      this.$resetAjax({
        type: "GET",
        url: "/Admin/admin/grouplist",
        success: res => {
          let result = JSON.parse(res);
          this.typeList = result;
        }
      });
    },
    // 提交
    submitJudge(formData) {
      this.$refs.formData.validate(valid => {
        if (valid) {
          this.$resetAjax({
            type: "POST",
            url: "/Admin/admin/adduser",
            data: this.formData,
            success: res => {
              let result = JSON.parse(res);
              if (result.errorcode == "0") {
                this.value3 = false;
                this.userList();
                this.$Message.success({
                  content: "修改密码成功",
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
        }
      });
    },
    /**
     * 删除
     */
    deleteCart(data) {
      this.$resetAjax({
        type: "POST",
        url: "/Admin/admin/deluser",
        data: {
          id: data.id
        },
        success: res => {
          let result = JSON.parse(res);
          if (result.errorcode == "0") {
            this.userList();
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
     * 打开用户名弹窗
     */
    bindmodel(row) {
      this.activeId = row.id;
    },
    /**
     * 打开身份弹窗
     */
    bindType(row) {
      this.activeId = row.id;
    },

    /**
     * 修改密码
     */
    amendPass() {
      this.$resetAjax({
        type: "POST",
        url: "/Admin/admin/setpass",
        data: {
          id: this.activeId,
          pass: this.formNum.newpass
        },
        success: res => {
          let result = JSON.parse(res);
          if (result.errorcode == "0") {
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
    cancel() {},
    /**
     * 修改角色
     */
    amendType() {
      this.$resetAjax({
        type: "POST",
        url: "/Admin/admin/setgroup",
        data: {
          id: this.activeId,
          group: this.formData.groupid
        },
        success: res => {
          let result = JSON.parse(res);
          if (result.errorcode == "0") {
            this.userList();
            this.$Message.success({
              content: "提交成功",
              duration: 2
            });
            this.modal2 = false;
          } else {
            this.modal2 = true;
            this.$Message.error({
              content: result.msg,
              duration: 2
            });
          }
        }
      });
    }
  }
};
</script>
<style>
.ivu-modal-footer {
  display: none;
}
.demo-drawer-footer {
  padding: 10px 16px;
  text-align: right;
  background: #fff;
}
</style>
