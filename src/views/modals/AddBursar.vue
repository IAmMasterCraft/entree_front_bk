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
        <h5 class="px-3">Add a new bursar to your school</h5>
        <i class="btn btn-info fa fa-close pull-right" @click="updateModalVisibility"></i>
      </template>
      This personnel handles accounting<hr />
			<CRow>
        <CCol sm="6">
          <CInput
            label="First Name"
            required="true"
            autocomplete="off"
            placeholder="Enter Bursar's first name"
            v-model="formValues.first_name"
          />
        </CCol>
        <CCol sm="6">
          <CInput
            label="Last Name"
            required="true"
            autocomplete="off"
            placeholder="Enter Bursar's last name"
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
            placeholder="Enter Bursar's email address"
            v-model="formValues.t_email"
          />
        </CCol>
        <CCol sm="6">
          <CInput
            label="Password"
            required="true"
            autocomplete="off"
            placeholder="Enter Bursar's password"
            v-model="formValues.t_password"
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
            @click="newBursar"
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
  name: "AddBursar",
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
        grade_name: null,
      },
      isBtnDisabled: false,
      showProgress: false,
      notification: {
        type: "success",
        countdown: 2,
        message: "Loading Bursars . . . ",
      },
    }
  },
  methods: {
    updateModalVisibility(){
      let visibility = this.showModal;
      this.$emit("show-modal", !visibility);
    }, //updateModalVisibility method
    async newBursar () {
      try {
        this.isBtnDisabled = true;
        this.showProgress = true;
        const user = localStorage.getItem("user_type");
        const config = {
          method: "post",
          url: `${window.location.origin}/src/api/register`,
          data: {
            user_type: 6,
            first_name: this.formValues.first_name,
            last_name: this.formValues.last_name,
            email: this.formValues.t_email,
            password: this.formValues.t_password,
            school_id: (user == 2) ? user : null,
          },
          headers: {"Authorization" : localStorage.getItem("token"),},
        };
        const response = await this.axios(config);
        // this.updateModalVisibility();
        let updatedBursar = response.data;
        this.formValues.first_name = null;
        this.formValues.last_name = null;
        this.formValues.t_email = null;
        this.formValues.t_password = null;
        this.$emit("show-bursar", updatedBursar);
        // localStorage.setItem("token", `${response.data.token_type} ${response.data.access_token}`);
        // this.$router.push({name: "Home", data: response.data});
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
    }, //end of newBursar
  },
}
</script>
