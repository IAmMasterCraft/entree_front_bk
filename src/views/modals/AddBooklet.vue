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
      <div v-if="!isBtnDisabled && !showProgress">
        <CRow class="my-3">
          <CCol sm="6">
            <CSelect
              label="Select Student"
              autocomplete="off"
              :options="students"
              :value.sync="formValues.student_id"
            />
          </CCol>
          <CCol sm="6">
            <CInput
              label="Enter Academic Session"
              required="true"
              placeholder="Enter Present Academic Session"
              v-model="formValues.academic_session"
            />
          </CCol>
        </CRow>

        <CRow class="my-3">
          <CCol sm="6">
            <CSelect
              label="Select Term"
              autocomplete="off"
              :options="term"
              :value.sync="formValues.term"
            />
          </CCol>

          <CCol sm="6">
            <CSelect
              label="Select Week"
              autocomplete="off"
              :options="week"
              :value.sync="formValues.week"
            />
          </CCol>
        </CRow>

        <CRow class="my-3">
          <CCol sm="12">
            <h4>Subject Objectives</h4>
            <textarea class="editor" v-model="formValues.subject_objectives" cols="30" rows="10"></textarea>
          </CCol>
        </CRow>

        <CRow class="my-3">
          <CCol sm="12">
            <h4>Intervention Plan</h4>
            <textarea class="editor" v-model="formValues.intervention_plan" cols="30" rows="10"></textarea>
          </CCol>
        </CRow>

        <CRow class="my-3">
          <CCol sm="12">
            <h4>Homework/Project Work Information</h4>
            <textarea class="editor" v-model="formValues.homework_info" cols="30" rows="10"></textarea>
          </CCol>
        </CRow>

        <CRow class="my-3">
          <CCol sm="12">
            <h4>Behaviour in School</h4>
            <textarea class="editor" v-model="formValues.behaviour_habits" cols="30" rows="10"></textarea>
          </CCol>
        </CRow>

        <CRow class="my-3">
          <CCol sm="12">
            <h4>Work Habits in School</h4>
            <textarea class="editor" v-model="formValues.work_habits" cols="30" rows="10"></textarea>
          </CCol>
        </CRow>

        <CRow class="my-3">
          <CCol sm="12">
            <h4>Important Event</h4>
            <textarea class="editor" v-model="formValues.intervention_plan" cols="30" rows="10"></textarea>
          </CCol>
        </CRow>

        <CRow class="my-3">
          <CCol sm="12">
            <h4>Accident/Illness</h4>
            <textarea class="editor" v-model="formValues.accident_illness" cols="30" rows="10"></textarea>
          </CCol>
        </CRow>

        <CRow class="my-3">
          <CCol sm="12">
            <h4>Reading Club Programme</h4>
            <textarea class="editor" v-model="formValues.reading_club_programme" cols="30" rows="10"></textarea>
          </CCol>
        </CRow>

        <CRow class="my-3">
          <CCol sm="12">
            <h4>Teachers Comment</h4>
            <textarea class="editor" v-model="formValues.teachers_comment" cols="30" rows="10"></textarea>
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
    students: {
      type: Array,
    },
  },
  data () {
    return {
      warningModal: false,
      formValues: {},
      isBtnDisabled: false,
      showProgress: false,
      notification: {
        type: "success",
        countdown: 2,
        message: "Loading Booklet . . . ",
      },
      term: [
        { label: "-- Select One --", value: ""},
        "1st Term",
        "2nd Term",
        "3rd Term",
      ],
      week: [
        { label: "-- Select One --", value: ""},
        "Week 1",
        "Week 2",
        "Week 3",
        "Week 4",
        "Week 5",
        "Week 6",
        "Week 7",
        "Week 8",
        "Week 9",
        "Week 10",
        "Week 11",
        "Week 12",
        "Week 13",
      ],
    }
  },
  methods: {
    updateModalVisibility(){
      let visibility = this.showModal;
      this.$emit("show-modal", !visibility);
    }, //updateModalVisibility method
    InitializeEditor(){
      window.tinymce.init({
        selector: '.editor',
        plugins: 'fullscreen a11ychecker advcode casechange export formatpainter linkchecker autolink lists checklist media mediaembed pageembed permanentpen powerpaste table advtable tinycomments tinymcespellchecker quickbars',
        toolbar: 'a11ycheck addcomment showcomments casechange checklist code export formatpainter pageembed permanentpen table',
        toolbar_mode: 'floating',
        tinycomments_mode: 'embedded',
        tinycomments_author: 'MasterCraft',
      });
    }, //end of InitializeEditor
  },
  mounted(){
    // this.getSubjects();
    this.InitializeEditor();
  },
}
</script>