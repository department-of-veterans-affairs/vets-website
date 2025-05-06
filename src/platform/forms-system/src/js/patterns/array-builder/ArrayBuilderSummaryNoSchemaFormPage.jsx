import React from 'react';
import PropTypes from 'prop-types';
import FormNavButtons from '~/platform/forms-system/src/js/components/FormNavButtons';

// NoSchemaFormPage = No uiSchema or schema
const ArrayBuilderSummaryNoSchemaFormPage = ({
  addAnotherItemButtonClick,
  arrayBuilderOptions,
  arrayData,
  customPageProps,
  description,
  hideAdd,
  title,
  hasIncompleteCards,
  onContinue,
}) => {
  function onSubmit(e) {
    e.preventDefault();
    customPageProps.onSubmit({ formData: customPageProps.data });
  }

  const NavButtons = customPageProps.NavButtons || FormNavButtons;

  return (
    <form className="vads-u-margin-y--2" onSubmit={onSubmit}>
      {title}
      {description}
      {!hideAdd &&
        arrayBuilderOptions.useLinkInsteadOfYesNo && (
          <va-link-action
            data-action="add"
            text={arrayBuilderOptions.getText(
              'summaryAddLinkText',
              arrayData,
              customPageProps.data,
            )}
            onClick={addAnotherItemButtonClick}
            name={`${arrayBuilderOptions.nounPlural}AddLink`}
          />
        )}
      {!hideAdd &&
        arrayBuilderOptions.useButtonInsteadOfYesNo && (
          <va-button
            data-action="add"
            text={arrayBuilderOptions.getText(
              'summaryAddButtonText',
              arrayData,
              customPageProps.data,
            )}
            onClick={addAnotherItemButtonClick}
            name={`${arrayBuilderOptions.nounPlural}AddButton`}
            primary
            uswds
          />
        )}
      {customPageProps.pageContentBeforeButtons}
      {customPageProps.contentBeforeButtons}
      <NavButtons
        goBack={customPageProps.goBack}
        goForward={onContinue}
        submitToContinue={!hasIncompleteCards}
      />
      {customPageProps.contentAfterButtons}
    </form>
  );
};

export default ArrayBuilderSummaryNoSchemaFormPage;

ArrayBuilderSummaryNoSchemaFormPage.propTypes = {
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
    NavButtons: PropTypes.func,
  }),
  description: PropTypes.node,
  hasIncompleteCards: PropTypes.bool,
  hideAdd: PropTypes.bool,
  title: PropTypes.node,
  onContinue: PropTypes.func,
};
