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
    <div>
      <SchoolDashboard v-if="user === 2" :dashBoardData="dashBoardData" />
      <TeacherDashboard v-if="user === 3" :dashBoardData="dashBoardData" />
    </div>

  </div>
</template>

<script>
import getDashboardData from './dash_data'
import SchoolDashboard from './users/School/SchoolDashboard'
import TeacherDashboard from './users/Teacher/TeachersDashboard'

export default {
  name: 'Dashboard',
  components: {
    SchoolDashboard,
    TeacherDashboard,
  },
  data () {
    return {
      isBtnDisabled: false,
      showProgress: true,
      user: parseInt(localStorage.getItem("user_type")),
      dashBoardData: {},
      notification: {
        type: "success",
        countdown: 2,
        message: "Loading Dashboard . . . ",
      },
    }
  },
  methods: {
    showData(response){
      if (this.user === 2) {
        this.dashBoardData.grade_records = response.grade_records;
        this.dashBoardData.total_grades = response.total_grades[0]['count(id)'].toString();
        this.dashBoardData.total_parents = response.total_parents[0]['count(id)'].toString();
        this.dashBoardData.total_instructors = response.total_instructors[0]['count(id)'].toString();
        this.dashBoardData.total_students = (response.total_students.length > 0) ? response.total_students.length.toString() : "0";
      } else if (this.user === 3) {
        this.dashBoardData.student_records = response.student_records.length;
        this.dashBoardData.total_lessons = response.total_lessons[0]['count(videos.id)'];
        this.dashBoardData.total_lessons_per_subject = response.total_lessons_per_subject.length;
        this.dashBoardData.total_quiz = response.total_quiz[0]['count(quiz.id)'];
        this.dashBoardData.total_students = response.total_students[0]['count(distinct(student_subjects.student_id))'];
        this.dashBoardData.total_subjects = response.total_subjects[0]['count(id)'];
      }
      
      this.showProgress = !this.showProgress;
    },
    async dashData () {
      try {
        const response = await getDashboardData();
        // console.log(response.data)
        if (response.main) this.showData(response.main);
        if (response.error) this.errorManagement(response.error);
        // console.log(response);
        // localStorage.setItem("token", `${response.data.token_type} ${response.data.access_token}`);
        // this.$router.push({name: "Home", data: response.data});
      } catch(error) {
        this.errorManagement(error);
      }
    }, //end of dashData
    errorManagement(error) {
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
    }, //end of errorManagement
  },
  created(){
    this.dashData();
  }
}
</script>
