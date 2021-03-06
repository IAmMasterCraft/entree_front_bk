import Vue from 'vue'
import Router from 'vue-router'

const Mail = () => import('@/views/general/Mail')

//Auth
const Login = () => import('@/views/auth/Login')
const UserType = () => import('@/views/auth/UserType')
const Register = () => import('@/views/auth/Register')
const VerifyOtp = () => import('@/views/auth/VerifyOtp')
const ProfileSetup = () => import('@/views/auth/ProfileSetup')

// Containers
const TheContainer = () => import('@/containers/TheContainer')

// Views
const Dashboard = () => import('@/views/Dashboard')

// View - Pages
const Profile = () => import('@/views/pages/Profile')
const ManageAttendance = () => import("@/views/pages/ManageAttendance");
const ManageWardAttendance = () => import("@/views/parents_pages/StudentAttendance");
const SingleWardAttendance = () => import("@/views/parents_pages/SingleAttendance");
const AttendanceList = () => import('@/views/pages/AttendanceList')
const ManageLessonPlan = () => import("@/views/pages/ManageLessonPlan");
const LessonPlanList = () => import('@/views/pages/LessonPlanList')
const ManageBooklet = () => import("@/views/pages/ManageBooklet");
const StudentBooklet = () => import("@/views/pages/StudentBooklet");
const AddStudentBooklet = () => import("@/views/pages/AddStudentBooklet");

const ViewStudentBooklet = () => import("@/views/preview/SingleBooklet");
const ViewLessonPlan = () => import("@/views/preview/SingleLessonPlan");


const ManageClasses = () => import('@/views/pages/ManageClasses')
const ManageFeeStructures = () => import('@/views/pages/ManageFeeStructures')
const ManagePaymentRecords = () => import('@/views/pages/ManagePaymentRecords')
const ManageTeachers = () => import('@/views/pages/ManageTeachers')
const ManageSubjects = () => import('@/views/pages/ManageSubjects')
const SubjectList = () => import('@/views/pages/SubjectList')
const QuizList = () => import('@/views/pages/QuizList')
const ManageStudents = () => import('@/views/pages/ManageStudents')
const StudentList = () => import('@/views/pages/StudentList')
const ManageQuizzes = () => import('@/views/pages/ManageQuizzes')
const ManageParents = () => import('@/views/pages/ManageParents')
const ManageBursars = () => import("@/views/pages/ManageBursars");
const ViewParent = () => import("@/views/pages/ViewParent");
const ViewLessons = () => import("@/views/pages/ViewLessons");
const ResetPassword = () => import("@/views/pages/ResetPassword");

const WardList = () => import("@/views/parents_pages/WardList");

// Views - Pages
const Page404 = () => import('@/views/pages/Page404')
const Page500 = () => import('@/views/pages/Page500')


Vue.use(Router)

export default new Router({
  mode: 'hash', // https://router.vuejs.org/api/#mode
  linkActiveClass: 'active',
  scrollBehavior: () => ({ y: 0 }),
  routes: configRoutes()
})

function configRoutes () {
  return [
    {
      path: "/",
      redirect: "/dashboard",
      name: "Home",
      component: TheContainer,
      children: [
        {
          path: "dashboard",
          name: "Dashboard",
          component: Dashboard,
        },
        {
          path: "parents/manage-attendance",
          name: "Manage Wards Attendance",
          component: ManageWardAttendance,
        },
        {
          path: "parents/manage-attendance/:id/:name",
          name: "Manage Wards Attendance / ",
          component: SingleWardAttendance,
        },
        {
          path: "manage-attendance",
          name: "Manage Attendance",
          component: ManageAttendance,
        },
        {
          path: "manage-attendance/:id/:class",
          name: "Manage Attendance / ",
          component: AttendanceList,
        },
        {
          path: "communication-booklet",
          name: "Communication Booklet",
          component: ManageBooklet,
        },
        {
          path: "communication-booklet/:id/:class",
          name: "Communication Booklet / ",
          component: StudentBooklet,
        },
        {
          path: "view-communication-booklet",
          name: "View Communication Booklet / ",
          component: StudentBooklet,
        },
        {
          path: "view-communication-booklet/:booklet",
          name: "View Communication Booklet / Student",
          component: ViewStudentBooklet,
        },
        {
          path: "communication-booklet/:id/:class/add",
          name: "Communication Booklet / Add",
          component: AddStudentBooklet,
        },
        {
          path: "communication-booklet/:id/:class/:booklet",
          name: "Preview Communication Booklet / ",
          component: ViewStudentBooklet,
        },
        {
          path: "manage-lesson-plan",
          name: "Manage Lesson Plan",
          component: ManageLessonPlan,
        },
        
        {
          path: "manage-lesson-plan/:id/:class",
          name: "Manage Lesson Plan / ",
          component: LessonPlanList,
        },
        {
          path: "manage-lesson-plan/:id/:class/:plan",
          name: "Preview Lesson Plan / ",
          component: ViewLessonPlan,
        },
        {
          path: "manage-classes",
          name: "Manage Classes",
          component: ManageClasses,
        },
        {
          path: "manage-teachers",
          name: "Manage Teachers",
          component: ManageTeachers,
        },
        {
          path: "manage-subjects",
          name: "Manage Subjects",
          component: ManageSubjects,
        },
        {
          path: "manage-subjects/:id/:class",
          name: "Manage Subjects / ",
          component: SubjectList,
        },
        {
          path: "manage-students",
          name: "Manage Students",
          component: ManageStudents,
        },
        {
          path: "manage-students/:id/:class",
          name: "Manage Students / ",
          component: StudentList,
        },
        {
          path: "manage-quizzes",
          name: "Manage Quizzes",
          component: ManageQuizzes,
        },
        {
          path: "manage-quizzes/:id/:class",
          name: "Manage Quizzes / ",
          component: SubjectList,
        },
        {
          path: "quizzes/:subject_id",
          name: "Quizzes / ",
          component: QuizList,
        },
        {
          path: "manage-parents",
          name: "Manage Parents",
          component: ManageParents,
        },
        {
          path: "view-parents/:id/:name",
          name: "View Parent",
          component: ViewParent,
        },
        {
          path: "manage-bursars",
          name: "Manage Bursars",
          component: ManageBursars,
        },
        {
          path: "manage-fee-structure",
          name: "Manage Fee Structure",
          component: ManageFeeStructures,
        },
        {
          path: "manage-payment-record",
          name: "Manage Payment Records",
          component: ManagePaymentRecords,
        },
        {
          path: "profile",
          name: "Profile",
          component: Profile,
        },
        {
          path: "view-lessons/:subject_id",
          name: "View Lessons",
          component: ViewLessons,
        },
        {
          path: "reset-password",
          name: "Reset Password",
          component: ResetPassword,
        },

        //parenting stuff
        {
          path: "manage-wards",
          name: "Manage Wards",
          component: WardList,
        },

        {
          path: "parents/communication-booklet",
          name: "Parents / Communication Booklet",
          component: WardList,
        },
      ],
    },
    {
      path: "/login",
      name: "Login",
      component: Login,
    },
    {
      path: "/broadcast",
      name: "Mail",
      component: Mail,
    },
    {
      path: "/register",
      name: "UserType",
      component: UserType,
    },
    {
      path: "/register/:user_type",
      name: "Register",
      component: Register,
    },
    {
      path: "/verify-otp",
      name: "VerifyOtp",
      component: VerifyOtp,
    },
    {
      path: "/profile-setup",
      name: "ProfileSetup",
      component: ProfileSetup,
    },
    {
      path: "/404",
      name: "Page404",
      component: Page404,
    },
    {
      path: "/500",
      name: "Page500",
      component: Page500,
    },
  ];
}
