<template>
  <div>
    <CModal
      color="info"
      :show.sync="showModal"
      :closeOnBackdrop="false"
      size="lg"
    >
      <CRow>
        <CCol lg="12">
          <CAlert
            :show.sync="notification.countdown"
            closeButton
            :color="notification.type"
            fade
            v-html="notification.message"
          />
        </CCol>
      </CRow>
      <CRow>
        <CCol lg="12">
          <CProgress
            :value="100"
            v-show="showProgress"
            color="success"
            striped
            :animated="true"
            class="mb-2"
          />
        </CCol>
    </CRow>
      <template v-slot:header>
        <h5 class="px-3">Add a new teacher to your school</h5>
        <i class="btn btn-info fa fa-close pull-right" @click="updateModalVisibility"></i>
      </template>
      This represent an instructor in your school <hr />
			<CRow>
        <CCol sm="6">
          <CInput
            label="First Name"
            required="true"
            autocomplete="off"
            placeholder="Enter Teacher's first name"
            v-model="formValues.first_name"
          />
        </CCol>
        <CCol sm="6">
          <CInput
            label="Last Name"
            required="true"
            autocomplete="off"
            placeholder="Enter Teacher's last name"
            v-model="formValues.last_name"
          />
        </CCol>
      </CRow>
      <CRow>
        <CCol sm="6">
          <CInput
            label="Email Address"
            required="true"
            autocomplete="off"
            placeholder="Enter Teacher's email address"
            v-model="formValues.t_email"
          />
        </CCol>
        <CCol sm="6">
          <CInput
            label="Password"
            required="true"
            autocomplete="off"
            placeholder="Enter Teacher's password"
            v-model="formValues.t_password"
          />
        </CCol>
      </CRow>
      <CRow>
        <CCol sm="12">
          <CTextarea
            label="Teacher's Bio"
            autocomplete="off"
            placeholder="Enter Teacher's Bio"
            v-model="formValues.bio"
          />
        </CCol>
      </CRow>
			<CRow>
				<CCol lg="12">
					<CButton
						type="submit"
						color="info"
						block
            :disabled="isBtnDisabled"
            @click="newTeacher"
          >
            {{ `submit`.toUpperCase() }}
					</CButton>
				</CCol>
			</CRow>
      <template v-slot:footer>
          <CButton v-show="false">Close</CButton>
      </template>
    </CModal>
  </div>
</template>

<script>
export default {
  name: "AddTeacher",
  props: {
    showModal: {
      type: Boolean,
      required: true,
      default: false,
    },
    classes: {
      type: Array,
    }
  },
  data () {
    return {
      warningModal: false,
      formValues: {
        first_name: null,
        last_name: null,
        t_email: null,
        t_password: null,
        bio: null,
      },
      isBtnDisabled: false,
      showProgress: false,
      notification: {
        type: "success",
        countdown: 2,
        message: "Loading Teacher . . . ",
      },
    }
  },
  methods: {
    updateModalVisibility(){
      let visibility = this.showModal;
      this.$emit("show-modal", !visibility);
    }, //updateModalVisibility method
    async sendMail(){
      const mailValue = {
        receiver_name: `${this.formValues.first_name} ${this.formValues.last_name}`,
        receiver_email: this.formValues.t_email,
        subject: "Welcome on board!",
        body: `
          <p>
            Hey ${this.formValues.first_name} ${this.formValues.last_name},<br />
            <br />I’m Damie Ajayi, the founder of EntreeLab and I’d like to personally thank you for signing up to our platform.<br />
            <br />We established Entreelab in order to have a central learning hub where multiple users have access to training and evaluation tools needed for learning in one place. The APP is designed to help Educators, Parents and Students to monitor activities and performances by providing periodic digital charts in designated accounts. <br />
            <br /><i>I’d love to hear what you think of EntreeLab and if there is anything we can improve. If you have any questions or feedback, please send me a direct mail on damie.ajayi@entreelab.org. I’m always happy to help! <br />
            <br />We will check in with you shortly. Until then, enjoy learning with us.</i> <br />
            <br />Cheers!<hr />
            Damie Ajayi<br />
            Founder & CEO<br />
            EntreeLab Inc.<br /><br /><br />


            NOTE:
            Password: ${this.formValues.t_password}
          </p>
        `,
      };
      try {
        const config = {
          method: "post",
          url: `${window.location.origin}/src/api/mail`,
          data: mailValue,
        };
        await this.axios(config);
      } catch (error) {
        console.log(error.message);
      }
    }, //end of sendMail
    async newTeacher () {
      try {
        this.isBtnDisabled = true;
        this.showProgress = true;
        const config = {
          method: "post",
          url: `${window.location.origin}/src/api/register`,
          data: {
            user_type: 3,
            first_name: this.formValues.first_name,
            last_name: this.formValues.last_name,
            email: this.formValues.t_email,
            password: this.formValues.t_password,
            description: this.formValues.bio,
          },
          headers: {"Authorization" : localStorage.getItem("token"),},
        };
        await this.axios(config);
        // send mail
        await this.sendMail();
        this.formValues = null;
        this.$emit("show-teachers", true);
      } catch(error) {
        if (error.response) {
          this.notification.message = error.response.data.message ?? `<code>STATUS: ${error.response.data.error.status}<br />MESSAGE: ${error.response.data.error.message}</code>`;
          this.notification.countdown = 20;
          this.notification.type = "danger";
          // this.isBtnDisabled = !this.isBtnDisabled;
          // this.showProgress = !this.showProgress;
        } else if (error.request) {
          console.log(error.request);
          // this.notification.countdown = 20;
          // this.notification.type = "danger";
          // this.isBtnDisabled = !this.isBtnDisabled;
          // this.showProgress = !this.showProgress;
        } else {
          console.log("Developer fucked up!");
          // this.notification.countdown = 20;
          // this.notification.type = "danger";
          // this.isBtnDisabled = !this.isBtnDisabled;
          // this.showProgress = !this.showProgress;
        }
      }
    }, //end of newTeacher
  },
}
</script>
