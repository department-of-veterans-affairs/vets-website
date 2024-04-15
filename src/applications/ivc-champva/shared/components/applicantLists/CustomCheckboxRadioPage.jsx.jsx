/**
 * Custom checkbox page for use with the applicants array inside list loop.
 * Allows for checkboxgroup with custom label text.
 */
import React, { useEffect, useState } from 'react';
import { VaCheckboxGroup } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { titleUI } from 'platform/forms-system/src/js/web-component-patterns';
import FormNavButtons from 'platform/forms-system/src/js/components/FormNavButtons';
import PropTypes from 'prop-types';
import { CustomCheckboxRadioReviewPage } from '../CustomCheckboxRadioReviewPage';

export function CheckboxCustomLabelsReviewPage(props) {
  return CustomCheckboxRadioReviewPage({
    ...props,
    useLabels: true,
    generateOptions: props.genOp,
  });
}

export default function CheckboxCustomLabelsPage({
  data,
  genOp,
  setFormData,
  goBack,
  goForward,
  keyname,
  pagePerItemIndex,
  updatePage,
  onReviewPage,
}) {
  const [allLabels, setAllLabels] = useState([]);
  const [stringArr, setStringArr] = useState('');
  const [error, setError] = useState(undefined);
  const [dirty, setDirty] = useState(false);
  const navButtons = <FormNavButtons goBack={goBack} submitToContinue />;
  // eslint-disable-next-line @department-of-veterans-affairs/prefer-button-component
  const updateButton = <button type="submit">Update page</button>;
  const { labels, customTitle, customHint, description } = genOp({
    data,
    pagePerItemIndex,
  });

  useEffect(
    () => {
      setAllLabels(
        labels.map(label =>
          data?.applicants?.[pagePerItemIndex]?.[keyname]?.includes(
            label.value,
          ),
        ),
      );
      setStringArr(data?.applicants?.[pagePerItemIndex]?.[keyname]);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [data],
  );

  const handlers = {
    validate() {
      let isValid = true;
      if (!stringArr) {
        setError('This field is required');
        isValid = false;
      } else {
        setError(null);
      }
      return isValid;
    },
    onGroupChange: event => {
      setDirty(true);
      const checkboxIndex = Number(event.target.dataset.index);
      const isChecked = event.detail.checked;

      const newData = allLabels.map(
        (val, index) => (index === checkboxIndex ? isChecked : val),
      );

      const dataArray = labels.reduce((result, label, index) => {
        if (newData[index]) {
          result.push(label.value);
        }
        return result;
      }, []);

      setAllLabels(newData);
      setStringArr(dataArray.join(', '));
    },

    onGoForward: event => {
      event.preventDefault();
      if (!handlers.validate()) return;
      const testVal = { ...data };
      testVal.applicants[pagePerItemIndex][keyname] = stringArr;
      setFormData(testVal); // Commit changes to the actual formdata
      if (onReviewPage) updatePage();
      goForward(data);
    },
  };

  useEffect(
    () => {
      if (dirty) handlers.validate();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [data, stringArr],
  );

  return (
    <>
      {titleUI(customTitle || '')['ui:title']}

      <form onSubmit={handlers.onGoForward}>
        <VaCheckboxGroup
          label={description || ''}
          hint={customHint || 'You can select more than one'}
          error={error}
          required
          uswds
          onVaChange={handlers.onGroupChange}
        >
          {labels.map((el, index) => (
            <va-checkbox
              key={el.title}
              data-index={index}
              label={el.title}
              checked={allLabels?.[index]}
            />
          ))}
        </VaCheckboxGroup>
        {onReviewPage ? updateButton : navButtons}
      </form>
    </>
  );
}

CheckboxCustomLabelsReviewPage.propTypes = {
  props: PropTypes.object,
};

CheckboxCustomLabelsPage.propTypes = {
  data: PropTypes.object,
  genOp: PropTypes.func,
  goBack: PropTypes.func,
  goForward: PropTypes.func,
  keyname: PropTypes.string,
  pagePerItemIndex: PropTypes.any,
  setFormData: PropTypes.func,
  updatePage: PropTypes.func,
  onReviewPage: PropTypes.bool,
};
