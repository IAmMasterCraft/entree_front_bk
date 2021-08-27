import Vue from 'vue'
import Router from 'vue-router'

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
const ManageClasses = () => import('@/views/pages/ManageClasses')
const ManageTeachers = () => import('@/views/pages/ManageTeachers')
const ManageSubjects = () => import('@/views/pages/ManageSubjects')
const SubjectList = () => import('@/views/pages/SubjectList')
const ManageStudents = () => import('@/views/pages/ManageStudents')
const StudentList = () => import('@/views/pages/StudentList')
const ManageQuizzes = () => import('@/views/pages/ManageQuizzes')
const ManageParents = () => import('@/views/pages/ManageParents')
const ManageBursars = () => import("@/views/pages/ManageBursars");
const ViewParent = () => import("@/views/pages/ViewParent");

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
      ],
    },
    {
      path: "/login",
      name: "Login",
      component: Login,
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
