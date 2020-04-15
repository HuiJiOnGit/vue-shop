<template>
  <div>
    <!-- 面包屑部分 -->
    <bread title1="商品管理" title2="商品参数"></bread>

    <!-- 卡片部分 -->
    <el-card>
      <el-alert title="注意：只允许第三级分类设置相关参数！" type="warning" show-icon></el-alert>

      <!-- 选择商品分类区域 -->
      <el-row class="cat_opt">
        <el-col class="cat_col1">
          <span>选择商品分类：</span>
          <!-- 选择商品分类的级联选择框 -->
          <el-cascader
            v-model="cateSelectValue"
            :options="catelist"
            :props="cateProps"
            @change="handleChange"
            clearable
          ></el-cascader>
        </el-col>
      </el-row>

      <!-- tabs -->
      <el-tabs v-model="activeName" @tab-click="handleTabClick">
        <el-tab-pane label="动态参数" name="many">
          <el-button
            type="primary"
            size="medium"
            :disabled="isBtnDisable"
            @click="addParamsDialogVisible = true"
          >添加动态参数</el-button>
          <el-table :data="manyTableData" border stripe>
            <el-table-column type="expand">
              <template v-slot:default="scope">
                <!-- 循环生成tag -->
                <el-tag v-for="(item,key) in scope.row.attr_vals" :key="key" closable>{{item}}</el-tag>
                <!-- 生成添加按钮 -->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)">
                </el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>

              </template>
            </el-table-column>
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column label="参数名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template v-slot:default="scope">
                <el-button size="mini" type="primary" icon="el-icon-edit" @click="OpenEditDialog(scope.row.attr_id)">编辑</el-button>
                <el-button size="mini" type="danger" icon="el-icon-delete" @click="DeleteParamsById(scope.row.attr_id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="only">
          <el-button
            type="primary"
            size="medium"
            :disabled="isBtnDisable"
            @click="addParamsDialogVisible = true"
          >添加静态属性</el-button>
          <el-table :data="onlyTableData" border stripe>
            <el-table-column type="expand">
              <template v-slot:default="scope">
                <el-tag v-for="(item,key) in scope.row.attr_vals" :key="key" closable>{{item}}</el-tag>
              </template>
            </el-table-column>
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column label="参数名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template v-slot:default="scope">
                <el-button size="mini" type="primary" icon="el-icon-edit" @click="OpenEditDialog(scope.row.attr_id)">编辑</el-button>
                <el-button size="mini" type="danger" icon="el-icon-delete" @click="DeleteParamsById(scope.row.attr_id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!-- 添加分类对话框 -->
    <el-dialog :title="'添加' + Title" :visible.sync="addParamsDialogVisible" width="30%" @close="AddDialogClose">
      <el-form label-position="left" label-width="80px" :model="AddForm" :rules="AddRules" ref="AddRef">
        <el-form-item :label="Title" prop="attr_name">
          <el-input v-model="AddForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addParamsDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="AddParams">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑分类对话框 -->
    <el-dialog :title="'编辑' + Title" :visible.sync="editParamsDialogVisible" width="30%" @close="editDialogClose">
      <el-form label-position="left" label-width="80px" :model="editForm" :rules="editRules" ref="editRef">
        <el-form-item :label="Title" prop="attr_name">
          <el-input v-model="editForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editParamsDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editParams">确 定</el-button>
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
      // 级联选择框数据源
      catelist: [],
      // 级联选择框选中数组
      cateSelectValue: [],
      // 级联选择配置
      cateProps: {
        value: "cat_id",
        label: "cat_name",
        children: "children",
        expandTrigger: "hover"
        // emitPath: false
      },
      // tab选中值
      activeName: "many",
      // 动态参数数据
      manyTableData: [],
      // 静态属性数据
      onlyTableData: [],
      // 新增参数对话框
      addParamsDialogVisible: false,
      // 添加参数form
      AddForm: {
        attr_name: ''
      },
      // 添加参数rules
      AddRules: {
        attr_name: [{
          required: true,
          message: '不能为空',
          trigger: 'blur'
        }]
      },
      // 编辑参数对话框
      editParamsDialogVisible: false,
      // 编辑参数form
      editForm: {
        attr_id: '',
        attr_name: ''
      },
      // 编辑参数rules
      editRules: {
        attr_name: [{
          required: true,
          message: '不能为空',
          trigger: 'blur'
        }]
      },
    }
  },
  computed: {
    // tabs按钮是否可用
    isBtnDisable() {
      return this.cateSelectValue.length !== 3
    },
    // cateId
    cateId() {
      if (this.cateSelectValue.length === 3) {
        return this.cateSelectValue[2]
      }
      return null
    },
    Title() {
      return this.activeName === "many" ? "动态参数" : "静态属性"
    }
  },
  methods: {
    // 获取商品分类数据
    async getCateList() {
      let { data: res } = await this.$http.get("categories")

      if (res.meta.status !== 200) {
        return this.$message.error("获取商品分类失败")
      }
      // console.log(res.data)
      this.catelist = res.data
    },
    // 级联选择框change事件
    handleChange() {
      this.getParamsData()
    },
    // tab选中事件
    handleTabClick() {
      this.getParamsData()
    },
    // 获取参数列表数据
    async getParamsData() {
      if (this.cateSelectValue.length !== 3) {
        this.cateSelectValue = []
        return
      }

      let { data: res } = await this.$http.get(
        `categories/${this.cateId}/attributes`,
        {
          params: { sel: this.activeName }
        }
      )

      if (res.meta.status !== 200) {
        return this.$message.error("获取参数列表失败")
      }

      //分割数组
      res.data.forEach(element => {
        element.attr_vals = element.attr_vals ? element.attr_vals.split(' ') : [] ;
        element.inputValue = '';
        element.inputVisible = false
      });

      if (this.activeName === "many") {
        this.manyTableData = res.data
      } else {
        this.onlyTableData = res.data
      }
    },
    // 关闭添加对话框事件
    AddDialogClose(){
      this.$refs.AddRef.resetFields();
    },
    // 添加参数
    AddParams(){
      this.$refs.AddRef.validate(async valid => {
        if(!valid) return
        let {data: res} = await this.$http.post(`categories/${this.cateId}/attributes`,{
          attr_name: this.AddForm.attr_name,
          attr_sel: this.activeName
        })
        if (res.meta.status !== 201) {
          return this.$message.error('添加参数失败')
        }

        this.$message.success('添加参数成功')
        this.addParamsDialogVisible = false;
        this.getParamsData();
      })
    },
    // 打开编辑对话框
    async OpenEditDialog(id){      
      let {data: res} = await this.$http.get(`categories/${this.cateId}/attributes/${id}`);
      if (res.meta.status !== 200) {
        return this.$message.error('查询信息失败')
      }
      this.editForm = res.data
      this.editParamsDialogVisible = true
    },
    // 编辑对话框关闭事件
    editDialogClose(){
      this.$refs.editRef.resetFields();
    },
    // 编辑对话框提交事件
    editParams(){
      this.$refs.editRef.validate(async valid => {
        if(!valid) return
        let {data: res} = await this.$http.put(`categories/${this.cateId}/attributes/${this.editForm.attr_id}`,{
          attr_name: this.editForm.attr_name,
          attr_sel: this.activeName
        })

        if (res.meta.status !== 200) {
          return this.$message.error('修改参数失败');
        }

        this.$message.success('修改参数成功')
        this.getParamsData();
        this.editParamsDialogVisible = false;
      })      
    },
    // 删除参数
    DeleteParamsById(id){
            this.$confirm("此操作将删除此参数, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async result => {
          if (result === "confirm") {
            const { data: res } = await this.$http.delete(`categories/${this.cateId}/attributes/${id}`)

            if (res.meta.status !== 200) {
              return this.$message.error("删除参数失败！")
            }
            this.$message({
              type: "success",
              message: "删除成功!"
            })
            this.getParamsData()
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
    // el-tag enter或失去焦点事件
    handleInputConfirm(row){
      if(row.inputValue.trim().length === 0){
        row.inputValue = ''
        row.inputVisible = false;
        return
      }
      row.attr_vals.push(row.inputValue.trim())
      row.inputValue = ''
      row.inputVisible = false;
    },
    // 点击添加el-tag事件
    showInput(row) {
      row.inputVisible = true;
      // 这个方法是当页面重新渲染之后，才加载的方法
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    }
  },
  created() {
    this.getCateList()
  }
}
</script>

<style lang="less" scoped>
.el-card,
.el-dialog {
  text-align: left;
}
.cat_opt {
  margin-top: 10px;
}
.cat_col1 {
  text-align: left;
}
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>