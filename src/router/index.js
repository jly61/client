import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

export const constantRoutes = [
    {
        path: '/login',
        component: () => import('@/views/login/index'),
        hidden: true
    },

    {
        path: '/404',
        component: () => import('@/views/404'),
        hidden: true
    },

    {
        path: '/',
        component: Layout,
        redirect: '/dashboard',
        children: [{
            path: 'dashboard',
            name: 'Dashboard',
            component: () => import('@/views/dashboard/index'),
            meta: { title: 'Dashboard', icon: 'dashboard' }
        }]
    },

    // 自己配置
    {
        path: '/2d',
        component: Layout,
        redirect: '/2d/temphour',
        name: '2d',
        meta: {
            title: '二维',
            icon: 'nested'
        },
        children: [
            {
                path: '/2d',
                name: 'tempHour',
                component: () => import('@/views/2d/temphour'),
                meta: { title: '二维插值', icon: 'form' }
            },
            {
                path: '/arcgis',
                name: 'arcgis',
                component: () => import('@/views/2d/arcgis'),
                meta: { title: 'ArcGIS二维插值', icon: 'form' }
            }
        ]
    },
    {
        path: '/3d',
        component: Layout,
        redirect: '/3d/hourtemp',
        name: '3d',
        meta: {
            title: '区域三维可视化',
            icon: 'nested'
        },
        children: [
            {
                path: 'hourtemp',
                component: () => import('@/views/3d/temphour'),
                meta: { title: '每小时气温' }
            },
            {
                path: 'daytemp',
                component: () => import('@/views/3d/tempday'),
                meta: { title: '日平均气温' }
            },
            {
                path: 'hourrain',
                component: () => import('@/views/3d/rainhour'),
                meta: { title: '每小时降水' }
            },
            {
                path: 'dayrain',
                component: () => import('@/views/3d/rainday'),
                meta: { title: '日总降雨量' }
            }
        ]
    },
    {
        path: '/station',
        component: Layout,
        name: 'Station',
        meta: {
            title: '单站点气象要素',
            icon: 'nested'
        },
        children: [
            {
                path: 'info',
                component: () => import('@/views/station/info'),
                meta: { title: '气象站分布' }
            },
            {
                path: 'daytemp',
                component: () => import('@/views/station/hour'),
                meta: { title: '每小时气温降水' }
            },
            {
                path: 'hourrain',
                component: () => import('@/views/station/day'),
                meta: { title: '日气温降水' }
            },
            {
                path: 'dayrain',
                component: () => import('@/views/station/windyhour'),
                meta: { title: '每小时风速风向' }
            }
        ]
    },

    // 404 page must be placed at the end !!!
    { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
    // mode: 'history', // require service support
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRoutes
})

const router = createRouter()

export function resetRouter() {
    const newRouter = createRouter()
    router.matcher = newRouter.matcher // reset router
}

export default router
