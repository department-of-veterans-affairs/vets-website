import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Modal from '@department-of-veterans-affairs/component-library/Modal';
import TextArea from '@department-of-veterans-affairs/component-library/TextArea';
import Select from '@department-of-veterans-affairs/component-library/Select';

import environment from 'platform/utilities/environment';
import { getActivePages } from 'platform/forms-system/src/js/helpers';
import localStorage from 'platform/utilities/storage/localStorage';

const docsPage =
  'https://department-of-veterans-affairs.github.io/veteran-facing-services-tools/forms/save-in-progress-menu';

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

  useEffect(
    () => {
      setAvailablePaths(getAvailablePaths(pageList, sipsData));
    },
    [pageList, sipsData],
  );

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

  // Only show SipsDevModal when url hash includes "#dev-(on|off)"
  checkHash();
  const showLink = localStorage.getItem('DEV_MODE');
  if (showLink !== 'true') {
    return null;
  }

  return (
    <>
      {isModalVisible ? (
        <Modal
          title="Save in progress data"
          id="sip-menu"
          cssClass=""
          visible={isModalVisible}
          onClose={handlers.closeSipsModal}
        >
          <>
            <TextArea
              errorMessage={errorMessage}
              label="Form data"
              name="sips_data"
              additionalClass="resize-y"
              field={{ value: textData }}
              onValueChange={field => handlers.onChange(field.value)}
            />
            <Select
              label="Return url"
              name="sips_url"
              options={availablePaths}
              value={{ value: sipsUrl }}
              includeBlankOption={false}
              onValueChange={value => setSipsUrl(value.value)}
              additionalClass="additional-class"
            />
            <p />
            <a href={docsPage}>
              <i aria-hidden="true" className="fas fa-info-circle" role="img" />{' '}
              How to use this menu
            </a>
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
        </Modal>
      ) : null}{' '}
      <button
        key={showLink}
        type="button"
        className="va-button-link vads-u-margin-left--1"
        onClick={handlers.openSipsModal}
      >
        <i aria-hidden="true" className="fas fa-cog" role="img" /> Open
        save-in-progress menu
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
