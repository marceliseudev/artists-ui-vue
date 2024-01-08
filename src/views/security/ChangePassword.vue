<template>
  <div>
    <CCard class="col-sm-8">
      <CCardHeader>
        <CRow>
          <CCol>
            <h4 id="traffic" class="card-title mb-0">New Password Update</h4>
          </CCol>
        </CRow>
      </CCardHeader>
      <template>
        <CCardBody>
          <CCol>
            <b-form @submit.prevent="submit">
              <b-form-group
                id="password-input-group"
                label-cols-md="3"
                label-align-md="right"
                label="New Password:"
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
                    Plese inform password with minimum
                    {{ minLengthRequired }} caracteres.
                  </b-form-invalid-feedback>
                </b-input-group>
              </b-form-group>

              <b-form-group
                id="confirmpassword-input-group"
                label-cols-md="3"
                label-align-md="right"
                label="Confirm Password:"
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
                    Password does not match, please reenter
                  </b-form-invalid-feedback>
                  <b-form-invalid-feedback
                    v-if="!$v.form.confirmpassword.required"
                    id="confirmpassword-live-feedback"
                  >
                    Please inform password with minimum of
                    {{ minLengthRequired }} caracteres.
                  </b-form-invalid-feedback>
                </b-input-group>
              </b-form-group>

              <b-form-group label-cols-md="3">
                <b-button block type="submit" variant="primary"
                  >Update Password</b-button
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
import { validationMixin } from "vuelidate";
import { required, minLength, sameAs } from "vuelidate/lib/validators";
import { BIconEye, BIconEyeSlash } from "bootstrap-vue";

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
        password: "",
        confirmpassword: "",
      },
      minLengthRequired: minLengthRequired,
      error: null,
      msg: null,
      msgError: false,
    };
  },
  validations: {
    form: {
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
        await IAM.updatePassword(this.form.password);
        this.msg = "Password updated successfully !";
        this.msgError = false;
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
