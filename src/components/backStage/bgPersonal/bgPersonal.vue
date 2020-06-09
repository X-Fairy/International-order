<template>
    <div class="bgPersonalPage">
        <div class="top">
            <span>{{infoObj.user}}</span>，您好 ! 
        </div>
        <div class="content">
            <h3 class="title"><span>基本信息</span></h3>
            <div class="info">
                <p>姓名：{{infoObj.user}}</p>
                <p>身份：{{infoObj.title}}</p>
            </div>
            <h3 class="title"><span>密码修改</span></h3>
            <div class="info">
                <Button type="primary" style="margin-right:20px;" @click="isEdit=true">修改密码</Button>
                <Button type="error" @click="resetPass">重置密码</Button>
            </div>
        </div>
        <!-- 密码修改模态框 -->
        <Modal v-model="isEdit" title="更改密码" class="bgPersonalPage_edit">
            <div class="item">
                <span>新密码：</span>
                <Input v-model="newPass" type="password"  placeholder="请输入新的密码"/>
            </div>
            <div class="item">
                <span>重新输入密码：</span>
                <Input v-model="conPass" type="password" @blur="judgePass" placeholder="请再次输入新的密码"/>
            </div>
            <div class="modal_footer">
                <span @click="isEdit=false;">取消</span>
                <Button type="info" @click="judgePass">保存</Button>
            </div>
        </Modal>
        <!-- 重置密码提示框 -->

    </div>
</template>

<script>
export default {
    data() {
        return {
            // 用户信息数据
            infoObj:{},
            // 是否显示密码修改框
            isEdit: false,
            // 新的密码
            newPass: '',
            // 确认密码
            conPass:'',
        }
    },

    created() {
        // 得到用户基本信息
        this.getBackInfo();
    },
    watch: {
        isEdit(val, valold) {
            if(!val) {
                this.newPass = '';
                this.conPass = '';
            }
        }
    },
    methods: {
        /**
         * 得到用户基本信息
         */
        getBackInfo() {
            this.$resetAjax({
                type: "GET",
                url: "/admin/admin/getuserinfo",
                success: (res) => {
                    let result = JSON.parse(res);
                    this.infoObj = result.data;
                }    
            });
        },
        /**
         * 密码修改请求
         */
        editPass() {
            this.$resetAjax({
                type: "POST",
                url: "/admin/admin/setpsw",
                data: {
                    psw: this.newPass
                },
                success: (res) => {
                    let result = JSON.parse(res).errorcode;
                    if(result === 2) {
                        this.$Message.warning({
                            content: '更该的密码和原来的密码一致，修改失败。',
                            duration: 4
                        })
                    } else if(result === 0) {
                        this.isEdit = false;
                        this.$Message.success({
                            content: '密码修改成功, 2 秒后需重新登录。',
                            duration:3
                        })
                        setTimeout(() => {
                            localStorage.remBack = false;
                            localStorage.userBack = '';
                            localStorage.passBack = '';
                            localStorage.group_id = '';  
                            localStorage.hdcode = '';      
                            localStorage.backName = '';  
                            localStorage.currendIndx = -1;  
                            localStorage.group_id = ''; 
                            this.$router.push('/backSupport');
                            this.$nextTick(() => {
                                location.reload();
                            })
                        }, 4500);
                    }
                }    
            });
        },
        /**
         * 确认两次密码是否输入正确
         */
        judgePass() {
            if(this.newPass !== this.conPass) {
                this.$Message.warning({
                    content: '两次输入的密码不一致，请重新输入',
                    duration: 4
                })
                return false;
            } 
            this.editPass();
        },
        /**
         * 重置密码确认框提示
         */
        resetPass() {
            this.$Modal.confirm({
                title: '提示：',
                content: `<p>是否需要重置密码为 123456 ?</p>`,
                onOk: () => {
                    this.resetPassQuery()
                },
                onCancel: () => {
                    this.$Message.info('您取消重置密码.');
                }
            });
        },
        /**
         * 重置密码请求
         */
        resetPassQuery() {
            this.$resetAjax({
                type: "POST",
                url: "/admin/admin/resetpsw",
                success: (res) => {
                    let result = JSON.parse(res).errorcode;
                    if(result === 0) {
                        this.$Modal.remove();
                        this.$Message.success({
                            content: '重置密码成功, 2 秒后需重新登录。',
                            duration:3
                        })
                        setTimeout(() => {
                            localStorage.remBack = false;
                            localStorage.userBack = '';
                            localStorage.passBack = '';
                            localStorage.group_id = '';  
                            localStorage.hdcode = '';      
                            localStorage.backName = '';  
                            localStorage.currendIndx = -1;  
                            localStorage.group_id = ''; 
                            this.$router.push('/backSupport');
                            this.$nextTick(() => {
                                location.reload();
                            })
                        }, 4500);
                    }
                }    
            });
        }
    },
}
</script>
