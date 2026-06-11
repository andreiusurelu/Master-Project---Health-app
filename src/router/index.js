import { createRouter, createWebHistory } from 'vue-router'
import { supabase } from '../components/client_data.js'

import UserForm from '../views/UserForm.vue'
import CameraPage from '../views/CameraPage.vue'
import FitnessCardPage from '../views/FitnessCardPage.vue'
import FeedbackPage from '../views/FeedbackPage.vue'
import LoginPage from '../views/LoginPage.vue'
import RegisterPage from '../views/RegisterPage.vue'
import PasswordForgetPage from '../views/PasswordForgetPage.vue'
import PasswordResetPage from '../views/PasswordResetPage.vue'
import AboutPage from '../views/AboutPage.vue'

const routes = [
  {
    path: '/',
    component: LoginPage
  },
  {
    path: '/login',
    name: '/login',
    component: LoginPage
  },
  {
    path: '/userform',
    component: UserForm,
    meta: { requiresAuth: true }
  },
  {
    path: '/camera',
    component: CameraPage,
    meta: { requiresAuth: true, fullscreen: true }
  },
  {
    path: '/feedback',
    component: FeedbackPage,
    meta: { requiresAuth: true }
  },
  {
    path: '/cards',
    component: FitnessCardPage,
    meta: { requiresAuth: true }
  },
  {
    path: '/register',
    component: RegisterPage
  },
  {
    path: '/forgetPassword',
    component: PasswordForgetPage
  },
  {
    path: '/resetPassword',
    component: PasswordResetPage
  },
  {
    path: '/about',
    component: AboutPage
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach(async (to) => {
  supabase.auth.onAuthStateChange((event) => {
    if (event === 'USER_UPDATED' || event == 'PASSWORD_RECOVERY') {
      console.log('OVER HERE!!!! Event fired up: ', event)
    }})
  const {
    data: { session }
  } = await supabase.auth.getSession()

  const user = session?.user

  if (to.meta.requiresAuth && !user) {
    return '/login'
  }
  return true
})

export default router