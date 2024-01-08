<template>
  <div>
    <CHeader fixed with-subheader light>
      <CToggler
        in-header
        class="ml-3 d-lg-none"
        @click="$store.commit('toggleSidebarMobile')"
      />
      <CToggler
        in-header
        class="ml-3 d-md-down-none"
        @click="$store.commit('toggleSidebarDesktop')"
      />
      <CHeaderBrand class="mx-auto d-lg-none" to="/">
        <CIcon name="logo3" height="48" alt="Logo" />
      </CHeaderBrand>
      <CHeaderNav class="d-md-down-none mr-auto">
        <CHeaderNavItem class="px-3">
          <CHeaderNavLink to="/">
            Home
          </CHeaderNavLink>
        </CHeaderNavItem>
      </CHeaderNav>
      <CHeaderNav>
        <CNavItem> </CNavItem>
        <TheHeaderDropdownAccnt />
      </CHeaderNav>
    </CHeader>
  </div>
</template>

<script>
import TheHeaderDropdownAccnt from "./TheHeaderDropdownAccnt";
import { mapGetters } from "vuex";

export default {
  name: "TheHeader",
  components: {
    TheHeaderDropdownAccnt,
  },
  data() {
    return {};
  },
  computed: {
    ...mapGetters({
      userData: "userData",
    }),
  },
};
</script>
