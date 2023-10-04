import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import CheckInProvider from '../../tests/unit/utils/CheckInProvider';
import MainHelpBlock from '../MainHelpBlock';

describe('check-in', () => {
  const initState = {
    app: 'dayOf',
    features: {
      // eslint-disable-next-line camelcase
      check_in_experience_45_minute_reminder: true,
    },
  };
  describe('MainHelpBlock will', () => {
    it('Render MainHelpBlock for-help-using-this-tool section', () => {
      const component = render(
        <CheckInProvider
          store={initState}
          router={{ currentPage: 'contact-information' }}
        >
          <MainHelpBlock />
        </CheckInProvider>,
      );
      expect(component.getByTestId('for-help-using-this-tool')).to.exist;
    });
    it('Render MainHelpBlock if-you-have-questions section', () => {
      const component = render(
        <CheckInProvider
          store={initState}
          router={{ currentPage: 'contact-information' }}
        >
          <MainHelpBlock />
        </CheckInProvider>,
      );
      expect(component.getByTestId('if-you-have-questions')).to.exist;
    });
    it('Render MainHelpBlock if-yourre-in-crisis section', () => {
      const component = render(
        <CheckInProvider
          store={initState}
          router={{ currentPage: 'contact-information' }}
        >
          <MainHelpBlock />
        </CheckInProvider>,
      );
      expect(component.getByTestId('if-yourre-in-crisis')).to.exist;
    });
    it('Render MainHelpBlock if-you-think-your-life-is-in-danger section', () => {
      const component = render(
        <CheckInProvider
          store={initState}
          router={{ currentPage: 'contact-information' }}
        >
          <MainHelpBlock />
        </CheckInProvider>,
      );
      expect(component.getByTestId('if-you-think-your-life-is-in-danger')).to
        .exist;
    });
    it('Render MainHelpBlock for-questions-about-filing section', () => {
      const component = render(
        <CheckInProvider
          store={initState}
          router={{ currentPage: 'contact-information' }}
        >
          <MainHelpBlock />
        </CheckInProvider>,
      );
      expect(component.queryByTestId('for-questions-about-filing')).to.not
        .exist;
    });
  });
});
