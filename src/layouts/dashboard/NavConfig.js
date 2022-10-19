// component
import Iconify from '../../components/Iconify';

// ----------------------------------------------------------------------

const getIcon = (name) => <Iconify icon={name} width={22} height={22} />;

const navConfig = [
  {
    title: 'dashboard',
    path: '/dashboard',
    icon: getIcon('eva:pie-chart-2-fill'),
  },
  {
    title: 'agents',
    path: '/dashboard/agents',
    icon: getIcon('eva:people-fill'),
  },
  {
    title: 'Card Purchases',
    path: '/dashboard/card-purchases',
    icon: getIcon('eva:shopping-bag-fill'),
  },
  {
    title: 'Payment',
    path: '/dashboard/payment-made',
    icon: getIcon('ic:baseline-paid'),
  },
  {
    title: 'Manage Models',
    path: '/dashboard/manage-models',
    icon: getIcon('eva:settings-fill'),
    children: [
      {
        title: 'Currency',
        path: '/dashboard/manage-models/currency',
      },
      {
        title: 'Packages',
        path: '/dashboard/manage-models/Packages',
      },
      {
        title: 'Promotion Codes',
        path: '/dashboard/manage-models/Promo-codes',
      },
      {
        title: 'Publish News',
        path: '/dashboard/manage-models/publish-news',
      },
      {
        title: 'Send Notification',
        path: '/dashboard/manage-models/send-notification',
      },
    ],
  },
];

export default navConfig;
