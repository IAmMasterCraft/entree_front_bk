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
                <h1>Mailer</h1>
                <p class="text-muted">Send Mail</p>
                <CAlert
                  :show.sync="notification.countdown"
                  closeButton
                  :color="notification.type"
                  fade
                  v-html="(!notification.message) ? `Send Mail` : notification.message"
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
                    placeholder="Sender's Name"
                    type="name"
                    autocomplete="name"
                    name="sender_name"
                    required="true"
                    class="mb-4"
                    v-model="formValues.sender_name"
                  >
                    <template #prepend-content><i class="fa fa-user"></i></template>
                  </CInput>
                <p class="text-danger" v-show="(formErrors.sender_name) ? true : false">{{ formErrors.sender_name }}</p>
                <CInput
                  placeholder="Receiver's Email Address"
                  autocomplete="email"
                  name="email"
                  type="email"
                  required="true"
                  v-model="formValues.receiver_email"
                >
                  <template #prepend-content><i class="fa fa-envelope"></i></template>
                </CInput>
                <p class="text-danger" v-show="(formErrors.receiver_email) ? true : false">{{ formErrors.receiver_email }}</p>
                <template>
                  <CInput
                    placeholder="Receiver's Name"
                    type="name"
                    autocomplete="name"
                    name="receiver_name"
                    required="true"
                    class="mb-4"
                    v-model="formValues.receiver_name"
                  >
                    <template #prepend-content><i class="fa fa-user"></i></template>
                  </CInput>
                  <p class="text-danger" v-show="(formErrors.receiver_name) ? true : false">{{ formErrors.receiver_name }}</p>
                  <CInput
                    placeholder="Subject"
                    name="subject"
                    required="true"
                    class="mb-4"
                    v-model="formValues.subject"
                  >
                    <template #prepend-content><i class="fa fa-map-marker"></i></template>
                  </CInput>
                  <p class="text-danger" v-show="(formErrors.subject) ? true : false">{{ formErrors.subject }}</p>
                  <CTextarea
                    placeholder="Enter Message"
                    horizontal
                    v-model="formValues.body"
                    required="true"
                    rows="5"
                />
                <p class="text-danger" v-show="(formErrors.message) ? true : false">{{ formErrors.message }}</p>
                </template>
                <CButton
                  type="submit"
                  :disabled="isBtnDisabled"
                  color="info"
                  class="mb-4"
                  block>{{ `Send Mail`.toUpperCase() }}
                </CButton>
                <hr />
              </CForm>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </CContainer>
  </div>
</template>

<script>
export default {
  name: 'Mail',
  data () {
    // this.updateLga();
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
        sender_name: null,
        receiver_email: null,
        receiver_name: null,
        subject: null,
        message: null,
      },
      formValues: {
        sender_name: "EntreeLab Broadcast",
        receiver_email: null,
        receiver_name: null,
        subject: null,
        body: null,
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
    validateEmail(email) {
      const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(String(email).toLowerCase());
    },
    async submitForm(){
      try {
        // const response = await fetch(`${window.location.origin}/src/api/auth/register`, {
        //   method: "POST",
        //   body: JSON.stringify(data),
        //   headers: {
        //     "Content-type": "application/json; charset=UTF-8",
        //     "Authorization": `Bearer none-for-now-replace-with-jwt`,
        //   }
        // });
        // this.sendOtp();
        this.sendMail();
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
    async sendMail(){
      try {
        const config = {
          method: "post",
          url: `${window.location.origin}/src/api/mail`,
          data: this.formValues,
        };
        const response = await this.axios(config);
        if (response.data) {
          this.notification.message = "Broadcast sent successfully!";
          this.notification.countdown = 20;
          this.notification.type = "success";
          this.isBtnDisabled = !this.isBtnDisabled;
          this.showProgress = !this.showProgress;
        } else {
          this.notification.message = "This is strange, server response is invalid!";
          this.notification.countdown = 20;
          this.notification.type = "danger";
          this.isBtnDisabled = !this.isBtnDisabled;
          this.showProgress = !this.showProgress;
        }
      } catch (error) {
        console.log(error.message);
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
    }, //end of sendMail
  },
}
</script>
