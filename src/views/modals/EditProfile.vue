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
            v-if="!index.includes('avatar') && !index.includes('bio')"
            :placeholder="`Enter ${index.replace(/_/g, ' ')}`"
            v-model="formValues[index]"
          />
          <img 
            rounded 
            thumbnail 
            :src="new_pic" 
            v-if="index.includes('avatar')"
            class="mb-3"
            width="100" 
            height="100"
          />
          <CInputFile
            :label="`CHANGE ${index.toUpperCase().replace(/_/g, ' ')}`"
            required="true"
            type="file"
            ref="file"
            accept="image/*"
            autocomplete="off"
            @change="uploadPicture"
            v-if="index.includes('avatar')"
            :placeholder="`Select ${index.replace(/_/g, ' ')}`"
          />
          <hr v-if="index.includes('bio')" />
          <video controls v-if="index.includes('bio')" width="350" height="200">
            <source :src="formValues.bio_file_data" type="video/mp4">
          </video>
          <CInputFile
            label="Upload Bio Video"
            placeholder="Upload Bio Video"
            required="true"
            ref="file"
            accept="video/*"
            autocomplete="off"
            @change="uploadFile"
            v-if="index.includes('bio')"
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
            @click="updateProfile"
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
      picture_file: null,
      picture_file_type: null,
    }
  },
  methods: {
    async updateProfile () {
      try {
        this.isBtnDisabled = true;
        this.showProgress = true;
        const formData = new FormData();
        formData.append("school_name", this.formValues.school_name);
        formData.append("email_address", this.formValues.email_address);
        formData.append("phone_number", this.formValues.phone_number);
        formData.append("school_address", this.formValues.school_address);
        formData.append("state", this.formValues.states);
        formData.append("lga", this.formValues.lga);
        formData.append("avatar", this.picture_file);
        formData.append("first_name", this.formValues.first_name);
        formData.append("last_name", this.formValues.last_name);
        formData.append("description", this.formValues.description);
        formData.append("bio", this.formValues.bio_file);
        const config = {
          method: "post",
          url: `${/*window.location.origin*/'https://entreelab.org'}/src/api/user-profile`,
          data: formData,
          headers: {
            "Authorization" : localStorage.getItem("token"),
            "Content-Type": 'multipart/form-data',
          },
        };
        const response = await this.axios(config);
        this.formValues = null;
        (response.data.user.avatar) ? localStorage.setItem("avatar", `${window.location.origin}/src/storage/app/${response.data.user.avatar}`) : localStorage.setItem("avatar", "img/logo_a.png");
        this.isBtnDisabled = false;
        this.showProgress = false;
        this.$emit("show-profile", response.data);
      } catch (error) {
        if (error.response) {
          this.notification.message = error.response.data.message ?? `<code>STATUS: ${error.response.data.error.status ?? ""}<br />MESSAGE: ${error.response.data.error.message ?? error}</code>`;
          this.notification.countdown = 20;
          this.notification.type = "danger";
          this.isBtnDisabled = !this.isBtnDisabled;
          this.showProgress = !this.showProgress;
        } else if (error.request) {
          console.log(error.request);
        } else {
          console.log("Developer fucked up!");
        }
      }
    }, //end of updateProfile
    uploadPicture(evt){
      this.picture_file = evt[0];
      console.log(evt);
      this.picture_file_type = evt[0]['type'];
      const fileReader = new FileReader();
      fileReader.onload = (e) => {
        this.new_pic = e.target.result;
      }
      fileReader.readAsDataURL(this.picture_file);
    }, //end of uploadPicture
    uploadFile(a){
      // console.log(b);
      this.formValues.bio_file = a[0];
      const fileReader = new FileReader();
      fileReader.onload = (e) => {
        this.formValues.bio_file_data = e.target.result;
      }
      fileReader.readAsDataURL(this.formValues.bio_file);
      // console.log(this.formValues);
    }, //end of uploadFile
    updateModalVisibility(){
      let visibility = this.showModal;
      this.$emit("show-modal", !visibility);
    }, //updateModalVisibility method
  },
  created () {
    this.new_pic = this.userProfile.user.avatar;
    if (this.user === 2) {
      this.formValues = {
        school_name: this.userProfile.user_details.school_name,
        email_address: this.userProfile.user.email,
        phone_number: this.userProfile.user.phone_number,
        school_address: this.userProfile.user_details.school_address,
        state: this.userProfile.user_details.state,
        lga: this.userProfile.user_details.lga,
        avatar: this.userProfile.user.avatar,
      };
    }
    if (this.user === 3) {
      this.formValues = {
        first_name: this.userProfile.user.first_name,
        last_name: this.userProfile.user.last_name,
        phone_number: this.userProfile.user.phone_number,
        email_address: this.userProfile.user.email,
        avatar: this.userProfile.user.avatar,
        description: this.userProfile.user_details.description,
        bio: this.userProfile.user_details.bio ?? 'new',
      };
    }
    if (this.user === 4) {
      this.formValues = {
        first_name: this.userProfile.user.first_name,
        last_name: this.userProfile.user.last_name,
        phone_number: this.userProfile.user.phone_number,
        email_address: this.userProfile.user.email,
        avatar: this.userProfile.user.avatar,
      };
    }
    if (this.user === 5) {
      this.formValues = {
        first_name: this.userProfile.user.first_name,
        last_name: this.userProfile.user.last_name,
        phone_number: this.userProfile.user.phone_number,
        email_address: this.userProfile.user.email,
        avatar: this.userProfile.user.avatar,
      };
    }
  },
}
</script>
