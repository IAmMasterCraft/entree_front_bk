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
                    label="Enter Topic"
                    required="true"
                    placeholder="Enter Subject Topic"
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
            label="Enter Textbook"
            required="true"
            placeholder="Enter Textbook Needed"
            v-model="formValues.textbook"
          />
        </CCol>
        <CCol sm="6">
          <CTextarea
            label="Enter Textbook pages"
            required="true"
            placeholder="Enter Textbook Pages"
            v-model="formValues.textbook_pages"
          />
        </CCol>
      </CRow>
      <CRow class="my-3">
        <CCol sm="6">
          <CTextarea
            label="Other materials needed"
            required="true"
            placeholder="Enter other materials needed"
            v-model="formValues.other_materials"
          />
        </CCol>
        <CCol sm="6">
          Opportunities Provided
          <CInputCheckbox
            v-for="(opportunity, index) in opportunities" :key="index"
            :label="opportunity"
            :checked.sync="formValues.opportunities[index]"
          />
        </CCol>
      </CRow>
      <CRow class="my-3">
        <CCol sm="6">
          <CTextarea
            label="Enter Previous Knowledge/Entry Point"
            required="true"
            placeholder="Enter Previous Knowledge"
            v-model="formValues.previous_knowledge"
          />
        </CCol>
        <CCol sm="6">
          <CTextarea
            label="Enter Direct Instruction"
            required="true"
            placeholder="Enter Textbook Pages"
            v-model="formValues.direct_instruction"
          />
        </CCol>
      </CRow>
      <CRow class="my-3">
        <CCol sm="6">
          <CTextarea
            label="Enter Intervention"
            required="true"
            placeholder="Enter Intervention"
            v-model="formValues.intervention"
          />
        </CCol>
        <CCol sm="6">
          <CTextarea
            label="Enter Extension"
            required="true"
            placeholder="Enter Extension"
            v-model="formValues.extension"
          />
        </CCol>
      </CRow>
      <CRow class="my-3">
        <CCol sm="6">
          <CTextarea
            label="Enter Guided and Independent Practice"
            required="true"
            placeholder="Enter Guided and Independent Practice"
            v-model="formValues.guided_practice"
          />
        </CCol>
        <CCol sm="6">
          <CTextarea
            label="Enter Closing"
            required="true"
            placeholder="Enter Closing"
            v-model="formValues.closing"
          />
        </CCol>
      </CRow>
      <CRow class="my-3">
        <CCol sm="6">
          <CTextarea
            label="Enter Assessment"
            required="true"
            placeholder="Enter assessment"
            v-model="formValues.assessment"
          />
        </CCol>
        <CCol sm="6">
          Types of Activities
          <CInputCheckbox
            v-for="(activity, index) in activities" :key="index"
            :label="activity"
            :checked.sync="formValues.activities[index]"
          />
        </CCol>
      </CRow>
      <CRow class="my-3">
        <CCol sm="6">
          <CTextarea
            label="Enter Follow Up"
            required="true"
            placeholder="Enter Follow Up"
            v-model="formValues.follow_up"
          />
        </CCol>
        <CCol sm="6">
          Reflection
          <CInputCheckbox
            v-for="(reflect, index) in reflection" :key="index"
            :label="reflect"
            :checked.sync="formValues.reflection[index]"
          />
        </CCol>
      </CRow>
      <CRow class="my-3">
        <CCol sm="6">
          <CTextarea
            label="Enter Homework"
            required="true"
            placeholder="Enter Homework"
            v-model="formValues.homework"
          />
        </CCol>
        <CCol sm="6">
          <CTextarea
            label="Enter Contents and Notes"
            required="true"
            placeholder="Enter Contents and Notes"
            v-model="formValues.content_notes"
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
    </div>
</template>

<script>
export default {
  name: "AddLessonPlanPrimary",
  props: {
    subjects: {
        type: Array,
    },
    lessonPlan: {
      type: Object,
    }
  },
  data () {
    return {
      warningModal: false,
      formValues: {
          lesson_plan_type: 1,
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
        this.formValues.opportunities = JSON.stringify(this.formValues.opportunities);
        this.formValues.activities = JSON.stringify(this.formValues.activities);
        this.formValues.reflection = JSON.stringify(this.formValues.reflection);
        const config = {
          method: "post",
          url: `${/*window.location.origin*/'https://entreelab.org'}/src/api/lesson-plan/edit`,
          data: this.formValues,
          headers: {"Authorization" : localStorage.getItem("token"),},
        };
        await this.axios(config);
        this.formValues = {
            lesson_plan_type: 1,
          opportunities: [],
          activities: [],
          reflection: [],
        };
        this.$emit("submit-primary", true);
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
    this.formValues = this.lessonPlan;
  },
}
</script>