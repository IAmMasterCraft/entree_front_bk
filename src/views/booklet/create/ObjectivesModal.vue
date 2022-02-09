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
            <CRow class="my-3">
                <CCol sm="6">
                    <CInputCheckbox
                        :label="`Objective Status (${formValues.status ? 'is achieved' : 'is NOT achieved'})`"
                        required="true"
                        :checked.sync="formValues.status"
                    />
                </CCol>
            </CRow>
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
                        placeholder="Enter Objective"
                        v-model="formValues.objective"
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
                        @click="newObjective"
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
  name: "AddObjectives",
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
    async newObjective () {
        this.$emit("show-objectives", this.formValues);
        this.formValues = {};
    }, //end of newStudent
  },
  mounted(){
  },
}
</script>
