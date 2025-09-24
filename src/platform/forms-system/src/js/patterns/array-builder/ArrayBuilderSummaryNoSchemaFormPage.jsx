import React from 'react';
import PropTypes from 'prop-types';
import FormNavButtons from '~/platform/forms-system/src/js/components/FormNavButtons';
import { validateIncompleteItems } from './helpers';

// NoSchemaFormPage = No uiSchema or schema
const ArrayBuilderSummaryNoSchemaFormPage = ({
  addAnotherItemButtonClick,
  arrayBuilderOptions,
  arrayData,
  customPageProps,
  description,
  hideAdd,
  isItemIncomplete,
  title,
}) => {
  function onSubmit(e) {
    e.preventDefault();

    const isValid = validateIncompleteItems({
      arrayData,
      isItemIncomplete,
      nounSingular: arrayBuilderOptions.nounSingular,
      arrayPath: arrayBuilderOptions.arrayPath,
    });

    if (!isValid) {
      return;
    }

    customPageProps.onSubmit({ formData: customPageProps.data });
  }

  const NavButtons = customPageProps.NavButtons || FormNavButtons;

  return (
    <form className="vads-u-margin-y--2" onSubmit={onSubmit}>
      {title}
      {description}
      {!hideAdd &&
        arrayBuilderOptions.useLinkInsteadOfYesNo && (
          <div className={arrayData?.length ? 'vads-u-margin-y--2' : ''}>
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
          </div>
        )}
      {!hideAdd &&
        arrayBuilderOptions.useButtonInsteadOfYesNo && (
          <div className={arrayData?.length ? 'vads-u-margin-y--2' : ''}>
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
          </div>
        )}
      {customPageProps.pageContentBeforeButtons}
      {customPageProps.contentBeforeButtons}
      <NavButtons
        goBack={customPageProps.goBack}
        goForward={customPageProps.onContinue}
        submitToContinue
        useWebComponents={
          customPageProps.formOptions?.useWebComponentForNavigation
        }
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
    formOptions: PropTypes.shape({
      useWebComponentForNavigation: PropTypes.bool,
    }),
  }),
  description: PropTypes.node,
  hideAdd: PropTypes.bool,
  isItemIncomplete: PropTypes.func,
  title: PropTypes.node,
};
