<template>
    <div class="Advertisement">
        <div class="top">
            <p class="add_btn" @click="newAdd">{{i18n.addBtn}}</p>
        </div>
        <div class="table">
            <Table border :height="tableHeight" :columns="columns" :data="tableData"></Table>
        </div>
        <Drawer :title="titleName" v-model="value3" width="720" :styles="styles" class="adver_clos" draggable>
            <Form :model="formData" ref="formData" :rules="ruleValidate">
                <Row :gutter="32">
                    <i-Col span="24">
                        <FormItem label="类型" prop="type" label-position="top">
                            <Select v-model="formData.type" @on-change="changeType">
                                <Option v-for="item in typeList" :value="item.id" :key="item.id">{{ item.label }}</Option>
                            </Select>
                        </FormItem>
                    </i-Col>
                    <i-Col span="24">
                        <FormItem label="标题" prop="title" label-position="top">
                            <Input v-model="formData.title" />
                        </FormItem>
                    </i-Col>
                </Row>
                <Row :gutter="32">
                    <i-Col span="24" v-show="!isVideo">
                        <FormItem label="APP 【商品条码：Goods|6941595186714 或 商品大类类别码：Goods|28 】" prop="app" label-position="top">
                            <Input v-model="formData.app" />
                        </FormItem>
                    </i-Col>
                    <i-Col span="24">
                        <FormItem label="名称" prop="pic" label-position="top">
                            <Input v-model="formData.pic" :placeholder="i18n.picNotes" disabled />
                        </FormItem>
                    </i-Col>
                    <i-Col span="24">
                        <FormItem label="链接" prop="link" label-position="top">
                            <Input v-model="formData.link" :placeholder="i18n.linkNotes" disabled />
                        </FormItem>
                    </i-Col>
                    <!-- 上传照片 -->
                    <i-Col span="24" v-show="!isVideo">
                        <div class="style">
                            <p class="label_title">{{i18n.uploadTitle}}</p>
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
                            <Upload v-if="uploadList.length === 0" ref="upload" :show-upload-list="false" :default-file-list="defaultList" :on-success="handleSuccess" :format="['jpg','jpeg','png']" :max-size="2048" :on-format-error="handleFormatError" :on-exceeded-size="handleMaxSize" :before-upload="handleBeforeUpload" multiple type="drag" :data="uploadData" :action="action" style="display: inline-block;width:58px;">
                                <div style="width: 58px;height:58px;line-height: 58px;">
                                    <Icon type="ios-camera" size="20"></Icon>
                                </div>
                            </Upload>
                            <Modal title="查看图片" v-model="visible" draggable>
                                <img :src="imgUrl" v-if="visible" style="width: 100%" />
                            </Modal>
                        </div>
                    </i-Col>
                    <!-- 上传视频 -->
                    <i-Col span="24" v-show="isVideo">
                        <p style="margin:25px 0 10px;">上传视频 (大小不能超过10M)</p>   
                        <Upload action="http://order.xmvogue.com/word/public/index.php?s=admin/Guanggao/uppic" :before-upload="handleBeforeUpload" :show-upload-list="false" :max-size="10240" :format="['AVI','mov','rmvb','rm','FLV','mp4','3GP']" :on-success="videoSuccess" :on-exceeded-size="handleMaxSize" :on-format-error="handleFormatError">
                            <Button icon="ios-cloud-upload-outline">上传</Button>
                        </Upload>
                    </i-Col>
                </Row>
            </Form>
            <div class="demo-drawer-footer">
                <Button style="margin-right: 8px" @click="value3 = false">{{i18n.cancel}}</Button>
                <Button type="primary" @click="submitJudge(formData)">{{i18n.submit}}</Button>
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
            typeList: [
                {
                    id: 4,
                    label: 'banner图'
                },
                {
                    id: 5,
                    label: '首页底部轮播图'
                },
                {
                    id: 6,
                    label:'首页banner右边广告图'
                },
                {
                    id: 7,
                    label:'首页视频'
                },
            ],
            // 后台广告列表
            deleteTips: this.$t("advertisementPage.deleteTips"),
            carousel: this.$t("advertisementPage.carousel"),
            leftAder: this.$t("advertisementPage.leftAder"),
            bottomAder: this.$t("advertisementPage.bottomAder"),
            // 查看大图
            lookImg: this.$t("advertisementPage.lookImg"),
            // 抽屉新增标题
            addtitle: this.$t("advertisementPage.addBtn"),
            // 抽屉编辑标题
            edittitle: this.$t("advertisementPage.editBtn"),
            // 删除成功提示
            delItemSuccess: this.$t("advertisementPage.delItemSuccess"),
            // 删除失败
            delItemError: this.$t("advertisementPage.delItemError"),
            // 上传图片数量提醒
            imgNotice: this.$t("advertisementPage.imgNotice"),
            // 编辑成功
            editItemSuccess: this.$t("advertisementPage.editItemSuccess"),
            // 新增成功
            addItemSuccess: this.$t("advertisementPage.addItemSuccess"),
            formData: {
                type:7, // 类别
                title: "", // 标题
                link: "", // 链接
                app: "", // app
                pic: "",
                sort: ""
            },
            // 链接数据
            linkData: [
                {
                    id: 4,
                    link: "//dh.xmcpcn.com/NewA/Article/show/id/75"
                },
                {
                    id: 5,
                    link: "//dh.xmcpcn.com/NewA/Article/show/id/91"
                },
                {
                    id: 6,
                    link: "//dh.xmcpcn.com/index.php/NewA/Category/new_goods/cls/05/"
                }
            ],
            // app数据
            appData: [
                {
                    label: "Article|75",
                    id: 1
                },
                {
                    label: "Article|91",
                    id: 2
                },
                {
                    label: "Goods|6941595186714",
                    id: 3
                }
            ],
            // 表格高度
            tableHeight: 900,
            // 表格数据
            tableData: [],
            // 表头
            columns: [
                {
                    title: this.$t("advertisementPage.adverType"),
                    align: "center",
                    key: "positionName"
                },
                {
                    title: this.$t("advertisementPage.adverTitle"),
                    align: "center",
                    key: "title"
                },
                {
                    title: '图片/视频',
                    align: "center",
                    key: "imgUrl",
                    render:(h, {row}) => {
                        return (
                            <div>
                                {row.position === "7" && <video src={row.link} controls="controls" style="width: 150px;margin-top: 5px;"></video>}
                                {row.position !== "7" && <img src={row.link} style="width: 150px;margin-top: 5px;" />}
                            </div>
                        )
                    },
                },
                {
                    title: this.$t("advertisementPage.adverLink"),
                    align: "center",
                    key: "link",
                    render: (h, { row }) => {
                        return (<a onClick={() => this.openLink(row.link)} title={row.position === '7' ? "点击查看视频" : "点击查看图片"}>{row.link}</a>);
                    } 
                },
                {
                    title: this.$t("advertisementPage.adverApp"),
                    align: "center",
                    key: "app_act"
                },
                {
                    title: this.$t("advertisementPage.operation"),
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
                                title: this.details
                            },
                            on: {
                                click: () => {
                                    this.rowDetail(row)
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
                                    title: this.deleteTips,
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
                                    this.deleteAdver(row);
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
            value3: false,
            styles: {
                height: "calc(100% - 55px)",
                overflow: "auto",
                paddingBottom: "53px",
                position: "static"
            },
            ruleValidate: {
                title: [{required: true,message: this.$t("advertisementPage.titleTips"),trigger: "blur"  }],
                // pic: [
                //     { required: true, message: this.$t('advertisementPage.picTips'), trigger: 'blur' }
                // ],
                type: [{required: true,message: this.$t("advertisementPage.typeTips"),trigger: "blur",pattern: /.+/  }],
                link: {required: true,message: this.$t("advertisementPage.linkTips"),trigger: "change",pattern: /.+/}
            },
            // 是新增还是编辑
            isAdd: 1,
            // 抽屉标题
            titleName: "",
            // 编辑时的id
            editId: "",
            // 上传的图片数据
            uploadList: {},
            // 是否显示查看图片弹窗
            visible: false,
            uploadData: {},
            defaultList: [],
            action: `http://order.xmvogue.com/word/public/index.php?s=admin/Guanggao/uppic`,
            // 是否是上传视频
            isVideo: false,
        };
    },
    mounted() {
        setTimeout(() => {
            // 得到浏览器内容高度
            let windowHeight = document.documentElement.clientHeight || document.body.clientHeight;
            this.tableHeight = windowHeight - 220;
            }, 100);
            // 调整浏览器的时候
            $(window).on("resize", () => {
            let windowHeight = document.documentElement.clientHeight || document.body.clientHeight;
            this.tableHeight = windowHeight - 220;
        });
    },
    computed: {
        i18n() {
            return this.$t("advertisementPage");
        }
    },
    watch: {
        uploadList(val) {
            if (val.length === 0) {
                this.formData.pic = "";
                this.formData.link = "";
            }
        }
    },
    created() {
        // 得到广告数据
        this.getAdverList();
    },
    methods: {
        /**
         * 上传视频成功
         */
        videoSuccess(response, file, fileList) {
            this.$Message.success({
                content: '上传视频成功',
                duration: 3
            })
            this.formData.pic = response.name;
            this.formData.link = response.path;
        },
        /**
         * 通过选择上传文件类型来判断是上传图片还是视频
         */
        changeType() {
            if(this.formData.type === 7) {
                this.isVideo = true;
            } else {
                this.isVideo = false;
            }
        },
        /**
         * 新增广告数据准备
         */
        newAdd() {
            this.isAdd = 1;
            this.isVideo = true;
            this.uploadList = [];
            this.formData = {
                type: 7,
                title: "",
                link: "",
                app: ""
            };
            this.value3 = true;
            this.titleName = this.addtitle;
        },
        /**
         * 打开链接
         */
        openLink(link) {
            window.open(link)
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
        },
        /**
         * 上传的图片成功返回图片的信息
         */
        handleSuccess(res, file) {
            file.url = res.path;
            this.uploadList = this.$refs.upload.fileList;
            this.formData.link = res.path;
            this.formData.pic = res.name;
            this.$Message.success({
                content: '上传图片成功',
                duration: 3
            })
        },
        /**
         * 对上传的图片进行格式判断
         */
        handleFormatError(file) {
            this.$Notice.warning({
                title: this.formData.type === 7 ? "视频格式不正确" : "图片格式不正确",
                desc: this.formData.type === 7 ? '上传视频格式不正确，请选择AVI,mov,rmvb,rm,FLV,mp4,3GP其中一种格式' : "上传图片格式不正确，请选择JPG或PNG."
            });
        },
        /**
         * 对上传的图片进行大小判断
         */
        handleMaxSize(file) {
            this.$Message.error({
                content: this.formData.type === 7 ? "上传的视频超出文件大小限制" : "上传的图片超出文件大小限制",
                duration: 3
            });
        },
        /**
         * 对上传的图片进行数量限制
         */
        handleBeforeUpload() {
            NProgress.start();
            let promise = new Promise(resolve => {
                this.$nextTick(function() {
                resolve(true);
                });
            });
            return promise; //通过返回一个promis对象解决
            this.upLoadImage();
            const check = this.uploadList.length < 2;
            if (!check) {
                this.$Message.error({
                content: this.imgNotice,
                duration: 2
                });
                 NProgress.done();
            }
            return check;
        },
        /**
         * 上传图片请求接口
         */
        upLoadImage() {
            // this.$resetAjax({
            //     type: 'POST',
            //     url: `http://172.21.8.128/word/public/index.php/Admin/Guanggao/uppic`,
            //     success: (res) => {
            //     },
            // })
        },
        /**
         * 广告详情
         */
        rowDetail(row) {
            this.isAdd = 2;
            this.formData = {
                type: Number(row.position),
                title: row.title,
                link: row.link,
                app: row.app_act,
                pic: row.pic,
                sort: row.sort
            };
            this.changeType()
            this.value3 = true;
            this.editId = row.id;
            this.titleName = this.edittitle;
            this.uploadList = [{
                name: row.pic,
                url: row.imgUrl,
                status: "finished"
            }];
        },
        /**
         * 得到广告数据
         */
        getAdverList() {
            NProgress.start();
            this.$resetAjax({
                type: "POST",
                url: `/Admin/Guanggao/index`,
                success: res => {
                    NProgress.done();
                    let result = JSON.parse(res);
                    result.forEach(ele => {
                        ele.imgUrl = `http://img.xmvogue.com/ggao/${ele.pic}?x-oss-process=style/yuan`;
                        this.typeList.forEach(item => {
                            if((Number(ele.position) === item.id)) {
                                ele.positionName = item.label;
                                if(ele.position === '7') {
                                    ele.imgUrl = ele.link;
                                }
                            }
                        })
                    });
                    this.tableData = result;
                }
            });
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
                url: `/Admin/Guanggao/add`,
                data: {
                    position: this.formData.type,
                    title: this.formData.title,
                    pic: this.formData.pic,
                    link: this.formData.link,
                    app_act: this.formData.app
                },
                success: res => {
                    let result = JSON.parse(res);
                    if (result.res === "ok") {
                        this.value3 = false;
                        this.$Message.success({
                            content: this.addItemSuccess,
                            duration: 2
                        });
                        this.formData = {
                            type: "",
                            title: "",
                            link: "",
                            app: "",
                            pic: ""
                        };
                        // this.$refs.upload.fileList = [];
                        // this.uploadList = [];
                        this.getAdverList();
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
                url: `/Admin/Guanggao/edit`,
                data: {
                    position: this.formData.type,
                    title: this.formData.title,
                    pic: this.formData.pic,
                    link: this.formData.link,
                    app_act: this.formData.app,
                    id: this.editId,
                    sort: this.formData.sort
                },
                success: res => {
                let result = JSON.parse(res);
                if (result.res === "ok") {
                    this.value3 = false;
                    this.$Message.success({
                        content: this.editItemSuccess,
                        duration: 3
                    });
                    this.changeType();
                    this.formData = {
                        type: "",
                        title: "",
                        link: "",
                        app: "",
                        pic: ""
                    };
                    // this.$refs.upload.fileList = [];
                    // this.uploadList = [];
                    this.getAdverList();
                }
                }
            });
        },
        /**
         * 删除请求
         */
        deleteAdver(data) {
            this.$resetAjax({
                type: "POST",
                url: `/Admin/Guanggao/del`,
                data: {
                    id: data.id
                },
                success: res => {
                let result = JSON.parse(res);
                if (result.res === "ok") {
                    this.$Message.success({
                        content: this.delItemSuccess,
                        duration: 3
                    });
                    this.getAdverList();
                } else {
                    this.$Message.error({
                        content: this.delItemError,
                        duration: 3
                    });
                }
                }
            });
        }
    }
};
</script>
