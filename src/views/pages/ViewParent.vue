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
                                    <AddWard :showModal="showModal" @show-modal="toggleModal" @submitted="getParentInfo" />
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
                            <CRow>
                                <CCol md="4">
                                    <img rounded thumbnail :src="parent.avatar" width="200" height="200"/>
                                </CCol>
                                <CCol md="8">
                                    <CCardTitle>{{ parent.full_name }}</CCardTitle>
                                    <CCardText>{{ parent.email }}</CCardText>
                                    <CCardText>Total Wards: {{ parent.ward_count }}</CCardText>
                                </CCol>
                            </CRow>
                            <CRow class="my-4">
                                <CCol sm="12">
                                    <CDataTable
                                        :items="wards"
                                        :fields="fields"
                                        column-filter
                                        table-filter
                                        items-per-page-select
                                        :items-per-page="5"
                                        hover
                                        sorter
                                        pagination
                                    >
                                        <template #show_details="{ }">
                                            <td class="py-2">
                                                <CButton
                                                color="info"
                                                variant="outline"
                                                square
                                                :disabled="isBtnDisabled"
                                                size="sm"
                                                style="cursor: pointer;"
                                                class="fa fa-eye"
                                                />
                                            </td>
                                        </template>
                                    </CDataTable>
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
import AddWard from '../modals/AddWard';

const fields = [
    { key: "first_name", _style: "min-width:100px" },
    { key: "last_name", _style: "min-width:100px;" },
    { key: "grade_name", _style: "min-width:100px;" },
    {
        key: "show_details",
        label: "",
        _style: "width:1%",
        sorter: false,
        filter: false,
    },
];

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
            parent: {},
            wards: [],
            fields,
        }
    },
    methods: {
        async getParentInfo () {
            try {
                const config = {
                    method: "get",
                    url: `${/*window.location.origin*/'https://entreelab.org'}/src/api/parents/${this.$route.params.id}`,
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
            const classes = response.parent.map(parentObject => {
                return {
                    id: parentObject.id,
                    user_id: parentObject.user_id,
                    full_name: `${parentObject.first_name} ${parentObject.last_name}`,
                    email: parentObject.email,
                    registered: parentObject.createddate,
                    ward_count: parentObject.ward_count ?? 0,
                    login_count: parentObject.login_count ?? 0,
                    avatar: (parentObject.avatar) ? `${window.location.origin}/src/storage/app/${parentObject.avatar}` : "img/logo_a.png",
                };
            });
            this.parent = classes[0];
            this.wards = response.wards
            this.showProgress = false;
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