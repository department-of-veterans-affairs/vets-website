import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { focusElement, scrollToTop } from 'platform/utilities/ui';
import FormTitle from 'platform/forms-system/src/js/components/FormTitle';
import SaveInProgressIntro from 'platform/forms/save-in-progress/SaveInProgressIntro';
import { isLoggedIn } from '@department-of-veterans-affairs/platform-user/selectors';
import { useSelector } from 'react-redux';
import { TITLE, SUBTITLE } from '../constants';
import TechnologyProgramAccordion from '../components/TechnologyProgramAccordion';
import OmbInfo from '../components/OmbInfo';

export const IntroductionPage = props => {
  const { route } = props;
  const userLoggedIn = useSelector(state => isLoggedIn(state));

  useEffect(() => {
    scrollToTop();
    focusElement('h1');
  }, []);

  return (
    <article className="schemaform-intro">
      <FormTitle title={TITLE} />
      <div>
        <p className="vads-u-margin-y--2">{SUBTITLE}</p>
      </div>
      <p className="vads-u-font-size--lg vads-u-font-family--serif vads-u-color--base vads-u-font-weight--normal">
        Use this form to commit to the Principles of Excellence for educational
        institutions. You can also use this form to withdraw your commitment at
        any time.
      </p>
      <va-alert status="info" visible>
        <h2 slot="headline">For educational institutions only</h2>
        <p>
          Note: This form is intended for educational institutions only. Your
          institution must be an Institution of Higher Learning (IHL) or
          Non-College Degree Post-Secondary School (NCD) that offers programs of
          education.
        </p>
      </va-alert>
      <h2 className="vads-u-margin-top--4 vads-u-margin-bottom--2 mobile-lg:vads-u-margin-y--4">
        What to know before you fill out this form
      </h2>
      <div>
        The Principles of Excellence (PoE) were created under Executive Order
        13607 to help schools that serve Veterans, service members, and their
        families provide clear, honest information and strong student support.
        <br />
        <br />
        <va-link
          external
          text="Review Executive Order 13607 to learn more about the PoE"
          href="https://www.govinfo.gov/content/pkg/FR-2012-05-02/pdf/2012-10715.pdf"
        />
        .
        <p>
          If your school is approved for VA education benefits, we encourage you
          to commit to the PoE. Signing up shows your dedication to transparency
          and supporting students who use VA benefits.
        </p>
        <p>
          If your school has more than one campus, your main campus should
          submit <strong>one</strong> form that lists <strong>all</strong>{' '}
          locations and a point of contact for each. Extension campuses will be
          automatically included in this agreement based on your facility code,
          and you will be able to select any branch campuses associated with
          your institution, as applicable.{' '}
        </p>
        <p>
          {' '}
          This is a voluntary, ongoing commitment. Once you sign up, your
          participation remains valid unless you change or withdraw it. If
          you’re not making changes, you don’t need to take further action.
        </p>
      </div>
      <h2 className="vads-u-margin-y--3 mobile-lg:vads-u-margin-y--4">
        Start the form
      </h2>
      <SaveInProgressIntro
        prefillEnabled={route.formConfig.prefillEnabled}
        messages={route.formConfig.savedFormMessages}
        formConfig={route.formConfig}
        pageList={route.pageList}
        startText="Start your Principles of Excellence for educational institutions form"
        unauthStartText="Sign in to start your form"
      />
      <div className={userLoggedIn ? 'vads-u-margin-top--4' : ''}>
        <OmbInfo />
      </div>
      <TechnologyProgramAccordion />
    </article>
  );
};

IntroductionPage.propTypes = {
  route: PropTypes.shape({
    formConfig: PropTypes.shape({
      prefillEnabled: PropTypes.bool.isRequired,
      savedFormMessages: PropTypes.object.isRequired,
    }).isRequired,
    pageList: PropTypes.arrayOf(PropTypes.object).isRequired,
  }).isRequired,
  location: PropTypes.shape({
    basename: PropTypes.string,
  }),
};

export default IntroductionPage;
