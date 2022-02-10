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
                  <span>Reading Club Programme</span>
                </CCol>
                <CCol lg="6" v-if="user === 3 && action != 'edit'">
                  <ReadingClubModal
                    :showModal="showModal"
                    @show-modal="toggleModal"
                    @show-program="updateProgram"
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
                    Add Programme
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
              </CDataTable>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </div>
  </div>
</template>

<script>
import ReadingClubModal from "../create/ReadingClubModal";

const items = [];

const fields = [
  { key: "date", _style: "min-width:100px" },
  { key: "book_title", _style: "min-width:100px;" },
  { key: "chapter", _style: "min-width:100px;" },
  { key: "new_words", _style: "min-width:100px;" },
  { key: "reading_assignment", _style: "min-width:100px;" },
];

export default {
  name: "ReadingClub",
  components: {
    ReadingClubModal,
  },
  props: {
    action: {
      type: String,
    },
    allReadingClub: {
      type: Array,
    },
  },
  data() {
    return {
      isBtnDisabled: false,
      showProgress: false,
      user: parseInt(localStorage.getItem("user_type")),
      notification: {
        type: "success",
        countdown: 2,
        message: "Loading Subjects . . . ",
      },
      showModal: false,

      items: items.map((item, id) => {
        return { ...item, id };
      }),
      fields,
      details: [],
      collapseDuration: 0,
      subjects: [
        { label: "-- Select One --", value: ""},
      ]
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

    async getSubjects(){
      try {
        const config = {
          method: "get",
          url: `https://entreelab.com.ng/src/api/school/subjects/${this.$route.params.id}`,
          data: null,
          headers: {"Authorization" : localStorage.getItem("token"),},
          withCredentials: false,
        };
        const response = await this.axios(config);
        // this.showData(response.data);
        response.data.forEach(subject => this.subjects.push(subject.subject_name));
        this.showProgress = false;
      } catch(error) {
        if (error.response.data.message) {
          this.notification.message = error.response.data.message ?? `Something went wrong!</code>`;
          this.notification.countdown = 20;
          this.notification.type = "danger";
          this.teachers = [{label: "Something went wrong", value: null,}];
        } else {
          this.notification.message = error.message ?? `Something went wrong!</code>`;
          this.notification.countdown = 20;
          this.notification.type = "danger";
          this.teachers = [{label: "Something went wrong", value: null,}];
        }
        
      }
    }, //end of getSubjects
    toggleModal() {
      this.showModal = !this.showModal;
    }, //end of toggleModal
    async updateProgram(updated) {
      this.showProgress = false;
      this.showModal = false;
      if (updated) {
        const id = this.items.length;
        this.items.push({
            id,
            date: updated.date,
            book_title: updated.book_title,
            chapter: updated.chapter,
            new_words: updated.new_words,
            reading_assignment: updated.reading_assignment,
        });
        this.$emit("submit-reading-club", {key: "reading_club_programme", value: JSON.stringify(this.items)});
      } else {
        this.notification.message = `<code>Something went wrong with creating new subject objective</code>`;
        this.notification.countdown = 20;
        this.notification.type = "danger";
      }
    }, //end of updateSubjects
  },
  created() {
    if (this.allReadingClub.length > 0) this.items =  this.allReadingClub;
  },
};
</script>
