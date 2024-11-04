/* eslint-disable prefer-destructuring */

import React from 'react';
import PropTypes from 'prop-types';
import { expect } from 'chai';
import sinon from 'sinon';
import { render } from '@testing-library/react';
import * as webComponentPatterns from 'platform/forms-system/src/js/web-component-patterns';
import * as addressPatterns from 'platform/forms-system/src/js/web-component-patterns/addressPattern';
import * as IntroductionPage from '../../../containers/IntroductionPage';
import { normalizedForm } from '../../../_config/formConfig';
import { createFormConfig, selectSchemas } from '../../../utils/formConfig';

describe('createFormConfig', () => {
  let formConfig;
  let stub;

  beforeEach(() => {
    const FakeComponent = ({ ombInfo }) => (
      <div>
        <p data-testid="exp-date">expDate: {ombInfo.expDate}</p>
        <p data-testid="omb-number">ombNumber: {ombInfo.ombNumber}</p>
        <p data-testid="res-burden">resBurden: {ombInfo.resBurden}</p>
      </div>
    );

    FakeComponent.propTypes = {
      ombInfo: PropTypes.shape({
        expDate: PropTypes.string,
        ombNumber: PropTypes.number,
        resBurden: PropTypes.string,
      }),
    };
    stub = sinon.stub(IntroductionPage, 'default').callsFake(FakeComponent);

    formConfig = createFormConfig(normalizedForm, {
      rootUrl: '/root-url',
      trackingPrefix: 'tracking-prefix-',
    });
  });

  afterEach(() => {
    stub.restore();
  });

  it('returns a properly formatted Form Config object', () => {
    expect(formConfig.rootUrl).to.eq('/root-url');
    expect(formConfig.urlPrefix).to.eq(`/`);
    expect(formConfig.trackingPrefix).to.eq('tracking-prefix-');
    expect(formConfig.title).to.eq('Form with Two Steps');
    expect(formConfig.formId).to.eq('2121212');
    expect(formConfig.subTitle).to.eq('VA Form 2121212');
    expect(Object.keys(formConfig.chapters).length).to.eq(
      normalizedForm.chapters.length,
    );
  });

  it('properly formats each chapter', () => {
    const testChapter = formConfig.chapters[158253];
    const page = testChapter.pages[158253];

    expect(testChapter.title).to.eq('First Step');
    expect(Object.keys(testChapter.pages).length).to.eq(1);
    expect(page.path).to.eq('158253');
    expect(page.title).to.eq('Name and Date of Birth');
    expect(page.schema).not.to.eq(undefined);
    expect(page.uiSchema['ui:title']).not.to.eq(undefined);
  });

  it('sends ombInfo to the Introduction Page', () => {
    const screen = render(formConfig.introduction());

    expect(screen.getByTestId('exp-date')).to.have.text(
      `expDate: ${normalizedForm.ombInfo.expDate}`,
    );
    expect(screen.getByTestId('omb-number')).to.have.text(
      `ombNumber: ${normalizedForm.ombInfo.ombNumber}`,
    );
    expect(screen.getByTestId('res-burden')).to.have.text(
      `resBurden: ${normalizedForm.ombInfo.resBurden}`,
    );
  });
});

describe('selectSchemas', () => {
  const findChapterByType = type =>
    normalizedForm.chapters.find(chapter => chapter.type === type);

  context('with Name and Date of Birth pattern', () => {
    let dobIncluded;

    beforeEach(() => {
      dobIncluded = selectSchemas(
        findChapterByType('digital_form_name_and_date_of_bi'),
      );
    });

    it('contains fullName', () => {
      expect(dobIncluded.schema.properties.fullName).to.eq(
        webComponentPatterns.fullNameSchema,
      );
      expect(dobIncluded.uiSchema.fullName).to.not.eq(undefined);
    });

    context('when includeDateOfBirth is true', () => {
      it('contains dateOfBirth', () => {
        expect(dobIncluded.schema.properties.dateOfBirth).to.eq(
          webComponentPatterns.dateOfBirthSchema,
        );
        expect(dobIncluded.uiSchema.dateOfBirth).to.not.eq(undefined);
      });
    });

    context('when includeDateOfBirth is false', () => {
      it('does not contain dateOfBirth', () => {
        const nameOnlyChapter = {
          id: 158254,
          chapterTitle: 'Name only chapter',
          type: 'digital_form_name_and_date_of_bi',
          pageTitle: 'Name and Date of Birth',
          additionalFields: {
            includeDateOfBirth: false,
          },
        };
        const nameOnly = selectSchemas(nameOnlyChapter);

        expect(nameOnly.schema.properties.dateOfBirth).to.eq(undefined);
        expect(nameOnly.uiSchema.dateOfBirth).to.eq(undefined);
      });
    });
  });

  context('with Identification Information pattern', () => {
    let vetIdOnly;

    beforeEach(() => {
      vetIdOnly = selectSchemas(
        findChapterByType('digital_form_identification_info'),
      );
    });

    it('contains veteranId', () => {
      expect(vetIdOnly.schema.properties.veteranId).to.eq(
        webComponentPatterns.ssnOrVaFileNumberSchema,
      );
      expect(vetIdOnly.uiSchema.veteranId).to.not.eq(undefined);
    });

    context('when includeServiceNumber is true', () => {
      it('includes serviceNumber', () => {
        const serviceNumberChapter = {
          id: 158255,
          chapterTitle: 'Service Number Included',
          type: 'digital_form_identification_info',
          pageTitle: 'Identification Information',
          additionalFields: {
            includeServiceNumber: true,
          },
        };
        const serviceNumberIncluded = selectSchemas(serviceNumberChapter);

        expect(serviceNumberIncluded.schema.properties.serviceNumber).to.eq(
          webComponentPatterns.serviceNumberSchema,
        );
        expect(serviceNumberIncluded.uiSchema.serviceNumber).to.not.eq(
          undefined,
        );
      });
    });

    context('when includeServiceNumber is false', () => {
      it('does not include serviceNumber', () => {
        expect(vetIdOnly.schema.properties.serviceNumber).to.eq(undefined);
        expect(vetIdOnly.uiSchema.serviceNumber).to.eq(undefined);
      });
    });
  });

  context('with Address pattern', () => {
    let addressSpy;
    let noMiliarySpy;

    beforeEach(() => {
      addressSpy = sinon.spy(addressPatterns, 'addressSchema');
      noMiliarySpy = sinon.spy(addressPatterns, 'addressNoMilitarySchema');
    });

    afterEach(() => {
      addressSpy.restore();
      noMiliarySpy.restore();
    });

    context('when militaryAddressCheckbox is true', () => {
      it('calls addressSchema', () => {
        const includeMilitary = {
          id: 158256,
          chapterTitle: 'Includes military addresses',
          type: 'digital_form_address',
          pageTitle: 'Address',
          additionalFields: {
            militaryAddressCheckbox: true,
          },
        };
        const schemas = selectSchemas(includeMilitary);

        expect(addressSpy.calledOnce).to.eq(true);
        expect(schemas.uiSchema.address).to.not.eq(undefined);
      });
    });

    context('when militaryAddressCheckbo is false', () => {
      it('calls addressNoMilitarySchema', () => {
        const schemas = selectSchemas(
          findChapterByType('digital_form_address'),
        );

        expect(noMiliarySpy.calledOnce).to.eq(true);
        expect(schemas.uiSchema.address).to.not.eq(undefined);
      });
    });
  });

  context('with Phone and Email Address pattern', () => {
    const includeEmail = {
      id: 158256,
      chapterTitle: 'Email address included',
      type: 'digital_form_phone_and_email',
      pageTitle: 'Phone and email address',
      additionalFields: {
        includeEmail: true,
      },
    };
    const phoneOnly = findChapterByType('digital_form_phone_and_email');

    it('includes homePhone', () => {
      const schemas = selectSchemas(includeEmail);

      expect(schemas.schema.properties.homePhone).to.eq(
        webComponentPatterns.phoneSchema,
      );
      expect(schemas.uiSchema.homePhone).to.not.eq(undefined);
    });

    it('includes mobilePhone', () => {
      const schemas = selectSchemas(phoneOnly);

      expect(schemas.schema.properties.mobilePhone).to.eq(
        webComponentPatterns.phoneSchema,
      );
      expect(schemas.uiSchema.mobilePhone).to.not.eq(undefined);
    });

    context('when includeEmail is true', () => {
      it('includes emailAddress', () => {
        const schemas = selectSchemas(includeEmail);

        expect(schemas.schema.properties.emailAddress).to.eq(
          webComponentPatterns.emailSchema,
        );
        expect(schemas.uiSchema.emailAddress).to.not.eq(undefined);
      });
    });

    context('when includeEmail is false', () => {
      it('does not include emailAddress', () => {
        const schemas = selectSchemas(phoneOnly);

        expect(schemas.schema.properties.emailAddress).to.eq(undefined);
        expect(schemas.uiSchema.emailAddress).to.eq(undefined);
      });
    });
  });
});
