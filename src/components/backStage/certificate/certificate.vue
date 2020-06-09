<template>
    <div class="certificatePage">
        <div class="top">
            <div class="top_left">
                <p class="add_new" @click="addNew">新增</p>
            </div>
        </div>
        <div class="table">
            <Table border :height="tableHeight" :columns="columns" :data="tableData"></Table>
        </div>
        <div class="pageContanier">
            <Page :total="total" :page-size="pageSize" :current="currentPage" @on-change="changePage" show-elevator show-total></Page>
        </div>
        <!-- 新增证书抽屉 -->
        <Drawer :title="titleName" v-model="cerValue" width="720" :styles="styles" class="adver_clos drawer_certificatePage" draggable>
            <Form :model="formData" ref="formData" :rules="ruleValidate">
                <Row :gutter="32">
                    <i-Col span="24">
                        <FormItem label="名称" prop="name" label-position="top">
                            <Input v-model="formData.name" />
                        </FormItem>
                    </i-Col>
                    <i-Col span="24">
                        <FormItem label="地区" prop="area" label-position="top">
                            <Select v-model="formData.area" filterable multiple @on-change="changeArea">
                                <Option value="00">全选</Option>
                                <Option value="01">全不选</Option>
                                <Option v-for="item in areaList" :value="item.code" :key="item.code">{{item.name}}</Option>
                            </Select>
                        </FormItem>
                    </i-Col>
                    <i-Col span="24">
                        <FormItem label="机构" prop="organization" label-position="top">
                            <Input v-model="formData.organization" />
                        </FormItem>
                    </i-Col>
                    <i-Col span="24">
                        <FormItem label="备注" prop="remark" label-position="top">
                            <Input v-model="formData.remark" />
                        </FormItem>
                    </i-Col>
                    <i-Col span="24">
                        <div class="style">
                            <p class="label_title">上传 1 张 图标（不超过3MB，支持 jpg、png 格式）</p>
                            <!-- 上传照片 -->
                            <div class="demo-upload-list" v-for="(item,index) in uploadList" :key="index">
                                <template v-if="item.status === 'finished'">
                                    <img :src="item.url" style="width:80px;" />
                                    <div class="demo-upload-list-cover">
                                        <Icon type="ios-eye-outline" @click.native="handleView(item)"></Icon>
                                        <Icon type="ios-trash-outline" @click.native="handleRemove(index)"></Icon>
                                    </div>
                                </template>
                                <template v-else>
                                    <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
                                </template>
                            </div>
                            <!-- v-if="uploadList.length === 0"  -->
                            <Upload ref="upload" :show-upload-list="false" :default-file-list="defaultList" :on-success="handleSuccess" :format="['jpg','jpeg','png']" :max-size="2048" :on-format-error="handleFormatError" :on-exceeded-size="handleMaxSize" :before-upload="handleBeforeUpload" multiple type="drag" :data="uploadData" :action="action" style="display: inline-block;width:58px;">
                                <div style="width: 58px;height:58px;line-height: 58px;">
                                    <Icon type="ios-camera" size="20"></Icon>
                                </div>
                            </Upload>
                            <Modal title="查看图片" v-model="visible" draggable>
                                <img :src="imgUrl" v-if="visible" style="width: 100%" />
                            </Modal>
                        </div>
                    </i-Col>
                </Row>
                <div class="demo-drawer-footer">
                    <Button style="margin-right: 8px" @click="cerValue = false">取消</Button>
                    <Button type="primary" @click="submitJudge(formData)">保存</Button>
                </div>
            </Form>
        </Drawer>
    </div>
</template>

<script>
import NProgress from 'nprogress'   // 引入进度条
import 'nprogress/nprogress.css'    // 引入进度条
export default {
    data() {
        return {
            // 证书类型选项
            cerType: "",
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
            // 证书列表表头
            columns: [
                {
                    title: "证书名称",
                    align: "center",
                    key: "name"
                },
                {
                    title: "地区",
                    align: "center",
                    key: "areaname",
                    render: (h, { row }) => {
                        let texts = row.areaname;
                        if (row.areaname !== null) {
                        if (row.areaname.length > 12) {
                            texts = row.areaname.slice(0, 12) + "...";
                        } else {
                            texts = row.areaname;
                        }
                        }
                        return h("div", [
                        h("Tooltip",{
                            props: {
                                placement: "top",
                                transfer: true
                            }
                            },[texts,h(
                                "span",
                                {
                                    slot: "content",
                                    style: {
                                        whiteSpace: "normal"
                                    }
                            },row.areaname)]
                        )
                        ]);
                    }
                },
                {
                    title: "颁发机构",
                    align: "center",
                    key: "organization"
                },
                {
                    title: "图标",
                    align: "center",
                    key: "iconlist",
                    render: (h, { row }) => {
                        /* return (
                            // 错误写法
                            <img v-for={item in row.icon} src={item} style="width:50px;height:50px" />
                        ); */
                        return (
                            row.iconlist.map(item => {
                                return <img src={item} class="icon_img" style="width:40px;margin-right:5px;cursor:pointer;" title="点击查看证书大图" onClick={() => this.lookImg(item)}/>
                            })
                        );
                    }   
                    /* render: (h, { row }) => {
                        return h("img", {
                            style: {
                                //设置样式
                                height: row.icon ? "60px" : "",
                                "border-radius": "5%",
                                border: 0,
                                cursor: "pointer",
                                padding: "5px 0"
                            },
                            attrs: {
                                //设置属性
                                src: row.icon ? row.icon : ""
                            },

                            on: {
                                click: () => {
                                    window.open(row.icon);
                                }
                            }
                        });
                    } */
                },
                {
                    title: "备注",
                    align: "center",
                    key: "remark",
                    render: (h, { row }) => {
                        let texts = row.remark;
                        if (row.remark !== null) {
                        if (row.remark.length > 12) {
                            texts = row.remark.slice(0, 12) + "...";
                        } else {
                            texts = row.remark;
                        }
                        }
                        return h("div", [
                        h("Tooltip",{
                            props: {
                                placement: "top",
                                transfer: true
                            }
                            },[texts,h(
                                "span",
                                {
                                    slot: "content",
                                    style: {
                                        whiteSpace: "normal"
                                    }
                                },row.remark)
                            ]
                        )
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
                                    type: "ios-create",
                                    size: "25",
                                    color: "#218da0"
                                },
                                class: "look",
                                domProps: {
                                    title: "点击编辑证书"
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
                                [
                                    h("Icon", {
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
                name: "", // 证书类型名字
                remark: "", // 备注
                area: "", // 地区
                organization: "", // 机构
                link: [], 
                pic: [],           
            },
            ruleValidate: {
                name: [
                    { required: true, message: "证书类型名称不能为空", trigger: "blur" }
                ]
            },
            // 证书地区列表
            areaList: [],
            // 判断是新增还是编辑
            isAdd: 0,
            // 当前证书行的id
            editId: "",
            uploadList: [],
            // 是否显示查看图片弹窗
            visible: false,
            uploadData: {},
            defaultList: [],
            imgUrl: "",
            action: `http://order.xmvogue.com/word/public/index.php?s=Admin/Credential/icon`
        };
    },
    watch: {
        cerValue(val) {
            if (!val) {
                this.formData = {
                    name: "", // 证书类型名字
                    remark: "", // 备注
                    area: "", // 地区
                    organization: "", // 机构
                    link: [],
                    pic: [],
                };
                this.uploadList = [];
                this.$refs.upload.fileList = [];
            }
        }
    },
    mounted() {
        setTimeout(() => {
            // 得到浏览器内容高度
            let windowHeight =
            document.documentElement.clientHeight || document.body.clientHeight;
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
        this.getCerArea(() => {
            // 获取证书类型列表
            this.getTypetList();
        });
    },
    methods: {
        /**
         * 查看证书
         */
        lookImg(url) {
            window.open(url)
        },
        changePage(index) {
            this.currentPage = index;
            this.getTypetList();
        },
        /**
         * 获取证书类型列表
         */
        getTypetList() {
            NProgress.start();
            this.$resetAjax({
                type: "GET",
                url: "/Admin/Credential/typeList",
                data: {
                    page: this.currentPage
                },
                success: res => {
                    NProgress.done();
                    let result = JSON.parse(res);
                    result.data.forEach(ele => {
                        let arr3 = [];
                        let arr2 = [];
                        if(ele.area) {
                            arr2 = ele.area.split(",");
                        }
                        this.areaList.forEach(list => {
                            arr2.forEach(item => {
                                if (list.code === item) {
                                    arr3.push(list.name);
                                }
                            });
                        });
                        ele.areaname = arr3.join(",");
                        ele.organization = ele.organization.length ? ele.organization : '暂无';
                        ele.remark = ele.remark.length ? ele.remark : '暂无';
                    });
                    this.tableData = result.data;
                    this.total = Number(result.total);
                }
            });
        },
        /**
         * 地区选择
         */
        changeArea(data) {
            let arr = [];
            if (data.includes("00")) {
                // 说明是全选
                arr = this.areaList.map(ele => ele.code);
                this.formData.area = arr;
                return false;
            }
            if (data.includes("01")) {
                // 全不选
                arr = [];
                this.formData.area = arr;
                return false;
            }
        },
        /**
         * 得到证书地区列表
         */
        getCerArea(callback) {
            this.$resetAjax({
                type: "GET",
                url: "/Admin/Credential/getcountry",
                success: res => {
                    let result = JSON.parse(res);
                    this.areaList = result;
                    typeof callback === 'function' && callback();
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
        },
        /**
         * 编辑证书准备
         */
        editReady(row) {
            this.cerValue = true;
            this.isAdd = 2;
            this.formData = {
                name: row.name, // 证书类型名字
                remark: row.remark, // 备注
                area: row.area === null ? '' : row.area.split(","), // 地区
                organization: row.organization // 机构
            };
            this.formData.link = row.iconlist === null ? '' : row.iconlist;
            row.iconlist.forEach(ele => {
                this.uploadList.push({
                    url: ele,
                    status: "finished"
                })
            })
            // this.uploadList = [{url: row.icon,status: "finished"}]
            this.editId = row.id;
            this.titleName = "编辑";
        },
        /**
         * 提交前进行判断
         */
        submitJudge(formData) {
            this.$refs.formData.validate(valid => {
                if (valid) {
                    switch (this.isAdd) {
                        case 1:
                            this.addNewQuery();
                            break;
                        case 2:
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
            this.$resetAjax({
                type: "POST",
                url: `/Admin/Credential/add_type`,
                data: {
                    name: this.formData.name,
                    remark: this.formData.remark,
                    area: this.formData.area.join(","),
                    organization: this.formData.organization,
                    // icon: this.formData.link
                    icon:this.formData.link
                },
                success: res => {
                    let result = JSON.parse(res);
                    if (result.errorcode === 0) {
                        this.$Message.success({
                            content: "棒棒哒，新增成功",
                            duration: 3
                        });
                        this.cerValue = false;
                        this.getTypetList();
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
         * 编辑请求
         */
        editQuery() {
            this.$resetAjax({
                type: "POST",
                url: `/Admin/Credential/setArea`,
                data: {
                    name: this.formData.name,
                    remark: this.formData.remark,
                    area: this.formData.area.join(","),
                    organization: this.formData.organization,
                    id: this.editId,
                    icon: this.formData.link
                },
                success: res => {
                let result = JSON.parse(res);
                if (result.errorcode === 0) {
                    this.$Message.success({
                        content: "棒棒哒，修改成功",
                        duration: 3
                    });
                    this.cerValue = false;
                    this.getTypetList();
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
                url: `/Admin/Credential/delType`,
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
                    this.getTypetList();
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
         * 查看上传的图片
         */
        handleView(item) {
            this.imgUrl = item.url;
            this.visible = true;
        },
        /**
         * 删除上传的图片
         */
        handleRemove(index) {
            this.uploadList.splice(index, 1);
            this.formData.link = this.uploadList.map(ele => ele.url);
        },
        /**
         * 上传的图片成功返回图片的信息
         */
        handleSuccess(res, file) {
            file.url = res.path;
            this.uploadList.push({
                url: res.path,
                status: "finished"
            })
            this.formData.link = this.uploadList.map(ele => ele.url);
        },
        /**
         * 对上传的图片进行格式判断
         */
        handleFormatError(file) {
            this.$Notice.warning({
                title: "图片格式不正确",
                desc: "上传图片格式不正确，请选择JPG或PNG."
            });
        },
        /**
         * 对上传的图片进行大小判断
         */
        handleMaxSize(file) {
            this.$Message.error({
                content: "上传的图片超出文件大小限制",
                duration: 2
            });
        },
        /**
         * 对上传的图片进行数量限制
         */
        handleBeforeUpload() {
            let promise = new Promise(resolve => {
                this.$nextTick(function() {
                resolve(true);
                });
            });
            return promise; //通过返回一个promis对象解决
            this.upLoadImage();
        },
        /**
         * 上传图片请求接口
         */
        upLoadImage() {}
    }
};
</script>
