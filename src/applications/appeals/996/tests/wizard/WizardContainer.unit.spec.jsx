import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import { $ } from 'platform/forms-system/src/js/utilities/ui';

import { WIZARD_STATUS } from '../../constants';
import { WizardContainer } from '../../wizard/WizardContainer';
import { setHlrWizardStatus } from '../../wizard/utils';

describe('<WizardContainer>', () => {
  it('should render', () => {
    sessionStorage.removeItem(WIZARD_STATUS);
    const { container } = render(
      <WizardContainer setWizardStatus={setHlrWizardStatus} />,
    );
    expect($('.wizard-container', container)).to.exist;
  });
});
