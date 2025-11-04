import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';

import SectionThreePage from '../../../containers/SectionThreePage';

describe('21-4140 container/SectionThreePage', () => {
  let sandbox;
  let goBack;
  let goForward;
  let navButtonProps;
  let bodyScrollStub;
  let originalScrollTo;
  let hadScrollTo;

  const TestNavButtons = props => {
    navButtonProps = props;
    return (
      <div data-testid="nav-buttons">
        <button type="button" onClick={props.goBack}>
          Back
        </button>
        <button type="button" onClick={props.goForward}>
          Continue
        </button>
      </div>
    );
  };

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    goBack = sandbox.spy();
    goForward = sandbox.spy();
    navButtonProps = null;
    hadScrollTo = Object.prototype.hasOwnProperty.call(
      document.body,
      'scrollTo',
    );
    originalScrollTo = document.body.scrollTo;
    if (!originalScrollTo) {
      document.body.scrollTo = () => {};
      originalScrollTo = document.body.scrollTo;
    }
    bodyScrollStub = sandbox.stub(document.body, 'scrollTo');
  });

  afterEach(() => {
    sandbox.restore();
    if (hadScrollTo) {
      document.body.scrollTo = originalScrollTo;
    } else {
      delete document.body.scrollTo;
    }
  });

  it('renders the page content and wires navigation correctly', async () => {
    const { getByRole, getByText, getByTestId } = render(
      <SectionThreePage
        goBack={goBack}
        goForward={goForward}
        NavButtons={TestNavButtons}
      />,
    );

    await waitFor(() => {
      expect(bodyScrollStub.called).to.be.true;
    });

    expect(
      getByRole('heading', {
        level: 3,
        name: 'Section III: Unemployment Certification',
      }),
    ).to.exist;
    expect(
      getByText(
        'Complete this section if you did NOT work during the past 12 months.',
      ),
    ).to.exist;
    expect(getByRole('heading', { level: 4, name: 'What to expect' })).to.exist;
    expect(getByText('Review the information you provided')).to.exist;
    expect(getByText('Read the unemployment certifications')).to.exist;
    expect(getByText('Confirm you had no employment in the last 12 months')).to
      .exist;
    expect(
      getByText(
        'Confirm your disability continues to prevent gainful employment',
      ),
    ).to.exist;
    expect(getByText('Sign and date your questionnaire')).to.exist;
    expect(getByText('Takes about 1-2 minutes')).to.exist;

    const navButtons = getByTestId('nav-buttons');
    expect(navButtons).to.exist;
    expect(navButtonProps.goBack).to.equal(goBack);
    expect(navButtonProps.goForward).to.equal(goForward);
    expect(navButtonProps.submitToContinue).to.be.true;
  });
});
