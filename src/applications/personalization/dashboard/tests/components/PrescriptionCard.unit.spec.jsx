import React from 'react';
import moment from 'moment';
import { shallow } from 'enzyme';
import { expect } from 'chai';

import PrescriptionCard from '../../components/PrescriptionCard';

describe('<PrescriptionCard />', () => {
  it('should display name and status', () => {
    const prescription = {
      attributes: {
        prescriptionName: 'Test name',
        isTrackable: false,
        refillDate: '2018-03-28T12:00:00.000Z',
        refillSubmitDate: '2019-05-28T12:00:00.000Z',
      },
    };

    const wrapper = shallow(<PrescriptionCard prescription={prescription} />);

    expect(wrapper.find('h3').text()).to.equal(
      prescription.attributes.prescriptionName,
    );
    expect(
      wrapper
        .find('p')
        .first()
        .text(),
    ).to.contain('We’re working to fill your prescription');
    expect(
      wrapper
        .find('p')
        .at(1)
        .text(),
    ).to.contain('05/28/2019');

    wrapper.unmount();
  });

  it('should display shipped status', () => {
    const prescription = {
      attributes: {
        prescriptionName: 'Test name',
        isTrackable: true,
        refillDate: '2018-03-28T12:00:00.000Z',
        refillSubmitDate: '2019-05-28T12:00:00.000Z',
      },
    };

    const wrapper = shallow(<PrescriptionCard prescription={prescription} />);

    expect(
      wrapper
        .find('p')
        .first()
        .text(),
    ).to.contain('We’ve shipped your order');

    wrapper.unmount();
  });

  it('should fall back to past refill date', () => {
    const prescription = {
      attributes: {
        prescriptionName: 'Test name',
        isTrackable: false,
        refillDate: '2018-03-28T12:00:00.000Z',
        refillSubmitDate: null,
      },
    };

    const wrapper = shallow(<PrescriptionCard prescription={prescription} />);
    expect(
      wrapper
        .find('p')
        .at(1)
        .text(),
    ).to.contain('03/28/2018');

    wrapper.unmount();
  });

  it('should hide date if in the future', () => {
    const prescription = {
      attributes: {
        prescriptionName: 'Test name',
        isTrackable: false,
        refillDate: moment()
          .add(3, 'days')
          .toISOString(),
        refillSubmitDate: null,
      },
    };

    const wrapper = shallow(<PrescriptionCard prescription={prescription} />);
    expect(wrapper.find('p').length).to.equal(1);

    wrapper.unmount();
  });
});
