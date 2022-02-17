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
    }
  },
  data () {
    return {
      warningModal: false,
      formValues: {
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
    }
  },
  methods: {
    updateModalVisibility(){
      let visibility = this.showModal;
      this.$emit("show-modal", !visibility);
    }, //updateModalVisibility method
  },
  created() {
    this.formValues.questions = [
      {
        question: this.lesson.question,
        correct_answer: this.lesson.correct_answer,
        score: this.lesson.score
      }
    ];
    this.mcq_options = this.lesson.options.split("%~");
  },
}
</script>
