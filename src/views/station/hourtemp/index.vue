<!--通过站点查询气象信息-->
<template>
  <div class="wrap">
    <!--查询站点-->
    <div class="select">
      <!--日历-->
      <date-select :picker-type="1" class="btn date-picker" @sendDate="showChild"/>
      <el-select v-model="value" class="btn" placeholder="选择站点" @click="getValue($event)">
        <el-option v-for="(station, index) in stationList" v-if="stationList.length > 0" :value="station">{{ station
          }}
        </el-option>
      </el-select>
      <el-button class="btn" type="primary" icon="el-icon-search" @click="queryWea">查询</el-button>
      <el-button class="btn" @click="querySeven()">未来24小时</el-button>
      <el-button class="btn" @click="querySeven()">未来24-48小时</el-button>
    </div>
    <!--Echart图表-->
    <div id="chart" class="chart"></div>
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
        tempList: [],
        tempMaxList: [], // 每小时最高温度
        tempMinList: [] // 每小时最低温度
      }
    },
    mounted() {
      if (this.$route.query.stationName !== undefined) {
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
          if (res.status === 200) {
            const resList = res.data.result
            resList.forEach((item) => {
              this.stationList.push(item.Station_name)
            })
          }
        })
      },
      queryWea() {
        this.tempList = []
        this.tempMaxList = []
        this.tempMinList = []

        const param = {
          'stationName': this.value,
          'month': this.month,
          'day': this.day
        }
        console.log(param)
        axios.get('http://localhost:3000/stations/hourWea', { params: param }).then(res => {
          this.currentStation = this.value
          if (res.status === 200) {
            const arr = res.data.result
            arr.forEach((item) => {
              this.tempList.push(item.TEM)
              this.tempMaxList.push(item.TEM_Max)
              this.tempMinList.push(item.TEM_Min)
            })
            this.initChart()
          }
        })
      },
      // 初始化图表
      initChart() {
        // 获取站点每小时气温，图表
        const tempChart = document.getElementById('chart')
        const myTempChart = echarts.init(tempChart)
        // myTempChart.clear();
        myTempChart.setOption({
          title: {
            text: `${this.currentStation}每小时气温`,
            subtext: '0-23h'
          },
          tooltip: {
            trigger: 'axis'
          },
          legend: {
            data: ['每小时最高气温', '每小时平均气温', '每小时最低气温']
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
              formatter: '{value} °C'
            }
          },
          series: [
            {
              name: '每小时最高气温',
              type: 'line',
              data: this.tempMaxList,
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
            },
            {
              name: '每小时平均气温',
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
            },
            {
              name: '每小时最低气温',
              type: 'line',
              data: this.tempMinList,
              markPoint: {
                data: [
                  { name: '周最低', value: -2, xAxis: 1, yAxis: -1.5 }
                ]
              },
              markLine: {
                data: [
                  { type: 'average', name: '平均值' },
                  [{
                    symbol: 'none',
                    x: '90%',
                    yAxis: 'max'
                  }, {
                    symbol: 'circle',
                    label: {
                      normal: {
                        position: 'start',
                        formatter: '最大值'
                      }
                    },
                    type: 'max',
                    name: '最高点'
                  }]
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
