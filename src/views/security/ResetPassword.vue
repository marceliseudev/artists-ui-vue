<template>
  <div>
    <CCard class="col-sm-8">
      <CCardHeader>
        <CRow>
          <CCol>
            <h4 id="traffic" class="card-title mb-0">Redefinir Senha</h4>
          </CCol>
        </CRow>
      </CCardHeader>
      <template>
        <CCardBody>
          <CCol>
            <b-form @submit.prevent="submit">
              <b-form-group
                id="email-input-group"
                label-cols-md="3"
                label-align-md="right"
                label="Email"
                label-for="email-input"
              >
                <b-form-input
                  id="email-input"
                  name="email-input"
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
                  Favor informar email
                </b-form-invalid-feedback>
              </b-form-group>

              <b-form-group label-cols-md="3">
                <b-button block type="submit" variant="primary "
                  >Enviar email para redefinir Senha</b-button
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
import { required, email } from "vuelidate/lib/validators";

export default {
  mixins: [validationMixin],
  data() {
    return {
      options: {
        lock: true,
        text: "Loading...",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      },
      form: {
        email: "",
      },
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
        return;
      }
      let loadingInstance = this.$loading(this.options);
      try {
        await IAM.sendPasswordResetEmail(this.form.email);
        this.msg = "Email sent to reset your password";
        this.msgError = false;
      } catch (err) {
        console.log(err);
        this.msg = err.message;
        this.msgError = true;
      } finally {
        loadingInstance.close();
      }
    },
  },
};
</script>
