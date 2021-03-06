<template>
    <div>
        <!-- 面包屑部分 -->
        <bread title1="订单管理" title2="订单列表"></bread>
        <!-- 卡片部分 -->
        <el-card>
            <!-- 搜索部分 -->
            <el-row :gutter="20">
                <el-col :span="8">
                    <el-input placeholder="请输入内容" clearable v-model="queryInfo.query">
                        <el-button slot="append" icon="el-icon-search" @click="getOrderList"></el-button>
                    </el-input>
                </el-col>
            </el-row>
            <!-- 订单列表 -->
            <el-table :data="orderList" border stripe>
                <el-table-column type="index" label="#"></el-table-column>
                <el-table-column label="订单编号" prop="order_number"></el-table-column>
                <el-table-column label="订单价格" prop="order_price"></el-table-column>
                <el-table-column label="是否付款">
                    <template slot-scope="scope">
                        <el-tag type="danger" size="mini" v-if="scope.row.pay_status">未付款</el-tag>
                        <el-tag type="success" size="mini" v-else>已付款</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="是否发货" prop="is_send"></el-table-column>
                <el-table-column label="下单时间" prop="create_time">
                    <template slot-scope="scope">
                        {{scope.row.create_time | dateFormat}}
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template slot>
                        <el-button type="primary" size="mini" icon="el-icon-edit" @click="showEditDialog"></el-button>
                        <el-button type="success" size="mini" icon="el-icon-location" @click="showProgressDialog">
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 分页区域 -->
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                :current-page="queryInfo.pagenum" :page-sizes="[10, 20, 30, 50]" :page-size="queryInfo.pagesize"
                layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
        </el-card>

        <!-- 编辑对话框 -->
        <el-dialog title="修改地址" :visible.sync="addressDialogVisible" width="50%" @close="addressDialogClosed">
            <el-form :model="addressForm" :rules="addressFormRules" ref="addressFormRef" label-width="100px">
                <el-form-item label="省市区/县" prop="address1">
                    <el-cascader v-model="addressForm.address1" :options="cityData" :props="{ expandTrigger: 'hover' }">
                    </el-cascader>
                </el-form-item>
                <el-form-item label="详细地址" prop="address2">
                    <el-input v-model="addressForm.address2"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addressDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addressDialogVisible = false">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 展示物流进度对话框 -->
        <el-dialog title="查看物流进度" :visible.sync="progressDialogVisible" width="50%">
            <!-- 时间线 -->
            <el-timeline>
                <el-timeline-item v-for="(activity, index) in progressInfo" :key="index" :timestamp="activity.time">
                    {{activity.context}}</el-timeline-item>
            </el-timeline>
        </el-dialog>
    </div>
</template>

<script>
    import Bread from "../common/Breadcrumb.vue"
    import cityData from './citydata.js'
    export default {
        components: {
            bread: Bread
        },
        data() {
            return {
                // 查询条件
                queryInfo: {
                    query: "",
                    pagenum: 1,
                    pagesize: 10
                },
                // 订单列表
                orderList: [],
                // 总条数
                total: 0,
                // 编辑对话框
                addressDialogVisible: false,
                addressForm: {
                    address1: [],
                    address2: ''
                },
                addressFormRules: {
                    address1: [{
                        required: true,
                        message: '请选择省市区县',
                        trigger: 'blur'
                    }],
                    address2: [{
                        required: true,
                        message: '请输入详细地址',
                        trigger: 'blur'
                    }]
                },
                cityData,
                // 物流进度对话框
                progressDialogVisible: false,
                // 物流进度
                progressInfo: []
            }
        },
        methods: {
            getOrderList() {
                this.$api.orders.GetOrderList(this.queryInfo).then(res => {
                    this.orderList = res.data.goods
                    this.total = res.data.total
                    this.$message.success('获取订单列表成功');
                }).catch(err => {
                    console.log(err);
                    this.$message.error('获取订单列表失败');
                })
            },
            // 分页
            handleSizeChange(newSize) {
                this.queryInfo.pagesize = newSize
                this.getOrderList()
            },
            handleCurrentChange(newSize) {
                this.queryInfo.pagenum = newSize
                this.getOrderList()
            },
            // 编辑对话框
            showEditDialog() {
                this.addressDialogVisible = true
            },
            addressDialogClosed() {
                this.$refs.addressFormRef.resetFields()
            },
            showProgressDialog() {
                // 供测试的物流单号：1106975712662
                this.$api.orders.GetKD('1106975712662').then(res => {
                    this.progressInfo = res.data
                    this.progressDialogVisible = true
                }).catch(err => {
                    return this.$message.error('获取物流进度失败!')
                })
            }
        },
        created() {
            this.getOrderList();
        },
    }
</script>

<style lang="less" scoped>
    .el-cascader {
        width: 100%;
    }
</style>