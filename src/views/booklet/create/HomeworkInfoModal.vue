<template>
    <div>
        <CModal
        color="info"
        :show.sync="showModal"
        :closeOnBackdrop="false"
        size="lg"
        >
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
            <template v-slot:header>
                <h5 class="px-3">Add Subject Objective</h5>
                <i class="btn btn-info fa fa-close pull-right" @click="updateModalVisibility"></i>
            </template>
            <CRow>
                <CCol sm="6">
                    <CSelect
                        label="Select Date"
                        autocomplete="off"
                        :options="weekdays"
                        :value.sync="formValues.date"
                    />
                </CCol>
                <CCol sm="6">
                    <CTextarea
                        label="Homework"
                        autocomplete="off"
                        placeholder="Enter Homework"
                        v-model="formValues.homework"
                    />
                </CCol>
            </CRow>
            <CRow>
                <CCol sm="6">
                    <CInput 
                        type="date"
                        label="Submission Date"
                        autocomplete="off"
                        v-model="formValues.submission_date"
                    />
                </CCol>
                <CCol sm="6">
                    <CSelect
                        label="Select Assessment"
                        autocomplete="off"
                        :options="assessment"
                        :value.sync="formValues.parent_assessment"
                    />
                </CCol>
            </CRow>
            <CRow>
                <CCol sm="6">
                    <CTextarea
                        label="Missing Homework"
                        autocomplete="off"
                        placeholder="Enter Missing Homework"
                        v-model="formValues.missing_homework"
                    />
                </CCol>
            </CRow>
            <br />
            <CRow>
                <CCol lg="12">
                    <CButton
                        type="submit"
                        color="info"
                        block
                        :disabled="isBtnDisabled"
                        @click="newHomeworkPlan"
                    >
                        {{ `submit`.toUpperCase() }}
                    </CButton>
                </CCol>
            </CRow>
            <template v-slot:footer>
                <CButton v-show="false">Close</CButton>
            </template>
        </CModal>
    </div>
</template>

<script>
export default {
  name: "HomeworkInfoModal",
  props: {
    showModal: {
      type: Boolean,
      required: true,
      default: false,
    },
    subjects: {
      type: Array,
    }
  },
  data () {
    return {
        warningModal: false,
        formValues: {},
        isBtnDisabled: false,
        showProgress: false,
        notification: {
            type: "success",
            countdown: 2,
            message: "Loading Subject . . . ",
        },
        user: parseInt(localStorage.getItem("user_type")),
        weekdays: [
            { label: "-- Select One --", value: ""},
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
        ],
        assessment: [
            { label: "-- Select One --", value: ""},
            { label: "Excellent", disabled: (this.user === 5) ? false : true },
            { label: "Very Good", disabled: (this.user === 5) ? false : true },
            { label: "Good", disabled: (this.user === 5) ? false : true },
            { label: "Poor", disabled: (this.user === 5) ? false : true },
        ]
    }
  },
  methods: {
    updateModalVisibility(){
      let visibility = this.showModal;
      this.$emit("show-modal", !visibility);
    }, //updateModalVisibility method
    async newHomeworkPlan () {
        this.$emit("show-plan", this.formValues);
        this.formValues = {};
    }, //end of newHomeworkPlan
  },
  mounted(){
  },
}
</script>
