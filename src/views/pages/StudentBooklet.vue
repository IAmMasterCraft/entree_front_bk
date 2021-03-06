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
                  <span>Student Booklet</span>
                </CCol>
                <CCol lg="6" v-if="user === 3">
                  <CButton
                    color="success"
                    variant="outline"
                    square
                    class="text-right float-right"
                    size="sm"
                    :disabled="isBtnDisabled"
                    @click="navigation({
                      id: $route.params.id,
                      grade_name: $route.params.class
                    })"
                  >
                    Add Booklet
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
                <template #show_details="{ item }">
                  <td class="py-2">
                    <CButton
                      color="info"
                      variant="outline"
                      square
                      :disabled="isBtnDisabled"
                      size="sm"
                      style="cursor: pointer;"
                      class="fa fa-eye"
                      @click="ManagePush(item.id)"
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
  { key: "first_name", _style: "min-width:100px" },
  { key: "last_name", _style: "min-width:100px;" },
  { key: "class", _style: "min-width:100px;" },
  { key: "week", _style: "min-width:100px;" },
  {
    key: "show_details",
    label: "",
    _style: "width:1%",
    sorter: false,
    filter: false,
  },
];

export default {
  name: "StudentBooklet",
  components: {
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
      collapseDuration: 0,
      studentList: [
        { label: "-- Select One --", value: "" },
      ],
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

    async allBooklet() {
      try {
        const config = {
          method: "get",
          url: `${/*window.location.origin*/'https://entreelab.org'}/src/api/booklet/${this.$route.params.id}`,
          data: null,
          headers: { Authorization: localStorage.getItem("token") },
          withCredentials: false,
        };
        if (this.user === 4) config.url = "https://entreelab.org/src/api/booklet/student";
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
    }, //end of allBooklet()
    ManagePush(id) {
      if (this.user === 4) {
        this.$router.push({name: 'View Communication Booklet / Student', params: {booklet: id}})
      } else {
        this.$router.push({name: 'Preview Communication Booklet / ', props: {a: 's'}, params: {id: this.$route.params.id, class: this.$route.params.class.toLowerCase(), booklet: id}})
      }
    }, //end of ManagePush
    showData(response) {
      if (this.user === 3) {
        response.students.forEach(student => {
          this.studentList.push({
            label: `${student.first_name} ${student.last_name}`,
            value: student.user_id,
          });
        });
      }
      
      this.items = response.booklet.map(resp => {
        return {
          id: resp.id,
          first_name: resp.first_name,
          last_name: resp.last_name,
          class: resp.grade_name,
          week: resp.week,
        }
      });
      this.showProgress = !this.showProgress;
    }, //end of showData
    toggleModal() {
      this.showModal = !this.showModal;
    }, //end of toggleModal
    async updateStudents(updated) {
      this.showProgress = !this.showProgress;
      this.showModal = false;
      if (updated) {
        this.allBooklet();
      } else {
        this.notification.message = `<code>Something went wrong with creating new subject</code>`;
        this.notification.countdown = 20;
        this.notification.type = "danger";
      }
    }, //end of updateSubjects
    navigation(classProps) {
      this.$router.push({name: "Communication Booklet / Add", params: {id: classProps.id, class: classProps.grade_name.toLowerCase()}});
    }, //end of navigation
  },
  created() {
    this.allBooklet();
  },
};
</script>
