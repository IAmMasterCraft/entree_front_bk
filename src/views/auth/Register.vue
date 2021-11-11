<template>
  <div class="d-flex align-items-center min-vh-100">
    <CContainer fluid>
      <CRow class="justify-content-center">
        <CCol md="6">
          <CProgress
            :value="100"
            v-show="showProgress"
            color="success"
            striped
            :animated="true"
            class="mb-2"
          />
          <CCard class="mx-4 mb-0">
            <CCardBody class="p-4">
              <CForm @submit="proceed">
                <h1>Register {{ $route.params.user_type }}</h1>
                <p class="text-muted">Create {{ $route.params.user_type }} account</p>
                <CAlert
                  :show.sync="notification.countdown"
                  closeButton
                  :color="notification.type"
                  fade
                  v-html="(!notification.message) ? `Register ${$route.params.user_type}` : notification.message"
                >
                  <CProgress
                    class="mt-2"
                    :max="20"
                    :value="notification.countdown"
                    height="3px"
                    :color="notification.type"
                    animate
                  />
                </CAlert>
                <template v-if="formValues.user_type != 2">
                  <CInput
                    placeholder="First Name"
                    type="name"
                    autocomplete="name"
                    name="first_name"
                    required="true"
                    class="mb-4"
                    v-model="formValues.first_name"
                  >
                    <template #prepend-content><i class="fa fa-user"></i></template>
                  </CInput>
                  <CInput
                    placeholder="Last Name"
                    type="name"
                    autocomplete="name"
                    name="last_name"
                    required="true"
                    class="mb-4"
                    v-model="formValues.last_name"
                  >
                    <template #prepend-content><i class="fa fa-building"></i></template>
                  </CInput>
                </template>
                <template v-else>
                  <CInput
                    placeholder="School Name"
                    type="name"
                    autocomplete="name"
                    name="school_name"
                    required="true"
                    class="mb-4"
                    v-model="formValues.school_name"
                  >
                    <template #prepend-content><i class="fa fa-building"></i></template>
                  </CInput>
                  <CInput
                    placeholder="School Address"
                    type="address"
                    autocomplete="address"
                    name="school_address"
                    required="true"
                    class="mb-4"
                    v-model="formValues.school_address"
                  >
                    <template #prepend-content><i class="fa fa-map-marker"></i></template>
                  </CInput>
                  <CRow>
                    <CCol col="6" class="text-left">
                      <CSelect
                        name="state"
                        required="true"
                        class="mb-4"
                        @change="updateLga"
                        :value.sync="formValues.state"
                        :options="allState"
                      >
                        <template #prepend-content><i class="fa fa-map-marker"></i></template>
                      </CSelect>
                    </CCol>
                    <CCol col="6" class="text-right">
                      <CSelect
                        name="lga"
                        required="true"
                        class="mb-4"
                        :value.sync="formValues.lga"
                        :options="allLga"
                        :disabled="isLgaDisabled"
                      >
                        <template #prepend-content><i class="fa fa-map-marker"></i></template>
                      </CSelect>
                    </CCol>
                  </CRow>
                </template>
                <CInput
                  placeholder="Email"
                  autocomplete="email"
                  name="email"
                  type="email"
                  required="true"
                  v-model="formValues.email"
                >
                  <template #prepend-content><i class="fa fa-envelope"></i></template>
                </CInput>
                <p class="text-danger" v-show="(formErrors.email) ? true : false">{{ formErrors.email }}</p>
                <CInput
                  placeholder="Phone Number"
                  autocomplete="username"
                  name="phone_number"
                  required="true"
                  type="number"
                  v-model="formValues.phone_number"
                >
                  <template #prepend-content><i class="fa fa-phone"></i></template>
                </CInput>
                <p class="text-danger" v-show="(formErrors.phone_number) ? true : false">{{ formErrors.phone_number }}</p>
                <CInput
                  placeholder="Password"
                  type="password"
                  autocomplete="new_password"
                  required="true"
                  name="password"
                  v-model="formValues.password"
                >
                  <template #prepend-content><i class="fa fa-key"></i></template>
                  <template #append-content class=""><i @click="passwordVisibilityToggle" :class="`fa fa-eye ${passwordVisibilityColor}`"></i></template>
                </CInput>
                <p class="text-danger" v-show="(formErrors.password) ? true : false">{{ formErrors.password }}</p>
                <CInput
                  placeholder="Repeat password"
                  type="password"
                  autocomplete="new_password"
                  name="repeat_password"
                  required="true"
                  v-model="formValues.repeat_password"
                >
                  <template #prepend-content><i class="fa fa-key"></i></template>
                </CInput>
                <p class="text-danger" v-if="formErrors.password">{{ formErrors.password }}</p>
                <CInputCheckbox
                  required="true"
                  name="terms"
                  value="terms"
                  class="mb-4"
                  label="I agree to the Terms of Use" />
                <CButton
                  type="submit"
                  :disabled="isBtnDisabled"
                  color="info"
                  class="mb-4"
                  block>{{ `sign up`.toUpperCase() }}
                </CButton>
                <hr />
                <CRow>
                  <CCol col="6" class="text-left">
                    <p color="link" class="mx-0">
                      <a href="#/register" @click="isBtnDisabled = !isBtnDisabled">
                        Change Account Type
                      </a>
                    </p>
                  </CCol>
                  <CCol col="6" class="text-right">
                    <p class="text-right">
                      Already signed up?
                      <a href="#/auth/login" @click="isBtnDisabled = !isBtnDisabled">
                        Login
                      </a>
                    </p>
                  </CCol>
                </CRow>
              </CForm>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </CContainer>
  </div>
</template>

<script>
import statesData from "../db/stateLg";
const getStateObject = statesData.map(stateObject => {return {value: stateObject.name, label: stateObject.name}})
export default {
  name: 'Register',
  data () {
    // this.updateLga();
    return {
      allState: getStateObject,
      allLga: [{value: "-- Select Lga --", label: "-- Select Lga --"}],
      isLgaDisabled: true,
      notification: {
        type: "success",
        countdown: 20,
        message: null,
      },
      isBtnDisabled: false,
      showProgress: false,
      passwordVisibilityColor: "text-success",
      formErrors: {
        email: null,
        phone_number: null,
        password: null,
      },
      formValues: {
        email: null,
        phone_number: null,
        password: null,
        repeat_password: null,
        school_name: null,
        school_address: null,
        state: null,
        lga: null,
        user_type: localStorage.getItem("user_type"),
        first_name: null,
        last_name: null,
      },
    }
  },
  methods: {
    proceed (event) {
      event.preventDefault();
      this.submitForm();
      /*
      this.formErrors.email = (!this.formValues.email) ? "Email is Required!" : null;
      this.formErrors.phone_number = (!this.formValues.phone_number) ? "Phone number is Required!" : null;
      this.formErrors.password = (!this.formValues.password) ? "Password is Required!" : null;
      this.formErrors.password = (!this.formValues.repeat_password) ? "Repeat Password is Required!" : null
      this.formErrors.password = (this.formValues.password !== this.formValues.repeat_password) ? "Password and Repeat Password must match!" : null;
      this.formErrors.phone_number = (typeof(parseInt(this.formValues.phone_number)) !== "number") ? "Phone number must be numeric!" : null;
      this.formErrors.email = (!this.validateEmail(this.formValues.email)) ? ("Email input must be an email address!") : null;

      if (
        this.formValues.email &&
        this.validateEmail(this.formValues.email) &&
        this.formValues.phone_number &&
        this.formValues.password &&
        this.formValues.password === this.formValues.repeat_password
      ) {
        this.submitForm();
      }
      */
    },
    passwordVisibilityToggle(){
      const passwordInput = document.querySelectorAll("input[autocomplete=new_password]");
      if(this.passwordVisibilityColor === "text-success") {
        passwordInput.forEach(input => {input.type = "text"});
        this.passwordVisibilityColor = "text-danger"
      } else {
        passwordInput.forEach(input => {input.type = "password"});
        this.passwordVisibilityColor = "text-success"
      }
    },
    validateEmail(email) {
      const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(String(email).toLowerCase());
    },
    async submitForm(){
      try {
        // const response = await fetch('https://entreelab.com.ngsrc/api/auth/register', {
        //   method: "POST",
        //   body: JSON.stringify(data),
        //   headers: {
        //     "Content-type": "application/json; charset=UTF-8",
        //     "Authorization": `Bearer none-for-now-replace-with-jwt`,
        //   }
        // });
        // this.sendOtp();
        this.registerUser();
        // localStorage.setItem(`response-${Math.round(Math.random()*1000000)}`, data);
        // location.href += `/verify-otp`;
      } catch (error) {
        if (error.response) {
          console.log("Server Error:", error);
        } else if (error.request) {
          console.log("Network Error:", error);
        } else {
          console.log("Client Error:", error);
        }
      }
    },
    async sendOtp(){
      try {
        const config = {
          method: "post",
          url: "https://sandbox-api.sendchamp.com/api/v1/verification/create",
          data: {
            channel: "sms",
            sender: "EntreeLab",
            token_type: "numeric",
            token_length: "4",
            expiration_time: 30,
            meta_data: {first_name: "USER"},
            customer_mobile_number: this.formValues.phone_number,
          },
          headers: {
            "Authorization": `Bearer sendchamp_test_$2y$10$meOC90tHSPEt64AcNX9aCu1DHsyExcyZ6Y401bYzHxeTYPtHLaAEy`,
            "Content-Type": "application/json",
            "Accept": "application/json",
          }
        };
        const response = await this.axios(config);
        if (response.data.status === "error") {
          this.notification.message = response.data.message;
          this.notification.countdown = 20;
          this.notification.type = "warning";
          this.isBtnDisabled = !this.isBtnDisabled;
          this.showProgress = !this.showProgress;
        } else if (response.data.status === "success") {
          this.notification.message = response.data.message;
          this.notification.countdown = 20;
          this.notification.type = response.data.status;
          const data = {
            email: this.formValues.email,
            phone_number: this.formValues.phone_number,
            user_type: localStorage.getItem("user_type"),
            password: this.formValues.password,
            verification_reference: response.data.data.verification_reference,
          };
          // location.href += `/verify-otp`;
          this.$router.push({name: "VerifyOtp", params: {data}});
        } else {
          this.notification.message = "Unexpected Error was encountered!";
          this.notification.countdown = 20;
          this.notification.type = "danger";
          this.isBtnDisabled = !this.isBtnDisabled;
        }
      } catch (error) {
        if (error.response) {
          const {message, errors} = error.response.data;
          const errorProps = Object.keys(errors);
          errorProps.map(err => errors[err]);
          this.notification.message = `
            <code>
              ${message}
            </code><br>
            <code>
              ${errors[errorProps].join('<br />')}
            </code>`;
          this.notification.countdown = 20;
          this.notification.type = "danger";
          this.isBtnDisabled = !this.isBtnDisabled;
          this.showProgress = !this.showProgress;
        } else if (error.request) {
          this.notification.message = error.request;
          this.notification.countdown = 20;
          this.notification.type = "danger";
          this.isBtnDisabled = !this.isBtnDisabled;
          this.showProgress = !this.showProgress;
        } else {
          this.notification.message = "Developer fucked up!";
          this.notification.countdown = 20;
          this.notification.type = "danger";
          this.isBtnDisabled = !this.isBtnDisabled;
          this.showProgress = !this.showProgress;
        }
      }
    },
    updateLga(){
      const lgaList = [{value: "-- Select LGA --", label: "-- Select LGA --"}];
      const lgaObject = statesData.forEach(stateObject => {
        if (stateObject.name === this.formValues.state) return stateObject.locals.map(lga => {lgaList.push({value: lga.name, label: lga.name})});
      });
      this.allLga = lgaList;
      //disable lga
      this.isLgaDisabled = false;
    },
    async sendMail(){
      const mailValue = {
        receiver_name: this.formValues.school_name,
        receiver_email: this.formValues.email,
        subject: "Welcome on board!",
        body: `
          <p>
            Hey ${this.formValues.school_name},<br />
            <br />I’m Damie Ajayi, the founder of EntreeLab and I’d like to personally thank you for signing up to our platform.<br />
            <br />We established Entreelab in order to have a central learning hub where multiple users have access to training and evaluation tools needed for learning in one place. The APP is designed to help Educators, Parents and Students to monitor activities and performances by providing periodic digital charts in designated accounts. <br />
            <br /><i>I’d love to hear what you think of EntreeLab and if there is anything we can improve. If you have any questions or feedback, please send me a direct mail on damie.ajayi@entreelab.org. I’m always happy to help! <br />
            <br />We will check in with you shortly. Until then, enjoy learning with us.</i> <br />
            <br />Cheers!<hr />
            Damie Ajayi<br />
            Founder & CEO<br />
            EntreeLab Inc.<br /><br /><br />


            NOTE:
            Password: ${this.formValues.password}
          </p>
        `,
      };
      try {
        const config = {
          method: "post",
          url: "https://entreelab.com.ng/src/api/mail",
          data: mailValue,
        };
        await this.axios(config);
      } catch (error) {
        console.log(error.message);
      }
    }, //end of sendMail
    async registerUser(){
      this.isBtnDisabled = !this.isBtnDisabled;
      this.showProgress = !this.showProgress;
      try {
        const config = {
          method: "post",
          url: "https://entreelab.com.ng/src/api/register",
          data: this.formValues,
        };
        const response = await this.axios(config);
        if (response.data) {
          this.notification.message = "Registration Successful!";
          this.notification.countdown = 20;
          this.notification.type = "success";
          // send mail
          await this.sendMail();
          localStorage.setItem("token", `${response.data.token_type} ${response.data.access_token}`);
          this.$router.push({name: "Home", data: response.data});
        } else {
          this.notification.message = "This is strange, server response is invalid!";
          this.notification.countdown = 20;
          this.notification.type = "danger";
          this.isBtnDisabled = !this.isBtnDisabled;
          this.showProgress = !this.showProgress;
        }
      } catch (error) {
        if (error.response) {
          this.notification.message = error.response.data;
          this.notification.countdown = 20;
          this.notification.type = "danger";
          this.isBtnDisabled = !this.isBtnDisabled;
          this.showProgress = !this.showProgress;
        } else if (error.request) {
          this.notification.message = error.request;
          this.notification.countdown = 20;
          this.notification.type = "danger";
          this.isBtnDisabled = !this.isBtnDisabled;
          this.showProgress = !this.showProgress;
        } else {
          this.notification.message = "Developer fucked up!";
          this.notification.countdown = 20;
          this.notification.type = "danger";
          this.isBtnDisabled = !this.isBtnDisabled;
          this.showProgress = !this.showProgress;
        }
      }
    },
  },
}
</script>
