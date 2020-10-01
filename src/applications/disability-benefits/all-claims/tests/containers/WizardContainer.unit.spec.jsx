import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import WizardContainer from '../../containers/WizardContainer';
import { WIZARD_STATUS_COMPLETE } from 'applications/static-pages/wizard';

describe('Wizard Container', () => {
  global.status = '';
  const props = {
    setWizardStatus: value => {
      global.status = value;
    },
  };

  it('should render', () => {
    const tree = shallow(<WizardContainer {...props} />);
    expect(tree.find('h1')).to.have.lengthOf(1);
    expect(tree.find('.wizard-container')).to.have.lengthOf(1);
    expect(tree.find('FormFooter')).to.have.lengthOf(1);
    tree.unmount();
  });
  it('should update wizard status on bypass click', () => {
    global.status = '';
    const tree = shallow(<WizardContainer {...props} />);
    tree.find('.va-button-link').simulate('click', {
      preventDefault: () => {},
    });
    expect(tree.find('.wizard-container')).to.have.lengthOf(1);
    expect(global.status).to.equal(WIZARD_STATUS_COMPLETE);
    tree.unmount();
  });
});
