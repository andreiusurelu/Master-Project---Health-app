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
import EndSurveyPage from '../views/EndSurveyPage.vue'

import { useFitnessStore } from '../components/states/fitness_data.js'

const routes = [
  {
    path: '/',
    redirect: { name: 'home' }
  },
  {
    path: '/home',
    name: 'home'
  },
  {
    path: '/login',
    name: 'login',
    component: LoginPage
  },
  {
    path: '/userForm',
    name: 'userForm',
    component: UserForm,
    meta: { requiresAuth: true, topbar: true },
    beforeEnter: async () => {
      const { data, error, status } = await supabase.from('UserData').select("*");
      if (error) {
        if (status == 406) {
          console.error('Request is unaccepted by the server. Error: ', error);
        }
        else {
          console.error('Error in getting UserData: ', error);
        }
        throw new Error('UserForm');
      }
      if (status == 200) {
        if (data !== null && data.length > 0) {
          return '/cards'
        }
        else {
          return true
        }
      }
      else {
        return false
      }
    }
  },
  {
    path: '/camera',
    name: 'camera',
    component: CameraPage,
    meta: { requiresAuth: true }
  },
  {
    path: '/feedback',
    name: 'feedback',
    component: FeedbackPage,
    meta: { requiresAuth: true, topbar: true },
    beforeEnter: () => {
      const store = useFitnessStore();
      if (store.selectedExercise == null) {
        return '/cards'
      }
      else if (store.fitnessSessionData == null) {
        return '/camera'
      }
      else {
        return true
      }
    }
  },
  {
    path: '/cards',
    name: 'cards',
    component: FitnessCardPage,
    meta: { requiresAuth: true, topbar: true },
    beforeEnter: async (to, from) => {
      const {data, error, status} = await supabase.from('UserFitnessSession').select('exerciseName');
      if (error) {
          if (status == 406) {
              console.error('Request is unaccepted by the server. Error: ', error);
          }
          else {
              console.error('Error in FitnessCardPage: ', error);
          }
          throw new Error('FitnessCardPage');
      }
      if (data && status == 200) {
            if (data.length > 0) {
              const store = useFitnessStore();
              store.updateExerciseList(data);
              if (store.allSelected) {
                return '/endSurvey'
              }
            }
      }
      return true;
    }
  },
  {
    path: '/register',
    name: 'register',
    component: RegisterPage
  },
  {
    path: '/forgetPassword',
    name: 'forgetPassword',
    component: PasswordForgetPage
  },
  {
    path: '/resetPassword',
    name: 'resetPassword',
    component: PasswordResetPage
  },
  {
    path: '/about',
    name: 'about',
    component: AboutPage,
    meta: { topbar: true,  requiresAuth: true }
  },
  {
    path: '/endSurvey',
    name: 'endSurvey',
    component: EndSurveyPage,
    meta: { requiresAuth: true, topbar: true },
    beforeEnter: () => {
      const store = useFitnessStore();
      if (!store.allSelected) {
        return '/cards';
      }
      else {
        store.$reset();
        return true;
      }
    }
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

  if ((to.meta.requiresAuth || to.name == 'home') && !user) {
    return {
      path: '/login',
      redirect: to.fullPath
    }
  }
  else if (user && (to.name == 'home' || !to.meta.requiresAuth)) {
    return {
      path: '/cards',
      redirect: to.fullPath
    }
  }
  return true
})

router.beforeResolve(async (to) => {
  try {
    if (to.name == 'cards') {
      const { data, error, status } = await supabase.from('UserData').select("*");
      if (error) {
        if (status == 406) {
          console.error('Request is unaccepted by the server. Error: ', error);
        }
        else {
          console.error('Error in getting UserData: ', error);
        }
        throw new Error('UserForm');
      }
      if (status == 200) {
        if (data !== null && data.length > 0) {
          return true
        }
        else {
          return '/userForm'
        }
      }
      else {
        return false
      }
    }
  }
  catch (error) {
    console.error('Error detected: ',error);
    return false;
  }
  return true
})

export default router