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
    <div  v-if="!showProgress && classes.length">
      <CRow>
        <template v-for="myClass in classes">
          <CCol sm="4" :key="myClass.id">
            <CCard class="text-center" @click="navigation({id:myClass.id, grade_name: myClass.grade_name,})">
                <CCardHeader>{{ myClass.grade_name }}</CCardHeader>
                <CCardBody>
                  <i class="fa fa-university fa-5x text-success"></i>
                </CCardBody>
                <CCardFooter>
                  <CBadge color="success"> 
                    {{ (!myClass.student_count) ? 0 : myClass.student_count }} {{ (myClass.student_count && myClass.student_count > 1) ? "Students" : "Student" }} 
                  </CBadge>
                </CCardFooter>
            </CCard>
          </CCol>
        </template>
      </CRow>
    </div>
  </div>
</template>

<script>


export default {
  name: 'ManageStudents',
  data () {
    return {
      isBtnDisabled: false,
      showProgress: true,
      notification: {
        type: "success",
        countdown: 2,
        message: "Loading Classes . . . ",
      },
      classes: [],
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
    async getClasses () {
      try {
        const config = {
          method: "get",
          url: "https://entreelab.com.ng/src/api/classes",
          data: null,
          headers: {"Authorization" : localStorage.getItem("token"),},
          withCredentials: false,
        };
        const response = await this.axios(config);
        this.showData(response.data);
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
    }, //end of getClasses
    showData(response) {
      this.classes = response;
      this.showProgress = !this.showProgress;
    }, //end of showData
    navigation(classProps) {
      this.$router.push({name: "Manage Students / ", params: {id: classProps.id, class: classProps.grade_name.toLowerCase()}});
    }, //end of navigation
  },
  created () {
    this.getClasses();
  },
}
</script>
