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
                  <span>Attendance Records </span>
                </CCol>
                <CCol lg="6" v-if="user === 3">
                  <TakeAttendance
                    :showModal="showModal"
                    @show-modal="toggleModal"
                    @show-students="updateStudents"
                  />
                  <CButton
                    color="success"
                    variant="outline"
                    square
                    class="text-right float-right"
                    size="sm"
                    :disabled="isBtnDisabled"
                    @click="toggleModal"
                    >
                    Take Attendance
                  </CButton>
                </CCol>
              </CRow>
            </CCardHeader>
            <CCardHeader>
              <CRow>
                <CCol lg="6"></CCol>
                <CCol lg="6" v-if="user === 3 || user === 2">
                  <CRow class="text-right float-right">
                    <input type="date" pattern="\d{2}-\d{2}-\d{4}" v-model="searchDate" />
                    <CButton
                      color="success"
                      variant="outline"
                      square
                      size="sm"
                      class="mx-3"
                      :disabled="isBtnDisabled"
                      @click="SearchAttendance(searchDate)"
                    >Search</CButton>
                  </CRow>
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
                <template #status="{ item }">
                  <td>
                    <CBadge :color="getBadge(item.status)">
                      {{ item.status }}
                    </CBadge>
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

import TakeAttendance from "../modals/TakeAttendance";

const items = [];

const fields = [
  { key: "name", _style: "min-width:100px" },
  // { key: "class", _style: "min-width:100px;" },
  { key: "day", _style: "min-width:100px;" },
  { key: "date", _style: "min-width:100px;" },
  // {
  //   key: "show_details",
  //   label: "",
  //   _style: "width:1%",
  //   sorter: false,
  //   filter: false,
  // },
];

export default {
  name: "AttendanceList",
  components: {
    TakeAttendance,
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

      items: items.map((item, id) => {
        return { ...item, id };
      }),
      fields,
      details: [],
      searchDate: null,
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
          url: `${window.location.origin}/src/api/attendance`,
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
      this.items = response.map(resp => {
        return {
          name: `${resp.first_name} ${resp.last_name}`,
          // class: resp.grade_name,
          day: resp.day,
          date: resp.date,
        }
      });
      this.isBtnDisabled = false;
      this.showProgress = false;
    }, //end of showData
    toggleModal() {
      this.showModal = !this.showModal;
    }, //end of toggleModal
    async updateStudents(updated) {
      this.showProgress = !this.showProgress;
      this.showModal = false;
      if (updated) {
        this.allStudents();
      } else {
        this.notification.message = `<code>Something went wrong with creating new subject</code>`;
        this.notification.countdown = 20;
        this.notification.type = "danger";
      }
    }, //end of updateSubjects
    async SearchAttendance (date) {
        this.isBtnDisabled = true;
        this.showProgress = true;
        const splittedDate = date.split("-");
        const revert = `${splittedDate[2]}-${splittedDate[1]}-${splittedDate[0]}`;
        try {
            const config = {
              method: "get",
              url: `${window.location.origin}/src/api/attendance/get-attendance/${revert}`,
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
    }, //end of SearchAttendance
  },
  created() {
    this.allStudents();
  },
};
</script>
