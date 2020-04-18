<template>
  <div>
    <!-- 面包屑部分 -->
    <bread title1="商品管理" title2="商品分类"></bread>

    <!-- 卡片 -->
    <el-card>
      <!-- 添加按钮 -->
      <el-row>
        <el-col :span="1">
          <el-button type="primary" @click="OpenCreateDialog">添加分类</el-button>
        </el-col>
      </el-row>
      <!-- 表格 -->
      <el-table
        :data="catelist"
        style="width: 100%;margin-bottom: 20px;"
        row-key="cat_id"
        border
        :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
        stripe
      >
        <el-table-column type="index" label="#" width="50px"></el-table-column>
        <el-table-column prop="cat_name" label="分类名称"></el-table-column>
        <el-table-column label="是否有效" prop="cat_deleted">
          <template v-slot:default="scope">
            <i
              class="el-icon-success"
              v-if="scope.row.cat_deleted === false"
              style="color: lightgreen;"
            ></i>
            <i class="el-icon-error" v-else style="color: red;"></i>
          </template>
        </el-table-column>
        <el-table-column label="排序" prop="cat_level">
          <template v-slot="scope">
            <el-tag v-if="scope.row.cat_level === 0">一级</el-tag>
            <el-tag v-else-if="scope.row.cat_level === 1" type="success">二级</el-tag>
            <el-tag type="warning" v-else>三级</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template v-slot:default="scope">
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-edit"
              @click="OpenEditDialog(scope.row.cat_id)"
            >编辑</el-button>
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
              @click="DeleteCateById(scope.row.cat_id)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="querInfo.pagenum"
        :page-sizes="[10,20,50,100]"
        :page-size="querInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>

    <!-- 添加分类对话框 -->
    <el-dialog
      title="添加分类"
      :visible.sync="addDialogVisible"
      width="30%"
      @close="closeAddCateDialog"
    >
      <el-form
        label-position="left"
        label-width="80px"
        :model="addCateForm"
        :rules="addCateFormRule"
        ref="addCateFormRef"
      >
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类">
          <el-cascader
            v-model="cascaderSelect"
            :options="parentCateList"
            :props="cascaderProps"
            @change="handleChange"
            clearable
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCateDialogSubmit">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑分类对话框 -->
    <el-dialog title="编辑分类" :visible.sync="editDialogVisible" width="30%" @close="editDialogClose">
      <el-form
        label-position="left"
        label-width="80px"
        :model="editCateForm"
        :rules="editCateFormRule"
        ref="editCateFormRef"
      >
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="editCateForm.cat_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editCateFormSubmit">确 定</el-button>
      </span>
    </el-dialog>
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
      querInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 10
      },
      // 商品分类的数据列表
      catelist: [],
      // 总数据条数
      total: 0,
      // 添加分类对话框
      addDialogVisible: false,
      // 添加分类form
      addCateForm: {
        // 分类名称	不能为空
        cat_name: "",
        // 分类父 ID	不能为空，如果要添加1级分类，则父分类Id应该设置为 0
        cat_pid: 0,
        // 分类层级	不能为空，0表示一级分类；1表示二级分类；2表示三级分类
        cat_level: 0
      },
      // 添加分类规则
      addCateFormRule: {
        cat_name: [
          {
            required: true,
            message: "请输入分类名称",
            trigger: "blur"
          }
        ]
      },
      // 添加分类下拉框
      parentCateList: [],
      // 下拉框选择项
      cascaderSelect: [],
      // 下拉框prop配置
      cascaderProps: {
        expandTrigger: "hover",
        value: "cat_id",
        label: "cat_name",
        children: "children"
      },
      //编辑分类是否显示
      editDialogVisible: false,
      // 编辑分类form
      editCateForm: {
        cat_id: null,
        // 分类名称	不能为空
        cat_name: ""
      },
      // 编辑分类规则
      editCateFormRule: {
        cat_name: [
          {
            required: true,
            message: "请输入分类名称",
            trigger: "blur"
          }
        ]
      }
    }
  },
  methods: {
    // 获取商品分类数据
    getCateList() {
      // let { data: res } = await this.$http.get("categories", {
      //   params: this.querInfo
      // })

      // if (res.meta.status !== 200) {
      //   return this.$message.error("获取商品分类失败")
      // }
      // // console.log(res.data)
      // this.catelist = res.data.result
      // this.total = res.data.total
      this.$api.cate.GetCateList(this.querInfo).then(res => {
        this.catelist = res.data.result
        this.total = res.data.total
      }).catch(err => {
        return this.$message.error("获取商品分类失败")
      })
    },
    // pagesize改变事件
    handleSizeChange(newSize) {
      this.querInfo.pagesize = newSize
      this.getCateList()
    },
    // pagenum改变事件
    handleCurrentChange(newPagenum) {
      this.querInfo.pagenum = newPagenum
      this.getCateList()
    },
    // 打开创建分类对话框
    OpenCreateDialog() {
      this.getParentCateList()
      this.addDialogVisible = true
    },
    // 获取父级分类的数据
    getParentCateList() {
      // let { data: res } = await this.$http.get("categories", {
      //   params: { type: 2 }
      // })

      // if (res.meta.status !== 200) {
      //   return this.$message.error("获取分类数据失败")
      // }
      // // console.log(res.data)
      // this.parentCateList = res.data

      this.$api.cate.GetCateList({
        params: { type: 2 }
      }).then(res => {
        this.parentCateList = res.data
      }).catch(err => {
        return this.$message.error("获取分类数据失败")
      })
    },
    // 下拉框选择事件
    handleChange() {
      // 如果选中数组中的length大于0，证明有选中
      if (this.cascaderSelect.length > 0) {
        // 设置父级分类的id
        this.addCateForm.cat_pid = this.cascaderSelect[
          this.cascaderSelect.length - 1
        ]
        // 设置当前分类的等级
        this.addCateForm.cat_level = this.cascaderSelect.length
      } else {
        this.addCateForm.cat_pid = 0
        this.addCateForm.cat_level = 0
      }
    },
    // 添加分类提交
    addCateDialogSubmit() {
      this.$refs.addCateFormRef.validate(async vaild => {
        // let { data: res } = await this.$http.post(
        //   "categories",
        //   this.addCateForm
        // )

        // if (res.meta.status !== 201) {
        //   return this.$message.error("添加分类失败")
        // }

        // this.$message.success("添加分类成功")
        // this.getCateList()
        // this.addDialogVisible = false

        await this.$api.cate.AddCate(this.addCateForm).then(res => {
          this.$message.success("添加分类成功")
          this.getCateList()
          this.addDialogVisible = false
        }).catch(err => {
          return this.$message.error("添加分类失败")
        })
      })
    },
    // 关闭添加分类对话框事件
    closeAddCateDialog() {
      this.$refs.addCateFormRef.resetFields()
      this.cascaderSelect = []
      this.addCateForm.cat_pid = 0
      this.addCateForm.cat_level = 0
    },
    // 打开编辑分类对话框
    OpenEditDialog(id) {
      // let { data: res } = await this.$http.get("categories/" + id)

      // if (res.meta.status !== 200) {
      //   return this.$message.error("获取分类失败")
      // }

      // this.editCateForm = res.data

      // this.editDialogVisible = true

      this.$api.cate.GetCateInfo(id).then(res => {
        this.editCateForm = res.data
        this.editDialogVisible = true
      }).catch(err => {
        return this.$message.error("获取分类失败")
      })
    },
    // 编辑分类提交
    editCateFormSubmit() {
      this.$refs.editCateFormRef.validate(async vaild => {
        // let {
        //   data: res
        // } = await this.$http.put(`categories/${this.editCateForm.cat_id}`, {
        //   cat_name: this.editCateForm.cat_name
        // })

        // if (res.meta.status !== 200) {
        //   return this.$message.error("编辑分类失败")
        // }

        // this.$message.success("编辑分类成功")
        // this.getCateList()
        // this.editDialogVisible = false

        await this.$api.cate.EditCate(this.editCateForm.cat_id,{
          cat_name: this.editCateForm.cat_name
        }).then(res => {
          this.$message.success("编辑分类成功")
          this.getCateList()
          this.editDialogVisible = false
        }).catch(err => {
          return this.$message.error("编辑分类失败")
        })
      })
    },
    // 关闭编辑分类对话框事件
    editDialogClose() {
      this.$refs.editCateFormRef.resetFields()
      this.editCateForm.cat_id = null
      this.editDialogVisible = false
    },
    // 删除分类byid
    DeleteCateById(id) {
      this.$confirm("此操作将删除此分类, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async result => {
          if (result === "confirm") {
            // const { data: res } = await this.$http.delete("categories/" + id)

            // if (res.meta.status !== 200) {
            //   return this.$message.error("删除分类失败！")
            // }
            // this.$message({
            //   type: "success",
            //   message: "删除成功!"
            // })
            // this.getCateList()

            await this.$api.cate.DelCate(id).then(res => {
              this.$message({
                type: "success",
                message: "删除成功!"
              })
              this.getCateList()
            }).catch(err => {
              this.$message.error("删除分类失败！")
            })
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
    }
  },
  created() {
    this.getCateList()
  }
}
</script>

<style lang="less" scoped>
.el-cascader {
  width: 100%;
}
</style>