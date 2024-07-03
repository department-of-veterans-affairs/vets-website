import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import SubmissionErrorAlert from '../../../../components/FormAlerts/SubmissionErrorAlert';

describe('CG <SubmissionErrorAlert>', () => {
  const props = {
    form: {
      submission: {
        response: undefined,
        timestamp: undefined,
      },
      data: { veteranFullName: {} },
    },
  };

  it('should render', () => {
    const view = render(<SubmissionErrorAlert {...props} />);
    const selectors = {
      wrapper: view.container.querySelector('.caregiver-error-message'),
      title: view.container.querySelector('h3'),
      download: view.container.querySelector(
        '.caregiver-application--download',
      ),
    };
    expect(selectors.wrapper).to.not.be.empty;
    expect(selectors.download).to.not.be.empty;
    expect(selectors.title).to.contain.text(
      'We didn\u2019t receive your online application',
    );
  });
});
