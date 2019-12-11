<template>
  <div class="tab-container">
    <h3>明日平均气温:
      <span>{{tomorrowTemp}}&#8451;</span>
    </h3>
    <el-row>
      <el-button plain><span>10</span>月<span>12</span>日</el-button>
      <el-button plain><span>10</span>月<span>13</span>日</el-button>
      <el-button plain><span>10</span>月<span>14</span>日</el-button>
    </el-row>
    <el-tabs v-model="activeName" style="margin-top:15px;" type="border-card">
      <el-tab-pane v-for="item in tabMapOptions" :key="item.key" :label="item.label" :name="item.key">
        <keep-alive>
          <tab-pane v-if="activeName===item.key" @create="showCreatedTimes"/>
        </keep-alive>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  import tabPane from './components/TabPane'

  export default {
    name: 'Tab',
    components: { tabPane },
    data() {
      return {
        tabMapOptions: [
          { label: '水稻', key: 'rice' },
          { label: '冬小麦', key: 'wheat' },
          { label: '玉米', key: 'corn' }
        ],
        activeName: 'rice',
        createdTimes: 0,
        lon: '100.18',
        lat: '29.03',
        stationName: '稻城',
        tomorrowTemp: '25'
      }
    },
    watch: {
      activeName(val) {
        this.$router.push(`${this.$route.path}?tab=${val}`)
      }
    },
    created() {
      // init the default selected tab
      const tab = this.$route.query.tab
      if (tab) {
        this.activeName = tab
      }
    },
    methods: {
      showCreatedTimes() {
        this.createdTimes = this.createdTimes + 1
      },
      queryWeather() {

      }
    }
  }
</script>

<style scoped>
  .tab-container {
    margin: 30px;
  }
</style>
