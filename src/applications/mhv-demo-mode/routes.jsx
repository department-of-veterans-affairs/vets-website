import App from './containers/App';
import IntroPage from './components/IntroPage';
import LandingPageContainer from './demo-apps/mhv-landing-page/containers/LandingPageContainer';

const routes = {
  path: '/',
  component: App,
  indexRoute: { component: IntroPage },
  childRoutes: [
    { path: 'my-health', component: LandingPageContainer },
    { path: '*', component: IntroPage },
  ],
};

export default routes;
