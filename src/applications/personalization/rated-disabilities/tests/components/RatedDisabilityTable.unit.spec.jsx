import React from 'react';
import moment from 'moment';
import sinon from 'sinon';
import { shallow } from 'enzyme';
import { expect } from 'chai';

import RatedDisabilityTable from '../../components/RatedDisabilityTable';

describe('<RatedDisabilityTable/>', () => {
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
    const stub = sinon.stub(
      RatedDisabilityTable.prototype,
      'componentDidMount',
    );
    const wrapper = shallow(
      <RatedDisabilityTable
        fetchRatedDisabilities={fetchRatedDisabilities}
        ratedDisabilities={ratedDisabilities}
        componentDidMount={stub}
      />,
    );
    expect(
      wrapper
        .find('div')
        .first()
        .hasClass('vads-u-width--full'),
    ).to.be.true;
    expect(stub.calledOnce).to.be.true;
    wrapper.unmount();
  });
  it('should convert disability data into a readable format', () => {
    const wrapper = shallow(
      <RatedDisabilityTable
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

  it('should display rated disabilities in a table', () => {
    const spy = sinon.spy(RatedDisabilityTable.prototype, 'formalizeData');
    const wrapper = shallow(
      <RatedDisabilityTable
        fetchRatedDisabilities={fetchRatedDisabilities}
        ratedDisabilities={ratedDisabilities}
      />,
    );
    // we don't need to fully test SortableTable because it has its own unit tests.
    // instead we can check the header that gets rendered in the same div,
    // and use .dive() to check the presence of data passed in to SortableTable.
    const disability = ratedDisabilities.ratedDisabilities[0].name;
    expect(
      wrapper
        .find('h2')
        .first()
        .text(),
    ).to.contain('Your rated disabilities');
    expect(
      wrapper
        .find('.va-table')
        .dive()
        .find('td')
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
      RatedDisabilityTable.prototype,
      'noDisabilityRatingContent',
    );
    const wrapper = shallow(
      <RatedDisabilityTable
        fetchRatedDisabilities={fetchRatedDisabilities}
        ratedDisabilities={ratedDisabilitiesErr}
      />,
    );
    expect(spy.calledOnce).to.be.true;
    wrapper.unmount();
  });
});
