// Node modules.
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { apiRequest } from 'platform/utilities/api';
import { connect } from 'react-redux';
// Relative imports.
import { toggleLoginModal as toggleLoginModalAction } from 'platform/site-wide/user-nav/actions';
import { toggleValues } from 'platform/site-wide/feature-toggles/selectors';
import FEATURE_FLAG_NAMES from 'platform/utilities/feature-toggles/featureFlagNames';
import { CONTACTS } from '@department-of-veterans-affairs/component-library';
import {
  VaRadio,
  VaRadioOption,
  VaAlertSignIn,
  VaButton,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import recordEvent from '~/platform/monitoring/record-event';
import {
  VerifyIdmeButton,
  VerifyLogingovButton,
} from '~/platform/user/authentication/components/VerifyButton';

import {
  notFoundComponent,
  radioOptions,
  unavailableComponent,
  phoneComponent,
  dateOptions,
  LastUpdatedComponent,
  formatTimeString,
} from './utils';

import { CSP_IDS } from '~/platform/user/authentication/constants';
import { signInServiceName } from '~/platform/user/authentication/selectors';
import { isLOA1 as isLOA1Selector } from '~/platform/user/selectors';
import { isLOA3 as isLOA3Selector} from '~/platform/user/selectors';
import { el } from 'date-fns/locale';


export const App = ({ loggedIn, toggleLoginModal, displayToggle, signInServiceName, isLOA1, isLOA3 }) => {
  const [lastUpdated, updateLastUpdated] = useState('');
  const [year, updateYear] = useState(0);
  const [formError, updateFormError] = useState({ error: false, type: '' }); // types: "not found", "download error"
  const [formType, updateFormType] = useState('pdf');
  const [formDownloaded, updateFormDownloaded] = useState({
    downloaded: false,
    timeStamp: '',
  });


//  console.log('*****************************');
//  console.log('signInServiceName', signInServiceName);
//  console.log('isLOA1', isLOA1);
//   console.log('isLOA3', isLOA3);
//  console.log('*****************************');


 const [signInAlertVariant, setSignInAlertVariant] = useState(null);

 useEffect(() => {

    const getSignInAlertVariant = () => {
      console.log('1 isLOA1', isLOA1);
      console.log('1 isLOA3', isLOA3);
      console.log('1 signInServiceName', signInServiceName)
      if (isLOA1) {
        if (signInServiceName === CSP_IDS.LOGIN_GOV) {
          console.log('variant name is CSP_IDS.LOGIN_GOV');
          return (
            <VaAlertSignIn variant="verifyLoginGov" visible headingLevel={4}>
            <span slot="LoginGovVerifyButton">
              <VerifyLogingovButton />
            </span>
            </VaAlertSignIn>
          );
        } else if (signInServiceName === CSP_IDS.ID_ME) {
          console.log('variant name is CSP_IDS.ID_ME');
          return (
            <VaAlertSignIn variant="verifyIdMe" visible headingLevel={4}>
              <span slot="IdMeVerifyButton">
                <VerifyIdmeButton />
              </span>
            </VaAlertSignIn>
          );
        } else {
          console.log('variant name is not those. It is: ', signInServiceName);
          return (
            <VaAlertSignIn variant="signInEither" visible headingLevel={4}>
              <span slot="LoginGovSignInButton">
                <VerifyLogingovButton />
              </span>
              <span slot="IdMeSignInButton">
                <VerifyIdmeButton />
              </span>
            </VaAlertSignIn>
          );
        }
      }
      // todo: handle loa3 also?
    };

    setSignInAlertVariant(getSignInAlertVariant());
  }, [signInServiceName, isLOA1]);


  const showSignInModal = () => {
    toggleLoginModal(true, 'ask-va', true);
  };

  const getContent = () => {
    return apiRequest(`/form1095_bs/download_${formType}/${year}`)
      .then(response => response.blob())
      .then(blob => {
        return window.URL.createObjectURL(blob);
      })
      .catch(() => {
        updateFormError({ error: true, type: 'download error' });
        return false;
      });
  };

  const getLastUpdatedOn = () => {
    // return apiRequest('/form1095_bs/available_forms')
    //   .then(response => {
    //     if (response.errors || !response.availableForms.length) {
    //       updateFormError({ error: true, type: 'not found' });
    //     }
    //     return response.availableForms[0];
    //   })
    //   .catch(() => updateFormError({ error: true, type: 'not found' }));
    return { year: 2021, lastUpdated: new Date() };
  };

  const callLastUpdated = () => {
    //getLastUpdatedOn().then(result => {
      const result = { year: 2021, lastUpdated: new Date() };
      if (result.lastUpdated && result.year) {
        const date = new Date(result.lastUpdated);
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        // expected output (varies according to local timezone and default locale): December 20, 2012
        updateLastUpdated(date.toLocaleDateString(undefined, options));
        updateYear(result.year);
      } else {
        updateFormError({ error: true, type: 'not found' });
      }
    // });
  };

  const callGetContent = () => {
    getContent().then(result => {
      if (result) {
        const a = document.createElement('a');
        a.href = result;
        a.target = '_blank';

        if (formType === 'txt') a.download = `1095B-${year}.txt`; // download text file directly

        document.body.appendChild(a); // we need to append the element to the dom -> otherwise it will not work in firefox
        a.click();
        a.remove(); // removes element from the DOM
        const date = new Date();
        updateFormError({ error: false, type: '' });
        updateFormDownloaded({
          downloaded: true,
          timeStamp: formatTimeString(
            date.toLocaleDateString(undefined, dateOptions),
          ),
        });
      }
    });
  };

  useEffect(
    () => {
      callLastUpdated();
    },
    [loggedIn, callLastUpdated],
  );

  const radioComponent = (
    <>
      <h2>Choose your file format and download your document</h2>
      <VaRadio
        id="1095-download-options"
        label="We offer two file format options for this form. Choose the option that best meets your needs."
        onRadioOptionSelected={e => {
          e.preventDefault();
          updateFormType(e.target.value);
        }}
      >
        {radioOptions.map(({ value, label }) => (
          <VaRadioOption
            id={value}
            key={value}
            checked={value === formType}
            label={label}
            value={value}
            name="1095b-form-select"
          />
        ))}
      </VaRadio>
    </>
  );

  const downloadButton = (
    <p>
      <button
        type="button"
        className="usa-button-primary va-button"
        onClick={() => {
          recordEvent({
            event: 'int-radio-button-option-click',
            'radio-button-label':
              'Choose your file format and download your document',
            'radio-button-option-click-label': `${formType} 1095B downloaded`,
          });
          callGetContent();
        }}
        id="download-url"
      >
        Download your 1095-B tax form{' '}
      </button>
    </p>
  );

  const errorComponent = (
    <>
      <LastUpdatedComponent lastUpdated={lastUpdated} />
      <va-alert
        close-btn-aria-label="Close notification"
        status="error"
        visible
      >
        <h2 slot="headline">We couldn’t download your form</h2>
        <div>
          <p>
            We’re sorry. Something went wrong when we tried to download your
            form. Please try again. If your form still doesn’t download, call us
            at {phoneComponent(CONTACTS.HELP_DESK)}. We’re here 24/7.
          </p>
        </div>
      </va-alert>
      {downloadButton}
    </>
  );

  const getErrorComponent = () => {
    if (formError.type === 'not found') {
      return notFoundComponent();
    }
    return errorComponent;
  };

  const successComponent = (
    <>
      <LastUpdatedComponent lastUpdated={lastUpdated} />
      <va-alert
        close-btn-aria-label="Close notification"
        status="success"
        visible
      >
        <h2 slot="headline">Download Complete</h2>
        <div>
          <p>
            You successfully downloaded your 1095-B tax form. Please check your
            files. &nbsp;
            {formDownloaded.timeStamp}
          </p>
        </div>
      </va-alert>
      {downloadButton}
    </>
  );

  const loggedInComponent = (
    <>
      <LastUpdatedComponent lastUpdated={lastUpdated} />
      {radioComponent}
      {downloadButton}
    </>
  );

  const loggedOutComponent = (
    <VaAlertSignIn variant="signInRequired" visible headingLevel={4}>
      <span slot="SignInButton">
        <VaButton
          text="Sign in or create an account"
          onClick={showSignInModal}
        />
      </span>
    </VaAlertSignIn>
  );

  // if (!displayToggle) {
  //   return unavailableComponent();
  // }
  // if (loggedIn) {
  //   if (formError.error) {
  //     return getErrorComponent();
  //   }
  //   if (formDownloaded.downloaded) {
  //     return successComponent;
  //   }
  //   return loggedInComponent;
  // }
  //return loggedOutComponent;

  //console.log('signInAlertVariant', signInAlertVariant)
  return (
    <>
      { signInAlertVariant }
    </>
  );
};

App.propTypes = {
  toggleLoginModal: PropTypes.func.isRequired,
  loggedIn: PropTypes.bool,
  displayToggle: PropTypes.bool,
  isLOA1: PropTypes.bool,
  isLOA3: PropTypes.bool,
};

const mapStateToProps = state => ({
  // loggedIn: state?.user?.login?.currentlyLoggedIn || null,
  // displayToggle: toggleValues(state)[FEATURE_FLAG_NAMES.showDigitalForm1095b],
  loggedIn: true,
  displayToggle: true,
  isLOA1: isLOA1Selector(state),
  isLOA3: isLOA3Selector(state),
  signInServiceName: signInServiceName(state),
});

const mapDispatchToProps = dispatch => ({
  toggleLoginModal: () => dispatch(toggleLoginModalAction(true)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(App);
