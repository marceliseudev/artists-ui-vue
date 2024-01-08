<template>
  <div>
    <CCard class="col-sm-8">
      <CCardHeader>
        <CRow>
          <CCol>
            <h4 id="traffic" class="card-title mb-0">Email address update</h4>
          </CCol>
        </CRow>
      </CCardHeader>
      <template>
        <CCardBody>
          <CCol>
            <b-form @submit.prevent="submit">
              <b-form-group
                id="newemail-input-group"
                label-cols-md="3"
                label-align-md="right"
                label="New email"
                label-for="newemail-input"
              >
                <b-form-input
                  id="newemail-input"
                  name="newemail-input"
                  v-model="$v.form.newemail.$model"
                  :state="validateState('newemail')"
                  aria-describedby="newemail-live-feedback"
                ></b-form-input>

                <b-form-invalid-feedback
                  v-if="!$v.form.newemail.email"
                  id="newemail-live-feedback"
                >
                  Invalid email address
                </b-form-invalid-feedback>
                <b-form-invalid-feedback
                  v-if="!$v.form.newemail.required"
                  id="newemail-live-feedback"
                >
                  Please inform email address
                </b-form-invalid-feedback>
              </b-form-group>

              <b-form-group label-cols-md="3">
                <b-button block type="submit" variant="primary "
                  >Update email</b-button
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
        newemail: "",
      },
      error: null,
      msg: null,
      msgError: false,
    };
  },
  validations: {
    form: {
      newemail: {
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
        await IAM.updateEmail(this.form.newemail);
        this.msg = "Please check your email address to confirm your changes";
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
