<template>
  <div>
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
    <div v-if="!showProgress">
      <CRow>
        <CCol lg="12">
          <CCard>
            <CCardHeader>
              <CRow>
                <CCol lg="6">
                  <span>Add Student Booklet</span>
                </CCol>
                <CCol lg="6" v-if="user === 3">
                </CCol>
              </CRow>
            </CCardHeader>
            <CCardBody>
              <CRow>
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
              <CRow>
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
              <CRow>
                <CCol sm="6">
                  <SubjectObjectives @submit-objective="submitRecord" />
                </CCol>
                <CCol sm="6">
                  <InterventionPlan @submit-intervention="submitRecord" />
                </CCol>
              </CRow>
              <CRow>
                <CCol sm="6">
                  <HomeworkInfo @submit-homework="submitRecord" />
                </CCol>
                <CCol sm="6">
                  <Behaviour @submit-behaviour="submitRecord" />
                </CCol>
              </CRow>
              <CRow>
                <CCol sm="6">
                  <WorkHabit @submit-work-habit="submitRecord" />
                </CCol>
                <CCol sm="6">
                  <ReadingClub @submit-reading-club="submitRecord" />
                </CCol>
              </CRow>
              <CRow>
                <CCol sm="12">
                  <OtherFields @submit-accident="submitRecord" @submit-important-event="submitRecord" @submit-teacher-comment="submitRecord" />
                </CCol>
              </CRow>
              <CRow>
                <CCol lg="12">
                  <CButton
                    type="submit"
                    color="info"
                    block
                    :disabled="isBtnDisabled"
                    @click="GeneralSubmission"
                  >
                    {{ `submit records`.toUpperCase() }}
                  </CButton>
                </CCol>
              </CRow>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </div>
  </div>
</template>

<script>
import SubjectObjectives from "../booklet/view/SubjectObjectives";
import InterventionPlan from "../booklet/view/InterventionPlan";
import HomeworkInfo from "../booklet/view/HomeworkInfo";
import Behaviour from "../booklet/view/Behaviour";
import WorkHabit from "../booklet/view/WorkHabit";
import ReadingClub from "../booklet/view/ReadingClub";
import OtherFields from "../booklet/create/Others";

const items = [];

const fields = [
  { key: "first_name", _style: "min-width:100px" },
  { key: "last_name", _style: "min-width:100px;" },
  { key: "week", _style: "min-width:100px;" },
  {
    key: "show_details",
    label: "",
    _style: "width:1%",
    sorter: false,
    filter: false,
  },
];

export default {
  name: "AddStudentBooklet",
  components: {
    SubjectObjectives,
    InterventionPlan,
    HomeworkInfo,
    Behaviour,
    WorkHabit,
    ReadingClub,
    OtherFields,
  },
  data() {
    return {
      isBtnDisabled: false,
      showProgress: true,
      user: parseInt(localStorage.getItem("user_type")),
      notification: {
        type: "success",
        countdown: 2,
        message: "Loading Students . . . ",
      },
      showModal: false,

      items: items.map((item, id) => {
        return { ...item, id };
      }),
      fields,
      details: [],
      formValues: {},
      collapseDuration: 0,
      students: [
        { label: "-- Select One --", value: "" },
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
    };
  },
  methods: {
    color(value) {
      let $color;
      if (value <= 25) {
        $color = "info";
      } else if (value > 25 && value <= 50) {
        $color = "success";
      } else if (value > 50 && value <= 75) {
        $color = "warning";
      } else if (value > 75 && value <= 100) {
        $color = "danger";
      }
      return $color;
    },
    getBadge(status) {
      switch (status) {
        case "Active":
          return "success";
        case "Inactive":
          return "secondary";
        case "Pending":
          return "warning";
        case "Banned":
          return "danger";
        default:
          "primary";
      }
    },
    toggleDetails(item) {
      this.$set(this.items[item.id], "_toggled", !item._toggled);
      this.collapseDuration = 300;
      this.$nextTick(() => {
        this.collapseDuration = 0;
      });
    },

    async allBooklet() {
      try {
        const config = {
          method: "get",
          url: `https://entreelab.com.ng/src/api/booklet/${this.$route.params.id}`,
          data: null,
          headers: { Authorization: localStorage.getItem("token") },
          withCredentials: false,
        };
        const response = await this.axios(config);
        this.showData(response.data);
        // localStorage.setItem("token", `${response.data.token_type} ${response.data.access_token}`);
        // this.$router.push({name: "Home", data: response.data});
      } catch (error) {
        if (error.response) {
          this.notification.message =
            error.response.data.message ??
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
          // this.notification.countdown = 20;
          // this.notification.type = "danger";
          // this.isBtnDisabled = !this.isBtnDisabled;
          // this.showProgress = !this.showProgress;
        }
      }
    }, //end of allBooklet()
    showData(response) {
      if (this.user === 3) {
        response.students.forEach(student => {
          this.students.push({
            label: `${student.first_name} ${student.last_name}`,
            value: student.user_id,
          });
        });
      }
      
      this.items = response.booklet.map(resp => {
        return {
          id: resp.id,
          first_name: resp.first_name,
          last_name: resp.last_name,
          week: resp.week,
        }
      });
      this.showProgress = !this.showProgress;
    }, //end of showData
    toggleModal() {
      this.showModal = !this.showModal;
    }, //end of toggleModal
    async updateStudents(updated) {
      this.showProgress = !this.showProgress;
      this.showModal = false;
      if (updated) {
        this.allBooklet();
      } else {
        this.notification.message = `<code>Something went wrong with creating new subject</code>`;
        this.notification.countdown = 20;
        this.notification.type = "danger";
      }
    }, //end of updateSubjects
    navigation(classProps) {
      this.$router.push({name: "Communication Booklet / Add", params: {id: classProps.id, class: classProps.grade_name.toLowerCase()}});
    }, //end of navigation
    submitRecord(dataObject){
      this.formValues[dataObject.key] = dataObject.value;
    }, //end of submitObjective
    async GeneralSubmission(){
      console.log(this.formValues);
    }, //end of GeneralSubmission
  },
  created() {
    this.allBooklet();
  },
};
</script>
