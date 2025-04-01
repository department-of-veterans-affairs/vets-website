/* eslint-disable prefer-destructuring */

import React from 'react';
import PropTypes from 'prop-types';
import { expect } from 'chai';
import sinon from 'sinon';
import { render } from '@testing-library/react';
import * as digitalFormPatterns from '../../../utils/digitalFormPatterns';
import * as IntroductionPage from '../../../containers/IntroductionPage';
import * as submitTransform from '../../../config/submitTransformer';
import { normalizedForm } from '../../../config/formConfig';
import {
  createFormConfig,
  formatPages,
  statementOfTruthBody,
} from '../../../utils/formConfig';

const [
  yourPersonalInfo,
  address,
  phoneAndEmail,
  listLoop,
  customStep,
] = normalizedForm.chapters;

describe('createFormConfig', () => {
  let formConfig;
  let stub;
  let transformSpy;

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
    transformSpy = sinon.spy(submitTransform, 'default');

    formConfig = createFormConfig(normalizedForm, {
      rootUrl: '/root-url',
      trackingPrefix: 'tracking-prefix-',
    });
  });

  afterEach(() => {
    stub.restore();
    transformSpy.restore();
  });

  it('returns a properly formatted Form Config object', () => {
    expect(formConfig.rootUrl).to.eq('/root-url');
    expect(formConfig.urlPrefix).to.eq('/');
    expect(formConfig.trackingPrefix).to.eq('tracking-prefix-');
    expect(formConfig.title).to.eq('Multiple step form');
    expect(formConfig.formId).to.eq('2121212');
    expect(formConfig.subTitle).to.eq('Form with Two Steps (VA Form 2121212)');
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

  it('includes a statement of truth', () => {
    const statementOfTruth = formConfig.preSubmitInfo.statementOfTruth;

    expect(statementOfTruth.body).to.eq(statementOfTruthBody);
    expect(statementOfTruth.fullNamePath).to.eq('fullName');
  });

  it('includes transformForSubmit', () => {
    const form = { data: {} };

    formConfig.transformForSubmit(formConfig, form);

    expect(transformSpy.calledWith(formConfig, form)).to.eq(true);
  });

  it('does not include a custom submit', () => {
    expect(formConfig.submit).to.eq(undefined);
  });
});

describe('formatPages', () => {
  let spy;

  context('when digital_form_address', () => {
    beforeEach(() => {
      spy = sinon.spy(digitalFormPatterns, 'addressPages');
    });

    it('calls addressPages', () => {
      formatPages(address);

      expect(spy.calledWith(address)).to.eq(true);
    });
  });

  context('when digital_form_custom_step', () => {
    beforeEach(() => {
      spy = sinon.spy(digitalFormPatterns, 'customStepPages');
    });

    it('calls customStepPages', () => {
      formatPages(customStep);

      expect(spy.calledWith(customStep)).to.eq(true);
    });
  });

  context('when digital_form_phone_and_email', () => {
    beforeEach(() => {
      spy = sinon.spy(digitalFormPatterns, 'phoneAndEmailPages');
    });

    it('calls phoneAndEmailPages', () => {
      formatPages(phoneAndEmail);

      expect(spy.calledWith(phoneAndEmail)).to.eq(true);
    });
  });

  context('when digital_form_list_loop', () => {
    beforeEach(() => {
      spy = sinon.spy(digitalFormPatterns, 'listLoopPages');
    });

    it('calls listLoopPages', () => {
      formatPages(listLoop);

      expect(spy.calledWith(listLoop)).to.eq(true);
    });
  });

  context('when digital_form_your_personal_info', () => {
    beforeEach(() => {
      spy = sinon.spy(digitalFormPatterns, 'personalInfoPages');
    });

    it('calls personalInfoPages', () => {
      formatPages(yourPersonalInfo);

      expect(spy.calledWith(yourPersonalInfo)).to.eq(true);
    });
  });
});
