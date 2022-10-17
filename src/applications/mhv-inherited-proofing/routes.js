import TransitionContainer from './container/TransitionContainer';
import TransitionAccountPage from './components/TransitionAccountPage';
import TransitionAccountSuccess from './components/TransitionAccountSuccess';

export default {
  path: '/',
  component: TransitionContainer,
  indexRoute: { component: TransitionAccountPage },
  childRoutes: [{ path: 'success', component: TransitionAccountSuccess }],
};
