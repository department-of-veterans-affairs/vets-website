import Form1995App from './1995/Form1995App';
import routes from './1995/routes';

export default function createRoutes() {
  const childRoutes = routes;

  childRoutes.push({
    path: '*',
    onEnter: (nextState, replace) => replace('/')
  });

  return {
    path: '/',
    indexRoute: { onEnter: (nextState, replace) => replace('/introduction') },
    component: Form1995App,
    childRoutes
  };
}
