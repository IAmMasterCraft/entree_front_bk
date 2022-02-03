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
                                    <span>Student Booklet</span>
                                </CCol>
                                <CCol lg="6" v-if="user === 3">
                                    <EditBooklet
                                        :showModal="showModal"
                                        :students="studentList"
                                        :booklet="booklet"
                                        @show-modal="toggleModal"
                                        @show-students="updateBooklet"
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
                                        Edit Booklet
                                    </CButton>
                                </CCol>
                            </CRow>
                        </CCardHeader>
                        <CCardBody>
                            <div>
                                <p>
                                    {{ booklet.first_name }} {{ booklet.last_name }}'s Communication Booklet for
                                    {{ booklet.week }} of {{ booklet.term }} 
                                    in {{ booklet.academic_session }} Academic Session
                                </p>
                            </div>
                            <div class="my-3">
                                <h4>Subject Objectives</h4>
                                <div v-html="booklet.subject_objectives"></div>
                            </div>
                            <div class="my-3">
                                <h4>Intervention Plan</h4>
                                <div v-html="booklet.intervention_plan"></div>
                            </div>
                            <div class="my-3">
                                <h4>Homework/Project Work Information</h4>
                                <div v-html="booklet.homework_info"></div>
                            </div>
                            <div class="my-3">
                                <h4>Behaviour in School</h4>
                                <div v-html="booklet.behaviour_habits"></div>
                            </div>
                            <div class="my-3">
                                <h4>Work Habits in School</h4>
                                <div v-html="booklet.work_habits"></div>
                            </div>
                            <div class="my-3">
                                <h4>Important Event</h4>
                                <div v-html="booklet.important_event"></div>
                            </div>
                            <div class="my-3">
                                <h4>Accident/Illness</h4>
                                <div v-html="booklet.accident_illness"></div>
                            </div>
                            <div class="my-3">
                                <h4>Reading Club Programme</h4>
                                <div v-html="booklet.reading_club_programme"></div>
                            </div>
                            <div class="my-3">
                                <h4>Supervision</h4>
                                <div v-html="booklet.supervision"></div>
                            </div>
                            <div class="my-3">
                                <h4>Parents Comment</h4>
                                <div v-html="booklet.parents_comment"></div>
                            </div>
                            <div class="my-3">
                                <h4>Teachers Comment</h4>
                                <div v-html="booklet.teachers_comment"></div>
                            </div>
                            <div v-if="user === 3 && true === false">
                                <h4>Teachers Comment</h4>
                                <Editor 
                                    :api-key="apiKey"
                                    :init="editor"
                                    v-model="formValues.teachers_comment"
                                />
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
import EditBooklet from "../edit/EditBooklet";

export default {
    name: "ViewBooklet",
    components: {
        EditBooklet,
    },
    data () {
        return {
            isBtnDisabled: false,
            showProgress: true,
            user: parseInt(localStorage.getItem("user_type")),
            notification: {
                type: "success",
                countdown: 2,
                message: "Loading Booklet . . . ",
            },
            showModal: false,
            studentList: [
                { label: "-- Select One --", value: "" },
            ],
            booklet: {},
            formValues: {},
            apiKey: "ehbiiwvflorgcf3lxxhc8nvq2a1j7986wii4q2ci4irutrdg",
            editor: {
                plugins: [
                'fullscreen a11ychecker advcode casechange export formatpainter linkchecker autolink lists checklist media mediaembed pageembed permanentpen powerpaste table advtable tinycomments tinymcespellchecker quickbars',
                'advlist autolink lists link image charmap print preview anchor',
                'searchreplace visualblocks code fullscreen',
                'insertdatetime media table code help wordcount'
                ],
                toolbar: `a11ycheck addcomment showcomments casechange checklist code export formatpainter pageembed permanentpen table
                    'undo redo | formatselect | bold italic backcolor | \
                    alignleft aligncenter alignright alignjustify | \
                    bullist numlist outdent indent | removeformat | help'
                `,
                toolbar_mode: 'floating',
                tinycomments_mode: 'embedded',
                tinycomments_author: 'MasterCraft',
            }
        }
    },
    methods: {
        async GetBooklet () {
            try {
                const config = {
                    method: "get",
                    url: `https://entreelab.com.ng/src/api/booklet/${this.$route.params.id}/${this.$route.params.booklet}`,
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
        }, //end of GetBooklet
        ShowData (response) {
            response.students.forEach(student => {
                this.studentList.push({
                    label: `${student.first_name} ${student.last_name}`,
                    value: student.user_id,
                });
            });
            this.booklet = response.booklet[0];
            this.showProgress = !this.showProgress;
        }, //end of ShowData()
        toggleModal() {
            this.showModal = !this.showModal;
        }, //end of toggleModal
        async updateBooklet(updated) {
            this.showProgress = !this.showProgress;
            this.showModal = false;
            if (updated) {
                this.GetBooklet();
            } else {
                this.notification.message = `<code>Something went wrong with creating new subject</code>`;
                this.notification.countdown = 20;
                this.notification.type = "danger";
            }
        }, //end of updateBooklet
    },
    created () {
        this.GetBooklet();
    }
}
</script>