<!--通过站点查询气象信息-->
<template>
  <div class="wrap">
    <!--查询站点-->
    <div class="select">
      <!--日历-->
      <date-select :picker-type="1" class="btn date-picker" @sendDate="showChild" />
      <el-select v-model="value" class="btn" placeholder="选择站点" @click="getValue($event)">
        <el-option v-for="(station, index) in stationList" v-if="stationList.length > 0" :value="station">{{ station }}</el-option>
      </el-select>
      <el-button class="btn" type="primary" icon="el-icon-search" @click="queryWea">查询</el-button>
      <el-button class="btn" @click="querySeven()">未来24小时</el-button>
      <el-button class="btn" @click="querySeven()">未来24-48小时</el-button>
    </div>
    <!--Echart图表-->
    <div id="rain-chart" class="chart"></div>
  </div>
</template>

<script>
  import axios from 'axios'
  import DateSelect from '@/components/Dateselect' // 引入日历组件
  import echarts from 'echarts'
  import { formatDate } from '@/utils/util'

  export default {
    name: 'StationQuery',
    components: {
      DateSelect
    },
    data() {
      return {
        // year: new Date().getFullYear(),
        // month: new Date().getMonth() + 1,
        // day: new Date().getDate(),
        year: 2019,
        month: 6,
        day: 27,
        value: '金川',
        currentStation: '金川',
        stationList: [],
        rainList: []
      }
    },
    mounted() {
      if(this.$route.query.stationName !== undefined) {
        this.value = this.$route.query.stationName
      }
      console.log(this.value)
      this.getStation()
      this.queryWea()
    },
    methods: {
      showChild(date) {
        date = formatDate(date)
        console.log(date)
        this.year = date.year
        this.month = date.month
        this.day = date.day
      },
      // 获取站点信息
      getStation() {
        axios.get('http://localhost:3000/stations').then((res) => {
          const resList = res.data.result
          resList.forEach((item) => {
            this.stationList.push(item.Station_name)
          })
          console.log(this.stationList)
        })
      },
      queryWea() {
        this.tempList = []
        this.tempMaxList = []
        this.tempMinList = []
        this.rainList = []

        const param = {
          'stationName': this.value,
          'month': this.month,
          'day': this.day
        }
        console.log(param)
        axios.get('http://localhost:3000/stations/hourWea', { params: param }).then(res => {
          this.currentStation = this.value
          const arr = res.data.result
          console.log(arr)
          arr.forEach((item) => {
            this.rainList.push(item.PRE_1h)
            this.tempMaxList.push(item.TEM_Max)
            this.tempMinList.push(item.TEM_Min)
          })
          this.initChart()
        })
      },
      // 初始化图表
      initChart() {
        // 获取站点每小时降雨量，图表
        const rainChart = document.getElementById('rain-chart')
        var myRainChart = echarts.init(rainChart)
        // myRainChart.clear();
        myRainChart.setOption({
          title: {
            text: `${this.currentStation}每小时降雨量`,
            subtext: '0-23h'
          },
          tooltip: {
            trigger: 'axis'
          },
          legend: {
            data: ['最高气温', '最低气温']
          },
          toolbox: {
            show: true,
            feature: {
              dataZoom: {
                yAxisIndex: 'none'
              },
              dataView: { readOnly: false },
              magicType: { type: ['line', 'bar'] },
              restore: {},
              saveAsImage: {}
            }
          },
          xAxis: {
            type: 'category',
            boundaryGap: false,
            data: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23]
          },
          yAxis: {
            type: 'value',
            axisLabel: {
              formatter: '{value} mm'
            }
          },
          series: [
            {
              name: '降雨量',
              type: 'line',
              data: this.rainList,
              itemStyle: {
                normal: {
                  color: '#386db3',//折线点的颜色
                  lineStyle: {
                    color: '#386db3' //折线的颜色
                  }
                }
              },
              markPoint: {
                data: [
                  { type: 'max', name: '最大值' },
                  { type: 'min', name: '最小值' }
                ]
              },
              markLine: {
                data: [
                  { type: 'average', name: '平均值' }
                ]
              }
            }
          ]
        })
      }
    }
  }
</script>

<style lang="stylus" scoped>
  .wrap
    padding 10px
    width 100%
    height 100%
    overflow hidden
    box-sizing border-box
    .btn
      margin-right 10px
    .select
      display flex
    .chart
      width 100%
      height 700px
      margin-top 50px
</style>
