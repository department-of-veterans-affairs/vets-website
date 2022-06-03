import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import { WIZARD_STATUS } from '../../constants';
import { WizardContainer } from '../../wizard/WizardContainer';
import { setHlrWizardStatus } from '../../wizard/utils';

describe('<WizardContainer>', () => {
  it('should render', () => {
    sessionStorage.removeItem(WIZARD_STATUS);
    const tree = shallow(
      <WizardContainer setWizardStatus={setHlrWizardStatus} />,
    );
    expect(tree.find('.wizard-container')).to.have.lengthOf(1);
    tree.unmount();
  });
});
