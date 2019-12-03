<!--日降水量 有错误待定-->
<template>
  <div style="background: transparent;!important;">
    <div id="viewDiv"></div>
    <!--时间轴-->
    <date-select class="date-picker" :picker-type="1" @sendDate="showChild" />
  </div>
</template>
<script>
import esriLoader from 'esri-loader'
import axios from 'axios'
import DateSelect from '@/components/Dateselect'
import { formatDate } from '@/utils/util'

export default {
  name: 'DayRain',
  components: {
    DateSelect
  },
  data() {
    return {
      month: 6,
      day: 27
    }
  },
  mounted() {
    this.getWeather(this.month, this.day)
  },

  methods: {
    showChild(date) {
      date = formatDate(date)
      this.year = date.year
      this.month = date.month
      this.day = date.day
      this.getWeather(this.month, this.day)
    },
    getWeather(month, day) {
      const options = {
        // 可以使用自定义资源加载,arcgis 官网加载太慢了,经常加载失败.后面会讲到自己本地如何配置资源
        url: 'https://js.arcgis.com/4.12/'
        // url: 'https://js.arcgis.com/4.12/'
      }
      esriLoader.loadModules([
        'esri/Map',
        'esri/views/SceneView',
        'esri/layers/FeatureLayer',
        'esri/geometry/Point',
        'esri/geometry/Polygon',
        'esri/layers/support/LabelClass',
        'esri/widgets/Legend'
      ], options)
        .then(([
          Map, SceneView, FeatureLayer, Point, Polygon, LabelClass, Legend
        ]) => {
          const fields = [
            {
              name: 'ObjectID',
              alias: 'ObjectID',
              type: 'oid' //   每个要素必须的字段，字段值必须唯一，当做是整数类型。。。
            },
            {
              name: 'title',
              alias: 'title',
              type: 'string' // 字符串类型
            }, {
              name: 'totalPre', // 可以用来渲染符号大小
              alias: 'totalPre',
              type: 'single' // 单精度类型
            }
          ] // 除了上面的三种类型，还有 double、date。。。

          // 三维渲染
          const renderer = {
            type: 'simple', // 简单渲染器  new SimpleRenderer()
            symbol: {
              type: 'polygon-3d', // autocasts as new PolygonSymbol3D()
              symbolLayers: [{
                type: 'extrude', // autocasts as new ExtrudeSymbol3DLayer()
                size: 100000 // 100,000 meters in height
                // material: { color: "red" }
              }]
            },
            visualVariables: [
              {
                type: 'color',
                field: 'totalPre',
                stops: [{ value: 0, color: 'gray' },
                  { value: 0.5, color: 'green' }]
              }, {
                type: 'size',
                field: 'totalPre',
                stops: [
                  { value: 0, size: 20000 }, // 40km in height
                  { value: 100, size: 100000 } // 1,000km in height
                ]
              }
            ]
          }
          // 要素标记
          const statesLabelClass = new LabelClass({
            labelExpressionInfo: { expression: '$feature.title' },
            symbol: {
              type: 'text', // autocasts as new TextSymbol()
              color: 'black',
              haloSize: 1,
              haloColor: 'white'
            }
          })

          const graphics = []
          const param = {
            month: month,
            day: day
          }
          console.log(this.month, this.day)
          const _this = this

          axios.get('http://localhost:3000/weathers/dayRain', { params: param }).then((tempRes) => {
            const hourTempArr = tempRes.data.result
            hourTempArr.forEach((tempItem) => {
              const ring = tempItem.coordinates
              const name = tempItem._id
              const totalPre = tempItem.totalPre
              // console.log(ring)
              graphics.push({
                geometry: new Polygon({
                  rings: ring
                }),
                attributes: {
                  ObjectID: 'ObjectId',
                  title: name,
                  totalPre: parseFloat(totalPre.toFixed(2))
                }
              })
            })
            console.log(graphics)
            const featureLayer = new FeatureLayer({
              source: graphics,
              fields: fields,
              renderer: renderer,
              popupTemplate: {
                title: '{title}',
                content: [
                  {
                    type: 'fields',
                    fieldInfos: [
                      {
                        fieldName: 'ObjectID'
                      },
                      {
                        fieldName: 'title'
                      },
                      {
                        fieldName: 'totalPre'
                      }
                    ]
                  }
                ]
              }
            })
            featureLayer.labelingInfo = [statesLabelClass]
            const map = new Map({
              basemap: 'dark-gray',
              ground: 'world-elevation',
              layers: [featureLayer]
            })
            const initCam = {
              position: {
                x: 108,
                y: 30,
                z: 332780
              },
              heading: 358.8,
              tilt: 13.7
            }
            const view = new SceneView({
              map: map,
              container: 'viewDiv',
              camera: initCam
            })

            // 图例部件
            // let legend = new Legend({
            //     view: view
            // });
            // view.ui.add(legend, "bottom-left");
          })
        }, reason => {
          console.log(reason)
        })
    }

  }
}
</script>
<style scoped>
    @import url('https://js.arcgis.com/4.12/esri/css/main.css');

    #viewDiv {
        margin: 0;
        padding: 0;
        width: 100%;
        height: calc(100vh - 50px);
    }
    .date-picker {
        position: absolute;
        bottom: 10px;
        left:  calc(20% - 218px);
        background: white;
        z-index: 99;
    }
</style>
