import SignInApp from './containers/SignInApp';
import SignInWrapper from './components/SignInWrapper';

const routes = {
  path: '/',
  component: SignInWrapper,
  indexRoute: { component: SignInApp },
};

export default routes;
