import Wizard from '../../static-pages/wizard';
import ApplicationStatus from '../../../platform/forms/save-in-progress/ApplicationStatus';
import pages from './pages';
// import '../all-claims/sass/disability-benefits.scss';

// helper module so that we can code split with both of these components
// in the same bundle
export default {
  Wizard,
  ApplicationStatus,
  pages,
};
