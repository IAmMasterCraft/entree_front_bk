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
                <h5 class="px-3">{{ checkAction }} Reading Club/Programme</h5>
                <i class="btn btn-info fa fa-close pull-right" @click="updateModalVisibility"></i>
            </template>
            <CRow>
                <CCol sm="6">
                    <CInput 
                        type="date"
                        label="Date"
                        autocomplete="off"
                        v-model="formValues.date"
                    />
                </CCol>
                <CCol sm="6">
                    <CInput 
                        type="text"
                        label="Book Title"
                        autocomplete="off"
                        placeholder="Enter Book Title"
                        v-model="formValues.book_title"
                    />
                </CCol>
            </CRow>
            <CRow>
                <CCol sm="6">
                    <CInput 
                        type="text"
                        label="Chapter"
                        autocomplete="off"
                        placeholder="Enter Chapter"
                        v-model="formValues.chapter"
                    />
                </CCol>
                <CCol sm="6">
                    <CTextarea 
                        type="text"
                        label="New Words"
                        autocomplete="off"
                        placeholder="Enter New Words"
                        v-model="formValues.new_words"
                    />
                </CCol>
            </CRow>
            <CRow>
                <CCol sm="6">
                    <CTextarea 
                        type="text"
                        label="Reading Assignment"
                        autocomplete="off"
                        placeholder="Enter Reading Assignment"
                        v-model="formValues.reading_assignment"
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
                        @click="newProgram"
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
  name: "ReadingClubModal",
  props: {
    showModal: {
      type: Boolean,
      required: true,
      default: false,
    },
    readingClub: {
        type: Object,
    },
    subjects: {
      type: Array,
    }
  },
  watch: {
      readingClub(newRead) {
          if (newRead != null) {
              this.formValues = newRead;
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
        formValues: {},
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
    async newProgram () {
        this.$emit("show-program", this.formValues);
        this.formValues = {};
    }, //end of newStudent
  },
  mounted(){
  },
}
</script>
