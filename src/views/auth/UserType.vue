<template>
  <div class="d-flex align-items-center min-vh-100">
    <CContainer fluid>
      <CRow class="justify-content-center">
        <CCol md="10">
          <CProgress
            :value="100"
            v-show="showProgress"
            color="success"
            striped
            :animated="true"
            class="mb-2"
          />
          <CCard class="mx-4 mb-0">
            <CCardBody class="p-4">
              <CForm @submit="proceed">
                <h1>Register</h1>
                <p class="text-muted">Select account type</p>
                <CRow>
                  <template v-for="userType in userTypes">
                    <CCol v-if="userType.isModuleReady" sm="6" md="4" :key="userType.id">
                      <CCard :accent-color="userType.color">
                        <CCardBody class="text-center">
                          <span :class="`fa-stack fa-4x text-${userType.color} mb-2`">
                            <i class="fa fa-circle-thin fa-stack-2x"></i>
                            <i :class="`fa fa-${userType.icon} fa-stack-1x`"></i>
                          </span>
                          <br />
                          <span :id="`type-${userType.id}`">{{ userType.type }}</span> <br />
                          {{ userType.content }} <br />
                          <CButton type="submit" :disabled="isBtnDisabled" :value="userType.id" @click="testRun" class="mt-4 text-white" :color="userType.color" size="lg" shape="pill">GET STARTED</CButton>
                        </CCardBody>
                      </CCard>
                    </CCol>
                  </template>
                </CRow>
              </CForm>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </CContainer>
  </div>
</template>

<script>
export default {
  name: 'UserType',
  data () {
    return {
      showProgress: false,
      isBtnDisabled: false,
      userTypes: [
        {
          id: 4,
          type: "Student",
          content: "Access to over 1,000 high quality courses. For Students.",
          icon: "book",
          color: "danger",
          isModuleReady: false,
        },
        {
          id: 5,
          type: "Parent",
          content: "Sign Up As A Parent And Monitor Your Wards Performance.",
          icon: "user",
          color: "warning",
          isModuleReady: false,
        },
        {
          id: 3,
          type: "Instructor",
          content: "Instructor.",
          icon: "comment",
          color: "dark",
          isModuleReady: false,
        },
        {
          id: 2,
          type: "School",
          content: "Register As An Educational Institution On EntreeLab",
          icon: "building",
          color: "success",
          isModuleReady: true,
        },
      ]
    }
  },
  methods: {
    testRun(event){
      this.showProgress = !this.showProgress;
      this.userTypes.forEach((userType) => {
        if (userType.id === parseInt(event.target.value)) {
          this.isBtnDisabled = true;
          localStorage.setItem("user_type", userType.id);
          location.href += `/${userType.type.toLowerCase()}`;
        }
      });
    },
    proceed: (event) => {
      event.preventDefault();
    },
  }
}
</script>
