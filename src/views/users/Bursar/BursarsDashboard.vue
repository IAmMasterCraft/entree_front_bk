<template>
  <div>
    <CRow>
      <CCol sm="6" lg="3">
        <CWidgetDropdown
          :header="dashBoardData.total_students"
          text="Fee Structure"
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
              View Fee Structure
            </CDropdownItem>
          </CDropdown>
        </CWidgetDropdown>
      </CCol>

      <CCol sm="6" lg="3">
        <CWidgetDropdown
          :header="dashBoardData.total_quiz"
          text="Payment Records"
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
            <CDropdownItem to="">
              View Payment Records
            </CDropdownItem>
          </CDropdown>
        </CWidgetDropdown>
      </CCol>
    </CRow>

    <CRow>
      <CCol sm="12" lg="6">
        <CCard>
          <CCardHeader><h1 color="info">Students Growth</h1></CCardHeader>
          <CCardBody>
            <CChartBar
              style="height:300px"
              :datasets="[
                {
                  data: [0, 0, 0, 0, 0,0 ,0 ,0, 0, 0, 0, 0 ],
                  backgroundColor: '#E55353',
                  label: 'Student Growth',
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
          <CCardHeader><h1 color="info">Students Per Grade</h1></CCardHeader>
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
              :labels="['Grade A', 'Grade B', 'Grade C', 'Grade D']"
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
  name: 'TeachersDashboard',
  components: {
    CChartBar,
    CChartPie,
  },
  props: {
    dashBoardData: Object,
  },
  mounted() {
    console.log(this.dashBoardData.total_students);
  },
};
</script>
