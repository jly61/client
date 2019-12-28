<template>
  <div class="container">
    <h3>axios实现多个并行请求</h3>
    <ul class="posts"></ul>
  </div>
</template>

<script>
  import axios from 'axios'
  export default {
    name: 'index',
    mounted() {
      this.init()
    },
    methods: {
      init() {
        function getPosts() {
          // 存储所有http请求
          let reqList = []
          // 存储后台响应每个请求后的返回结果
          let resList = []

          for(let i = 0; i< 30; i++) {
            let req = axios.get(`/caiyun/${i},${i}/daily.json`)

            reqList.push(req)
            resList.push(('post' + (i + 1)).replace(/[']+/g, ''))
          }

          return axios.all(reqList).then(axios.spread(function(...resList) {
            // console.log(resList)
            return resList // 拿到所有posts数据
          }))
        }

        async function renderPage() {
          let posts = await getPosts()
          console.log(posts)
          let docfrag = document.createDocumentFragment()

          for(let i = 0; i< posts.length; i++) {
            if (posts[i] && posts[i].status === 200) {
              let newLi = document.createElement('li')

              newLi.innerHTML = posts[i].data.result.daily
              docfrag.appendChild(newLi)
            }
          }
          document.querySelector('.posts').appendChild(docfrag)
        }

        renderPage()
      }
    }
  }
</script>

<style scoped>

</style>
