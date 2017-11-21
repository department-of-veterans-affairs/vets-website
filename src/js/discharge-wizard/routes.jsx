import DischargeWizardApp from './DischargeWizardApp';
import GuidancePage from './containers/GuidancePage';
import FormPage from './containers/FormPage';

const routes = {
  path: '/',
  component: DischargeWizardApp,
  indexRoute: { component: FormPage },
  childRoutes: [
    { path: 'guidance', component: GuidancePage },
  ],
};

export default routes;
