import React from 'react';
import moment from 'moment';
import sinon from 'sinon';
import { shallow } from 'enzyme';
import { expect } from 'chai';

import RatedDisabilityList from '../../components/RatedDisabilityList';
import RatedDisabilityListItem from '../../components/RatedDisabilityListItem';

describe('<RatedDisabilityList/>', () => {
  const ratedDisabilities = {
    ratedDisabilities: [
      {
        decisionCode: 'SVCCONNECTED',
        decisionText: 'Service Connected',
        diagnosticCode: 5238,
        effectiveDate: '2008-10-01T05:00:00.000+00:00',
        name: 'Diabetes mellitus0',
        ratedDisabilityId: '0',
        ratingDecisionId: '63655',
        ratingPercentage: 100,
        relatedDisabilityDate: '2012-03-09T21:22:09.000+00:00',
        specialIssues: [
          {
            code: 'TRM',
            name: 'Personal Trauma PTSD',
          },
        ],
      },
    ],
  };
  const fetchRatedDisabilities = () => {};
  it('should render', () => {
    const stub = sinon.stub(RatedDisabilityList.prototype, 'componentDidMount');
    const wrapper = shallow(
      <RatedDisabilityList
        fetchRatedDisabilities={fetchRatedDisabilities}
        ratedDisabilities={ratedDisabilities}
        componentDidMount={stub}
      />,
    );
    expect(
      wrapper
        .find('div')
        .first()
        .hasClass('vads-l-row'),
    ).to.be.true;
    expect(stub.calledOnce).to.be.true;
    wrapper.unmount();
  });
  it('should convert disability data into a readable format', () => {
    const wrapper = shallow(
      <RatedDisabilityList
        fetchRatedDisabilities={fetchRatedDisabilities}
        ratedDisabilities={ratedDisabilities}
      />,
    );
    const instance = wrapper.instance();
    const date = moment(
      ratedDisabilities.ratedDisabilities[0].effectiveDate,
    ).format('DD/MM/YYYY');
    const relatedTo =
      ratedDisabilities.ratedDisabilities[0].specialIssues[0].name;
    const data = instance.formalizeData(ratedDisabilities.ratedDisabilities);
    expect(data[0].relatedTo).to.equal(relatedTo);
    expect(data[0].effectiveDate).to.equal(date);
    wrapper.unmount();
  });

  it('should render a rated disabilities list', () => {
    const spy = sinon.spy(RatedDisabilityList.prototype, 'formalizeData');
    const wrapper = shallow(
      <RatedDisabilityList
        fetchRatedDisabilities={fetchRatedDisabilities}
        ratedDisabilities={ratedDisabilities}
      />,
    );
    const disability = ratedDisabilities.ratedDisabilities[0].name;
    // shallow render the child component.
    const list = wrapper.find(RatedDisabilityListItem).shallow();
    expect(
      wrapper
        .find('h3')
        .first()
        .text(),
    ).to.contain('Individual disability ratings');
    expect(
      list
        .find('p')
        .first()
        .text(),
    ).to.contain(disability);
    expect(spy.calledOnce).to.be.true;
    wrapper.unmount();
  });

  it('should display an alert when an error is received from the api', () => {
    const ratedDisabilitiesErr = {
      errors: [
        {
          code: '500',
        },
      ],
    };
    const spy = sinon.spy(
      RatedDisabilityList.prototype,
      'noDisabilityRatingContent',
    );
    const wrapper = shallow(
      <RatedDisabilityList
        fetchRatedDisabilities={fetchRatedDisabilities}
        ratedDisabilities={ratedDisabilitiesErr}
      />,
    );
    expect(spy.calledOnce).to.be.true;
    wrapper.unmount();
  });
});
