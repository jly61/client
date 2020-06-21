<template>
  <div class="block">
    <el-date-picker
      v-if="pickerType === 1"
      v-model="value"
      type="date"
      placeholder="选择日期"
      :picker-options="pickerOptions"
    />
    <el-date-picker
      v-if="pickerType === 2"
      v-model="value2"
      type="daterange"
      start-placeholder="开始日期"
      end-placeholder="结束日期"
      :default-time="['00:00:00', '23:59:59']"
    />
  </div>
</template>

<script>
  export default {
    name: 'DateSelect',
    props: {
      pickerType: {
        type: Number,
      }
    },
    data() {
      return {
        pickerOptions: {
          disabledDate(time) {
            return time.getTime() > Date.now()
          }
        },
        value: new Date(),
        value2: ''

      }
    },
    watch: {
      value() {
        this.$emit('sendDate', this.value)
      },
      value2() {
        console.log(this.value2)
        this.$emit('sendDate', this.value2)
      }
    }
  }
</script>

<style scoped>

</style>
