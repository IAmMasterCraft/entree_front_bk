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
                                <CCol lg="6">
                                    <CButton
                                        color="success"
                                        variant="outline"
                                        square
                                        class="text-right float-right"
                                        size="sm"
                                        :disabled="isBtnDisabled"
                                        v-if="edit == 'edit' && user == 3"
                                        @click="StartEditing()"
                                    >
                                        Edit Mode
                                    </CButton>
                                    <CButton
                                        color="success"
                                        variant="outline"
                                        square
                                        class="text-right float-right"
                                        size="sm"
                                        :disabled="isBtnDisabled"
                                        v-else-if="edit != 'edit' && user == 3"
                                        @click="StartEditing('edit')"
                                    >
                                        Save Changes
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
                            <CRow>
                                <CCol sm="6">
                                    <SubjectObjectives :action="edit" :allObjectives="JSON.parse(booklet.subject_objectives)" />
                                </CCol>
                                <CCol sm="6">
                                    <InterventionPlan :action="edit" :allIntervention="JSON.parse(booklet.intervention_plan)" />
                                </CCol>
                            </CRow>
                            <CRow>
                                <CCol sm="6">
                                    <HomeworkInfo :action="edit" :allHomeworkInfo="JSON.parse(booklet.homework_info)" />
                                </CCol>
                                <CCol sm="6">
                                    <Behaviour :action="edit" :allBehaviourHabit="JSON.parse(booklet.behaviour_habits)" />
                                </CCol>
                            </CRow>
                            <CRow>
                                <CCol sm="6">
                                    <WorkHabit :action="edit" :allWorkHabit="JSON.parse(booklet.work_habits)" />
                                </CCol>
                                <CCol sm="6">
                                    <ReadingClub :action="edit" :allReadingClub="JSON.parse(booklet.reading_club_programme)" />
                                </CCol>
                            </CRow>
                            <CRow>
                                <CCol sm="12">
                                    <OtherFields :action='edit' :event="JSON.parse(booklet.important_event)" :comment="JSON.parse(booklet.teachers_comment)" :accident="JSON.parse(booklet.accident_illness)" />
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
import SubjectObjectives from "../booklet/view/SubjectObjectives";
import InterventionPlan from "../booklet/view/InterventionPlan";
import HomeworkInfo from "../booklet/view/HomeworkInfo";
import Behaviour from "../booklet/view/Behaviour";
import WorkHabit from "../booklet/view/WorkHabit";
import ReadingClub from "../booklet/view/ReadingClub";
import OtherFields from "../booklet/create/Others";

export default {
    name: "ViewBooklet",
    components: {
        SubjectObjectives,
        InterventionPlan,
        HomeworkInfo,
        Behaviour,
        WorkHabit,
        ReadingClub,
        OtherFields,
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
            edit: "edit",
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
                    url: `${/*window.location.origin*/'https://entreelab.org'}/src/api/booklet/${this.$route.params.id}/${this.$route.params.booklet}`,
                    data: null,
                    headers: { Authorization: localStorage.getItem("token") },
                    withCredentials: false,
                };
                if (this.user === 4 || this.user === 5) config.url = `https://entreelab.org/src/api/booklet/single-student/${this.$route.params.booklet}`;
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
            try {
                if (this.user == 3) {
                    response.students.forEach(student => {
                        this.studentList.push({
                            label: `${student.first_name} ${student.last_name}`,
                            value: student.user_id,
                        });
                    });
                }
                this.booklet = response.booklet[0];
                this.showProgress = !this.showProgress;
            } catch (error) {
                console.error(error);
            }
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
        StartEditing (val = "") {
            this.edit = val;
        }, //end of StartEditing
    },
    created () {
        this.GetBooklet();
    }
}
</script>