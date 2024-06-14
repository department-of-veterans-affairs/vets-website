import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import set from 'platform/utilities/data/set'; // it doesn't look like this is exported by platform-utilities

import AppealListItem from '../../../components/appeals-v2/AppealListItem';
import { STATUS_TYPES, EVENT_TYPES } from '../../../utils/appeals-v2-helpers';

describe('<AppealListItem>', () => {
  const defaultProps = {
    appeal: {
      id: 1234,
      type: 'legacyAppeal',
      attributes: {
        status: {
          type: STATUS_TYPES.pendingForm9,
          details: {},
        },
        events: [
          {
            type: EVENT_TYPES.nod,
            date: '2016-05-01',
          },
        ],
        // These should really be objects, but AppealListItem doesn't really care
        issues: ["I'm an issue!", 'So am I!'],
        description: 'Description here.',
        programArea: 'compensation',
        active: true,
      },
    },
  };
  const vhaScProps = {
    appeal: {
      id: 1234,
      type: 'supplementalClaim',
      attributes: {
        status: {
          type: STATUS_TYPES.scReceived,
          details: {},
        },
        events: [
          {
            type: EVENT_TYPES.scRequest,
            date: '2016-05-01',
          },
        ],
        // These should really be objects, but AppealListItem doesn't really care
        issues: ["I'm an issue!", 'So am I!'],
        description: 'Description here.',
        programArea: 'medical',
        active: true,
      },
    },
  };

  it('should render', () => {
    const wrapper = shallow(<AppealListItem {...defaultProps} />);
    expect(wrapper.name()).to.equal('ClaimCard');
    wrapper.unmount();
  });

  it('should show the right date with submitted on', () => {
    const wrapper = shallow(<AppealListItem {...defaultProps} />);
    expect(
      wrapper
        .find('ClaimCard')
        .shallow()
        .find('.submitted-on')
        .text(),
    ).to.equal('Received on May 1, 2016');
    wrapper.unmount();
  });

  it('should correctly title a VHA Supplemental Claim', () => {
    const wrapper = shallow(<AppealListItem {...vhaScProps} />);
    expect(
      wrapper
        .find('ClaimCard')
        .shallow()
        .find('.claim-list-item-header')
        .text(),
    ).to.contain('Supplemental claim for health care');
    wrapper.unmount();
  });

  it('should say "issue" if there is only one issue on appeal', () => {
    const props = set(
      'appeal.attributes.issues',
      ["I'm an issue!"],
      defaultProps,
    );
    const wrapper = shallow(<AppealListItem {...props} />);
    const issuesText = wrapper
      .find('.card-status > p')
      .first()
      .text();
    expect(issuesText).to.contain('Issue');
    expect(issuesText).to.not.contain('Issues');
    wrapper.unmount();
  });

  it('should say "issues" if there are multiple issues on appeal', () => {
    const wrapper = shallow(<AppealListItem {...defaultProps} />);
    const issuesText = wrapper
      .find('.card-status > p')
      .first()
      .text();
    expect(issuesText).to.contain('Issues');
    wrapper.unmount();
  });

  it('should say "review" if the appeal is a Supplemental Claim', () => {
    const wrapper = shallow(<AppealListItem {...vhaScProps} />);
    const issuesText = wrapper
      .find('.card-status > p')
      .first()
      .text();
    expect(issuesText).to.contain('review');
    wrapper.unmount();
  });

  it('should create a link to the appeal status page', () => {
    const wrapper = shallow(<AppealListItem {...defaultProps} />);
    const linkProps = wrapper
      .find('ClaimCardLink')
      .first()
      .props();
    expect(linkProps.href).to.equal(
      `/appeals/${defaultProps.appeal.id}/status`,
    );
    wrapper.unmount();
  });

  it('should not show the issue text if no description is given', () => {
    const props = set('appeal.attributes.description', undefined, defaultProps);
    const wrapper = shallow(<AppealListItem {...props} />);
    expect(
      wrapper
        .find('.card-status > p')
        .first()
        .text(),
    ).to.not.contain('Description here.');
    wrapper.unmount();
  });

  it('should show the issue text if a description is given', () => {
    const wrapper = shallow(<AppealListItem {...defaultProps} />);
    expect(
      wrapper
        .find('.card-status > p')
        .first()
        .text(),
    ).to.contain('Description here.');
    wrapper.unmount();
  });

  it('should mask appeal issues in DataDog (no PII)', () => {
    const wrapper = shallow(<AppealListItem {...defaultProps} />);

    expect(
      wrapper
        .find('.masked-issue')
        .first()
        .props()['data-dd-privacy'],
    ).to.equal('mask');
    wrapper.unmount();
  });
});
