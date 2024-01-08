<template>
  <div class="wrapper">
    <CDropdown
      v-if="userData.loggedIn"
      inNav
      class="c-header-nav-items"
      placement="bottom-end"
      add-menu-classes="pt-0"
    >
      <template #toggler>
        <CHeaderNavLink>
          <CIcon name="cil-settings" />
        </CHeaderNavLink>
      </template>
      <CDropdownHeader tag="div" class="text-center" color="light">
        <strong>Account: {{ userData.user.displayName }}</strong>
      </CDropdownHeader>
      <CDropdownHeader tag="div" class="text-center" color="light">
        <strong>Email: {{ userData.user.email }}</strong>
      </CDropdownHeader>
      <CDropdownItem v-if="userData.signinWithEmailandPassword">
        <b-button to="/changeemail" variant="link">
          <CIcon name="cil-envelope-closed" /> Alteracao email
        </b-button>
      </CDropdownItem>
      <CDropdownItem v-if="userData.signinWithEmailandPassword">
        <b-button to="/changepassword" variant="link">
          <CIcon name="cil-envelope-open" /> Alteracao senha
        </b-button>
      </CDropdownItem>
      <CDropdownDivider />
      <CDropdownItem>
        <b-button v-on:click="logout" variant="link">
          <CIcon name="cil-lock-locked" /> Logout
        </b-button>
      </CDropdownItem>
    </CDropdown>
  </div>
</template>

<script>
import IAM from "@/IAM";
import { mapGetters } from "vuex";

export default {
  name: "TheHeaderDropdownAccnt",
  mounted() {},
  data() {
    return {
      limpezaModal: false,
      msg: "",
      alert1: false,
    };
  },
  computed: {
    ...mapGetters({
      userData: "userData",
    }),
  },
  methods: {
    async logout() {
      try {
        await IAM.Logout();
        this.$router.replace({ name: "Login" });
      } catch (err) {
        this.error = err.message;
      }
    },
  },
};
</script>

<style scoped>
.c-icon {
  margin-right: 0.3rem;
}
</style>
