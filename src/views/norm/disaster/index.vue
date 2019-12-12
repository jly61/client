<template>
  <div class="tab-container">
    <el-alert :closable="false" style="width:200px;display:inline-block;vertical-align: middle;margin-left:30px;"
              title="气象灾害指标库" type="success"/>
    <el-tabs v-model="activeName" style="margin-top:15px;" type="border-card">
      <el-tab-pane v-for="item in tabMapOptions" :key="item.key" :label="item.label" :name="item.key">
        <keep-alive>
          <tab-pane v-if="activeName===item.key" :listType="item.key" @create="showCreatedTimes"/>
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
          { label: '霜冻', key: 'frost' },
          { label: '暴雨', key: 'rain' },
          { label: '高温', key: 'temp' }
        ],
        activeName: 'frost',
        createdTimes: 0
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
      }
    }
  }
</script>

<style scoped>
  .tab-container {
    margin: 30px;
  }
</style>
