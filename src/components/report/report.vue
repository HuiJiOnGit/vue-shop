<template>
    <div>
        <!-- 面包屑部分 -->
        <bread title1='报表管理' title2='报表'></bread>

        <!-- 卡片视图区域 -->
        <el-card>
            <!-- 2. 为ECharts准备一个具备大小（宽高）的Dom -->
            <div id="main" style="width: 750px;height:400px;"></div>
        </el-card>
    </div>
</template>

<script>
    import Bread from '../common/Breadcrumb.vue'
    // 1. 导入 echarts
    import echarts from 'echarts'
    import _ from 'lodash'
    export default {
        components: {
            'bread': Bread
        },
        data() {
            return {
                // 需要合并的数据
                options: {
                    title: {
                        text: '用户来源'
                    },
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'cross',
                            label: {
                                backgroundColor: '#E9EEF3'
                            }
                        }
                    },
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        containLabel: true
                    },
                    xAxis: [{
                        boundaryGap: false
                    }],
                    yAxis: [{
                        type: 'value'
                    }]
                }
            }
        },
        methods: {

        },
        created() {

        },
        mounted() {
            // 基于准备好的dom，初始化echarts实例
            var myChart = echarts.init(document.getElementById('main'));
            // 指定图表的配置项和数据
            var option = {
                title: {
                    text: 'ECharts 入门示例'
                },
                tooltip: {},
                legend: {
                    data: ['销量']
                },
                xAxis: {
                    data: ["衬衫", "羊毛衫", "雪纺衫", "裤子", "高跟鞋", "袜子"]
                },
                yAxis: {},
                series: [{
                    name: '销量',
                    type: 'bar',
                    data: [5, 20, 36, 10, 10, 20]
                }]
            };

            this.$api.report.Report1().then(res => {
                const result = _.merge(res.data, this.options)
                // 使用刚指定的配置项和数据显示图表。
                myChart.setOption(result);
            }).catch(err => {
                console.log(err)
            })

            // 使用刚指定的配置项和数据显示图表。
            // myChart.setOption(option);
        },
    }
</script>

<style lang="less" scoped>

</style>