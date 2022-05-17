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
                  <span>Intervention Plan</span>
                </CCol>
                <CCol lg="6" v-if="user === 3 && action != 'edit'">
                  <InterventionModal
                    :showModal="showModal"
                    :subjects="subjects"
                    :intervention="interventionEditItem"
                    @show-modal="toggleModal"
                    @show-intervention="updatePlan"
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
                    Add Intervention Plan
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
                <template #edit_info="{ item }">
                  <td class="py-2" v-if="action != 'edit'">
                    <CButton
                      color="info"
                      variant="outline"
                      square
                      :disabled="isBtnDisabled"
                      size="sm"
                      style="cursor: pointer;"
                      class="fa fa-edit"
                      @click="EditInterventionItem(item)"
                    />
                    <CButton
                      color="danger"
                      variant="outline"
                      square
                      :disabled="isBtnDisabled"
                      size="sm"
                      style="cursor: pointer;"
                      class="fa fa-trash"
                      @click="DeleteRecord(item.id)"
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
import InterventionModal from "../create/InterventionModal";

const items = [];

const fields = [
  { key: "subject", _style: "min-width:100px" },
  { key: "intervention_plan", _style: "min-width:100px;" },
  {
    key: "edit_info",
    label: "",
    _style: "width:1%",
    sorter: false,
    filter: false,
  },
];

export default {
  name: "InterventionPlan",
  components: {
    InterventionModal,
  },
  props: {
    action: {
      type: String,
    },
    allIntervention: {
      type: Array,
    },
  },
  data() {
    return {
      isBtnDisabled: false,
      showProgress: true,
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
      ],
      interventionEditItem: null,
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
          url: `${/*window.location.origin*/'https://entreelab.org'}/src/api/school/subjects/${this.$route.params.id}`,
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
    async updatePlan(updated) {
      this.showProgress = false;
      this.showModal = false;
      if (updated) {
        if (updated.edit) {
          this.items[updated.id] = updated;
        } else {
          if (!this.items) this.items = [];
          const id = this.items.length;
          this.items.push({
              id,
              subject: updated.subject,
              intervention_plan: updated.intervention_plan,
          });
        }
        this.$emit("submit-intervention", {key: "intervention_plan", value: JSON.stringify(this.items)});
      } else {
        this.notification.message = `<code>Something went wrong with creating new subject objective</code>`;
        this.notification.countdown = 20;
        this.notification.type = "danger";
      }
    }, //end of updateSubjects
    EditInterventionItem(interventionItem) {
      interventionItem.timeStamp = Date.now();
      this.interventionEditItem = interventionItem;
      this.showModal = true;
    }, // end of EditInterventionItem
    DeleteRecord(pointer) {
      this.items = this.items.splice(pointer, 1);
      this.$emit("submit-intervention", {key: "intervention_plan", value: JSON.stringify(this.items)});
    }, //end of DeleteRecord
  },
  created() {
    
    try {
      if (this.user === 3) this.getSubjects();
      this.items = this.allIntervention;
      this.$watch('allIntervention', (update) => {
        this.items = update;
      });
      this.showProgress = false;
    } catch (error) {
      // console.log(error.message);
    }
  },
};
</script>
