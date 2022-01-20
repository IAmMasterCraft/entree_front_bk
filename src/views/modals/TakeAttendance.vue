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
        <h5 class="px-3">Mark Attendance of Students in {{ $route.params.class }} for {{ today }}</h5>
        <i class="btn btn-info fa fa-close pull-right" @click="updateModalVisibility"></i>
      </template>
      <CRow>
				<CCol sm="12">
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
                <template #show_details="{ item }">
                  <td class="py-2 d-flex">
                    Mark As Present <CInputCheckbox 
                      class="mx-2"
                      @update:checked="MarkAsPresent(item.id)"
                    />
                  </td>
                </template>
              </CDataTable>
				</CCol>
			</CRow> <br />
			<CRow>
				<CCol lg="12">
        {{ formValues.student_present }}
					<CButton
						type="submit"
						color="info"
						block
            :disabled="isBtnDisabled"
            @click="SubmitAttendance"
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
const fields = [
  { key: "name" },
  {
    key: "show_details",
    label: "",
    sorter: false,
    filter: false,
  },
];

export default {
  name: "TakeAttendance",
  props: {
    showModal: {
      type: Boolean,
      required: true,
      default: false,
    },
    students: {
      type: Array,
    }
  },
  data () {
    return {
      warningModal: false,
      formValues: {
        students_present: [],
        class_id: parseInt(this.$route.params.id),
      },
      isBtnDisabled: false,
      showProgress: false,
      notification: {
        type: "success",
        countdown: 2,
        message: "Loading Students . . . ",
      },
      today: new Date,
      items: [],
      fields,
    }
  },
  methods: {
    updateModalVisibility(){
      let visibility = this.showModal;
      this.$emit("show-modal", !visibility);
    }, //updateModalVisibility method
    async SubmitAttendance () {
      try {
        this.isBtnDisabled = true;
        this.showProgress = true;
        const config = {
          method: "post",
          url: "https://entreelab.com.ng/src/api/register",
          data: this.formValues,
          headers: {"Authorization" : localStorage.getItem("token"),},
        };
        const response = await this.axios(config);
        // this.updateModalVisibility();
        let updatedStudents = response.data;
        this.formValues.user_type = null;
        this.formValues.first_name = null;
        this.formValues.last_name = null;
        this.formValues.email = null;
        this.formValues.password = null;
        this.formValues.subjects = null;
        this.$emit("show-students", updatedStudents);
        // localStorage.setItem("token", `${response.data.token_type} ${response.data.access_token}`);
        // this.$router.push({name: "Home", data: response.data});
      } catch(error) {
        if (error.response) {
          this.notification.message = error.response.data.message ?? `<code>STATUS: ${error.response.data.error.status ?? ""}<br />MESSAGE: ${error.response.data.error.message ?? error}</code>`;
          this.notification.countdown = 20;
          this.notification.type = "danger";
          this.isBtnDisabled = !this.isBtnDisabled;
          this.showProgress = !this.showProgress;
        } else if (error.request) {
          console.log(error.request);
        } else {
          console.log("Developer fucked up!");
        }
      }
    }, //end of newStudent
    async allStudents() {
      try {
        const config = {
          method: "get",
          url: `https://entreelab.com.ng/src/api/school/students/${this.$route.params.id}`,
          data: null,
          headers: { Authorization: localStorage.getItem("token") },
          withCredentials: false,
        };
        const response = await this.axios(config);
        this.items = response.data.map(student => {
          return {
            id: student.id,
            name: `${student.first_name} ${student.last_name}`,
          };
        });
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
    MarkAsPresent(id) {
      if (!this.formValues.student_present.includes(id)) {
        this.formValues.student_present.push(id);
      }
    }, //end of MarkAsPresent
    subjectCheckbox(event){
      const subjectId = event.target.value;
      if (this.formValues.subjects.includes(subjectId)) this.formValues.subjects = this.formValues.subjects.filter(id => id !== subjectId);
      else this.formValues.subjects.push(parseInt(subjectId));
    }, //end of subjectCheckbox
  },
  mounted(){
    this.allStudents();
  },
}
</script>
