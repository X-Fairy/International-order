<template>
    <div class="table ivu-table-wrapper">
        <div class="ivu-table">
            <div class="ivu-table-header">
                <table cellspacing="0" cellpadding="0" border="0" style="width: 1540px;">
                    <colgroup>
                        <col>
                        <col>
                        <col>
                        <col>
                        <col>
                        <col>
                    </colgroup>
                    <thead>
                        <tr>
                            <th class="ivu-table-column-center" v-if="isSelectAll" style="width:80px;">
                                <div class="ivu-table-cell">
                                    <Checkbox v-model="isCheckAll" />
                                </div>
                            </th>
                            <th class="ivu-table-column-center" v-for="(item,index) in columns" :key="index">
                                <div class="ivu-table-cell">
                                    <span class="">{{item.title}}</span>
                                </div>
                            </th>
                        </tr>
                    </thead>
                </table>
            </div>
            <div class="ivu-table-body">
                <table cellspacing="0" cellpadding="0" border="0" style="width: 1540px;">
                    <colgroup>
                        <col>
                        <col>
                        <col>
                        <col>
                        <col>
                        <col>
                    </colgroup>
                    <tbody class="ivu-table-tbody">
                        <slot name="item"></slot>
                    </tbody>
                </table>
            </div>
            <!-- <div class="ivu-table-tip" v-if="data.length===0">
                <table cellspacing="0" cellpadding="0" border="0">
                    <tbody>
                        <tr>
                            <td style="width: 1200px;">
                                <span>暂无筛选结果</span>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div> -->
        </div>
        <object tabindex="-1" type="text/html" data="about:blank" style="display: block; position: absolute; top: 0px; left: 0px; width: 100%; height: 100%; border: none; padding: 0px; margin: 0px; opacity: 0; z-index: -1000; pointer-events: none;"></object>
    </div>
</template>

<script>
export default {
    props: {
        columns: {
            type: Array,
            default: () => []
        },
        tableData: {
            type: Array,
            default: () => []
        },
    },

    computed: {
        isSelectAll() {
            let typeList = this.columns.map(item => item.type);
            return typeList.includes('selection');
        },

        isCheckAll: {
            set(val) {
                this.tableData.forEach(item => {
                    item._checked = val;
                });
            },
            get() {
                let checked = true,
                    leng = this.tableData.length;
                // 数据为空，默认不全选
                if (leng === 0) {
                    checked = false;
                } else {
                    for (let i=0; i < leng; i++) {
                        if (!this.tableData[i]._checked) {
                            checked = false;
                            break;
                        }
                    }
                }
                return checked;
            }
        }
    }
}
</script>
