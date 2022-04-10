<template>
    <div>
        <CRow class="my-3">
            <CCol sm="6">
                <CSelect
                    label="Select Subject"
                    autocomplete="off"
                    :options="subjects"
                    :value.sync="formValues.subject_id"
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
            <CCol sm="6">
                <CInput
                    label="Enter Theme"
                    required="true"
                    placeholder="Enter Theme"
                    v-model="formValues.topic"
                />
            </CCol>
            <CCol sm="6">
                <CTextarea
                    label="Enter Objectives"
                    required="true"
                    placeholder="Enter Objectives"
                    v-model="formValues.objectives"
                />
            </CCol>
        </CRow>
        <CRow class="my-3">
            <CCol sm="6">
                <CTextarea
                    label="Enter Contents and Notes"
                    required="true"
                    placeholder="Enter Contents and Notes"
                    v-model="formValues.content_notes"
                />
            </CCol>
            <CCol sm="6">
                <CTextarea
                    label="Enter Class Activities"
                    required="true"
                    placeholder="Enter Activities"
                    v-model="formValues.activities"
                />
            </CCol>
        </CRow>
        <CRow class="my-3">
            <CCol sm="6">
                <CTextarea
                    label="Materials needed"
                    required="true"
                    placeholder="Enter materials needed"
                    v-model="formValues.other_materials"
                />
            </CCol>
            <CCol sm="6">
                <CTextarea
                    label="Enter Montessori"
                    required="true"
                    placeholder="Enter Montesorri"
                    v-model="formValues.montesorri"
                />
            </CCol>
        </CRow>
        <CRow class="my-3">
            <CCol sm="6">
                <CTextarea
                    label="Character Education"
                    required="true"
                    placeholder="Enter character education"
                    v-model="formValues.character_education"
                />
            </CCol>
        </CRow><br />
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
    </div>
</template>

<script>
export default {
  name: "AddLessonPlanPrimary",
  props: {
    subjects: {
        type: Array,
    }
  },
  data () {
    return {
      warningModal: false,
      formValues: {
          lesson_plan_type: 0,
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
    async SubmitPlan () {
      try {
        this.isBtnDisabled = true;
        this.showProgress = true;
        const config = {
          method: "post",
          url: `${window.location.origin}/src/api/lesson-plan/new-plan`,
          data: this.formValues,
          headers: {"Authorization" : localStorage.getItem("token"),},
        };
        await this.axios(config);
        this.formValues = {
            lesson_plan_type: 0,
        };
        this.$emit("submit-nursery", true);
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