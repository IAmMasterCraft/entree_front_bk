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
                <h5 class="px-3">Add Intervention Plan</h5>
                <i class="btn btn-info fa fa-close pull-right" @click="updateModalVisibility"></i>
            </template>
            <CRow>
                <CCol sm="6">
                    <CSelect
                        label="Select Subject"
                        autocomplete="off"
                        :options="subjects"
                        :value.sync="formValues.subject"
                    />
                </CCol>
                <CCol sm="6">
                    <CTextarea
                        label="Objective"
                        autocomplete="off"
                        placeholder="Enter Intervention Plan"
                        v-model="formValues.intervention_plan"
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
                        @click="newIntervention"
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
  name: "AddIntervention",
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
    }
  },
  methods: {
    updateModalVisibility(){
      let visibility = this.showModal;
      this.$emit("show-modal", !visibility);
    }, //updateModalVisibility method
    async newIntervention () {
        this.$emit("show-intervention", this.formValues);
        this.formValues = {};
    }, //end of newStudent
  },
  mounted(){
  },
}
</script>
