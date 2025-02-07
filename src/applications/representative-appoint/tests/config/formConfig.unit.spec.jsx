import { expect } from 'chai';
import formConfig from '../../config/form';
import mockFormData2122a from '../fixtures/data/21-22a/form-data.json';
import mockFormData2122 from '../fixtures/data/form-data.json';

describe('FormConfig depends function', () => {
  const { chapters } = formConfig;

  const authPages = chapters.authorization.pages;
  const repPages = chapters.accreditedRepresentativeInformation.pages;
  const claimantPages = chapters.claimantInfo.pages;
  const veteranPages = chapters.veteranInfo.pages;

  context('21-22a', () => {
    it('should show authorizeInsideVA', () => {
      expect(authPages.authorizeInsideVA.depends(mockFormData2122a)).to.be.true;
    });
    it('should show veteranServiceInformation', () => {
      expect(veteranPages.veteranServiceInformation.depends(mockFormData2122a))
        .to.be.true;
    });
    it('should show authorizeInsideVA', () => {
      expect(authPages.authorizeInsideVA.depends(mockFormData2122a)).to.be.true;
    });

    it('should show authorizeOutsideVA', () => {
      expect(authPages.authorizeOutsideVA.depends(mockFormData2122a)).to.be
        .true;
    });

    it('should show authorizeOutsideVANames', () => {
      expect(authPages.authorizeOutsideVANames.depends(mockFormData2122a)).to.be
        .true;
    });

    it('should hide selectAccreditedOrganization', () => {
      expect(repPages.selectAccreditedOrganization.depends(mockFormData2122a))
        .to.not.be.ok;
    });
  });

  context('21-22', () => {
    it('should hide authorizeInsideVA', () => {
      expect(authPages.authorizeInsideVA.depends(mockFormData2122)).to.not.be
        .ok;
    });

    it('should show selectAccreditedOrganization', () => {
      expect(repPages.selectAccreditedOrganization.depends(mockFormData2122)).to
        .be.true;
    });

    it('should hide authorizeInsideVA', () => {
      expect(authPages.authorizeInsideVA.depends(mockFormData2122)).to.not.be
        .ok;
    });

    it('should hide authorizeOutsideVA', () => {
      expect(authPages.authorizeOutsideVA.depends(mockFormData2122)).to.not.be
        .ok;
    });
    it('should hide authorizeOutsideVANames', () => {
      expect(authPages.authorizeOutsideVANames.depends(mockFormData2122)).to.be;
    });

    it('should hide veteranServiceInformation', () => {
      expect(veteranPages.veteranServiceInformation.depends(mockFormData2122))
        .to.not.be.ok;
    });
  });

  context('applicant is veteran', () => {
    const mockData = {
      'view:applicantIsVeteran': 'Yes',
    };
    it('should hide claimant pages', () => {
      expect(claimantPages.claimantRelationship.depends(mockData)).to.be.false;
      expect(claimantPages.claimantPersonalInformation.depends(mockData)).to.be
        .false;
      expect(claimantPages.claimantContactMailing.depends(mockData)).to.be
        .false;
      expect(claimantPages.claimantContactPhoneEmail.depends(mockData)).to.be
        .false;
    });

    it('should show veteran pages', () => {
      expect(claimantPages.veteranPersonalInformation.depends(mockData)).to.be
        .true;
      expect(claimantPages.veteranContactMailing.depends(mockData)).to.be.true;
      expect(claimantPages.veteranContactPhoneEmail.depends(mockData)).to.be
        .true;
      expect(claimantPages.veteranIdentification.depends(mockData)).to.be.true;
    });

    it('should hide veteranInfo', () => {
      expect(chapters.veteranInfo.depends(mockData)).to.be.false;
      expect(veteranPages.veteranPersonalInformation.depends(mockData)).to.be
        .false;
      expect(veteranPages.veteranContactMailingClaimant.depends(mockData)).to.be
        .false;
      expect(veteranPages.veteranContactPhoneEmailClaimant.depends(mockData)).to
        .be.false;
      expect(veteranPages.veteranIdentification.depends(mockData)).to.be.false;
    });
  });

  context('applicant is not veteran', () => {
    const mockData = {
      'view:applicantIsVeteran': 'No',
    };

    it('should show claimant pages', () => {
      expect(claimantPages.claimantRelationship.depends(mockData)).to.be.true;
      expect(claimantPages.claimantPersonalInformation.depends(mockData)).to.be
        .true;
      expect(claimantPages.claimantContactMailing.depends(mockData)).to.be.true;
      expect(claimantPages.claimantContactPhoneEmail.depends(mockData)).to.be
        .true;
    });

    it('should hide veteran pages', () => {
      expect(claimantPages.veteranPersonalInformation.depends(mockData)).to.be
        .false;
      expect(claimantPages.veteranContactMailing.depends(mockData)).to.be.false;
      expect(claimantPages.veteranContactPhoneEmail.depends(mockData)).to.be
        .false;
      expect(claimantPages.veteranIdentification.depends(mockData)).to.be.false;
    });

    it('should show veteranInfo', () => {
      expect(chapters.veteranInfo.depends(mockData)).to.be.true;
      expect(veteranPages.veteranPersonalInformation.depends(mockData)).to.be
        .true;
      expect(veteranPages.veteranContactMailingClaimant.depends(mockData)).to.be
        .true;
      expect(veteranPages.veteranContactPhoneEmailClaimant.depends(mockData)).to
        .be.true;
      expect(veteranPages.veteranIdentification.depends(mockData)).to.be.true;
    });
  });

  it('should hide selectAccreditedOrganization when rep status null', () => {
    expect(repPages.replaceAccreditedRepresentative.depends(mockFormData2122))
      .to.be.false;
  });

  it('should show authorizeMedicalSelect when authorizationRadio is yes', () => {
    expect(authPages.authorizeMedicalSelect.depends(mockFormData2122)).to.be
      .true;
  });
});
