import React from 'react';
import { Link } from 'react-router';
import { shallow } from 'enzyme';
import { expect } from 'chai';

import ReasonForAppointmentSection from '../../components/review/ReasonForAppointmentSection';

const data = {
  reasonForAppointment: 'routine-follow-up',
  reasonAdditionalInfo: 'additional information',
};

describe('VAOS <ReasonForAppointmentSection>', () => {
  describe('VA direct and requests', () => {
    let tree;

    beforeEach(() => {
      tree = shallow(<ReasonForAppointmentSection data={data} />);
    });

    afterEach(() => {
      tree.unmount();
    });

    it('should render heading', () => {
      expect(tree.find('h3').text()).to.equal('Follow-up/Routine');
    });

    it('should render reason for appointment section additional information', () => {
      expect(tree.find('span').text()).to.equal('additional information');
    });

    it('should have aria labels for edit purpose of appointment', () => {
      expect(
        tree.find(Link).find('[aria-label="Edit purpose of appointment"]'),
      ).to.have.lengthOf(1);
    });

    it('contain class that breaks long comments', () => {
      expect(tree.find('.vaos-u-word-break--break-word').exists()).to.be.true;
    });
  });

  describe('community care', () => {
    it('should return null if no reasonForAppointent and no reasonAdditionalInfo', () => {
      const tree = shallow(
        <ReasonForAppointmentSection
          data={{ reasonAdditionalInfo: 'additional information' }}
        />,
      );
      expect(tree.find('h3').text()).to.equal('Additional details');
      expect(tree.find('span').text()).to.equal('additional information');
      tree.unmount();
    });

    it('should return null if no reasonForAppointent and no reasonAdditionalInfo', () => {
      const tree = shallow(<ReasonForAppointmentSection data={{}} />);
      expect(tree.isEmptyRender()).to.equal(true);
      tree.unmount();
    });
  });
});
