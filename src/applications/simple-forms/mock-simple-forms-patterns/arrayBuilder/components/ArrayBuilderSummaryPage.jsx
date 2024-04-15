/* eslint-disable react/sort-prop-types */
import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import SchemaForm from '@department-of-veterans-affairs/platform-forms-system/SchemaForm';
import get from 'platform/utilities/data/get';
import FormNavButtons from '~/platform/forms-system/src/js/components/FormNavButtons';
import ArrayBuilderCards from './ArrayBuilderCards';
import { createArrayBuilderItemAddPath } from '../helpers';

function getUpdatedItemIndexFromPath() {
  const urlParams = new URLSearchParams(window.location?.search);
  const updatedValue = urlParams.get('updated');
  return updatedValue?.split('-')?.pop();
}

const SuccessAlert = ({ children }) => (
  <div className="vads-u-margin-top--2">
    <va-alert status="success" uswds>
      {children}
    </va-alert>
  </div>
);

const MaxItemsAlert = ({ children }) => (
  <div className="vads-u-margin-top--4">
    <va-alert status="warning" visible>
      <p className="vads-u-margin-y--0 vads-u-font-weight--normal">
        {children}
      </p>
    </va-alert>
  </div>
);

/**
 * @param {{
 *   arrayPath: string,
 *   nounSingular: string,
 *   nounPlural: string,
 *   isItemIncomplete: function,
 *   firstItemPagePath: string,
 *   titleHeaderLevel: string,
 *   maxItems: number,
 *   isReviewPage: boolean,
 *   getText: import('./arrayBuilderText').ArrayBuilderGetText
 *   required: boolean,
 * }} props
 * @returns {CustomPageType}
 */
export function ArrayBuilderSummaryPage({
  arrayPath,
  determineYesNoField,
  firstItemPagePath,
  getText,
  isItemIncomplete,
  isReviewPage,
  maxItems,
  nounPlural,
  nounSingular,
  required,
  titleHeaderLevel = '3',
}) {
  /** @type {CustomPageType} */
  function CustomPage(props) {
    const { uiSchema, schema } = props;
    const arrayData = get(arrayPath, props.data);
    const updateItemIndex = getUpdatedItemIndexFromPath();
    const updatedItemData =
      updateItemIndex != null ? arrayData?.[updateItemIndex] : null;
    const Heading = `h${titleHeaderLevel}`;
    const isMaxItemsReached = arrayData?.length >= maxItems;

    useEffect(
      () => {
        if (uiSchema && schema?.properties && isMaxItemsReached) {
          const yesNoField = determineYesNoField(uiSchema);
          // If the user has reached the max items, we want to make sure the
          // yes/no field is set to false because it will be hidden yet required.
          // So we need to make sure it's false so it doesn't block the continue button.
          if (props.data[yesNoField] !== false) {
            props.setFormData({ ...props.data, [yesNoField]: false });
          }
        }
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [arrayData?.length],
    );

    function addAnotherItemButtonClick() {
      const index = arrayData ? arrayData.length : 0;
      const path = createArrayBuilderItemAddPath({
        path: firstItemPagePath,
        index,
        isReview: isReviewPage,
      });

      props.goToPath(path, {
        force: true,
      });
    }

    const Title = (
      <>
        <Heading className="vads-u-color--gray-dark vads-u-margin-top--0">
          {getText('summaryTitle', updatedItemData)}
        </Heading>
      </>
    );

    const Cards = (
      <>
        {updatedItemData && (
          <SuccessAlert>
            {getText('alertItemUpdated', updatedItemData)}
          </SuccessAlert>
        )}
        <ArrayBuilderCards
          cardDescription={getText('cardDescription', updatedItemData)}
          arrayPath={arrayPath}
          nounSingular={nounSingular}
          nounPlural={nounPlural}
          isIncomplete={isItemIncomplete}
          editItemPathUrl={firstItemPagePath}
          getText={getText}
          required={required}
          goAddItem={addAnotherItemButtonClick}
        />
      </>
    );

    if (isReviewPage) {
      return (
        <>
          {arrayData?.length ? (
            Title
          ) : (
            <>
              <div className="form-review-panel-page-header-row">
                <h4 className="form-review-panel-page-header vads-u-font-size--h5">
                  {getText('summaryTitle', updatedItemData)}
                </h4>
              </div>
              <dl className="review">
                <div className="review-row">
                  <dt>{/* todo */}</dt>
                  <dd>
                    <span
                      className="dd-privacy-hidden"
                      data-dd-action-name="data value"
                    >
                      {/* todo */}
                    </span>
                  </dd>
                </div>
              </dl>
            </>
          )}
          {Cards}
          {!isMaxItemsReached && (
            <div className="vads-u-margin-top--2">
              <va-button
                text={getText('reviewAddButtonText', updatedItemData)}
                onClick={addAnotherItemButtonClick}
                primary
                uswds
              />
            </div>
          )}
        </>
      );
    }

    if (arrayData?.length > 0) {
      uiSchema['ui:title'] = (
        <>
          {Title}
          {isMaxItemsReached && (
            <MaxItemsAlert>
              {getText('alertMaxItems', updatedItemData)}
            </MaxItemsAlert>
          )}
        </>
      );
      uiSchema['ui:description'] = Cards;
    } else {
      uiSchema['ui:title'] = undefined;
      uiSchema['ui:description'] = undefined;
    }

    if (schema?.properties && maxItems && arrayData?.length >= maxItems) {
      const yesNoField = determineYesNoField(uiSchema);
      schema.properties[yesNoField]['ui:hidden'] = true;
    }

    return (
      <SchemaForm
        name={props.name}
        title={props.title}
        data={props.data}
        appStateData={props.appStateData}
        schema={schema}
        uiSchema={uiSchema}
        pagePerItemIndex={props.pagePerItemIndex}
        formContext={props.formContext}
        trackingPrefix={props.trackingPrefix}
        onChange={props.onChange}
        onSubmit={props.onSubmit}
      >
        <>
          {/* contentBeforeButtons = save-in-progress links */}
          {props.contentBeforeButtons}
          <FormNavButtons
            goBack={props.goBack}
            goForward={props.onContinue}
            submitToContinue
          />
          {props.contentAfterButtons}
        </>
      </SchemaForm>
    );
  }

  CustomPage.propTypes = {
    name: PropTypes.string.isRequired,
    schema: PropTypes.object,
    uiSchema: PropTypes.object,
    appStateData: PropTypes.object,
    contentAfterButtons: PropTypes.node,
    contentBeforeButtons: PropTypes.node,
    data: PropTypes.object,
    formContext: PropTypes.object,
    goBack: PropTypes.func,
    onChange: PropTypes.func,
    onContinue: PropTypes.func,
    onReviewPage: PropTypes.bool,
    onSubmit: PropTypes.func,
    pagePerItemIndex: PropTypes.number,
    title: PropTypes.string,
    trackingPrefix: PropTypes.string,
  };

  return CustomPage;
}
