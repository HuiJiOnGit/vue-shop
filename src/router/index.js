import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
import Welcome from '../views/Welcome.vue'
import Users from '../components/user/Userlist.vue'
import Roles from '../components/roles/Role.vue'
import Permissions from '../components/permissions/permissions.vue'
import Cate from '../components/goods/cate.vue'
import Params from '../components/goods/params.vue'
import List from '../components/goods/list.vue'
import AddGood from '../components/goods/add.vue'
import Order from '../components/order/order.vue'
import Report from '../components/report/report.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/home',
    name: 'Home',
    component: Home,
    redirect: '/welcome',
    children: [
      {
        path: '/welcome',
        name: '/welcome',
        component: Welcome        
      },
      {
        path: '/users',
        name: '/users',
        component: Users        
      },
      {
        path: '/roles',
        name: '/roles',
        component: Roles        
      },
      {
        path: '/rights',
        name: '/rights',
        component: Permissions        
      },
      {
        path: '/categories',
        name: '/cate',
        component: Cate        
      },
      {
        path: '/params',
        name: '/params',
        component: Params
      },
      {
        path: '/goods',
        name: '/goods',
        component: List
      },
      {
        path: '/goods/add',
        name: '/goods/add',
        component: AddGood
      },
      {
        path: '/orders',
        name: '/orders',
        component: Order
      },
      {
        path: '/reports',
        name: '/reports',
        component: Report
      }
    ]      
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  }
]

const router = new VueRouter({
  routes
})


// 挂载路由导航守卫
router.beforeEach((to,from,next)=>{
// to将要访问的路劲
// from 代表从哪个路劲调过来的
// next 是一个放行函数，表示可以放行
  if(to.path === '/login') return next();
  //获取token
  const tokenStr = window.sessionStorage.getItem('token');
  if (!tokenStr) {
    return next('/login');
  }
  next();
})

export default router
