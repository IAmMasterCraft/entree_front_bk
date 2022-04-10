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
                  <span>Teachers</span>
                </CCol>
                <CCol lg="6">
                  <TeacherPreview :showModal="showTeachermodal" @show-TeacherPreview="CloseTeacherPreview" :teachers="TeacherPreviewobj" />
                  <AddTeacher :showModal="showModal" @show-modal="toggleModal" @show-teachers="updateTeachers" />
                  <CButton
                    color="success"
                    variant="outline"
                    square
                    class="text-right float-right"
                    size="sm"
                    :disabled="isBtnDisabled"
                    @click="toggleModal"
                    >
                      Add Teacher
                    </CButton>
                </CCol>
              </CRow>
            </CCardHeader>
            <CCardBody>
              <CDataTable
                :items="items"
                :fields="fields"
                column-filter
                table-filter
                items-per-page-select
                :items-per-page="5"
                hover
                sorter
                pagination
              >
               <template #show_details="{item}">
                  <td class="py-2">
                    <CButton
                      @click="toggleTeacherPreview(item.index_value) "
                      color="info"
                      variant="outline"
                      square
                      :disabled="isBtnDisabled"
                      size="sm"
                      class="fa fa-eye"
                    />
                  </td>
                </template>
                <template #reset="{item}">
                  <td class="py-2">
                    <CButton
                      color="danger"
                      variant="outline"
                      square
                      size="sm"
                      :disabled="isBtnDisabled"
                      @click="ResetPassword(item.reset)"
                    >Reset</CButton>
                  </td>
                </template>
                <template #status="{item}">
                  <td>
                    <CBadge :color="getBadge(item.status)">
                      {{item.status}}
                    </CBadge>
                  </td>
                </template>
                 
              </CDataTable>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </div>
  </div>
</template>

<script>
import AddTeacher from '../modals/AddTeacher';
import TeacherPreview from '../modals/TeacherPreview';

const items = [];

const fields = [
  { key: 'first_name', _style:'min-width:100px' },
  { key: 'last_name', _style:'min-width:100px;' },
  { key: 'email', _style:'min-width:100px;' },
  'registered',
  { key: 'total_subject', _style:'min-width:100px;' },
  { key: 'reset', label: '', _style: 'width:1%', sorter: false, filter: false },

  {
    key: 'show_details',
    label: '',
    _style: 'width:1%',
    sorter: false,
    filter: false
  }
]


export default {
  name: 'ManageTeachers',
  components: {
    AddTeacher,
    TeacherPreview
  },
  data () {
    return {
      isBtnDisabled: false,
      showProgress: true,
      showTeachermodal: false,
      TeacherPreviewobj: {},
      notification: {
        type: "success",
        countdown: 2,
        message: "Loading Teachers . . . ",
      },
      showModal: false,

      items: items.map((item, id) => { return {...item, id}}),
      fields,
      details: [],
      collapseDuration: 0
    }
  },
  methods: {
    color (value) {
      let $color
      if (value <= 25) {
        $color = 'info'
      } else if (value > 25 && value <= 50) {
        $color = 'success'
      } else if (value > 50 && value <= 75) {
        $color = 'warning'
      } else if (value > 75 && value <= 100) {
        $color = 'danger'
      }
      return $color
    },
    getBadge (status) {
      switch (status) {
        case 'Active': return 'success'
        case 'Inactive': return 'secondary'
        case 'Pending': return 'warning'
        case 'Banned': return 'danger'
        default: 'primary'
      }
    },
    toggleDetails (item) {
      this.$set(this.items[item.id], '_toggled', !item._toggled)
      this.collapseDuration = 300
      this.$nextTick(() => { this.collapseDuration = 0})
    },

   

    async allClasses () {
      try {
        const config = {
          method: "get",
          url: `${window.location.origin}/src/api/teachers`,
          data: null,
          headers: {"Authorization" : localStorage.getItem("token"),},
          withCredentials: false,
        };
        const response = await this.axios(config);
        this.showData(response.data);
        // localStorage.setItem("token", `${response.data.token_type} ${response.data.access_token}`);
        // this.$router.push({name: "Home", data: response.data});
      } catch(error) {
        if (error.response) {
          this.notification.message = error.response.data.message ?? `<code>STATUS: ${error.response.data.error.status}<br />MESSAGE: ${error.response.data.error.message}</code>`;
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
    }, //end of allClasses
    showData(response){
      console.log(response);
      const teachers = response.map((TeacherPreviewobj,index) => {
        return {
           index_value: index,
          id: TeacherPreviewobj.id,
          first_name: TeacherPreviewobj.first_name,
          last_name: TeacherPreviewobj.last_name,
          email: TeacherPreviewobj.email,
          registered: TeacherPreviewobj.createddate,
          total_subject: TeacherPreviewobj.subject_count ?? 0,
          login_count: TeacherPreviewobj.login_count ?? 0,
          reset: TeacherPreviewobj.id,
        };
      });
      this.items = teachers;
      this.showProgress = false;
      this.isBtnDisabled = false;
    }, //end of showData
    toggleModal(){
      this.showModal = !this.showModal;
    }, //end of toggleModal

     toggleTeacherPreview(index_value){
          this.TeacherPreviewobj = this.items[index_value];
        this.showTeachermodal = !this.showTeachermodal
        console.log(index_value);
    },//end of toggleTeacherPreview

      CloseTeacherPreview(closeTeacher){
       this.showTeachermodal = closeTeacher;
    },

    async updateTeachers(isNewTeacher) {
      this.showProgress = !this.showProgress;
      this.showModal = false;
       this.showTeachermodal = false;
      if (isNewTeacher) {
        await this.allClasses();
      } else {
        this.notification.message = `<code>Something went wrong with registering new teacher</code>`;
        this.notification.countdown = 20;
        this.notification.type = "danger";
      }
    }, //end of updateTeachers
    async ResetPassword(id) {
      this.showProgress = true;
      this.isBtnDisabled = true;
      try {
        const config = {
          method: "post",
          url: `${window.location.origin}/src/api/reset-password`,
          data: {
            user: id,
          },
          headers: {"Authorization" : localStorage.getItem("token"),},
          withCredentials: false,
        };
        const response = await this.axios(config);
        if (response.data.status == 1) {
          this.notification.message = `Password reset successful, default password: 'p@ss'`;
          this.notification.countdown = 20;
          this.notification.type = "success";
          this.isBtnDisabled = false;
          this.showProgress = false;
        } else {
          this.notification.message = `<code>Something went wrong with password reset!</code>`;
          this.notification.countdown = 20;
          this.notification.type = "danger";
          this.isBtnDisabled = false;
          this.showProgress = false;
        }
        // this.showData(response.data);
        // localStorage.setItem("token", `${response.data.token_type} ${response.data.access_token}`);
        // this.$router.push({name: "Home", data: response.data});
      } catch(error) {
        if (error.response) {
          this.notification.message = error.response.data.message ?? `<code>STATUS: ${error.response.data.error.status}<br />MESSAGE: ${error.response.data.error.message}</code>`;
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
    }, //end of ResetPassword
  },
  created(){
    this.allClasses();
  }
}
</script>
