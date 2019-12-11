<template>
    <el-table
      :data="list"
      stripe
      style="width: 100%">
      <el-table-column
        prop="period"
        label="生长时期"
        width="180">
      </el-table-column>
      <el-table-column
        prop="suit"
        label="适宜度"
        width="180">
      </el-table-column>
      <el-table-column
        prop="suggest"
        label="建议措施">
      </el-table-column>
    </el-table>
</template>

<script>
  import axios from 'axios'

  export default {
    data() {
      return {
        list: [],
        listType: 'rice',
        riceList: [],
        wheatList: [],
        cornList: [],
        lon: '100.18',
        lat: '29.03',
        stationName: '稻城',
        futureTemp: '24'
      }
    },
    mounted() {
      // if(this.$route.query.stationName !== undefined) {
      //   this.lon = this.$route.query.lon
      //   this.lat = this.$route.query.lat
      //   this.stationName = this.$route.query.stationName
      // }
      // this.listType = this.$route.query.tab
      // if (this.listType === 'wheat') {
      //   this.getWheat()
      // } else if (this.listType === 'corn') {
      //   this.getCorn()
      // } else {
      //   this.getRice()
      // }
      if(this.$route.query.tab !== undefined) {
        this.listType = this.$route.query.tab
      }
      this.getRice()
    },
    methods: {
      getRice() {
        axios.get(`http://localhost:3000/${this.listType}s`).then(res => {
          console.log(res)
          if (res.status === 200) {
            res.data.result.forEach(item => {
              if(this.futureTemp < item.min_temp) {
                this.list.push({
                  'period': item.period,
                  'suit': '不适宜，温度过低，可能出现冻害',
                  'suggest': '需要增温'
                })
              } else if(this.futureTemp > item.max_temp){
                this.list.push({
                  'period': item.period,
                  'suit': '不适宜，温度过高',
                  'suggest': '需要降温'
                })
              } else if(this.futureTemp < item.suit.split('-')[0] && this.futureTemp > item.min_temp){
                this.list.push({
                  'period': item.period,
                  'suit': '较适宜，温度偏低',
                  'suggest': '可以升温'
                })
              } else if(this.futureTemp > item.suit.split('-')[1] && this.futureTemp < item.max_temp){
                this.list.push({
                  'period': item.period,
                  'suit': '较适宜，温度偏高',
                  'suggest': '可以降温'
                })
              } else {
                this.list.push({
                  'period': item.period,
                  'suit': '适宜',
                  'suggest': ''
                })
              }
            })
            console.log(this.list)
          }
        })
      },
      // getWheat() {
      //   axios.get('http://localhost:3000/wheats').then(res => {
      //     if (res.status === 200) {
      //       this.list = res.data.result
      //       console.log(this.list)
      //     }
      //   })
      // },
      // getCorn() {
      //   axios.get('http://localhost:3000/corns').then(res => {
      //     if (res.status === 200) {
      //       this.list = res.data.result
      //       console.log(this.list)
      //     }
      //   })
      // }
    }
  }
</script>

