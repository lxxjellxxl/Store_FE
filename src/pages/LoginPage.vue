<template>
<q-page class="flex flex-center">
  <div class="q-pa-md" style="max-width: 400px">

    <q-form
      @submit="onSubmit"
      @reset="onReset"
      class="q-gutter-md"
    >
      <q-input
        filled
        v-model="name"
        label="Your name *"
      />

      <q-input
        filled
        type="password"
        v-model="password"
        label="Password *"
      />

      <!-- <q-toggle v-model="accept" label="I accept the license and terms" /> -->

      <div>
        <q-btn label="Login" type="submit" color="primary"/>
        <q-btn label="Reset" type="reset" color="primary" flat class="q-ml-sm" />
      </div>
    </q-form>

  </div>
</q-page>
</template>
<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'LoginPage',
  data () {
    return {
      name: '',
      password: ''
    }
  },
  methods: {
    onSubmit (evt) {
      console.log('@submit - do something here', evt)
      evt.target.submit()
    },
    onReset () {
      console.log('@reset - ^_^')
      // eslint-disable-next-line no-global-assign
      this.name = null
      // eslint-disable-next-line no-undef
      this.age = null
      // eslint-disable-next-line no-undef
      this.accept = false
    }
  }
})
</script>
