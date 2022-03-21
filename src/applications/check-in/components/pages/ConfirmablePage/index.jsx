import React, { useCallback, useEffect, useMemo } from 'react';
import { focusElement } from 'platform/utilities/ui';
import PropTypes from 'prop-types';
import { toggleLoginModal } from 'platform/site-wide/user-nav/actions';
import { useDispatch, useSelector } from 'react-redux';
import appendQuery from 'append-query';
import { browserHistory } from 'react-router';
import DemographicItem from '../../DemographicItem';
import EditLinkText from '../Edit/shared/EditLinkText';

import { makeSelectCurrentContext } from '../../../selectors';

const ConfirmablePage = ({
  header,
  subtitle,
  dataFields = [],
  data = {},
  yesAction = () => {},
  noAction = () => {},
  isLoading = false,
  isEditEnabled = false,
  LoadingMessage = () => <va-loading-indicator message="Loading..." />,
  Footer,
  currentlyLoggedIn,
}) => {
  const selectCurrentContext = useMemo(makeSelectCurrentContext, []);
  const { token } = useSelector(selectCurrentContext);
  useEffect(() => {
    focusElement('h1');
  }, []);
  const dispatch = useDispatch();
  const editHandler = useCallback(
    dataToEdit => {
      if (currentlyLoggedIn) {
        dataToEdit.editAction(dataToEdit);
      } else {
        const params = appendQuery(window.location.pathname, {
          id: token,
          title: dataToEdit.title,
          key: dataToEdit.key,
          originatingUrl: dataToEdit.originatingUrl,
          editingPage: dataToEdit.editingPage,
        });

        browserHistory.push(params);
        // add some URL params of what we are edit,
        dispatch(toggleLoginModal(true, 'cta-login'));
      }
    },
    [currentlyLoggedIn, dispatch, token],
  );
  return (
    <div className="vads-l-grid-container vads-u-padding-bottom--6 vads-u-padding-top--2 confirmable-page">
      <h1 data-testid="header">{header}</h1>
      {subtitle && (
        <p data-testid="subtitle" className="vads-u-font-family--serif">
          {subtitle}
        </p>
      )}
      <div className="vads-u-border-color--primary vads-u-border-left--5px vads-u-margin-left--0p5 vads-u-padding-left--2">
        <dl data-testid="demographics-fields">
          {dataFields.map(field => (
            <React.Fragment key={field.key}>
              <dt className="vads-u-font-weight--bold">{field.title}</dt>
              <dd>
                {field.key in data && data[field.key] ? (
                  <DemographicItem demographic={data[field.key]} />
                ) : (
                  'Not available'
                )}
                {isEditEnabled &&
                  field.editAction && (
                    <div>
                      <a
                        href={`#edit--${field.key}`}
                        // eslint-disable-next-line react/jsx-no-bind
                        onClick={() =>
                          editHandler({ ...field, value: data[field.key] })
                        }
                        data-testid="edit-button"
                      >
                        <EditLinkText value={data[field.key]} />
                      </a>
                    </div>
                  )}
              </dd>
            </React.Fragment>
          ))}
        </dl>
      </div>
      {isLoading ? (
        <>
          <LoadingMessage />
        </>
      ) : (
        <>
          <button
            onClick={yesAction}
            className="usa-button-secondary usa-button-big"
            data-testid="yes-button"
            type="button"
          >
            Yes
          </button>
          <button
            onClick={noAction}
            className="usa-button-secondary vads-u-margin-top--2 usa-button-big"
            data-testid="no-button"
            type="button"
          >
            No
          </button>
        </>
      )}
      {Footer && <Footer />}
    </div>
  );
};
ConfirmablePage.propTypes = {
  data: PropTypes.object.isRequired,
  dataFields: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      key: PropTypes.string.isRequired,
    }),
  ).isRequired,
  header: PropTypes.string.isRequired,
  noAction: PropTypes.func.isRequired,
  yesAction: PropTypes.func.isRequired,
  Footer: PropTypes.func,
  LoadingMessage: PropTypes.func,
  isEditEnabled: PropTypes.bool,
  isLoading: PropTypes.bool,
  subtitle: PropTypes.string,
};
export default ConfirmablePage;
