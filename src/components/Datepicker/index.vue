<template>
    <div class="date-picker">
        <div class="date-popup" id="date-popup" v-if="popupFlag">
            <div class="calendar-head">
                <div>
                    <a href="javascript:">&lt;&lt;</a>
                    <a href="javascript:" @click="cutMonth">&lt;</a>
                </div>
                <div>
                    <a href="javascript:">2019年</a>
                    <a href="javascript:">{{month}}月</a>
                </div>
                <div>
                    <a href="javascript:" @click="addMonth">&gt;</a>
                    <a href="javascript:">&gt;&gt;</a>
                </div>
            </div>
            <div class="calendar-body">
                <a href="javascript:" v-for="(dayItem,index) in dayList" :class="{'day-selected': dayItem === day}"
                   @click="popToggle(dayItem)">{{dayItem}}</a>
            </div>
        </div>
        <div class="now-date">
            <input id="toggle" v-model="inputValue" type="text" @click="popupFlag = !popupFlag" readonly>
        </div>
    </div>
</template>

<script>
    import '@/styles/date-picker.css'

    export default {
        name: 'Datepicker',
        data() {
            return {
                popupFlag: false,  //日历弹出flag
                month: new Date().getMonth() + 1,
                dayList: [],
                day: new Date().getDate()
            }
        },
        mounted() {
            this.$nextTick(() => {
                this.initDay()
            })
        },
        computed: {
            //计算input的日期
            inputValue: function() {
                return `2019-${this.month}-${this.day}`
            }
        },
        methods: {
            // 初始化天数
            initDay() {
                for (let i = 1; i <= 31; i++) {
                    this.dayList.push(i)
                }
            },
            // 月份加减
            addMonth() {
                if (this.month < 12) {
                    this.month++
                }
            },
            cutMonth() {
                if (this.month > 1) {
                    this.month--
                }
            },
            //日历弹出隐藏，并发送月、日给父组件
            popToggle(index) {
                this.day = index
                this.popupFlag = false
                let month = this.month
                let data = {
                    month: month,
                    day: index
                }
                this.$emit('listenChild', data)
            }
        }
    }
</script>

<style scoped>

</style>
