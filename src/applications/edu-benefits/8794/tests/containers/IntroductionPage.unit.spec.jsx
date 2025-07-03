import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import SaveInProgressIntro from 'platform/forms/save-in-progress/SaveInProgressIntro';
import FormTitle from 'platform/forms-system/src/js/components/FormTitle';
import sinon from 'sinon';
import { render, fireEvent, waitFor, cleanup } from '@testing-library/react';
import IntroductionPage from '../../containers/IntroductionPage';
import OmbInfo from '../../components/OmbInfo';

describe('22-10215 <IntroductionPage>', () => {
  const route = {
    formConfig: {
      prefillEnabled: false,
      savedFormMessages: {},
    },
    pageList: [],
  };

  afterEach(() => {
    cleanup();
    document.body.innerHTML = '';
  });

  it('should render form title', () => {
    const wrapper = shallow(<IntroductionPage route={route} />);
    const title = wrapper.find(FormTitle);
    expect(title).to.have.lengthOf(1);
    expect(title.props().title).to.equal(
      'Update your institution’s list of certifying officials',
    );
    wrapper.unmount();
  });

  it('should render designation paragraph', () => {
    const wrapper = shallow(<IntroductionPage route={route} />);
    const designation = wrapper.find('p').at(0);
    expect(designation.text()).to.contain(
      'Designation of certifying official(s) (VA Form 22-8794)',
    );
    wrapper.unmount();
  });

  it('should render info alert box', () => {
    const wrapper = shallow(<IntroductionPage route={route} />);
    const alert = wrapper.find('va-alert');
    expect(alert).to.have.lengthOf(1);
    expect(alert.props().status).to.equal('info');
    expect(alert.find('h2').text()).to.contain(
      'For educational institutions and training facilities only',
    );
    wrapper.unmount();
  });

  it('should render the correct number of section headers', () => {
    const wrapper = shallow(<IntroductionPage route={route} />);
    expect(wrapper.find('h2')).to.have.lengthOf(4);
    wrapper.unmount();
  });

  it('should render process list with three items', () => {
    const wrapper = shallow(<IntroductionPage route={route} />);
    expect(wrapper.find('va-process-list')).to.have.lengthOf(1);
    expect(wrapper.find('va-process-list-item')).to.have.lengthOf(3);
    wrapper.unmount();
  });

  it('should render start form section and save-in-progress widget', () => {
    const wrapper = shallow(<IntroductionPage route={route} />);
    const startHeader = wrapper.find('h2').at(3);
    expect(startHeader.text()).to.contain('Start the form');

    const sip = wrapper.find(SaveInProgressIntro);
    expect(sip).to.have.lengthOf(1);
    expect(sip.props().startText).to.equal(
      'Start your 85/15 calculations report',
    );
    wrapper.unmount();
  });

  it('should render OmbInfo', () => {
    const wrapper = shallow(<IntroductionPage route={route} />);
    expect(wrapper.find(OmbInfo)).to.have.lengthOf(1);
    wrapper.unmount();
  });
  test('focuses the correct button when modal is closed', async () => {
    // Create mock <va-omb-info> container
    const vaOmbInfo = document.createElement('div');
    vaOmbInfo.id = 'va-omb-info';
    const ombShadowRoot = vaOmbInfo.attachShadow({ mode: 'open' });

    // Create <va-button secondary> inside shadow DOM
    const vaButton = document.createElement('va-button');
    vaButton.setAttribute('secondary', '');
    const buttonShadowRoot = vaButton.attachShadow({ mode: 'open' });

    const focusableButton = document.createElement('button');
    focusableButton.className = 'usa-button usa-button--outline';
    const focusSpy = sinon.spy(focusableButton, 'focus');
    buttonShadowRoot.appendChild(focusableButton);

    // Create <va-modal> with empty shadow for now
    const vaModal = document.createElement('va-modal');
    const modalShadowRoot = vaModal.attachShadow({ mode: 'open' });

    // Append to the full Shadow DOM tree
    ombShadowRoot.appendChild(vaButton);
    ombShadowRoot.appendChild(vaModal);
    document.body.appendChild(vaOmbInfo);

    // Render your component
    render(
      <IntroductionPage
        route={{
          formConfig: { prefillEnabled: false, savedFormMessages: {} },
          pageList: [],
        }}
      />,
    );

    // Trigger modal open click (calls your setup logic)
    fireEvent.click(vaOmbInfo);

    // Simulate modal adding the close button
    const closeButton = document.createElement('button');
    closeButton.setAttribute('aria-label', 'Close Privacy Act Statement modal');
    modalShadowRoot.appendChild(closeButton);

    // Fire click to close modal
    fireEvent.click(closeButton);

    // Wait for focus to happen
    await waitFor(() => {
      expect(focusSpy.calledOnce).toBe(true);
    });
  });
});
