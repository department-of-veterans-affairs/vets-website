import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { expect } from 'chai';

import featureFlagNames from '~/platform/utilities/feature-toggles/featureFlagNames';

import PersonalInformation from '@@profile/components/personal-information/PersonalInformation';

import {
  createBasicInitialState,
  renderWithProfileReducers,
} from '../../unit-test-helpers';
import { beforeEach } from 'mocha';

const ui = (
  <MemoryRouter>
    <PersonalInformation />
  </MemoryRouter>
);
let view;

const remindersTurnedOnMessage =
  'We text VA health appointment reminders to this number. To stop getting these reminders, edit your mobile number settings.';
const remindersTurnedOffMessage =
  'If you’d like to get text reminders for your VA health appointments, edit your mobile number settings.';

const checkboxLabel =
  'Send me text message (SMS) reminders for my VA health care appointments';

context('When not enrolled in health care', () => {
  beforeEach(() => {
    const initialState = createBasicInitialState();
    initialState.user.profile.vaPatient = false;
    view = renderWithProfileReducers(ui, {
      initialState,
    });
  });
  it('info about appointment reminders should not be shown under the mobile phone number', () => {
    expect(view.queryByText(remindersTurnedOnMessage)).to.not.exist;
    expect(view.queryByText(remindersTurnedOffMessage)).to.not.exist;
  });
  it('the text messages checkbox should not be shown in edit mode', () => {
    view.getByRole('button', { name: /edit mobile phone/i }).click();
    expect(view.queryByLabelText(checkboxLabel)).to.not.exist;
  });
});

context(
  'When enrolled in health care, signed up for text message reminders, but the profileNotificationSettings feature flag is turned on',
  () => {
    beforeEach(() => {
      const initialState = createBasicInitialState();
      initialState.user.profile.vaPatient = true;
      initialState.user.profile.vapContactInfo.mobilePhone.isTextPermitted = true;
      initialState.featureToggles = {
        loading: false,
        [featureFlagNames.profileNotificationSettings]: true,
      };
      view = renderWithProfileReducers(ui, {
        initialState,
      });
    });
    it('info about appointment reminders should not be shown under the mobile phone number', () => {
      expect(view.queryByText(remindersTurnedOnMessage)).to.not.exist;
      expect(view.queryByText(remindersTurnedOffMessage)).to.not.exist;
    });
    it('the text messages checkbox should not be shown in edit mode', () => {
      view.getByRole('button', { name: /edit mobile phone/i }).click();
      expect(view.queryByLabelText(checkboxLabel)).to.not.exist;
    });
  },
);

context('When enrolled in health care', () => {
  let initialState;
  beforeEach(() => {
    initialState = createBasicInitialState();
    initialState.user.profile.vaPatient = true;
  });
  context('and signed up to get text message reminders', () => {
    beforeEach(() => {
      initialState.user.profile.vapContactInfo.mobilePhone.isTextPermitted = true;
      view = renderWithProfileReducers(ui, {
        initialState,
      });
    });
    it('should show the correct appointment reminders info under the mobile phone number', () => {
      expect(view.getByText(remindersTurnedOnMessage)).to.exist;
      expect(view.queryByText(remindersTurnedOffMessage)).to.not.exist;
    });
    it('the text messages checkbox should be shown when editing mobile phone', () => {
      view.getByRole('button', { name: /edit mobile phone/i }).click();
      expect(view.getByLabelText(checkboxLabel)).to.exist;
    });
    it('the text messages checkbox should not be shown when editing home phone', () => {
      view.getByRole('button', { name: /edit home phone/i }).click();
      expect(view.queryByLabelText(checkboxLabel)).not.to.exist;
    });
  });
  context('and not signed up to get text message reminders', () => {
    beforeEach(() => {
      initialState.user.profile.vapContactInfo.mobilePhone.isTextPermitted = false;
      view = renderWithProfileReducers(ui, {
        initialState,
      });
    });
    it('should show the correct appointment reminders info under the mobile phone number', () => {
      expect(view.getByText(remindersTurnedOffMessage)).to.exist;
      expect(view.queryByText(remindersTurnedOnMessage)).to.not.exist;
    });
    it('the text messages checkbox should be shown when editing mobile phone', () => {
      view.getByRole('button', { name: /edit mobile phone/i }).click();
      expect(view.getByLabelText(checkboxLabel)).to.exist;
    });
    it('the text messages checkbox should not be shown when editing home phone', () => {
      view.getByRole('button', { name: /edit home phone/i }).click();
      expect(view.queryByLabelText(checkboxLabel)).not.to.exist;
    });
  });
});
