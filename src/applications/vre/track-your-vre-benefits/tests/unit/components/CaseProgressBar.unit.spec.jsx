import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import sinon from 'sinon';

import * as CaseProgressDescriptionMod from '../../../components/CaseProgressDescription';
import CaseProgressBar from '../../../components/CaseProgressBar';

const sandbox = sinon.createSandbox();

describe('CaseProgressBar', () => {
  let descriptionProps;

  beforeEach(() => {
    descriptionProps = null;

    sandbox.stub(CaseProgressDescriptionMod, 'default').callsFake(props => {
      descriptionProps = props;
      return <div data-testid="case-progress-description" />;
    });
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('renders the progress bar with the expected attributes', () => {
    const attributes = { foo: 'bar' };
    const stepLabels = ['Apply', 'Eligibility', 'Orientation'];
    const stateList = [
      { status: 'COMPLETED' },
      { status: 'ACTIVE' },
      { status: 'PENDING' },
    ];

    const { container, getByTestId } = render(
      <CaseProgressBar
        current={2}
        stepLabels={stepLabels}
        stateList={stateList}
        headingText="Custom heading"
        label="Progress label"
        counters="large"
        headerLevel={3}
        attributes={attributes}
      />,
    );

    getByTestId('case-progress-description');

    const progressBar = container.querySelector('va-segmented-progress-bar');
    expect(progressBar).to.exist;
    expect(progressBar.getAttribute('counters')).to.equal('large');
    expect(progressBar.getAttribute('current')).to.equal('2');
    expect(progressBar.getAttribute('header-level')).to.equal('3');
    expect(progressBar.getAttribute('heading-text')).to.equal('Custom heading');
    expect(progressBar.getAttribute('label')).to.equal('Progress label');
    expect(progressBar.getAttribute('labels')).to.equal(
      'Apply;Eligibility;Orientation',
    );
    expect(progressBar.getAttribute('total')).to.equal('3');
    expect(descriptionProps).to.deep.equal({
      step: 2,
      attributes,
    });
  });

  it('defaults the current step status to PENDING when state data is missing', () => {
    render(<CaseProgressBar current={1} stepLabels={['Apply']} />);

    expect(descriptionProps).to.deep.equal({
      step: 1,
      attributes: {},
    });
  });
});
