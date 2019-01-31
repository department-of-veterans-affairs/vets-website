import DisabilityWizard from './components/DisabilityWizard';
import ApplicationStatus from '../../../platform/forms/save-in-progress/ApplicationStatus';
import './sass/disability-benefits.scss';

// helper module so that we can code split with both of these components
// in the same bundle
export default {
  DisabilityWizard,
  ApplicationStatus,
};
