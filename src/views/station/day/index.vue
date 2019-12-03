<!--通过站点查询日气象信息-->
<template>
  <div class="wrap">
    <!--查询站点-->
    <div class="select">
      <!--日历-->
      <date-select :picker-type="2" class="btn date-picker" @sendDate="showChild" />
      <el-select v-model="value" class="btn" :picker-type="2" placeholder="选择站点" @click="getValue($event)">
        <el-option v-for="(station, index) in stationList" v-if="stationList.length > 0" :value="station">{{ station }}</el-option>
      </el-select>
      <el-button class="btn" type="primary" icon="el-icon-search" @click="queryWea">查询</el-button>
    </div>
    <!--Echart图表-->
    <div id="chart" class="chart" />
    <div id="rain-chart" class="chart" />
  </div>
</template>

<script>
import axios from 'axios'
import DateSelect from '@/components/Dateselect' // 引入日历组件
import echarts from 'echarts'
import { formatDate } from '@/utils/util'

export default {
  name: 'StationDayWeather',
  components: {
    DateSelect
  },
  data() {
    return {
      date: {
        startMonth: 6,
        startDay: 26,
        endMonth: 6,
        endDay: 30
      },
      value: '金川',
      currentStation: '金川',
      stationList: [],
      tempList: [],
      rainList: [],
      dateList: []
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.getStation()
      this.queryWea()
    })
  },
  methods: {
    showChild(date) {
      this.date = formatDate(date)
    },
    // 获取站点信息
    getStation() {
      axios('http://localhost:3000/stations').then((res) => {
        const resList = res.data.result
        resList.forEach((item) => {
          this.stationList.push(item.Station_name)
        })
      })
    },
    // 获取站点天气
    queryWea() {
      const param = {
        'stationName': this.value,
        'startMonth': this.date.startMonth,
        'startDay': this.date.startDay,
        'endMonth': this.date.endMonth,
        'endDay': this.date.endDay
      }
      console.log(param)
      axios.get('http://localhost:3000/stations/dayWea', { params: param }).then(res => {
        this.tempList = []
        this.rainList = []
        this.dateList = []

        this.currentStation = this.value
        const arr = res.data.result
        console.log(arr)
        arr.forEach((item) => {
          this.tempList.push(item.avgTemp.toFixed(2))
          this.rainList.push(item.totalPre.toFixed(2))
          this.dateList.push(item._id)
        })
        this.initChart()
      })
    },
    // 初始化图表
    initChart() {
      // //获取站点每小时气温，图表
      const tempChart = document.getElementById('chart')
      var myTempChart = echarts.init(tempChart)
      myTempChart.setOption({
        title: {
          text: '石渠县气温',
          subtext: '24小时'
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: ['每小时最高气温', '日平均气温', '每小时最低气温']
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
          data: this.dateList
        },
        yAxis: {
          type: 'value',
          axisLabel: {
            formatter: '{value} °C'
          }
        },
        series: [
          {
            name: '日平均气温',
            type: 'line',
            data: this.tempList,
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

      // 获取站点每小时降雨量，图表
      const rainChart = document.getElementById('rain-chart')
      var myRainChart = echarts.init(rainChart)
      myRainChart.setOption({
        title: {
          text: '石渠县降雨量',
          subtext: '24小时'
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: ['日降雨量']
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
          data: this.dateList
        },
        yAxis: {
          type: 'value',
          axisLabel: {
            formatter: '{value} mm'
          }
        },
        series: [
          {
            name: '日降雨量',
            type: 'line',
            data: this.rainList,
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
            height 400px
            margin-top 20px
</style>
