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
                                    <span>Lesson Plan</span>
                                </CCol>
                                <CCol lg="6" v-if="user === 3">
                                    <EditLessonPlan
                                        :showModal="showModal"
                                        :subjects="subjectList"
                                        :lessonPlan="lesson_plan"
                                        @show-modal="toggleModal"
                                        @show-students="updateLessonPlan"
                                    />
                                    <CButton
                                        color="success"
                                        variant="outline"
                                        square
                                        class="text-right float-right"
                                        size="sm"
                                        :disabled="isBtnDisabled"
                                        @click="toggleModal"
                                    >
                                        Edit Lesson Plan
                                    </CButton>
                                </CCol>
                            </CRow>
                        </CCardHeader>
                        <CCardBody>
                            <div>
                                <p>
                                    {{ lesson_plan.subject_name }} Lesson Plan for
                                    {{ lesson_plan.week }} of {{ lesson_plan.term }} 
                                    in {{ lesson_plan.academic_session }} Academic Session
                                </p>
                            </div>
                            <CRow class="my-3" v-if="lesson_plan.lesson_plan_type == 1">
                                <CCol sm="4">
                                    <p>Topic: {{ lesson_plan.topic }}</p>
                                    <p>Objectives: {{ lesson_plan.objectives }}</p>
                                    <p>Textbook: {{ lesson_plan.textbook }}</p>
                                    <p>Textbook Pages: {{ lesson_plan.textbook_pages }}</p>
                                    <p>Other materials needed: {{ lesson_plan.other_materials }}</p>
                                    Opportunities: <CInputCheckbox
                                        v-for="(opportunity, index) in opportunities" :key="index"
                                        :label="opportunity"
                                        :disabled="!lesson_plan.opportunities[index]"
                                        :checked.sync="lesson_plan.opportunities[index]"
                                    />
                                    <br />
                                </CCol>
                                <CCol sm="4">
                                    <p>Previous Knowledge: {{ lesson_plan.previous_knowledge }}</p>
                                    <p>Direct Instruction: {{ lesson_plan.direct_instruction }}</p>
                                    <p>Intervention: {{ lesson_plan.intervention }}</p>
                                    <p>Extension: {{ lesson_plan.extension }}</p>
                                    <p>Guided Practice: {{ lesson_plan.guided_practice }}</p>
                                    Activities:  <CInputCheckbox
                                        v-for="(activity, index) in activities" :key="index"
                                        :label="activity"
                                        :disabled="!lesson_plan.activities[index]"
                                        :checked.sync="lesson_plan.activities[index]"
                                    /> <br />
                                </CCol>
                                <CCol sm="4">
                                    <p>Assessment: {{ lesson_plan.assessment }}</p>
                                    <p>Homework: {{ lesson_plan.topic }}</p>
                                    <p>Notes and Contents: {{ lesson_plan.content_notes }}</p>
                                    <p>Follow Up: {{ lesson_plan.follow_up }}</p>
                                    <p>Closing: {{ lesson_plan.closing }}</p>
                                    Reflection:  <CInputCheckbox
                                        v-for="(reflect, index) in reflection" :key="index"
                                        :label="reflect"
                                        :disabled="!lesson_plan.reflection[index]"
                                        :checked.sync="lesson_plan.reflection[index]"
                                    /> <br />
                                </CCol>
                            </CRow>
                            <CRow class="my-3" v-else>
                                <CCol sm="4">
                                    <p>Theme: {{ lesson_plan.topic }}</p>
                                    <p>Objectives: {{ lesson_plan.objectives }}</p>
                                    <p>Content and Notes: {{ lesson_plan.content_notes }}</p>
                                    <br />
                                </CCol>
                                <CCol sm="4">
                                    <p>Class Activities: {{ lesson_plan.activities }}</p>
                                    <p>Materials Needed: {{ lesson_plan.other_materials }}</p>
                                </CCol>
                                <CCol sm="4">
                                    <p>Montesorri: {{ lesson_plan.montesorri }}</p>
                                    <p>Character Education: {{ lesson_plan.character_education }}</p>
                                </CCol>
                            </CRow>
                            <hr />
                        </CCardBody>
                    </CCard>
                </CCol>
            </CRow>
        </div>
    </div>
</template>

<script>
import EditLessonPlan from "../edit/EditLessonPlan";

export default {
    name: "ViewLessonPlan",
    components: {
        EditLessonPlan,
    },
    data () {
        return {
            isBtnDisabled: false,
            showProgress: true,
            user: parseInt(localStorage.getItem("user_type")),
            notification: {
                type: "success",
                countdown: 2,
                message: "Loading Lesson Plan . . . ",
            },
            showModal: false,
            subjectList: [
                { label: "-- Select One --", value: "" },
            ],
            lesson_plan: {},
            formValues: {},
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
        }
    },
    methods: {
        async GetLessonPlan () {
            try {
                const config = {
                    method: "get",
                    url: `${/*window.location.origin*/'https://entreelab.org'}/src/api/lesson-plan/${this.$route.params.id}/${this.$route.params.plan}`,
                    data: null,
                    headers: { Authorization: localStorage.getItem("token") },
                    withCredentials: false,
                };
                const response = await this.axios(config);
                this.ShowData(response.data);
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
        }, //end of GetLessonPlan
        ShowData (response) {
            response.subjects.forEach(subject => {
                this.subjectList.push({
                    label: subject.subject_name,
                    value: subject.id,
                });
            });
            this.lesson_plan = response.lesson_plan[0];
            if (this.lesson_plan.lesson_plan_type == 1) {
                this.lesson_plan.opportunities = JSON.parse(response.lesson_plan[0].opportunities);
                this.lesson_plan.activities = JSON.parse(response.lesson_plan[0].activities);
                this.lesson_plan.reflection = JSON.parse(response.lesson_plan[0].reflection);
            }
            this.showProgress = !this.showProgress;
        }, //end of ShowData()
        toggleModal() {
            this.showModal = !this.showModal;
        }, //end of toggleModal
        async updateLessonPlan(updated) {
            this.showProgress = !this.showProgress;
            this.showModal = false;
            if (updated) {
                this.GetLessonPlan();
            } else {
                this.notification.message = `<code>Something went wrong with creating new subject</code>`;
                this.notification.countdown = 20;
                this.notification.type = "danger";
            }
        }, //end of updateLessonPlan
    },
    created () {
        this.GetLessonPlan();
    }
}
</script>