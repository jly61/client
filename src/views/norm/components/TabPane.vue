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
      prop="min_temp"
      label="最低温度(℃)"
      width="180">
    </el-table-column>
    <el-table-column
      prop="suit"
      label="适宜温度(℃)">
    </el-table-column>
    <el-table-column
      prop="max_temp"
      label="最高温度(℃)">
    </el-table-column>
  </el-table>
</template>

<script>
  // import { fetchList } from '@/api/article'
  import axios from 'axios'

  export default {
    // props: {
    //   listType: {
    //     type: String
    //   }
    // },
    data() {
      return {
        list: [],
        listType: '',
        riceList: [],
        wheatList: [],
        cornList: [],
      }
    },
    mounted() {
      this.listType = this.$route.query.tab
      if (this.listType === 'rice') {
        this.getRice()
      } else if (this.listType === 'wheat') {
        this.getWheat()
      } else {
        this.getCorn()
      }
    },
    methods: {
      getRice() {
        axios.get('http://localhost:3000/rices').then(res => {
          if (res.status === 200) {
            this.list = res.data.result
            console.log(1)
            console.log(this.list)
          }
        })
      },
      getWheat() {
        axios.get('http://localhost:3000/wheats').then(res => {
          if (res.status === 200) {
            this.list = res.data.result
            console.log(2)
            console.log(this.list)
          }
        })
      },
      getCorn() {
        axios.get('http://localhost:3000/corns').then(res => {
          if (res.status === 200) {
            console.log(res.data.result)
            this.list = res.data.result
            console.log(3)
            console.log(this.list)
          }
        })
      }
    }
  }
</script>

