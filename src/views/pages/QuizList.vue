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
                  <span>Quiz</span>
                </CCol>
              </CRow>
            </CCardHeader>
            <CCardBody>
              <CDataTable
                :items="items"
                :fields="fields"
                column-filter
                table-filter
                items-per-page-select
                :items-per-page="5"
                hover
                sorter
                pagination
              >
                <template #status="{ item }">
                  <td>
                    <CBadge :color="getBadge(item.status)">
                      {{ item.status }}
                    </CBadge>
                  </td>
                </template>
                <template #show_details="{ item }">
                  <td class="py-2">
                    <CButton
                      color="info"
                      variant="outline"
                      square
                      :disabled="isBtnDisabled"
                      size="sm"
                      class="fa fa-eye"
                      v-if="true == false"
                    />
                    <CButton
                      color="info"
                      variant="outline"
                      square
                      size="sm"
                      :disabled="isBtnDisabled"
                      v-if="Number.parseInt(item.total_lessons) > 0 && presentRoute == 'lesson'"
                      @click="toLesson(item.subject_id)"
                    >
                      View Lessons
                    </CButton>
                    <CButton
                      color="info"
                      variant="outline"
                      square
                      size="sm"
                      :disabled="isBtnDisabled"
                      v-if="Number.parseInt(item.total_quiz) > 0 && (presentRoute == 'quiz' || user === 2)"
                    >
                      View Quiz
                    </CButton>
                  </td>
                </template>
                <template #details="{ item }">
                  <CCollapse
                    :show="Boolean(item._toggled)"
                    :duration="collapseDuration"
                  >
                    <CCardBody> </CCardBody>
                  </CCollapse>
                </template>
              </CDataTable>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </div>
  </div>
</template>

<script>

const items = [];

const fields = [
  { key: "quiz_title", _style: "min-width:100px" },
  { key: "subject", _style: "min-width:100px;" },
  { key: "quiz_type", _style: "min-width:100px;" },
  { key: "duration", _style: "min-width:100px;" },
  { key: "start_date", _style: "min-width:100px;" },
  { key: "expiry_date", _style: "min-width:100px;" },
  {
    key: "take_quiz",
    label: "",
    _style: "width:1%",
    sorter: false,
    filter: false,
  },
];

export default {
  name: "QuizList",
  components: {
  },
  data() {
    return {
      isBtnDisabled: false,
      showProgress: true,
      user: parseInt(localStorage.getItem("user_type")),
      notification: {
        type: "success",
        countdown: 2,
        message: "Loading Quiz . . . ",
      },
      showModal: false,
      showModalq: false,

      items: items.map((item, id) => {
        return { ...item, id };
      }),
      fields,
      details: [],
      collapseDuration: 0,
      subjectDropdowmn: [ {label: "--Select Subject--", value: null,}, ],
      presentRoute: null,
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

    async allQuiz() {
      try {
        const config = {
          method: "get",
          url: `${/*window.location.origin*/'https://entreelab.org'}/src/api/school/subjects/${this.$route.params.subject_id}`,
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
          console.log("Developer fucked up!");
          // this.notification.countdown = 20;
          // this.notification.type = "danger";
          // this.isBtnDisabled = !this.isBtnDisabled;
          // this.showProgress = !this.showProgress;
        }
      }
    }, //end of allQuiz
    showData(response) {
      this.items = response.map((subject) => {
        const subjectId = (this.user === 4) ? subject.subject_id : subject.id;
        const dropdownObj = {
          label: `${subject.grade_name} - ${subject.subject_name}`,
          value: subjectId,
        };
        this.subjectDropdowmn.push(dropdownObj);
        return {
          subject: subject.subject_name,
          class: subject.grade_name,
          registered: subject.createddate,
          total_lessons: (!subject.lesson_count) ? 0 : subject.lesson_count,
          total_quiz: (!subject.quiz_count) ? 0 : subject.quiz_count,
          "teacher's_name": `${subject.first_name} ${subject.last_name}`,
          subject_id: subjectId,
        };
      });
      this.showProgress = false;
    }, //end of showData
    toggleModal(md) {
      if (md === 1) {
        this.showModal = !this.showModal;
      } else if (md === 2) {
        this.showModalq = !this.showModalq;
      }
    }, //end of toggleModal
    closeAllModal() {
      this.showModal = false;
      this.showModalq = false;
    }, //end of closeAllModal
    toLesson(subject_id){
      //console.log(subject_id);
      this.$router.push({name: "View Lessons", params: {subject_id: subject_id,}});
    }, //end of subject_id
  },
  created() {
    this.allQuiz();
    // console.log("welcome");
  },
};
</script>
