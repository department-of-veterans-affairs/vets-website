import { transformForSubmit } from 'platform/forms-system/src/js/helpers';
import { todaysDate } from '../helpers';

const INSTITUTION_TYPES = {
  public: 'public',
  'for profit': 'privateForProfit',
  private: 'privateNotForProfit',
};

function collectSubmissionReasons(formData) {
  return {
    submissionReasons: {
      initialApplication: !!formData.submissionReasons.initialApplication,
      approvalOfNewPrograms: !!formData.submissionReasons.approvalOfNewPrograms,
      reapproval: !!formData.submissionReasons.reapproval,
      updateInformation: !!formData.submissionReasons.updateInformation,
      other: !!formData.submissionReasons.other,
      updateInformationText: formData.updateInformationText,
      otherText: formData.otherText,
    },
  };
}

function collectAuthorizingOfficial(formData) {
  return {
    authorizingOfficial: {
      fullName: formData.authorizingOfficial.fullName,
      signature: formData.statementOfTruthSignature,
    },
  };
}

function collectAuthorizations(formData) {
  return {
    acknowledgement7: formData.acknowledgement7,
    acknowledgement8: formData.acknowledgement8,
    acknowledgement9: formData.acknowledgement9,
    acknowledgement10a: formData.acknowledgement10a,
    acknowledgement10b: formData.acknowledgement10b,
  };
}

function collectInstitutionProfile(formData) {
  return {
    institutionProfile: {
      isIHL: formData.institutionProfile.isIhl,
      ihlDegreeTypes: formData.institutionProfile.ihlDegreeTypes,
      participatesInTitleIV: formData.institutionProfile.participatesInTitleIv,
      opeidNumber: formData.institutionProfile.opeidNumber,
    },
    website: formData.website,
  };
}

function collectInstitutions(formData) {
  const data = {
    institutionClassification:
      INSTITUTION_TYPES[formData.primaryInstitutionDetails.type.toLowerCase()],
    institutionDetails: [
      {
        institutionName: formData.primaryInstitutionDetails.name,
        vaFacilityCode: formData.primaryInstitutionDetails.facilityCode,
        isForeignCountry:
          formData.primaryInstitutionDetails.mailingAddress.country !== 'USA',
        physicalAddress: formData.primaryInstitutionDetails.physicalAddress,
        mailingAddress: formData.primaryInstitutionDetails.mailingAddress,
      },
    ],
  };

  (formData.additionalInstitutions || []).forEach(inst => {
    data.institutionDetails.push({
      institutionName: inst.name,
      vaFacilityCode: inst.facilityCode,
      isForeignCountry: inst.mailingAddress.country !== 'USA',
      physicalAddress: inst.physicalAddress,
      mailingAddress: inst.mailingAddress,
    });
  });

  return data;
}

function collectPrograms(formData) {
  const data = {};
  data.programs = (formData.programs || []).map(program => {
    return {
      programName: program.programName,
      totalProgramLength: program.totalProgramLength,
      weeksPerTerm: parseInt(program.weeksPerTerm, 10),
      entryRequirements: program.entryRequirements,
      creditHours: +parseFloat(program.creditHours).toFixed(2),
    };
  });
  return data;
}

function collectMedicalSchoolInfo(formData) {
  const data = {
    isMedicalSchool: formData.isMedicalSchool,
    listedInWDOMS: formData.isMedicalSchool,
    accreditingAuthorityName: formData.accreditingAuthorityName,
    programAtLeast32Months: formData.programAtLeast32Months,
    graduatedLast12Months: formData.graduatedLast12Months,
  };
  if (data.graduatedLast12Months) {
    data.graduatedClasses = [
      {
        graduationDate: formData.graduatedClass1Date,
        graduatesCount: parseInt(formData.graduatedClass1Count, 10),
      },
      {
        graduationDate: formData.graduatedClass2Date,
        graduatesCount: parseInt(formData.graduatedClass2Count, 10),
      },
    ];
  }
  return data;
}

function collectOfficials(formData) {
  const data = {
    financialRepresentative: formData.financialRepresentative,
    schoolCertifyingOfficial: formData.schoolCertifyingOfficial,
  };
  data.governingBodyAndFaculty = (formData.governingBodyAndFaculty || []).map(
    fac => {
      return {
        fullName: fac.fullName,
        title: fac.title,
      };
    },
  );
  return data;
}

export default function transform(formConfig, form) {
  const data = [
    collectSubmissionReasons,
    collectAuthorizingOfficial,
    collectAuthorizations,
    collectInstitutionProfile,
    collectInstitutions,
    collectPrograms,
    collectMedicalSchoolInfo,
    collectOfficials,
  ].reduce((acc, collector) => ({ ...acc, ...collector(form.data) }), {});

  data.dateSigned = todaysDate();
  data.isAuthenticated = !!form.data.isAuthenticated;

  const submitData = transformForSubmit(formConfig, { ...form, data });

  return JSON.stringify({
    educationBenefitsClaim: {
      form: submitData,
    },
  });
}
