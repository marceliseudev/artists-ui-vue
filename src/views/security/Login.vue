<template>
  <div>
    <CCard class="col-sm-8">
      <CCardHeader>
        <CRow>
          <CCol>
            <h4 id="traffic" class="card-title mb-0">Login</h4>
          </CCol>
        </CRow>
      </CCardHeader>
      <template>
        <CCardBody>
          <b-form @submit.prevent="submit">
            <b-form-group
              id="email-input-group"
              label-cols-md="2"
              label-align-md="right"
              label="Email:"
              label-for="password-input"
            >
              <b-form-input
                id="email-input"
                name="email-input"
                type="email"
                v-model="$v.form.email.$model"
                :state="validateState('email')"
                aria-describedby="email-live-feedback"
              ></b-form-input>

              <b-form-invalid-feedback
                v-if="!$v.form.email.email"
                id="email-live-feedback"
              >
                Invalid email address
              </b-form-invalid-feedback>
              <b-form-invalid-feedback
                v-if="!$v.form.email.required"
                id="email-live-feedback"
              >
                Please inform email
              </b-form-invalid-feedback>
            </b-form-group>

            <b-form-group
              id="password-input-group"
              label-cols-md="2"
              label-align-md="right"
              label="Senha:"
              label-for="password-input"
            >
              <b-input-group>
                <b-form-input
                  :type="showPassword ? 'text' : 'password'"
                  id="password-input"
                  name="password-input"
                  v-model="$v.form.password.$model"
                  :state="validateState('password')"
                  aria-describedby="password-live-feedback"
                ></b-form-input>
                <b-input-group-append>
                  <b-button
                    @click="showPassword = !showPassword"
                    variant="outline-success"
                    ><b-icon :icon="showPassword ? 'eye-slash' : 'eye'"></b-icon
                  ></b-button>
                </b-input-group-append>

                <b-form-invalid-feedback
                  v-if="!$v.form.password.required"
                  id="password-live-feedback"
                >
                  Please inform password
                </b-form-invalid-feedback>
                <b-form-invalid-feedback
                  v-if="!$v.form.password.minLength"
                  id="password-live-feedback"
                >
                  Please inform password within minimum
                  {{ minLengthRequired }} caracteres.
                </b-form-invalid-feedback>
              </b-input-group>
            </b-form-group>

            <b-form-group label-cols-md="2">
              <b-button block type="submit" variant="primary">Login</b-button>
            </b-form-group>
          </b-form>

          <div class="col-md-8 offset-md-3 text-md-center">
            <b-link to="resetpassword">Forgot password ?</b-link>
            <p></p>
          </div>
          <b-form-group label-cols-md="2">
            <b-button block to="register" variant="outline-success"
              >New User ? Create an account</b-button
            >
          </b-form-group>

          <div
            v-if="msg"
            :class="
              this.msgError ? 'alert alert-danger' : 'alert alert-success'
            "
          >
            {{ msg }}
          </div>
        </CCardBody>
      </template>
    </CCard>
  </div>
</template>

<script>
import IAM from "@/IAM";
import { validationMixin } from "vuelidate";
import { required, minLength, email } from "vuelidate/lib/validators";

const minLengthRequired = 6;

export default {
  mixins: [validationMixin],
  mounted() {},
  data() {
    return {
      showPassword: false,
      checkEmailValidated: false,
      options: {
        lock: true,
        text: "Loading...",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      },
      form: {
        email: "",
        password: "",
      },
      minLengthRequired: minLengthRequired,
      error: null,
      msg: null,
      msgError: false,
    };
  },
  validations: {
    form: {
      email: {
        required,
        email,
      },
      password: {
        required,
        minLength: minLength(minLengthRequired),
      },
    },
  },
  methods: {
    validateState(name) {
      const { $dirty, $error } = this.$v.form[name];
      return $dirty ? !$error : null;
    },
    async submit() {
      this.$v.form.$touch();
      if (this.$v.form.$anyError) {
        console.log("form Validation Error:" + this.$v.$error);
        return;
      }
      let loadingInstance = this.$loading(this.options);
      try {
        let user = await IAM.Login(this.form.email, this.form.password);
        if (user) {
          if (!this.checkEmailValidated || user.emailVerified) {
            this.msg = "Login sucessfully !";
            this.msgError = false;
            this.$router.replace({ name: "Home" });
          } else {
            this.msg = "Please confirm your email";
            this.msgError = false;
          }
        } else {
          this.msg = "oops something went wrong";
          this.msgError = true;
        }
      } catch (err) {
        this.msg = err.message;
        this.msgError = true;
      } finally {
        loadingInstance.close();
      }
    },
  },
};
</script>
