<template>
  <div>
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
    <div v-if="!showProgress">
      <CRow>
        <CCol lg="12">
          <CCard class="mb-3 p-3" style="max=width: 540px">
            <CCardHeader>
              <CRow>
                <CCol lg="6">
                  <span>Profile</span>
                </CCol>
                <CCol lg="6" >
                  <EditProfile :showModal="showModal" @show-modal="toggleModal" @show-profile="updateProfile" :userProfile="profile" />
                  <CButton
                    color="success"
                    variant="outline"
                    square
                    class="text-right float-right"
                    size="sm"
                    :disabled="isBtnDisabled"
                    @click="toggleModal"
                    >
                      Edit Profile
                    </CButton>
                </CCol>
              </CRow>
            </CCardHeader>
            <CRow class="g-0 my-4">
              <CCol :md="4">
                <img rounded thumbnail :src="profile.user.avatar" width="200" height="200"/>
              </CCol>
              <CCol :md="8">
                <CCardBody v-if="user === 2">
                  <CCardTitle>
                    {{ profile.user_details.school_name }}
                  </CCardTitle>
                  <CCardText>
                    {{ profile.user.email }}
                  </CCardText>
                  <CCardText>
                    {{ profile.user.phone_number }}
                  </CCardText>
                  <CCardText>
                    {{ profile.user_details.school_address }}
                  </CCardText>
                  <CCardText>
                    {{ profile.user_details.lga }}
                  </CCardText>
                  <CCardText>
                    {{ profile.user_details.state }}
                  </CCardText>
                  <CCardText><small class="text-muted">{{ profile.user_details.createddate }}</small></CCardText>
                </CCardBody>

                <CCardBody v-if="user === 3">
                  <CCardTitle>
                    {{ profile.user.first_name }} {{ profile.user.last_name }}
                  </CCardTitle>
                  <CCardText>
                    {{ profile.user.email }}
                  </CCardText>
                  <CCardText>
                    {{ profile.user.phone_number }}
                  </CCardText>
                  <CCardText>
                    {{ profile.user_details.description }}
                  </CCardText>
                  <CCardText><small class="text-muted">{{ profile.user_details.createddate }}</small></CCardText>
                </CCardBody>

                <CCardBody v-if="user === 5">
                  <CCardTitle>
                    {{ profile.user.first_name }} {{ profile.user.last_name }}
                  </CCardTitle>
                  <CCardText>
                    {{ profile.user.email }}
                  </CCardText>
                  <CCardText>
                    {{ profile.user.phone_number }}
                  </CCardText>
                  <CCardText>
                    {{ profile.user_details.ward_count }} Student(s) at {{ profile.user_details.school_name }}
                  </CCardText>
                  <CCardText><small class="text-muted">{{ profile.user.createddate }}</small></CCardText>
                </CCardBody>
              </CCol>
            </CRow>
          </CCard>
        </CCol>
      </CRow>
    </div>
  </div>
</template>

<script>
import EditProfile from '../modals/EditProfile';

export default {
  name: 'Profile',
  components: {
    EditProfile
  },
  data () {
    return {
      isBtnDisabled: false,
      showProgress: true,
      user: parseInt(localStorage.getItem("user_type")),
      notification: {
        type: "success",
        countdown: 2,
        message: "Loading Profile . . . ",
      },
      showModal: false,
      profile: {},
      collapseDuration: 0
    }
  },
  methods: {
    color (value) {
      let $color
      if (value <= 25) {
        $color = 'info'
      } else if (value > 25 && value <= 50) {
        $color = 'success'
      } else if (value > 50 && value <= 75) {
        $color = 'warning'
      } else if (value > 75 && value <= 100) {
        $color = 'danger'
      }
      return $color
    },
    getBadge (status) {
      switch (status) {
        case 'Active': return 'success'
        case 'Inactive': return 'secondary'
        case 'Pending': return 'warning'
        case 'Banned': return 'danger'
        default: 'primary'
      }
    },
    toggleDetails (item) {
      this.$set(this.items[item.id], '_toggled', !item._toggled)
      this.collapseDuration = 300
      this.$nextTick(() => { this.collapseDuration = 0})
    },
    async getProfile () {
      try {
        const config = {
          method: "get",
          url: `${window.location.origin}/src/api/user-profile`,
          data: null,
          headers: {"Authorization" : localStorage.getItem("token"),},
          withCredentials: false,
        };
        const response = await this.axios(config);
        this.showData(response.data);
      } catch (error) {
        if (error.response) {
          this.notification.message = error.response.data.message ?? `<code>STATUS: ${error.response.data.error.status}<br />MESSAGE: ${error.response.data.error.message}</code>`;
          this.notification.countdown = 20;
          this.notification.type = "danger";
          // this.isBtnDisabled = !this.isBtnDisabled;
          // this.showProgress = !this.showProgress;
        } else if (error.request) {
          this.notification.message = `<code>Network Error!</code>`;
          this.notification.countdown = 20;
          this.notification.type = "danger";
          this.isBtnDisabled = false;
          this.showProgress = false;
        } else {
          console.log(error)
          console.log("Developer fucked up!");
          // this.notification.countdown = 20;
          // this.notification.type = "danger";
          // this.isBtnDisabled = !this.isBtnDisabled;
          // this.showProgress = !this.showProgress;
        }
      }
    }, //end of Profile
    showData(response){
      this.profile = response;
      this.showProgress = !this.showProgress;
      this.profile.user.avatar = (!this.profile.user.avatar) ? "img/logo_a.png" : `${window.location.origin}/src/storage/app/${this.profile.user.avatar}`;
    }, //end of showData
    toggleModal(){
      this.showModal = !this.showModal;
    }, //end of toggleModal
    updateProfile(profileInfo) {
      this.showProgress = !this.showProgress;
      this.showModal = false;
      this.showData(profileInfo);
    }, //end of updateProfile
  },
  created(){
    this.getProfile();
  }
}
</script>
