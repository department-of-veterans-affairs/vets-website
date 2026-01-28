import { expect } from 'chai';
import sinon from 'sinon';
import formConfig from '../../config/form';
import manifest from '../../manifest.json';

describe('22-10278 Form Config', () => {
  it('should render', () => {
    expect(formConfig).to.be.an('object');
  });

  it('should have required properties', () => {
    expect(formConfig.rootUrl).to.equal(manifest.rootUrl);
    expect(formConfig.title).to.contain(
      'Authorize VA to disclose personal information to a third party for education benefits',
    );
    expect(formConfig).to.have.property('chapters');
  });
});

describe('22-10278 formConfig – page visibility', () => {
  describe('personalInformationChapter -> personalInfoPage', () => {
    const page =
      formConfig.chapters.personalInformationChapter.pages.personalInfoPage;

    it('is wired with required fields', () => {
      expect(page.path).to.equal('personal-information');
      expect(page.depends).to.be.a('function');
    });

    it('depends on userLoggedIn === true', () => {
      expect(page.depends({ userLoggedIn: true })).to.be.true;
      expect(page.depends({ userLoggedIn: false })).to.be.false;
      expect(page.depends({})).to.be.false;
      expect(page.depends(undefined)).to.be.false;
    });
  });

  describe('personalInformationChapter -> nameAndDateOfBirth', () => {
    const page =
      formConfig.chapters.personalInformationChapter.pages.nameAndDateOfBirth;

    it('is wired with required fields', () => {
      expect(page.path).to.equal('name-and-date-of-birth');
      expect(page.uiSchema).to.be.an('object');
      expect(page.schema).to.be.an('object');
      expect(page.depends).to.be.a('function');
    });

    it('depends on userLoggedIn !== true', () => {
      expect(page.depends({ userLoggedIn: false })).to.be.true;
      expect(page.depends({ userLoggedIn: true })).to.be.false;
      expect(page.depends({})).to.be.true;
      expect(page.depends(undefined)).to.be.true;
    });
  });

  describe('personalInformationChapter -> identificationInformation', () => {
    const page =
      formConfig.chapters.personalInformationChapter.pages
        .identificationInformation;

    it('is wired with required fields', () => {
      expect(page.path).to.equal('identification-information');
      expect(page.title).to.equal('Identification information');
      expect(page.uiSchema).to.be.an('object');
      expect(page.schema).to.be.an('object');
      expect(page.depends).to.be.a('function');
    });

    it('depends on userLoggedIn !== true', () => {
      expect(page.depends({ userLoggedIn: false })).to.be.true;
      expect(page.depends({ userLoggedIn: true })).to.be.false;
      expect(page.depends({})).to.be.true;
      expect(page.depends(undefined)).to.be.true;
    });
  });

  describe('thirdPartyContactInformation -> thirdPartyPersonName', () => {
    const page =
      formConfig.chapters.thirdPartyContactInformation.pages
        .thirdPartyPersonName;

    it('is wired with required fields', () => {
      expect(page.path).to.equal('third-party-person-details');
      expect(page.title).to.equal('Name of person');
      expect(page.uiSchema).to.be.an('object');
      expect(page.schema).to.be.an('object');
      expect(page.depends).to.be.a('function');
    });

    it('depends on discloseInformation.authorize === "person"', () => {
      expect(
        page.depends({
          discloseInformation: { authorize: 'person' },
        }),
      ).to.be.true;
      expect(
        page.depends({
          discloseInformation: { authorize: 'organization' },
        }),
      ).to.be.false;
      expect(page.depends({})).to.be.false;
      expect(page.depends(undefined)).to.be.false;
    });
  });

  describe('thirdPartyContactInformation -> thirdPartyPersonAddress', () => {
    const page =
      formConfig.chapters.thirdPartyContactInformation.pages
        .thirdPartyPersonAddress;

    it('is wired with required fields', () => {
      expect(page.path).to.equal('third-party-person-details-1');
      expect(page.title).to.equal('Address of person');
      expect(page.uiSchema).to.be.an('object');
      expect(page.schema).to.be.an('object');
      expect(page.depends).to.be.a('function');
    });

    it('depends on discloseInformation.authorize === "person"', () => {
      expect(
        page.depends({
          discloseInformation: { authorize: 'person' },
        }),
      ).to.be.true;
      expect(
        page.depends({
          discloseInformation: { authorize: 'organization' },
        }),
      ).to.be.false;
      expect(page.depends({})).to.be.false;
      expect(page.depends(undefined)).to.be.false;
    });
  });
});

describe('22-10278 formConfig – navigation logic', () => {
  describe('disclosureChapter -> discloseInformation onNavForward', () => {
    const page =
      formConfig.chapters.disclosureChapter.pages.discloseInformation;

    it('is wired with onNavForward function', () => {
      expect(page.onNavForward).to.be.a('function');
    });

    it('navigates to authorized-organizations when authorize is "organization"', () => {
      const goPath = sinon.spy();
      const formData = {
        discloseInformation: { authorize: 'organization' },
      };

      page.onNavForward({ formData, goPath });

      expect(goPath.calledOnce).to.be.true;
      expect(goPath.calledWith('/organization-name-and-address')).to.be.true;
    });

    it('navigates to third-party-person-details when authorize is not "organization"', () => {
      const goPath = sinon.spy();
      const formData = {
        discloseInformation: { authorize: 'person' },
      };

      page.onNavForward({ formData, goPath });

      expect(goPath.calledOnce).to.be.true;
      expect(goPath.calledWith('/third-party-person-details')).to.be.true;
    });

    it('navigates to third-party-person-details when discloseInformation is missing', () => {
      const goPath = sinon.spy();
      const formData = {};

      page.onNavForward({ formData, goPath });

      expect(goPath.calledOnce).to.be.true;
      expect(goPath.calledWith('/third-party-person-details')).to.be.true;
    });
  });
});
