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
        <h5 class="px-3">Update User Profile</h5>
        <i class="btn btn-info fa fa-close pull-right" @click="updateModalVisibility"></i>
      </template>
			<CRow>
        <CCol sm="6" v-for="(val, index) in formValues" :key="index">
          <CInput
            :label="index.toUpperCase().replace(/_/g, ' ')"
            required="true"
            :disabled="(index.includes('avatar')) ? true : false"
            autocomplete="off"
            :placeholder="`Enter ${index.replace(/_/g, ' ')}`"
            v-model="formValues[index]"
          />
          <CInput
            :label="`SELECT ${index.toUpperCase().replace(/_/g, ' ')}`"
            required="true"
            type="file"
            autocomplete="off"
            v-if="index.includes('avatar')"
            :placeholder="`Select ${index.replace(/_/g, ' ')}`"
            v-model="new_pic"
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
  name: "EditProfile",
  props: {
    showModal: {
      type: Boolean,
      required: true,
      default: false,
    },
    userProfile: {
      type: Object,
      required: true,
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
        message: "Loading Profile . . . ",
      },
      user: parseInt(localStorage.getItem("user_type")),
      new_pic: "",
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
          url: "https://entreelab.com.ng/src/api/register",
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
  created () {
    if (this.user === 2) {
      this.formValues = {
        school_name: this.userProfile.user_details.school_name,
        email: this.userProfile.user.email,
        phone_number: this.userProfile.user.phone_number,
        school_address: this.userProfile.user_details.school_address,
        state: this.userProfile.user_details.state,
        lga: this.userProfile.user_details.lga,
        avatar: this.userProfile.user.avatar,
      };
    }
  },
}
</script>
