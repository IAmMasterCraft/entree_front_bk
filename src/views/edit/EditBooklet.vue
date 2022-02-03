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
        <h5 class="px-3">Edit Booklet</h5>
        <i class="btn btn-info fa fa-close pull-right" @click="updateModalVisibility"></i>
      </template>
      <div v-if="!isBtnDisabled && !showProgress">
        <CRow class="my-3">
          <CCol sm="6" v-if="true === false">
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
            <Editor 
              :api-key="apiKey"
              :init="editor"
              :initial-value="formValues.subject_objectives"
              v-model="formValues.subject_objectives"
            />
          </CCol>
        </CRow>

        <CRow class="my-3">
          <CCol sm="12">
            <h4>Intervention Plan</h4>
            <Editor 
              :api-key="apiKey"
              :init="editor"
              :initial-value="formValues.intervention_plan"
              v-model="formValues.intervention_plan"
            />
          </CCol>
        </CRow>

        <CRow class="my-3">
          <CCol sm="12">
            <h4>Homework/Project Work Information</h4>
            <Editor 
              :api-key="apiKey"
              :init="editor"
              :initial-value="formValues.homework_info"
              v-model="formValues.homework_info"
            />
          </CCol>
        </CRow>

        <CRow class="my-3">
          <CCol sm="12">
            <h4>Behaviour in School</h4>
            <Editor 
              :api-key="apiKey"
              :init="editor"
              :initial-value="formValues.behaviour_habits"
              v-model="formValues.behaviour_habits"
            />
          </CCol>
        </CRow>

        <CRow class="my-3">
          <CCol sm="12">
            <h4>Work Habits in School</h4>
            <Editor 
              :api-key="apiKey"
              :init="editor"
              :initial-value="formValues.work_habits"
              v-model="formValues.work_habits"
            />
          </CCol>
        </CRow>

        <CRow class="my-3">
          <CCol sm="12">
            <h4>Important Event</h4>
            <Editor 
              :api-key="apiKey"
              :init="editor"
              :initial-value="formValues.important_event"
              v-model="formValues.important_event"
            />
          </CCol>
        </CRow>

        <CRow class="my-3">
          <CCol sm="12">
            <h4>Accident/Illness</h4>
            <Editor 
              :api-key="apiKey"
              :init="editor"
              :initial-value="formValues.accident_illness"
              v-model="formValues.accident_illness"
            />
          </CCol>
        </CRow>

        <CRow class="my-3">
          <CCol sm="12">
            <h4>Reading Club Programme</h4>
            <Editor 
              :api-key="apiKey"
              :init="editor"
              :initial-value="formValues.reading_club_programme"
              v-model="formValues.reading_club_programme"
            />
          </CCol>
        </CRow>

        <CRow class="my-3">
          <CCol sm="12">
            <h4>Teachers Comment</h4>
            <Editor 
              :api-key="apiKey"
              :init="editor"
              :initial-value="formValues.teachers_comment"
              v-model="formValues.teachers_comment"
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
              @click="SubmitBooklet"
            >
              {{ `submit`.toUpperCase() }}
            </CButton>
          </CCol>
        </CRow>
      </div>
      <template v-slot:footer>
          <CButton v-show="true" @click="updateModalVisibility">Close</CButton>
      </template>
    </CModal>
  </div>
</template>

<script>
import Editor from '@tinymce/tinymce-vue'

export default {
  name: "EditBooklet",
  components: {
    Editor,
  },
  props: {
    showModal: {
      type: Boolean,
      required: true,
      default: false,
    },
    students: {
      type: Array,
    },
    booklet: {
      type: Object,
    }
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
      apiKey: "ehbiiwvflorgcf3lxxhc8nvq2a1j7986wii4q2ci4irutrdg",
      editor: {
        plugins: [
          'fullscreen a11ychecker advcode casechange export formatpainter linkchecker autolink lists checklist media mediaembed pageembed permanentpen powerpaste table advtable tinycomments tinymcespellchecker quickbars',
          'advlist autolink lists link image charmap print preview anchor',
          'searchreplace visualblocks code fullscreen',
          'insertdatetime media table code help wordcount'
        ],
        toolbar: `a11ycheck addcomment showcomments casechange checklist code export formatpainter pageembed permanentpen table
            'undo redo | formatselect | bold italic backcolor | \
            alignleft aligncenter alignright alignjustify | \
            bullist numlist outdent indent | removeformat | help'
          `,
        toolbar_mode: 'floating',
        tinycomments_mode: 'embedded',
        tinycomments_author: 'MasterCraft',
      }
    }
  },
  methods: {
    updateModalVisibility(){
      let visibility = this.showModal;
      this.$emit("show-modal", !visibility);
    }, //updateModalVisibility method
    async SubmitBooklet () {
      try {
        this.isBtnDisabled = true;
        this.showProgress = true;
        const config = {
          method: "post",
          url: "https://entreelab.com.ng/src/api/booklet/edit",
          data: this.formValues,
          headers: {"Authorization" : localStorage.getItem("token"),},
        };
        await this.axios(config);
        // this.updateModalVisibility();
        this.formValues = {};
        this.$emit("show-students", true);
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
    }, //end of SubmitBooklet\
  },
  mounted(){
    // this.getSubjects();\
    this.formValues = this.booklet;
  },
}
</script>