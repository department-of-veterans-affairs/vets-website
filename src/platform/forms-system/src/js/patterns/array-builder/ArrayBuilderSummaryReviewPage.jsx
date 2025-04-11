import React from 'react';
import PropTypes from 'prop-types';

const ArrayBuilderSummaryReviewPage = ({
  customPageProps,
  arrayBuilderOptions,
  arrayData,
  addAnotherItemButtonClick,
  updatedItemData,
  Alerts,
  Cards,
  Title,
  hideAdd,
}) => {
  return (
    <>
      {arrayData?.length ? (
        <Title textType="summaryTitle" />
      ) : (
        <>
          <div className="form-review-panel-page-header-row">
            <h4
              className="form-review-panel-page-header vads-u-font-size--h5"
              data-title-for-noun-singular={`${arrayBuilderOptions.nounSingular}`}
            >
              {arrayBuilderOptions.getText(
                'summaryTitle',
                updatedItemData,
                customPageProps.data,
              )}
            </h4>
          </div>
          <dl className="review">
            <div className="review-row">
              <dt>
                {arrayBuilderOptions.getText(
                  'yesNoBlankReviewQuestion',
                  null,
                  customPageProps.data,
                )}
              </dt>
              <dd>
                <span
                  className="dd-privacy-hidden"
                  data-dd-action-name="data value"
                >
                  No
                </span>
              </dd>
            </div>
          </dl>
        </>
      )}
      {arrayBuilderOptions.getText(
        'summaryDescription',
        null,
        customPageProps.data,
      ) && (
        <span className="vads-u-font-family--sans vads-u-font-weight--normal vads-u-display--block">
          {arrayBuilderOptions.getText(
            'summaryDescription',
            null,
            customPageProps.data,
          )}
        </span>
      )}
      <Alerts />
      <Cards />
      {!hideAdd && (
        <div className="vads-u-margin-top--2">
          <va-button
            data-action="add"
            text={arrayBuilderOptions.getText(
              'reviewAddButtonText',
              arrayData,
              customPageProps.data,
            )}
            onClick={addAnotherItemButtonClick}
            name={`${arrayBuilderOptions.nounPlural}AddButton`}
            primary
            uswds
          />
        </div>
      )}
    </>
  );
};

export default ArrayBuilderSummaryReviewPage;

ArrayBuilderSummaryReviewPage.propTypes = {
  Alerts: PropTypes.func,
  Cards: PropTypes.func,
  Title: PropTypes.func,
  addAnotherItemButtonClick: PropTypes.func,
  arrayBuilderOptions: PropTypes.object,
  arrayData: PropTypes.array,
  customPageProps: PropTypes.shape({
    onSubmit: PropTypes.func,
    data: PropTypes.object,
    pageContentBeforeButtons: PropTypes.node,
    contentBeforeButtons: PropTypes.node,
    goBack: PropTypes.func,
    onContinue: PropTypes.func,
    contentAfterButtons: PropTypes.node,
  }),
  hideAdd: PropTypes.bool,
  updatedItemData: PropTypes.object,
};
