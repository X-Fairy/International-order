<template>
    <!-- 新增关联产品抽屉 -->
    <Drawer title="设置关联产品" :value="isShow" width="1600" :styles="styles" class="adver_relatedPage relatedPage" draggable @on-close="colseDrawer">
        <Form :model="relatedForm" ref="relatedForm" :rules="ruleValidate">
            <Row :gutter="32">
                <i-Col span="24">
                    <FormItem label="同名部份" prop="sameName" label-position="top">
                        <Input v-model="relatedForm.sameName" placeholder="请在些输入商品名称..." @on-blur="nameBlur" />  
                    </FormItem>
                </i-Col>
                <i-Col span="24">
                    <FormItem label="商品货号(一行一个货号)" prop="code" label-position="top">
                        <Input type="textarea" :autosize="true" v-model="relatedForm.code" />  
                    </FormItem>
                </i-Col>
                <i-Col span="24">
                    <FormItem class="lookup">
                        <a @click="nameBlur">查看</a>
                    </FormItem>
                </i-Col>
                <i-Col span="24" v-show="this.relatedList.length !== 0">
                    <Table border ref="selection" :columns="columnsRealte" :data="relatedList" class="related_table" @on-selection-change="changeSelect"></Table>
                </i-Col>
            </Row>
        </Form>
        <div class="demo-drawer-footer" v-show="this.relatedList.length !== 0">
            <Button style="margin-right: 8px" @click="colseDrawer">取消</Button>
            <Button type="primary" @click="submitRelate">提交</Button>
        </div>
    </Drawer>
</template>

<script>
export default {
    name: 'relateModel',

    props: {
        isShow: Boolean
    },
    data() {
        return {
            // 关联产品字段
            relatedForm: {
                sameName: '', // 同名部分
                code: '', // 货号
            },
            styles: {
                height: "calc(100% - 55px)",
                overflow: "auto",
                paddingBottom: "53px",
                position: "static"
            },
            ruleValidate: {
                sameName: [
                    { required: true, message: '商品名称不能为空', trigger: "blur" }
                ],
            },
            // 返回的商品数组
            relatedList: [],
            // 关联产品表单
            columnsRealte: [
                {
                    type: 'selection',
                    width: 60,
                    align: 'center'
                },
                {
                    title: '编码',
                    key: 'item_no',
                    align: 'center'
                },
                {
                    title: '名称',
                    key: 'item_name',
                    align: 'center'
                },
                {
                    title: '中文属性',
                    key: 'attr1',
                    align: 'center',
                    render: (h, { row }) => {
                        return (<input onBlur={() => this.attrOneBlur(row,event)} value={row.attr1} class="inputRow" />);
                    } 
                },
                {
                    title: '英文属性',
                    key: 'attr2',
                    align: 'center',
                    render: (h, { row }) => {
                        return (<input onBlur={() => this.attrTwoBlur(row,event)} value={row.attr2} class="inputRow" />);
                    } 
                },
                {
                    title: '同款编号',
                    key: 'likeid',
                    align: 'center'
                },
                {
                    title: '价格',
                    key: 'sale_price',
                    align: 'center'
                },
                {
                    title: '图片',
                    key: 'imgUrl',
                    align: 'center',
                    render: (h, { row }) => {
                        return (<img src={row.imgUrl} onClick={() => this.CheckImage(row.imgUrl)} style="width:80px;cursor:pointer;"/>);
                    }            
                },
            ],
        }
    },
    watch: {
        'relatedForm.sameName'(val,oldVal) {
            if(val.length === 0) {
                this.relatedForm.code = '';
                this.relatedList = [];
            }
        },
        'relatedForm.code'(val,oldVal) {
            if(!val) {
                this.relatedForm.sameName = '';
                this.relatedList = [];
            }
        },
        'isShow'(val) {
            if(!val) {
                this.relatedList = [];
                this.relatedForm.code = '';
                this.relatedForm.sameName = '';
            }
        }
    },
    methods:{
        /**
         * 关联产品提交
         */
        submitRelate() {
            this.$resetAjax({
                type: "POST",
                url: "/admin/goods/setlikeid",
                data: {
                    item_no: this.relatedList.map(ele => ele.item_no),
                    attr1: this.relatedList.map(ele => ele.attr1),
                    attr2: this.relatedList.map(ele => ele.attr2)
                },
                success: (res) => {
                    let result = JSON.parse(res).result;
                    if(result === 'ok') {
                        this.$Message.success({
                            content: "棒棒哒，相同产品设置成功",
                            duration: 3
                        });
                        this.$emit('update:isShow', false);
                    } else {
                        this.$Message.error({
                            content: "抱歉，只有一个不能设置,设置失败",
                            duration: 3
                        });
                        this.$emit('update:isShow', false);
                    }
                }
            });
        },
        /**
         * 验证后方可进行提交 
         */
        submitJudge() {
            
        },
        /**
         * 名称失焦查询商品编码
         */
        nameBlur() {
            this.$resetAjax({
                type: "GET",
                url: "/admin/goods/tongming",
                data: {
                    title: this.relatedForm.sameName
                },
                success: (res) => {
                    if(res === '[]') {
                        this.$Message.error({
                            content: "抱歉，无数据返回",
                            duration: 3
                        });
                    } else {
                        let result = JSON.parse(res);
                        this.relatedList = result;
                        result.forEach(ele => {
                            ele.imgUrl = `http://img.xmvogue.com/thumb/${ele.item_no}.jpg?x-oss-process=style/800`
                        });
                        let arr = result.map(ele => ele.item_no).join(',')
                        var reg = /[,]/g;
                        arr = arr.replace(reg,"$&\r\n");
                        this.relatedForm.code = arr;
                    }
                }
            });
        },
        /**
         * 查看相同产品表格
         */
        lookupClick(relatedForm) {
            this.$refs.relatedForm.validate(valid => {
                if (valid) {
                } 
            })
        },
        /**
         * 属性1填值
         */
        attrOneBlur(row,event) {
            row.attr1 = event.target.value;
            this.relatedList[row._index].attr1 = event.target.value;
        },
        /**
         * 属性2填值
         */
        attrTwoBlur(row,event) {
            row.attr2 = event.target.value;
            this.relatedList[row._index].attr2 = event.target.value;
        },
        /**
         * 勾选进行设置同款
         */
        changeSelect(selection) {
        },
        /**
         * 查看图片
         */
        CheckImage(url) {
            window.open(url)
        },
        /**
         * 关闭弹窗
         */
        colseDrawer() {
            this.$emit('update:isShow', false);
        }
    }
}
</script>
