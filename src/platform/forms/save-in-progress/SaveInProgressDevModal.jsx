import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import {
  VaModal,
  VaSelect,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';

import environment from 'platform/utilities/environment';
import { getActivePages } from 'platform/forms-system/src/js/helpers';
import localStorage from 'platform/utilities/storage/localStorage';

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
    .map(
      page =>
        // Include '?edit=true' to allow entering array builder pages
        page.path.includes('/:index')
          ? `${page.path.replace('/:index', '/0')}?edit=true`
          : page.path,
    )
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
  const errorMessage = useRef('');

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
      // Don't show an error when the text area is empty,
      // but do reset the data and then short-circuit
      if (value === '') {
        errorMessage.current = '';
        setTextData(value);
        return;
      }

      let parsedData = null;

      try {
        parsedData = JSON.parse(value);
        errorMessage.current = '';
      } catch (err) {
        errorMessage.current = err?.message || err?.name;
      }
      setTextData(value);

      // only update sipsData when valid. This will dynamically update the
      // return url options
      if (parsedData && !errorMessage.current) {
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
    saveData: event => {
      event.preventDefault();
      errorMessage.current = '';
      props.saveAndRedirectToReturnUrl(
        formId,
        sipsData,
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
          class="vads-u-width--full"
          modalTitle="Save in progress data"
          id="sip-menu"
          visible={isModalVisible}
          onCloseEvent={handlers.closeSipsModal}
        >
          <>
            <va-textarea
              error={errorMessage.current}
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
                    {path.replace('?edit=true', '')}
                  </option>
                ))}
            </VaSelect>
            <p />
            <va-link href={docsPage} text="How to use this menu" />
            <p />
            <div className="vads-u-display--flex">
              <va-button
                class="vads-u-margin-right--1"
                disabled={!!errorMessage.current || !textData}
                text="Update"
                label="Update save-in-progress data"
                onClick={e => handlers.saveData(e)}
                full-width
              />
            </div>
          </>
        </VaModal>
      ) : null}{' '}
      <va-link
        key={showLink}
        class="vads-u-margin-left--2"
        href="#"
        onClick={handlers.openSipsModal}
        icon-name="settings"
        text="Open save-in-progress menu"
      />
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
