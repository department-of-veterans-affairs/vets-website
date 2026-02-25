import { cloneDeep, isNil } from 'lodash';
import { transformForSubmit } from 'platform/forms-system/src/js/helpers';

export default function transform(formConfig, form) {
  const personalInformationTransform = formData => {
    const clonedData = cloneDeep(formData);

    if (clonedData.userLoggedIn) {
      clonedData.claimantPersonalInformation = {
        ...clonedData.claimantPersonalInformation,
        ssn: clonedData.ssn,
      };

      delete clonedData.ssn;
      delete clonedData.applicantName;
      delete clonedData.dateOfBirth;
    } else {
      clonedData.claimantPersonalInformation = {
        ...clonedData.claimantPersonalInformation,
        ssn: clonedData.claimantPersonalInformation.veteranId.ssn,
      };

      delete clonedData.claimantPersonalInformation.veteranId;
    }

    clonedData.claimantContactInformation = {
      ...clonedData.claimantContactInformation,
      phoneNumber:
        clonedData.claimantContactInformation.phoneNumber.callingCode +
        clonedData.claimantContactInformation.phoneNumber.contact,
    };

    return clonedData;
  };

  const disclosureInformationTransform = formData => {
    const clonedData = cloneDeep(formData);

    if (clonedData.discloseInformation.authorize === 'person') {
      clonedData.thirdPartyPersonName = {
        first: clonedData.thirdPartyPersonName.fullName.first,
        middle: clonedData.thirdPartyPersonName.fullName.middle || '',
        last: clonedData.thirdPartyPersonName.fullName.last,
      };
      clonedData.thirdPartyPersonAddress =
        clonedData.thirdPartyPersonAddress.address;
    }

    if (clonedData.discloseInformation.authorize === 'organization') {
      clonedData.thirdPartyOrganizationInformation = {
        organizationName: clonedData.organizationName,
        organizationAddress: clonedData.organizationAddress,
      };

      delete clonedData.organizationName;
      delete clonedData.organizationAddress;
    }
    return clonedData;
  };

  const informationToDiscloseTransform = formData => {
    const clonedData = cloneDeep(formData);
    const filteredList = Object.entries(clonedData.claimInformation)
      .filter(([_, value]) => value)
      .map(([key, value]) => {
        return {
          [key]: value,
        };
      });

    clonedData.claimInformation = Object.assign({}, ...filteredList);
    return clonedData;
  };

  const lengthOfReleaseTransform = formData => {
    const clonedData = cloneDeep(formData);

    if (clonedData.lengthOfRelease.duration === 'date') {
      clonedData.lengthOfRelease = {
        lengthOfRelease: clonedData.lengthOfRelease.duration,
        date: clonedData.lengthOfRelease.date,
      };
    } else {
      clonedData.lengthOfRelease.lengthOfRelease = 'ongoing';
    }

    delete clonedData.lengthOfRelease.duration;
    return clonedData;
  };

  const securitySetupTransform = formData => {
    const clonedData = cloneDeep(formData);

    if (
      clonedData.securityQuestion.question === 'pin' ||
      clonedData.securityQuestion.question === 'highSchool' ||
      clonedData.securityQuestion.question === 'petName' ||
      clonedData.securityQuestion.question === 'teacherName' ||
      clonedData.securityQuestion.question === 'fatherMiddleName'
    ) {
      clonedData.securityAnswer = {
        securityAnswerText: clonedData.securityAnswerText,
      };
      delete clonedData.securityAnswerText;
    } else if (clonedData.securityQuestion.question === 'motherBornLocation') {
      clonedData.securityAnswer = {
        securityAnswerLocation: clonedData.securityAnswerLocation,
      };
      delete clonedData.securityAnswerLocation;
    } else {
      clonedData.securityAnswer = {
        securityAnswerCreate: clonedData.securityAnswerCreate,
      };
      delete clonedData.securityAnswerCreate;
    }

    return clonedData;
  };

  const statementAndAuthTransform = formData => {
    const clonedData = cloneDeep(formData);

    if (isNil(clonedData.isAuthenticated)) {
      clonedData.isAuthenticated =
        JSON.parse(localStorage.getItem('hasSession')) ?? false;
    }

    clonedData.privacyAgreementAccepted = clonedData.statementOfTruthCertified;

    delete clonedData.statementOfTruthCertified;
    delete clonedData.userLoggedIn;

    return clonedData;
  };

  const dateTransform = formData => {
    const clonedData = cloneDeep(formData);

    const date = new Date();
    const offset = date.getTimezoneOffset();
    const today = new Date(date.getTime() - offset * 60 * 1000);
    const [todaysDate] = today.toISOString().split('T');
    clonedData.dateSigned = todaysDate;
    return clonedData;
  };

  const usFormTransform = formData =>
    transformForSubmit(formConfig, { ...form, data: formData });

  const transformedData = [
    personalInformationTransform,
    disclosureInformationTransform,
    informationToDiscloseTransform,
    lengthOfReleaseTransform,
    securitySetupTransform,
    statementAndAuthTransform,
    dateTransform,
    usFormTransform, // this must appear last
  ].reduce((formData, transformer) => {
    return transformer(formData);
  }, form.data);

  return JSON.stringify({
    educationBenefitsClaim: {
      form: transformedData,
    },
  });
}
