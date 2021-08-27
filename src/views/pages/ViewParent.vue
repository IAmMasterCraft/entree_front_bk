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
                                <CCol lg="6">Parent Info</CCol>
                                <CCol lg="6">
                                    <AddWard :showModal="showModal" @show-modal="toggleModal" />
                                    <CButton
                                        color="success"
                                        variant="outline"
                                        square
                                        class="text-right float-right"
                                        size="sm"
                                        :disabled="isBtnDisabled"
                                        @click="toggleModal"
                                        >
                                        Link Ward
                                    </CButton>
                                </CCol>
                            </CRow>
                        </CCardHeader>
                        <CCardBody>
                            <!--full_name<br />
                            email -->
                        </CCardBody>
                    </CCard>
                </CCol>
            </CRow>
        </div>
    </div>
</template>

<script>
import AddWard from '../modals/AddWard';
export default {
    name: "ViewParent",
    components: {
        AddWard,
    },
    data() {
        return {
            isBtnDisabled: false,
            showProgress: true,
            notification: {
                type: "success",
                countdown: 2,
                message: "Loading Parent . . . ",
            },
            showModal: false,
        }
    },
    methods: {
        async getParentInfo () {
            try {
                const config = {
                    method: "get",
                    url: `https://entreelab.com.ng/src/api/parents/${this.$route.params.id}`,
                    data: null,
                    headers: { Authorization: localStorage.getItem("token") },
                    withCredentials: false,
                };
                const response = await this.axios(config);
                this.showResponse(response.data);
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
        showResponse (response) {
            const classes = response.map(parentObject => {
                return {
                    id: parentObject.id,
                    user_id: parentObject.user_id,
                    full_name: `${parentObject.first_name} ${parentObject.last_name}`,
                    email: parentObject.email,
                    registered: parentObject.createddate,
                    ward_count: parentObject.ward_count ?? 0,
                    login_count: parentObject.login_count ?? 0,
                };
            });
            this.showProgress = !this.showProgress;
        }, //end of showResponse
        toggleModal(){
            this.showModal = !this.showModal;
        }, //end of toggleModal
    },
    created() {
        this.getParentInfo();
    },
}
</script>