import { transformForSubmit } from 'platform/forms-system/src/js/helpers';
import environment from '@department-of-veterans-affairs/platform-utilities/environment';
import IntroductionPageUpdate from './containers/IntroductionPageUpdate';
import IntroductionPage from './containers/IntroductionPage';

export function transform(formConfig, form) {
  const formData = transformForSubmit(formConfig, form);
  return JSON.stringify({
    educationBenefitsClaim: {
      form: formData,
    },
  });
}
export const isProductionOfTestProdEnv = automatedTest => {
  return (
    environment.isProduction() ||
    automatedTest ||
    (global && global?.window && global?.window?.buildType)
  );
};
export const introductionPage = (automatedTest = false) => {
  return isProductionOfTestProdEnv(automatedTest)
    ? IntroductionPage
    : IntroductionPageUpdate;
};

// IntroductionPage
