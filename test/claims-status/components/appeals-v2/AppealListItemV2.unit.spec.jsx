import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import AppealListItemV2 from '../../../../src/js/claims-status/components/appeals-v2/AppealListItemV2';

describe.only('<AppealListItemV2/>', () => {
  const defaultProps = {
    appeal: {
      attributes: {
        status: {
          type: 'pending_form9',
          details: {}
        },
        events: [{
          type: 'merged',
          date: '2015-06-04'
        }],
        programArea: 'compensation',
        active: true
      }
    }
  };

  it('should render', () => {
    const wrapper = shallow(<AppealListItemV2 {...defaultProps}/>);
    expect(wrapper.type()).to.equal('div');s
  });
});
