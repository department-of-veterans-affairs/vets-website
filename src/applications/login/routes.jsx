import SignInApp from './containers/SignInApp';
import SignInWrapper from './components/SignInWrapper';
import VerifyPage from './components/VerifyPage';
import TransitionAccountPage from './components/TransitionAccountPage';

const routes = {
  path: '/',
  component: SignInWrapper,
  indexRoute: { component: SignInApp },
  childRoutes: [
    { path: 'verify', component: VerifyPage },
    // TODO: Move TransitionAccountPage to separate app
    { path: 'transition', component: TransitionAccountPage },
  ],
};

export default routes;
