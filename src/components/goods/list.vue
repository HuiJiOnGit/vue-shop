<template>
  <div>
    <!-- 面包屑部分 -->
    <bread title1="商品管理" title2="商品列表"></bread>

    <!-- 卡片部分 -->
    <el-card>
      <!-- 搜索部分 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getGoodsList">
            <el-button slot="append" icon="el-icon-search" @click="getGoodsList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="AddGoodPage">添加商品</el-button>
        </el-col>
      </el-row>

      <!-- table部分 -->
      <el-table :data="goodslist" style="width: 100%" border stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="goods_name" label="商品名称"></el-table-column>
        <el-table-column prop="goods_price" label="商品价格(元)" width="120px"></el-table-column>
        <el-table-column prop="goods_weight" label="商品重量" width="120px"></el-table-column>
        <el-table-column prop="add_time" label="商品创建时间" width="180px">
          <template v-slot:default="scope">{{scope.row.add_time | dateFormat}}</template>
        </el-table-column>
        <el-table-column label="操作" width="200px">
          <template v-slot:default>
            <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="DeleteById(scope.row.goods_id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页部分 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[10, 20, 30, 50]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
  </div>
</template>

<script>
import Bread from "../common/Breadcrumb.vue"
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
      // 商品列表
      goodslist: [],
      // 总条数
      total: 0
    }
  },
  methods: {
    // 获取商品列表
    async getGoodsList() {
      let { data: res } = await this.$http.get(`goods`, {
        params: this.queryInfo
      })

      if (res.meta.status !== 200) {
        return this.$message.error("获取商品列表失败")
      }

      this.$message.success("获取商品列表成功")
      console.log(res)
      this.goodslist = res.data.goods
      this.total = res.data.total
    },
    // 分页大小变化事件
    handleSizeChange(newSize){
        this.queryInfo.pagesize = newSize;
        this.getGoodsList();
    },
    // 页数变化事件
    handleCurrentChange(newPage){
        this.queryInfo.pagenum = newPage;
        this.getGoodsList();
    },
    // 删除商品
    DeleteById(id) {
        this.$confirm("此操作将删除此商品, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async result => {
          if (result === "confirm") {
            const { data: res } = await this.$http.delete("goods/" + id)

            if (res.meta.status !== 200) {
              return this.$message.error("删除商品失败！")
            }
            this.$message({
              type: "success",
              message: "删除成功!"
            })
            this.getCateList()
          }
        })
        .catch(result => {
          if (result === "cancel") {
            this.$message({
              type: "info",
              message: "已取消删除"
            })
          }
        })
    },
    // 添加商品页面
    AddGoodPage(){
        this.$router.push('/goods/add');
    }
  },
  created() {
    this.getGoodsList()
  }
}
</script>

<style lang="less" scoped>
</style>