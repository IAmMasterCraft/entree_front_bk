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
        <h5 class="px-3">Link a new ward to {{ $route.params.name.toUpperCase().replace(/-/g, " ") }}</h5>
        <i class="btn btn-info fa fa-close pull-right" @click="updateModalVisibility"></i>
      </template>
      Search and filter all students below <hr />
			<CRow>
				<CCol lg="12">
          <CDataTable
            :items="items"
            :fields="fields"
            column-filter
            table-filter
            items-per-page-select
            :items-per-page="5"
            hover
            sorter
            pagination>
              <template #show_details="{item}">
                <td class="py-2">
                  <CInputCheckbox
                    name="Select"
                    :checked="false"
                    :value="item.user_id"
                    @change="selectStudent" />
                </td>
              </template>
            </CDataTable>
				</CCol>
			</CRow>
			<CRow>
				<CCol lg="12">
					<CButton
						type="submit"
						color="info"
						block
            :disabled="isBtnDisabled"
            @click="linkWards"
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
const items = [];

const fields = [
  { key: 'full_name', _style:'min-width:200px' },
  { key: 'class', _style:'min-width:100px;' },
  {
    key: 'show_details',
    label: '',
    _style: 'width:1%',
    sorter: false,
    filter: false
  }
];

export default {
  name: "AddWard",
  props: {
    showModal: {
      type: Boolean,
      required: true,
      default: false,
    },
    classes: {
      type: Array,
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
        message: "Loading Student List . . . ",
      },
      items: items.map((item, id) => { return {...item, id}}),
      fields,
      students_selected: [],
    }
  },
  methods: {
    updateModalVisibility(){
      let visibility = this.showModal;
      this.$emit("show-modal", !visibility);
    }, //updateModalVisibility method
    async allStudents () {
      try {
        this.isBtnDisabled = true;
        this.showProgress = true;
        const config = {
          method: "get",
          url: "https://entreelab.com.ng/src/api/students",
          headers: {"Authorization" : localStorage.getItem("token"),},
        };
        const response = await this.axios(config);
        // this.updateModalVisibility();
        this.showData(response.data);
        // localStorage.setItem("token", `${response.data.token_type} ${response.data.access_token}`);
        // this.$router.push({name: "Home", data: response.data});
      } catch(error) {
        if (error.response) {
          this.notification.message = error.response.data.message ?? `<code>STATUS: ${error.response.data.error.status}<br />MESSAGE: ${error.response.data.error.message}</code>`;
          this.notification.countdown = 20;
          this.notification.type = "danger";
          // this.isBtnDisabled = !this.isBtnDisabled;
          // this.showProgress = !this.showProgress;
        } else if (error.request) {
          console.log(error.request);
          // this.notification.countdown = 20;
          // this.notification.type = "danger";
          // this.isBtnDisabled = !this.isBtnDisabled;
          // this.showProgress = !this.showProgress;
        } else {
          console.log("Developer fucked up!");
          // this.notification.countdown = 20;
          // this.notification.type = "danger";
          // this.isBtnDisabled = !this.isBtnDisabled;
          // this.showProgress = !this.showProgress;
        }
      }
    }, //end of newClass
    showData (response) {
      const students = response.map(stdObj => {
        return {
          id: stdObj.id,
          full_name: `${stdObj.first_name} ${stdObj.last_name}`,
          class: stdObj.grade_name,
          user_id: stdObj.user_id,
        };
      });
      this.items = students;
      this.showProgress = !this.showProgress;
      this.isBtnDisabled = false;
    }, //end of showData
    selectStudent(evt){
      console.log(evt);
      if (evt.target.checked) {
        const student_id = evt.target.value;
        if (!this.students_selected.includes(student_id)) this.students_selected.push(student_id);
      }
    }, //end of selectStudent
    async linkWards () {
      try {
        this.isBtnDisabled = true;
        this.showProgress = true;
        const config = {
          method: "post",
          url: "https://entreelab.com.ng/src/api/parents/wards",
          data: {
            user_id: this.$route.params.id,
            all_wards: this.students_selected,
          },
          headers: {"Authorization" : localStorage.getItem("token"),},
        };

        await this.axios(config);
        this.$emit("submitted", true);
      } catch (error) {
        console.log(error.message);
      }
    }, //end of linkWards
  },
  created() {
    this.allStudents();
  },
}
</script>
