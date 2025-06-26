import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';

import environment from 'platform/utilities/environment';
import { isLoggedIn } from 'platform/user/selectors';
import { formatDateLong, formatDowntime } from 'platform/utilities/date';
import readableList from 'platform/forms-system/src/js/utilities/data/readableList';
import { focusElement } from 'platform/utilities/ui/focus';
import { scrollTo } from 'platform/utilities/scroll';
import { setItf } from 'platform/forms-system/src/js/actions';

import {
  ItfCreatedAlert,
  ItfCreateSpinner,
  ItfFailedAlert,
  ItfFoundAlert,
  ItfSearchSpinner,
  WrapContent,
  WrapPageWithButtons,
} from './content';
import {
  DAY_YEAR_PATTERN,
  ITF_API,
  ITF_STATUSES,
  ITF_SUPPORTED_BENEFIT_TYPES,
  ITF_CREATION_SUCCEEDED,
} from './constants';
import { isOutsideForm } from './utils';
import { getAndProcessItf, createItf } from './utils/api';

/**
 * Render ITF spinner and alert message as a standalone component (rendered at
 * the top of the page) or acting like a modal and replaces the page content
 * until the user activates the continue button
 * @param {String} baseUrl - base URL for the application (starts with '/') -
 *  required if ITF replaces the page content
 * @param {Element} children - React elements to render when ITF is dismissed -
 *  required if ITF replaces the page content
 * @param {String} itfApi - API endpoint to use for ITF
 * @param {Function} itfCreated - content to render when ITF is created
 * @param {Function} itfCreating - content to render when ITF is being created
 * @param {Function} itfFailed - content to render when ITF creation fails
 * @param {Function} itfFound - content to render when ITF is found
 * @param {Function} itfSearching - content to render when ITF is being
 *  searched
 * @param {String} itfType - type of ITF to create
 * @param {Object} location - location object from React Router
 * @param {Function} WrapAlert - function to wrap the alert message
 * @param {Function} WrapPage - function to wrap the page content - required for
 *  a custom ITF page wrapper (should include navigation buttons)
 * @returns {Element} - React element
 * @example full page replacement (in App)
 * <RoutedSavableApp formConfig={formConfig} currentLocation={location}>
 *   <IntentToFile
 *     itfType="compensation"
 *     location={location}
 *     baseUrl="/{path.to.app}"
 *   >
 *     {children}
 *   </IntentToFile>
 * </RoutedSavableApp>
 * @example stand-alone alert (rendered at top of page)
 * <RoutedSavableApp formConfig={formConfig} currentLocation={location}>
 *   <IntentToFile
 *     itfType="compensation"
 *     location={location}
 *   />
 *   {children}
 * </RoutedSavableApp>
 */
const IntentToFile = ({
  baseUrl = '', // required for full page replacement
  children, // required for full page replacement
  itfApi = ITF_API,
  itfCreated = ItfCreatedAlert,
  itfCreating = ItfCreateSpinner,
  itfFailed = ItfFailedAlert,
  itfFound = ItfFoundAlert,
  itfSearching = ItfSearchSpinner,
  itfType,
  location = window.location,
  WrapAlert = WrapContent,
  WrapPage = WrapPageWithButtons, // required if customizing page replacement
} = {}) => {
  const loggedIn = useSelector(state => isLoggedIn(state));

  const [startUrl] = useState(location.pathname);
  const [messageDismissed, setMessageDismissed] = useState(false);
  const [message, setMessage] = useState(null);
  const [localItf, setLocalItf] = useState({ currentITF: {}, previousITF: {} });
  const dispatch = useDispatch();

  const wrapRef = useRef(null);
  const Wrapper = children ? WrapPage : WrapAlert;
  const apiUrl = `${environment.API_URL}${itfApi}/${itfType}`;

  const focusAlertHeader = () => {
    const header = children ? 'h2' : 'va-alert';
    setTimeout(() => {
      scrollTo('topContentElement');
      focusElement(header, {}, wrapRef.current);
    }, 100);
  };
  const canCheckItf =
    loggedIn &&
    itfType &&
    ITF_SUPPORTED_BENEFIT_TYPES.includes(itfType) &&
    !isOutsideForm(startUrl);

  useEffect(
    () => {
      // Dismiss ITF alert when not on the initial page; uses sessionStorage to
      // ensure the value is maintained
      if (canCheckItf && !messageDismissed) {
        const storageKey = `itf-${itfType}`;
        const status = sessionStorage.getItem(storageKey);
        if (!status) {
          sessionStorage.setItem(storageKey, startUrl);
        } else if (status !== location.pathname) {
          setMessageDismissed(true);
          sessionStorage.removeItem(storageKey);
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [location.pathname, canCheckItf, messageDismissed],
  );

  useEffect(
    () => {
      if (canCheckItf && !messageDismissed) {
        if (!message) {
          setMessage('fetch-itf');
          getAndProcessItf({ apiUrl, itfType }).then(resultingItf => {
            const itf = { ...localItf, ...resultingItf };
            dispatch(setItf(itf));
            setLocalItf(itf);
          });
        } else if (localItf?.type && message === 'fetch-itf') {
          if (localItf?.currentITF?.status === ITF_STATUSES.active) {
            setMessage('itf-found');
            focusAlertHeader();
          } else {
            setMessage('create-itf');
            // create ITF
            createItf({ apiUrl })
              .then(resultingItf => {
                const { type } = resultingItf;
                if (type === ITF_CREATION_SUCCEEDED) {
                  const itf = { ...localItf, ...resultingItf };
                  dispatch(setItf(itf));
                  setLocalItf(itf);
                  setMessage('itf-created');
                } else {
                  setMessage('itf-error');
                }
              })
              .catch(() => {
                setMessage('itf-error');
              })
              .finally(() => {
                focusAlertHeader();
              });
          }
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [canCheckItf, localItf, message, messageDismissed],
  );

  if (messageDismissed || !canCheckItf) {
    return children || null;
  }
  if (!itfType || !ITF_SUPPORTED_BENEFIT_TYPES.includes(itfType)) {
    setMessage(null);
    throw new Error(
      `Intent to File type (itfType) is required and can only include ${readableList(
        ITF_SUPPORTED_BENEFIT_TYPES,
        'or',
      )}`,
    );
  }

  const { creationDate, expirationDate } = localItf?.currentITF;
  const renderProps = {
    itfType,
    creationDateString: creationDate,
    creationDateFormatted: creationDate ? formatDateLong(creationDate) : null,
    expirationDateString: expirationDate,
    expirationDateFormatted: expirationDate
      ? formatDowntime(expirationDate, DAY_YEAR_PATTERN)
      : null,
  };

  const render = content => (
    <Wrapper
      useRef={useRef}
      content={content}
      setMessageDismissed={setMessageDismissed}
      baseUrl={baseUrl}
    />
  );

  switch (message) {
    case 'fetch-itf':
      return render(itfSearching(renderProps)); // spinner
    case 'itf-found':
      return render(itfFound(renderProps));
    case 'create-itf':
      return render(itfCreating(renderProps)); // spinner
    case 'itf-created':
      return render(itfCreated(renderProps));
    case 'itf-error':
      return render(itfFailed(renderProps));
    default:
      return children || null;
  }
};

IntentToFile.propTypes = {
  itfType: PropTypes.string.isRequired,
  WrapAlert: PropTypes.func,
  WrapPage: PropTypes.func,
  baseUrl: PropTypes.string,
  children: PropTypes.any,
  itfApi: PropTypes.string,
  itfCreated: PropTypes.func,
  itfCreating: PropTypes.func,
  itfFailed: PropTypes.func,
  itfFound: PropTypes.func,
  itfSearching: PropTypes.func,
  location: PropTypes.shape({ pathname: PropTypes.string }),
};

export default IntentToFile;
