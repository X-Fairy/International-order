<template>
    <div class="commodity">
        <div class="top">
            <div class="top_left">
                <a class="export" @click="goSynchro" title="同步海鼎中英文、规格长宽高（产品尺寸）、
重量（净重）、库存、价格、整箱数量、中箱规格">同步</a>
                <!-- <p @click="addBtnClick">新增</p> -->
                <div class="table_top">
                    <!-- <p class="check_upload" @click="checkUpFile" v-show="isCheck">查看</p> -->
                    <Upload :action="action" :format="['xls','xlsx']" :on-format-error="formatError" :on-success="upLoadSuccess">
                        <Button title="商品上传">上传</Button>
                    </Upload>
                </div>
                <a class="export" @click="getImprotData" title="点击导入国内商品"> 导入</a>
                <a class="export" @click="isWitch=true;" title="商品导出">导出</a>
                <a class="sameSparagraph export" title="点击设置同款" @click="relateModel=true;relatenum=1;">同款</a>
            </div>
            <div class="top_select">
                <div class="item">
                    <span class="item_title">货号：</span>
                    <Input v-model="codeValue" placeholder="请输入商品货号" style="width: 120px" @on-change="currentPage=1" @on-enter="getCommodity" @on-blur="getCommodity"/>
                </div>
                <div class="item">
                    <span class="item_title">名称：</span>
                    <Input v-model="nameValue" placeholder="请输入商品名称" style="width: 150px" @on-change="currentPage=1" @on-enter="getCommodity"  @on-blur="getCommodity"/>
                </div>
                 <div class="item">
                    <span class="item_title">类别：</span>
                    <Select v-model="typeValue" clearable style="width:90px" @on-change="getTypeValue">
                        <Option value>全部</Option>
                        <Option v-for="item in typeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                </div>
                <div class="item">
                    <span class="item_title">仓库：</span>
                    <Select v-model="wareValue" clearable style="width:90px" @on-change="getWareValue">
                        <Option v-for="item in warehouseList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                </div>
                <div class="item">
                    <span class="item_title">上线：</span>
                    <Select clearable style="width:90px" @on-change="getDisplay">
                        <Option v-for="item in displayList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                </div>
                <div class="item">
                    <span class="item_title">英文名：</span>
                    <Select v-model="langValue" clearable style="width:90px" @on-change="getLangValue">
                        <Option v-for="item in langData" :value="item.id" :key="item.id">{{ item.label }}</Option>
                    </Select>
                </div>
                <div class="item">
                    <span class="item_title">其他：</span>
                    <Select v-model="radioLabel" clearable style="width:100px" @on-change="getRadioLabel">
                        <Option v-for="(item,index) in radioData" :value="item.label" :key="index">{{ item.label }}</Option>
                    </Select>
                </div>
            </div>
        </div>
        <div class="table">
            <Table border :height="tableHeight" :columns="columns" :data="tableData"></Table>
        </div>
        <!-- 外部商品列表分页 -->
        <div class="pageContanier">
            <Page :total="total" :page-size="pageSize" @on-change="changePage" :current="currentPage" show-elevator show-total></Page>
        </div>
        <!-- 商品详情抽屉 -->
        <Drawer :title="drawerTitle" v-model="isGoodsDrawer" width="720" :styles="styles" class="commodity_drawer" :draggable="true">
            <Form :model="formData">
                <Row :gutter="32">
                     <i-Col span="12">
                        <FormItem label="条码：" label-position="top">
                            <Input v-model="formData.item_no" disabled/>
                        </FormItem>
                    </i-Col>
                    <i-Col span="12">
                        <FormItem label="名称 (中文)：" label-position="top">
                            <Input v-model="formData.item_name" disabled/>
                        </FormItem>
                    </i-Col>
                    <i-Col span="12">
                        <FormItem label="名称 (英文)：" label-position="top">
                            <Input v-model="formData.item_en" disabled/>
                        </FormItem>
                    </i-Col>
                    <i-Col span="12">
                        <FormItem label="材质 (中文)：" label-position="top">
                            <Input v-model="formData.material" type="textarea" :autosize="true" placeholder="请输入中文材质..." />
                        </FormItem>
                    </i-Col>
                </Row>
                <Row :gutter="32">
                    <i-Col span="12">
                        <FormItem label="材质 (英文)：" label-position="top">
                            <Input v-model="formData.material_en" type="textarea" :autosize="true" placeholder="请输入英文材质..." />
                        </FormItem>
                    </i-Col>
                    <i-Col span="12">
                        <FormItem label="尺寸 (中文)：" label-position="top">
                            <Input v-model="formData.lwh" placeholder="请输入中文尺寸..."/>
                        </FormItem>
                    </i-Col>
                     <i-Col span="12">
                        <FormItem label="尺寸 (英文)：" label-position="top">
                            <Input v-model="formData.lwh_en" placeholder="请输入英文尺寸..."/>
                        </FormItem>
                    </i-Col>
                    <i-Col span="12">
                        <FormItem label="填充物 (中文)：" label-position="top">
                            <Input v-model="formData.stuffing" type="textarea" :autosize="true" placeholder="请输入中文填充物..." />
                        </FormItem>
                    </i-Col>
                    <i-Col span="12">
                        <FormItem label="填充物 (英文)：" label-position="top">
                            <Input v-model="formData.stuffing_en" type="textarea" :autosize="true" placeholder="请输入英文填充物..."/>
                        </FormItem>
                    </i-Col>
                    <i-Col span="12">
                        <FormItem label="产品特点 (中文)：" label-position="top">
                            <Input v-model="formData.features" type="textarea" :autosize="true" placeholder="请输入中文产品特点..." />
                        </FormItem>
                    </i-Col>
                    <i-Col span="12">
                        <FormItem label="产品特点 (英文)：" label-position="top">
                            <Input v-model="formData.features_en" type="textarea" :autosize="true" placeholder="请输入英文产品特点..." />
                        </FormItem>
                    </i-Col>
                    <i-Col span="12">
                        <FormItem label="使用方法 (中文)：" label-position="top">
                            <Input v-model="formData.usage" type="textarea" :autosize="true" placeholder="请输入中文使用方法..."/>
                        </FormItem>
                    </i-Col>
                    <i-Col span="12">
                        <FormItem label="使用方法 (英文)：" label-position="top">
                            <Input v-model="formData.usage_en"  type="textarea" :autosize="true" placeholder="请输入英文使用方法..."/>
                        </FormItem>
                    </i-Col>
                    <i-Col span="12">
                        <FormItem label="注意事项 (中文)：" label-position="top">
                            <Input v-model="formData.notes" type="textarea" :autosize="true" placeholder="请输入中文注意事项..."/>
                        </FormItem>
                    </i-Col>
                    <i-Col span="12">
                        <FormItem label="注意事项 (英文)：" label-position="top">
                            <Input v-model="formData.notes_en" type="textarea" :autosize="true" placeholder="请输入英文注意事项..."/>
                        </FormItem>
                    </i-Col>
                    <i-Col span="12">
                        <FormItem label="警告语 (中文)：" label-position="top">
                            <Input v-model="formData.caution" type="textarea" :autosize="true" placeholder="请输入中文警告语..." />
                        </FormItem>
                    </i-Col>
                    <i-Col span="12">
                        <FormItem label="警告语 (英文)：" label-position="top">
                            <Input v-model="formData.caution_en" type="textarea" :autosize="true" placeholder="请输入英文警告语..." />
                        </FormItem>
                    </i-Col>
                    <i-Col span="12">
                        <FormItem label="产品相关证书：" label-position="top">
                            <Input v-model="formData.credential" type="textarea" :autosize="true" placeholder="请输入产品相关证书..." />
                        </FormItem>
                    </i-Col>
                    <i-Col span="12">
                        <FormItem label="产品型号：" label-position="top">
                            <Input v-model="formData.model" type="textarea" :autosize="true"  disabled/>
                        </FormItem>
                    </i-Col>
                    <i-Col span="12">
                        <FormItem label="产品包装形式：" label-position="top">
                            <Input v-model="formData.packaging" type="textarea" :autosize="true" disabled />
                        </FormItem>
                    </i-Col>
                    <i-Col span="12">
                        <FormItem label="执行标准：" label-position="top">
                            <Input v-model="formData.standard" type="textarea" :autosize="true" disabled />
                        </FormItem>
                    </i-Col>
                    <i-Col span="12">
                        <FormItem label="上传商品视频：" label-position="top" class="detail_upload">
                            <Upload action="http://order.xmvogue.com/word/public/index.php?s=admin/goods/upload_vedio" :before-upload="handleBeforeUpload" :show-upload-list="false" :max-size="8192" :format="['AVI','mov','rmvb','rm','FLV','mp4','3GP']" :on-success="videoSuccess" :on-exceeded-size="handleMaxSize" :on-format-error="handleFormatError">
                                <Button icon="ios-cloud-upload-outline">上传</Button>
                            </Upload>
                        </FormItem>
                    </i-Col>
                    <i-Col span="24">
                        <FormItem label="商品视频地址：" label-position="top">
                            <Input v-model="formData.videoUrl" type="text" placeholder="请先进行视频上传，会自动填充视频地址" :autosize="true" />
                        </FormItem>
                    </i-Col>
                </Row>
            </Form>
            <div class="demo-drawer-footer">
                <Button style="margin-right: 8px" @click="isGoodsDrawer = false">取消</Button>
                <Button type="primary" @click="editGoods">保存</Button>
            </div>
        </Drawer>
        <!-- 导出 -->
        <Drawer title="导出" v-model="isExport" width="720" :styles="styles" :draggable="true" class="export_drawer">
            <Form :model="exportObj" ref="exportObj" :rules="ruleExportObj">
                <Row :gutter="32">
                    <i-Col span="24">
                        <FormItem label="类别编码" prop="item_clsno" label-position="top">
                            <Input v-model="exportObj.item_clsno" />
                        </FormItem>
                    </i-Col>
                    <i-Col span="24">
                        <FormItem label="规格" prop="ck" label-position="top">
                            <Input v-model="exportObj.ck" />
                        </FormItem>
                    </i-Col>
                </Row>
                <Row :gutter="32">
                    <i-Col span="24">
                        <FormItem label="配送价(大于或等于)" label-position="top" class="price_qj">
                            <InputNumber v-model="exportObj.base_price"></InputNumber>
                        </FormItem>
                    </i-Col>
                    <i-Col span="24">
                        <FormItem label="文件名" prop="filename" label-position="top">
                            <Input v-model="exportObj.filename" />
                        </FormItem>
                    </i-Col>
                </Row>
                <Row :gutter="32">
                    <i-Col span="24">
                        <FormItem label="字段" label-position="top">
                            <div style="border-bottom: 1px solid #e9e9e9;padding-bottom:6px;margin-bottom:6px;">
                                <Checkbox :indeterminate="indeterminate" :value="checkAll" @click.prevent.native="handleCheckAll">全选</Checkbox>
                            </div>
                            <CheckboxGroup v-model="checkAllGroup" @on-change="checkAllGroupChange(checkAllGroup)">
                                <Checkbox label="item_clsno">类别码</Checkbox>
                                 <Checkbox label="img">主图</Checkbox>
                                <Checkbox label="item_no">编码</Checkbox>
                                <Checkbox label="item_name">名称</Checkbox>
                                <Checkbox label="item_en">名称(EN)</Checkbox>
                                <Checkbox label="lot_spec">箱规</Checkbox>
                                <Checkbox label="base_price">配送价</Checkbox>
                                <Checkbox label="sale_price">零售价</Checkbox>
                                <Checkbox label="stock_num">库存数量</Checkbox>
                                <Checkbox label="display_flag">是否上线(1上)</Checkbox>
                                <Checkbox label="status">状态</Checkbox>
                                <Checkbox label="material">材质</Checkbox>
                                <Checkbox label="material_en">材质(EN)</Checkbox>
                                <Checkbox label="lwh">尺寸</Checkbox> 
                                <Checkbox label="lwh_en">尺寸(EN)</Checkbox> 
                                <Checkbox label="weight">重量</Checkbox>
                                <Checkbox label="weight_en">重量(EN)</Checkbox>
                                <Checkbox label="stuffing">填充物</Checkbox>
                                <Checkbox label="stuffing_en">填充物(EN)</Checkbox>
                                <Checkbox label="features">产品特点</Checkbox>
                                <Checkbox label="features_en">产品特点(EN)</Checkbox>
                                <Checkbox label="usage">使用方法</Checkbox>
                                <Checkbox label="usage_en">使用方法(EN)</Checkbox>
                                <Checkbox label="notes">注意事项</Checkbox>
                                <Checkbox label="notes_en">注意事项(EN)</Checkbox>
                                <Checkbox label="caution">警告语</Checkbox>
                                <Checkbox label="caution_en">警告语(EN)</Checkbox>
                                <Checkbox label="standard">执行标准</Checkbox>
                                <Checkbox label="expiration">保质期</Checkbox>
                                <Checkbox label="credential">产品相关证书</Checkbox>
                                <Checkbox label="model">产品型号</Checkbox>
                                <Checkbox label="packaging">包装形式</Checkbox>
                                <Checkbox label="hs_code">海关编码</Checkbox>
                            </CheckboxGroup>
                        </FormItem>
                    </i-Col>
                </Row>
            </Form>
            <div class="demo-drawer-footer">
                <Button style="margin-right: 8px" @click="exportCancel">取消</Button>
                <Button type="primary" @click="exportQuery(exportObj)">提交</Button>
            </div>
        </Drawer>
        <!-- 上传列表 -->
        <!-- <Modal v-model="fileMode" title="上传文件" @on-ok="fileMode=false" @on-cancel="fileMode=false" class="filemodel_commodity">
            <p v-for="(item,index) in uploadFiles" :key="index" class="file_list">文件名： <span>{{item.name}}</span></p>
        </Modal>-->
        <!-- 英文、关键词修改模态框 -->
        <Modal v-model="correctModel" draggable :title="correntTitle" @on-ok="correctQuery" @on-cancel="correntEn='';correctModel=false;" class="correntModel_commodity">
            <Input v-model="correntEn" type="textarea" :placeholder="correctPlace" />
        </Modal>
        <!-- 编辑模态框模态框 -->
        <Modal v-model="areaModel" draggable title="禁配地区" @on-ok="submitArea" @on-cancel="areaModel=false" class="areaModel_commodity">
            <Row :gutter="32">
                <i-Col span="24">
                    <Form :model="formArea" ref="formArea">
                        <FormItem label="地区" prop="area" label-position="top">
                            <Select v-model="formArea.area" filterable multiple @on-change="changeArea">
                                <Option value="00">全选</Option>
                                <Option value="01">全不选</Option>
                                <Option v-for="item in areaList" :value="item.code" :key="item.code">{{item.name}}</Option>
                            </Select>
                        </FormItem>
                    </Form>
                </i-Col>
            </Row>
        </Modal>
        <!-- 已绑定证书模态框 -->
        <Drawer title="已绑定证书" v-model="zsmodel" width="800" :styles="styles" class="adver_credentialsPage" draggable>
            <Button type="primary" @click="addGoodsList">新增</Button>
            <div style="padding-top:30px">
                <Table border :columns="ybColumns" :data="zsList"></Table>
            </div>
        </Drawer>
        <!-- 搜索证书 -->
        <Modal v-model="modal1" draggable  title="搜索证书" class="searchCode_goods">
            <Row :gutter="32">
                <i-Col span="24">
                    <Input search placeholder="请输入证书编码" @on-search="search" v-model="code" />
                    <div class="table" style="margin:25px 0">
                        <Table  border :columns="zscolumns" :data="zsTable"></Table>
                    </div>
                    <div class="pageContanier" style="display: flex;justify-content: center;margin-top: 25px;">
                        <Page :total="zstotal" :page-size="zspageSize" @on-change="zschangePage" :current="zscurrentPage" show-elevator show-total></Page>
                    </div>
                </i-Col>
            </Row>
        </Modal>
        <!-- 设置为同款抽屉 -->
        <Drawer title="设置同款商品" width="700" :value="relateModel"  :styles="styles" class="synchro_relatedPage drawer_relatedPagae" draggable @on-close="relateModel=false;">
            <Form :model="relateForm" ref="synchroForm">
                <Row :gutter="32">
                    <i-Col span="24">
                        <FormItem class="form_top">
                            <a class="relate_add" @click="goodsAddBtn" title="添加同款商品">添加</a>
                            <Select v-model="selectAttr" placeholder="选择添加属性" @on-change="addAttr" style="width:200px;">
                                <Option v-for="item in attrList" :value="item.id" :key="item.id" :disabled="!item.isSelect">{{item.name}} [{{item.en_name}}]</Option>
                            </Select>
                        </FormItem>
                    </i-Col>
                    <i-Col span="24">
                        <div v-if="targetKeys.length!=0">
                            <div class="target_goods" v-for="(item,index) in targetKeys" :key="index">
                                <div class="target_top">
                                    <div class="goods_left">
                                        <img v-lazy="item.imgUrl" style="width:80px;height:80px;cursor:pointer" @click="CheckImage(item.item_no, 1)" title="点击查看大图"/>
                                        <div class="goods_info">
                                            <p title="商品名称">名称：{{item.item_name}}</p>
                                            <p title="商品编码">编码：{{item.item_no}}</p>
                                        </div>
                                    </div>
                                    <Button class="goods_right" type="primary" @click="bindCancel(item,index)" title="点击取消当前商品同款设置">取消</Button>
                                </div>
                                <ul v-for="(ele,i) in item.attr" :key="i" class="item_attr" v-if="item.attr.length !== 0">
                                    <div class="item_title">
                                        <p>{{ele.name}}：</p>
                                        <a class="del_attr" :title="`点击删除[ ${ele.name} ]属性`" @click="delAttr(i)">删除</a>
                                    </div>
                                    <li :title="ele.name" class="item_li">
                                        中文：
                                        <!--  @on-change="changeInput($event,index,i, 'attr_name')"  -->
                                        <Input  v-model="ele.attr_name" style="width: 100px"/>
                                    </li>
                                    <li :title="ele.en_name" class="en_item item_li">
                                        英文： 
                                        <!--   @on-change="changeInput($event,index,i, 'attr_en')" -->
                                        <Input  v-model="ele.attr_en" style="width: 100px" />
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </i-Col>
                </Row>
            </Form>
            <div class="demo-drawer-footer">
                <Button style="margin-right: 8px" @click="relateModel=false;">取消</Button>
                <Button type="primary" @click="sameGoodsReady">提交</Button>
            </div>
        </Drawer>
        <!-- 设置同款商品选择弹窗 -->
        <Modal v-model="selectModel" draggable  title="搜索商品" @on-ok="''" @on-cancel="selectModel=false;" class="searchCode_goods">
            <Row :gutter="32">
                <i-Col span="24">
                    <Input search placeholder="请输入商品编码或名称..." @on-search="searchReady" v-model="bindCode" />
                    <div v-if="bindData.length!=0">
                        <div class="goods-title">搜索结果：</div>
                        <div class="goods" v-for="(item,index) in bindData" :key="index">
                            <div class="goods-top">
                                <div class="goods-img">
                                    <img v-lazy="item.imgUrl" alt=""/>
                                </div>
                                <div class="goods-no">
                                    <div>名称：{{item.item_name}}</div>
                                    <div>编码：{{item.item_no}}</div>
                                </div>
                            </div>
                            <Button type="primary" @click="bindGoods(item)">{{item.bindText}}</Button>
                        </div>
                    </div>
                </i-Col>
                <i-Col span="24" v-if="bindData.length!=0">
                    <div class="goods_Page">
                        <Page :total="bdTotal" :page-size="bdPageSize" @on-change="bdChangePage" :current="bdCurrentPage" show-elevator show-total></Page>
                    </div>
                </i-Col>
            </Row>
        </Modal>
        <!-- 导入商品到国外仓 -->
        <Drawer title="导入商品到国外仓" :value="isShowSynch" width="1600" :styles="styles" class="synchro_relatedPage Import_drawerPage" draggable @on-close="isShowSynch=false;">
            <Form :model="synchroForm" ref="synchroForm">
                <Row :gutter="32">
                    <i-Col span="24">
                        <FormItem >
                            <p style="background: #218da0;color: #fff;padding: 5px 18px;box-sizing: border-box;font-size: 16px;">商品列表</p>
                        </FormItem>
                    </i-Col>
                    <i-Col span="24">
                        <Table border ref="selection" :columns="columnsSynch" :height="syncHeight" :data="synchroList" class="related_table" @on-selection-change="changeSynchro"></Table>
                    </i-Col>
                </Row>
            </Form>
            <Page :total="syncTotal" show-total :current="syncPage" :page-size="50" @on-change="syncPageChange" class="sync_page"/>
            <div class="demo-drawer-footer">
                <Button style="margin-right: 8px" @click="isShowSynch=false;">取消</Button>
                <Button type="primary" @click="submitJudge">提交</Button>
            </div>
        </Drawer>
        <!-- 提示导出哪种商品 -->
        <!-- okSynch -->
        <Modal v-model="isWitch"  title="温馨提示" ok-text="确定" :mask-closable="false" :loading="loading" cancel-text="" @on-ok="animalHandle" @on-cancel="isWitch=false;animal = '没有英文名'" id="witch_modal">
            <h3 style="font-size:18px;margin-bottom:15px;">请先选择下例哪种情况进行商品导出</h3>
            <RadioGroup v-model="animal">
                <Radio v-for="item in animalData" :key="item.id" :label="item.label" :title="item.title"></Radio>
            </RadioGroup>
        </Modal>
        <!-- 提示上传哪种商品 -->
        <Modal v-model="isUpload" draggable  title="温馨提示" @on-ok="uploadExcel" @on-cancel="getImprotData" id="upload_modal">
            <p>请问您是要导入哪种商品信息吗？</p>
        </Modal>
        <!-- 修改海关编码 -->
        <Modal v-model="hsModal"  draggable :title="hsTitle" @on-ok="editHsCode" @on-cancel="hsModal=false;" class="hsModal">
            <Input v-model="hsCodeValue" />
        </Modal>
    </div>
</template>
<script>
import NProgress from "nprogress"; // 引入进度条
import "nprogress/nprogress.css"; // 引入进度条
import isRepeat from '@/assets/js/tool.js'
import CheckImgExists from '@/assets/js/tool.js'
export default {
    data() {
        return {
            loading: false,
            // 哪种导出选择的数据
            animalData: [
                {
                    label: '没有英文名',
                    title: '商品没有英文名的商品进行导出',
                    id: 1
                },
                {
                    label: '详情有视频',
                    title: '商品详情有视频的商品进行导出',
                    id: 2
                },
                {
                    label: '其他情况导出',
                    title: '自主选择条件来导出',
                    id: 3
                },
            ],
            // 选择哪种商品进行导出
            animal: '没有英文名',
            // 是否有上线功能
            isOnline: true,
            // 是否显示海关编码修改弹窗
            hsModal:false,
            // 海关编码弹窗标题
            hsTitle: '',
            // 海关编码修改值
            hsCodeValue: '',
            // 海关编码修改时的商品编码
            hsItemNo: '',
            // 哪种导出询问框
            isWitch:false,
            // 哪种导入询问框
            isUpload:false,
            // 是否有英文名称
            langData:[
                {
                    label: '没有',
                    id: 1,
                },
                {
                    label: '全部',
                    id: 3,
                },
            ],
            // 是否有英文名称选择
            langValue: '',
            // 是否显示选择同款商品弹窗
            selectModel: false,
            // 绑定的商品数据
            bindData: [],
            // 绑定的商品编码搜索词
            bindCode: '',
            // 设置为同款的商品数据
            targetKeys: [],
            // 同款商品提交时参数对象
            sameObj: {},
            // 点击行该商品的属性数组
            titleAttr: [],
            // 绑定查询出来的商品总数
            bdTotal: 0,
            // 绑定查询出来的当前页码
            bdCurrentPage: 1,
            // 绑定的页码
            bdPageSize: 10,
            // 产品字段
            synchroForm: {},
            // 是否显示关联产品抽屉
            relateModel: false,
            // 是在哪里设置同款的区别数据
            relatenum: -1,
            // 同款商品对象
            relateForm: {},
            //  是否显示导入抽屉
            isShowSynch:false,
            // 导入时返回的商品数组
            synchroList: [],
            // 导入的页码
            syncPage: 1,
            // 导入商品的总页码数
            syncTotal: 0,
            syncHeight: 500,
            // 导入时产品表单
            columnsSynch: [
                {
                    type: 'selection',
                    width: 60,
                    align: 'center'
                },
                {
                    title: '类别码',
                    key: 'ITEM_CLSNO',
                    align: 'center'
                },
                {
                    title: '编码',
                    key: 'ITEM_NO',
                    align: 'center'
                },
                {
                    title: '名称',
                    key: 'NAME',
                    align: 'center'
                },
                {
                    title: '类别码(输入6位数字)',
                    key: 'cls',
                    align: 'center',
                    render:(h,{row,index}) => {
                        return h('Input',{
                            props: {
                                value:'',
                                size:'small',
                                placeholder: '请输入类别码'
                            },
                            on: {
                                input: (val) => {
                                    this.clsBlur(row,val,index)
                                }
                            },
                        })
                    },
                   /*  render: (h, { row }) => {
                        return (<input oninput={() => this.clsBlur(row,event)} value={row.cls} class='inputRow' placeholder="请输入类别码"></input>);
                    }  */
                },
                {
                    title: '类别名称',
                    key: 'clsName',
                    align: 'center',
                    render: (h, { row }) => {
                        return (<input value={row.clsName} class="inputRow" disabled></input>);
                    } 
                },
                {
                    title: '图片',
                    key: 'imgUrl',
                    align: 'center',
                    render: (h, { row }) => {
                        return (<img v-lazy={`http://img.xmvogue.com/thumb/${row.ITEM_NO}.jpg?x-oss-process=style/80`} onClick={() => this.CheckImage(row.ITEM_NO,1)} style="width:80px;cursor:pointer;"/>);
                    }            
                },
            ],
            areaList: [],
            areaModel: false,
            zsmodel: false,
            zsList: [],
            goods2: [],
            modal1: false,
            zstotal: 0, // 商品总数
            zspageSize: 20, // 每页条数
            zscurrentPage: 1, // 当前页码
            zsTable: [],
            zscolumns: [
                {
                    title: "证书 ID",
                    align: "center",
                    key: "id"
                },
                {
                    title: "认证类型",
                    align: "center",
                    key: "name"
                },
                {
                    title: "认证形式",
                    align: "center",
                    key: "form"
                },
                {
                    title: "操作",
                    align: "center",
                    key: "form",
                    render: (h, { row }) => {
                        return h("div", [
                        h("Icon", {
                            props: {
                                type: "ios-american-football",
                                size: "25",
                                color: "#218da0",
                            },
                            style: {
                                cursor: 'pointer'
                            },
                            class: "look",
                            domProps: {
                                title: "点击绑定证书"
                            },
                            on: {
                                click: () => {
                                    this.binding(row);
                                }
                            }
                        })
                        ]);
                    }
                }
            ],
            code: "",
            // 上传excel文件网址
            // action: `http://order.xmvogue.com/word/public/index.php?s=admin/Goods/upexcle`,
            action: `http://order.xmvogue.com/word/public/index.php?s=admin/goods/update_en`,
            // 上传的excel文件列表
            uploadFiles: [],
            // 是否显示上传文件列表模态框
            fileMode: false,
            // 是否显示查看文件按钮
            isCheck: false,
            typeValue: "", // 类别选择
            nameValue: "", // 关键字输入
            codeValue: "", // 编码查询
            radioLabel: "", // 无关联商品、热销、推荐
            radioData: [
                {
                    label: '全部',
                },
                {
                    label: '热销',
                },
                {
                    label: '无关联商品',
                },
                {
                    label: '推荐',
                },
            ],
            radioValue: "", // 无关联商品和推荐值
            // 商品类别数据
            typeList: [
                {
                    value: 21,
                    label: "家居百货"
                },
                {
                    value: 22,
                    label: "健康美容"
                },
                {
                    value: 24,
                    label: "文体礼品"
                },
                {
                    value: 23,
                    label: "饰品系列"
                },
                {
                    value: 25,
                    label: "季节性产品"
                },
                {
                    value: 26,
                    label: "精品包饰"
                },
                {
                    value: 27,
                    label: "儿童玩具"
                },
                {
                    value: 28,
                    label: "毛绒公仔"
                },
                {
                    value: 29,
                    label: "数码配件"
                },
                {
                    value: 34,
                    label: "物料耗材"
                }
            ],
            // 仓库
            warehouseList: [
                {
                    value: 1,
                    label: "国内"
                },
                {
                    value: 0,
                    label: "国外"
                },
            ],
            // 上线选到哪个值
            wareValue: 0,
            // 仓库
            displayList: [
                {
                    value: 1,
                    label: "已上线"
                },
                {
                    value: 0,
                    label: "未上线"
                },
                {
                    value: 2,
                    label: "待上线"
                },
            ],
            // 上线下线选到哪个值
            displayValue: '',
            // 待上线
            stay_online: '',
            // 商品属性数据
            attrList: [],
            // 选择时添加的商品属性
            selectAttr: -1,
            total: 0, // 商品总数
            pageSize: 10, // 每页条数
            currentPage: 1, // 当前页码
            tableHeight: 660, // 表格高度
            tableData: [], // 表格数据
            formArea: {
                area: "" // 地区
            },
            // 外部商品列表表头
            columns: [
                {
                    title: "货号",
                    align: "center",
                    key: "item_no",
                    width:120,
                },
                {
                    title: "海关编码",
                    align: "center",
                    key: "hs_code",
                    render: (h, { row }) => {
                        return (<div onClick={() => this.editReady(row)} title="点击修改海关编码" class="hs_code">{row.hs_code}</div>);
                    } 
                },
                {
                    title: "名称",
                    align: "center",
                    key: "",
                    width: 240,
                    render: (h, { row }) => {
                        let textEn = row.item_en === "" || row.item_en === null ? "商品英文翻译" : row.item_en;
                        // 鼠标经过有提示
                        return h("div", [
                            h("span",{
                                style: {
                                    display: "inline-block",
                                    width: "100%",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    whiteSpace: "nowrap",
                                    paddingTop: '5px',
                                },
                                domProps: {
                                    title: row.item_name
                                }
                                },row.item_name),
                            h("span",{
                                style: {
                                    display: row.item_en === null ? "" : "inline-block",
                                    marginTop: '-8px'
                                },
                                class: "itemEn",
                                domProps: {
                                    title: "点击修改英文名"
                                },
                                on: {
                                    click: () => {
                                        this.rowMd = "en";
                                        // 翻译商品名称准备
                                        this.getCollect(row);
                                    }
                                }
                            },textEn)
                        ]);
                    }
                },
                {
                    title: "图片",
                    align: "center",
                    key: "pic",
                    width: 120,
                    // 单元格插入图片
                    render: (h, { row }) => {
                        return (
                            <img v-lazy={`http://img.xmvogue.com/thumb/${row.item_no}.jpg?x-oss-process=style/80`} onClick={() =>this.lookImage(row)} alt="" style="width:80px;margin:5px;cursor:pointer" title="查看图片"/> 
                        )
                    }
                },
                {
                    title: '视频',
                    align: 'center',
                    key: 'video',
                    width:180,
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
                    title: "价格",
                    align: "center",
                    key: "base_price",
                    render: (h, { row }) => {
                        return (
                            <div style="padding-left:40px;text-align:left;">
                                <p>进：{row.base_price}</p>
                                <p>售：{row.sale_price}</p>
                            </div>
                        );
                    } 
                },
                {
                    title: "数量",
                    align: "center",
                    key: "",
                    width: 120,
                    render: (h, { row }) => {
                        return (
                            <div style="padding-left:25px;text-align:left;">
                                <p>库存：{row.stock_num}</p>
                                <p>占用：{Number(row.sale_num)+Number(row.cart_num)}</p>
                                <p>整箱：{row.lot_spec}</p>
                                <p>整包：{row.purchase_spec}</p>
                            </div>
                        );
                    } 
                },
                {
                    title: "禁配地区",
                    align: "center",
                    key: "areaname",
                    width: 200,
                    render: (h, { row }) => {
                        let texts = row.areaname;
                        if (row.areaname !== "") {
                            if (row.areaname.length > 40) {
                                texts = row.areaname.slice(0, 12) + "...";
                            } else {
                                texts = row.areaname;
                            }
                        } else {
                            row.areaname = "无";
                        } 
                        function cl() {
                            alert()
                        }
                        return (<div onClick={() => this.areanameEdit(row)}  class="edit" style="cursor: pointer;">
                            <tooltip placement='top' transfer>
                                {texts}
                                <span slot="content" style="whiteSpace: normal;">{row.areaname}</span>
                            </tooltip>
                        </div>);
                    }   
                },
                {
                    title: "关键词",
                    align: "center",
                    key: "keyword",
                    render: (h, { row }) => {
                        let texKey = row.keyword === "" ? "无" : row.keyword;
                        // 鼠标经过有提示
                        return h("div", [
                        h(
                            "span",
                            {
                            style: {
                                display: row.keyword === null ? "" : "inline-block"
                            },
                            class: "itemEn",
                            domProps: {
                                title: "点击设置关键字"
                            },
                            on: {
                                click: () => {
                                this.rowMd = "key";
                                // 修改关键字准备
                                this.getCollect(row);
                                }
                            }
                            },
                            texKey
                        )
                        ]);
                    }
                },
                {
                    title: '设置',
                    align: "center",
                    key: "",
                    width:99,
                    render:(h,{row})=>{
                        return h('div',
                        {class: 'setProduct'},
                        [
                            h('i-switch', {
                                props:{
                                    value: row.display_flag === 1 ? true : false,
                                    size:'large',
                                    'true-color':"#218da0",
                                    'false-color': "#aba2a2",
                                },
                                scopedSlots:{
                                    open:()=>h('span','上线'),
                                    close:()=>h('span','下线')
                                },
                                domProps: {
                                    title: row.display_flag === 1 ? '上线商品' : '下线商品',
                                },
                                style: {
                                    margin: '0 0 0 2px',
                                    display: this.isOnline ? 'block' : 'none',
                                },
                                on: {
                                'on-change': (value) => {//触发事件是on-change,用双引号括起来，
                                    //参数value是回调值，并没有使用到
                                    this.changeDisplay(row,value) //params.index是拿到table的行序列，可以取到对应的表格值
                                }
                            },}),
                            h('i-switch',{
                                props:{
                                    value: row.heat === 1 ? true : false,
                                    size:'large',
                                    'true-color':"#ed4014",
                                    'false-color': "#aba2a2",
                                },
                                scopedSlots:{
                                    open:()=>h('span','热销'),
                                    close:()=>h('span','滞销')
                                },
                                style: {
                                    margin: '0px 5px',
                                },
                                domProps: {
                                    title: row.heat === 1 ? '热销商品' : '滞销商品',
                                },
                                on: {
                                    'on-change': (value) => {//触发事件是on-change,用双引号括起来，
                                        //参数value是回调值，并没有使用到
                                        this.changeHeat(row,value) //params.index是拿到table的行序列，可以取到对应的表格值
                                    }
                                }},),
                                h('i-switch',{
                                    props:{
                                        value:row.rec === 1 ? true : false,
                                        size:'large',
                                        'true-color':"#19be6b",
                                        'false-color': "#aba2a2"
                                    },
                                    scopedSlots:{
                                        open:()=>h('span','推荐'),
                                        close:()=>h('span','不推')
                                    },
                                    domProps: {
                                        title: row.rec === 1 ? '推荐该商品' : '取消推荐该商品',
                                    },
                                    on: {
                                        'on-change': (value) => {//触发事件是on-change,用双引号括起来，
                                            //参数value是回调值，并没有使用到
                                            this.changeRec(row,value) //params.index是拿到table的行序列，可以取到对应的表格值
                                        }
                                  }},)
                        ]);
                    }
                },
                {
                    title: "同款",
                    align: "center",
                    key: "likenum",
                    width: 50,
                    render: (h, { row }) => {
                        return (
                            <div onClick={() => this.rowBind(row)} class="like_row" title="点击查看或修改同款商品" >
                                <a>{row.likenum}</a>
                            </div>
                        );
                    } 
                },
                {
                title: "操作",
                key: "action",
                align: "center",
                width: 140,
                render: (h, { row }) => {
                    return h("div", [
                        h("Icon", {
                            props: {
                                type: "ios-eye",
                                size: "24",
                                color: "#218da0"
                            },
                            class: "look",
                            domProps: {
                                title: "点击查看证书"
                            },
                            on: {
                                click: () => {
                                    this.rowId = row.id;
                                    this.zsmodel = true;
                                    this.activeRow = row;
                                    this.bindModel();
                                }
                            }
                        }),
                        h("Icon", {
                            props: {
                                type: "ios-create",
                                size: "24",
                                color: "#218da0"
                            },
                            class: "look",
                            domProps: {
                                title: "点击修改材质尺寸"
                            },
                            on: {
                                click: () => {
                                    this.getDetailData(row);
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
                                    title: "确定删除吗 ?",
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
                                        this.delCommodity(row);
                                    },
                                    "on-cancel": () => {
                                        // 取消删除
                                    }
                                }
                            },
                            [
                                h("Icon", {
                                    // row.inland为0，表示国外，不能删除，国内row.inland值为1可删除
                                    props: {
                                        type: row.inland === 0 ? "" : "ios-trash",
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
            // 商品已绑定证书列表
            ybColumns: [
                {
                    title: "名称",
                    align: "center",
                    key: "name",
                },
                {
                    title: "禁配地区",
                    align: "center",
                    key: "areaname",
                    render: (h, { row }) => {
                        let texts = row.areaname;
                        if (row.areaname !== "") {
                            if (row.areaname.length > 12) {
                                texts = row.areaname.slice(0, 12) + "...";
                            } else {
                                texts = row.areaname;
                            }
                        } else {
                            row.areaname = "无";
                        } 
                        function cl() {
                            alert()
                        }
                        // onClick={() => this.areanameEdit(row)}
                        return (<div   class="edit">
                            <tooltip placement='top' transfer>
                                {texts}
                                <span slot="content" style="whiteSpace: normal;">{row.areaname}</span>
                            </tooltip>
                        </div>);
                    }   
                },
                {
                    title: "图片",
                    align: "center",
                    key: "icon",
                    render: (h, { row }) => {
                        return (
                            row.icon.map(item => {
                                return <img src={item} class="icon_img" title="点击查看证书大图" onClick={() => this.CheckImage(item,2)}/>
                            })
                        );
                    }                                        
                },
                {
                    title: "解绑",
                    align: "center",
                    key: "",
                    render: (h, { row }) => {
                        return (
                            <a  class="cancel_band_table" onClick={() => this.rowCancelBand(row)}>解绑</a>
                        );
                    }
                },
            ],
            isGoodsDrawer: false, // 编辑新增抽屉
            drawerTitle: "新增", // 抽屉标题
            styles: {
                height: "calc(100% - 55px)",
                overflow: "auto",
                paddingBottom: "53px",
                position: "static"
            },
            formData: {
                item_no: '',            // 条码
                item_name: "",          // 名称
                item_en: "",            // 英文名
                item_no: "",            // 货号
                stuffing: '',
                stuffing_en: '',
                features: '',
                features_en: '',
                standard: '',
                usage: '',
                usage_en: '',
                notes: '',
                notes_en: '',
                lwh_en: '',
                lwh: '',
                caution: '',
                caution_en: '',
                credential: '',
                model: '',
                packaging: '',
                base_price: "",         // 进价
                sale_price: "",         // 售价
                item_clsno: "",         // 类别
                purchase_spec: "",      // 规格
                stock_num: "",          // 库存
                pic: "",                // 图片
                videoUrl: '',           // 介绍商品的视频地址
                uptime: ""              // 商品上传时间
            },
            // 是否显示详情抽屉底部框
            isFooter: true,
            // 是否显示导出抽屉
            isExport: false,
            // 导出数据对象
            exportObj: {
                item_clsno: "", // 类别编码
                ck: "", // 规格
                base_price: 0, // 配送价
                filename: "" // 文件名
            },
            // 导出表单验证
            ruleExportObj: {
                filename: [
                    { required: true, message: "文件名不能为空", trigger: "blur" }
                ],
                item_clsno: [
                    { required: true, message: "类别编码不能为空", trigger: "blur" }
                ],
                /* ck: [
                    { required: true, message: "规格不能为空", trigger: "blur" }
                ] */
            },
            indeterminate: true,
            checkAll: false,
            // 导出字段
            checkAllGroup: [],
            // 是否显示英文修改模态框
            correctModel: false,
            // 修改英文名字段
            correntEn: "",
            // 修改英文模态框标题
            correntTitle: "",
            // 修改英文时当前行商品编码
            correntNo: "",
            // 判断是修改英文还是设置关键字
            rowMd: "",
            // 修改英文、设置关键字placeholder
            correctPlace: "",
            activeRow: ""
        };
    },
    mounted() {
        $('#upload_modal .ivu-btn-text').text('国外仓商品导入');
        $('#upload_modal .ivu-btn-primary').text('商品英文名导入');
        setTimeout(() => {
            // 得到浏览器内容高度
            let windowHeight = document.documentElement.clientHeight || document.body.clientHeight;
            this.tableHeight = windowHeight - 240;
            this.syncHeight = windowHeight - 240;
        }, 100);
        // 调整浏览器的时候
        $(window).on("resize", () => {
            let windowHeight = document.documentElement.clientHeight || document.body.clientHeight;
            this.tableHeight = windowHeight - 240;
            this.syncHeight = windowHeight - 240;
        });
    },
    created() {
        // 身份判断
        this.Identity();
        // 得到国家列表
        this.getCerArea();
        // 得到商品列表
        this.getCommodity();
        // 获取商品属性类型数据
        this.getAttrList();
    },
    watch: {
        "uploadFiles.length"(val) {
            if (val === 0) {
                this.isCheck = false;
            } else {
                this.isCheck = true;
            }
        },
        /**
         * 监听设置同款商品时商品选择弹窗
         */
        selectModel(val) {
            if(!val) {
                this.bindData = [];
            }
        },
        /**
         * 监听同款设置抽屉
         */
        relateModel(val) {
            if(!val) {
                this.targetKeys = [];
                this.bindCode = '';
                this.selectAttr = -1; // 属性选择
                this.attrList.forEach(ele => {
                    ele.isSelect = true;
                });
            }
        },
        isExport(val,oldVal) {
            if(!val) {
                this.exportObj = {
                    item_clsno: "",
                    filename: "",
                    ck: "",
                    base_price: 0
                };
                this.fields = [];
                this.checkAllGroup = [];
                this.checkAll = false;
            }
        }
    },
    methods: {
        /**
         * 身份判断
         */
        Identity() {
            // 判断是否有上线这个功能仓库、采购、产品、admin有权限设置商品上线这个功能
            var arr = [4,5,7,100,108]
            this.isOnline = arr.includes(Number(localStorage.group_id));
            // 录单员一个人有权限对商品类别进行修改
            if(localStorage.group_id === '108') {
                var item = {
                    title: "类别(6位数)",
                    align: "center",
                    key: "item_clsno",
                    width: 100,
                    render: (h, { row }) => {
                        return (<input onBlur={() => this.editBasic(row,event)} value={row.item_clsno} class="inputRow" title="修改商品类别码,请慎重操作！" />);
                    } 
                }
                this.columns.splice(1,0,item)
            }

        },
        /**
         * 根据商品是否有英文名来进行搜索商品
         */
        getLangValue() {
            this.radioLabel = '';
            this.currentPage = 1;
            this.getCommodity();
        },
        /**
         * 根据商品货号来进行搜索商品
         */
        getTypeValue() {
            this.currentPage = 1
            this.getCommodity();
        },
        /**
         * 根据仓库来进行搜索商品
         */
        getWareValue() {
            this.currentPage = 1
            this.getCommodity();
        },
        /**
         * 根据是否上下线来进行搜索商品
         */
        getDisplay(data) {
            this.currentPage = 1;
            if(data === 2) {
                this.stay_online = 2;
                this.displayValue = '';
                this.wareValue = '';
            } else {
                this.displayValue = data;
                this.stay_online = '';
            }
            this.getCommodity();
        },
        /**
         * 根据其他来进行搜索商品
         */
        getRadioLabel() {
            this.codeValue = '';
            this.nameValue = '';
            this.currentPage = 1
            this.getCommodity();
        },
         /**
         *  导出商品没有英文名的信息
         */
        okSynch() {
            this.isWitch = false;
            location.href = `http://order.xmvogue.com/word/public/index.php?s=admin/goods/goods_no_en`;
        },
        /**
         * 导出商品有视频的商品数据
         */
        exportVideo() {
            this.isWitch = false;
            location.href = `http://order.xmvogue.com/word/public/index.php?s=admin/goods/goods_vedio`;
        },
        /**
         * 判断是哪种情况的商品进行导出
         */
        animalHandle() {
            this.loading = true;
            switch(this.animal) {
                case '没有英文名':
                    this.okSynch();
                    this.loading = false;
                    this.animal = '没有英文名'
                    break;
                case '详情有视频':
                    this.exportVideo();
                    this.loading = false;
                    this.animal = '没有英文名'
                    break;
                default:
                    this.isWitch = false;
                    this.isExport = true;
                    this.loading = false;
                    this.animal = '没有英文名'
                    break;

            }
        },
        /**
         * 导入商品没有英文名的信息
         */
        uploadExcel() {

        },
        /**
         * 获取商品属性类型数据
         */
        getAttrList() {
            this.$resetAjax({
                type: "GET",
                url: "/admin/goods/get_attr_type ",
                success: (res) => {
                    let result = JSON.parse(res);
                    result.forEach(ele =>{
                        ele.isSelect = true;
                    })
                    this.attrList = result;
                }    
            });
        },
        /**
         * 得到导入的商品数据
         */
        getImprotData() {
            NProgress.start(); // 进度条开始
            this.isShowSynch = true;
            this.synchroList = [];
            this.$resetAjax({
                type: "POST",
                url: "/admin/Cngoods/index",
                data: {
                    page: this.syncPage,        // 页码
                },
                success: (res) => {
                    NProgress.done(); // 进度条开始
                    let result = JSON.parse(res)
                    result.list.forEach(ele => {
                        ele.imgUrl = `http://img.xmvogue.com/thumb/${ele.ITEM_NO}.jpg?x-oss-process=style/80`;
                        ele.cls = '';
                        ele.clsName = '暂无';
                        ele._checked = false;
                    })
                    this.synchroList = result.list;
                    this.syncTotal = Number(result.length);
                }    
            });
        },
        /**
         * 导入的商品数据分页
         */
        syncPageChange(index) {
            this.syncPage = index;
            this.getImprotData();
        },
        /**
         * 同步海鼎数据
         */
        goSynchro() {
            NProgress.start();
            this.$resetAjax({
                type: "GET",
                url: "/admin/goods/sync_goods_en",
                success: (res) => {
                    NProgress.done();
                    let result = JSON.parse(res)
                    if(result.errorcode === 0) {
                        this.$Message.success({
                            content: '同步海鼎操作成功',
                            duration: 3
                        });
                    }
                    this.getCommodity();
                }    
            });
        },
        /**
         * 导入时勾选商品
         */
        changeSynchro(selection) {
            let selectionIds = selection.map(item => item.ITEM_NO);
            if(selection.length > 0) {
                let len = selection.length - 1;
                if(selection[len].cls === '') {
                    this.$Message.error({
                        content: '抱歉，当前勾选项请输入正确的6位数类别码',
                        duration: 3
                    });
                }
            }
            this.synchroList.forEach(item => {
                item._checked = selectionIds.includes(item.ITEM_NO);
            });
        },
        /**
         * 导入时类别码验证
         */
        submitJudge() {
            let selectionArr = this.synchroList.filter(item => item._checked);
            if(selectionArr.length === 0) {
                this.$Message.error({
                    content: '抱歉，请先勾选您要导入的数据',
                    duration: 3
                });
                return false;
            }
            let arr = [];
            let falg = false;
            selectionArr.forEach(ele => {
                arr.push({
                    'code': ele.ITEM_NO,
                    'cls': ele.cls
                })
            })
            arr.forEach((ele,i) => {
                if(ele.cls === '') {
                    falg = true;
                    this.$Message.error({
                        content: `很抱歉，选中的商品第${i+1}项类别码输入错误`,
                        duration: 3
                    });
                    return false;
                }
            })
            if(falg) {
                return false;
            }
            this.$resetAjax({
                type: "POST",
                url: "/admin/Cngoods/add",
                data: {
                    code: arr,
                },
                success: (res) => {
                    let code = JSON.parse(res).code;
                    switch(code) {
                        case "0":
                            this.$Message.success({
                                content: '棒棒哒，导入成功',
                                duration: 3
                            });
                            this.getImprotData();
                            break;
                        case "1":
                            this.$Message.error({
                                content: '很抱歉，导入失败',
                                duration: 3
                            });
                            break;
                        case "5":
                            this.$Message.error({
                                content: '很抱歉，商品库存为空添加失败',
                                duration: 3
                            });
                            break;
                    }
                }
            });
        },
        /**
         * 导入时类别码填值
         */
        clsBlur(row,val,index) {
            this.$resetAjax({
                type: "POST",
                url: "/admin/cnGoods/yanzheng",
                data: {
                    cls: val
                },
                success: (res) => {
                    let code = JSON.parse(res).code;
                    switch(code) {
                        case "4":
                            // 查看当前是否有选中的项
                            this.$Message.error({
                                content: '很抱歉，没有该分类名称',
                                duration: 1
                            }); 
                            row.cls = '';
                            row.clsName = '暂无';
                            this.synchroList[row._index].cls = '';
                            this.synchroList[row._index].clsName = '暂无';
                            break;
                        case "6":
                            this.$Message.success({
                                content: '类别码输入正确',
                                duration: 1
                            }); 
                            row.cls = val;
                            this.synchroList[row._index].clsName = JSON.parse(res).msg[0];
                            this.synchroList[row._index].cls = val;
                            break;
                    }
                }    
            });
            
        },
        /**
         * 查看图片
         */
        CheckImage(no,data) {
            if(data === 1) {
                window.open(`http://img.xmvogue.com/thumb/${no}.jpg?x-oss-process=style/800`)
            } else{
                window.open(no)
            }
        },
        /**
         * 修改商品类别码
         */
        editBasic(row,event) {
            let clsvalue = event.target.value;
            let c = row.item_clsno;
            this.$resetAjax({
                type: "POST",
                url: "/admin/Goods/cnedit",
                data: {
                    item_no: row.item_no,  // 商品编码
                    item_clsno: clsvalue // 商品类别码
                },
                success: (res) => {
                    let result = JSON.parse(res).error;
                    if(result === 'ok') {
                        this.$Message.success({
                            content: '棒棒哒，商品类别码修改成功',
                            duration: 2
                        });
                    } else {
                        this.$Message.error({
                            content: '抱歉，商品类别码修改失败',
                            duration: 2
                        });
                        setTimeout(() => {
                            this.getCommodity();
                        }, 2000);
                    }
                }
            });
        },
        /**
         * 修改海关编码准备
         */
        editReady(row) {
            this.hsModal = true;
            this.hsTitle = `海关编码修改： ${row.item_name} `;
            this.hsCodeValue = row.hs_code;
            this.hsItemNo = row.item_no;
        },
        /**
         * 修改海关编码提交请求
         */
        editHsCode() {
            this.$resetAjax({
                type: "POST",
                url: "/admin/goods/set_hscode",
                data: {
                    hscode: this.hsCodeValue,   // 商品海关编码
                    item_no: this.hsItemNo,   // 商品编码
                },
                success: (res) => {
                    let result = JSON.parse(res).errorcode;
                    if(result === 0) {
                        this.$Message.success({
                            content: '棒棒哒，商品海关编码修改成功',
                            duration:3
                        });
                        this.getCommodity();
                    }
                }
            });
        },
        /**
         * 查看上传文件
         */
        checkUpFile() {
            // this.fileMode = true;
            this.$resetAjax({
                type: "GET",
                url: "/admin/Goods/readExcel",
                data: {
                    file: this.uploadFiles.pop().name
                },
                success: (res) => {
                }
            });
        },
        /**
         * 上传文件格式判断
         */
        formatError(res) {
            this.$Message.error({
                content: "抱歉，上传文件格式不对,只支持xls、xlsx后缀文件",
                duration: 3
            });
        },
        /**
         * 证书弹窗
         */
        bindModel() {
            this.$resetAjax({
                type: "POST",
                url: "/Admin/Credential/getCredential_new",
                data: {
                    gid: this.rowId
                },
                success: res => {
                let result = JSON.parse(res);
                result.forEach(ele => {
                    let arr3 = [];
                    let arr2 = ele.area.split(",");
                    this.areaList.forEach(list => {
                    arr2.forEach(item => {
                        if (list.code === item) {
                            arr3.push(list.name);
                        }
                    });
                    });
                    ele.areaname = arr3.join(",");
                });
                this.zsList = result;
                }
            });
        },
        /**
         * 打开需要绑定的商品列表
         */
        addGoodsList() {
            this.modal1 = true;
            this.zsShow();
        },
        /**
         * 查看已绑定证书
         */
        zsShow() {
            this.$resetAjax({
                type: "POST",
                url: "/Admin/Credential/getlist_new",
                data: {
                    id: this.code.trim(),
                    page: this.zscurrentPage // 页码
                },
                success: res => {
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
                    this.zsTable = list;
                    this.zstotal = Number(result.total);
                }
            });
        },
        /**
         * 证书分页
         */
        zschangePage(index) {
            this.zscurrentPage = index;
            this.zsShow();
        },
        handleBeforeUpload() {
            NProgress.start();
        },
        /**
         * 上传视频成功
         */
        videoSuccess(res, file) {
            NProgress.done();
            this.$Message.success({
                content: '上传视频成功',
                duration: 3
            })
            this.formData.videoUrl = res.data;
        },
         /**
         * 对上传的视频进行大小判断
         */
        handleMaxSize(file) {
            this.$Message.error({
                content: "上传的视频超出文件大小限制" ,
                duration: 3
            });
        },
        /**
         * 对上传的视频进行格式判断
         */
        handleFormatError(file) {
            this.$Notice.warning({
                title:  "视频格式不正确",
                desc:'上传视频格式不正确，请选择AVI,mov,rmvb,rm,FLV,mp4,3GP其中一种格式'
            });
        },
        /**
         * 修改商品相关信息提交
         */
        editGoods() {
            this.$resetAjax({
                type: "POST",
                url: `/admin/goods/update_info`,
                data: {
                    item_no: this.formData.item_no,
                    material:this.formData.material,
                    material_en: this.formData.material_en,
                    stuffing: this.formData.stuffing,
                    stuffing_en: this.formData.stuffing_en,  // 填充物
                    features: this.formData.features,
                    features_en: this.formData.features_en,
                    usage: this.formData.usage,
                    usage_en: this.formData.usage_en,
                    notes: this.formData.notes,
                    notes_en: this.formData.notes_en,
                    caution: this.formData.caution,
                    caution_en: this.formData.caution_en,
                    credential: this.formData.credential,
                    lwh_en: this.formData.lwh_en,
                    lwh: this.formData.lwh,
                    video: this.formData.videoUrl,
                },
                success: res => {
                    let result = JSON.parse(res).errorcode;
                    if (result === 0) {
                        this.$Message.success({
                            content: "棒棒哒，修改成功",
                            duration: 3
                        });
                        this.isGoodsDrawer = false;
                        this.getCommodity();
                    } else {
                        this.$Message.success({
                            content: '很抱歉，修改失败',
                            duration: 3
                        });
                    }
                }
            });
        },
        /**
         * 搜索已绑定证书
         */
        search() {
            this.zscurrentPage = 1;
            this.zsShow();
        },
        /**
         * 绑定里的商品分页
         */
        bdChangePage(index) {
            this.bdCurrentPage = index;
            this.bindSearch();
        },
        /**
         * 设置是否推荐
         */
        changeRec(row,value) {
            let rec = value === true ? 1 : 0;
            this.$resetAjax({
                type: "POST",
                url: "/admin/goods/set_rec",
                data: {
                    gid: row.id,  // 商品id
                    rec,  // 是否推荐
                },
                success: res => {
                    let result = JSON.parse(res);
                    if(result.errorcode === 1) {
                        this.$Message.success({
                            content: rec ?  '推荐该商品成功' : '该商品不推荐',
                            duration: 3
                        });
                        row.rec = row.rec === 1 ? 0: 1 ;
                        this.getCommodity()
                    } else {
                        this.$Message.error({
                            content: rec ? '很抱歉，推荐该商品失败' : '很抱歉，不推荐该商品设置失败',
                            duration: 3
                        });
                    }
                }
            });
        },
        /**
         * 设置是否热销
         */
        changeHeat(row,value) {
            let heat = value === true ? 1 : 0;
            this.$resetAjax({
                type: "POST",
                url: "/admin/goods/set_heat",
                data: {
                    gid: row.id,  // 商品id
                    heat,  // 是否热销
                },
                success: res => {
                    let result = JSON.parse(res);
                    if(result.errorcode === 1) {
                        this.$Message.success({
                            content: heat ? '已设置该商品热销' : '已设置该商品不热销',
                            duration: 3
                        });
                        row.heat = row.heat === 1 ? 0: 1 ;
                        this.getCommodity()
                    } else {
                        this.$Message.error({
                            content: heat ? '很抱歉，设置该商品热销失败' : '很抱歉，设置该商品不热销失败',
                            duration: 3
                        });
                    }
                }
            });
        },
        /**
         * 设置是否上线
         */
        changeDisplay(row,value) {
            let display = value === true ? 1 : 0;
            this.$resetAjax({
                type: "POST",
                url: "/admin/goods/set_display",
                data: {
                    item_no:row.item_no,  // 商品编码
                    display,  // 是否上线
                },
                success: res => {
                    let result = JSON.parse(res);
                    if(result.errorcode === 0) {
                        this.$Message.success({
                            content: display ? '设置商品上线成功' : '设置商品下线成功',
                            duration: 3
                        });
                        row.display_flag = row.display_flag === 1 ? 0: 1 ;
                        this.getCommodity();
                    } else {
                        this.$Message.error({
                            content: display ? '很抱歉，设置商品上线失败' : '很抱歉，设置商品下线失败',
                            duration: 3
                        });
                    }
                }
            });
        },
        /**
         * 商品列表里点击同款
         */
        rowBind(row) {
            this.relateModel = true;
            this.relatenum = 2;
            // 查询同款商品数据
            this.$resetAjax({
                type: "POST",
                url: "/admin/goods/tongming",
                data: {
                    likeid: row.likeid, // 商品编码
                },
                success: res => {
                    let result = JSON.parse(res);
                    // 该商品的全部属性
                    this.titleAttr = result.title.map(ele => ele.id);
                    let list = result.list;
                    list.forEach(ele => {
                        ele.imgUrl = `http://img.xmvogue.com/thumb/${ele.item_no}.jpg?x-oss-process=style/80`;
                        ele.item_name = ele.name;
                    })
                    this.targetKeys = list;
                    // 判断哪些属性该商品可选，可些不可选，要禁止
                    this.judgeIsSelect()
                }
            });
        },
        /**
         * 判断哪些属性该商品可选，可些不可选，要禁止
         */
        judgeIsSelect() {
            this.targetKeys.forEach(ele => {
                if(ele.attr === undefined) {
                    // 说明当前商品都没有属性
                    this.attrList.forEach(ele => {
                        ele.isSelect = true;    // true表示可选
                    })
                    return false;
                }
            })
            // 如果当前没有商品，则都可以选择
            let targetLen = this.targetKeys.length;
            switch(targetLen) {
                case 0:
                    this.attrList.forEach(ele => {
                        ele.isSelect = true;    // true表示可选
                    }) 
                    break;
                default:
                    this.targetKeys.forEach(arr => {
                        if(arr.attr.length === 0 || arr.attr === undefined) {
                            this.attrList.forEach(ele => {
                                ele.isSelect = true;    // true表示可选
                            }) 
                        }
                        arr.attr.forEach(item => {
                            this.attrList.forEach((attr,i) => {
                                if(item.attr_type === attr.id) {
                                    attr.isSelect = false;
                                }
                            })
                        })
                    })
                    break;
            }
        },
        /**
         * 搜索商品
         */
        searchReady() {
            this.bdCurrentPage = 1;
            this.bindSearch();
        },
        /**
         * 同款设置点添加按钮
         */
        goodsAddBtn() {
            this.selectModel = true;
            this.bindCode = '';
            this.bdCurrentPage = 1;
            this.bindSearch();
        },
        /**
         * 绑定的商品搜索
         */
        bindSearch() {
            this.$resetAjax({
                type: "POST",
                url: "/Admin/Goods/index",
                data: {
                    keyword: this.bindCode, // 商品编码
                    page: this.bdCurrentPage, // 分页
                },
                success: res => {
                    let result = JSON.parse(res);
                    result.data.forEach(ele => {
                        ele.bindText = '添加';
                        ele.imgUrl = `http://img.xmvogue.com/thumb/${ele.item_no}.jpg?x-oss-process=style/80`
                    })
                    this.bindData = result.data;
                    this.bdTotal = result.total;
                }
            });
            this.code = "";
        },
        /**
         * 商品添加到同款数组里
         */
        bindGoods(item) {
            // 判断当前添加的商品是否已经存在,先判断添加区域是否有商品
            let targetLen = this.targetKeys.length;
            switch(targetLen) {
                case 0:
                    // 去添加商品
                    this.addGoods(item);
                    break;
                default:
                    // 查看下添加区域是否有商品属性
                    this.isHasAttrs(item)
                    break;
            }
        },
        /**
         * 添加区域有商品时，查看下添加区域是否有商品属性
         */
        isHasAttrs(item) {
            let attrLen = this.targetKeys[0].attr.length;
            switch(attrLen) {
                case 0:
                    // 没有属性
                    this.isSameAdd(item, '没有属性')
                    break;
                default:
                    // 有属性
                    this.isSameAdd(item, '有属性')
                    break;
            }
        },
        /**
         * 添加时判断会不会重复添加商品
         */
        isSameAdd(item,info) {
            // 查看会不会重复添加商品，在无属性的情况下,isSame 为true时，表示该商品已添加过，为false，没有添加，可以添加进去
            let isSame = false;
            this.targetKeys.forEach(ele => {
                if(ele.item_no === item.item_no) {
                    isSame = true;  // 如果存在有相同的商品编码，就不再循环，直接为true
                    return false;
                } 
            });
            switch(isSame) {
                case true:
                    this.$Message.error({
                        content: '该商品已添加，不能重复添加',
                        duration: 3
                    });
                    break;
                default:
                    // 去添加商品,根据info的值，添加区域商品没有属性，和添加区域商品有属性两种情况
                    switch(info) {
                        case '有属性':
                            this.hasAttrAdd(item);
                            break;
                        case '没有属性':
                            this.addGoods(item);
                            break;
                    }
            }
        },
        /**
         * 设置同款商品时，添加区域商品有属性时数据处理
         */
        hasAttrAdd(item) {
            let addObj = {};
            this.targetKeys.forEach(ele => {
                let attrArr = []; // 新添加的商品属性数组
                let attrObj = {};  // 新添加的商品属性数组里的对象
                addObj = {
                    id: item.id, // 商品id
                    item_no: item.item_no,  // 商品编码
                    likeid: item.likeid,    // 商品同款id
                    item_name: item.item_name,  // 商品名称
                    imgUrl: `http://img.xmvogue.com/thumb/${item.item_no}.jpg?x-oss-process=style/80`,   // 商品图片
                }
                ele.attr.forEach(list => {
                    attrObj = {
                        attr_en: '',  // 商品属性值英文名
                        attr_name: '',  // 商品属性值中文名
                        attr_type: list.attr_type,  // 商品所属哪种属性
                        en_name: list.en_name,  // 商品属性值英文名
                        name: list.name, // 商品属性值中文名
                    }
                    attrArr.push(attrObj) // 新添加的商品属性数组把属性对象push进去
                })
                addObj.attr = attrArr;  // 把商品属性对象加入到商品对象里
            })
            this.targetKeys.push(addObj)
            // // 让当前文字变成已添加
            item.bindText = '已添加';
        },
        /**
         * 设置同款商品时，添加区域添加商品(无属性)数据处理
         */
        addGoods(item) {
            let addObj = {
                id: item.id, // 商品id
                item_no: item.item_no,  // 商品编码
                likeid: item.likeid,    // 商品同款id
                item_name: item.item_name,  // 商品名称
                imgUrl: `http://img.xmvogue.com/thumb/${item.item_no}.jpg?x-oss-process=style/80`,   // 商品图片
                attr : [],             // 商品属性
            }
            this.targetKeys.push(addObj);
            // 让当前文字变成已添加
            item.bindText = '已添加';
        },
        /**
         * 取消添加同款
         */
        bindCancel(item,index) {
            this.targetKeys.splice(index,1);
            this.judgeIsSelect();
        },
        /**
         * 同款提交前准备
         */
        sameGoodsReady() {
            /* likeid
                goods
                title
                [{'gid':110,attr:[{attr_type:***,attr_name:***,attr_en:***}]}] */
            // 如果当前设置同款没有商品
            let targetLen = this.targetKeys.length;
            switch(targetLen) {
                case 0:
                    this.selectAttr = -1;
                    this.$Message.error({
                        content: '提交失败，请先添加商品',
                        duration: 3
                    });
                    break;
                default:
                    // 如果商品没有添加属性
                    let attrLen = this.targetKeys[0].attr.length;
                    switch(attrLen) {
                        case 0:
                            this.$Message.error({
                                content: '提交失败，请先右上角添加商品属性',
                                duration: 3
                            });
                            break;
                        default:
                            this.transGoods(); // 处理同款提交的参数
                            break;
                    }
            }
        },
        /**
         * 处理同款提交的参数
         */
        transGoods() {
            let likeid = -1;
            switch(this.relatenum) {
                case 1:
                    // 如果是外面点同款按钮进行提交的话
                    likeid = 0;
                    break;
                default:
                    likeid = this.targetKeys[0].likeid;  // 参数，第一个商品的likeid 是商品列表里点击同款数字进行提交的;
                    break;
            }
            let goods = [];
            let title = (this.targetKeys[0].attr.map(ele => ele.attr_type)).join(','); // 当前同款商品的属性有哪几种
            this.targetKeys.forEach(ele => {
                let obj = {};
                obj.gid = ele.id;
                obj.attr = ele.attr;
                goods.push(obj)
            })
            // 同款商品提交请求接口的所有参数对象
            this.sameObj = {
                likeid,
                goods,
                title
            }
             // 同款商品提交请求接口
            this.sameGoodsQuery();
        },
        /**
         * 设置同款商品提交请求接口
         */
        sameGoodsQuery() {
            // console.log(this.targetKeys)
            // console.log(this.sameObj)
            this.$resetAjax({
                type: "POST",
                url: `/admin/goods/setlikeid`,
                data: this.sameObj, // sameObj 接口参数
                success: (res) => {
                    let result = JSON.parse(res);
                    switch(result.result) {
                        case 'error':
                            this.$Message.error({
                                content: result.msg,
                                duration: 3
                            });
                            break;
                        case 'ok':
                            this.$Message.success({
                                content: '棒棒哒，设置同款成功',
                                duration: 3
                            });
                            // 关闭同款设置抽屉
                            this.relateModel = false;
                            // 重新获取外部商品列表
                            this.getCommodity();
                            break;
                    }
                }
            });
        },
        /**
         * 设置同款时删除商品属性
         */
        delAttr(i) {
            this.targetKeys.forEach(ele => {
                ele.attr.splice(i,1)
            })
            // 判断哪些属性该商品可选，可些不可选，要禁止
            this.judgeIsSelect()
        },
        /**
         * 商品添加属性
         */
        addAttr() {
            if (!this.relateModel || !this.selectAttr) {
                return false;
            }
            // 判断当前有没有商品在添加区域
            let targetLen = this.targetKeys.length;
            console.log(this.targetKeys)
            switch(targetLen) {
                case 0:
                    this.selectAttr = -1;
                    this.$Message.error({
                        content: '抱歉，请先添加商商品再选择属性',
                        duration: 3
                    });
                    break;
                default:
                    let objAttr = {};
                    this.attrList.forEach(ele => {
                        if(ele.id === this.selectAttr) {
                            objAttr = {
                                attr_en: "",
                                attr_name: "",
                                attr_type: this.selectAttr,
                                en_name: ele.en_name,
                                name: ele.name,
                            }
                        }
                    })
                    this.targetKeys.forEach(item => {
                        // item.attr = [];
                        item.attr.push(Object.assign({}, objAttr));
                    })
                    console.log(this.targetKeys)
                    // 判断哪些属性该商品可选，可些不可选，要禁止
                    this.judgeIsSelect();
                    break;
            }
        },
        /**
         * 新增绑定证书
         * */
        binding(row) {
            this.$resetAjax({
                type: "POST",
                url: `/Admin/Credential/binding`,
                data: {
                    gid: this.activeRow.id,
                    cid: row.id
                },
                success: res => {
                    let result = JSON.parse(res);
                    if (result.errorcode === 0) {
                        this.$Message.success({
                            content: "棒棒哒，新增成功",
                            duration: 3
                        });
                        let areaArr = row.area.split(',');
                        let arr = [];
                        this.areaList.forEach(ele => {
                            areaArr.forEach(item => {
                                if(ele.code === item) {
                                    arr.push(ele.name)
                                }
                            })
                        })
                        row.areaname = arr.join(',')
                        this.zsList.push(row);
                    } else {
                        this.$Message.error({
                            content: result.msg,
                            duration: 3
                        });
                    }
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
                this.formArea.area = arr;
                return false;
            }
            if (data.includes("01")) {
                // 全不选
                arr = [];
                this.formArea.area = arr;
                return false;
            }
        },
        /**
         * 上传成功文件
         */
        upLoadSuccess(res) {
            let data = res.data.num;
            this.$Message.success({
                content: `一共有${data}条商品翻译成功。`,
                duration: 3
            });
            this.getCommodity();
            // this.uploadFiles.push({ name: res.name });
        },
        /**
         * 查看商品大图
         */
        lookImage(row) {
            window.open(`http://img.xmvogue.com/thumb/${row.item_no}.jpg?x-oss-process=style/800`)
        },
        /**
         *显示禁配地区编辑弹窗
        */
        areanameEdit(row) {
            this.areaModel = true;
            this.activeRow = row;
            this.formArea.area = row.ban_area.split(',');
        },
        /**
         * 商品取消证书绑定
         */
        rowCancelBand(row) {
            this.$resetAjax({
                type: "POST",
                url: `/Admin/Credential/delCredential`,
                data: {
                    gid: this.rowId,
                    cid: row.cid
                },
                success: res => {
                    let result = JSON.parse(res);
                    this.$Message.success({
                        content: "解绑成功",
                        duration: 3
                    });
                    this.bindModel();
                }
            });
        },
        /**
         *编辑禁配地区
        */
        submitArea() {
            this.$resetAjax({
                type: "POST",
                url: "/Admin/Goods/set_area",
                data: {
                    area: this.formArea.area.join(","),
                    gid: this.activeRow.item_no
                },
                success: res => {
                    let result = JSON.parse(res);
                    if(result.errorcode === 1) {
                        this.$Message.success({
                            content: "设置禁配地区成功",
                            duration: 3
                        });
                    }
                    this.getCommodity();
                }
            });
        },
        /**
         * 获取外部表格商品列表数据
         */
        getCommodity() {
            NProgress.start(); // 进度条开始
            let data;
            switch(this.radioLabel) {
                case '全部':
                    data = {
                        page: this.currentPage,                 // 页码
                        name: this.nameValue.trim(),            // 商品名称
                        item_no: this.codeValue.trim(),         // 商品编码
                        cls: this.typeValue,                    // 商品类别
                        en_null: this.langValue,                // 是否有商品英文名
                        inland: this.wareValue,                 // 哪个仓库
                        display_flag: this.displayValue,        // 是否上下线
                        stay_online: this.stay_online,          // 待上线
                        heat: this.heatValue,                   // 是否为热销商品
                    };
                    break;
                case '无关联商品':
                    data = {
                        page: this.currentPage,                 // 页码
                        name: this.nameValue.trim(),            // 商品名称
                        item_no: this.codeValue.trim(),         // 商品编码
                        cls: this.typeValue,                    // 商品类别
                        nogl: 1 ,                               // 无关联产品
                        en_null: this.langValue,                // 是否有商品英文名
                        inland: this.wareValue,                 // 哪个仓库
                        stay_online: this.stay_online,          // 待上线
                        display_flag: this.displayValue,        // 是否上下线
                    };
                    break;
                case '推荐':
                    data = {
                        page: this.currentPage,                 // 页码
                        name: this.nameValue.trim(),            // 商品名称
                        item_no: this.codeValue.trim(),         // 商品编码
                        cls: this.typeValue,                    // 商品类别
                        Recommend: 1,                           // 是否是推荐
                        en_null: this.langValue,                // 是否有商品英文名
                        inland: this.wareValue,                 // 哪个仓库
                        display_flag: this.displayValue,        // 是否上下线
                        stay_online: this.stay_online,          // 待上线
                    };
                    break;
                case '热销':
                    data = {
                        page: this.currentPage,                 // 页码
                        name: this.nameValue.trim(),            // 商品名称
                        item_no: this.codeValue.trim(),         // 商品编码
                        cls: this.typeValue,                    // 商品类别
                        en_null: this.langValue,                // 是否有商品英文名
                        inland: this.wareValue,                 // 哪个仓库
                        display_flag: this.displayValue,        // 是否上下线
                        stay_online: this.stay_online,          // 待上线
                        heat: 1,                                // 是否为热销商品
                    };
                    break;
                default:
                    data = {
                        page: this.currentPage,                 // 页码
                        name: this.nameValue.trim(),            // 商品名称
                        item_no: this.codeValue.trim(),         // 商品编码
                        cls: this.typeValue,                    // 商品类别
                        en_null: this.langValue,                // 是否有商品英文名
                        inland: this.wareValue,                 // 哪个仓库
                        display_flag: this.displayValue,        // 是否上下线
                        stay_online: this.stay_online,          // 待上线
                    };
                    break;
            }
            this.$resetAjax({
                type: "POST",
                url: "/Admin/Goods/index",
                data,
                success: res => {
                    NProgress.done(); // 进度条结束
                    let result = JSON.parse(res)
                    result.data.forEach(ele => {
                        let arr3 = [];
                        let arr2 = ele.ban_area.split(",");
                        this.areaList.forEach(list => {
                            arr2.forEach(item => {
                                if (list.code === item) {
                                    arr3.push(list.name);
                                }
                            });
                        });
                        ele.areaname = arr3.join(",");
                        ele.display_flag === 1 ? true : false;
                        ele.heat === 1 ? true : false;  // 商品是否热销
                        ele.rec === '1' ? true : false;  // 商品是否推荐
                        ele.hs_code = ele.hs_code ? ele.hs_code : '暂无'; 
                    });
                    this.tableData = result.data;
                    this.total = Number(result.total);
                }
            });
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
         * 新增商品
         */
        addBtnClick() {},
        /**
         * 查看商品详情
         */
        getDetailData(row) {
            this.drawerTitle = row.item_name;
            this.isGoodsDrawer = true;
            this.formData = {
                item_no: row.item_no, // 条码
                item_name: row.item_name, // 名称
                item_en: row.item_en, // 英文名
                item_no: row.item_no, // 货号
                item_clsno: row.item_clsno, // 类别
                base_price: row.base_price, // 进价
                sale_price: row.sale_price, // 售价
                purchase_spec: row.purchase_spec, // 规格
                stock_num: row.stock_num, // 库存
                pic: row.pic, // 图片
                uptime: row.uptime, // 商品上传时间
                lwh: row.lwh,
                lwh_en:  row.lwh_en,
                material:  row.material,
                material_en: row.material_en,
                stuffing: row.stuffing,
                stuffing_en: row.stuffing_en,
                features: row.features,
                features_en: row.features_en,
                standard: row.standard,
                usage: row.usage,
                usage_en: row.usage_en,
                notes: row.notes,
                notes_en: row.notes_en,
                caution: row.caution,
                caution_en: row.caution_en,
                credential: row.credential,
                lwh: row.lwh,
                lwh_en: row.lwh_en,
                model: row.model,
                packaging: row.packaging,
                videoUrl: row.video
            };
        },
        /**
         * 删除商品
         */
        delCommodity(row) {
            this.$resetAjax({
                type: 'POST',
                url: '/admin/Goods/cndel',
                data: {
                    item_no: row.item_no
                },
                success: (res) => {
                    let result = JSON.parse(res);
                    if(result.error === 'error2') {
                        this.$Message.error({
                            content: '抱歉,该商品为国外商品，不能够删除',
                            duration: 3
                        });
                    } else {
                        this.$Message.success({
                            content: '删除成功',
                            duration: 3
                        });
                        this.getCommodity()
                    }
                }
            })
        },
        /**
         * 商品列表切换页面
         */
        changePage(index) {
            this.currentPage = index;
            this.getCommodity();
        },
        handleCheckAll() {
            if (this.indeterminate) {
                this.checkAll = false;
            } else {
                this.checkAll = !this.checkAll;
            }
            this.indeterminate = false;
            if (this.checkAll) {
                this.checkAllGroup = [
                "item_clsno",
                "img",
                "item_no",
                "item_name",
                "item_en",
                "lot_spec",
                "base_price",
                "sale_price",
                "lwh_en",
                "weight",
                "usage_en",
                "credential",
                "expiration",
                "usage",
                "lwh",
                "standard",
                "features_en",
                "material_en",
                "material",
                "features",
                "status",
                "caution_en",
                "caution",
                "hs_code",
                "packaging",
                "notes_en",
                "stuffing",
                "stuffing_en",
                "display_flag",
                "stock_num",
                "weight_en",
                "notes",
                "model"
                ];
            } else {
                this.checkAllGroup = [];
            }
        },
        checkAllGroupChange(data) {
            if (data.length === 32) {
                this.indeterminate = false;
                this.checkAll = true;
            } else if (data.length > 0) {
                this.indeterminate = true;
                this.checkAll = false;
            } else {
                this.indeterminate = false;
                this.checkAll = false;
            }
        },
        /***
         * 取消导出
         */
        exportCancel() {
            this.exportObj = {
                item_clsno: "",
                filename: "",
                ck: "",
                base_price: 0
            };
            this.fields = [];
            this.checkAllGroup = [];
            this.checkAll = false;
            this.isExport = false;
        },
        /**
         * 提交导出
         */
        exportQuery(exportObj) {
            this.$refs.exportObj.validate(valid => {
                if (valid) {
                    if (this.checkAllGroup.length === 0) {
                        this.$Message.warning({
                        background: true,
                        content: "字段勾选不能为空"
                        });
                    } else {
                        if(this.exportObj.ck.trim().length === 0) {
                            location.href = `http://order.xmvogue.com/word/public/index.php?s=Admin/Goods/daochu&item_clsno=${
                            this.exportObj.item_clsno
                            }&filename=${this.exportObj.filename}&fields=${
                            this.checkAllGroup
                            }&base_price=${this.exportObj.base_price}`;
                        } else{
                            location.href = `http://order.xmvogue.com/word/public/index.php?s=Admin/Goods/daochu&item_clsno=${
                            this.exportObj.item_clsno
                            }&filename=${this.exportObj.filename}&fields=${
                            this.checkAllGroup
                            }&ck=${this.exportObj.ck}&base_price=${this.exportObj.base_price}`;

                        }
                    }
                }
            });
        },
        /**
         * 翻译商品名称准备
         */
        getCollect(row) {
            this.correntNo = row.item_no;
            this.correctModel = true;
            switch (this.rowMd) {
                case "en":
                this.correntTitle = `${row.item_name}：`;
                this.correntEn = row.item_en.length === 0 ? "" : row.item_en;
                this.correctPlace = "请输入商品英文名...";
                break;
                case "key":
                this.correntTitle = "设置关键字";
                this.correntEn = row.keyword.length === 0 ? "" : row.keyword;
                this.correctPlace = "请输入关键字....";
                break;
            }
        },
        /**
         * 英文修改提交
         */
        correctQuery() {
            switch (this.rowMd) {
                case "en":
                    this.goodsEnEdit();
                    break;
                case "key":
                    this.goodsKeyEdit();
                    break;
            }
        },
        /**
         * 商品英文名修正请求
         */
        goodsEnEdit() {
            this.$resetAjax({
                type: "POST",
                url: "/admin/Goods/fanyi",
                data: {
                no: this.correntNo, // 编码
                english: this.correntEn // 英文名
                },
                success: res => {
                let result = JSON.parse(res);
                if (result.result === "ok") {
                    this.$Message.success({
                        content: "棒棒哒，英文名修改成功",
                        duration: 3
                    });
                    // 进行判断刷新页面
                    this.getCommodity();
                    return false;
                }
                if ((result.result = "error")) {
                        this.$Message.warning({
                        content: "您暂时没有做任何修改，修改失败",
                        duration: 3
                    });
                }
                }
            });
        },
        /**
         * 商品关键字修正请求
         */
        goodsKeyEdit() {
            this.$resetAjax({
                type: "POST",
                url: "/admin/Goods/set_key",
                data: {
                    no: this.correntNo, // 编码
                    key: this.correntEn // 英文名
                },
                success: res => {
                let result = JSON.parse(res);
                if (result.result === "ok") {
                    this.$Message.success({
                        content: "棒棒哒，关键字修改成功",
                        duration: 3
                    });
                    this.getCommodity();
                }
                }
            });
        },
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
        margin-bottom: 5px;
    }
    .goods-img {
        width: 80px;
        height: 80px;
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