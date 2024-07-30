import environment from '@department-of-veterans-affairs/platform-utilities/environment';
import formConfig from 'applications/mock-sip-form/config/form';
import manifest from '../manifest.json';

formConfig.submitUrl = `${
  environment.API_URL
}/accredited_representative_portal/v0/mock_sip_form`;
formConfig.rootUrl = manifest.rootUrl;

export default formConfig;
