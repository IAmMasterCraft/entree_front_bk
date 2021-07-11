<template>
  <CSidebar
    fixed
    :minimize="minimize"
    :show="show"
    @update:show="(value) => $store.commit('set', ['sidebarShow', value])"
  >
    <CSidebarBrand class="d-md-down-none" to="/">
      <h1 class="c-sidebar-brand-full"
        name="logo"
        size="custom-size"
        :height="35"
        viewBox="0 0 556 134">EntreeLab</h1>
      <h3 class="c-sidebar-brand-minimized"
        name="logo"
        size="custom-size"
        :height="35"
        viewBox="0 0 110 134">EL</h3>
    </CSidebarBrand>

    <!-- <CRenderFunction flat :content-to-render="$options.nav"/> -->
    <CRenderFunction flat :content-to-render="nav"/>
    <CSidebarMinimizer
      class="d-md-down-none"
      @click.native="$store.commit('set', ['sidebarMinimize', !minimize])"
    />
  </CSidebar>
</template>

<script>
import getNav from './_nav'

export default {
  name: 'TheSidebar',
  nav: getNav(),
  data() {
    return {
      nav: getNav(),
    }
  },
  computed: {
    show () {
      return this.$store.state.sidebarShow
    },
    minimize () {
      return this.$store.state.sidebarMinimize
    }
  },
  mounted() {
    this.$options.nav = getNav();
  },
}
</script>
