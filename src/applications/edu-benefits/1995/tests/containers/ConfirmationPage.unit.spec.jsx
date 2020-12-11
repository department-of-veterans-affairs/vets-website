import React from 'react';
import { expect } from 'chai';
import SkinDeep from 'skin-deep';

import { ConfirmationPage } from '../../containers/ConfirmationPage';
import { shallow } from 'enzyme';
import {
  ConfirmationGuidance,
  ConfirmationPageSummary,
  ConfirmationPageTitle,
  ConfirmationReturnHome,
} from '../../../components/ConfirmationPage';

const form = {
  submission: {
    response: {
      attributes: {},
    },
  },
  data: {
    veteranFullName: {
      first: 'Jane',
      last: 'Doe',
    },
    benefit: 'chapter30',
  },
};

describe('<ConfirmationPage>', () => {
  it('should render', () => {
    const tree = shallow(<ConfirmationPage form={form} />);
    expect(tree).to.not.be.undefined;
    expect(tree.find(ConfirmationPageTitle)).to.not.be.undefined;
    expect(tree.find(ConfirmationPageSummary)).to.not.be.undefined;
    expect(tree.find(ConfirmationGuidance)).to.not.be.undefined;
    expect(tree.find(ConfirmationReturnHome)).to.not.be.undefined;

    tree.unmount();
  });

  it('should expand documents', () => {
    const tree = SkinDeep.shallowRender(<ConfirmationPage form={form} />);

    // Check to see that div.usa-accordion-content doesn't exist
    expect(tree.subTree('.usa-accordion-content')).to.be.false;

    tree.getMountedInstance().toggleExpanded({ preventDefault: f => f });

    // Check to see that div.usa-accordion-content exists after expanding
    expect(tree.subTree('.usa-accordion-content')).to.be.an('object');
  });
});
