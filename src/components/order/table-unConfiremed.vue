<template>
    <div>
        <Row class="expand-row">
            <i-Col span="8">
                <span class="expand-key">名称</span>
                <span class="expand-value">{{ row.item_name }}</span>
            </i-Col>
            <i-Col span="8">
                <span class="expand-key">货号: </span>
                <span class="expand-value">{{ row.item_no }}</span>
            </i-Col>
            <i-Col span="8">
                <span class="expand-key">单价: </span>
                <span class="expand-value">{{ row.price }}</span>
            </i-Col>
            <i-Col span="8">
                <span class="expand-key">数量: </span>
                <span class="expand-value">{{ row.QTY }}</span>
            </i-Col>
        </Row>
    </div>
</template>

<script>
    export default {
        props: {
            row: Object
        },
    };
</script>
