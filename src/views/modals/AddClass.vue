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
        <h5 class="px-3">Add a new class to your school</h5>
        <i class="btn btn-info fa fa-close pull-right" @click="updateModalVisibility"></i>
      </template>
      This represent a class level/arm in your school e.g. JSS1, B.E. 7, Year 10 etc... <hr />
			<CRow>
				<CCol lg="12">
					<CInput
						required="true"
						placeholder="Enter name of the class"
            v-model="formValues.grade_name"
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
            @click="newClass"
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
  name: "AddClass",
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
        message: "Loading Classes . . . ",
      },
    }
  },
  methods: {
    updateModalVisibility(){
      let visibility = this.showModal;
      this.$emit("show-modal", !visibility);
    }, //updateModalVisibility method
    async newClass () {
      try {
        this.isBtnDisabled = true;
        this.showProgress = true;
        const config = {
          method: "post",
          url: "https://entreelab.com.ng/src/api/classes",
          data: {
            grade_name: this.formValues.grade_name,
          },
          headers: {"Authorization" : localStorage.getItem("token"),},
        };
        const response = await this.axios(config);
        // this.updateModalVisibility();
        let updatedClasses = response.data;
        this.formValues.grade_name = null;
        this.$emit("show-classes", updatedClasses);
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
    }, //end of newClass
  },
}
</script>
