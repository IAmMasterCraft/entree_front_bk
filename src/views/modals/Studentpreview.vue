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
        <h5 class="px-3">Student details</h5>
        <i class="btn btn-info fa fa-close pull-right" @click="updateModalVisibility"></i>
      </template  >
         {{ students.first_name }} details... <hr />

              <CCol class=" " :md="4">
              <div>   <img rounded thumbnail :src="students.avatar" width="200" height="200"/> </div>
              </CCol>
			<CRow class="px-5" >

              

				<CCol lg="  pt-4 12">
                   
                   
                  <div class=" py-4 row">
                        <div class="col">
                            <div class=" text-center d-flex flex-column" > 
                            <h3> First Name </h3>  
                            <h4 class=" font-weight-normal" >  {{ students.first_name }} </h4>
                       </div>
                        </div>
                        <div class="col">
                        <div class="text-center  d-flex flex-column" > 
                            <h3> Last Name </h3>  
                            <h4 class=" font-weight-normal" >  {{ students.last_name }} </h4>
                       </div>
                        </div>
                        <div class="col">
                         <div class="text-center d-flex flex-column" > 
                            <h3> Grade name </h3>  
                            <h4 class=" font-weight-normal" > {{ students.grade_name }} </h4>
                       </div>
                        </div>
                    </div>

                         <div class=" pb-4 row">
                                    <div class="col">
                                        <div class=" text-center d-flex flex-column" > 
                                        <h3> phone number </h3>  
                                        <h4 class=" font-weight-normal" >  {{ students.phone_number }} </h4>
                                         </div>
                                     </div>
                                  <div class="col">
                                        <div class="text-center  d-flex flex-column" > 
                                            <h3> Email </h3>  
                                            <h4 class=" font-weight-normal" >  {{ students.email }} </h4>
                                         </div>
                                    </div>
                                 <div class="col">
                                     <div class="text-center d-flex flex-column" > 
                                          <h3> subjects offered </h3>  
                                          <h4 class=" font-weight-normal" > {{ students.subject_count }} </h4>
                                     </div>
                                </div>
                            </div>
                
                         <!-- <div class=" pb-4 row">
                                    <div class="col">
                                        <div class=" text-center d-flex flex-column" > 
                                        <h3> phone number </h3>  
                                        <h4 class=" font-weight-normal" >  {{ students.phone_number }} </h4>
                                         </div>
                                     </div>
                                  <div class="col">
                                        <div class="text-center  d-flex flex-column" > 
                                            <h3> Email </h3>  
                                            <h4 class=" font-weight-normal" >  {{ students.email }} </h4>
                                         </div>
                                    </div>
                                 <div class="col">
                                     <div class="text-center d-flex flex-column" > 
                                          <h3> subjects offered </h3>  
                                          <h4 class=" font-weight-normal" > {{ students }} </h4>
                                     </div>
                                </div>
                            </div> -->
                
				
				
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
  name: "Studentpreview",
  props: {
    showModal: {
      type: Boolean,
      required: true,
      default: false,
    },
    students: {
      type: Object,
    }
  },
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
        message: "Loading student information . . . ",
      },
    }
  },
  methods: {
    updateModalVisibility(){
      let visibility = this.showModal;
      this.$emit("show-studentpreview", !visibility);
    }, //updateModalVisibility method
  
  },
}
</script>
