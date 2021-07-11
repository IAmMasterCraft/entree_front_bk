<template>
  <CHeader fixed with-subheader info :class="`${roleColor()} text-white`">
    <CToggler
      in-header
      class="ml-3 d-lg-none text-white"
      @click="$store.commit('toggleSidebarMobile')"
    />
    <CToggler
      in-header
      class="ml-3 d-md-down-none text-white"
      @click="$store.commit('toggleSidebarDesktop')"
    />
    <CHeaderBrand class="mx-auto d-lg-none" to="/">
      <h1 class="c-sidebar-brand-full text-white"
        name="logo"
        size="custom-size"
        :height="35"
        viewBox="0 0 556 134">EntreeLab</h1>
    </CHeaderBrand>
    <CHeaderNav class="d-md-down-none mr-auto">
      <!-- <CHeaderNavItem class="px-3">
        <CHeaderNavLink to="/dashboard">
          Dashboard
        </CHeaderNavLink>
      </CHeaderNavItem>
      <CHeaderNavItem class="px-3">
        <CHeaderNavLink to="/users" exact>
          Users
        </CHeaderNavLink>
      </CHeaderNavItem>
      <CHeaderNavItem class="px-3">
        <CHeaderNavLink>
          Settings
        </CHeaderNavLink>
      </CHeaderNavItem> -->
    </CHeaderNav>
    <CHeaderNav class="mr-4 text-white">
      <CHeaderNavItem class="d-md-down-none mx-2">
        <CHeaderNavLink>
          <CIcon class="text-white" name="cil-bell"/>
        </CHeaderNavLink>
      </CHeaderNavItem>
      <!--<CHeaderNavItem class="d-md-down-none mx-2">
        <CHeaderNavLink>
          <CIcon class="text-white" name="cil-list"/>
        </CHeaderNavLink>
      </CHeaderNavItem>-->
      <CHeaderNavItem class="d-md-down-none mx-2">
        <CHeaderNavLink>
          <CIcon class="text-white" name="cil-envelope-open"/>
        </CHeaderNavLink>
      </CHeaderNavItem>
      <TheHeaderDropdownAccnt/>
    </CHeaderNav>
    <CSubheader class="px-3">
      <CBreadcrumbRouter class="border-0 mb-0"/>
    </CSubheader>
  </CHeader>
</template>

<script>
import TheHeaderDropdownAccnt from './TheHeaderDropdownAccnt'

export default {
  name: 'TheHeader',
  components: {
    TheHeaderDropdownAccnt
  },
  methods: {
    guard () {
      //logout method
      const token = localStorage.getItem("token");
      if (!token) {
        localStorage.setItem("token", "");
        localStorage.setItem("user_type", "");
        this.$router.push({name: "Login"});
      }
    }, // end of guard
    roleColor () {
      const user = parseInt(localStorage.getItem("user_type"));
      if (user === 2) return "bg-info";
      else if (user === 3) return "bg-success";
      else if (user === 4) return "bg-secondary";
      else if (user === 5) return "bg-warning";
      else return "danger";
    }, // end of roleColor
  },
  created() {
    this.guard();
  }
}
</script>
