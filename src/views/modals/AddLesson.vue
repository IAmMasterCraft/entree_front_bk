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
        <h5 class="px-3">Add a new lesson for {{ $route.params.class.toUpperCase() }}</h5>
        <i class="btn btn-info fa fa-close pull-right" @click="updateModalVisibility"></i>
      </template>
			<CRow>
        <CCol sm="6">
          <CSelect
            label="Subject"
            required="true"
            autocomplete="off"
            :options="subjects"
            :value.sync="formValues.subject_id"
          >
            <template #append-content><i class="fa fa-refresh" @click="getSubjects" ></i></template>
          </CSelect>
        </CCol>
        <CCol sm="6">
          <CInput
            label="Lesson Title"
            required="true"
            placeholder="Enter Lesson title"
            v-model="formValues.lesson_title"
          />
        </CCol>
      </CRow>
      <CRow>
        <CCol sm="6">
          <CInputFile
            label="Upload Lessson"
            placeholder="Upload Lesson"
            required="true"
            ref="file"
            accept="video/*"
            autocomplete="off"
            @change="uploadFile"
          />
        </CCol>
        <CCol sm="6">
          <video controls v-if="formValues.lesson_file_data" width="350" height="200">
            <source :src="formValues.lesson_file_data" type="video/mp4">
          </video>
          <p class="text-danger" v-else>Kindly upload lesson video</p>
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
  name: "AddLesson",
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
        lesson_title: null,
        subject_id: null,
        class_id: this.$route.params.id,
        lesson_file: null,
        lesson_file_type: null,
        lesson_file_data: null,
        lesson_file_duration: null,
      },
      isBtnDisabled: false,
      showProgress: false,
      notification: {
        type: "success",
        countdown: 2,
        message: "Loading Subject . . . ",
      },
      subjects: [{label: "-- Select subject --", value: null,}],
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
          url: "https://entreelab.com.ng/src/api/subjects/new-topic",
          data: {
            "subject_id": this.formValues.subject_id,
            "topic": this.formValues.topic,
            "source": this.formValues.lesson_file_data,
            "video_length": this.formValues.lesson_file_duration
          },
          headers: {
            "Authorization" : localStorage.getItem("token"),
          },
        };
        const response = await this.axios(config);
        // this.updateModalVisibility();
        let updatedSubjects = response.data;
        this.formValues.lesson_title = null;
        this.formValues.subject_id = null;
        this.formValues.lesson_file = null;
        this.formValues.lesson_file_type = null;
        this.formValues.lesson_file_data = null;
        this.formValues.lesson_file_duration = null;
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
    }, //end of newLesson
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
            label: `${subject.grade_name} - ${subject.subject_name}`,
            value: subject.id,
          }
        });
        this.subjects = [ {label: "--Select Subject--", value: null,}, ...subjects];
      } catch(error) {
        if (error.response.data.message) {
          this.notification.message = error.response.data.message ?? `Something went wrong!</code>`;
          this.notification.countdown = 20;
          this.notification.type = "danger";
          this.teachers = [{label: "-- Please refresh subject list --", value: null,}];
        } else {
          this.notification.message = error.message ?? `Something went wrong!</code>`;
          this.notification.countdown = 20;
          this.notification.type = "danger";
          this.teachers = [{label: "-- Please refresh subject list --", value: null,}];
        }
        
      }
    }, //end of getSubjects
    uploadFile(a){
      // console.log(b);
      this.formValues.lesson_file = a[0];
      this.formValues.lesson_file_type = a[0]['type'];
      // this.formValues.lesson_file_duration = a[0]['duration'];
      const fileReader = new FileReader();
      fileReader.onload = (e) => {
        const media = new Audio(e.target.result);
        media.onloadedmetadata = () => {
          this.formValues.lesson_file_duration = media.duration;
        };
        this.formValues.lesson_file_data = e.target.result;
      }
      fileReader.readAsDataURL(this.formValues.lesson_file);
      // console.log(this.formValues);
    }, //end of uploadFile
  },
  mounted(){
    this.getSubjects();
  },
}
</script>