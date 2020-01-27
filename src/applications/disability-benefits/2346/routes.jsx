import { ConfirmAddress } from './Components/ConfirmAddress.jsx';
import { MDTHomePage } from './Components/MDTHomepage.jsx';
import OrderPage from './Components/OrderPage.jsx';
import App from './containers/App.jsx';
import OrderTables from './containers/OrderTables';

const route = {
  path: '/',
  component: App,
  indexRoute: { component: MDTHomePage },
  childRoutes: [
    { path: '/confirmaddress', component: ConfirmAddress },
    { path: '/orderpage', component: OrderPage },
    { path: '/home', component: MDTHomePage },
    { path: '/orderTables', component: OrderTables },
  ],
};

export default route;
