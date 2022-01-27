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
        <h5 class="px-3">Setup Booklet</h5>
        <i class="btn btn-info fa fa-close pull-right" @click="updateModalVisibility"></i>
      </template>
      <div v-if="!isBtnDisabled && !showProgress && true == false">
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
          <CCol sm="12">
            <CSelect
                label="Choose File type for lesson"
                required="true"
                :options="filetype_options"
                :value.sync="selected_filetype"
              />
          </CCol>
        </CRow>
        <CRow>
          <CCol sm="6">
            <CInputFile
              label="Upload Lessson (MP4 Video File)"
              placeholder="Upload Lesson"
              required="true"
              ref="file"
              accept="video/*"
              autocomplete="off"
              @change="uploadFile"
              v-if="selected_filetype === 'video'"
            />
            <CInputFile
              label="Upload Lessson (PDF FIle)"
              placeholder="Upload Lesson"
              required="true"
              ref="file"
              accept="application/pdf"
              autocomplete="off"
              @change="uploadFile"
              v-if="selected_filetype === 'pdf'"
            />
          </CCol>
          <CCol sm="6">
            <video controls v-if="formValues.lesson_file_data && selected_filetype === 'video'" width="350" height="200">
              <source :src="formValues.lesson_file_data" type="video/mp4">
            </video>
            <iframe v-else-if="formValues.lesson_file_data && selected_filetype === 'pdf'" width="350" height="200"></iframe>
            <p class="text-danger" v-else>Kindly upload lesson video or pdf file</p>
          </CCol>
        </CRow>
        <CRow>
          <CCol sm="12">
            <CTextarea
              label="Lesson Description"
              autocomplete="off"
              rows="5"
              placeholder="Enter Lesson Description"
              v-model="formValues.description"
            />
          </CCol>
        </CRow>
        <hr />
        <CRow class="mb-4">
          <CCol sm="6">
            <h5>Setup Revision Quiz</h5>
          </CCol>
          <CCol sm="6">
            <CSwitch
              color="info"
              variant="3d"
              class="float-right"
              v-bind:checked.sync="setupQuestion"
            />
          </CCol>
        </CRow>
        <CRow v-if="setupQuestion">
          <CCol sm="6">
            <CInput
              label="Total Questions"
              required="true"
              type="number"
              placeholder="Enter total questions"
              v-model="total_questions"
              @change="modulatingQuestions"
            />
          </CCol>
          <CCol sm="6">
            <CInput
              label="General score per question"
              required="true"
              type="number"
              placeholder="Enter score per question"
              v-model="general_score"
            />
          </CCol>
        </CRow>
        <div v-for="(quest, index) in formValues.questions" :key="index">
          <div v-if="setupQuestion">
            <h5>Setup Question {{ index + 1}}</h5>
            <CRow>
              <CCol sm="12">
                <CTextarea
                  :label="`Question ${index + 1}`"
                  rows="5"
                  required="true"
                  :placeholder="`Enter question ${index + 1}`"
                  v-model="formValues.questions[index].question"
                />
              </CCol>
            </CRow>
            <CRow>
              <CCol sm="6">
                <CSelect
                  :label="`Select Correct Option for question ${index + 1}`"
                  rows="5"
                  required="true"
                  :options="mcq_options"
                  :value.sync="formValues.questions[index].correct_answer"
                />
              </CCol>
              <CCol sm="6">
                <CInput
                  :label="`Score for question ${index + 1}`"
                  required="true"
                  type="number"
                  placeholder="Enter total questions"
                  v-model="formValues.questions[index].score"
                />
              </CCol>
            </CRow>
            <CRow>
              <CCol sm="6">
                <CInput
                  label="Option A"
                  required="true"
                  placeholder="Enter option A"
                  v-model="formValues.questions[index].options.option_a"
                />
                <CInput
                  label="Option B"
                  required="true"
                  placeholder="Enter option B"
                  v-model="formValues.questions[index].options.option_b"
                />
              </CCol>
              <CCol sm="6">
                <CInput
                  label="Option C"
                  required="true"
                  placeholder="Enter option C"
                  v-model="formValues.questions[index].options.option_c"
                />
                <CInput
                  label="Option D"
                  required="true"
                  placeholder="Enter option D"
                  v-model="formValues.questions[index].options.option_d"
                />
              </CCol>
            </CRow>
            <hr />
          </div>
          
        </div>
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
      </div>
      <div v-else>
        <CRow>
          <CCol lg="12">
            <p class="text-danger mx-3">
              Uploading File, Please wait ...
            </p>
          </CCol>
        </CRow>
      </div>
      <template v-slot:footer>
          <CButton v-show="true">Close</CButton>
      </template>
    </CModal>
  </div>
</template>

<script>
export default {
  name: "AddBooklet",
  props: {
    showModal: {
      type: Boolean,
      required: true,
      default: false,
    },
    classes: {
      type: Array,
    },
    subjects: {
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
        description: null,
        // ---
        questions: [],
        // ---
      },
      setupQuestion: false,
      mcq_options: [
        {label: "-- Select correct option --", value: null,},
        {label: "Option A", value: "A",},
        {label: "Option B", value: "B",},
        {label: "Option C", value: "C",},
        {label: "Option D", value: "D",},
      ],
      filetype_options: [
        {label: "-- Select correct option --", value: null,},
        {label: "PDF File", value: "pdf",},
        {label: "MP4 Video File", value: "video",},
      ],
      selected_filetype: null,
      isBtnDisabled: false,
      showProgress: false,
      notification: {
        type: "success",
        countdown: 2,
        message: "Loading Subject . . . ",
      },
      // subjects: [{label: "-- Select subject --", value: null,}],
      total_questions: 1,
      general_score: 1,
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
        const formData = new FormData();
        formData.append("subject_id", this.formValues.subject_id);
        formData.append("topic", this.formValues.lesson_title);
        formData.append("source", this.formValues.lesson_file);
        formData.append("video_length", this.formValues.lesson_file_duration);
        formData.append("description", this.formValues.description);
        formData.append("questions", JSON.stringify(this.formValues.questions));
        const config = {
          method: "post",
          url: "https://entreelab.com.ng/src/api/subjects/new-topic",
          data: formData,
          headers: {
            "Authorization" : localStorage.getItem("token"),
            "Content-Type": 'multipart/form-data',
          },
        };
        const response = await this.axios(config);
        // this.updateModalVisibility();
        const updatedSubjects = (response.data.status == 1) ? true :  false;
        this.formValues.lesson_title = null;
        this.formValues.subject_id = null;
        this.formValues.lesson_file = null;
        this.formValues.lesson_file_type = null;
        this.formValues.lesson_file_data = null;
        this.formValues.lesson_file_duration = null;
        this.formValues.questions = null;
        this.isBtnDisabled = false;
        this.showProgress = false;
        // this.showModal = false;
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
    modulatingQuestions () {
      this.formValues.questions = [];
      for(let i = 0; i < Number(this.total_questions); i++) {
        this.formValues.questions.push({
          question: null,
          options: {
            option_a: null,
            option_b: null,
            option_c: null,
            option_d: null,
          },
          score: this.general_score,
          correct_answer: null,
        });
      }
    }, //end of modulatingQuestions
  },
  mounted(){
    // this.getSubjects();
    this.modulatingQuestions();
  },
}
</script>