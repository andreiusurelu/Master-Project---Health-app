import { createRouter, createWebHistory } from 'vue-router'
import { supabase } from '../components/client_data.js'
import { storeToRefs } from 'pinia'

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
import { useFormData } from '../components/states/user_form.js'
import GreetingPage from '../views/GreetingPage.vue'

const routes = [
  {
    path: '/',
    redirect: { name: 'home' }
  },
  {
    path: '/home',
    name: 'home',
    redirect: {name: 'greetings'}
  },
  {
    path: '/userForm',
    name: 'userForm',
    component: UserForm,
    meta: { topbar: true },
    beforeEnter: async () => {
      const formStore = useFormData()
      if (formStore.validForm) {
        return '/cards'
      }
      else {
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
      
    }
  },
  {
    path: '/camera',
    name: 'camera',
    component: CameraPage,
    beforeEnter: () => {
      const store = useFitnessStore();
      if (store.selectedExercise == null) {
        return '/cards'
      }
      else if (store.fitnessSessionData !== null) {
        return '/feedback'
      }
      else {
        return true
      }
    }
  },
  {
    path: '/feedback',
    name: 'feedback',
    component: FeedbackPage,
    meta: { topbar: true },
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
    meta: { topbar: true },
    beforeEnter: async (to, from) => {
      const formStore = useFormData();
      if (formStore.validForm) {
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
      else {
        return '/userForm'
      }
      
    }
  },
  {
    path: '/about',
    name: 'about',
    component: AboutPage,
    meta: { topbar: true }
  },
  {
    path: '/endSurvey',
    name: 'endSurvey',
    component: EndSurveyPage,
    meta: { topbar: true },
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
  },
  {
    path: '/greetings',
    name: 'greetings',
    meta: { topbar: true },
    component: GreetingPage,
    beforeEnter: async () => {
      const {
        data: { session }
      } = await supabase.auth.getSession()

      const user = session?.user

      if (user) {
        return '/userForm'
      }
      else {
        return true
      }
    }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach(async (to) => {
  const {
    data: { session }
  } = await supabase.auth.getSession()

  const user = session?.user

  if (user == null && to.name !== 'greetings') {
    return '/greetings'
  }
  else {
    return true
  }
})

export default router