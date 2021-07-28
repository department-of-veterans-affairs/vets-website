import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import WizardContainer from '../../containers/WizardContainer';
import { WIZARD_STATUS_COMPLETE } from 'platform/site-wide/wizard';

import { WIZARD_STATUS } from '../../constants';

describe('Wizard Container', () => {
  beforeEach(() => {
    sessionStorage.removeItem(WIZARD_STATUS);
  });
  afterEach(() => {
    sessionStorage.removeItem(WIZARD_STATUS);
  });

  it('should render', () => {
    const tree = shallow(<WizardContainer />);
    expect(tree.find('FormTitle')).to.have.lengthOf(1);
    expect(tree.find('.wizard-container')).to.have.lengthOf(1);
    expect(tree.find('FormFooter')).to.have.lengthOf(1);
    tree.unmount();
  });
  it('should update wizard status on bypass click', () => {
    const tree = shallow(<WizardContainer />);
    tree.find('.skip-wizard-link').simulate('click', {
      preventDefault: () => {},
    });
    expect(tree.find('.wizard-container')).to.have.lengthOf(1);
    expect(sessionStorage.getItem(WIZARD_STATUS)).to.equal(
      WIZARD_STATUS_COMPLETE,
    );
    tree.unmount();
  });
});
