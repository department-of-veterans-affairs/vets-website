import React from 'react';
import PropTypes from 'prop-types';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import * as addressUtils from '@@vap-svc/util/contact-information/addressUtils';
import {
  FIELD_NAMES,
  FIELD_TITLES,
} from '@department-of-veterans-affairs/platform-user/exports';

const TestComponent = ({ onClick }) => {
  return (
    <div>
      <p className="usa-input-error-message">Error 1</p>
      <p className="usa-input-error-message">Error 2</p>
      <p className="usa-input-error-message">Error 3</p>
      <button type="button" onClick={onClick}>
        Test Button
      </button>
    </div>
  );
};

TestComponent.propTypes = {
  onClick: PropTypes.func.isRequired,
};

const generateExpectedTitle = fieldTitle =>
  `Address Validation Errors - ${fieldTitle}`;

const generateExpectedStatus = errorCount => `Error Count - ${errorCount}`;

describe('Profile utils', () => {
  describe('contact-information utils', () => {
    describe('formatAddressTitle', () => {
      it('should format string to not include the word "address"', () => {
        const initial = 'Mailing address';

        const expected = 'Mailing';

        expect(addressUtils.formatAddressTitle(initial)).to.equal(expected);
      });
    });

    describe('handleUpdateButtonClick', () => {
      let queryForErrorsStub;
      let recordCustomProfileEventSpy;

      beforeEach(() => {
        queryForErrorsStub = sinon.stub(addressUtils, 'getErrorsFromDom');
        recordCustomProfileEventSpy = sinon.spy();
      });

      afterEach(() => {
        queryForErrorsStub.restore();
      });

      it('should call recordCustomProfileEvent with the correct parameters for mailing address', () => {
        const fieldName = FIELD_NAMES.MAILING_ADDRESS;
        const errors = [1, 2, 3];

        queryForErrorsStub.returns(errors);

        const clickHandler = () => {
          addressUtils.handleUpdateButtonClick(
            queryForErrorsStub,
            fieldName,
            recordCustomProfileEventSpy,
          );
        };

        const component = shallow(<TestComponent onClick={clickHandler} />);

        component.find('button').simulate('click');

        expect(queryForErrorsStub.calledOnce).to.be.true;
        expect(recordCustomProfileEventSpy.calledOnce).to.be.true;

        expect(recordCustomProfileEventSpy.firstCall.args[0]).to.deep.equal({
          title: generateExpectedTitle(FIELD_TITLES[fieldName]),
          status: generateExpectedStatus(errors.length),
        });

        component.unmount();
      });

      it('should call recordCustomProfileEvent with the correct parameters for residential address', () => {
        const fieldName = FIELD_NAMES.RESIDENTIAL_ADDRESS;
        const errors = [1, 2];

        queryForErrorsStub.returns(errors);

        const clickHandler = () => {
          addressUtils.handleUpdateButtonClick(
            queryForErrorsStub,
            fieldName,
            recordCustomProfileEventSpy,
          );
        };

        const component = shallow(<TestComponent onClick={clickHandler} />);

        component.find('button').simulate('click');

        expect(queryForErrorsStub.calledOnce).to.be.true;
        expect(recordCustomProfileEventSpy.calledOnce).to.be.true;

        expect(recordCustomProfileEventSpy.firstCall.args[0]).to.deep.equal({
          title: generateExpectedTitle(FIELD_TITLES[fieldName]),
          status: generateExpectedStatus(errors.length),
        });

        component.unmount();
      });

      it('should not call recordCustomProfileEvent when field is not an address', () => {
        const fieldName = FIELD_NAMES.EMAIL;
        const errors = [1, 2];

        queryForErrorsStub.returns(errors);

        const clickHandler = () => {
          addressUtils.handleUpdateButtonClick(
            queryForErrorsStub,
            fieldName,
            recordCustomProfileEventSpy,
          );
        };

        const component = shallow(<TestComponent onClick={clickHandler} />);

        component.find('button').simulate('click');

        expect(queryForErrorsStub.calledOnce).to.be.true;
        expect(recordCustomProfileEventSpy.called).to.be.false;

        component.unmount();
      });

      it('should not call recordCustomProfileEvent when there are no errors', () => {
        const fieldName = FIELD_NAMES.MAILING_ADDRESS;
        const errors = [];

        queryForErrorsStub.returns(errors);

        const clickHandler = () => {
          addressUtils.handleUpdateButtonClick(
            queryForErrorsStub,
            fieldName,
            recordCustomProfileEventSpy,
          );
        };

        const component = shallow(<TestComponent onClick={clickHandler} />);

        component.find('button').simulate('click');

        expect(queryForErrorsStub.calledOnce).to.be.true;
        expect(recordCustomProfileEventSpy.called).to.be.false;

        component.unmount();
      });
    });
  });
});
