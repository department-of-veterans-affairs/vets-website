import GIBillApp from './containers/GIBillApp';

const routes = {
  path: '/gi-bill-comparison-tool',
  component: GIBillApp,
  childRoutes: [
    {
      indexRoute: { component: GIBillApp }
    },
    { path: 'institutions/:page', component: GIBillApp }
  ]
};

export default routes;
