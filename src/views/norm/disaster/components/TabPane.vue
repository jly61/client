<template>
  <el-table
    :data="list"
    stripe
    style="width: 100%">
    <el-table-column
      prop="index"
      label="序号"
      width="180">
    </el-table-column>
    <el-table-column
      prop="level"
      label="预警等级"
      width="180">
    </el-table-column>
    <el-table-column
      prop="rule"
      label="指标"
    >
    </el-table-column>
  </el-table>
</template>

<script>
  // import axios from 'axios'

  export default {
    data() {
      return {
        list: [],
        listType: '',
        frostList: [
          {
            index: 1,
            level: '蓝色预警',
            rule: '48小时内地面最低温度将要下降到0℃以下，或者已经降到0℃以下'
          },
          {
            index: 2,
            level: '黄色预警',
            rule: '24小时内地面最低温度将要下降到零下3℃以下，或者已经降到零下3℃以下'
          },
          {
            index: 3,
            level: '橙色预警',
            rule: '24小时内地面最低温度将要下降到零下5℃以下，或者已经降到零下5℃以下'
          }
        ],
        rainList: [
          {
            index: 1,
            level: '蓝色预警',
            rule: '12小时内降雨量将达50毫米以上，或者已达50毫米以上且降雨可能持续'
          },
          {
            index: 2,
            level: '蓝色预警',
            rule: '6小时内降雨量将达50毫米以上，或者已达50毫米以上且降雨可能持续'
          },
          {
            index: 3,
            level: '蓝色预警',
            rule: '3小时内降雨量将达50毫米以上，或者已达50毫米以上且降雨可能持续'
          },
          {
            index: 4,
            level: '蓝色预警',
            rule: '3小时内降雨量将达100毫米以上，或者已达100毫米以上且降雨可能持续'
          }
        ],
        tempList: [
          {
            index: 1,
            level: '黄色预警',
            rule: '连续三天日最高气温将在35℃以上'
          },
          {
            index: 2,
            level: '橙色预警',
            rule: '24小时内最高气温将升至37℃以上'
          },
          {
            index: 3,
            level: '红色预警',
            rule: '24小时内最高气温将升至40℃以上'
          }
        ]
      }
    },
    mounted() {
      this.listType = this.$route.query.tab
      console.log(this.$route.query.tab)
      if (this.listType === 'rain') {
        this.list = this.rainList
      } else if (this.listType === 'temp') {
        this.list = this.tempList
      } else {
        this.list = this.frostList
      }
      console.log(this.list)
    }
    // methods: {
    //   getRice() {
    //     axios.get('http://localhost:3000/rices').then(res => {
    //       if (res.status === 200) {
    //         this.list = res.data.result
    //         console.log(1)
    //         console.log(this.list)
    //       }
    //     })
    //   },
    //   getWheat() {
    //     axios.get('http://localhost:3000/wheats').then(res => {
    //       if (res.status === 200) {
    //         this.list = res.data.result
    //         console.log(2)
    //         console.log(this.list)
    //       }
    //     })
    //   },
    //   getCorn() {
    //     axios.get('http://localhost:3000/corns').then(res => {
    //       if (res.status === 200) {
    //         console.log(res.data.result)
    //         this.list = res.data.result
    //         console.log(3)
    //         console.log(this.list)
    //       }
    //     })
    //   }
    // }
  }
</script>

