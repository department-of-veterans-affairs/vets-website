import React from 'react';
import moment from 'moment';
import { expect } from 'chai';
import { render } from '@testing-library/react';

import {
  $,
  $$,
} from '@department-of-veterans-affairs/platform-forms-system/ui';

import { VA_FORM_IDS } from '../../constants';
import { FormSaved } from '../../save-in-progress/FormSaved';

describe('Schemaform <FormSaved>', () => {
  const route = {
    pageList: [
      {
        path: 'wrong-path',
      },
      {
        path: 'testing',
      },
    ],
    formConfig: {
      formId: '123',
      saveInProgress: {
        messages: {
          saved: 'Your education benefits (123) application has been saved.',
        },
      },
    },
  };
  const formId = VA_FORM_IDS.FORM_10_10EZ;
  const user = ({ verified = true } = {}) => ({
    profile: {
      prefillsAvailable: [],
      verified,
    },
    login: {
      verifyUrl: 'http://fake-verify-url',
    },
  });
  const lastSavedDate = 1497300513914;
  const expirationDate = moment().unix() + 2000;

  it('should render', () => {
    const { container } = render(
      <FormSaved
        scrollParams={{}}
        location={{}}
        formId={formId}
        lastSavedDate={lastSavedDate}
        expirationDate={expirationDate}
        route={route}
        user={user()}
      />,
    );
    const alertText = $('va-alert', container).textContent;
    expect(alertText).to.contain('June 12, 2017, at');
    expect(alertText).to.contain('will expire on');
    expect(alertText).to.contain(
      'Your education benefits (123) application has been saved.',
    );
    expect($$('va-alert', container).length).to.equal(1);
  });
  it('should display verify link if user is not verified', () => {
    const { container } = render(
      <FormSaved
        scrollParams={{}}
        location={{}}
        formId={formId}
        lastSavedDate={lastSavedDate}
        expirationDate={expirationDate}
        route={route}
        user={user({ verified: false })}
      />,
    );
    expect($$('va-alert', container).length).to.equal(2);
    expect($('va-alert[status="warning"]', container).innerHTML).to.contain(
      'href="/verify',
    );
  });
  it('should not display verify link if user is verified', () => {
    const { container } = render(
      <FormSaved
        scrollParams={{}}
        location={{}}
        formId={formId}
        lastSavedDate={lastSavedDate}
        expirationDate={expirationDate}
        route={route}
        user={user()}
      />,
    );

    expect($('va-alert[status="warning"]', container)).to.not.exist;
  });
  it('should still show start a new & continue button (not resumeOnly)', () => {
    const { container } = render(
      <FormSaved
        scrollParams={{}}
        location={{}}
        formId={formId}
        lastSavedDate={lastSavedDate}
        expirationDate={expirationDate}
        route={route}
        user={user()}
      />,
    );
    expect($$('va-button', container).length).to.eq(2);
  });
  it('should config form controls to be resume only', () => {
    const thisRoute = {
      pageList: [
        {
          path: 'wrong-path',
        },
        {
          path: 'testing',
        },
      ],
      formConfig: {
        formId: '123',
        saveInProgress: {
          resumeOnly: true,
          messages: {
            saved: 'Your education benefits (123) application has been saved.',
          },
        },
      },
    };
    const { container } = render(
      <FormSaved
        scrollParams={{}}
        location={{}}
        formId={formId}
        lastSavedDate={lastSavedDate}
        expirationDate={expirationDate}
        route={thisRoute}
        user={user()}
      />,
    );
    const button = $$('va-button', container);
    expect(button.length).to.eq(1);
    expect(button[0].getAttribute('text')).to.contain('Continue your app');
  });

  it('should handle form config being empty', () => {
    const thisRoute = {
      pageList: [
        {
          path: 'wrong-path',
        },
        {
          path: 'testing',
        },
      ],
      formConfig: {},
    };
    const { container } = render(
      <FormSaved
        scrollParams={{}}
        location={{}}
        formId={formId}
        lastSavedDate={lastSavedDate}
        expirationDate={expirationDate}
        route={thisRoute}
        user={user()}
      />,
    );
    expect($('va-button', container)).exist;
  });
  it('should handle save in progress being empty', () => {
    const thisRoute = {
      pageList: [
        {
          path: 'wrong-path',
        },
        {
          path: 'testing',
        },
      ],
      formConfig: {
        saveInProgress: {},
      },
    };
    const { container } = render(
      <FormSaved
        scrollParams={{}}
        location={{}}
        formId={formId}
        lastSavedDate={lastSavedDate}
        expirationDate={expirationDate}
        route={thisRoute}
        user={user()}
      />,
    );
    expect($('va-button', container)).exist;
  });
});
