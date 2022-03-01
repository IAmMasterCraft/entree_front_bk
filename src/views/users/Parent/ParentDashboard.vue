<template>
  <div>
    <CRow>
      <CCol sm="6" lg="3">
        <CWidgetDropdown
          :header="dashBoardData.total_students"
          text="Wards"
          color="primary"
          class="pb-4"
        >
          <CDropdown
            class="float-right"
            color="transparent p-0"
            placement="bottom-end"
          >
            <template #toggler-content>
              <CIcon name="cil-settings" />
            </template>
            <!-- <CDropdownItem>
                <a href="">
                  Add Student
                </a>
              </CDropdownItem> -->
            <CDropdownItem to="/manage-students">
              View Students
            </CDropdownItem>
          </CDropdown>
        </CWidgetDropdown>
      </CCol>

      <CCol sm="6" lg="3">
        <CWidgetDropdown
          :header="dashBoardData.total_instructors"
          text="Payment"
          color="success"
          class="pb-4"
        >
          <CDropdown
            class="float-right"
            color="transparent p-0"
            placement="bottom-end"
          >
            <template #toggler-content>
              <CIcon name="cil-settings" />
            </template>
            <!-- <CDropdownItem>Add Teacher</CDropdownItem> -->
            <CDropdownItem to="/manage-teachers">
              View Teachers
            </CDropdownItem>
          </CDropdown>
        </CWidgetDropdown>
      </CCol>

      <CCol sm="6" lg="3">
        <CWidgetDropdown
          :header="dashBoardData.total_grades"
          text="Attendance"
          color="warning"
          class="pb-4"
        >
          <CDropdown
            class="float-right"
            color="transparent p-0"
            placement="bottom-end"
          >
            <template #toggler-content>
              <CIcon name="cil-settings" />
            </template>
            <!-- <CDropdownItem>Add Subject</CDropdownItem> -->
            <CDropdownItem to="/manage-classes">
              View Classes
            </CDropdownItem>
          </CDropdown>
        </CWidgetDropdown>
      </CCol>

      <CCol sm="6" lg="3">
        <CWidgetDropdown
          :header="dashBoardData.total_parents"
          text="Booklets"
          color="info"
          class="pb-4"
        >
          <CDropdown
            class="float-right"
            color="transparent p-0"
            placement="bottom-end"
          >
            <template #toggler-content>
              <CIcon name="cil-settings" />
            </template>
            <!-- <CDropdownItem>Add Parent</CDropdownItem> -->
            <!-- <CDropdownItem>View Parents</CDropdownItem> -->
            <CDropdownItem>WIP</CDropdownItem>
          </CDropdown>
        </CWidgetDropdown>
      </CCol>
    </CRow>

    <CRow>
      <CCol sm="12" lg="6">
        <CCard>
          <CCardHeader><h1 color="info">Wards Academic Performance</h1></CCardHeader>
          <CCardBody>
            <CChartBar
              style="height:300px"
              :datasets="[
                {
                  data: [0, 0, 0, 0, 0,0 ,0 ,0, 0, 0, 0, 0 ],
                  backgroundColor: '#E55353',
                  label: 'Wards Academic Performance',
                },
              ]"
              labels="months"
              :options="{ maintainAspectRatio: false }"
            />
          </CCardBody>
        </CCard>
      </CCol>

      <CCol sm="12" lg="6">
        <CCard>
          <CCardHeader><h1 color="info">Attendance</h1></CCardHeader>
          <CCardBody>
            <CChartPie
              style="height:300px"
              :datasets="[
                {
                  data: [0, 0, 0, 0],
                  backgroundColor: ['#41B883', '#E46651', '#00D8FF', '#DD1B16'],
                  label: 'Sales',
                },
              ]"
              :labels="['Excellent', 'Good', 'Average', 'Poor']"
              :options="{ maintainAspectRatio: false }"
            />
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  </div>
</template>

<script>
import { CChartBar, CChartPie } from "@coreui/vue-chartjs";

export default {
  name: "ParentDashboard",
  components: {
    CChartBar,
    CChartPie,
  },
  props: {
    dashBoardData: Object,
  },
};
</script>
