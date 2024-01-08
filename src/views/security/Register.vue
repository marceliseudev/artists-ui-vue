<template>
  <div>
    <CCard class="col-sm-8">
      <CCardHeader>
        <CRow>
          <CCol>
            <h4 id="traffic" class="card-title mb-0">Register</h4>
          </CCol>
        </CRow>
      </CCardHeader>
      <template>
        <CCardBody>
          <CCol>
            <b-form @submit.prevent="submit">
              <b-form-group
                id="name-input-group"
                label-cols-md="3"
                label-align-md="right"
                label="Name:"
                label-for="name-input"
              >
                <b-form-input
                  id="name-input"
                  name="name-input"
                  v-model="$v.form.name.$model"
                  :state="validateState('name')"
                  aria-describedby="name-live-feedback"
                ></b-form-input>

                <b-form-invalid-feedback
                  v-if="!$v.form.name.email"
                  id="name-live-feedback"
                >
                  Please inform your name
                </b-form-invalid-feedback>
              </b-form-group>

              <b-form-group
                id="role-input-group"
                label-cols-md="3"
                label-align-md="right"
                label="Role:"
                label-for="role-input"
              >
                <b-form-select
                  id="role-input"
                  name="role-input"
                  :options="roleOptions"
                  v-model="$v.form.role.$model"
                  :state="validateState('role')"
                  aria-describedby="role-live-feedback"
                ></b-form-select>

                <b-form-invalid-feedback
                  v-if="!$v.form.name.role"
                  id="name-live-feedback"
                >
                  Please inform role
                </b-form-invalid-feedback>
              </b-form-group>

              <b-form-group
                id="email-input-group"
                label-cols-md="3"
                label-align-md="right"
                label="Email:"
                label-for="email-input"
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
                  Formato do email inválido
                </b-form-invalid-feedback>
                <b-form-invalid-feedback
                  v-if="!$v.form.email.required"
                  id="email-live-feedback"
                >
                  Please inform your email
                  <address></address>
                </b-form-invalid-feedback>
              </b-form-group>

              <b-form-group
                id="password-input-group"
                label-cols-md="3"
                label-align-md="right"
                label="Password:"
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
                      ><b-icon
                        :icon="showPassword ? 'eye-slash' : 'eye'"
                      ></b-icon
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
                    Please inform password with minimum
                    {{ minLengthRequired }} caracteres.
                  </b-form-invalid-feedback>
                </b-input-group>
              </b-form-group>

              <b-form-group
                id="confirmpassword-input-group"
                label-cols-md="3"
                label-align-md="right"
                label="Confirm passowrd:"
                label-for="confirmpassword-input"
              >
                <b-input-group>
                  <b-form-input
                    :type="showConfirmPassword ? 'text' : 'password'"
                    id="confirmpassword-input"
                    name="confirmpassword-input"
                    v-model="$v.form.confirmpassword.$model"
                    :state="validateState('confirmpassword')"
                    aria-describedby="confirmpassword-live-feedback"
                  ></b-form-input>
                  <b-input-group-append>
                    <b-button
                      @click="showConfirmPassword = !showConfirmPassword"
                      variant="outline-success"
                      ><b-icon
                        :icon="showConfirmPassword ? 'eye-slash' : 'eye'"
                      ></b-icon
                    ></b-button>
                  </b-input-group-append>

                  <b-form-invalid-feedback
                    v-if="!$v.form.confirmpassword.required"
                    id="confirmpassword-live-feedback"
                  >
                    Please inform password
                  </b-form-invalid-feedback>
                  <b-form-invalid-feedback
                    v-if="!$v.form.confirmpassword.sameAsPassword"
                    id="confirmpassword-live-feedback"
                  >
                    Passowrds does not match
                  </b-form-invalid-feedback>
                  <b-form-invalid-feedback
                    v-if="!$v.form.confirmpassword.minLength"
                    id="confirmpassword-live-feedback"
                  >
                    Please inform password with minimum
                    {{ minLengthRequired }} caracteres.
                  </b-form-invalid-feedback>
                </b-input-group>
              </b-form-group>

              <b-form-group label-cols-md="3">
                <b-button block type="submit" variant="primary"
                  >Create user account</b-button
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
            </b-form>
          </CCol>
        </CCardBody>
      </template>
    </CCard>
  </div>
</template>

<script>
import IAM from "@/IAM";
import ArtistsAPI from "@/service/ArtistsAPI";
import { validationMixin } from "vuelidate";
import { required, minLength, sameAs, email } from "vuelidate/lib/validators";

const minLengthRequired = 6;

export default {
  mixins: [validationMixin],
  data() {
    return {
      showPassword: false,
      showConfirmPassword: false,
      options: {
        lock: true,
        text: "Loading...",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      },
      form: {
        name: "",
        email: "",
        password: "",
        confirmpassword: "",
        role: "",
      },
      minLengthRequired: minLengthRequired,
      error: null,
      msg: null,
      msgError: false,
      roleOptions: [
        { value: "admin", text: "admin" },
        { value: "user", text: "user" },
      ],
    };
  },
  validations: {
    form: {
      name: {
        required,
      },
      role: {
        required,
      },
      email: {
        required,
        email,
      },
      password: {
        required,
        minLength: minLength(minLengthRequired),
      },
      confirmpassword: {
        required,
        minLength: minLength(minLengthRequired),
        sameAsPassword: sameAs("password"),
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
        let user = await IAM.Register(
          this.form.name,
          this.form.email,
          this.form.password
        );
        if (user) {
          this.msg = "User created sucessfully.";
          this.msgError = false;
          await IAM.sendEmailVerification();
          await ArtistsAPI.addRoleUsuario(this.form.role);
          await this.$store.dispatch("addRoleUsuario", this.form.role);
          await IAM.Logout();
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
