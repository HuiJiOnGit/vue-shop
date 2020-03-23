<template>
    <div>
        <!-- 面包屑部分 -->
        <bread title1='权限管理' title2='角色列表'></bread>
    </div>
</template>

<script>
    import Bread from '../common/Breadcrumb.vue'
    export default {
        name: 'RoleList',
        components: {
            'bread': Bread
        },
        data() {
            return {

            }
        },
        methods: {

        },
    }
</script>
<style lang="less" scoped>

</style>