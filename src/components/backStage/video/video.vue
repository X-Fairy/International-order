
<template>
    <div class="videoPage">
        <div class="top">
            <div class="top_left">
                <Upload multiple :action="action" class="upload"  :max-size="7168" title="多项上传"
                :before-upload="handleBeforeUpload" :show-upload-list="false"
                :format="['AVI','mov','rmvb','rm','FLV','mp4','3GP']" 
                :on-success="videoSuccess" :on-exceeded-size="handleMaxSize" :on-format-error="handleFormatError">
                上传
                </Upload>
                <p @click="delReady" title="列表 勾选删除" style="margin:0 15px;">勾选删除</p>
                <Upload :action="excelAction" class="upload"  :max-size="7168" title="上传 Excel 删除"
                :before-upload="handleBeforeUpload" :show-upload-list="false"
                :format="['xlsx','xlsm','xlsb','xltx','xltm','xls','xlt','xls']" 
                :on-success="ExcelSuccess" :on-exceeded-size="handleExcel" :on-format-error="handleExcelError">
                Excel 删除
                </Upload>
            </div>
            <div class="top_right">
                <div class="item">
                    <span style="width: 58px;display: inline-block;">查询：</span>
                    <Input v-model="keyword" placeholder="商品条码、商品中文名..." @on-enter="hdidEnter" @on-blur="hdidEnter"/>
                </div>
            </div>
        </div>
        <div class="table">
            <Table :height="tableHeight" border  :columns="columns" :data="tableData" @on-selection-change="changeSelect"></Table>  
        </div>
        <div class="pageContanier">
            <Page :total="total" :page-size="pageSize" @on-change="changePage" :current="currentPage" show-elevator show-total></Page>
        </div>   
    </div>
</template>

<script>
import NProgress from 'nprogress'   // 引入进度条
import 'nprogress/nprogress.css'    // 引入进度条
export default {
    data() {
        return {
            // 多个视频上传的地址
            action: '/word/public/index.php?s=Admin/video/upload',
            // excel 上传的地址
            excelAction: '/word/public/index.php?s=Admin/video/delVideo_Excel',
            keyword: '',
            // 表格高度
            tableHeight: 700,  
            // 表格数据 
            tableData: [], 
            // 已选商品id
            idArr: [],
            // 数据表头
            columns: [
                {
                    type: 'selection',
                    width: 60,
                    align: 'center'
                },
                {
                    title: '条码',
                    align: 'center',
                    key: 'item_no',
                    width: 180,
                },
                {
                    title: '名称',
                    align: 'center',
                    key: 'item_name',
                    width: 480,
                    render: (h, { row }) => {
                        return (
                            <div>
                                <p>{row.item_name}</p>
                                <p>{row.item_en}</p>
                            </div>
                        );
                    } 
                },
                {
                    title: '图片',
                    key: 'imgUrl',
                    align: 'center',
                    render: (h, { row }) => {
                        return (<img v-lazy={`http://img.xmvogue.com/thumb/${row.item_no}.jpg?x-oss-process=style/80`} onClick={() => this.CheckImage(row.item_no)} style="width:80px;cursor:pointer;"/>);
                    }            
                },
                {
                    title: '视频',
                    align: 'center',
                    key: 'video',
                    render:(h, {row}) => {
                        return (
                            <div>
                                {(row.video !== null && row.video !== '') && <video src={row.video} controls="controls" style="width: 160px;margin: 5px;"></video>}
                                {(row.video === null ||   row.video === '') && <span>无</span>}
                            </div>
                        )
                    },
                },
                {
                    title: '视频地址',
                    align: "center",
                    key: "video",
                    render: (h, { row }) => {
                        return (<a onClick={() => this.openLink(row.video)} title= "点击查看视频">{row.video}</a>);
                    } 
                },
                {
                    title: '操作',
                    key: 'action',
                    align: 'center',
                    render: (h, {row}) => {
                        // <upload  type="drag" action={this.action} class="upload"  max-size={7168} before-upload= {() => this.handleBeforeUpload} show-upload-list={false} format={['AVI','mov','rmvb','rm','FLV','mp4','3GP']} on-success={() => this.rowVideoSuccess}  on-exceeded-size={() => this.handleMaxSize}  on-format-error={() => this.handleFormatError}>
                        //     <icon type="md-cloud-upload" size='28' title="重新上传视频" class="look"/>
                        // </upload>
                        return (
                            <div style="display: flex;justify-content: center;">
                                <poptip confirm title="确定要删除视频 ?" on-on-ok={() => this.deleteSeries(row.item_no)}  >
                                    <icon type="ios-trash" size='28' color= '#333' title="删除" class='delete'/>
                                </poptip>
                            </div>
                        )
                    }
                }

            ],
            // 总数
            total: 0,
            // 每页条数
            pageSize: 20,
            // 当前页码
            currentPage: 1,
            // 上传的视频数据
            uploadData: [],
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
        // 得到视频列表数据
        this.getVideoData();
    },

    methods: {
        hdidEnter() {
            this.currentPage = 1;
            this.getVideoData();
        },
        handleBeforeUpload() {
            NProgress.start();
        },
        changeSelect(selection) {
            this.idArr = selection.map(ele => ele.item_no);
        },
        /**
         * 上传excel进行视频删除
         */
        ExcelSuccess() {
            NProgress.done();
            this.$Message.success({
                content: '删除视频成功',
                duration: 3
            })
            this.getVideoData()
        },
        /**
         * 上传视频成功
         */
        videoSuccess(res, file) {
            NProgress.done();
            /* this.uploadData.push({
                name: file.name,
                tip: '上传视频成功'
            }) */
            this.$Message.success({
                content: '上传视频成功',
                duration: 3
            })
            this.getVideoData()
        },
        handleExcel() {
            NProgress.done();
            this.$Notice.error({
                title:  "上传失败",
                desc:'单个文件大小需在 7M 以内',
                duration: 0
            });
        },
         /**
         * 对上传的视频进行大小判断
         */
        handleMaxSize(file) {
            /* this.uploadData.push({
                name: file.name,
                tip: '视频格式不正确'
            }) */
            NProgress.done();
            this.$Notice.error({
                title:  "上传失败",
                desc:'单个视频大小需在 7M 以内',
                duration: 0
            });
        },
        handleExcelError() {
            NProgress.done();
            this.$Notice.error({
                title:  "上传失败",
                desc:'上传excel格式不正确，请选择xlsx,xlsm,xls,xltx,xltm,xls,xlt,xls其中一种格式',
                duration: 0
            });
        },
        /**
         * 对上传的视频进行格式判断
         */
        handleFormatError(file) {
            /* this.uploadData.push({
                name: file.name,
                tip: '视频格式不正确'
            }) */
            NProgress.done();
            this.$Notice.error({
                title:  "上传失败",
                desc:'上传视频格式不正确，请选择AVI,mov,rmvb,rm,FLV,mp4,3GP其中一种格式',
                duration: 0
            });
        },
         /**
         * 查看图片
         */
        CheckImage(no) {
            window.open(`http://img.xmvogue.com/thumb/${no}.jpg?x-oss-process=style/800`)
        },
        deleteSeries(no) {
            this.idArr.push(no);
            this.delVideo();
        },
        /**
         * 打开链接
         */
        openLink(link) {
            window.open(link)
        },
        delReady() {
            if(this.idArr.length === 0) {
                this.$Message.success({
                    content: '请先勾选您要删除视频的项',
                    duration: 2
                });
            } else{
                this.delVideo();
            }
        },
        /**
         * 删除视频
         */
        delVideo() {
            NProgress.start();
            this.$resetAjax({
                type: "POST",
                url: "/Admin/video/delVideo",
                data: {
                    item_no: this.idArr,
                },
                success: res => {
                    NProgress.done()
                    let result = JSON.parse(res);
                    this.idArr = [];
                    if(result.errorcode === 0) {
                        this.$Message.success({
                            content: '删除成功',
                            duration: 3
                        });
                        this.getVideoData()
                    } else {
                        this.$Message.success({
                            content: '抱歉，删除失败',
                            duration: 3
                        });
                    }
                }
            });
        },
        /**
         * 得到视频列表数据
         */
        getVideoData() {
            NProgress.start()
            this.$resetAjax({
                type: "POST",
                url: "/Admin/video/getVideo",
                data: {
                    keyword: this.keyword.trim(),
                    page: this.currentPage
                },
                success: res => {
                    NProgress.done()
                    let result = JSON.parse(res);
                    this.tableData = result.data;
                    this.total = result.total;
                }
            });
        },
        // 分页
        changePage(index) {
            this.currentPage = index;
            this.getVideoData();
        }
    }
}
</script>
