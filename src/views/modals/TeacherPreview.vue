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
        <h5 class="px-3">Teacher's Details</h5>
        <i class="btn btn-info fa fa-close pull-right" @click="updateModalVisibility"></i>
      </template>
      This represent  {{ teachers.first_name}} details in your school <hr />
	    <CRow>
				<CCol lg="12">
					

                  
                   <div class=" py-4 row">
                        <div class="col">
                            <div class=" text-center d-flex flex-column" > 
                            <h3> First Name </h3>  
                            <h4 class=" font-weight-normal" >  {{ teachers.first_name }} </h4>
                       </div>
                        </div>
                        <div class="col">
                        <div class="text-center  d-flex flex-column" > 
                            <h3> Last Name </h3>  
                            <h4 class=" font-weight-normal" >  {{ teachers.last_name }} </h4>
                       </div>
                        </div>
                        <div class="col">
                         <div class="text-center d-flex flex-column" > 
                            <h3> phone number</h3>  
                            <h4 class=" font-weight-normal" > {{ teachers.phone_number }} </h4>
                       </div>
                        </div>
                    </div>

                     <div class=" py-4 row">
                           <div class="col">
                            <div class=" text-center d-flex flex-column" > 
                            <h3> Email </h3>  
                            <h4 class=" font-weight-normal" >  {{ teachers.email }} </h4>
                             </div>
                             </div>
                     </div>
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
  name: "TeacherPreview",
  props: {
    showModal: {
      type: Boolean,
      required: true,
      default: false,
    },
    teachers: {
      type: Object,
    }
  },
  data () {
    return {
      warningModal: false,
      formValues: {
        first_name: null,
        last_name: null,
        t_email: null,
        t_password: null,
        bio: null,
      },
      isBtnDisabled: false,
      showProgress: false,
      notification: {
        type: "success",
        countdown: 2,
        message: "Loading Teacher . . . ",
      },
    }
  },
  methods: {
    updateModalVisibility(){
      let visibility = this.showModal;
      this.$emit("show-TeacherPreview", !visibility);
    }, //updateModalVisibility method
  
}



}
</script>
