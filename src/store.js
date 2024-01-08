import Vue from "vue";
import Vuex from "vuex";
Vue.use(Vuex);

const state = {
  sidebarShow: "responsive",
  sidebarMinimize: false,
  reImportNegociacoes: false,
  userData: {
    loggedIn: false,
    signInProvider: null,
    signinWithEmailandPassword: false,
    user: null,
    usuario: null,
    isAdmin: false,
  },
};

const getters = {
  userData(state) {
    return state.userData;
  },
};

const mutations = {
  SET_LOGGED_IN(state, value) {
    state.userData.loggedIn = value;
  },
  SET_USER(state, user) {
    state.userData.user = user;
  },
  SET_USUARIO(state, value) {
    state.userData.usuario = value;
  },
  SET_PROVIDER(state, value) {
    state.userData.signInProvider = value;
    if (value == "password") state.userData.signinWithEmailandPassword = true;
    else state.userData.signinWithEmailandPassword = false;
  },
  SET_USER_ADMIN(state, isAdmin) {
    state.userData.isAdmin = isAdmin;
  },
  toggleSidebarDesktop(state) {
    const sidebarOpened = [true, "responsive"].includes(state.sidebarShow);
    state.sidebarShow = sidebarOpened ? false : "responsive";
  },
  toggleSidebarMobile(state) {
    const sidebarClosed = [false, "responsive"].includes(state.sidebarShow);
    state.sidebarShow = sidebarClosed ? true : "responsive";
  },
  set(state, [variable, value]) {
    state[variable] = value;
  },
};

const actions = {
  updateUserAmdin({ commit }, isAdmin) {
    commit("SET_USER_ADMIN", isAdmin);
  },
  updateUser({ commit }, user) {
    commit("SET_LOGGED_IN", user !== null);
    commit("SET_USER", user);
  },
  updateProvider({ commit }, signInProvider) {
    commit("SET_PROVIDER", signInProvider);
  },
};

export default new Vuex.Store({
  state,
  getters,
  mutations,
  actions,
});
