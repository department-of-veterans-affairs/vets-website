import { expect } from 'chai';
import { render } from '@testing-library/react';

import formConfig from '../../config/form';
import manifest from '../../manifest.json';

describe('22-8794 formConfig', () => {
  it('exports an object', () => {
    expect(formConfig).to.be.an('object');
  });

  it('includes required top-level properties', () => {
    expect(formConfig.rootUrl).to.equal(manifest.rootUrl);
    expect(formConfig.title).to.contain(
      "Update your institution's list of certifying officials",
    );
    const { getByText } = render(formConfig.subTitle());
    expect(
      getByText('Designation of certifying official(s) (VA Form 22-8794)', {
        exact: false,
      }),
    ).to.exist;
    expect(formConfig).to.have.property('chapters');
  });

  // it('submit() returns a resolved confirmation payload', async () => {
  //   const result = await formConfig.submit();
  //   expect(result)
  //     .to.have.property('attributes')
  //     .that.has.property('confirmationNumber')
  //     .that.is.a('string');
  // });

  it('depends function shows / hides facility page correctly', () => {
    const facilityPage =
      formConfig.chapters.institutionDetailsChapter.pages
        .institutionDetailsFacility;

    expect(facilityPage)
      .to.have.property('depends')
      .that.is.a('function');

    const visibleFormData = {
      institutionDetails: { hasVaFacilityCode: true },
    };
    const hiddenFormData = {
      institutionDetails: { hasVaFacilityCode: false },
    };

    expect(facilityPage.depends(visibleFormData)).to.be.true;
    expect(facilityPage.depends(hiddenFormData)).to.be.false;
  });

  it('depends function shows / hides no-facility-description page correctly', () => {
    const noFacilityPage =
      formConfig.chapters.institutionDetailsChapter.pages
        .institutionDetailsNoFacilityDescription;
    expect(noFacilityPage)
      .to.have.property('depends')
      .that.is.a('function');

    const showData = { institutionDetails: { hasVaFacilityCode: false } };
    const hideData = { institutionDetails: { hasVaFacilityCode: true } };

    expect(noFacilityPage.depends(showData)).to.be.true;
    expect(noFacilityPage.depends(hideData)).to.be.false;
  });

  it('depends function shows / hides name & address page correctly', () => {
    const nameAddrPage =
      formConfig.chapters.institutionDetailsChapter.pages
        .institutionNameAndAddress;
    expect(nameAddrPage)
      .to.have.property('depends')
      .that.is.a('function');

    const showData = { institutionDetails: { hasVaFacilityCode: false } };
    const hideData = { institutionDetails: { hasVaFacilityCode: true } };

    expect(nameAddrPage.depends(showData)).to.be.true;
    expect(nameAddrPage.depends(hideData)).to.be.false;
  });

  it('defaultDefinitions includes common schema pieces', () => {
    const defs = formConfig.defaultDefinitions;
    ['fullName', 'ssn', 'date', 'dateRange', 'usaPhone'].forEach(key =>
      expect(defs).to.have.property(key),
    );
  });
});
