import { isEmpty } from 'lodash';
import { apiRequest } from 'platform/utilities/api';
import environment from '@department-of-veterans-affairs/platform-utilities/environment';

const goPathAfterGettingITF = (
  intent,
  formData,
  goPath,
  goNextPath,
  setFormData,
  urlPrefix,
) => {
  const formDataToSet = { ...formData, 'view:activeITF': intent };

  setFormData(formDataToSet);

  if (!isEmpty(formDataToSet?.['view:activeITF'])) {
    goPath(`${urlPrefix}existing-itf`);
  } else {
    goNextPath();
  }
};

const fetchIntentToFile = async (
  formData,
  benefitType,
  urlPrefix,
  goPath,
  goNextPath,
) => {
  let params = `?veteranFirstName=${
    formData.veteranSubPage.veteranFullName.first
  }`;
  params = `${params}&veteranLastName=${
    formData.veteranSubPage.veteranFullName.last
  }`;
  params = `${params}&veteranDateOfBirth=${
    formData.veteranSubPage.veteranDateOfBirth
  }`;
  params = `${params}&veteranSsn=${formData.veteranSubPage.veteranSsn}`;
  if (benefitType === 'survivor') {
    params = `${params}&claimantFirstName=${
      formData.claimantSubPage.claimantFullName.first
    }`;
    params = `${params}&claimantLastName=${
      formData.claimantSubPage.claimantFullName.last
    }`;
    params = `${params}&claimantDateOfBirth=${
      formData.claimantSubPage.claimantDateOfBirth
    }`;
    params = `${params}&claimantSsn=${formData.claimantSubPage.claimantSsn}`;
  }
  params = `${params}&benefitType=${benefitType}`;
  try {
    return await apiRequest(
      `${
        environment.API_URL
      }/accredited_representative_portal/v0/intent_to_file${params}`,
    );
  } catch (error) {
    const { status } = error?.errors?.[0] ?? {};
    if (
      error.errors &&
      ((typeof error.errors[0] === 'string' &&
        error.errors[0].match(/^not allowed/)) ||
        (typeof error.errors[0] === 'object' && error.errors[0].code === '400'))
      // handle no representation or cannot find ICN
    ) {
      goPath(`${urlPrefix}intent-to-file-no-representation`);
      // returns error if there is no ITF, 404 is the happy path
    } else if (status === '404') {
      goNextPath();
      // generic error catchall - unknown if itf exists
    } else {
      goPath(`${urlPrefix}intent-to-file-unknown`);
    }
    return null;
  }
};

export const getIntentsToFile = ({
  formData,
  goPath,
  goNextPath,
  setFormData,
  urlPrefix,
}) => {
  goPath(`${urlPrefix}get-itf-status`);

  try {
    fetchIntentToFile(
      formData,
      formData.benefitType,
      urlPrefix,
      goPath,
      goNextPath,
    ).then(val => {
      if (val) {
        goPathAfterGettingITF(
          val.data,
          formData,
          goPath,
          goNextPath,
          setFormData,
          urlPrefix,
        );
      }
    });
  } catch (error) {
    goNextPath();
  }
};
