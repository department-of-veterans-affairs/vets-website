import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import AppealListItemV2 from '../../../../src/js/claims-status/components/appeals-v2/AppealListItemV2';
import _ from 'lodash/fp';

describe('<AppealListItemV2/>', () => {
  const defaultProps = {
    appeal: {
      attributes: {
        status: {
          type: 'pending_form9',
          details: {}
        },
        events: [
          {
            type: 'claim_decision',
            date: '2016-05-01'
          },
          {
            type: 'merged',
            date: '2015-06-04'
          }
        ],
        programArea: 'compensation',
        active: true
      }
    }
  };

  it('should render', () => {
    const wrapper = shallow(<AppealListItemV2 {...defaultProps}/>);
    expect(wrapper.type()).to.equal('div');
  });

  it('should append open class to status-circle div when status active', () => {
    const wrapper = shallow(<AppealListItemV2 {...defaultProps}/>);
    expect(wrapper.find('div.open').length).to.equal(1);
    expect(wrapper.find('div.closed').length).to.equal(0);
  });

  it('should append closed class to status-circle div when status inactive', () => {
    const closedProps = _.set('appeal.attributes.active', false, defaultProps);
    const wrapper = shallow(<AppealListItemV2 {...closedProps}/>);
    expect(wrapper.find('div.closed').length).to.equal(1);
    expect(wrapper.find('div.open').length).to.equal(0);
  });

  it('shows the right date in the header', () => {
    const wrapper = shallow(<AppealListItemV2 {...defaultProps}/>);
    expect(wrapper.find('h3.claim-list-item-header-v2').render().text()).to.contain('May 1, 2016');
  });
});
