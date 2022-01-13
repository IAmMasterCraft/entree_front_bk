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
                                <CCol lg="6">Reset Password</CCol>
                            </CRow>
                        </CCardHeader>
                        <CCardBody>
                            <CRow>
                                <CCol sm="12">
                                    <CInput
                                    label="New Password"
                                    placeholder="Set new password"
                                    v-model="password"
                                    />
                                </CCol>
                            </CRow>
                            <CRow>
                                <CCol lg="12">
                                    <CButton color="danger" @click="ResetPassword">RESET</CButton>
                                </CCol>
                            </CRow>
                        </CCardBody>
                    </CCard>
                </CCol>
            </CRow>
        </div>
    </div>
</template>

<script>
export default {
    name: "ResetPassword",
    data() {
        return {
            isBtnDisabled: false,
            showProgress: false,
            notification: {
                type: "success",
                countdown: 2,
                message: "Loading Password Reset . . . ",
            },
            password: "",
        }
    },
    methods: {
        async ResetPassword () {
            try {
                this.isBtnDisabled = true;
                this.showProgress = true;
                const config = {
                    method: "post",
                    url: `https://entreelab.com.ng/src/api/reset-user-password`,
                    data: {
                        password: this.password,
                    },
                    headers: { Authorization: localStorage.getItem("token") },
                    withCredentials: false,
                };
                const response = await this.axios(config);
                if (response.data.status == 1) {
                    alert(
                        "Password Reset Successful, new password is " + this.password + " Please login again."
                    );
                    localStorage.setItem("token", "");
                    localStorage.setItem("user_type", "");
                    localStorage.setItem("avatar", "");
                    this.$router.push({name: "Login"});
                } else {
                    this.notification.message = `<code>Something went wrong with password reset!</code>`;
                    this.notification.countdown = 20;
                    this.notification.type = "danger";
                    this.isBtnDisabled = false;
                    this.showProgress = false;
                }
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
        }, //end of getParentInfo
        showResponse () {
            this.showProgress = !this.showProgress;
        }, //end of showResponse
        toggleModal(){
            this.showModal = !this.showModal;
        }, //end of toggleModal
    },
    created() {
    },
}
</script>