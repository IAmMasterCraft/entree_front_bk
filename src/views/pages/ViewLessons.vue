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
                                <CCol lg="6">Lessons</CCol>
                            </CRow>
                        </CCardHeader>
                        <CCardBody>
                            <div v-for="(lesson, index) in lessons" :key="index">
                                <CRow>
                                    <CCol lg="1">
                                        {{ index + 1 }}
                                    </CCol>
                                    <CCol lg="11" class="text-center">
                                        <video controls width="350" height="200">
                                            <source :src="`https://entreelab.com.ng/src/storage/app/${lesson.source}`" type="video/mp4">
                                        </video>
                                    </CCol>
                                </CRow>
                                <CRow>
                                    <CCol lg="12" class="text-center">
                                        <h3>{{ lesson.topic }}</h3>
                                        <p>{{ lesson.description }}</p>
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
export default {
    name: "ViewLessons",
    components: {
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
        }
    },
    methods: {
        async getLessons () {
            try {
                const config = {
                    method: "get",
                    url: `https://entreelab.com.ng/src/api/lessons/${this.$route.params.subject_id}`,
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
                    console.log("Developer fucked up!");
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
        toggleModal(){
            this.showModal = !this.showModal;
        }, //end of toggleModal
    },
    created() {
        this.getLessons();
    },
}
</script>