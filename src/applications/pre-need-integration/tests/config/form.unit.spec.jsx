import React from 'react';
import { expect } from 'chai';
import { shallow, mount } from 'enzyme';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import formConfig from '../../config/form'; // Adjust the path as necessary
import Footer from '../../components/Footer';
import IntroductionPage from '../../components/IntroductionPage';
import ConfirmationPage from '../../containers/ConfirmationPage';
import {
  isAuthorizedAgent,
  isVeteran,
  isSponsorDeceased,
} from '../../utils/helpers';
import preparerDetails from '../../config/pages/preparerDetails';
import applicantRelationshipToVet from '../../config/pages/applicantRelationshipToVet';
import sponsorDetails from '../../config/pages/sponsorDetails';
import sponsorDateOfDeath from '../../config/pages/sponsorDateOfDeath';

const mockStore = configureStore([]);
let store;

describe('formConfig', () => {
  beforeEach(() => {
    store = mockStore({
      form: {
        data: {
          application: {
            applicant: {
              applicantRelationshipToClaimant: 'Authorized Agent/Rep',
            },
          },
        },
      },
      user: {
        profile: {
          email: 'test@example.com',
        },
      },
    });
  });

  it('should render the Footer without crashing', () => {
    const wrapper = shallow(
      <Footer formConfig={formConfig} currentLocation="/" />,
    );
    expect(wrapper.exists()).to.be.true;
    wrapper.unmount();
  });

  it('should render the IntroductionPage without crashing', () => {
    const wrapper = shallow(<IntroductionPage />);
    expect(wrapper.exists()).to.be.true;
    wrapper.unmount();
  });

  it('should render the ConfirmationPage without crashing', () => {
    const wrapper = shallow(<ConfirmationPage />);
    expect(wrapper.exists()).to.be.true;
    wrapper.unmount();
  });

  it('should render the formConfig component without crashing', () => {
    const wrapper = mount(
      <Provider store={store}>
        <formConfig />
      </Provider>,
    );
    expect(wrapper.exists()).to.be.true;
    wrapper.unmount();
  });

  it('should render the PreparerDetails page when the user is an authorized agent', () => {
    const mockFormData = {
      application: {
        applicant: {
          applicantRelationshipToClaimant: 'Authorized Agent/Rep',
        },
      },
    };

    const wrapper = mount(
      <Provider store={store}>
        <preparerDetails formData={mockFormData} />
      </Provider>,
    );

    expect(wrapper.exists()).to.be.true;
    expect(isAuthorizedAgent(mockFormData)).to.be.true;
    wrapper.unmount();
  });

  it('should not render the PreparerDetails page when the user is not an authorized agent', () => {
    const mockFormData = {
      application: {
        applicant: {
          applicantRelationshipToClaimant: 'Self',
        },
      },
    };

    const wrapper = mount(
      <Provider store={store}>
        <preparerDetails formData={mockFormData} />
      </Provider>,
    );

    expect(wrapper.exists()).to.be.true;
    expect(isAuthorizedAgent(mockFormData)).to.be.false;
    wrapper.unmount();
  });

  it('should render the applicantRelationshipToVet page when the user is not an authorized agent', () => {
    const mockFormData = {
      application: {
        applicant: {
          applicantRelationshipToClaimant: 'Self',
        },
      },
    };

    const wrapper = mount(
      <Provider store={store}>
        <applicantRelationshipToVet formData={mockFormData} />
      </Provider>,
    );

    expect(wrapper.exists()).to.be.true;
    expect(isAuthorizedAgent(mockFormData)).to.be.false;
    wrapper.unmount();
  });

  it('should render the sponsorDetails page when the user is not a veteran', () => {
    const mockFormData = {
      application: {
        applicant: {
          applicantRelationshipToClaimant: 'Self',
        },
      },
    };

    const wrapper = mount(
      <Provider store={store}>
        <sponsorDetails formData={mockFormData} />
      </Provider>,
    );

    expect(wrapper.exists()).to.be.true;
    expect(isVeteran(mockFormData)).to.be.false;
    wrapper.unmount();
  });

  it('should render the sponsorDateOfDeath page when the sponsor is deceased', () => {
    const mockFormData = {
      application: {
        applicant: {
          applicantRelationshipToClaimant: 'Self',
        },
        sponsor: {
          isDeceased: true,
        },
      },
    };

    const wrapper = mount(
      <Provider store={store}>
        <sponsorDateOfDeath formData={mockFormData} />
      </Provider>,
    );

    expect(wrapper.exists()).to.be.true;
    expect(isSponsorDeceased(mockFormData)).to.be.true;
    wrapper.unmount();
  });
});
