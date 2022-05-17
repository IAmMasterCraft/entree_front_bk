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
                  <span>Students</span>
                </CCol>
                <CCol lg="6">
                  <AddStudent
                    :showModal="showModal"
                    @show-modal="toggleModal"
                    @show-students="updateStudents"
                    v-if="user === 2"
                  />
                  <Studentpreview
                    :showModal="showpreview"
                    @show-studentpreview = "togglepreview"
                    :students = "studentobjects"
                    v-if="user === 2"
                   />
                  
                  <CButton
                    v-if="user === 2"
                    color="success"
                    variant="outline"
                    square
                    class="text-right float-right"
                    size="sm"
                    :disabled="isBtnDisabled"
                    @click="toggleModal"
                  >
                    Add Student
                  </CButton>
                  <CButton
                    v-if="user === 3"
                    color="success"
                    variant="outline"
                    square
                    class="text-right float-right"
                    size="sm"
                    :disabled="isBtnDisabled"
                    @click="LinkToSubject"
                  >
                    Link To Subject
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
                <template #reset="{item}">
                  <td class="py-2">
                    <CButton
                      color="danger"
                      variant="outline"
                      square
                      size="sm"
                      :disabled="isBtnDisabled"
                      v-if="user === 2"
                      @click="ResetPassword(item.reset)"
                    >Reset</CButton>
                  </td>
                </template>
                <template #status="{ item }">
                  <td>
                    <CBadge :color="getBadge(item.status)">
                      {{ item.status }}
                    </CBadge>
                  </td>
                </template>
                <template #show_details="{item}">
                  <td class="py-2">
                    <CButton
                      @click="togglepreview (item.index_value) "
                      color="info"
                      variant="outline"
                      square
                      :disabled="isBtnDisabled"
                      size="sm"
                      class="fa fa-eye"
                    />
                  </td>
                </template>
                <template #details="{ item }">
                  <CCollapse
                    :show="Boolean(item._toggled)"
                    :duration="collapseDuration"
                  >
                    <CCardBody> </CCardBody>
                  </CCollapse>
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
import AddStudent from "../modals/AddStudent";
import Studentpreview from "../modals/Studentpreview";

const items = [];

const fields = [
  { key: "name", _style: "min-width:100px" },
  { key: "class", _style: "min-width:100px;" },
  { key: "login_count", _style: "min-width:100px;" },
  { key: "total_subject", _style: "min-width:100px;" },
  "registered",
  { key: 'reset', label: '', _style: 'width:1%', sorter: false, filter: false },
  {
    key: "show_details",
    label: "",
    _style: "width:1%",
    sorter: false,
    filter: false,
  },
];

export default {
  name: "StudentList",
  components: {
    AddStudent,
    Studentpreview
    
  },
  data() {
    return {
      isBtnDisabled: false,
      showProgress: true,
      user: parseInt(localStorage.getItem("user_type")),
      notification: {
        type: "success",
        countdown: 2,
        message: "Loading Students . . . ",
      },
      showModal: false,
      showpreview: false,
      studentobjects :{

      },
      studentpopulation : [  ],

      items: items.map((item, id) => {
        return { ...item, id };
      }),
      fields,
      details: [],
      collapseDuration: 0,
    };
  },
  methods: {
    color(value) {
      let $color;
      if (value <= 25) {
        $color = "info";
      } else if (value > 25 && value <= 50) {
        $color = "success";
      } else if (value > 50 && value <= 75) {
        $color = "warning";
      } else if (value > 75 && value <= 100) {
        $color = "danger";
      }
      return $color;
    },
    getBadge(status) {
      switch (status) {
        case "Active":
          return "success";
        case "Inactive":
          return "secondary";
        case "Pending":
          return "warning";
        case "Banned":
          return "danger";
        default:
          "primary";
      }
    },
    toggleDetails(item) {
      this.$set(this.items[item.id], "_toggled", !item._toggled);
      this.collapseDuration = 300;
      this.$nextTick(() => {
        this.collapseDuration = 0;
      });
    },

    async allStudents() {
      try {
        const config = {
          method: "get",
          url: `${/*window.location.origin*/'https://entreelab.org'}/src/api/school/students/${this.$route.params.id}`,
          data: null,
          headers: { Authorization: localStorage.getItem("token") },
          withCredentials: false,
        };
        const response = await this.axios(config);
        this.showData(response.data);
        // localStorage.setItem("token", `${response.data.token_type} ${response.data.access_token}`);
        // this.$router.push({name: "Home", data: response.data});
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
    }, //end of allStudent()
    showData(response) {
      this.studentpopulation = response;
      this.items = response.map( (resp,i) => {
        return {
          name: `${resp.first_name} ${resp.last_name}`,
          class: resp.grade_name,
          registered: resp.createddate,
          login_count: resp.login_count,
          total_subject: resp.subject_count,
          index_value : i,
          reset: resp.user_id,
        }
      });
      this.showProgress = !this.showProgress;
    }, //end of showData
    toggleModal() {
      this.showModal = !this.showModal;
    },
     //end of toggleModal
    togglepreview(studentitem = false){
      if (studentitem != false){
        this.studentobjects = this.studentpopulation[studentitem];
      }
      this.showpreview = !this.showpreview;
      
    },
     //end of togglePreview
   
    async updateStudents(updated) {
      this.showProgress = !this.showProgress;
      this.showModal = false;
      this.showpreview = false;

      if (updated) {
        this.allStudents();
      } else {
        this.notification.message = `<code>Something went wrong with creating new subject</code>`;
        this.notification.countdown = 20;
        this.notification.type = "danger";
      }
    }, //end of updateSubjects
    async ResetPassword(id) {
      this.showProgress = true;
      this.isBtnDisabled = true;
      try {
        const config = {
          method: "post",
          url: `${/*window.location.origin*/'https://entreelab.org'}/src/api/reset-password`,
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

    async LinkToSubject() {
      this.showProgress = true;
      this.isBtnDisabled = true;
      try {
        const config = {
          method: "post",
          url: `${/*window.location.origin*/'https://entreelab.org'}/src/api/link/subject/${this.$route.params.id}`,
          headers: {"Authorization" : localStorage.getItem("token"),},
          withCredentials: false,
        };
        await this.axios(config);
        this.notification.message = `<code>Subjects Linked Successfully!</code>`;
        this.notification.countdown = 20;
        this.notification.type = "danger";
        this.isBtnDisabled = false;
        this.showProgress = false;
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
    }, //end of LinkToSubject
  },
  created() {
    this.allStudents();
  },
};
</script>
