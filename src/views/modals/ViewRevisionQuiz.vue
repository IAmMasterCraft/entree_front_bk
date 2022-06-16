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
        <h5 class="px-3">Revision Quiz</h5>
        <i class="btn btn-info fa fa-close pull-right" @click="updateModalVisibility"></i>
      </template>
      <div v-if="!lessonQuiz.hasQuiz || quizResult">
        <h4 class="text-success mx-4" v-if="quizResult">Total Score: {{ quizResult }}</h4>
        <h4 class="text-danger mx-4" v-else>No revision quiz...</h4>
      </div>
      <div v-else>
        <CRow class="m-4" v-for="(lesson, index) in lessonQuiz.quiz" :key="index">
          <CCol sm="12">
            <p>{{ index + 1}}. {{ lesson.question }}</p>
          </CCol>
          <CCol sm="12">
            <CInputRadioGroup
              rows="5"
              :options="getOptions(lesson.options)"
              :checked.sync="formValues.answer[index]"
            />
          </CCol>
        </CRow>
        <hr />
        <CRow v-if="user === 4">
          <CCol lg="12">
            <CButton
              type="submit"
              color="info"
              block
              :disabled="isBtnDisabled"
              @click="submitQuiz"
            >
              {{ `submit`.toUpperCase() }}
            </CButton>
          </CCol>
        </CRow>
      </div>
			<div v-for="(quest, index) in formValues.questions" :key="index">
          <div v-if="setupQuestion">
            <h5>Question {{ index + 1}}</h5>
            <CRow>
              <CCol sm="12">
                <CTextarea
                  :label="`Question ${index + 1}`"
                  rows="5"
                  :disabled="true"
                  required="true"
                  v-model="formValues.questions[index].question"
                />
              </CCol>
            </CRow>
            <CRow>
              <CCol sm="6">
                {{ `Options for question ${index + 1}` }}
                <CInputCheckbox
                  v-for="(option, ind) in mcq_options" :key="ind"
                  :label="option"
                  rows="5"
                  required="true"
                  :options="mcq_options"
                  :value.sync="formValues.questions[index].correct_answer"
                />
              </CCol>
              <CCol sm="6">
                <CInput
                  :label="`Allocated Score for question ${index + 1}`"
                  required="true"
                  :disabled="true"
                  type="number"
                  v-model="formValues.questions[index].score"
                />
              </CCol>
            </CRow>
            <hr />
          </div>
          
        </div>
      <template v-slot:footer>
          <CButton v-show="false">Close</CButton>
      </template>
    </CModal>
  </div>
</template>

<script>
export default {
  name: "ViewRevisionQuiz",
  props: {
    showModal: {
      type: Boolean,
      required: true,
      default: false,
    },
    classes: {
      type: Array,
    },
    lesson: {
      type: Object,
    },
    lessonQuiz: {
      type: Object,
    },
    quizResult: {
      type: String,
    }
  },
  data () {
    return {
      warningModal: false,
      formValues: {
        answer: []
      },
      isBtnDisabled: false,
      showProgress: false,
      notification: {
        type: "success",
        countdown: 2,
        message: "Loading Quiz . . . ",
      },
      setupQuestion: true,
      mcq_options: [],
      user: parseInt(localStorage.getItem("user_type")),
    }
  },
  computed: {
  },
  methods: {
    updateModalVisibility(){
      let visibility = this.showModal;
      this.$emit("show-modal", !visibility);
    }, //updateModalVisibility method
    getOptions(val) {
      return val.split("%~%").map((opt, i) => ({value: (i === 0) ? 'A' : (i === 1) ? 'B' : (i === 2) ? 'C' : 'D', label: opt}));
    }, //end of getOptions
    async submitQuiz(){
      if (this.formValues.answer.length < this.lessonQuiz.quiz.length) {
        this.notification = {
          type: "warning",
          countdown: 2,
          message: "Please answer all questions before submitting . . . ",
        };
        return false;
      }

      this.isBtnDisabled = true;
      this.showProgress = true;
      const config = {
        method: "post",
        url: `${/*window.location.origin*/'https://entreelab.org'}/src/api/revision-quiz/submit`,
        data: {
          lesson_id: this.lessonQuiz.id,
          subject_id: this.$route.params.subject_id,
          answers: this.formValues.answer
        },
        headers: { Authorization: localStorage.getItem("token") },
        withCredentials: false,
      };
      try {
        const { data } = await this.axios(config);
        this.notification.message = `<code>${ data.message }!</code>`;
        this.notification.countdown = 20;
        this.notification.type = "success";
        alert(data.message);
        this.updateModalVisibility();
      } catch (error) {
        if (error.response) {
         this.notification.message = error.response.data.message ??
         `<code>STATUS: ${error.response.data.error.status}<br />MESSAGE: ${error.response.data.error.message}</code>`;
         this.notification.countdown = 20;
         this.notification.type = "danger";
         this.isBtnDisabled = false;
         this.showProgress = false;
        } else if (error.request) {
          this.notification.message = `<code>Network Error!</code>`;
          this.notification.countdown = 20;
          this.notification.type = "danger";
          this.isBtnDisabled = false;
          this.showProgress = false;
        } else {
          console.log("Developer fucked up!", error.message);
          this.notification.countdown = 20;
          this.notification.type = "danger";
          this.isBtnDisabled = !this.isBtnDisabled;
          this.showProgress = !this.showProgress;
        } 
      }
      this.isBtnDisabled = false;
      this.showProgress = false;
    }, //end of submitQuiz
  },
  watch: {
    lessonQuiz(newVal) {
      this.lessonQuiz = newVal;
    },
  },
}
</script>
