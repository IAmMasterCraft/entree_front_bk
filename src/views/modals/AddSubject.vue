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
        <h5 class="px-3">Add a new subject for {{ $route.params.class.toUpperCase() }}</h5>
        <i class="btn btn-info fa fa-close pull-right" @click="updateModalVisibility"></i>
      </template>
			<CRow>
        <CCol sm="6">
          <CInput
            label="Subject Name"
            required="true"
            placeholder="Enter Subject name"
            v-model="formValues.subject_name"
          />
        </CCol>
        <CCol sm="6">
          <CSelect
            label="Teacher"
            required="true"
            autocomplete="off"
            :options="teachers"
            :value.sync="formValues.teachers_id"
          >
            <template #append-content><i class="fa fa-refresh" @click="getTeachers" ></i></template>
          </CSelect>
        </CCol>
      </CRow>
			<CRow>
				<CCol lg="12">
					<CButton
						type="submit"
						color="info"
						block
            :disabled="isBtnDisabled"
            @click="newSubject"
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
  name: "AddSubject",
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
        subject_name: null,
        teachers_id: null,
        class_id: this.$route.params.id,
      },
      isBtnDisabled: false,
      showProgress: false,
      notification: {
        type: "success",
        countdown: 2,
        message: "Loading Subject . . . ",
      },
      teachers: [{label: "-- Select the teacher for the subject --", value: null,}],
    }
  },
  methods: {
    updateModalVisibility(){
      let visibility = this.showModal;
      this.$emit("show-modal", !visibility);
    }, //updateModalVisibility method
    async newSubject () {
      try {
        this.isBtnDisabled = true;
        this.showProgress = true;
        const config = {
          method: "post",
          url: `${/*window.location.origin*/'https://entreelab.org'}/src/api/subjects`,
          data: {
            subject_name: this.formValues.subject_name,
            class_id: this.formValues.class_id,
            teachers_id: this.formValues.teachers_id,
          },
          headers: {"Authorization" : localStorage.getItem("token"),},
        };
        const response = await this.axios(config);
        // this.updateModalVisibility();
        let updatedSubjects = response.data;
        this.formValues.subject_name = null;
        this.formValues.class_id = null;
        this.formValues.teachers_id = null;
        this.$emit("show-subjects", updatedSubjects);
        // localStorage.setItem("token", `${response.data.token_type} ${response.data.access_token}`);
        // this.$router.push({name: "Home", data: response.data});
      } catch(error) {
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
    }, //end of newSubject
    async getTeachers(){
      //[{value: 'teacher_id', label: 'teacher_name'}]
      try {
        const config = {
          method: "get",
          url: `${/*window.location.origin*/'https://entreelab.org'}/src/api/teachers`,
          data: null,
          headers: {"Authorization" : localStorage.getItem("token"),},
          withCredentials: false,
        };
        const response = await this.axios(config);
        // this.showData(response.data);
        const teachers = response.data.map(teacher => {
          return {
            label: `${teacher.first_name} ${teacher.last_name}`,
            value: teacher.id,
          }
        });
        this.teachers = [ {label: "--Select Teacher--", value: null,}, ...teachers];
      } catch(error) {
        if (error.response.data.message) {
          this.notification.message = error.response.data.message ?? `Something went wrong!</code>`;
          this.notification.countdown = 20;
          this.notification.type = "danger";
          this.teachers = [{label: "-- Please refresh teachers list --", value: null,}];
        } else {
          this.notification.message = error.message ?? `Something went wrong!</code>`;
          this.notification.countdown = 20;
          this.notification.type = "danger";
          this.teachers = [{label: "-- Please refresh teachers list --", value: null,}];
        }
        
      }
    }, //end of getTeachers
  },
  mounted(){
    this.getTeachers();
  },
}
</script>
