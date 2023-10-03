import React from 'react';
import PropTypes from 'prop-types';
import FormTitle from 'platform/forms-system/src/js/components/FormTitle';
import SaveInProgressIntro from 'platform/forms/save-in-progress/SaveInProgressIntro';
// eslint-disable-next-line import/no-cycle
import formConfig from '../config/form';
import RepCard from '../components/RepCard';

const IntroductionPage = props => {
  const selectedRepresentative = {
    id: 12345,
    name: 'Veterans of Foreign Wars (033)',
    type: 'Veteran Service Organization (VSO)',
    address: '123 Main Street',
    city: 'Montgomery',
    state: 'Alabama',
    postalCode: '36102-1509',
    phone: '205-932-6262',
  };

  return (
    <>
      <div className="vads-l-col--12 small-desktop-screen:vads-l-col--10">
        <va-breadcrumbs className="vads-u-font-family--sans no-wrap">
          <a href="/">Home</a>
          <a href="/view-change-representative/search/introduction">
            Find a Local Representative
          </a>
          <a href="/view-change-representative/search/introduction">
            Representative Selected
          </a>
        </va-breadcrumbs>
      </div>
      <div className="schemaform-intro">
        <FormTitle title="Representative Selected" />
        <RepCard selectedRepresentative={selectedRepresentative} />
        <va-alert status="warning" class="vads-u-margin-bottom--4">
          <h3 slot="headline">Before you continue</h3>
          <div>
            <p>
              Keep in mind, appointing this representative will replace your
              current representative.
            </p>
          </div>
        </va-alert>
        <SaveInProgressIntro
          startText="Sign in to see your current representative."
          unauthStartText="Sign in"
          prefillEnabled={formConfig.prefillEnabled}
          messages={formConfig.savedFormMessages}
          formConfig={formConfig}
          pageList={props.route.pageList}
          downtime={formConfig.downtime}
        />
        <h2>What can I expect next?</h2>
        <ol>
          <li>
            Pre-fill the Appointment of Representative VA Form 21-22 online
            using the following steps, or download and fill out the form.
          </li>
          <li>Print and sign your completed form.</li>
          <li>
            Have your representative sign the form either through mail using the
            address above or in person.
          </li>
          <li>
            You or your representative can submit the form online, by mail, or
            in person at a VA regional office.
          </li>
        </ol>
        <p>
          Where can I submit my completed Appointment of Representative VA Form
          21-22?
        </p>
      </div>
    </>
  );
};

IntroductionPage.propTypes = {
  route: PropTypes.object,
};

export default IntroductionPage;
