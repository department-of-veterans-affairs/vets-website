import React from 'react';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import { HCA_ENROLLMENT_STATUSES } from '../../../../../../utils/constants';
import WarningStatus from '../../../../../../components/IntroductionPage/EnrollmentStatus/Warning/WarningStatus';
import content from '../../../../../../locales/en/content.json';

describe('hca <WarningStatus>', () => {
<<<<<<< HEAD
  const getData = ({
=======
  const subject = ({
>>>>>>> main
    statusCode = null,
    applicationDate = null,
    enrollmentDate = null,
    preferredFacility = null,
<<<<<<< HEAD
  }) => ({
    mockStore: {
=======
  } = {}) => {
    const mockStore = {
>>>>>>> main
      getState: () => ({
        hcaEnrollmentStatus: {
          statusCode,
          applicationDate,
          enrollmentDate,
          preferredFacility,
        },
      }),
      subscribe: () => {},
      dispatch: () => {},
<<<<<<< HEAD
    },
  });

  context('when required attributes are `null`', () => {
    const { mockStore } = getData({});

    it('should not render any content', () => {
      const { container } = render(
        <Provider store={mockStore}>
          <WarningStatus />
        </Provider>,
      );
      expect(container).to.be.empty;
    });
  });

  context('when enrollment status is on the `null` list', () => {
    const { mockStore } = getData({
      statusCode: HCA_ENROLLMENT_STATUSES.deceased,
    });

    it('should not render any content', () => {
      const { container } = render(
        <Provider store={mockStore}>
          <WarningStatus />
        </Provider>,
      );
      expect(container).to.be.empty;
    });
  });

  context('when enrollment status is not `enrolled`', () => {
    const { mockStore } = getData({
      applicationDate: '2018-01-24T00:00:00.000-06:00',
      statusCode: HCA_ENROLLMENT_STATUSES.closed,
    });

    it('should render the correct content', () => {
      const { container } = render(
        <Provider store={mockStore}>
          <WarningStatus />
        </Provider>,
      );
      const selector = container.querySelectorAll('li');
      expect(selector).to.have.lengthOf(1);
      expect(container).to.contain.text(
        content['enrollment-alert-application-date-label'],
      );
    });
  });

  context('when enrollment status is `enrolled`', () => {
    context('when enrollment date is omitted', () => {
      const { mockStore } = getData({
        statusCode: HCA_ENROLLMENT_STATUSES.enrolled,
        applicationDate: '2018-01-24T00:00:00.000-06:00',
        preferredFacility: 'FACILITY NAME',
      });

      it('should render the correct content', () => {
        const { container } = render(
          <Provider store={mockStore}>
            <WarningStatus />
          </Provider>,
        );
        const selector = container.querySelectorAll('li');
        expect(selector).to.have.lengthOf(2);
        expect(container).to.not.contain.text(
          content['enrollment-alert-enrolled-date-label'],
        );
      });
    });

    context('when the `preferredFacility` is omitted', () => {
      const { mockStore } = getData({
        statusCode: HCA_ENROLLMENT_STATUSES.enrolled,
        applicationDate: '2018-01-24T00:00:00.000-06:00',
        enrollmentDate: '2018-01-24T00:00:00.000-06:00',
      });

      it('should render the correct content', () => {
        const { container } = render(
          <Provider store={mockStore}>
            <WarningStatus />
          </Provider>,
        );
        const selector = container.querySelectorAll('li');
        expect(selector).to.have.lengthOf(2);
        expect(container).to.not.contain.text(
          content['enrollment-alert-facility-label'],
        );
      });
    });

    context('when all values are valid', () => {
      const { mockStore } = getData({
        statusCode: HCA_ENROLLMENT_STATUSES.enrolled,
        applicationDate: '2018-01-24T00:00:00.000-06:00',
        enrollmentDate: '2018-01-24T00:00:00.000-06:00',
        preferredFacility: 'FACILITY NAME',
      });

      it('should render the correct content', () => {
        const { container } = render(
          <Provider store={mockStore}>
            <WarningStatus />
          </Provider>,
        );
        const selector = container.querySelectorAll('li');
        expect(selector).to.have.lengthOf(3);
      });
    });
=======
    };
    const { container } = render(
      <Provider store={mockStore}>
        <WarningStatus />
      </Provider>,
    );
    const selectors = () => ({
      listItems: container.querySelectorAll('li'),
    });
    return { container, selectors };
  };

  it('should not render any content when required attributes are `null`', () => {
    const { container } = subject();
    expect(container).to.be.empty;
  });

  it('should not render any content when enrollment status is on the `null` list', () => {
    const { container } = subject({
      statusCode: HCA_ENROLLMENT_STATUSES.deceased,
    });
    expect(container).to.be.empty;
  });

  it('should render the correct content when enrollment status is not `enrolled`', () => {
    const { container, selectors } = subject({
      applicationDate: '2018-01-24T00:00:00.000-06:00',
      statusCode: HCA_ENROLLMENT_STATUSES.closed,
    });
    expect(selectors().listItems).to.have.lengthOf(1);
    expect(container).to.contain.text(
      content['enrollment-alert-application-date-label'],
    );
  });

  it('should render the correct content when `enrollmentDate` is omitted', () => {
    const { container, selectors } = subject({
      statusCode: HCA_ENROLLMENT_STATUSES.enrolled,
      applicationDate: '2018-01-24T00:00:00.000-06:00',
      preferredFacility: 'FACILITY NAME',
    });
    expect(selectors().listItems).to.have.lengthOf(2);
    expect(container).to.not.contain.text(
      content['enrollment-alert-enrolled-date-label'],
    );
  });

  it('should render the correct content when `preferredFacility` is omitted', () => {
    const { container, selectors } = subject({
      statusCode: HCA_ENROLLMENT_STATUSES.enrolled,
      applicationDate: '2018-01-24T00:00:00.000-06:00',
      enrollmentDate: '2018-01-24T00:00:00.000-06:00',
    });
    expect(selectors().listItems).to.have.lengthOf(2);
    expect(container).to.not.contain.text(
      content['enrollment-alert-facility-label'],
    );
  });

  it('should render the correct content when all values are valid', () => {
    const { selectors } = subject({
      statusCode: HCA_ENROLLMENT_STATUSES.enrolled,
      applicationDate: '2018-01-24T00:00:00.000-06:00',
      enrollmentDate: '2018-01-24T00:00:00.000-06:00',
      preferredFacility: 'FACILITY NAME',
    });
    expect(selectors().listItems).to.have.lengthOf(3);
>>>>>>> main
  });
});
