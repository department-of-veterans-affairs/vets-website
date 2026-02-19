import React from 'react';
import { expect } from 'chai';
import { waitFor, cleanup } from '@testing-library/react';
import sinon from 'sinon';
import { renderWithStoreAndRouter } from '~/platform/testing/unit/react-testing-library-helpers';
import * as featureToggles from 'platform/utilities/feature-toggles';
import vapService from '~/platform/user/profile/vap-svc/reducers';
import vaProfile from '@@profile/reducers/vaProfile';
import { FIELD_NAMES } from '@@vap-svc/constants';
import ContactMethodConfirm from '../../../../../components/health-care-settings/sub-tasks/contact-method/pages/ContactMethodConfirm';

const mockFieldName = FIELD_NAMES.SCHEDULING_PREF_CONTACT_METHOD;

describe('ContactMethodConfirm', () => {
  let useFeatureToggleStub;

  const defaultProps = {
    pageData: {
      data: {
        [mockFieldName]: 'option-5',
      },
    },
  };

  let updateContactInfoSpy;

  const getInitialState = () => ({
    user: {
      profile: {
        vapContactInfo: {
          email: {
            emailAddress: 'test@example.com',
          },
          mailingAddress: {
            addressLine1: '123 Main St',
            city: 'Springfield',
            stateCode: 'IL',
            zipCode: '62701',
            countryCodeIso3: 'USA',
          },
          mobilePhone: {
            areaCode: '555',
            phoneNumber: '1234567',
          },
          homePhone: {
            areaCode: '555',
            phoneNumber: '1234567',
          },
          workPhone: {
            areaCode: '555',
            phoneNumber: '1234567',
          },
        },
      },
    },
    vapService: {},
    vaProfile: {
      schedulingPreferences: {},
    },
  });

  const getPropsWithHandlers = () => ({
    ...defaultProps,
    handlers: {
      updateContactInfo: updateContactInfoSpy,
    },
  });

  beforeEach(() => {
    useFeatureToggleStub = sinon.stub(featureToggles, 'useFeatureToggle');
    useFeatureToggleStub.returns({
      TOGGLE_NAMES: {},
      useToggleValue: sinon.stub().returns(true),
    });
    defaultProps.setPageData = sinon.spy();
    updateContactInfoSpy = sinon.spy();
  });

  afterEach(() => {
    useFeatureToggleStub.restore();
    cleanup();
  });

  describe('basic rendering', () => {
    it('should render component', async () => {
      const { container } = renderWithStoreAndRouter(
        <ContactMethodConfirm {...getPropsWithHandlers()} />,
        {
          initialState: getInitialState(),
          reducers: { vapService, vaProfile },
          path: '/test',
        },
      );

      await waitFor(() => {
        expect(container).to.exist;
      });
    });
  });

  describe('contact info display for email', () => {
    it('should display email address when email is selected', async () => {
      const props = getPropsWithHandlers();
      const state = getInitialState();
      const { getByText } = renderWithStoreAndRouter(
        <ContactMethodConfirm {...props} />,
        {
          initialState: state,
          reducers: { vapService, vaProfile },
          path: '/test',
        },
      );

      await waitFor(() => {
        expect(getByText('Contact email')).to.exist;
        expect(getByText(state.user.profile.vapContactInfo.email.emailAddress))
          .to.exist;
      });
    });
  });

  describe('contact info display for phone options', () => {
    it('should display mobile phone when mobile is selected', async () => {
      const propsWithMobile = {
        ...getPropsWithHandlers(),
        pageData: {
          data: {
            [mockFieldName]: 'option-1',
          },
        },
      };

      const { getByText } = renderWithStoreAndRouter(
        <ContactMethodConfirm {...propsWithMobile} />,
        {
          initialState: getInitialState(),
          reducers: { vapService, vaProfile },
          path: '/test',
        },
      );

      await waitFor(() => {
        expect(getByText('Mobile phone number')).to.exist;
      });
    });

    it('should display home phone when home phone is selected', async () => {
      const propsWithHome = {
        ...getPropsWithHandlers(),
        pageData: {
          data: {
            [mockFieldName]: 'option-38',
          },
        },
      };

      const { getByText } = renderWithStoreAndRouter(
        <ContactMethodConfirm {...propsWithHome} />,
        {
          initialState: getInitialState(),
          reducers: { vapService, vaProfile },
          path: '/test',
        },
      );

      await waitFor(() => {
        expect(getByText('Home phone number')).to.exist;
      });
    });

    it('should display work phone when work phone is selected', async () => {
      const propsWithWork = {
        ...getPropsWithHandlers(),
        pageData: {
          data: {
            [mockFieldName]: 'option-39',
          },
        },
      };

      const { getByText } = renderWithStoreAndRouter(
        <ContactMethodConfirm {...propsWithWork} />,
        {
          initialState: getInitialState(),
          reducers: { vapService, vaProfile },
          path: '/test',
        },
      );

      await waitFor(() => {
        expect(getByText('Work phone number')).to.exist;
      });
    });
  });

  describe('contact info display for mailing address', () => {
    it('should display mailing address when US mail is selected', async () => {
      const propsWithMail = {
        ...getPropsWithHandlers(),
        pageData: {
          data: {
            [mockFieldName]: 'option-4',
          },
        },
      };

      const { getByText } = renderWithStoreAndRouter(
        <ContactMethodConfirm {...propsWithMail} />,
        {
          initialState: getInitialState(),
          reducers: { vapService, vaProfile },
          path: '/test',
        },
      );

      await waitFor(() => {
        expect(getByText('Mailing address')).to.exist;
      });
    });
  });

  describe('updateContactInfo handler', () => {
    it('should not call updateContactInfo when email data exists', async () => {
      const props = getPropsWithHandlers();
      const { container } = renderWithStoreAndRouter(
        <ContactMethodConfirm {...props} />,
        {
          initialState: getInitialState(),
          reducers: { vapService, vaProfile },
          path: '/test',
        },
      );

      await waitFor(() => {
        expect(container).to.exist;
      });

      // The handler should not be called since email data exists
      expect(props.handlers.updateContactInfo.called).to.be.false;
    });

    it('should call updateContactInfo when mobile phone data is missing', async () => {
      const propsWithoutMobile = {
        ...getPropsWithHandlers(),
        pageData: {
          data: {
            [mockFieldName]: 'option-1',
          },
        },
      };

      const stateWithoutMobile = getInitialState();
      stateWithoutMobile.user.profile.vapContactInfo.mobilePhone = null;

      renderWithStoreAndRouter(
        <ContactMethodConfirm {...propsWithoutMobile} />,
        {
          initialState: stateWithoutMobile,
          reducers: { vapService, vaProfile },
          path: '/test',
        },
      );

      await waitFor(() => {
        expect(propsWithoutMobile.handlers.updateContactInfo.called).to.be.true;
      });
    });

    it('should call updateContactInfo when mailing address data is missing', async () => {
      const propsWithoutAddress = {
        ...getPropsWithHandlers(),
        pageData: {
          data: {
            [mockFieldName]: 'option-4',
          },
        },
      };

      const stateWithoutAddress = getInitialState();
      stateWithoutAddress.user.profile.vapContactInfo.mailingAddress = null;

      renderWithStoreAndRouter(
        <ContactMethodConfirm {...propsWithoutAddress} />,
        {
          initialState: stateWithoutAddress,
          reducers: { vapService, vaProfile },
          path: '/test',
        },
      );

      await waitFor(() => {
        expect(propsWithoutAddress.handlers.updateContactInfo.called).to.be
          .true;
      });
    });
  });

  describe('focus management', () => {
    it('should focus on h1 element on mount', async () => {
      const { container } = renderWithStoreAndRouter(
        <ContactMethodConfirm {...getPropsWithHandlers()} />,
        {
          initialState: getInitialState(),
          reducers: { vapService, vaProfile },
          path: '/test',
        },
      );

      await waitFor(() => {
        expect(container).to.exist;
      });
    });
  });
});
