const SCHOOL = [
    {
      _name: "CSidebarNav",
      _children: [
        {
          _name: "CSidebarNavItem",
          name: "Dashboard",
          to: "/dashboard",
          icon: "cil-speedometer",
        },
        {
          _name: "CSidebarNavItem",
          name: "Manage Classes List",
          to: "/manage-classes",
          icon: "cil-layers",
        },
        {
          _name: "CSidebarNavItem",
          name: "Manage Teachers Lists",
          to: "/manage-teachers",
          icon: "cil-star",
        },
        {
          _name: "CSidebarNavItem",
          name: "Manage Subjects Lists",
          to: "/manage-subjects",
          icon: "cil-calculator",
        },
        {
          _name: "CSidebarNavItem",
          name: "Manage Students Lists",
          to: "/manage-students",
          icon: "cil-people",
        },

        {
          _name: "CSidebarNavItem",
          name: "Manage Parents Lists",
          to: "/manage-parents",
          icon: "cil-user",
        },

        {
          _name: "CSidebarNavItem",
          name: "Manage Bursars",
          to: "/manage-parents",
          icon: "cil-user",
        },
      ],
    },
  ],
  INSTRUCTOR = [
    {
      _name: "CSidebarNav",
      _children: [
        {
          _name: "CSidebarNavItem",
          name: "Dashboard",
          to: "/dashboard",
          icon: "cil-speedometer",
        },
        {
          _name: "CSidebarNavItem",
          name: "Manage Classes List",
          to: "/manage-classes",
          icon: "cil-layers",
        },
        {
          _name: "CSidebarNavItem",
          name: "Manage Subjects Lists",
          to: "/manage-subjects",
          icon: "cil-calculator",
        },
        {
          _name: "CSidebarNavItem",
          name: "Manage Students Lists",
          to: "/manage-students",
          icon: "cil-people",
        },
        // {
        //   _name: 'CSidebarNavItem',
        //   name: 'Manage Quizzes',
        //   to: '/manage-quizzes',
        //   icon: 'cil-calculator'
        // },
      ],
    },
  ],
  STUDENT = [
    {
      _name: "CSidebarNav",
      _children: [
        {
          _name: "CSidebarNavItem",
          name: "Dashboard",
          to: "/dashboard",
          icon: "cil-speedometer",
        },
        {
          _name: "CSidebarNavItem",
          name: "Manage Subjects Lists",
          to: "/manage-subjects/all/subject",
          icon: "cil-calculator",
        },
        {
          _name: "CSidebarNavItem",
          name: "Manage Quizzes",
          to: "/manage-quizzes/all/quizzes",
          icon: "cil-calculator",
        },
      ],
    },
  ],
  PARENT = [
    {
      _name: "CSidebarNav",
      _children: [
        {
          _name: "CSidebarNavItem",
          name: "Dashboard",
          to: "/dashboard",
          icon: "cil-speedometer",
        },

        {
          _name: "CSidebarNavItem",
          name: "Manage Wards",
          to: "/manage-students",
          icon: "cil-people",
        },

        {
          _name: "CSidebarNavItem",
          name: "Manage Payments",
          to: "/",
          icon: "cil-people",
        },
      ],
    },
  ],
  BURSAR = [
    {
      _name: "CSidebarNav",
      _children: [
        {
          _name: "CSidebarNavItem",
          name: "Dashboard",
          to: "/dashboard",
          icon: "cil-speedometer",
        },
        {
          _name: "CSidebarNavItem",
          name: "Manage Payment",
          to: "/",
          icon: "cil-people",
        },
      ],
    },
  ];

const getNav = () => {
  const user = parseInt(localStorage.getItem("user_type"));
  let returnComp;
  if (user === 2) {
    return SCHOOL;
  } else if (user === 3) {
    return INSTRUCTOR;
  } else if (user === 4) {
    return STUDENT;
  } else if (user === 5) {
    return PARENT;
  } else if (user === 6) {
    return BURSAR;
  }
  switch (user) {
    case 1:
      //admin
      break;
    case 2:
      returnComp = SCHOOL;
      break;

    case 3:
      returnComp = INSTRUCTOR;
      break;

    case 4:
      returnComp = STUDENT;
      break;

    case 5:
      returnComp = PARENT;
      break;

    case 6:
      returnComp = BURSAR;
      break;

    default:
      break;
  }
  return returnComp;
}

export default getNav
