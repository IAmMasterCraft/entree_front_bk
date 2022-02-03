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
        <h5 class="px-3">Edit Lesson Plan</h5>
        <i class="btn btn-info fa fa-close pull-right" @click="updateModalVisibility"></i>
      </template>
      <CRow class="my-3">
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
          <CInput
            label="Enter Topic"
            required="true"
            placeholder="Enter Subject Topic"
            v-model="formValues.topic"
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
            @click="SubmitPlan"
          >
            {{ `submit`.toUpperCase() }}
					</CButton>
				</CCol>
			</CRow>
      <template v-slot:footer>
          <CButton v-show="true" @click="updateModalVisibility">Close</CButton>
      </template>
    </CModal>
  </div>
</template>

<script>

export default {
  name: "EditLessonPlan",
  components: {
  },
  props: {
    showModal: {
      type: Boolean,
      required: true,
      default: false,
    },
    subjects: {
      type: Array,
    },
    lesson_plan: {
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
    }
  },
  methods: {
    updateModalVisibility(){
      let visibility = this.showModal;
      this.$emit("show-modal", !visibility);
    }, //updateModalVisibility method
    async SubmitPlan () {
      try {
        this.isBtnDisabled = true;
        this.showProgress = true;
        const config = {
          method: "post",
          url: "https://entreelab.com.ng/src/api/lesson-plan/edit",
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
    }, //end of SubmitPlan()
  },
  mounted(){
    // this.getSubjects();\
    this.formValues = this.lesson_plan;
  },
}
</script>