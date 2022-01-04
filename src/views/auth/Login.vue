<template>
  <div class="c-app flex-row align-items-center">
    <CContainer>
      <CRow class="justify-content-center">
        <CCol md="8">
          <CRow>
            <CImg
              src="img/logo_c.png"
              block
              class="my-2"
              align="center"
              :fluid="true"
              width="300"
            />
          </CRow>
          <CProgress
            :value="100"
            v-show="showProgress"
            color="success"
            striped
            :animated="true"
            class="mb-2"
          />
          <CCardGroup>
            <CRow>
              <CCol md="6">
                <CCard
                  color="info"
                  text-color="white"
                  class="text-center py-5 d-md-down-none"
                  body-wrapper
                >
                  <CCardBody>
                    <!-- <h2>Sign up</h2> -->
                    <p>
                      Hello and Welcome to EntreeLab <br />
                      e-Learning Application!
                    </p>
                    <CButton
                      color="light"
                      variant="outline"
                      size="lg"
                      :disabled="isBtnDisabled"
                      @click="showProgress = !showProgress"
                      to="/register"
                    >
                      Register Now!
                    </CButton>
                  </CCardBody>
                </CCard>
              </CCol>
              <CCol md="6">
                <CCard class="p-4">
                  <CCardBody>
                    <CForm @submit="proceed">
                      <h1>Login</h1>
                      <p class="text-muted">Sign In to your account</p>
                      <CAlert
                        :show.sync="notification.countdown"
                        closeButton
                        :color="notification.type"
                        fade
                        v-html="(!notification.message) ? `Login ASAP!` : notification.message"
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
                        placeholder="Email Address"
                        type="email"
                        autocomplete="email"
                        name="email"
                        required="true"
                        v-model="formValues.email"
                      >
                        <template #prepend-content><CIcon name="cil-envelope-closed"/></template>
                      </CInput>
                      <CInput
                        placeholder="Password"
                        type="password"
                        autocomplete="current-password"
                        name="password"
                        required="true"
                        v-model="formValues.password"
                      >
                        <template #prepend-content><i class="fa fa-key"></i></template>
                        <template #append-content class=""><i @click="passwordVisibilityToggle" :class="`fa fa-eye ${passwordVisibilityColor}`"></i></template>
                      </CInput>
                      <CRow>
                        <CCol col="6" class="text-left">
                          <CButton color="info" type="submit" :disabled="isBtnDisabled" class="px-4">Login</CButton>
                        </CCol>
                        <CCol col="6" class="text-right">
                          <CButton color="link" :disabled="isBtnDisabled" class="px-0">Forgot password?</CButton>
                        </CCol>
                      </CRow>
                      <CRow>
                        <CCol col="12" class="text-center">
                          <p>New to EntreeLab? <br /><router-link to="register">Sign up</router-link></p>
                        </CCol>
                      </CRow>
                    </CForm>
                  </CCardBody>
                </CCard>
              </CCol>
            </CRow>
          </CCardGroup>
        </CCol>
      </CRow>
    </CContainer>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data(){
    return {
      passwordVisibilityColor: "text-success",
      showProgress: false,
      isBtnDisabled: false,
      formValues: {
        email: null,
        password: null,
      },
      notification: {
        type: "success",
        countdown: 20,
        message: null,
      },
    }
  },
  methods: {
    proceed () {
      event.preventDefault();
      this.submitForm();
    },
    passwordVisibilityToggle(){
      const passwordInput = document.querySelectorAll("input[autocomplete=current-password]");
      if(this.passwordVisibilityColor === "text-success") {
        passwordInput.forEach(input => {input.type = "text"});
        this.passwordVisibilityColor = "text-danger"
      } else {
        passwordInput.forEach(input => {input.type = "password"});
        this.passwordVisibilityColor = "text-success"
      }
    },
    async submitForm(){
      this.isBtnDisabled = !this.isBtnDisabled;
      this.showProgress = !this.showProgress;
      try {
        const config = {
          method: "post",
          url: "https://entreelab.com.ng/src/api/login",
          data: this.formValues,
        };
        const response = await this.axios(config);
        localStorage.setItem("token", `${response.data.token_type} ${response.data.access_token}`);
        localStorage.setItem("user_type", response.data.user.user_type);
        (response.data.user.avatar) ? localStorage.setItem("avatar", `https://entreelab.com.ng/src/storage/app/${response.data.user.avatar}`) : "img/logo_a.png";
        this.$router.push({name: "Home", data: response.data});
      } catch(error) {
        if (error.response) {
          this.notification.message = error.response.data.error;
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
