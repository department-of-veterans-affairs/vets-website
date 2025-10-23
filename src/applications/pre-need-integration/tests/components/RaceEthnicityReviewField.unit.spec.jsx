import React from 'react';
import chai from 'chai';
import { shallow } from 'enzyme';
import RaceEthnicityReviewField from '../../components/RaceEthnicityReviewField';

describe('RaceEthnicityReviewField', () => {
  it('should render race categories if reviewMode is false', () => {
    const props = {
      formContext: { reviewMode: false },
      uiSchema: {},
      schema: {},
      formData: {},
      registry: { fields: { ObjectField: () => null } },
    };
    const wrapper = shallow(<RaceEthnicityReviewField {...props} />);
    const objectField = wrapper.find(props.registry.fields.ObjectField);
    chai.expect(objectField).to.have.lengthOf(1);
    wrapper.unmount();
  });

  it('should render categories in reviewMode', () => {
    const props = {
      formContext: { reviewMode: true },
      uiSchema: {
        'ui:title':
          'Which categories best describe you? (You may check more than one)',
        prop1: { 'ui:title': 'Asian' },
        prop2: { 'ui:title': 'White' },
      },
      schema: {
        properties: {
          prop1: { type: 'string' },
          prop2: { type: 'string' },
        },
      },
      formData: { prop1: 'value1', prop2: 'value2' },
      registry: { fields: { ObjectField: () => null } },
    };
    const wrapper = shallow(<RaceEthnicityReviewField {...props} />);
    const reviewRows = wrapper.find('.review-row');
    chai.expect(reviewRows).to.have.lengthOf(3);
    chai
      .expect(
        reviewRows
          .at(0)
          .find('dt')
          .text(),
      )
      .to.equal(
        'Which categories best describe you? (You may check more than one)',
      );
    chai
      .expect(
        reviewRows
          .at(1)
          .find('dd')
          .text(),
      )
      .to.equal('Asian');
    chai
      .expect(
        reviewRows
          .at(2)
          .find('dd')
          .text(),
      )
      .to.equal('White');
    wrapper.unmount();
  });

  it('should not render empty categories in reviewMode', () => {
    const props = {
      formContext: { reviewMode: true },
      uiSchema: {
        'ui:title':
          'Which categories best describe you? (You may check more than one)',
        prop1: { 'ui:title': 'White' },
        prop2: { 'ui:title': 'Asian' },
      },
      schema: {
        properties: {
          prop1: { type: 'string' },
          prop2: { type: 'string' },
        },
      },
      formData: { prop1: 'value1' },
      registry: { fields: { ObjectField: () => null } },
    };
    const wrapper = shallow(<RaceEthnicityReviewField {...props} />);
    const reviewRows = wrapper.find('.review-row');
    chai.expect(reviewRows).to.have.lengthOf(2);
    chai
      .expect(
        reviewRows
          .at(0)
          .find('dt')
          .text(),
      )
      .to.equal(
        'Which categories best describe you? (You may check more than one)',
      );
    chai
      .expect(
        reviewRows
          .at(1)
          .find('dd')
          .text(),
      )
      .to.equal('White');
    wrapper.unmount();
  });
});
