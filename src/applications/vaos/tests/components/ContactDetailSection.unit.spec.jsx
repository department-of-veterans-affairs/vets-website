import React from 'react';
import { Link } from 'react-router';
import { shallow } from 'enzyme';
import { expect } from 'chai';

import ContactDetailSection from '../../components/review/ContactDetailSection';

const data = {
  email: 'joeblow@gmail.com',
  phoneNumber: '123456789',
};

describe('VAOS <ContactDetailSection>', () => {
  describe('information', () => {
    let tree;

    beforeEach(() => {
      tree = shallow(<ContactDetailSection data={data} />);
    });

    afterEach(() => {
      tree.unmount();
    });

    it('should render heading', () => {
      expect(tree.find('h3').text()).to.equal('Your contact details');
    });

    it('should render reason for appointment section additional information', () => {
      expect(tree.find('span').text()).to.equal(
        'joeblow@gmail.com123456789Call anytime during the day',
      );
    });

    it('should have aria labels for edit call back time', () => {
      expect(
        tree.find(Link).find('[aria-label="Edit call back time"]'),
      ).to.have.lengthOf(1);
    });
  });

  describe('best time to call', () => {
    it('should return single time', () => {
      const tree = shallow(
        <ContactDetailSection
          data={{
            bestTimeToCall: { morning: true },
          }}
        />,
      );

      expect(tree.text()).to.contain('Call morning');
      tree.unmount();
    });
    it('should return two times', () => {
      const tree = shallow(
        <ContactDetailSection
          data={{
            bestTimeToCall: { morning: true, afternoon: true },
          }}
        />,
      );

      expect(tree.text()).to.contain('Call morning or afternoon');
      tree.unmount();
    });
    it('should return message for all times', () => {
      const tree = shallow(
        <ContactDetailSection
          data={{
            bestTimeToCall: { morning: true, afternoon: true, evening: true },
          }}
        />,
      );

      expect(tree.text()).to.contain('Call anytime during the day');
      tree.unmount();
    });
  });
});
