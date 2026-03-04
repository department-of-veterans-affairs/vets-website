import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import LlmUploadAlert from '../../../../components/FormAlerts/LlmUploadAlert';

const TOGGLE_KEY = 'view:champvaClaimsLlmValidation';

describe('10-7959a <LlmUploadAlert>', () => {
  const subject = ({ enabled = true } = {}) => {
    const formContext = { data: { [TOGGLE_KEY]: enabled } };
    const { container } = render(<LlmUploadAlert formContext={formContext} />);
    return {
      vaAlert: container.querySelector('va-alert'),
    };
  };

  it('should render alert when the feature toggle is enabled', () => {
    const { vaAlert } = subject();
    expect(vaAlert).to.exist;
  });

  it('should render alert when the feature toggle is disabled', () => {
    const { vaAlert } = subject({ enabled: false });
    expect(vaAlert).to.not.exist;
  });
});
