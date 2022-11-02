import { Navigate, useRoutes } from 'react-router-dom';
// layouts
import DashboardLayout from './layouts/dashboard';
import LogoOnlyLayout from './layouts/LogoOnlyLayout';
//
import Profile from './pages/Profile';
import ProfileUpdate from './pages/ProfileUpdate';
import Agent from './pages/Agent';
import Login from './pages/Login';
import NotFound from './pages/Page404';
import Register from './pages/Register';
import CardPurchases from './pages/CardPurchases';
import Payments from './pages/Payments';
import {
  AddAgent,
  UpdateAgent,
  SavePayment,
  ManagePackage,
  ManagePromoCode,
  Packages,
  PromoCodes,
  Currency,
  PublishNews,
  SendNotification,
} from './pages/ManageModels';
import DashboardApp from './pages/DashboardApp';

// ----------------------------------------------------------------------

export default function Router() {
  return useRoutes([
    {
      path: '/dashboard/',
      element: <DashboardLayout />,
      children: [
        { path: '', element: <DashboardApp /> },
        { path: 'agents', element: <Agent /> },
        { path: 'card-purchases', element: <CardPurchases /> },
        { path: 'payment-made', element: <Payments /> },
        { path: 'payment-made/save/:cardTnxNumber', element: <SavePayment /> },
        { path: 'agent-profile', element: <Profile /> },
        { path: 'agent-update/:agentName/', element: <UpdateAgent /> },
        { path: 'agent-add', element: <AddAgent /> },
        {
          path: 'manage-models/',
          children: [
            { path: 'currency', element: <Currency /> },
            { path: 'packages/add', element: <ManagePackage /> },
            { path: 'packages', element: <Packages /> },
            { path: 'packages/update/:packageId/', element: <ManagePackage /> },
            { path: 'promo-codes/add', element: <ManagePromoCode /> },
            { path: 'promo-codes', element: <PromoCodes /> },
            { path: 'promo-codes/update/:promoCode/', element: <ManagePromoCode /> },
            { path: 'publish-news', element: <PublishNews /> },
            { path: 'send-notification', element: <SendNotification /> },
          ],
        },
      ],
    },
    {
      path: 'login',
      element: <Login />,
    },
    {
      path: 'register',
      element: <Register />,
    },
    {
      path: 'agent-profile-update',
      element: <ProfileUpdate />,
    },
    {
      path: '/',
      element: <LogoOnlyLayout />,
      children: [
        { path: '/', element: <Navigate to="/login" /> },
        { path: '404', element: <NotFound /> },
        { path: '*', element: <Navigate to="/404" /> },
      ],
    },
    {
      path: '*',
      element: <Navigate to="/404" replace />,
    },
  ]);
}
