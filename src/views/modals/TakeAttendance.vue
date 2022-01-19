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
        <h5 class="px-3">Add a new Student to your school</h5>
        <i class="btn btn-info fa fa-close pull-right" @click="updateModalVisibility"></i>
      </template>
      <CRow>
				<CCol sm="6">
					<CInput
						label="First Name"
						required="true"
						placeholder="Enter Student's first name"
            v-model="formValues.first_name"
					/>
				</CCol>
				<CCol sm="6">
					<CInput
						label="Last Name"
						required="true"
						placeholder="Enter Student's last name"
            v-model="formValues.last_name"
					/>
				</CCol>
			</CRow>
      <CRow>
				<CCol sm="6">
					<CInput
						label="Email Address"
						required="true"
            type="email"
						placeholder="Enter email address"
            v-model="formValues.email"
					/>
				</CCol>
				<CCol sm="6">
					<CInput
						label="Password"
						required="true"
						placeholder="Enter Student's password"
            v-model="formValues.password"
					/>
				</CCol>
			</CRow>
      <CRow>
				<CCol sm="6">
          <span tag="label" class="col-form-label">Subjects</span>
					<CInputCheckbox
            v-for="(subject, index) in subjects"
            :key="index"
            :label="subject.label"
            :value="subject.value"
            required="true"
            :options="subjects"
            @change="subjectCheckbox"
            />
				</CCol>
			</CRow> <br />
			<CRow>
				<CCol lg="12">
					<CButton
						type="submit"
						color="info"
						block
            :disabled="isBtnDisabled"
            @click="newStudent"
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
  name: "TakeAttendance",
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
        email: null,
        password: null,
        subjects: [],
        class_id: parseInt(this.$route.params.id),
        user_type: 4,
      },
      isBtnDisabled: false,
      showProgress: false,
      notification: {
        type: "success",
        countdown: 2,
        message: "Loading Subject . . . ",
      },
      subjects: ["Please Wait!!!"],
    }
  },
  methods: {
    updateModalVisibility(){
      let visibility = this.showModal;
      this.$emit("show-modal", !visibility);
    }, //updateModalVisibility method
    async newStudent () {
      try {
        this.isBtnDisabled = true;
        this.showProgress = true;
        const config = {
          method: "post",
          url: "https://entreelab.com.ng/src/api/register",
          data: this.formValues,
          headers: {"Authorization" : localStorage.getItem("token"),},
        };
        const response = await this.axios(config);
        // this.updateModalVisibility();
        let updatedStudents = response.data;
        this.formValues.user_type = null;
        this.formValues.first_name = null;
        this.formValues.last_name = null;
        this.formValues.email = null;
        this.formValues.password = null;
        this.formValues.subjects = null;
        this.$emit("show-students", updatedStudents);
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
    }, //end of newStudent
    async getSubjects(){
      try {
        const config = {
          method: "get",
          url: `https://entreelab.com.ng/src/api/school/subjects/${this.$route.params.id}`,
          data: null,
          headers: {"Authorization" : localStorage.getItem("token"),},
          withCredentials: false,
        };
        const response = await this.axios(config);
        // this.showData(response.data);
        const subjects = response.data.map(subject => {
          return {
            label: subject.subject_name,
            value: subject.id,
          }
        });
        // this.subjects = [...subjects, {label: "Chem", value: 2}];
        this.subjects = subjects;
      } catch(error) {
        if (error.response.data.message) {
          this.notification.message = error.response.data.message ?? `Something went wrong!</code>`;
          this.notification.countdown = 20;
          this.notification.type = "danger";
          this.teachers = [{label: "Something went wrong", value: null,}];
        } else {
          this.notification.message = error.message ?? `Something went wrong!</code>`;
          this.notification.countdown = 20;
          this.notification.type = "danger";
          this.teachers = [{label: "Something went wrong", value: null,}];
        }
        
      }
    }, //end of getSubjects
    subjectCheckbox(event){
      const subjectId = event.target.value;
      if (this.formValues.subjects.includes(subjectId)) this.formValues.subjects = this.formValues.subjects.filter(id => id !== subjectId);
      else this.formValues.subjects.push(parseInt(subjectId));
    }, //end of subjectCheckbox
  },
  mounted(){
    this.getSubjects();
  },
}
</script>
