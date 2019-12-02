<!--日平均气温-->
<template>
    <div style="background: transparent;!important;">
        <div id="viewDiv"></div>
        <!--时间轴-->
        <date-select class="date-picker" :pickerType="1" v-on:sendDate="showChild"></date-select>
    </div>
</template>
<script>
    import esriLoader from 'esri-loader'
    import axios from 'axios'
    import DateSelect from '@/components/Dateselect'
    import { formatDate } from '@/utils/util'

    export default {
        name: '',
        data() {
            return {
                month: 6,
                day: 27
            }
        },
        mounted() {
            this.getWeather(this.month, this.day)
        },
        components: {
            DateSelect
        },
        methods: {
            showChild(date) {
                date = formatDate(date)
                this.month = date.month
                this.day = date.day
                console.log(this.month, this.day)
                this.getWeather(this.month, this.day)
            },
            getWeather(month, day) {
                const options = {
                    // 可以使用自定义资源加载,arcgis 官网加载太慢了,经常加载失败.后面会讲到自己本地如何配置资源
                    // url: 'https://js.arcgis.com/4.12/'
                    url: 'https://js.arcgis.com/4.12/'
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
                        let fields = [
                            {
                                name: 'ObjectID',
                                alias: 'ObjectID',
                                type: 'oid'   //   每个要素必须的字段，字段值必须唯一，当做是整数类型。。。
                            },
                            {
                                name: 'title',
                                alias: 'title',
                                type: 'string'  //字符串类型
                            }, {
                                name: 'avgTemp',  //可以用来渲染符号大小
                                alias: 'avgTemp',
                                type: 'single'  //单精度类型
                            }
                        ]     //除了上面的三种类型，还有 double、date。。。

                        //三维渲染
                        let renderer = {
                            type: 'simple', // 简单渲染器  new SimpleRenderer()
                            symbol: {
                                type: 'polygon-3d',  // autocasts as new PolygonSymbol3D()
                                symbolLayers: [{
                                    type: 'extrude',  // autocasts as new ExtrudeSymbol3DLayer()
                                    size: 100000  // 100,000 meters in height
                                    // material: { color: "red" }
                                }]
                            },
                            visualVariables: [
                                {
                                    type: 'color',
                                    field: 'avgTemp',
                                    stops: [
                                        { value: -50, color: '#0000ff' },
                                        { value: -42, color: '#0014ff' },
                                        { value: -34, color: '#0045ff' },
                                        { value: -26, color: '#0065ff' },
                                        { value: -24, color: '#0085ff' },
                                        { value: -22, color: '#00a6ff' },
                                        { value: -20, color: '#00cbff' },
                                        { value: -18, color: '#00ebff' },
                                        { value: -16, color: '#00fff7' },
                                        { value: -14, color: '#00ffd6' },
                                        { value: -12, color: '#00ffb5' },
                                        { value: -10, color: '#00ff94' },
                                        { value: -8, color: '#00ff73' },
                                        { value: -6, color: '#00ff52' },
                                        { value: -4, color: '#00ff29' },
                                        { value: -2, color: '#00ff08' },
                                        { value: 0, color: '#10ff00' },
                                        { value: 2, color: '#31ff00' },
                                        { value: 4, color: '#52ff00' },
                                        { value: 6, color: '#73ff00' },
                                        { value: 8, color: '#94ff00' },
                                        { value: 10, color: '#b5ff00' },
                                        { value: 12, color: '#deff00' },
                                        { value: 14, color: '#ffff00' },
                                        { value: 16, color: '#ffe700' },
                                        { value: 18, color: '#ffc300' },
                                        { value: 20, color: '#ffa200' },
                                        { value: 22, color: '#ff8200' },
                                        { value: 24, color: '#ff6100' },
                                        { value: 26, color: '#ff4100' },
                                        { value: 28, color: '#ff2c00' },
                                        { value: 30, color: '#ff2000' },
                                        { value: 33, color: '#ff1400' },
                                        { value: 35, color: '#ff0000' }
                                    ]
                                }, {
                                    type: 'size',
                                    field: 'avgTemp',
                                    stops: [
                                        { value: 0, size: 20000 },  // 40km in height
                                        { value: 40, size: 80000 }  // 1,000km in height
                                    ]
                                }
                            ]
                        }
                        //要素标记
                        const statesLabelClass = new LabelClass({
                            labelExpressionInfo: { expression: '$feature.title' },
                            symbol: {
                                type: 'text',  // autocasts as new TextSymbol()
                                color: 'black',
                                haloSize: 1,
                                haloColor: 'white'
                            }
                        })
                        let graphics = []
                        let param = {
                            month: month,
                            day: day
                        }
                        console.log(this.month, this.day)
                        let _this = this

                        axios.get('http://localhost:3000/weathers/dayTemp', { params: param }).then((tempRes) => {
                            let hourTempArr = tempRes.data.result
                            hourTempArr.forEach((tempItem) => {
                                let ring = tempItem.coordinates
                                let name = tempItem._id
                                let avgTemp = tempItem.avgTemp
                                // console.log(ring)
                                graphics.push({
                                    geometry: new Polygon({
                                        rings: ring
                                    }),
                                    attributes: {
                                        ObjectID: 'ObjectId',
                                        title: name,
                                        avgTemp: parseFloat(avgTemp.toFixed(2))
                                    }
                                })
                            })
                            console.log(graphics)
                            let featureLayer = new FeatureLayer({
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
                                                    fieldName: 'avgTemp'
                                                }
                                            ]
                                        }
                                    ]
                                }
                            })
                            featureLayer.labelingInfo = [statesLabelClass]
                            let map = new Map({
                                basemap: 'dark-gray',
                                ground: 'world-elevation',
                                layers: [featureLayer]
                            })
                            let initCam = {
                                position: {
                                    x: 108,
                                    y: 30,
                                    z: 332780
                                },
                                heading: 358.8,
                                tilt: 13.7
                            }
                            let view = new SceneView({
                                map: map,
                                container: 'viewDiv',
                                camera: initCam
                            })

                            //图例部件
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
</style>
