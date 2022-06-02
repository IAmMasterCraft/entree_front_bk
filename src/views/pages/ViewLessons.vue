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
                    <ViewRevisionQuiz :showModal="showModal" @show-modal="toggleModal(false)" :lessonQuiz="lessonQuiz" />
                    <CCard>
                        <CCardHeader>
                            <CRow>
                                <CCol lg="6">Lessons</CCol>
                            </CRow>
                        </CCardHeader>
                        <CCardBody>
                            <div v-for="(lesson, index) in lessons" :key="index">
                                <CRow>
                                    <CCol sm="1">
                                        {{ index + 1 }}
                                    </CCol>
                                    <CCol sm="6" class="">
                                        <video controls width="350" height="200">
                                            <source :src="`${/*window.location.origin*/'https://entreelab.org'}/src/storage/app/${lesson.source}`" type="video/mp4">
                                        </video>
                                    </CCol>
                                    <CCol sm="5">
                                        <h5>{{ lesson.topic }}</h5>
                                        <p v-if="lesson.description && lesson.description != 'null'">{{ lesson.description }}</p>
                                        <CButton v-if="lesson.quiz.length > 0" color="info" variant="outline" @click="toggleModal(true, index)" square>View Revision Quiz</CButton>
                                    </CCol>
                                </CRow>
                                <hr />
                            </div>
                            <hr />
                            <CRow>
                                <CCol lg="12">
                                    <CTextarea
                                        label="Interaction Zone"
                                        autocomplete="off"
                                        placeholder="Enter message"
                                    />
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
import ViewRevisionQuiz from "../modals/ViewRevisionQuiz";
export default {
    name: "ViewLessons",
    components: {
        ViewRevisionQuiz,
    },
    data() {
        return {
            isBtnDisabled: false,
            showProgress: true,
            notification: {
                type: "success",
                countdown: 2,
                message: "Loading Lessons . . . ",
            },
            showModal: false,
            lessons: [],
            modalLesson: {},
            lessonQuiz: {}
        }
    },
    methods: {
        async getLessons () {
            try {
                const config = {
                    method: "get",
                    url: `${/*window.location.origin*/'https://entreelab.org'}/src/api/lessons/${this.$route.params.subject_id}`,
                    data: null,
                    headers: { Authorization: localStorage.getItem("token") },
                    withCredentials: false,
                };
                const response = await this.axios(config);
                this.showResponse(response.data);
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
        }, //end of getParentInfo
        showResponse (response) {
            this.lessons = response;
            this.showProgress = !this.showProgress;
        }, //end of showResponse
        toggleModal(val = false, index = 0){
            this.lessonQuiz = this.lessons[index];
            this.lessonQuiz.hasQuiz = (this.lessonQuiz.quiz.length > 0) ? true : false;
            this.showModal = val;
        }, //end of toggleModal
    },
    created() {
        this.getLessons();
    },
}
</script>