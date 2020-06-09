<template>
    <div class="credentialsPage">
        <div class="top">
            <div class="top_left">
                <p class="add_new" @click="addNew">新增</p>
            </div>
            <div class="top_right" style="display:flex;align-items: center;">
                <span>查找： </span>
                <Select v-model="cerType" style="width:200px;" @on-change="changeCer" placeholder="请选择认证文件类型">
                    <Option v-for="item in TypeList" :value="item.id" :key="item.id">{{item.name}}</Option>
                </Select>
            </div>
        </div>
        <div class="table">
            <Table border :height="tableHeight" :columns="columns" :data="tableData"></Table>
        </div>
        <div class="pageContanier">
            <Page :total="total" :page-size="pageSize" :current="currentPage" show-elevator show-total @on-change="changePage"></Page>
        </div>
        <!-- 新增证书抽屉 -->
        <Drawer :title="titleName" v-model="cerValue" width="800" :styles="styles" class="adver_credentialsPage" draggable>
            <Form :model="formData" ref="formData" :rules="ruleValidate">
                <Row :gutter="32">
                    <i-Col span="24">
                        <FormItem label="认证形式" prop="form" label-position="top">
                            <Select v-model="formData.form" filterable >
                                <Option v-for="item in TypeList" :value="item.id" :key="item.id">{{item.name}}</Option>
                            </Select>
                        </FormItem>
                    </i-Col>
                    <i-Col span="24">
                        <FormItem label="认证类型" prop="creType" label-position="top">
                            <Select v-model="formData.creType" filterable multiple @on-change="changeCreType">
                                <Option value="00">全选</Option>
                                <Option value="01">全不选</Option>
                                <Option v-for="item in credentialList" :value="item.id" :key="item.id">{{item.name}}</Option>
                            </Select>
                        </FormItem>
                    </i-Col>
                    <i-Col span="24">
                        <FormItem label="日期" prop="validity" label-position="top" class="dataRange">
                            <DatePicker type="date" v-model="formData.validity" style="width: 100%">
                            </DatePicker>
                        </FormItem>
                    </i-Col>
                    <!-- <i-Col span="24">
                        <FormItem label="路径" prop="src" label-position="top">
                        <Input v-model="formData.src" disabled placeholder="请先上传文件,自动获取文件路径" />
                        </FormItem>
                    </i-Col>  -->
                    <i-Col span="24">
                        <p style="padding-bottom: 8px;">上传文件(限制PDF格式)</p>
                        <Upload action="http://order.xmvogue.com/word/public/index.php?s=Admin/Credential/upload" :show-upload-list="false" :on-success="handleSuccess" :on-format-error="handleFormatError" :before-upload="handleBeforeUpload" :format="['pdf','jpg','jpeg','png']">
                            <Button icon="ios-cloud-upload-outline">上传</Button>
                        </Upload>
                    </i-Col>
                    <i-Col span="24">
                        <FormItem>
                            <ul>
                                <li v-for="(item,index) in uploadList" :key="index" class="upload_list">
                                    <h3>文件{{index+1}} ：</h3>
                                    <p style="width:60%;">{{item}}</p> 
                                    <p class="clear" @click="delUpload(index)" title="点击删除当前上传文件">删除</p>
                                </li>
                            </ul>
                        </FormItem>
                    </i-Col>
                    <i-Col span="24" v-show="titleName==='新增'">
                        <Button type="primary" @click="modal1 = true" style="margin: 15px 0;">绑定商品</Button>
                        <div style="padding-top:30px">
                            <div class="goods" v-for="(item,index) in goods3" :key="index">
                                <div class="goods-top">
                                    <div class="goods-img">
                                        <img v-lazy="item.pic" alt srcset />
                                    </div>
                                    <div class="goods-no">
                                        <div>商品名称：{{item.item_name}}</div>
                                        <div>商品编码：{{item.item_no}}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </i-Col>
                </Row>
                <div class="demo-drawer-footer">
                    <Button style="margin-right: 8px" @click="cerValue = false">取消</Button>
                    <Button type="primary" @click="submitJudge(formData)">保存</Button>
                </div>
            </Form>
        </Drawer>
        <Drawer title="已绑定商品" v-model="modal2" width="720" :styles="styles" class="adver_credentialsPage" draggable>
            <Button type="primary" @click="modal1 = true">新增</Button>
            <div style="padding-top:30px">
                <div class="goods" v-for="(item,index) in goods1" :key="index">
                    <div class="goods-top">
                        <div class="goods-img">
                            <img v-lazy="item.pic" alt srcset />
                        </div>
                        <div class="goods-no">
                            <div>商品名称：{{item.item_name}}</div>
                            <div>商品编码：{{item.item_no}}</div>
                        </div>
                    </div>
                    <Button type="primary" @click="delCredential(item.id)">解绑</Button>
                </div>
            </div>
        </Drawer>
        <Modal v-model="modal1"  draggable  title="搜索商品" @on-ok="''" @on-cancel="cancel" class="searchCode_goods">
            <Row :gutter="32">
                <i-Col span="24">
                    <Input search placeholder="请输入商品编码" @on-search="bindSearch" v-model="code" />
                    <div v-if="goods2.length!=0">
                        <div class="goods-title">搜索结果：</div>
                        <div class="goods" v-for="(item,index) in goods2" :key="index">
                            <div class="goods-top">
                                <div class="goods-img">
                                    <img v-lazy="item.pic" alt srcset />
                                </div>
                                <div class="goods-no">
                                    <div>商品名称：{{item.item_name}}</div>
                                    <div>商品编码：{{item.item_no}}</div>
                                </div>
                            </div>
                            <Button type="primary" @click="binding(item)">绑定</Button>
                        </div>
                    </div>
                </i-Col>
                <i-Col span="24" v-if="goods2.length!=0">
                    <div class="goods_Page">
                        <Page :total="bdTotal" :page-size="bdPageSize" @on-change="bdChangePage" :current="bdCurrentPage" show-elevator show-total></Page>
                    </div>
                </i-Col>
            </Row>
        </Modal>
    </div>
</template>

<script>
import { changeday } from "@/assets/js/tool.js";
import NProgress from 'nprogress'   // 引入进度条
import 'nprogress/nprogress.css'    // 引入进度条
export default {
    data() {
        return {
            code: "",
            modal1: false,
            goods1: [],
            goods2: [],
            goods3: [],
            modal2: false,
            activeId: -1,
            // 证书类型选项
            cerType: 1,
            // 证书类型数据
            cerTypeList: [],
            // 证书认证形式数据
            TypeList: [
                {
                    id: 1,
                    name: "报告"
                },
                {
                    id: 2,
                    name: "证书"
                },
                {
                    id: 3,
                    name: "报告 + 证书"
                }
            ],
             // 绑定查询出来的商品总数
            bdTotal: 0,
            // 绑定查询出来的当前页码
            bdCurrentPage: 1,
            // 绑定的页码
            bdPageSize: 10,
            // 商品总数
            total: 0,
            // 每页条数
            pageSize: 20,
            // 当前页码
            currentPage: 1,
            // 表格高度
            tableHeight: 600,
            // 表格数据
            tableData: [],
            columns: [
                {
                    title: "编码",
                    align: "center",
                    key: "id"
                },
                {
                    title: "认证形式",
                    align: "center",
                    key: "form"
                },
                {
                    title: "认证类型",
                    align: "center",
                    key: "name"
                },
                {
                    title: "日期",
                    align: "center",
                    key: "validity"
                },
                {
                    title: "文件",
                    align: "center",
                    key: "src",
                    render: (h, { row }) => {
                        return h("div", [
                        h("span",{
                            class: "itemEn",
                            domProps: {
                                title: row.src
                            },
                            class: 'look_file',
                            on: {
                                click: () => {
                                    location.href=`http://order.xmvogue.com/word/public/index.php?s=/admin/credential/download&id=${row.id}`
                                }
                            }
                            },"下载文件")
                        ]);
                    }
                },
                {
                    title: "操作",
                    key: "action",
                    width: 320,
                    align: "center",
                    render: (h, { row }) => {
                        return h("div", [
                            h("Icon", {
                                props: {
                                    type: "ios-eye",
                                    size: "25",
                                    color: "#218da0"
                                },
                                class: "look",
                                domProps: {
                                    title: "查看已绑定商品"
                                },
                                on: {
                                    click: () => {
                                        this.show1(row);
                                    }
                                }
                            }),
                            h("Icon", {
                                props: {
                                    type: "ios-create",
                                    size: "25",
                                    color: "#218da0"
                                },
                                class: "look",
                                domProps: {
                                    title: "点击编辑认证文件"
                                },
                                on: {
                                    click: () => {
                                        this.editReady(row);
                                    }
                                }
                            }),
                            h("span", [
                                h("Poptip",{
                                    class: "handle",
                                    props: {
                                        confirm: true,
                                        transfer: true,
                                        placement: "top",
                                        title: "您确定删除吗",
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
                                            this.deleteCer(row);
                                        },
                                        }
                                },
                                [ h("Icon", {
                                    props: {
                                        type: "md-trash",
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
            // 证书抽屉标题
            titleName: "",
            // 是否显示证书抽屉
            cerValue: false,
            styles: {
                height: "calc(100% - 55px)",
                overflow: "auto",
                paddingBottom: "53px",
                position: "static"
            },
            // 证书字段
            formData: {
                // no: "", // 证书编码
                creType: [], // 证书类型
                src_new: [], // 路径
                validity: "", // 日期
                form: "" //认证形式
            },
            ruleValidate: {
                creType: [{required: true,message: "证书类型不能为空",trigger: "change",pattern: /.+/}],
                form: [{required: true,message: "认证形式不能为空",trigger: "change",pattern: /.+/}],
                validity: [{required: true,message: "日期选择不能为空",trigger: "change",pattern: /.+/}]
            },
            // 证书地区列表
            credentialList: [],
            // 判断是新增还是编辑
            isAdd: 0,
            // 当前证书行的id
            editId: "",
            // 当前行证书编码
            editNo: '',
            uploadList: []
        };
    },
    watch: {
        cerValue(val) {
            if (!val) {
                this.formData = {
                    no: "", // 证书编码
                    creType: [], // 证书类型
                    src_new: [], // 路径
                    validity: "" // 日期
                };
                this.uploadList = [];
            }
        }
    },
    mounted() {
        setTimeout(() => {
            // 得到浏览器内容高度
            let windowHeight = document.documentElement.clientHeight || document.body.clientHeight;
            this.tableHeight = windowHeight - 280;
        }, 100);
        // 调整浏览器的时候
        $(window).on("resize", () => {
            let windowHeight = document.documentElement.clientHeight || document.body.clientHeight;
            this.tableHeight = windowHeight - 280;
        });
    },
    created() {
        // 得到证书地区列表
        this.getCerArea();
        // 获取证书类型数据
        this.getTypetList();
        // 获取证书列表
        this.getCerData();
    },
    methods: {
        /**
         * 删除上传的文件
         */
        delUpload(index) {
            this.uploadList.splice(index, 1);
            this.formData.src_new = this.uploadList;
        },
        /**
         * 分页切换
         */
        changePage(index) {
            this.currentPage = index;
            this.getCerData();
        },
        /**
         * 认证类型选择
         */
        changeCreType(value) {
            // 如果是全选
            if(value[value.length - 1] === '00') {
                this.formData.creType = this.credentialList.map(ele => ele.id);
                return false;
            }
            // 如果是全不选
            if(value[value.length - 1] === '01') {
                this.formData.creType = [];
                return false;
            }
        },
        /**
         * 得到证书地区列表
         */
        getCerArea() {
            this.$resetAjax({
                type: "GET",
                url: "/Admin/Credential/getcountry",
                success: res => {
                    let result = JSON.parse(res);
                    this.areaList = result;
                }
            });
        },
        /**
         * 获取证书类型数据
         */
        getTypetList() {
            this.$resetAjax({
                type: "GET",
                url: "/Admin/Credential/getAllType",
                success: res => {
                    let result = JSON.parse(res);
                    this.credentialList = result;
                }
            });
        },
        /**
         * 绑定里的商品分页
         */
        bdChangePage(index) {
            this.bdCurrentPage = index;
            this.bindSearch();
        },
        /**
         * 上传的图片成功返回图片的信息
         */
        handleSuccess(res, file) {
            NProgress.done();
            this.$Notice.success({
                title: "提示",
                desc: "上传文件成功;"
            });
            this.formData.src_new.push(res.src);
            this.uploadList.push(res.src);
        },
        /**
         * 上传前验证是否已经上传过，允许上传多次
         */
        handleBeforeUpload() {
            NProgress.start();
            /* if (this.formData.src.length !== 0) {
                this.$Notice.warning({
                    title: "提示",
                    desc: "抱歉，您已经上传过，不能再上传;"
                });
                return false;
            } */
        },
        /**
         * 对上传的图片进行格式判断
         */
        handleFormatError(file) {
            NProgress.done();
            this.$Notice.warning({
                title: "文件格式不正确",
                desc: "上传文件格式不正确。"
            });
        },
        /**
         * 选择认证文件
         */
        changeCer() {
            this.currentPage = 1;
            this.getCerData();
        },
        /**
         * 得到证书类型数据
         */
        getCerData() {
            NProgress.start();
            this.$resetAjax({
                type: "POST",
                url: "/Admin/Credential/getList_new",
                data:{
                    form: this.cerType,
                    page: this.currentPage
                },
                success: res => {
                    NProgress.done();
                    let result = JSON.parse(res);
                    let list = result.data;
                    list.forEach(function(item, index) {
                        if (item.form) {
                            switch(item.form) {
                                case 1:
                                    item.form = '报告';
                                    break;
                                case 2:
                                    item.form = '证书';
                                    break;
                                case 3:
                                    item.form = '报告 + 证书';
                                    break;
                            }
                            // item.form = item.form == 1 ? "报告" : "证书";
                        }
                    });
                    this.tableData = list;
                    this.formData.form = "";
                    this.total = Number(result.total);
                }
            });
        },
        /**
         * 新增证书准备
         */
        addNew() {
            this.cerValue = true;
            this.isAdd = 1;
            this.titleName = "新增";
            this.activeId = -1;
            this.goods1 = [];
            this.goods3 = [];
        },
        /**
         * 提交前进行判断
         */
        submitJudge(formData) {
            this.$refs.formData.validate(valid => {
                if (valid) {
                    switch(this.titleName) {
                        case '新增':
                            this.addNewQuery();
                            break;
                        case '编辑':
                            this.editQuery();
                            break;
                    }
                    
                }
            });
        },
        /**
         * 新增请求
         */
        addNewQuery() {
            let goodsList = [];
            if (this.goods3.length != 0) {
                let list = this.goods3;
                list.forEach(function(item, index) {
                    goodsList.push(item.id);
                });
            }
            if (this.formData.src_new.length === 0) {
                this.$Message.error({
                    content: `抱歉，提交前请先上传文件`,
                    duration: 3
                });
                return false;
            }
            this.$resetAjax({
                type: "POST",
                url: `/Admin/Credential/add`,
                data: {
                    src_new: this.formData.src_new,
                    type: this.formData.creType.join(','),
                    validity: changeday(this.formData.validity),
                    form: this.formData.form,
                    goodsList: goodsList
                },
                success: res => {
                    let result = JSON.parse(res);
                    if (result.errorcode === 0) {
                        this.$Message.success({
                            content: "棒棒哒，新增成功",
                            duration: 3
                        });
                        this.cerValue = false;
                        this.formData.form = "";
                        this.getCerData();
                    } else {
                        this.$Message.success({
                            content: "抱歉，新增失败",
                            duration: 3
                        });
                    }
                }
            });
        },
        /**
         * 编辑准备
         */
        editReady(row) {
            this.titleName = '编辑';
            this.cerValue = true;
            let arr = [];
            row.type.split(',').forEach(ele => {
                arr.push(Number(ele))
            })
            this.TypeList.forEach(ele => {
                if(ele.name === row.form) {
                    this.formData = {
                        no: row.no, // 证书编码
                        creType: arr, // 证书类型
                        src: row.srclist, // 路径
                        validity: row.validity,// 日期
                        form: ele.id
                    };
                }
            })
            this.uploadList = [];
            this.uploadList = row.srclist.concat();
            this.formData.src_new = this.uploadList;
            console.log(this.uploadList)
            this.editId = row.id;
            this.editNo = row.no;
        },
        /**
         * 编辑请求
         */
        editQuery() {
            if (this.formData.src_new.length === 0) {
                this.$Message.error({
                    content: `抱歉，提交前请先上传文件`,
                    duration: 3
                });
                return false;
            }
            this.$resetAjax({
                type: "POST",
                url: `/Admin/Credential/update`,
                data: {
                    id: this.editId,
                    src_new: this.formData.src_new,
                    type: this.formData.creType.join(','),
                    validity: changeday(this.formData.validity),
                    form: this.formData.form,
                    no: this.editNo,   // 证书编码
                },
                success: res => {
                    let result = JSON.parse(res);
                    if (result.errorcode === 0) {
                        this.$Message.success({
                            content: "棒棒哒，修改成功",
                            duration: 3
                        });
                        this.cerValue = false;
                        this.getCerData();
                    } else {
                        this.$Message.success({
                            content: "抱歉，修改失败",
                            duration: 3
                        });
                    }
                }
            });
        },
        /**
         * 删除证书请求
         */
        deleteCer(row) {
            this.$resetAjax({
                type: "POST",
                url: `/Admin/Credential/del`,
                data: {
                    id: row.id
                },
                success: res => {
                    let result = JSON.parse(res);
                    if (result.errorcode === 0) {
                        this.$Message.success({
                            content: "棒棒哒，删除成功",
                            duration: 3
                        });
                        this.getCerData();
                    } else {
                        this.$Message.error({
                            content: `很抱歉，${result.msg},删除失败`,
                            duration: 3
                        });
                    }
                }
            });
        },
        /**
         * 搜索商品
         */
        bindSearch() {
            this.$resetAjax({
                type: "POST",
                url: "/Admin/Goods/index",
                data: {
                    keyword: this.code, // 商品编码
                    page: this.bdCurrentPage,  // 分页
                },
                success: res => {
                    let result = JSON.parse(res);
                    this.goods2 = result.data;
                    this.bdTotal = result.total;
                }
            });
            this.code = "";
        },
        /**
         * 绑定商品
         */
        binding(item) {
            //新增商品绑定
            if (this.activeId == -1) {
                let list = this.goods3;
                let status = 1;
                let that = this;
                list.forEach(function(data, index) {
                if (item.item_no == data.item_no) {
                    status = 2;
                }
                });
                if (status == 1) {
                    this.goods3.push(item);
                    this.$Message.success({
                        content: "绑定成功",
                        duration: 3
                    });
                } else {
                    this.$Message.success({
                        content: "当前商品已经绑定过了",
                        duration: 3
                    });
                }
            } else {
                //编辑商品绑定
                this.$resetAjax({
                    type: "POST",
                    url: `/Admin/Credential/binding`,
                    data: {
                        gid: item.id,
                        cid: this.activeId
                    },
                    success: res => {
                        let result = JSON.parse(res);
                        if (result.errorcode === 0) {
                        this.$Message.success({
                            content: "棒棒哒，绑定成功",
                            duration: 3
                        });
                        this.getGoods();
                        } else {
                        this.$Message.error({
                            content: "很遗憾，该证书已经绑定过，不能再绑定",
                            duration: 3
                        });
                        }
                    }
                });
            }
        },
        /**
         * 打开已绑定弹窗
         */
        show1(row) {
            this.activeId = row.id;
            this.modal2 = true;
            this.getGoods();
        },
        /*
        * 获取已绑定商品
        */
        getGoods() {
            this.$resetAjax({
                type: "POST",
                url: `/Admin/Credential/getGoods`,
                data: {
                    cid: this.activeId
                },
                success: res => {
                    let result = JSON.parse(res);
                    result.forEach(function(item, index) {
                        item.pic = `https://ximiphoto.oss-cn-hangzhou.aliyuncs.com/thumb/${item.item_no}.jpg?x-oss-process=style/80`;
                        if (item.form) {
                            switch(item.form) {
                                case 1:
                                    item.form = '报告';
                                    break;
                                case 2:
                                    item.form = '证书';
                                    break;
                                case 3:
                                    item.form = '报告 + 证书';
                                    break;
                            }
                            // item.form = item.form == 1 ? "报告" : "证书";
                        }
                    });
                    this.goods1 = result;
                }
            });
        },
        /*
        * 删除绑定商品
        */
        delCredential(id) {
            this.$resetAjax({
                type: "POST",
                url: `/Admin/Credential/delCredential`,
                data: {
                    gid: id,
                    cid: this.activeId
                },
                success: res => {
                    let result = JSON.parse(res);
                    this.$Message.success({
                        content: "解绑成功",
                        duration: 3
                    });
                    this.getGoods();
                }
            });
        },
        /*
        * 取消
        */
        cancel() {
            this.goods2 = [];
            this.code = "";
        }
    }
};
</script>
<style scoped>
    .goods {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 10px;
        border: 1px solid #eeeeee;
        margin-bottom: 15px;
    }
    .goods-img {
        width: 60px;
        height: 60px;
        margin-right: 20px;
    }
    .goods-no {
        margin-right: 20px;
    }
    .goods-img img {
        width: 100%;
        height: 100%;
    }
    .goods-top {
        display: flex;
        align-items: center;
    }
    .goods-title {
        padding: 10px 10px 0 10px;
    }
    .goods_Page{
        justify-content:center;
        display: flex;
    }
</style>
