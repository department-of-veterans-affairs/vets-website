import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { cleanup } from '@testing-library/react';
import * as featureToggles from 'platform/utilities/feature-toggles';

import LettersAndDocuments from '../../components/LettersAndDocuments';
import { PROFILE_PATH_NAMES } from '../../constants';
import { renderWithProfileReducersAndRouter as render } from '../unit-test-helpers';

describe('LettersAndDocuments', () => {
  const sandbox = sinon.createSandbox();

  beforeEach(() => {
    sandbox.stub(featureToggles, 'useFeatureToggle').returns({
      useToggleValue: sandbox.stub().returns(false),
      TOGGLE_NAMES: {},
    });
  });

  afterEach(() => {
    sandbox.restore();
    cleanup();
  });

  it('renders the page header', () => {
    const { getByText } = render(<LettersAndDocuments />);
    expect(getByText('Letters and documents')).to.exist;
  });

  it('renders the VA benefit letters and documents link', () => {
    const { container } = render(<LettersAndDocuments />);
    const link = container.querySelector(
      'va-link[text="VA benefit letters and documents"]',
    );
    expect(link).to.exist;
  });

  it('renders the Veteran Status Card link', () => {
    const { container } = render(<LettersAndDocuments />);
    const link = container.querySelector(
      `va-link[text="${PROFILE_PATH_NAMES.VETERAN_STATUS_CARD}"]`,
    );
    expect(link).to.exist;
  });

  it('sets the document title', () => {
    render(<LettersAndDocuments />);
    expect(document.title).to.include('Letters and documents');
  });
});
