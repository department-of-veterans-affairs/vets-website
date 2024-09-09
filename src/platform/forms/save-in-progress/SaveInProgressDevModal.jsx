import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  VaModal,
  VaSelect,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';

import environment from 'platform/utilities/environment';
import { getActivePages } from 'platform/forms-system/src/js/helpers';
import localStorage from 'platform/utilities/storage/localStorage';
import '@department-of-veterans-affairs/component-library/i18n-setup';

const docsPage =
  'https://depo-platform-documentation.scrollhelp.site/developer-docs/va-forms-library-how-to-use-the-save-in-progress-m';

const checkHash = () => {
  const hash = (window?.location?.hash || '').toLowerCase();
  if (hash.includes('#dev-')) {
    localStorage.setItem('DEV_MODE', hash.includes('#dev-on'));
  }
};

const getAvailablePaths = (pageList, data) =>
  getActivePages(pageList, data)
    .map(page => page.path)
    // remove introduction page (it'll cause an endless loop if selected)
    .slice(1);

const SipsDevModal = props => {
  const { pageList, form, locationPathname } = props || {};
  const { formId, version, data, submission } = form || {};

  const [isModalVisible, toggleModal] = useState(false);
  const [textData, setTextData] = useState(JSON.stringify(data, null, 2));
  const [sipsData, setSipsData] = useState(data);
  const [availablePaths, setAvailablePaths] = useState(null);
  const [sipsUrl, setSipsUrl] = useState(null);
  const [errorMessage, setError] = useState('');

  // Only show SipsDevModal when url hash includes "#dev-(on|off)"
  checkHash();
  const showLink = localStorage.getItem('DEV_MODE') === 'true';

  useEffect(
    () => {
      if (showLink && isModalVisible && pageList?.length) {
        setAvailablePaths(getAvailablePaths(pageList, sipsData));
      }
    },
    [pageList, sipsData, showLink, isModalVisible],
  );

  if (!showLink || (pageList || []).length === 0) {
    return null;
  }

  const handlers = {
    openSipsModal: () => {
      setSipsUrl(locationPathname);
      toggleModal(true);
    },
    closeSipsModal: () => {
      // reset any issues in the textarea
      setTextData(JSON.stringify(sipsData, null, 2));
      toggleModal(false);
    },
    onChange: value => {
      let parsedData = null;
      try {
        parsedData = JSON.parse(value);
        setError('');
      } catch (err) {
        setError(err?.message || err?.name);
      }
      setTextData(value);

      // only update sipsData when valid. This will dynamically update the
      // return url options
      if (parsedData && !errorMessage) {
        // maximal-data.json is wrapped in `{ "data": {...} }
        // lets extract that out to make it easier for users
        const keys = Object.keys(parsedData);
        const newData =
          keys.length === 1 && keys[0] === 'data'
            ? parsedData.data
            : parsedData;
        setSipsData(newData);
      }
    },
    saveData: (event, type) => {
      event.preventDefault();
      setError('');
      props.saveAndRedirectToReturnUrl(
        formId,
        type === 'merge' ? { ...data, ...sipsData } : sipsData,
        version,
        sipsUrl,
        submission,
      );
      toggleModal(false);
    },
  };

  return (
    <>
      {isModalVisible ? (
        <VaModal
          modalTitle="Save in progress data"
          id="sip-menu"
          visible={isModalVisible}
          onCloseEvent={handlers.closeSipsModal}
        >
          <>
            <va-textarea
              error={errorMessage}
              label="Form data"
              name="sips_data"
              class="resize-y"
              value={textData}
              onInput={e => handlers.onChange(e.target.value)}
            />
            <VaSelect
              name="sips_url"
              label="Return url"
              value={sipsUrl}
              onVaSelect={event => setSipsUrl(event.target.value)}
            >
              {availablePaths &&
                availablePaths.map(path => (
                  <option key={path} value={path}>
                    {path}
                  </option>
                ))}
            </VaSelect>
            <p />
            <va-link href={docsPage} text="How to use this menu" />
            <p />
            <div className="row">
              <div className="small-6 columns">
                <button
                  type="button"
                  disabled={!!errorMessage}
                  className="usa-button-primary"
                  title="Replace all save-in-progress data"
                  onClick={e => handlers.saveData(e, 'replace')}
                >
                  Replace
                </button>
              </div>
              <div className="small-6 columns end">
                <button
                  type="button"
                  disabled={!!errorMessage}
                  className="usa-button-secondary"
                  title="Merge new data into existing save-in-progress data"
                  onClick={e => handlers.saveData(e, 'merge')}
                >
                  Merge
                </button>
              </div>
            </div>
          </>
        </VaModal>
      ) : null}{' '}
      <button
        key={showLink}
        type="button"
        className="va-button-link vads-u-margin-left--2"
        onClick={handlers.openSipsModal}
      >
        <va-icon icon="settings" /> Open save-in-progress menu
      </button>
    </>
  );
};

SipsDevModal.propTypes = {
  locationPathname: PropTypes.string.isRequired,
  saveAndRedirectToReturnUrl: PropTypes.func.isRequired,
  form: PropTypes.shape({
    formId: PropTypes.string.isRequired,
    version: PropTypes.number.isRequired,
    data: PropTypes.object.isRequired,
    pageList: PropTypes.arrayOf(
      PropTypes.shape({
        path: PropTypes.string.isRequired,
      }),
    ),
  }),
};

export default (environment.isProduction() ? () => null : SipsDevModal);
