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
        <h5 class="px-3"> Class Details </h5>
        <i class="btn btn-info fa fa-close pull-right" @click="updateModalVisibility"></i>
      </template>
      This represent {{ classes.class_name }}  class/level details ... <hr />
			<CRow>
				<CCol lg="12">
					

                  
                  <div class=" py-4 row">
                        <div class="col">
                            <div class=" text-center d-flex flex-column" > 
                            <h3> Class Name </h3>  
                            <h4 class=" font-weight-normal" > {{ classes.class_name }} </h4>
                       </div>
                        </div>
                        <div class="col">
                        <div class="text-center  d-flex flex-column" > 
                            <h3> Total subjects</h3>  
                            <h4 class=" font-weight-normal" >  {{ classes.total_subject }} </h4>
                       </div>
                        </div>
                        <div class="col">
                         <div class="text-center d-flex flex-column" > 
                            <h3> Total Students </h3>  
                            <h4 class=" font-weight-normal" > {{ classes.total_student }} </h4>
                       </div>
                        </div>
                    </div>
				</CCol>
			</CRow>
			<CRow>
				<CCol lg="12">
          
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
  name: "ClassPreview",
  props: {
    showModal: {
      type: Boolean,
      required: true,
      default: false,
    },
    classes: {
      type: Object,
    }
  },
  // created() {
    
  //   this.$watch('classes', (update) => {
     
  //   });
  // },
  data () {
    return {
      warningModal: false,
      formValues: {
        grade_name: null,
      },
      isBtnDisabled: false,
      showProgress: false,
      notification: {
        type: "success",
        countdown: 2,
        message: "Loading Classes . . . ",
      },
    }
  },
  methods: {
    updateModalVisibility(){
      let visibility = this.showModal;
      this.$emit("ClassPreview-modal", !visibility);
    }, //updateModalVisibility method
  
  }
}
</script>
