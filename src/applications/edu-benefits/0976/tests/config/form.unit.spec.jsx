import { expect } from 'chai';
import formConfig from '../../config/form';
import manifest from '../../manifest.json';

describe('22-0976Form Config', () => {
  it('should load form config basics', () => {
    expect(formConfig).to.be.an('object');
    expect(formConfig.rootUrl).to.contain(manifest.rootUrl);
    expect(formConfig).to.have.property('chapters');
  });

  it('handles the depends correctly', () => {
    const formData = {
      hasVaFacilityCode: true,
      submissionReasons: {
        updateInformation: true,
        other: true,
      },
      isMedicalSchool: true,
      graduatedLast12Months: true,
    };

    const { chapters } = formConfig;
    const { institutionDetails, programInformation } = chapters;
    expect(institutionDetails.pages.primaryInstitutionDetails.depends(formData))
      .to.be.true;
    expect(institutionDetails.pages.primaryInstitutionType.depends(formData)).to
      .be.false;
    expect(
      institutionDetails.pages.primaryInstitutionNameAndMailingAddress.depends(
        formData,
      ),
    ).to.be.false;
    expect(
      institutionDetails.pages.primaryInstitutionPhysicalAddress.depends(
        formData,
      ),
    ).to.be.false;
    expect(institutionDetails.pages.primaryInstitutionReview.depends(formData))
      .to.be.false;
    expect(
      institutionDetails.pages.additionalInstitutionsSummaryWithCode.depends(
        formData,
      ),
    ).to.be.true;
    expect(
      institutionDetails.pages.additionalInstitutionsItemWithCode.depends(
        formData,
      ),
    ).to.be.true;
    expect(
      institutionDetails.pages.additionalInstitutionsSummaryWithoutCode.depends(
        formData,
      ),
    ).to.be.false;
    expect(
      institutionDetails.pages.additionalInstitutionsItemWithoutCode.depends(
        formData,
      ),
    ).to.be.false;

    expect(
      institutionDetails.pages.submissionReasonUpdateInformationText.depends(
        formData,
      ),
    ).to.be.true;
    expect(institutionDetails.pages.submissionReasonOtherText.depends(formData))
      .to.be.true;

    expect(programInformation.pages.medicalAuthorityName.depends(formData)).to
      .be.true;
    expect(programInformation.pages.medical32MonthProgram.depends(formData)).to
      .be.true;
    expect(programInformation.pages.medicalHasGraduatingClass.depends(formData))
      .to.be.true;
    expect(
      programInformation.pages.medicalGraduatingClassDetails.depends(formData),
    ).to.be.true;
  });
});
