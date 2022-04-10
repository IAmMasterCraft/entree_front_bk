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
        <h5 class="px-3">Add a new Quiz for {{ $route.params.class.toUpperCase() }}</h5>
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
            label="Quiz Title"
            required="true"
            placeholder="Enter Quiz title"
            v-model="formValues.quiz_title"
          />
        </CCol>
      </CRow>
      <CRow>
        <CCol sm="6">
          <CInput
            label="Cut off/Pass mark"
            required="true"
            type="number"
            placeholder="Enter Cut off mark"
            v-model="formValues.min_pass_score"
          />
        </CCol>
        <CCol sm="6">
          <CInput
            label="Duration (in minutes)"
            required="true"
            type="number"
            placeholder="Enter Quiz duration (in minutes)"
            v-model="formValues.total_time"
          />
        </CCol>
      </CRow>
      <CRow>
        <CCol sm="6">
          <CInput
            label="Start Date"
            required="true"
            type="date"
            placeholder="Enter Quiz Start Date"
            v-model="formValues.start_date"
          />
        </CCol>
        <CCol sm="6">
          <CInput
            label="Expiry Date"
            required="true"
            type="date"
            placeholder="Enter Quiz Expiry Date"
            v-model="formValues.expiry_date"
          />
        </CCol>
      </CRow>
      <CRow>
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
      <CRow>
        <CCol sm="6">
          <CSelect
            label="Quiz Type"
            required="true"
            autocomplete="off"
            :options="quiz_type"
            :value.sync="formValues.type"
            @change="modulatingQuestions"
          />
        </CCol>
      </CRow>
      <hr />
      <div v-for="(quest, index) in formValues.questions" :key="index">
        <div v-if="formValues.type == 'MCQ'">
          <h3>Setup Question {{ index + 1}}</h3>
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
      <div v-for="(quest, index) in formValues.questions" :key="index">
        <div v-if="formValues.type == 'FBQ'">
          <h3>Setup Question {{ index + 1}}</h3>
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
              <CInput
                :label="`Answer for question ${index + 1}`"
                required="true"
                type="number"
                :placeholder="`Enter answer for question ${index + 1}`"
                v-model="formValues.questions[index].options"
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
            @click="newQuiz"
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
  name: "AddQuiz",
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
        quiz_title: null,
        subject_id: null,
        min_pass_score: null,
        questions: [],
        created_by: null,
        total_time: null,
        type: null,
        start_date: null,
        expiry_date: null,
      },
      isBtnDisabled: false,
      showProgress: false,
      notification: {
        type: "success",
        countdown: 2,
        message: "Loading Subject . . . ",
      },
      // subjects: [{label: "-- Select subject --", value: null,}],
      quiz_type: [
        {label: "-- Select Quiz type --", value: null,},
        {label: "Objectives", value: "MCQ",},
        {label: "Theory", value: "FBQ",},
      ],
      mcq_options: [
        {label: "-- Select correct option --", value: null,},
        {label: "Option A", value: "A",},
        {label: "Option B", value: "B",},
        {label: "Option C", value: "C",},
        {label: "Option D", value: "D",},
      ],
      total_questions: 1,
      general_score: 1,
    }
  },
  methods: {
    updateModalVisibility(){
      let visibility = this.showModal;
      this.$emit("show-modal", !visibility);
    }, //updateModalVisibility method
    async newQuiz () {
      try {
        this.isBtnDisabled = true;
        this.showProgress = true;
        const config = {
          method: "post",
          url: `${window.location.origin}/src/api/subjects/new-quiz`,
          data: this.formValues,
          headers: {
            "Authorization" : localStorage.getItem("token"),
          },
        };
        const response = await this.axios(config);
        // this.updateModalVisibility();
        let updatedQuiz = response.data;
        this.formValues.quiz_title = null;
        this.formValues.subject_id = null;
        this.formValues.min_pass_score = null;
        this.formValues.questions = null;
        this.formValues.created_by = null;
        this.formValues.total_time = null;
        this.formValues.type = null;
        this.formValues.start_date = null;
        this.formValues.expiry_date = null;
        this.$emit("show-quiz", updatedQuiz);
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
          url: ${window.location.origin}/src/api/school/subjects/${this.$route.params.id}`,
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
    modulatingQuestions(){
      this.formValues.questions = [];
      if (this.formValues.type == "MCQ") {
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
      } else if (this.formValues.type == "FBQ") {
        for(let i = 0; i < Number(this.total_questions); i++) {
          this.formValues.questions.push({
            question: null,
            options: null,
            score: this.general_score,
          });
        }
      }
    }, //end of modulatingQuestions
  },
  mounted(){
    // this.getSubjects();
    this.modulatingQuestions();
  },
}
</script>