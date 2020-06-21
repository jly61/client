<!--通过站点查询气象信息-->
<template>
  <div class="wrap">
    <!--查询站点-->
    <div class="select">
      <!--日历-->
      <date-select :picker-type="1" class="btn date-picker" @sendDate="showChild"/>
      <el-select v-model="value" class="btn" placeholder="选择站点" @click="getValue($event)">
        <el-option v-if="stationList.length > 0" v-for="(station, index) in stationList" :value="station" :key="index">
          {{ station
          }}
        </el-option>
      </el-select>
      <el-button class="btn" type="primary" icon="el-icon-search" @click="queryWea">查询</el-button>
      <el-button class="btn" @click="queryFutureTemp(48)">未来24小时</el-button>
      <el-button class="btn" @click="queryFutureTemp(48)">未来24-48小时</el-button>
    </div>
    <!--Echart图表-->
    <div id="chart" class="chart"></div>
  </div>
</template>

<script>
  import axios from 'axios'
  import DateSelect from '@/components/Dateselect' // 引入日历组件
  import echarts from 'echarts'
  import {formatDate} from '@/utils/util'

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
        lon: 102.04,
        lat: 31.29,
        stationList: [],
        timeList: [],
        windyList: [],
        rotateList: []
      }
    },
    mounted() {
      if (this.$route.query.stationName !== undefined) {
        this.value = this.$route.query.stationName
        this.lon = this.$route.query.lon
        this.lat = this.$route.query.lat
      }
      console.log(this.value)
      this.getStation()
      this.queryFutureTemp(24)
    },
    methods: {
      showChild(date) {
        date = formatDate(date)
        this.year = date.year
        this.month = date.month
        this.day = date.day
      },
      // 获取站点信息
      getStation() {
        axios.get('http://localhost:3000/stations').then((res) => {
          if (res.status === 200) {
            const resList = res.data.result
            resList.forEach((item) => {
              this.stationList.push(item.Station_name)
            })
          }
        })
      },
      // 查询单站点未来24小时、48小时天气
      queryFutureTemp(time) {
        this.windyList = []
        this.timeList = []
        this.rotateList = []

        const param = {
          'stationName': this.value
        }
        axios.get('http://localhost:3000/stations/info', {params: param}).then(res => {
          const result = res.data.result
          const lon = result.lon
          const lat = result.lat
          this.currentStation = this.value
          axios.get(`/caiyun/${lon},${lat}/hourly.json`, {params: param}).then(res => {
            if (res.status === 200) {
              const arr = res.data.result.hourly.wind
              console.log(arr)
              let i
              if (time === 48) {
                i = 24
              } else {
                i = 0
              }
              console.log(i, time)
              for (i; i < time; i++) {
                this.timeList.push(arr[i].datetime.slice(11))
                this.windyList.push(arr[i].speed)
                this.rotateList.push(arr[i].direction)
              }
              this.initChart()
            }
          })
        })
      },

      initChart() {
        // //获取站点每小时气温，图表
        const tempChart = document.getElementById('chart')
        var myTempChart = echarts.init(tempChart)

        var symbolRotateNum = this.rotateList // 旋转的度数
        // var symbolRotateNum = [90, 45, 50, 12, 10, 0, 150] // 旋转的度数
        // var valueNum = [820, 932, 901, 934, 1290, 1330, 1320] // 数值
        var valueNum = this.windyList // 数值
        var data = echarts.util.map(valueNum, function(item, index) {
          return {
            value: valueNum[index],
            symbolRotate: symbolRotateNum[index]
          }
        })
        myTempChart.setOption({
          title: {
            text: `${this.currentStation}每小时风速风向`
          },
          tooltip: {
            trigger: 'axis'
          },
          legend: {
            data: ['每小时风速风向']
          },
          xAxis: {
            type: 'category',
            data: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23]
          },
          yAxis: {
            type: 'value',
            min: 0,
            max: 18,
            axisLabel: {
              formatter: '{value} m/s'
            }
          },
          series: [{
            data: data,
            type: 'line',
            symbol: 'triangle',
            itemStyle: {
              normal: {
                color: '#1296db',
                lineStyle: {
                  color: '#b5b5b6'
                }
              }
            },
            // symbol: 'data:image/png;base64,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',
            symbolSize: '20'
          }]
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
