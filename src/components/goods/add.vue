<template>
  <div>
    <!-- 面包屑部分 -->
    <bread title1="商品管理" title2="添加商品"></bread>

    <!-- 卡片部分 -->
    <el-card>
      <el-alert title="添加商品信息" type="info" show-icon></el-alert>
      <!-- 步骤条 -->
      <el-steps :space="200" :active="activeStep - 0" finish-status="success" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>

      <!-- tabs区域 -->
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="120px">
        <el-tabs tab-position="left" v-model="activeStep" :before-leave="beforeTabLeave">
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addForm.goods_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addForm.goods_weight" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addForm.goods_number" type="number"></el-input>
            </el-form-item>
            <el-form-item label="选择商品分类" class="leftCascader">
              <!-- 选择商品分类的级联选择框 -->
              <el-cascader
                v-model="addForm.goods_cat"
                :options="catelist"
                :props="cateProps"
                @change="handleChange"
                clearable
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1"></el-tab-pane>
          <el-tab-pane label="商品属性" name="2"></el-tab-pane>
          <el-tab-pane label="商品图片" name="3"></el-tab-pane>
          <el-tab-pane label="商品内容" name="4"></el-tab-pane>
        </el-tabs>
      </el-form>
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
      // 活动的step
      activeStep: "0",
      // add表单
      addForm: {
        // 商品名称
        goods_name: "",
        // 价格
        goods_price: "",
        // 数量
        goods_number: "",
        // 重量
        goods_weight: "",
        // 介绍
        goods_introduce: "",
        // 上传的图片临时路径（对象）
        pics: "",
        // 商品的参数（数组），包含 动态参数 和 静态属性
        attrs: "",
        // 以为','分割的分类列表
        goods_cat: []
      },
      // add表单规则
      addFormRules: {
        goods_name: [{ required: true, message: "不能为空", trigger: "blur" }],
        goods_price: [{ required: true, message: "不能为空", trigger: "blur" }],
        goods_cat: [{ required: true, message: "不能为空", trigger: "blur" }],
        goods_number: [
          { required: true, message: "不能为空", trigger: "blur" }
        ],
        goods_weight: [
          { required: true, message: "不能为空", trigger: "blur" }
        ],
        goods_introduce: [
          { required: true, message: "不能为空", trigger: "blur" }
        ],
        pics: [{ required: true, message: "不能为空", trigger: "blur" }],
        attrs: [{ required: true, message: "不能为空", trigger: "blur" }]
      },
      // 级联选择数据源
      catelist: [],
      // 级联选择配置
      cateProps: {
        value: "cat_id",
        label: "cat_name",
        children: "children",
        expandTrigger: "hover"
        // emitPath: false
      },
      // 级联选择框选中数组
      cateSelectValue: []
    }
  },
  methods: {
    // 获取商品分类数据
    async getCateList() {
      let { data: res } = await this.$http.get("categories")

      if (res.meta.status !== 200) {
        return this.$message.error("获取商品分类失败")
      }
    //   console.log(res.data)
      this.catelist = res.data
    },
    // 级联选择框change事件
    handleChange() {
        if (this.addForm.goods_cat.length !== 3) {
            this.addForm.goods_cat = [];
        }
        console.log(this.addForm.goods_cat);
    },
    // 在tab离开事件
    beforeTabLeave(newTab,oldTab){
        if (this.addForm.goods_cat.length !== 3 && oldTab === '0') {
            this.$message.error('请选择商品分类');
            return false;
        }
    }
  },
  created() {
    this.getCateList()
  }
}
</script>

<style lang="less" scoped>
.el-steps {
  margin-top: 20px;
  font-size: 14px;
}
.el-tabs {
  margin-top: 20px;
}
// .leftCascader{
//     display: flex;
//     justify-content: flex-start;
// }
</style>