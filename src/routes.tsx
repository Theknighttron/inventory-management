import React from 'react';

// Admin Imports

// Icon Imports
import {
  MdHome,
  MdOutlineShoppingCart,
  MdBarChart,
  MdPerson,
  MdLock,
} from 'react-icons/md';

const routes = [
  {
    name: 'Overview',
    layout: '/admin',
    path: 'default',
    icon: <MdHome className="h-6 w-6" />,
  },
  {
    name: 'Tracker',
    layout: '/admin',
    icon: <MdBarChart className="h-6 w-6" />,
    path: 'tracker',
  },
  // {
  //   name: 'Profile',
  //   layout: '/admin',
  //   path: 'profile',
  //   icon: <MdPerson className="h-6 w-6" />,
  // },
];
export default routes;
