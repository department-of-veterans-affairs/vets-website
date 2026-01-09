import { transformForSubmit } from 'platform/forms-system/src/js/helpers';
import {
  ACCREDITATION_TYPE_ENUM,
  PHONE_TYPE_ENUM,
  SERVICE_BRANCH_ENUM,
  DISCHARGE_TYPE_ENUM,
  EMPLOYMENT_STATUS_ENUM,
  DEGREE_TYPE_ENUM,
  ADMITTANCE_TYPE_ENUM,
  // DOCUMENT_TYPE_ENUM,
  RELATIONSHIP_TO_APPLICANT_ENUM,
  INSTITUTION_TYPE_ENUM,
} from './enums';

const build21aPayload = data => {
  return {
    // Unique Identifiers and fields needed by GCLAWS
    icnNo: null,
    uId: null,
    applicationStatusId: 1,

    // Chapter 1 - Role
    accreditationTypeId: ACCREDITATION_TYPE_ENUM[data.role],

    // Chapter 1 - Law License
    isInGoodStanding: data.lawLicense,

    // Chapter 1 - Name and DOB
    firstName: data.fullName?.first,
    middleName: data.fullName?.middle || null,
    lastName: data.fullName?.last,
    suffix: data.fullName?.suffix || null,
    birthDate: data.dateOfBirth,

    // Chapter 1 - Place of Birth
    birthAddressLine1: null,
    birthAddressLine2: null,
    birthAddressLine3: null, // v5 field - not currently setting this field
    birthCity: data.placeOfBirth?.city,
    birthState: data.placeOfBirth?.state,
    birthPostalCode: null, // v5 field - not currently setting this field
    birthCountry: data.placeOfBirth?.country,

    // Chapter 1 - Contact Info
    homePhone: `${data.phone.callingCode}${data.phone.contact}`,
    homePhoneTypeId: PHONE_TYPE_ENUM[data.typeOfPhone?.toUpperCase()],
    canReceiveTexts: !!data.canReceiveTexts,
    homeEmail: data.email,

    // Chapter 1 - Home Address
    homeAddressIsMilitary: !!data.homeAddress?.isMilitary,
    homeAddressLine1: data.homeAddress?.street,
    homeAddressLine2: data.homeAddress?.street2 || null,
    homeAddressLine3: null, // v5 field - not currently setting this field
    homeAddressCity: data.homeAddress?.city,
    homeAddressState: data.homeAddress?.state,
    homeAddressPostalCode: data.homeAddress?.postalCode,
    homeAddressCountry: data.homeAddress?.country,

    // Chapter 1 - Primary Mailing Address
    primaryMailingAddress: data.primaryMailingAddress,

    // Chapter 1 - Other Addresses
    otherAddressIsMilitary: !!data.otherAddress?.isMilitary,
    otherAddressLine1: data.otherAddress?.street || null,
    otherAddressLine2: data.otherAddress?.street2 || null,
    otherAddressLine3: null, // v5 field - not currently setting this field
    otherAddressCity: data.otherAddress?.city || null,
    otherAddressState: data.otherAddress?.state || null,
    otherAddressPostalCode: data.otherAddress?.postalCode || null,
    otherAddressCountry: data.otherAddress?.country || null,

    // Chapter 2 - Military Service
    servedInMilitary: !!data.militaryServiceExperiences?.length > 0,

    // Chapter 2 - Military Service: Branch and Dates
    militaryServices:
      data.militaryServiceExperiences?.map(m => ({
        serviceBranchId: SERVICE_BRANCH_ENUM[m.branch],
        serviceBranchExplanation: null, // v5 field - not currently setting this field
        entryDate: `${m.dateRange?.from}-01`, // adding a day here since GCLAWS requires it
        // Not using `currentlyServing` so if it exists we set `dischargeDate` to null
        // adding a day here since GCLAWS requires it
        dischargeDate:
          !!m.currentlyServing && m.dateRange?.to
            ? `${m.dateRange?.to}-01`
            : null,
        dischargeTypeId: DISCHARGE_TYPE_ENUM[m.characterOfDischarge] || null,
        dischargeTypeExplanation: m.explanationOfDischarge || null,
      })) || [],

    // Chapter 3 - Employment Status
    employmentStatusId: EMPLOYMENT_STATUS_ENUM[data.employmentStatus],

    // Chapter 3 - Employment Status Description
    employmentStatusExplaination: data.describeEmployment || null,

    // Chapter 3 - Employers Info, Address, Phone, Date Range
    employment:
      data.employers?.map(e => ({
        employerName: e.name,
        positionTitle: e.positionTitle,
        supervisorName: e.supervisorName,
        supervisorEmail: null, // v5 field - not currently setting this field
        addressIsMilitary: !!e.address?.isMilitary,
        addressLine1: e.address?.street || null,
        addressLine2: e.address?.street2 || null,
        addressLine3: null, // v5 field - not currently setting this field
        addressCity: e.address?.city || null,
        addressState: e.address?.state || null,
        addressPostalCode: e.address?.postalCode || null,
        addressCountry: e.address?.country || null,
        phoneTypeId: PHONE_TYPE_ENUM.WORK,
        phoneNumber: `${e.phone.callingCode}${e.phone.contact}`,
        phoneExtension: e.extension,
        startDate: `${e.dateRange?.from}-01`, // adding a day here since GCLAWS requires it
        // Not using `currentlyEmployed` so if it exists we set `endDate` to null
        endDate:
          !!e.currentlyEmployed && e.dateRange?.to
            ? `${e.dateRange?.to}-01`
            : null,
      })) || [],

    // Chapter 3 - Employment Activities
    advertisingToVeterans: data.employmentActivities.BUSINESS || false,
    consultingService: data.employmentActivities.CONSULTING || false,
    financialPlanning: data.employmentActivities.FINANCIAL || false,
    homeNursingCare: data.employmentActivities.HOME_OR_NURSING || false,
    medicalServices: data.employmentActivities.MEDICAL || false,
    // v4 field, gclaws is adding this field on 7/14
    // socialServices: data.employmentActivities.SOCIAL_WORK || false,
    // v4 field, gclaws is adding this field on 7/14
    // vocaltionalRehabilitation:
    //   data.employmentActivities.VOCATIONAL_REHABILITATION || false,

    // Chapter 4 - Education Institution and Degree Information
    education:
      data.educationalInstitutions?.map(e => ({
        name: e.name,
        startDate: `${e.dateRange?.from}-01`, // adding a day here since GCLAWS requires it
        endDate: e.dateRange?.to ? `${e.dateRange.to}-01` : null, // adding a day here since GCLAWS requires it
        wasDegreeReceived: !!e.degreeReceived,
        major: e.major,
        degreeTypeId: DEGREE_TYPE_ENUM[e.degree],
        addressIsMilitary: !!e.address?.isMilitary,
        addressLine1: e.address?.street || null,
        addressLine2: e.address?.street2 || null,
        addressLine3: null, // v5 field - not currently setting this field
        addressCity: e.address?.city || null,
        addressState: e.address?.state || null,
        addressPostalCode: e.address?.postalCode || null,
        addressCountry: e.address?.country || null,
        institutionTypeId: INSTITUTION_TYPE_ENUM[e.institution], // v5 field - not currently setting this field
      })) || [],

    // Chapter 5 - Jurisdictions and Summary
    // hasJurisdiction: !!data.jurisdictions?.length > 0, // v5 field - not currently setting this field
    jurisdictions:
      data.jurisdictions?.map(j => ({
        admittedName: j.jurisdiction,
        admittedNote: j.otherJurisdiction || null,
        admittanceTypeId: ADMITTANCE_TYPE_ENUM.JURISDICTION,
        admissionDate: j.admissionDate,
        membershipRegistrationNumber: j.membershipOrRegistrationNumber,
      })) || [],
    jurisdictionExplanation: null, // v5 field - not currently setting this field
    // jurisdictionUploadedAllDocuments: false, // v5 field - not currently setting this field
    // jurisdictionDeclinedToUploadDocuments: false, // v5 field - not currently setting this field

    // Chapter 5 - Agencies and Courts Summary
    admittedToPracticeAgency: !!data.agenciesOrCourts?.length > 0,
    agencies:
      data.agenciesOrCourts?.map(a => ({
        admittedName: a.agencyOrCourt,
        admittedNote: a.otherAgencyOrCourt || null,
        admittanceTypeId: ADMITTANCE_TYPE_ENUM.AGENCY,
        admissionDate: a.admissionDate,
        membershipRegistrationNumber: a.membershipOrRegistrationNumber,
      })) || [],
    agenciesExplanation: null, // v5 field - not currently setting this field
    // agenciesUploadedAllDocuments: false, // v5 field - not currently setting this field
    // agenciesDeclinedToUploadDocuments: false, // v5 field - not currently setting this field

    // Chapter 6 - Conviction (13A and 13B)
    wasImprisoned: !!data.conviction,
    imprisonedExplanation: data.convictionDetailsExplanation,
    // docType: DOCUMENT_TYPE_ENUM.Imprisoned, // TODO: Chapter 6: File upload is not working https://github.com/department-of-veterans-affairs/va.gov-team/issues/112577
    imprisonedUploadedAllDocuments:
      data?.convictionDetailsCertification === undefined ||
      !!data?.convictionDetailsCertification?.certified,
    imprisonedDetailsDocuments: data?.imprisonedDetailsDocuments,
    // imprisonedDeclinedToUploadDocuments: false, // v5 field - not currently setting this field

    // Chapter 6 - Court Martialed (14A and 14B)
    wasMilitaryConviction: !!data.courtMartialed,
    militaryConvictionExplanation:
      data.courtMartialedDetailsExplanation || null,
    // docType: DOCUMENT_TYPE_ENUM.Convicted, // TODO: Chapter 6: File upload is not working https://github.com/department-of-veterans-affairs/va.gov-team/issues/112577
    militaryConvictionUploadedAllDocuments:
      data?.courtMartialedDetailsCertification === undefined ||
      !!data?.courtMartialedDetailsCertification?.certified,
    militaryConvictionDetailsDocuments: data?.courtMartialedDetailsDocuments,
    // militaryConvictionDeclinedToUploadDocuments: false, // v5 field - not currently setting this field

    // Chapter 6 - Under Charges (15A and 15B)
    isCurrentlyCharged: !!data.underCharges,
    currentlyChargedExplanation: data.underChargesDetailsExplanation || null,
    // docType: DOCUMENT_TYPE_ENUM.CurrentlyCharged, // TODO: Chapter 6: File upload is not working https://github.com/department-of-veterans-affairs/va.gov-team/issues/112577
    currentlyChargedUploadedAllDocuments:
      data?.underChargesDetailsCertification === undefined ||
      !!data?.underChargesDetailsCertification?.certified,
    currentlyChargedDetailsDocuments: data?.underChargesDetailsDocuments,
    // currentlyChargedDeclinedToUploadDocuments: false, // v5 field - not currently setting this field

    // Chapter 6 - Resigned from Education (16)
    wasSuspended: !!data.resignedFromEducation,
    suspendedExplanation: data.resignedFromEducationDetailsExplanation || null,
    // docType: DOCUMENT_TYPE_ENUM.Suspended, // TODO: Chapter 6: File upload is not working https://github.com/department-of-veterans-affairs/va.gov-team/issues/112577
    suspendedUploadedAllDocuments:
      data?.resignedFromEducationDetailsCertification === undefined ||
      !!data?.resignedFromEducationDetailsCertification?.certified,
    suspendedDetailsDocuments: data?.resignedFromEducationDetailsDocuments,
    // suspendedDeclinedToUploadDocuments: false, // v5 field - not currently setting this field

    // Chapter 6 - Withdrawn from Education (16)
    hasWithdrawn: !!data.withdrawnFromEducation,
    withdrawnExplanation: data.withdrawnFromEducationDetailsExplanation || null,
    // docType: DOCUMENT_TYPE_ENUM.Withdrawn, // TODO: Chapter 6: File upload is not working https://github.com/department-of-veterans-affairs/va.gov-team/issues/112577
    withdrawnUploadedAllDocuments:
      data?.withdrawnFromEducationDetailsCertification === undefined ||
      !!data?.withdrawnFromEducationDetailsCertification?.certified,
    withdrawnDetailsDocuments: data?.withdrawnFromEducationDetailsDocuments,
    // withdrawnDeclinedToUploadDocuments: false, // v5 field - not currently setting this field

    // Chapter 6 - Disciplined for Dishonesty (17)
    wasDisciplined: !!data.disciplinedForDishonesty,
    disciplinedExplanation:
      data.disciplinedForDishonestyDetailsExplanation || null,
    // docType: DOCUMENT_TYPE_ENUM.Disciplined, // TODO: Chapter 6: File upload is not working https://github.com/department-of-veterans-affairs/va.gov-team/issues/112577
    disciplinedUploadedAllDocuments:
      data?.disciplinedForDishonestyDetailsCertification === undefined ||
      !!data?.disciplinedForDishonestyDetailsCertification?.certified,
    disciplinedDetailsDocuments: data?.disciplinedForDishonestyDetailsDocuments,
    // disciplinedDeclinedToUploadDocuments: false, // v5 field - not currently setting this field

    // Chapter 6 - Resigned for Dishonesty (18)
    hasResignedRetired: !!data.resignedForDishonesty,
    resignedRetiredExplanation:
      data.resignedForDishonestyDetailsExplanation || null,
    // docType: DOCUMENT_TYPE_ENUM.ResignedRetired, // TODO: Chapter 6: File upload is not working https://github.com/department-of-veterans-affairs/va.gov-team/issues/112577
    resignedRetiredUploadedAllDocuments:
      data?.resignedForDishonestyDetailsCertification === undefined ||
      !!data?.resignedForDishonestyDetailsCertification?.certified,
    resignedRetiredDetailsDocuments:
      data?.resignedForDishonestyDetailsDocuments,
    // resignedRetiredDeclinedToUploadDocuments: false, // v5 field - not currently setting this field

    // Chapter 6 - Representative for Agency (19)
    wasAgentAttorney: !!data.representativeForAgency,
    agentAttorneyExplanation:
      data.representativeForAgencyDetailsExplanation || null,
    // docType: DOCUMENT_TYPE_ENUM.AgencyAttorney, // TODO: Chapter 6: File upload is not working https://github.com/department-of-veterans-affairs/va.gov-team/issues/112577
    agentAttorneyUploadedAllDocuments:
      data?.representativeForAgencyDetailsCertification === undefined ||
      !!data?.representativeForAgencyDetailsCertification?.certified,
    agentAttorneyDetailsDocuments:
      data?.representativeForAgencyDetailsDocuments,
    // agentAttorneyDeclinedToUploadDocuments: false, // v5 field - not currently setting this field

    // Chapter 6 - Reprimanded in Agency (20)
    wasReprimanded: !!data.reprimandedInAgency,
    reprimandedExplanation: data.reprimandedInAgencyDetailsExplanation || null,
    // docType: DOCUMENT_TYPE_ENUM.Reprimanded, // TODO: Chapter 6: File upload is not working https://github.com/department-of-veterans-affairs/va.gov-team/issues/112577
    reprimandedUploadedAllDocuments:
      data?.reprimandedInAgencyDetailsCertification === undefined ||
      !!data?.reprimandedInAgencyDetailsCertification?.certified,
    reprimandedDetailsDocuments: data?.reprimandedInAgencyDetailsDocuments,
    // reprimandedDeclinedToUploadDocuments: false, // v5 field - not currently setting this field

    // Chapter 6 - Resigned from Agency (new - not on pdf)
    hasResignedToAvoidReprimand: !!data.resignedFromAgency,
    resignedToAvoidReprimandExplanation:
      data.resignedFromAgencyDetailsExplanation || null,
    // docType: DOCUMENT_TYPE_ENUM.ResignedToAvoidReprimand, // TODO: Chapter 6: File upload is not working https://github.com/department-of-veterans-affairs/va.gov-team/issues/112577
    resignedToAvoidReprimandUploadedAllDocuments:
      data?.resignedFromAgencyDetailsCertification === undefined ||
      !!data?.resignedFromAgencyDetailsCertification?.certified,
    resignedToAvoidReprimandDetailsDocuments:
      data?.resignedFromAgencyDetailsDocuments,
    // resignedToAvoidReprimandDeclinedToUploadDocuments: false, // v5 field - not currently setting this field

    // Chapter 6 - Applied for Va Accreditation (21)
    hasAppliedForAccreditation: !!data.appliedForVaAccreditation,
    appliedForAccreditationExplanation:
      data.appliedForVaAccreditationDetailsExplanation || null,
    // docType: DOCUMENT_TYPE_ENUM.AppliedForAccredidation, // TODO: Chapter 6: File upload is not working https://github.com/department-of-veterans-affairs/va.gov-team/issues/112577
    appliedForAccreditationUploadedAllDocuments:
      data?.appliedForVaAccreditationDetailsCertification === undefined ||
      !!data?.appliedForVaAccreditationDetailsCertification?.certified,
    appliedForAccreditationDetailsDocuments:
      data?.appliedForVaAccreditationDetailsDocuments,
    // appliedForAccreditationDeclinedToUploadDocuments: false, // v5 field - not currently setting this field

    // Chapter 6 - Terminated by VSOrg (22)
    wasAccreditationTerminated: !!data.terminatedByVsorg,
    accreditationTerminatedExplanation:
      data.terminatedByVsorgDetailsExplanation || null,
    // docType: DOCUMENT_TYPE_ENUM.AccreditationTerminated, // TODO: Chapter 6: File upload is not working https://github.com/department-of-veterans-affairs/va.gov-team/issues/112577
    accreditationTerminatedUploadedAllDocuments:
      data?.terminatedByVsorgDetailsCertification === undefined ||
      !!data?.terminatedByVsorgDetailsCertification?.certified,
    accreditationTerminatedDetailsDocuments:
      data?.terminatedByVsorgDetailsDocuments,
    // accreditationTerminatedDeclinedToUploadDocuments: false, // v5 field - not currently setting this field

    // Chapter 6 - Terminated by VSOrg (23A and 23B)
    hasImpairments: !!data.conditionThatAffectsRepresentation,
    impairmentsExplanation:
      data.conditionThatAffectsRepresentationDetailsExplanation || null,
    // docType: DOCUMENT_TYPE_ENUM.Impairments, // TODO: Chapter 6: File upload is not working https://github.com/department-of-veterans-affairs/va.gov-team/issues/112577
    impairmentsUploadedAllDocuments:
      data?.conditionThatAffectsRepresentationDetailsCertification ===
        undefined ||
      !!data?.conditionThatAffectsRepresentationDetailsCertification?.certified,
    impairmentsDetailsDocuments:
      data?.conditionThatAffectsRepresentationDetailsDocuments,
    // impairmentsDeclinedToUploadDocuments: false, // v5 field - not currently setting this field

    // Chapter 6 - Condition that affect representation (24A and 24B)
    // hasPhysicalLimitations: null, // v5 field - not currently setting this field
    // physicalLimitationsExplanation: null, // v5 field - not currently setting this field
    // docType: DOCUMENT_TYPE_ENUM.PhysicalLimitations, // v5 field - not currently setting this field
    // physicalLimitationsUploadedAllDocuments: null, // v5 field - not currently setting this field
    // physicalLimitationsDeclinedToUploadDocuments: null, // v5 field - not currently setting this field

    // Chapter 7 - Character References
    characterReferences:
      data.characterReferences?.map(r => ({
        firstName: r.fullName?.first,
        middleName: r.fullName?.middle || null,
        lastName: r.fullName?.last,
        suffix: r.fullName?.suffix || null,
        addressIsMilitary: !!r.address?.isMilitary,
        addressLine1: r.address?.street || null,
        addressLine2: r.address?.street2 || null,
        addressLine3: null, // v5 field - not currently setting this field
        addressCity: r.address?.city || null,
        addressState: r.address?.state || null,
        addressPostalCode: r.address?.postalCode || null,
        addressCountry: r.address?.country || null,
        phoneNumber: `${r.phone.callingCode}${r.phone.contact}`,
        phoneExtension: null, // v5 field - not currently setting this field
        phoneTypeId: null, // v5 field - not currently setting this field
        email: r.email,
        relationshipToApplicantTypeId:
          RELATIONSHIP_TO_APPLICANT_ENUM[r.relationship],
      })) || [],

    // Chapter 8  - Optional Supplementary Statements
    supplementalStatement: data.supplementalStatement || null,
    personalStatement: data.personalStatement || null,

    // Chapter 9 - Review
    signature: data.statementOfTruthSignature || null,
    instructionAcknowledge: !!data.statementOfTruthCertified,
  };
};

export default function submitTransformer(formConfig, form) {
  const transformedData = build21aPayload(form.data);
  const submission = transformForSubmit(formConfig, {
    ...form,
    data: transformedData,
  });

  return JSON.stringify({
    form21aSubmission: {
      form: submission,
    },
  });
}
