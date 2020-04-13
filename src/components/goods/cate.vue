<template>
  <div>
    <!-- 面包屑部分 -->
    <bread title1="商品管理" title2="商品分类"></bread>

    <!-- 卡片 -->
    <el-card>
      <!-- 添加按钮 -->
      <el-row>
        <el-col :span="1">
          <el-button type="primary">添加分类</el-button>
        </el-col>
      </el-row>
      <!-- 表格 -->
        <tree-table 
        :data="catelist" 
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        show-index
        index-text="#"
        border>
        </tree-table>
      <!-- 分页 -->
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
      querInfo: {},
      // 商品分类的数据列表
      catelist: [],
      // 总数据条数
      total: 0,
      // 为table指定列的定义
      columns: [
          {
              label: '分类名称',
              prop: 'cat_name'
          }
      ]
    }
  },
  methods: {
      // 获取商品分类数据
      async getCateList(){
          let {data: res} = await this.$http.get('categories',{params: this. querInfo});

          if (res.meta.status !== 200) {
              return this.$message.error('获取商品分类失败');
          }
          this.catelist = res.data;

          this.total = res.data.total;
      }
  },
  created() {
      this.getCateList();
  }
}
</script>

<style lang="less" scoped>
</style>