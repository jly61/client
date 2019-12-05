<template>
  <div id="map"></div>
</template>

<script>
  import esriLoader from 'esri-loader'
  import axios from 'axios'

  export default {
    name: 'index',
    mounted() {
      this.initMap()
    },
    methods: {
      initMap() {
        const options = {
          url: 'http://localhost:3000/arcgis_js_api/library/4.12/init.js'
        }
        esriLoader.loadModules([
          'esri/Map',
          'esri/Basemap',
          'esri/layers/TileLayer',
          'esri/views/MapView',
          "esri/layers/FeatureLayer",
          "esri/geometry/Point",
          "esri/layers/support/LabelClass",
        ],options).then(([Map, Basemap, TileLayer, MapView, FeatureLayer, Point, LabelClass]) => {
          const fields = [
            {
              name: "ObjectID",
              alias: "ObjectID",
              type: "oid"   //   每个要素必须的字段，字段值必须唯一，当做是整数类型。。。
            },
            {
              name: "气象站号",
              alias: "气象站号",
              type: "string"   //   每个要素必须的字段，字段值必须唯一，当做是整数类型。。。
            },
            {
              name: "站点名",
              alias: "站点名",
              type: "string"  //字符串类型
            },
            {
              name: "观测场海拔",  //可以用来渲染符号大小
              alias: "观测场海拔",
              type: "string"  //单精度类型
            },
            {
              name: "气温",
              alias: "温度",
              type: "double"
            },
            {
              name: "降雨量",
              alias: "降雨量",
              type: "double"
            },
          ];
          //二维渲染
          const renderer = {
            type: "simple", // 简单渲染器  new SimpleRenderer()
            symbol: {
              type: "simple-marker",  // autocasts as new SimpleMarkerSymbol()
              size: 10,
              color: [226, 119, 40],
              outline: {  // autocasts as new SimpleLineSymbol()
                width: 2,
                color: "white"
              }
            },
          };

          const layer = new TileLayer({
            url: "http://map.geoq.cn/ArcGIS/rest/services/ChinaOnlineStreetPurplishBlue/MapServer"
          });
          const customBasemap = new Basemap({
            baseLayers: [layer],
            title: "Custom Basemap",
            id: "myBasemap"
          });
          //要素标记
          const statesLabelClass = new LabelClass({
            labelExpressionInfo: {expression: "$feature.站点名"},
            symbol: {
              type: "text",  // autocasts as new TextSymbol()
              color: "black",
              haloSize: 100,
              haloColor: "white"
            }
          });

          const param = {
            month: 6,
            day: 27,
            hour: 10
          }
          let graphics = [];
          axios.get('http://localhost:3000/weathers/kri-hour', { params: param }).then(res => {
            const result = res.data.result;
            result.forEach(item => {
              const x = item.docs[0].lon
              const y = item.docs[0].lat
              console.log(typeof item.Station_Id_C,typeof item.docs[0].Station_name,
                typeof item.docs[0].Observe_alt,typeof item.TEM, typeof item.PRE_1h)
              graphics.push({
                geometry: new Point({
                  x: x,
                  y: y
                }),
                attributes: {
                  ObjectID: 'ObjectID',
                  气象站号: item.Station_Id_C,
                  站点名: item.docs[0].Station_name,
                  观测场海拔: item.docs[0].Observe_alt,
                  气温: item.TEM,
                  降水: item.PRE_1h
                },
              })
            })

            let featureLayer = new FeatureLayer({
              source: graphics,
              fields: fields,
              renderer: renderer,
              popupTemplate: {
                title: "<a href='https://www.baidu.com'>2019</a>",
                content: [
                  {
                    type: "fields",
                    fieldInfos: [
                      {
                        fieldName: "气象站号"
                      },
                      {
                        fieldName: "站点名"
                      },
                      {
                        fieldName: "气温"
                      }
                    ]
                  }
                ]
              }
            });
            console.log(graphics)
            console.log(featureLayer)
            // featureLayer.labelingInfo = [statesLabelClass];
            //地图坐标信息
            const map = new Map({
              basemap: customBasemap,
              layers: [featureLayer]
            })
            const view = new MapView({
              center: [102.62, 29.32], // long, lat
              container: 'map',
              map: map,
              zoom: 7
            })
            let coordsWidget = document.createElement("div");
            coordsWidget.id = "coordsWidget";
            coordsWidget.className = "esri-widget esri-component";
            coordsWidget.style.padding = "7px 15px 5px";
            view.ui.add(coordsWidget, "bottom-right");

            function showCoordinates(pt) {
              coordsWidget.innerHTML = "Lat/Lon " + pt.latitude.toFixed(3) + " " + pt.longitude.toFixed(3) +
                " | Scale 1:" + Math.round(view.scale * 1) +
                " | Zoom " + view.zoom;
            }

            view.watch("stationary", function (isStationary) {
              showCoordinates(view.center);
            });

            view.on("pointer-move", function (evt) {
              showCoordinates(view.toMap({x: evt.x, y: evt.y}));
            });
          })
        })
      }
    }
  }
</script>

<style scoped>
  @import url('https://js.arcgis.com/4.12/esri/css/main.css');

  #map {
    margin: 0;
    padding: 0;
    width: 100%;
    height: calc(100vh - 50px);
  }
</style>
