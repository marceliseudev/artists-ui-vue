import firebase from "firebase/app";
import "firebase/auth";
import store from "./store";

const firebaseConfig = {
  apiKey: "AIzaSyBmQ8DJLMuevS4zUa5B5FjC5Nop9hN5kKo",
  authDomain: "projectartists-b5ef8.firebaseapp.com",
  projectId: "projectartists-b5ef8",
  storageBucket: "projectartists-b5ef8.appspot.com",
  messagingSenderId: "1050061714504",
  appId: "1:1050061714504:web:a65e653db31d23f11dd47d",
};

firebase.initializeApp(firebaseConfig);
firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION);

firebase.getCurrentUser = () => {
  return new Promise((resolve, reject) => {
    const unsubscribe = firebase.auth().onAuthStateChanged(async (user) => {
      unsubscribe();
      resolve(user);
    }, reject);
  });
};

firebase.auth().onAuthStateChanged(async (user) => {
  // atualiza obj user firebase
  store.dispatch("updateUser", user);

  let signInProvider = null;
  if (user) {
    signInProvider = (await user.getIdTokenResult()).signInProvider;
  }
  store.dispatch("updateProvider", signInProvider);
});

export default {
  async Register(name, email, password) {
    let user = null;
    await firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then((data) => {
        user = data.user;
        user.updateProfile({
          displayName: name,
        });
      })
      .catch((err) => {
        throw new Error(err.message);
      });
    return user;
  },
  async Login(email, password) {
    let user = null;
    await firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then((data) => {
        user = data.user;
      })
      .catch((err) => {
        throw new Error(err.message);
      });
    return user;
  },
  async Logout() {
    firebase.auth().signOut();
  },
  async getCurrentUser() {
    let user = await firebase.getCurrentUser();
    return user;
  },
  async hasRole(role) {
    let user = firebase.auth().currentUser;
    if (user) {
      let idTokenResult = await user.getIdTokenResult();
      let claims = idTokenResult.claims;
      if (claims) {
        const { roles } = claims;
        if (roles) {
          return roles.includes(role);
        }
      }
    }
    return false;
  },
  async updatePassword(newPassword) {
    let user = await firebase.auth().currentUser;
    if (user) {
      await user
        .updatePassword(newPassword)
        .then((data) => {
          console.log("Password updated for " + user.uid);
        })
        .catch((err) => {
          throw new Error(err.message);
        });
    }
  },
  async getToken() {
    let idToken = null;
    let user = await firebase.auth().currentUser;
    if (user) {
      idToken = await user.getIdToken(true); // An ID token is force refreshed
    }
    return idToken;
  },
  async sendEmailVerification() {
    let user = await firebase.auth().currentUser;
    if (user) {
      await user
        .sendEmailVerification()
        .then((data) => {
          console.log("Email Verification sent for " + user.uid);
        })
        .catch((err) => {
          throw new Error(err.message);
        });
    } else throw new Error("Usuário nāo autenticado");
  },
  async updateEmail(newEmail) {
    let user = await firebase.auth().currentUser;
    if (user) {
      await user
        .updateEmail(newEmail)
        .then((data) => {
          console.log("Email update for " + user.uid);
        })
        .catch((err) => {
          throw new Error(err.message);
        });
    }
  },
  async sendPasswordResetEmail(email) {
    await firebase
      .auth()
      .sendPasswordResetEmail(email)
      .then((data) => {
        console.log("Password reset email sent for " + email);
      })
      .catch((err) => {
        throw new Error(err.message);
      });
  },
  async checkActionCode(code) {
    let result = null;
    await firebase
      .auth()
      .checkActionCode(code)
      .then((data) => {
        result = data;
        console.log("checkActionCode: " + data);
      })
      .catch((err) => {
        throw new Error(err.message);
      });
    return result;
  },
  async applyActionCode(code) {
    await firebase
      .auth()
      .applyActionCode(code)
      .then((data) => {})
      .catch((err) => {
        throw new Error(err.message);
      });
  },
  async confirmPasswordReset(code, newPassword) {
    await firebase
      .auth()
      .confirmPasswordReset(code, newPassword)
      .then((data) => {})
      .catch((err) => {
        throw new Error(err.message);
      });
  },
};
