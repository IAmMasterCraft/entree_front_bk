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
                  <span>Other Fields</span>
                </CCol>
              </CRow>
            </CCardHeader>
            <CCardBody>
              <CRow>
                <CCol sm="6">
                  <CTextarea
                    label="Important Event/Issues"
                    autocomplete="off"
                    placeholder="Enter Important Event"
                    @input="submitInput"
                    v-if="action != 'edit'"
                    v-model="formValues.important_event"
                  />
                  <p v-else>Important Event: {{ event }}</p>
                </CCol>
                <CCol sm="6">
                  <CTextarea
                    label="Accident/Illness in School"
                    autocomplete="off"
                    @input="submitInput"
                    v-if="action != 'edit'"
                    placeholder="What Happened:
Illness/Injury: 
Action taken:"
                    v-model="formValues.accident_illness"
                  />
                  <p v-else>Accident/Illness: {{ accident }}</p>
                </CCol>
              </CRow>
              <CRow>
                <CCol sm="6">
                  <CTextarea
                    label="Teacher's Comment"
                    autocomplete="off"
                    placeholder="Enter Teacher's Comment"
                    @input="submitInput"
                    v-if="action != 'edit'"
                    v-model="formValues.teachers_comment"
                  />
                  <p v-else>Comment: {{ comment }}</p>
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

const items = [];

const fields = [
  { key: "behaviour", _style: "min-width:100px" },
  { key: "performance", _style: "min-width:100px;" },
];

export default {
  name: "OtherBookletField",
  components: {
  },
  props: {
    action: {
      type: String,
    },
    event: {
      type: String,
    },
    comment: {
      type: String,
    },
    accident: {
      type: String,
    },
  },
  watch: {
    event(val) {
      this.formValues.important_event = val;
    },
    comment(val) {
      this.formValues.teachers_comment = val;
    },
    accident(val) {
      this.formValues.accident_illness = val;
    },
  },
  data() {
    return {
      isBtnDisabled: false,
      showProgress: false,
      user: parseInt(localStorage.getItem("user_type")),
      notification: {
        type: "success",
        countdown: 2,
        message: "Loading Subjects . . . ",
      },
      showModal: false,

      items: items.map((item, id) => {
        return { ...item, id };
      }),
      fields,
      details: [],
      collapseDuration: 0,
      subjects: [
        { label: "-- Select One --", value: ""},
      ],
      formValues: {},
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

    async getSubjects(){
      try {
        const config = {
          method: "get",
          url: `${/*window.location.origin*/'https://entreelab.org'}/src/api/school/subjects/${this.$route.params.id}`,
          data: null,
          headers: {"Authorization" : localStorage.getItem("token"),},
          withCredentials: false,
        };
        const response = await this.axios(config);
        // this.showData(response.data);
        response.data.forEach(subject => this.subjects.push(subject.subject_name));
        this.showProgress = false;
      } catch(error) {
        if (error.response.data.message) {
          this.notification.message = error.response.data.message ?? `Something went wrong!</code>`;
          this.notification.countdown = 20;
          this.notification.type = "danger";
          this.teachers = [{label: "Something went wrong", value: null,}];
        } else {
          this.notification.message = error.message ?? `Something went wrong!</code>`;
          this.notification.countdown = 20;
          this.notification.type = "danger";
          this.teachers = [{label: "Something went wrong", value: null,}];
        }
        
      }
    }, //end of getSubjects
    toggleModal() {
      this.showModal = !this.showModal;
    }, //end of toggleModal
    submitInput() {
      this.$emit("submit-accident", {key: "accident_illness", value: JSON.stringify(this.formValues.accident_illness)});
      this.$emit("submit-important-event", {key: "important_event", value: JSON.stringify(this.formValues.important_event)});
      this.$emit("submit-teacher-comment", {key: "teachers_comment", value: JSON.stringify(this.formValues.teachers_comment)});
    }, //end of submitInput
  },
  created() {
    this.formValues.important_event = this.event;
    this.formValues.teachers_comment = this.comment;
    this.formValues.accident_illness = this.accident;
  },
};
</script>
