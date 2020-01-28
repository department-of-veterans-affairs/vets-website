import { ConfirmAddress } from './Components/ConfirmAddress.jsx';
import { MDTHomePage } from './Components/MDTHomepage.jsx';
import OrderPage from './Components/OrderPage.jsx';
import OrderCommentPage from './Components/OrderCommentPage.jsx';
import App from './containers/App.jsx';
import OrderTables from './containers/OrderTables';

const route = {
  path: '/',
  component: App,
  indexRoute: { component: MDTHomePage },
  childRoutes: [
    { path: '/confirmaddress', component: ConfirmAddress },
    { path: '/orderpage', component: OrderPage },
    { path: '/comments', component: OrderCommentPage },
    { path: '/home', component: MDTHomePage },
    { path: '/orderTables', component: OrderTables },
  ],
};

export default route;
