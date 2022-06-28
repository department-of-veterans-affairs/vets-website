import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import DemographicItem from '../../DemographicItem';
import EditLinkText from '../Edit/shared/EditLinkText';
import Wrapper from '../../layout/Wrapper';

const ConfirmablePage = ({
  header,
  subtitle,
  dataFields = [],
  data = {},
  yesAction = () => {},
  noAction = () => {},
  isLoading = false,
  isEditEnabled = false,
  loadingMessageOverride = null,
  withBackButton = false,
  Footer,
}) => {
  const { t } = useTranslation();
  const defaultLoadingMessage = () => (
    <va-loading-indicator message={t('loading')} />
  );
  const LoadingMessage = loadingMessageOverride ?? defaultLoadingMessage;
  const editHandler = useCallback(dataToEdit => {
    dataToEdit.editAction(dataToEdit);
  }, []);
  return (
    <Wrapper
      pageTitle={header}
      classNames="confirmable-page"
      withBackButton={withBackButton}
    >
      {subtitle && (
        <p data-testid="subtitle" className="vads-u-font-family--serif">
          {subtitle}
        </p>
      )}
      <div className="vads-u-margin-top--3">
        <dl data-testid="demographics-fields">
          {dataFields.map((field, i, { length }) => (
            <React.Fragment key={field.key}>
              <dt className="vads-u-font-weight--bold vads-u-border-top--1px vads-u-padding-top--2 vads-u-margin-top--2 vads-u-border-color--gray-light">
                {field.title}
              </dt>
              <dd
                className={
                  i + 1 === length
                    ? 'vads-u-border-bottom--1px vads-u-border-color--gray-light vads-u-padding-bottom--2'
                    : ''
                }
              >
                {field.key in data && data[field.key] ? (
                  <DemographicItem demographic={data[field.key]} />
                ) : (
                  t('not-available')
                )}
                {isEditEnabled &&
                  field.editAction && (
                    <div>
                      <a
                        href={`#edit-${field.key}`}
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
            className="usa-button-primary usa-button-big"
            data-testid="yes-button"
            type="button"
          >
            {t('yes')}
          </button>
          <button
            onClick={noAction}
            className="usa-button-secondary vads-u-margin-top--2 usa-button-big"
            data-testid="no-button"
            type="button"
          >
            {t('no')}
          </button>
        </>
      )}
      {Footer && <Footer />}
    </Wrapper>
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
  isEditEnabled: PropTypes.bool,
  isLoading: PropTypes.bool,
  loadingMessageOverride: PropTypes.func,
  subtitle: PropTypes.string,
  withBackButton: PropTypes.bool,
};
export default ConfirmablePage;
