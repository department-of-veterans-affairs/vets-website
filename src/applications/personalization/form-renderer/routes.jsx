import App from './containers/App';

const routes = [
  {
    path: '/',
    indexRoute: {
      onEnter: () => {
        window.location.href = '/my-va';
      },
    },
  },
  {
    path: ':id',
    component: App,
  },
];
export default routes;
