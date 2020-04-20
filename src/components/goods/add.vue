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
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="150px" label-position="top">
        <el-tabs tab-position="left" v-model="activeStep" :before-leave="beforeTabLeave" @tab-click="tabClicked">
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
              <el-cascader v-model="addForm.goods_cat" :options="catelist" :props="cateProps" @change="handleChange"
                clearable></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <!-- 渲染表单的item项 -->
            <el-form-item v-for="item in manyTableData" :key="item.attr_id" :label="item.attr_name">
              <!-- 复选框 -->
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox :label="cb" v-for="(cb, i) in item.attr_vals" :key="i" border ></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <!-- 渲染表单的item项 -->
            <el-form-item v-for="item in onlyTableData" :key="item.attr_id" :label="item.attr_name">
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <el-upload
              :action="picUrl"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :file-list="fileList"
              list-type="picture"
              :headers="headerOptions"
              :on-success="handleSuccess">
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <!-- 富文本编辑器 -->
            <quill-editor v-model="addForm.goods_introduce"></quill-editor>
            <!-- 添加商品按钮 -->
            <el-button type="primary" class="btnadd" @click="addGood" v-if="isAddOrEdit">添加商品</el-button>
            <el-button type="primary" class="btnadd" @click="editGood" v-else>编辑商品</el-button>
          </el-tab-pane>          
        </el-tabs>
      </el-form>
    </el-card>

    <!-- 图片预览 -->
    <el-dialog
      title=""
      :visible.sync="previewVisible"
      width="50%">
        <img :src="previewPath" alt="" class="previewImg">
    </el-dialog>
  </div>
</template>

<script>
  import Bread from "../common/Breadcrumb.vue"
  import unit from '../../unit/arrayUniq.js'
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
          goods_price: 0,
          // 数量
          goods_number: 0,
          // 重量
          goods_weight: 0,
          // 介绍
          goods_introduce: "",
          // 上传的图片临时路径（对象）
          pics: [],
          // 商品的参数（数组），包含 动态参数 和 静态属性
          attrs: [],
          // 以为','分割的分类列表
          goods_cat: []
        },
        // add表单规则
        addFormRules: {
          goods_name: [{
            required: true,
            message: "不能为空",
            trigger: "blur"
          }],
          goods_price: [{
            required: true,
            message: "不能为空",
            trigger: "blur"
          }],
          goods_cat: [{
            required: true,
            message: "不能为空",
            trigger: "blur"
          }],
          goods_number: [{
            required: true,
            message: "不能为空",
            trigger: "blur"
          }],
          goods_weight: [{
            required: true,
            message: "不能为空",
            trigger: "blur"
          }],
          goods_introduce: [],
          pics: [],
          attrs: []
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
        cateSelectValue: [],
        // 动态参数列表数据
        manyTableData: [],
        // 静态属性列表
        onlyTableData: [],
        // 图片上传地址
        // picUrl: 'http://47.115.124.102:8888/api/private/v1/upload',
        picUrl: 'http://127.0.0.1:8888/api/private/v1/upload',
        //upload组件上传header设置
        headerOptions: {
          Authorization: window.sessionStorage.getItem('token')
        },
        // 文件列表
        fileList: [],
        // 图片预览对话框
        previewVisible :false,
        // 图片预览地址
        previewPath: '',
        // 判断是添加true还是编辑false
        isAddOrEdit: true,
        // 当前商品id
        goodId: null        
      }
    },
    methods: {
      // 获取商品分类数据
      getCateList() {
        // let { data: res } = await this.$http.get("categories")
        // if (res.meta.status !== 200) {
        //   return this.$message.error("获取商品分类失败")
        // }
        // this.catelist = res.data
        this.$api.cate.GetCateList().then(res => {
          this.catelist = res.data
        }).catch(err => {
          return this.$message.error("获取商品分类失败")
        })
      },
      // 获取商品详情
      getGoodInfo(id){
        this.$api.goods.GetGoodsInfo(id).then(res => {

          // 普通input赋值
          this.addForm.goods_name = res.data.goods_name;
          this.addForm.goods_price = res.data.goods_price;
          this.addForm.goods_number = res.data.goods_number;
          this.addForm.goods_weight = res.data.goods_weight;

          // 对分类下拉框赋值
          let cat = res.data.goods_cat.split(',')
          for (let i = 0; i < cat.length; i++) {
            cat[i] = Number(cat[i])            
          }
          this.addForm.goods_cat = cat

          // 对静态和动态赋值
          let newattr = unit(res.data.attrs,'attr_id')
          newattr.forEach(item => {            
            if(item.attr_sel === 'many'){
              item.attr_vals = item.attr_vals.length === 0 ? [] : item.attr_vals.split(' ');
              this.manyTableData.push(item);
            }else if (item.attr_sel === 'only') {
              this.onlyTableData.push(item);
            }
          });

          // 对图片上传控件赋值
          this.addForm.pics = res.data.pics;
          res.data.pics.forEach(item => {
            let picinfo = {name: `${item.pics_id}号图片`, url: item.pics_big}
            this.fileList.push(picinfo);
          });          

          // 对富文本赋值
          this.addForm.goods_introduce = res.data.goods_introduce;

          this.$message.success("获取商品成功");
        }).catch(err => {
          console.log(err)
        })
      },
      // 级联选择框change事件
      handleChange() {
        if (this.addForm.goods_cat.length !== 3) {
          this.addForm.goods_cat = [];
        }
      },
      // 在tab离开事件
      beforeTabLeave(newTab, oldTab) {
        if (this.addForm.goods_cat.length !== 3 && oldTab === '0') {
          this.$message.error('先选择商品分类');
          return false;
        }
      },
      // el-tabs切换点击事件
      tabClicked() {
        // 证明访问的是动态参数列表
        if (this.activeStep === '1' && this.isAddOrEdit) {
          this.$api.cate.GetCateAttrList(this.cateId,{sel: 'many'}).then(res => {
            res.data.forEach(ele => {
              ele.attr_vals = ele.attr_vals.length === 0 ? [] : ele.attr_vals.split(' '); 
            });
            this.manyTableData = res.data
          }).catch(err =>{
            this.$message.error('获取动态参数失败')
          })
        } else if(this.activeStep === '2' && this.isAddOrEdit){
          this.$api.cate.GetCateAttrList(this.cateId,{sel: 'only'}).then(res => {
            this.onlyTableData = res.data;
          }).catch(err =>{
            this.$message.error('获取静态参数失败')
          })
        }
      },
      // 处理图片预览效果
      handlePreview(file) {
        if ('response' in file) {
          this.previewPath = file.response.data.url;
        }else{
          this.previewPath = file.url;
        }
        this.previewVisible = true;
      },
      // 处理移除图片的操作
      handleRemove(file){
        // 获取图片临时路劲
        const filePath = file.response.data.tmp_path;
        // 获取索引
        const i = this.addForm.pics.findIndex(x => x.pic === filePath);
        // 从数组中去除
        this.addForm.pics.splice(i,1);
      },
      // 文件上传成功回调事件
      handleSuccess(res) {
        console.log(res);
        // 拼接得到一个图片的信息对象
        let picInfo = {pic: res.data.tmp_path}
        // 将图片信息对象，push到pics数组中
        this.addForm.pics.push(picInfo)
      },
      // 添加商品
      addGood() {
        this.$refs.addFormRef.validate(async valid => {
          if (!valid) {
            return this.$message.error('有东西没填');
          }
          // 处理静态和动态属性
          this.manyTableData.forEach(item => {
            let info = {
              attr_id: item.attr_id,
              attr_vals: item.attr_vals
            };
            this.addForm.attrs.push(info);
          });
          this.onlyTableData.forEach(item => {
            let info = {
              attr_id: item.attr_id,
              attr_vals: item.attr_vals
            };
            this.addForm.attrs.push(info);
          });
          //深拷贝处理下addform
          let newform = JSON.parse(JSON.stringify(this.addForm));
          newform.goods_cat = newform.goods_cat.join(',');
          //添加商品
          await this.$api.goods.AddGood(newform).then(res => {
            this.$message.success('添加商品成功');
            this.$router.push('/goods');
          }).catch(err => {
            console.log(err);
            this.$message.error('添加商品失败');
          })
        })
      },
      // 修改商品
      editGood(){
        this.$refs.addFormRef.validate(async valid => {
          if(!valid){
            return this.$message.error('有东西没填？');
          }
          // 处理静态和动态属性
          this.manyTableData.forEach(item => {
            let info = {
              attr_id: item.attr_id,
              attr_vals: item.attr_vals
            };
            this.addForm.attrs.push(info);
          });
          this.onlyTableData.forEach(item => {
            let info = {
              attr_id: item.attr_id,
              attr_vals: item.attr_vals
            };
            this.addForm.attrs.push(info);
          });

          //深拷贝处理下addform
          let newform = JSON.parse(JSON.stringify(this.addForm));
          newform.goods_cat = newform.goods_cat.join(',');
          console.log(this.addForm.pics)
          console.log(this.fileList)
          // 1、判断编辑的类型，没有图片
          if (this.addForm.pics.length === 0 || this.addForm.pics.length === this.fileList.length) {
            // 没有图片则调用普通更新接口
            console.log('调用普通更新接口');
            this.$api.goods.EditGood(this.goodId,newform).then(res => {
              this.$message.success('已更新商品');
              this.$router.push('/goods');
            }).catch(err => {
              console.log(err);
              // this.$message.error(err.meta.msg);
            })
          }else if (this.addForm.pics.length !== this.fileList.length) {
            // 如果addform的文件数和取回的文件数不一致，则是有新增，需要调用更新图片接口    
            console.log('调用图片更新接口');        
            this.$api.goods.EditGoodAndPic(this.goodId,newform).then(res => {
              this.$message.success('已更新商品');
              this.$router.push('/goods');
            }).catch(err => {
              console.log(err);
              // this.$message.error(err.meta.msg);
            })
          }
          console.log('编辑完成');
        })
      }
    },
    created() {
      this.getCateList();
      if (this.$route.query.goodId === null || this.$route.query.goodId === undefined) {
        console.log('进入的是添加页面')
        this.isAddOrEdit = true;
      }else{
        console.log('进入的是编辑页面')
        this.isAddOrEdit = false;
        this.goodId = this.$route.query.goodId;
        this.getGoodInfo(this.$route.query.goodId);
      }
      
    },
    computed: {
      cateId() {
        return this.addForm.goods_cat.length === 3 ? this.addForm.goods_cat[2] : null
      }
    },
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
  .el-checkbox{
    margin: 0 10px 0 0 !important;
  }

  .previewImg{
    width: 100%; 
  }
  .ql-container.ql-snow {
    min-height: 300px !important;
  }
  .btnadd{
    margin-top: 15px;
  }
</style>