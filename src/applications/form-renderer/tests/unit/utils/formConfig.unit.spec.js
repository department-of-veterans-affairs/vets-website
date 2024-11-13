/* eslint-disable prefer-destructuring */

import React from 'react';
import PropTypes from 'prop-types';
import { expect } from 'chai';
import sinon from 'sinon';
import * as IntroductionPage from 'applications/form-renderer/containers/IntroductionPage';
import { render } from '@testing-library/react';
import * as digitalFormPatterns from 'applications/form-renderer/utils/digitalFormPatterns';
import { normalizedForm } from '../../../_config/formConfig';
import { createFormConfig, selectSchemas } from '../../../utils/formConfig';
import manifest from '../../../manifest.json';

const [yourPersonalInfo, address, phoneAndEmail] = normalizedForm.chapters;

describe('createFormConfig', () => {
  let formConfig;
  let identificationSpy;
  let nameSpy;
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

    identificationSpy = sinon.spy(
      digitalFormPatterns,
      'digitalFormIdentificationInfo',
    );
    nameSpy = sinon.spy(digitalFormPatterns, 'digitalFormNameAndDoB');

    formConfig = createFormConfig(normalizedForm);
  });

  afterEach(() => {
    stub.restore();
    identificationSpy.restore();
    nameSpy.restore();
  });

  it('returns a properly formatted Form Config object', () => {
    expect(formConfig.rootUrl).to.eq(`${manifest.rootUrl}/2121212`);
    expect(formConfig.urlPrefix).to.eq(`/2121212/`);
    expect(formConfig.trackingPrefix).to.eq('2121212-');
    expect(formConfig.title).to.eq('Form with Two Steps');
    expect(formConfig.formId).to.eq('2121212');
    expect(formConfig.subTitle).to.eq('VA Form 2121212');
    expect(Object.keys(formConfig.chapters).length).to.eq(
      normalizedForm.chapters.length,
    );
  });

  it('properly formats each chapter', () => {
    const testChapter = formConfig.chapters.chapter161344;
    const page = testChapter.pages[161344];

    expect(testChapter.title).to.eq(address.chapterTitle);
    expect(Object.keys(testChapter.pages).length).to.eq(1);
    expect(page.path).to.eq('161344');
    expect(page.title).to.eq(address.pageTitle);
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

  it('returns a personal information chapter', () => {
    const [nameAndDob, identificationInfo] = yourPersonalInfo.pages;

    expect(formConfig.chapters.personalInformationChapter.title).to.eq(
      yourPersonalInfo.chapterTitle,
    );

    expect(identificationSpy.calledWith(identificationInfo)).to.eq(true);
    expect(nameSpy.calledWith(nameAndDob)).to.eq(true);
  });
});

describe('selectSchemas', () => {
  let spy;

  context('with Address pattern', () => {
    beforeEach(() => {
      spy = sinon.spy(digitalFormPatterns, 'digitalFormAddress');
    });

    it('calls digitalFormAddress', () => {
      selectSchemas(address);

      expect(spy.calledWith(address)).to.eq(true);
    });
  });

  context('with Phone and Email Address pattern', () => {
    beforeEach(() => {
      spy = sinon.spy(digitalFormPatterns, 'digitalFormPhoneAndEmail');
    });

    it('calls digitalFormPhoneAndEmail', () => {
      selectSchemas(phoneAndEmail);

      expect(spy.calledWith(phoneAndEmail)).to.eq(true);
    });
  });
});
