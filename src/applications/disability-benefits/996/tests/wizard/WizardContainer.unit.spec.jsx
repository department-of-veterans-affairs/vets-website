import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import { WIZARD_STATUS } from 'applications/static-pages/wizard';
import WizardContainer from '../../wizard/WizardContainer';

describe('<WizardContainer>', () => {
  const setWizardStatus = value => {
    sessionStorage.setItem(WIZARD_STATUS, value);
  };

  it('should render', () => {
    window.sessionStorage.removeItem(WIZARD_STATUS);
    const tree = shallow(<WizardContainer setWizardStatus={setWizardStatus} />);
    expect(tree.find('.wizard-container')).to.have.lengthOf(1);
    expect(tree.find('Connect(Wizard)')).to.have.lengthOf(1);
    tree.unmount();
  });
});
