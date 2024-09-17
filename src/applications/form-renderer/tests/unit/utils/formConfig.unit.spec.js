/* eslint-disable prefer-destructuring */

import React from 'react';
import PropTypes from 'prop-types';
import { expect } from 'chai';
import sinon from 'sinon';
import * as IntroductionPage from 'applications/form-renderer/containers/IntroductionPage';
import { render } from '@testing-library/react';
import { normalizedForm } from '../../../_config/formConfig';
import { createFormConfig } from '../../../utils/formConfig';
import manifest from '../../../manifest.json';

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

    formConfig = createFormConfig(normalizedForm);
  });

  afterEach(() => {
    stub.restore();
  });

  it('returns a properly formatted Form Config object', () => {
    expect(formConfig.rootUrl).to.eq(`${manifest.rootUrl}/2121212`);
    expect(formConfig.urlPrefix).to.eq(`/2121212/`);
    expect(formConfig.trackingPrefix).to.eq('2121212-');
    expect(formConfig.title).to.eq('Form with Two Steps');
    expect(formConfig.formId).to.eq('2121212');
    expect(formConfig.subTitle).to.eq('VA Form 2121212');
    expect(Object.keys(formConfig.chapters).length).to.eq(2);
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

  context('with Name and Date of Birth pattern', () => {
    let dobIncluded;
    let nameOnly;

    beforeEach(() => {
      dobIncluded = formConfig.chapters[158253].pages[158253];
      nameOnly = formConfig.chapters[158254].pages[158254];
    });

    it('contains fullName', () => {
      expect(dobIncluded.schema.properties.fullName).to.not.eq(undefined);
      expect(dobIncluded.uiSchema.fullName).to.not.eq(undefined);
    });

    context('when includeDateOfBirth is true', () => {
      it('contains dateOfBirth', () => {
        expect(dobIncluded.schema.properties.dateOfBirth).to.not.eq(undefined);
        expect(dobIncluded.uiSchema.dateOfBirth).to.not.eq(undefined);
      });
    });

    context('when includeDateOfBirth is false', () => {
      it('does not contain dateOfBirth', () => {
        expect(nameOnly.schema.properties.dateOfBirth).to.eq(undefined);
        expect(nameOnly.uiSchema.dateOfBirth).to.eq(undefined);
      });
    });
  });
});
