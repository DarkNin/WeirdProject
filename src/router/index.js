import Vue from 'vue'
import VueRouter from 'vue-router'
const Home = () => import('../views/Home.vue')
const Admin = () => import('../views/admin/Admin.vue')
const Player = () => import('../views/player/Player.vue')
const PlayerMobile = () => import('../views/player/PlayerMobile')
const EditPassword = () => import('../views/EditPassword.vue')

Vue.use(VueRouter)

const routes = [{
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/admin',
    name: 'Admin',
    meta: {
      requireAuth: true,
    },
    component: Admin
  },
  {
    path: '/player',
    name: 'Player',
    meta: {
      requireAuth: true,
    },
    component: Player
  },
  {
    path: '/player_mobile',
    name: 'PlayerMobile',
    meta: {
      requireAuth: true,
    },
    component: PlayerMobile
  },
  {
    path: '/edit_password',
    name: 'EditPassword',
    meta: {
      requireAuth: true,
    },
    component: EditPassword
  }
]

const router = new VueRouter({
  routes
})

router.beforeEach(function (to, from, next) {
  if (to.path !== '/') {
    //访问需要权限的页面时检测到未记录角色时返回首页
    if (to.matched.some(r => r.meta.requireAuth) &&
      !window.localStorage.getItem('info')) {
      next({
        path: '/'
      })
    } else {
      next()
    }
  } else {
    next()
  }
})
router.beforeEach(function (to, from, next) {
  //访问管理员页面时检测记录角色是否为管理员
  if (to.path.includes('admin') && JSON.parse(window.localStorage.getItem('isAdmin')) !== true) {
    next({
      path: '/'
    })
  } else {
    next()
  }
})
router.beforeEach(function (to, from, next) {
  if ((to.path.includes('player') || to.path.includes('player_mobile')) && JSON.parse(window.localStorage.getItem('isAdmin')) !== false) {
    next({
      path: '/'
    })
  } else {
    next()
  }
})

export default router