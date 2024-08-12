import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import Decision from '../../../components/appeals-v2/Decision';

import { mockData } from '../../../utils/helpers';
import { AOJS } from '../../../utils/appeals-v2-helpers';

describe('<Decision/>', () => {
  const defaultProps = {
    issues: mockData.data[2].attributes.status.details.issues,
    aoj: AOJS.vba,
  };

  it('returns the right number of allowed / denied / remand items', () => {
    const wrapper = shallow(<Decision {...defaultProps} />);

    const allowedList = wrapper.find('.allowed-items ~ ul');
    const deniedList = wrapper.find('.denied-items ~ ul');
    const remandList = wrapper.find('.remand-items ~ ul');

    const allowedDisposition = defaultProps.issues.filter(
      i => i.disposition === 'allowed',
    );
    const deniedDisposition = defaultProps.issues.filter(
      i => i.disposition === 'denied',
    );
    const remandDisposition = defaultProps.issues.filter(
      i => i.disposition === 'remand',
    );

    expect(allowedList.find('li').length).to.equal(allowedDisposition.length);
    expect(deniedList.find('li').length).to.equal(deniedDisposition.length);
    expect(remandList.find('li').length).to.equal(remandDisposition.length);

    wrapper.unmount();
  });

  it('describes the decider as a reviewer if an AOJ decision', () => {
    const wrapper = shallow(<Decision {...defaultProps} />);
    expect(wrapper.text()).to.contain('The reviewer granted the following');
    wrapper.unmount();
  });

  it('describes the decider as a judge if a Board decision', () => {
    const props = {
      ...defaultProps,
      boardDecision: true,
    };
    const wrapper = shallow(<Decision {...props} />);
    expect(wrapper.text()).to.contain('The judge granted the following');
    wrapper.unmount();
  });

  it('uses legacy language if not an AMA decision', () => {
    const props = {
      ...defaultProps,
      ama: false,
    };
    const wrapper = shallow(<Decision {...props} />);
    expect(wrapper.text()).to.contain(
      'gather more evidence or to fix a mistake',
    );
    wrapper.unmount();
  });

  it('masks the issue details from datadog (no PII)', () => {
    const wrapper = shallow(<Decision {...defaultProps} />);

    const allowedList = wrapper.find('.allowed-items ~ ul');
    const deniedList = wrapper.find('.denied-items ~ ul');
    const remandList = wrapper.find('.remand-items ~ ul');

    expect(allowedList.props()['data-dd-privacy']).to.equal('mask');
    expect(deniedList.props()['data-dd-privacy']).to.equal('mask');
    expect(remandList.props()['data-dd-privacy']).to.equal('mask');

    wrapper.unmount();
  });
});
