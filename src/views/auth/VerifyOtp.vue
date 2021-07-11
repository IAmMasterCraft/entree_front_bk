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
                <h1>Verify OTP</h1>
                <p class="text-muted">Create {{ $route.params.user_type }} account</p>
                <CAlert
                  :show.sync="notification.countdown"
                  closeButton
                  :color="notification.type"
                  fade
                  v-html="(!notification.message) ? `Verify OTP for ${$route.params.data.phone_number}` : notification.message"
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
                <CInput
                  placeholder="OTP Code"
                  type="number"
                  autocomplete="otp"
                  name="otp"
                  required="true"
                  class="mb-4"
                  v-model="formValues.otp"
                >
                  <template #prepend-content><i class="fa fa-key"></i></template>
                  <template #append-content class=""><i @click="passwordVisibilityToggle" :class="`fa fa-eye ${passwordVisibilityColor}`"></i></template>
                </CInput>
                <CButton type="submit" :disabled="isBtnDisabled" color="info" block>VERIFY OTP</CButton>
              </CForm>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </CContainer>
  </div>
</template>

<script>
//transform: rotate(20deg);
export default {
  name: 'VerifyOtp',
  data () {
    return {
      notification: {
        type: "success",
        countdown: 20,
        message: null,
      },
      isBtnDisabled: false,
      showProgress: false,
      passwordVisibilityColor: "text-success",
      formErrors: {
        otp: null,
      },
      formValues: {
        otp: null,
      },
      userData: null,
    }
  },
  methods: {
    proceed (event) {
      event.preventDefault();
      this.formErrors.otp = (!this.formValues.email) ? "OTP is Required!" : null;

      if (
        this.formValues.otp
      ) {
        this.submitForm();
      }
    },
    passwordVisibilityToggle(){
      const passwordInput = document.querySelectorAll("input[autocomplete=otp]");
      if(this.passwordVisibilityColor === "text-success") {
        passwordInput.forEach(input => {input.type = "text"});
        this.passwordVisibilityColor = "text-danger"
      } else {
        passwordInput.forEach(input => {input.type = "password"});
        this.passwordVisibilityColor = "text-success"
      }
    },
    async submitForm(){
      //disable button
      this.isBtnDisabled = true;
      //show progress
      this.showProgress = !this.showProgress;
      this.verifyOtp();
    },
    async verifyOtp () {
        try {
            const config = {
                method: "post",
                url: "https://sandbox-api.sendchamp.com/api/v1/verification/confirm",
                data: {
                    verification_reference: this.userData.verification_reference,
                    verification_code: this.formValues.otp,
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
              };
              // location.href += `/verify-otp`;
              this.$router.push({name: "ProfileSetup", params: {data}});
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
  },
  created () {
      this.userData = this.$route.params.data;
  },
}
</script>
