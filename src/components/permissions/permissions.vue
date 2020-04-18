<template>
    <div>
        <!-- 面包屑部分 -->
        <bread title1='权限管理' title2='权限列表'></bread>
        <!-- 卡片部分 -->
        <el-card class="box-card">
            <el-table :data='rightsList' border stripe>
                <el-table-column type='index' label='#'></el-table-column>
                <el-table-column label='权限名称' prop='authName'></el-table-column>
                <el-table-column label='路劲' prop='path'></el-table-column>
                <el-table-column label='权限等级' prop='level'>
                    <template v-slot='scope'>
                        <el-tag v-if="scope.row.level === '0'">一级</el-tag>
                        <el-tag v-else-if="scope.row.level === '1'" type="success">二级</el-tag>
                        <el-tag type="warning" v-else>三级</el-tag>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
    </div>
</template>

<script>
    import Bread from '../common/Breadcrumb.vue'
    export default {
        name: 'permissions',
        data() {
            return {
                rightsList: []
            }
        },
        components:{
            'bread': Bread
        },
        methods: {
            // 获取权限列表
            getRightsList() {
                // let {data: res} = await this.$http.get('rights/list');

                // if (res.meta.status !== 200) {
                //     return this.$message.error('获取权限列表失败！');                    
                // }
                // this.rightsList = res.data;
                this.$api.rights.GetRightsList().then(res => {
                    this.rightsList = res.data;                    
                }).catch(err => {
                    this.$message.error('获取权限列表失败！')
                })
            }
        },
        created(){
            // 获取所有权限
            this.getRightsList();
        }
    }
</script>
<style lang="less" scoped>

</style>