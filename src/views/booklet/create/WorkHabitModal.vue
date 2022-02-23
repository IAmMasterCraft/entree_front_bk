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
                <h5 class="px-3">{{ checkAction }} Work Habit in School</h5>
                <i class="btn btn-info fa fa-close pull-right" @click="updateModalVisibility"></i>
            </template>
            <CRow>
                <CCol sm="6">
                    <CSelect
                        label="Select Habit"
                        autocomplete="off"
                        :options="habit"
                        :value.sync="formValues.habit"
                    />
                </CCol>
                <CCol sm="6">
                    <CSelect
                        label="Select Performance"
                        autocomplete="off"
                        :options="performance"
                        :value.sync="formValues.performance"
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
                        @click="newHabit"
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
  name: "WorkHabitModal",
  props: {
    showModal: {
      type: Boolean,
      required: true,
      default: false,
    },
    workHabit: {
        type: Object
    },
    subjects: {
      type: Array,
    }
  },
  watch: {
      workHabit(newWorkhabit) {
          if (newWorkhabit != null) {
              this.formValues = newWorkhabit;
              this.formValues.edit = true;
            }
      },
  },
  computed: {
      checkAction: function () {
          return (this.formValues.edit) ? "Edit" : "Add";
      },
  },
  data () {
    return {
        warningModal: false,
        formValues: {
            edit: false
        },
        isBtnDisabled: false,
        showProgress: false,
        notification: {
            type: "success",
            countdown: 2,
            message: "Loading Subject . . . ",
        },
        habit: [
            { label: "-- Select One --", value: "" },
            "Write neatly",
            "Pay attention",
            "Finish my work",
            "Follow direction",
            "Work independently",
        ],
        performance: [
            { label: "-- Select One --", value: "" },
            "Above Average (ABV)",
            "Average (AV)",
            "Needs Improvement (NI)",
            "Unacceptable (UA)",
        ],
    }
  },
  methods: {
    updateModalVisibility(){
      let visibility = this.showModal;
      this.$emit("show-modal", !visibility);
    }, //updateModalVisibility method
    async newHabit () {
        this.$emit("show-habit", this.formValues);
        this.formValues = {};
    }, //end of newStudent
  },
  mounted(){
  },
}
</script>
