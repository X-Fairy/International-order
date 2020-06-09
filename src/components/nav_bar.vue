<template>
    <!-- <div class="nav_bar"> -->
    <el-scrollbar class="nav_bar">
        <h3 class="logo_icon">
            <img src="@/assets/images/logo.jpg" alt />
        </h3>
        <ul>
            <li v-for="(item,index) in navList" :key="index" :class="[item.type==1?'nav':'navItem',{li_active: currendIndx === index}]">
                <div v-if="item.type==1" @click="clickNavli(item,index)">
                    <i :class="item.icon" v-if="fontChange" class="iconfont nav_icon"></i>
                    <span v-if="fontChange">{{item.title}}</span>
                    <el-tooltip effect="dark" :content="item.title" placement="right" v-else :class="{active_icon:!fontChange}">
                        <i :class="item.icon" class="iconfont nav_icon"></i>
                    </el-tooltip>
                </div>
                <div v-else @click="bindParent(item,index)" class="parent">
                    <Collapse v-model="value" accordion ref="b" @on-change="bindPanel(item,index)">
                        <Panel :name="String(index+1)" :ref="`list${index}`">
                            <div v-if="fontChange">
                                <i :class="item.icon" class="iconfont nav_icon"></i>
                                <span v-if="fontChange">{{item.title}}</span>
                            </div>
                            <el-tooltip placement="right" theme="light" id="parent_tooltip" v-if="!fontChange">
                                <div slot="content" v-for="(data,k) in item.child" :key="k" @click.stop="childBind(data)">
                                    <i :class="data.icon" class="iconfont nav_icon"></i>
                                    <span>{{data.title}}</span>
                                </div>
                                <i :class="item.icon" class="iconfont nav_icon"></i>
                            </el-tooltip>
                            <div slot="content" v-for="(data,k) in item.child" :key="k" @click="bindchild(data,k)" :class="[{item_active: active == k},fontChange?'content':'avtive_content']">
                                <div v-if="fontChange" style="padding:0 10px">
                                    <i :class="data.icon" class="iconfont nav_icon"></i>
                                    <span>{{data.title}}</span>
                                </div>
                                <el-tooltip :content="data.title" placement="right" v-else :class="{active_icon:!fontChange}">
                                    <i :class="data.icon" class="iconfont nav_icon"></i>
                                </el-tooltip>
                            </div>
                        </Panel>
                    </Collapse>
                </div>
            </li>
        </ul>
    </el-scrollbar>
    <!-- </div> -->
</template>
<script>
import Bus from "@/assets/js/eventBus.js"; // 组件传值
export default {
    props: ["fontChange"],
    data() {
        return {
            //  导航栏数据
            navList: [],
            // 点击到左侧导航栏哪个li
            currendIndx: -1,
            // 折叠面板打开的值
            value: '-1',
            panel: 1,
            active: -1
        };
    },

    mounted() {
        this.currendIndx = Number(localStorage.currendIndx);
        this.loadNav();
    },
    watch: {
        value(val,oldval) {
            console.log(val, oldval)
        }
    },
    methods: {
        /**
         * 获取导航
         */
        loadNav() {
            this.$resetAjax({
                type: "POST",
                url: "/Admin/admin/getmenu",
                success: res => {
                    let result = JSON.parse(res);
                    let nav = [];
                    result.rule.forEach(function(item, index) {
                        //   父级
                        if (item.fid == 0) {
                            nav.push(item);
                        }
                        //子级
                        if (item.type == 2) {
                            item.child = [];
                            result.rule.forEach(function(data, k) {
                                if (item.id == data.fid) {
                                item.child.push(data);
                                }
                            });
                        }
                    });
                    localStorage.rule = JSON.stringify(nav);
                    this.navList = JSON.parse(localStorage.rule);
                }
            });
        },
        /**
         * 对导航栏里的li进行点击
         */
        clickNavli(item, index) {
            this.currendIndx = index;
            localStorage.currendIndx = index;
            let id = item.id;
            Bus.$emit("msg", item.title); // 组件传值
            this.$router.push({ path: "/backStage/" + item.name });
            this.value = '-1';
            this.active = -1;
        },
        bindPanel(item, index) {
            this.panel = index;
            this.active = -1;
            this.value = String(index + 1);
            //   this.$refs[`list${index}`][0].$el.firstChild.style.background = "#218da0";
            //   this.$refs[`list${index}`][0].$el.firstChild.style.color = "#ffffff";
        },
        bindParent(item, index) {
            this.currendIndx = index;
        },
        bindchild(item, index) {
            this.active = index;
            Bus.$emit("msg", item.title); // 组件传值
            this.$router.push({ path: "/backStage/" + item.name });
        },
        /**
         * 父级里的气泡点击跳转
         */
        childBind(data) {
            Bus.$emit("msg", data.title);
            this.$router.push({ path: "/backStage/" + data.name });
        }
    }
};
</script>

