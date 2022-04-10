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
                  <span>Bursars</span>
                </CCol>
                <CCol lg="6" v-if="user === 2">
                  <AddBursar :showModal="showModal" @show-modal="toggleModal" @show-bursar="updateBursars" />
                  <CButton
                    color="success"
                    variant="outline"
                    square
                    class="text-right float-right"
                    size="sm"
                    :disabled="isBtnDisabled"
                    @click="toggleModal"
                    >
                      Add Bursar
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
import AddBursar from '../modals/AddBursar';

const items = [];

const fields = [
  { key: 'full_name', _style:'min-width:200px' },
  { key: 'email', _style:'min-width:100px;' },
  'registered',
  // {
  //   key: 'show_details',
  //   label: '',
  //   _style: 'width:1%',
  //   sorter: false,
  //   filter: false
  // }
]


export default {
  name: 'ManageBursars',
  components: {
    AddBursar
  },
  data () {
    return {
      isBtnDisabled: false,
      showProgress: true,
      user: parseInt(localStorage.getItem("user_type")),
      notification: {
        type: "success",
        countdown: 2,
        message: "Loading Bursars . . . ",
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

    async allBursars () {
      try {
        const config = {
          method: "get",
          url: `${window.location.origin}/src/api/bursars`,
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
          // this.isBtnDisabled = !this.isBtnDisabled;
          // this.showProgress = !this.showProgress;
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
      const classes = response.map(classObject => {
        return {
          id: classObject.id,
          full_name: `${classObject.first_name} ${classObject.last_name}`,
          email: classObject.email,
          registered: classObject.createddate,
        };
      });
      this.items = classes;
      this.showProgress = !this.showProgress;
    }, //end of showData
    toggleModal(){
      this.showModal = !this.showModal;
    }, //end of toggleModal
    updateBursars(allBursars) {
      this.showProgress = !this.showProgress;
      this.showModal = false;
      this.allBursars();
    }, //end of updateBursars
  },
  created(){
    this.allBursars();
  }
}
</script>
