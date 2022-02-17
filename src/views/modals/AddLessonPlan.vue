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
        <h5 class="px-3">Lesson Plan</h5>
        <i class="btn btn-info fa fa-close pull-right" @click="updateModalVisibility"></i>
      </template>
      <CRow class="my-3">
        <CCol sm="6">
          Lesson Plan for {{ (setupPlan) ? 'Primary' : 'Nursery' }} class
        </CCol>
        <CCol sm="6">
          <CSwitch
            color="info"
            variant="3d"
            class="float-right"
            v-bind:checked.sync="setupPlan"
          />
        </CCol>
      </CRow>
      <PrimaryPlan :subjects="subjects" @submit-primary="SubmitPlan" v-if="setupPlan" />
      <NurseryPlan :subjects="subjects" @submit-nursery="SubmitPlan" v-else />
      <template v-slot:footer>
          <CButton v-show="false">Close</CButton>
      </template>
    </CModal>
  </div>
</template>

<script>
import PrimaryPlan from "../lesson_plan/PrimaryPlan";
import NurseryPlan from "../lesson_plan/NurseryPlan";

const fields = [
  { key: "name" },
  {
    key: "show_details",
    label: "",
    sorter: false,
    filter: false,
  },
];

export default {
  name: "AddLessonPlan",
  components: {
    PrimaryPlan,
    NurseryPlan,
  },
  props: {
    showModal: {
      type: Boolean,
      required: true,
      default: false,
    },
    subjects: {
        type: Array,
    }
  },
  data () {
    return {
      warningModal: false,
      formValues: {
        opportunities: [],
        activities: [],
        reflection: [],
      },
      setupPlan: false,
      isBtnDisabled: false,
      showProgress: false,
      notification: {
        type: "success",
        countdown: 2,
        message: "Loading Students . . . ",
      },
      today: new Date,
      items: [],
      fields,
      opportunities: [
        "Evaluation",
        "Analysis",
        "Application",
        "Understanding",
        "Knowledge",
        "Critical thinking",
        "Creative thinking",
      ],
      activities: [
        "Co-op learning",
        "Independent work",
        "Small group",
        "Teacher assisted",
        "Hands on",
      ],
      reflection: [
        "I use data to plan my lesson",
        "I state my objectives clearly",
        "I provide opportunities to engage pupils and give feed back",
        "I provide time for interaction",
      ],
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
        this.formValues = {
          opportunities: [],
          activities: [],
          reflection: [],
        };
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
    }, //end of SubmitPlan
  },
  mounted(){
  },
}
</script>
