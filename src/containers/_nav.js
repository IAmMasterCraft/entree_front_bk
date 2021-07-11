const SCHOOL = [
  {
    _name: 'CSidebarNav',
    _children: [
      {
        _name: 'CSidebarNavItem',
        name: 'Dashboard',
        to: '/dashboard',
        icon: 'cil-speedometer',
      },
      {
        _name: 'CSidebarNavItem',
        name: 'Manage Classes List',
        to: '/manage-classes',
        icon: 'cil-layers'
      },
      {
        _name: 'CSidebarNavItem',
        name: 'Manage Teachers Lists',
        to: '/manage-teachers',
        icon: 'cil-star'
      },
      {
        _name: 'CSidebarNavItem',
        name: 'Manage Subjects Lists',
        to: '/manage-subjects',
        icon: 'cil-calculator'
      },
      {
        _name: 'CSidebarNavItem',
        name: 'Manage Students Lists',
        to: '/manage-students',
        icon: 'cil-people'
      },
      
      {
        _name: 'CSidebarNavItem',
        name: 'Manage Parents Lists',
        to: '/manage-parents',
        icon: 'cil-user'
      },
    ]
  }
],

  INSTRUCTOR = [
    {
      _name: 'CSidebarNav',
      _children: [
        {
          _name: 'CSidebarNavItem',
          name: 'Dashboard',
          to: '/dashboard',
          icon: 'cil-speedometer',
        },
        {
          _name: 'CSidebarNavItem',
          name: 'Manage Classes List',
          to: '/manage-classes',
          icon: 'cil-layers'
        },
        {
          _name: 'CSidebarNavItem',
          name: 'Manage Subjects Lists',
          to: '/manage-subjects',
          icon: 'cil-calculator'
        },
        {
          _name: 'CSidebarNavItem',
          name: 'Manage Students Lists',
          to: '/manage-students',
          icon: 'cil-people'
        },
        // {
        //   _name: 'CSidebarNavItem',
        //   name: 'Manage Quizzes',
        //   to: '/manage-quizzes',
        //   icon: 'cil-calculator'
        // },
      ]
    }
  ],

  STUDENT = [
    {
      _name: 'CSidebarNav',
      _children: [
        {
          _name: 'CSidebarNavItem',
          name: 'Dashboard',
          to: '/dashboard',
          icon: 'cil-speedometer',
        },
        {
          _name: 'CSidebarNavItem',
          name: 'Manage Subjects Lists',
          to: '/manage-subjects',
          icon: 'cil-calculator'
        },
        {
          _name: 'CSidebarNavItem',
          name: 'Manage Quizzes',
          to: '/',
          icon: 'cil-calculator'
        },
      ]
    }
  ],

  PARENT = [
    {
      _name: 'CSidebarNav',
      _children: [
        {
          _name: 'CSidebarNavItem',
          name: 'Dashboard',
          to: '/dashboard',
          icon: 'cil-speedometer',
        },
        {
          _name: 'CSidebarNavItem',
          name: 'Manage Students Lists',
          to: '/manage-students',
          icon: 'cil-people'
        },
        {
          _name: 'CSidebarNavItem',
          name: 'Manage Subjects Lists',
          to: '/manage-subjects',
          icon: 'cil-calculator'
        },
      ]
    }
  ];

const getNav = () => {
  const user = parseInt(localStorage.getItem("user_type"));
  let returnComp;
  if (user === 2) {
    return SCHOOL;}
  else if (user === 3) {return INSTRUCTOR;}
  else if (user === 4) {return STUDENT;}
  else if (user === 5) {return PARENT;}
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
  
    default:
      break;
  }
  return returnComp;
}

export default getNav
