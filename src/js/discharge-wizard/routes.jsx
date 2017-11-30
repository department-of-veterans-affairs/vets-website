import DischargeWizardApp from './DischargeWizardApp';
import GuidancePage from './containers/GuidancePage';
import FormPage from './containers/FormPage';
import InstructionsPage from './components/InstructionsPage';

const routes = {
  path: '/',
  component: DischargeWizardApp,
  indexRoute: { component: InstructionsPage },
  childRoutes: [
    { path: 'questions', component: FormPage },
    { path: 'guidance', component: GuidancePage },
  ],
};

export default routes;
