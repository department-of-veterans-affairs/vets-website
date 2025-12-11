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
  let params = `?veteranFirstName=${formData.veteranFullName.first}`;
  params = `${params}&veteranLastName=${formData.veteranFullName.last}`;
  params = `${params}&veteranDateOfBirth=${formData.veteranDateOfBirth}`;
  params = `${params}&veteranSsn=${formData.veteranSsn}`;
  params = `${params}&benefitType=${benefitType}`;
  try {
    return await apiRequest(
      `${
        environment.API_URL
      }/accredited_representative_portal/v0/intent_to_file${params}`,
    );
  } catch (error) {
    if (
      error.errors &&
      typeof error.errors[0] === 'string' &&
      error.errors[0].match(/^not allowed/)
    ) {
      goPath(`${urlPrefix}permission-error`);
    } else {
      goNextPath();
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
