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
                                        :lesson_plan="lesson_plan"
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
                            <div class="my-3">
                                <div>
                                    {{ lesson_plan.topic }}
                                </div>
                            </div>
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
        }
    },
    methods: {
        async GetLessonPlan () {
            try {
                const config = {
                    method: "get",
                    url: `https://entreelab.com.ng/src/api/lesson-plan/${this.$route.params.id}/${this.$route.params.plan}`,
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