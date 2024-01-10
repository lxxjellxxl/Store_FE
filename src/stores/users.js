import axios from 'axios'
import Cookies from 'js-cookie'
import { defineStore } from 'pinia'
axios.defaults.xsrfCookieName = 'csrftoken'
axios.defaults.xsrfHeaderName = 'X-CSRFTOKEN'
axios.defaults.baseURL = process.env.VUE_APP_BASE_URL

export const useUserStore = defineStore({
  id: 'user',
  state: () => ({
    userInfo: {
      id: 0,
      username: '',
      firstName: '',
      lastName: '',
      email: '',
      userType: 0,
      groups: [],
      lastLogin: null,
      user_photo: ''
    },
    token: Cookies.get('tokenKey') || null
  }),
  getters: {
    userInfo: state => state.userInfo,
    token: state => state.token,
    isAuthenticated: state => !!state.token,
    loginName: state => state.userInfo.username
  },
  actions: {
    updateUserInfo (newInfo) {
      if (!newInfo) {
        this.userInfo = {
          id: 0,
          username: '',
          firstName: '',
          lastName: '',
          email: '',
          userType: '',
          groups: [],
          lastLogin: null,
          user_photo: ''
        }
      } else {
        this.userInfo = newInfo
      }
    },
    updateUserProfile (newProfile) {
      this.userInfo.user_photo = newProfile
    },
    checkToken () {
      return new Promise((resolve, reject) => {
        axios.defaults.headers.common.Authorization = `Token ${this.token}`
        axios({
          method: 'get',
          url: '/api/auth/check-token/'
        }).then((response) => {
          resolve(response)
        }).catch((error) => {
          delete axios.defaults.headers.common.Authorization
          Cookies.set('tokenKey', '', { expires: 30 })
          this.retrieveToken('')
          reject(error)
        })
      })
    },
    retrieveToken (credentials) {
      return new Promise((resolve, reject) => {
        delete axios.defaults.headers.common.Authorization
        axios({
          method: 'post',
          url: '/api/auth/token/login/',
          data: {
            password: credentials.password,
            email: credentials.email
          }
        })
          .then((response) => {
            const token = response.data.auth_token
            this.retrieveToken(token)
            axios.defaults.headers.common.Authorization = `Token ${this.token}`
            resolve(response)
          })
          .catch((error) => {
            reject(error)
          })
      })
    },
    setUnauthenticated () {
      console.log('setUnauthenticated invoked')
      Cookies.remove('tokenKey')
      this.retrieveToken('')
      delete axios.defaults.headers.common.Authorization
      this.updateUserInfo(null)
    },
    destroyToken () {
      axios.defaults.headers.common.Authorization = `Token ${this.token}`
      return new Promise((resolve, reject) => {
        axios({
          url: '/api/auth/token/logout/',
          method: 'post'
        })
          .then((response) => {
            Cookies.remove('tokenKey')
            this.retrieveToken('')
            delete axios.defaults.headers.common.Authorization
            this.updateUserInfo(null)
            resolve(response)
          })
          .catch((error) => {
            Cookies.remove('tokenKey')
            this.retrieveToken('')
            delete axios.defaults.headers.common.Authorization
            reject(error)
          })
      })
    },
    retrieveUserData () {
      return new Promise((resolve, reject) => {
        axios({
          url: '/api/auth/get-info/',
          method: 'get'
        })
          .then((result) => {
            const resultInfo = {
              id: result.data.id,
              username: result.data.username,
              firstName: result.data.first_name,
              lastName: result.data.last_name,
              email: result.data.email,
              lastLogin: result.data.last_login,
              groups: result.data.groups,
              userType: result.data.user_type,
              user_photo: result.data.user_photo
            }
            this.updateUserInfo(resultInfo)
            resolve(result)
          })
          .catch((error) => {
            reject(error)
          })
      })
    },
    resetPassword (email) {
      return new Promise((resolve, reject) => {
        console.log(email)
        axios({
          method: 'post',
          url: '/api/auth/users/reset_password/',
          data: email
        })
          .then((response) => {
            resolve(response)
          })
          .catch((error) => {
            reject(error)
          })
      })
    },
    setPassword (info) {
      return new Promise((resolve, reject) => {
        axios({
          method: 'post',
          url: '/api/auth/users/set_password/',
          data: info
        })
          .then((response) => {
            resolve(response)
          })
          .catch((error) => {
            reject(error.response.data)
          })
      })
    },
    setEmail (info) {
      return new Promise((resolve, reject) => {
        axios({
          method: 'post',
          url: '/api/auth/users/set_email/',
          data: info
        })
          .then((response) => {
            resolve(response)
          })
          .catch((error) => {
            reject(error.response.data)
          })
      })
    },
    resetPasswordConfirm (data) {
      return new Promise((resolve, reject) => {
        axios({
          method: 'post',
          url: '/api/auth/users/reset_password_confirm/',
          data
        })
          .then((response) => {
            resolve(response)
          })
          .catch((error) => {
            reject(error)
          })
      })
    },
    changePasswordConfirm (data) {
      return new Promise((resolve, reject) => {
        axios({
          method: 'post',
          url: '/api/auth/users/set_password/',
          data
        })
          .then((response) => {
            resolve(response)
          })
          .catch((error) => {
            reject(error)
          })
      })
    },
    resetData () {
      return new Promise((resolve, reject) => {
        axios({
          method: 'get',
          url: '/reset/'
        })
          .then((response) => {
            resolve(response)
          })
          .catch((error) => {
            reject(error)
          })
      })
    }
  }
})
