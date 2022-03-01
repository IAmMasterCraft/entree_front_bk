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
                                    <span>Attendance for {{$route.params.name}} on {{getDate}}</span>
                                </CCol>
                                <CCol lg="6">
                                    <CRow class="text-right float-right">
                                        <input type="date" pattern="\d{2}-\d{2}-\d{4}" :max="getDate" v-model="searchDate" />
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
                                <template #show_details="{}">
                                    <td class="py-2">
                                        <CButton
                                            color="info"
                                            variant="outline"
                                            square
                                            :disabled="isBtnDisabled"
                                            size="sm"
                                            class="fa fa-eye"
                                        />
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

const items = [];

const fields = [
  { key: "name", _style: "min-width:100px" },
  { key: "day", _style: "min-width:100px;" },
  { key: "date", _style: "min-width:100px;" },
];

export default {
    name: "SingleAttendance",
    components: {
    },
    computed: {
        getDate: function () {
            const dateObj = new Date();
            const day = (`0${dateObj.getDate()}`).slice(-2);
            const month = (`0${(dateObj.getMonth() + 1)}`).slice(-2);
            const year = dateObj.getFullYear();
            const fullDate = `${day}-${month}-${year}`;
            return fullDate;
        }
    },
  data() {
    return {
      isBtnDisabled: false,
      showProgress: true,
      user: parseInt(localStorage.getItem("user_type")),
      notification: {
        type: "success",
        countdown: 2,
        message: "Loading Attendance . . . ",
      },
      showModal: false,

      items: items.map((item, id) => {
        return { ...item, id };
      }),
      fields,
      details: [],
      collapseDuration: 0,
      searchDate: null,
      searchResponse: [],
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

    async getAttendance() {
        this.isBtnDisabled = true;
        this.showProgress = true;
      try {
        const config = {
          method: "get",
          url: `https://entreelab.com.ng/src/api/attendance/get-student/${this.$route.params.id}`,
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
    async SearchAttendance (date) {
        this.isBtnDisabled = true;
        this.showProgress = true;
        const splittedDate = date.split("-");
        const revert = `${splittedDate[2]}-${splittedDate[1]}-${splittedDate[0]}`;
        try {
            const config = {
            method: "get",
            url: `https://entreelab.com.ng/src/api/attendance/student-attendance/${this.$route.params.id}/${revert}`,
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
    toggleModal() {
      this.showModal = !this.showModal;
    }, //end of toggleModal
  },
  created() {
    this.getAttendance();
  },
};
</script>
