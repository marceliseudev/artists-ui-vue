
<template>
  <!-- <div class="container">
    <br>
    <div class="row justify-content-center"> -->

  <div>
    <CCard class="col-sm-10">       
      <CCardHeader>
      <CRow>
        <CCol>
         <h4 id="traffic" class="card-title mb-0">{{title}}</h4>
        </CCol>
      </CRow>
      </CCardHeader>
      <template>
      <CCardBody>

      <CCol>          

      <div v-if="mode === 'verifyEmail'">
        <div class="text-md-center">
          <!-- <h4>{{title}}</h4> -->
          <br>
          <div v-if="emailvalidated">
            <div class="col-md-10 offset-md-0 text-md-center">
              <p>Seu endereço de email foi validado com sucesso!</p>
              <b-link to="login">Clique aqui para fazer login</b-link>
              <p></p>
            </div>     
          </div>
        </div>
        <div v-if="!emailvalidated">
          <b-form @submit.prevent="submitVerifyEmail">
            <div class="text-md-center">
              <p>Legal, estamos quase lá...</p>
              <p>Simplesmente clique no botāo abaixo para verificar seu endereço de email</p>
            </div>
            <div class="text-md-center">
              <b-button block type="submit" variant="outline-success">Verificar endereço de email</b-button>
              <p></p>
            </div>
            <div v-if="msg" :class="(this.msgError) ? 'alert alert-danger' : 'alert alert-success'">{{msg}}</div>
          </b-form>
        </div>
      </div>

      <div v-if="mode === 'resetPassword'">
        <div class="text-md-center">
          <!-- <h4>{{title}}</h4> -->
          <br>
          <div v-if="passwordchanged">
            <div class="col-md-10 offset-md-0 text-md-center">
              <p>Sua senha foi alterada com sucesso !</p>
              <b-link to="login">Click here to login</b-link>
              <p></p>
            </div>     
          </div>
        </div>
        <div v-if="!passwordchanged">
          <b-form @submit.prevent="submitResetPassword">
            <div class="text-md-center">
              <p>Se você que pediu para redefiniçāo da sua senha,</p>
              <p>entāo entre com a nova senha e clique no botāo de alteraçāo de senha</p>
            </div>

            <b-form-group id="password-input-group" label-cols-md="3" label-align-md="left" label="Senha:" label-for="password-input">
              <b-form-input 
                id="password-input"
                name="password-input"
                type="password"
                v-model="$v.form.password.$model"
                :state="validateState('password')"
                aria-describedby="password-live-feedback"
              ></b-form-input>

              <b-form-invalid-feedback
                id="password-live-feedback"
              >This is a required field and must be at least {{minLengthRequired}} characters.</b-form-invalid-feedback>
            </b-form-group>

            <b-form-group id="confirmpassword-input-group" label-cols-md="3" label-align-md="left" label="Confirmar Senha:" label-for="confirmpassword-input">
              <b-form-input 
                id="confirmpassword-input"
                name="confirmpassword-input"
                type="password"
                v-model="$v.form.confirmpassword.$model"
                :state="validateState('confirmpassword')"
                aria-describedby="confirmpassword-live-feedback"
              ></b-form-input>

              <b-form-invalid-feedback v-if="!$v.form.confirmpassword.sameAsPassword" id="confirmpassword-live-feedback">
              Passwords must be identical 
              </b-form-invalid-feedback>     
              <b-form-invalid-feedback v-if="!$v.form.confirmpassword.required" id="confirmpassword-live-feedback">
              This is a required field and must be at least {{minLengthRequired}} characters.
              </b-form-invalid-feedback>                     
            </b-form-group>       

            <b-form-group label-cols-md="3">
              <b-button block type="submit" variant="outline-success">Alteraçāo de senha</b-button>
            </b-form-group>

            <div v-if="msg" :class="(this.msgError) ? 'alert alert-danger' : 'alert alert-success'">{{msg}}</div>
          </b-form>
        </div>
      </div>       

      <div v-if="mode === 'recoverEmail'">
        <div class="text-md-center">
          <!-- <h4>{{title}}</h4> -->
          <br>
          <div v-if="emailreseted">
            <div class="col-md-12 offset-md-0 text-md-center">
              <p>Seu endereço de email foi redefinido com sucesso !</p>
              <b-link to="login">Clique aqui para login</b-link>
              <p></p>
            </div>     
          </div>
        </div>
        <div v-if="!emailreseted">
          <b-form @submit.prevent="submitRecoverEmail">
            <div class="text-md-center">
              <p>Se você solicitou para alterar seu email, clique no botāo abaixo</p>
            </div>
            <div class="text-md-center">
              <b-button block type="submit" variant="outline-success">Redefiniçāo do endereço de email</b-button>
              <p></p>
            </div>
            <div v-if="msg" :class="(this.msgError) ? 'alert alert-danger' : 'alert alert-success'">{{msg}}</div>
          </b-form>
        </div>
      </div>

    <!-- </div>
  </div> -->

         </CCol>
      </CCardBody>
      </template>
    </CCard>
  </div> 

</template>

<script>
import IAM from '@/IAM'
import { validationMixin } from 'vuelidate'
import { required, minLength, sameAs } from 'vuelidate/lib/validators'

const minLengthRequired = 6

export default {
  mixins: [validationMixin],
  data () {
    return {
      mode: this.$route.query.mode,
      oobCode: this.$route.query.oobCode,
      emailvalidated: false,
      passwordchanged: false,
      emailreseted: false,
      form: {
        email: '',
        password: '',
        confirmpassword: ''
      },
      minLengthRequired: minLengthRequired,
      error: null,
      msg: null,
      msgError: false
    }
  },
  validations: {
    form: {
      password: {
        required,
        minLength: minLength(minLengthRequired)
      },
      confirmpassword: {
        required,
        minLength: minLength(minLengthRequired),
        sameAsPassword: sameAs('password')
      }
    }
  },
  computed: {
    title () {
      this.mode = this.$route.query.mode
      this.oobCode = this.$route.query.oobCode
      this.msg = ''
      if (this.$route.query.mode === 'verifyEmail') {
        this.submitVerifyEmail()
        return 'Confirmaçāo de Email'
      }
      if (this.$route.query.mode === 'resetPassword') return 'Confirmaçāo de Redefiniçāo de Senha'
      if (this.$route.query.mode === 'recoverEmail') return 'Confirmaçāo de Recuperaçāo de Email'
    }
  },
  methods: {
    validateState (name) {
      const { $dirty, $error } = this.$v.form[name]
      return $dirty ? !$error : null
    },
    async submitVerifyEmail () {
      let loadingInstance = this.$loading(this.options);        
      try {
        await IAM.applyActionCode(this.oobCode)
        this.emailvalidated = true
        this.msg = 'Verificaçāo de email confirmada'
        this.msgError = false;
      } catch (err) {
        console.log(err)
        this.msg = err.message
        this.msgError = true;
      } finally {
        loadingInstance.close();
      }
    },
    async submitRecoverEmail () {
      let loadingInstance = this.$loading(this.options);              
      try {
        await IAM.applyActionCode(this.oobCode)
        this.emailreseted = true
        this.msg = 'Verificaçāo de recuperaçāo email confirmada'
        this.msgError = false;        
      } catch (err) {
        console.log(err)
        this.msg = err.message
        this.msgError = true;
      } finally {
        loadingInstance.close();
      }
    },
    async submitResetPassword () {
      this.$v.form.$touch()
      if (this.$v.form.$anyError) {
        console.log('form Validation Error:' + this.$v.$error)
        return
      }
      let loadingInstance = this.$loading(this.options);              
      try {
        await IAM.confirmPasswordReset(this.oobCode, this.form.password)
        this.passwordchanged = true
        this.msg = 'Verificaçāo de redefiniçāo de senha confirmada'
        this.msg.error = false;        
      } catch (err) {
        console.log(err)
        this.msg = err.message
        this.msgError = true;
      } finally {
        loadingInstance.close();
      }
    }
  }
}
</script>




