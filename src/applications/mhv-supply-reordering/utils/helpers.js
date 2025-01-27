import { format } from 'date-fns';
import {
  checkboxGroupSchema,
  checkboxGroupUI as checkboxGroupUiFn,
} from '@department-of-veterans-affairs/platform-forms-system/web-component-patterns';

const formatDate = dateString =>
  dateString ? format(new Date(dateString), 'MMMM d, yyyy') : undefined;

const numberOfSuppliesPhrase = count => {
  if (count > 1) return `${count} supplies`;
  if (count === 1) return `${count} supply`;
  return 'no supplies';
};

const sortSupplies = supplies =>
  supplies?.sort((a, b) => a.productName.localCompare(b.productName));

const suppliesReplaceSchema = formData =>
  checkboxGroupSchema((formData?.supplies || []).map(s => s.productId));

const suppliesUpdateUiSchema = formData =>
  (formData?.supplies || []).reduce(
    (acc, { deviceName, lastOrderDate, productId, productName, quantity }) => ({
      ...acc,
      [productId]: {
        'ui:title': productName,
        'ui:description': `Device: ${deviceName}\nQuantity: ${quantity}\nLast ordered on ${formatDate(
          lastOrderDate,
        )}`,
      },
    }),
    {},
  );

const suppliesUi = ({
  title,
  tile,
  description,
  hint,
  replaceSchema,
  updateUiSchema,
  checkboxGroupUI = checkboxGroupUiFn,
}) =>
  checkboxGroupUI({
    title,
    tile,
    description,
    hint,
    labels: {},
    required: false,
    replaceSchema,
    updateUiSchema,
  });

export {
  formatDate,
  numberOfSuppliesPhrase,
  sortSupplies,
  suppliesReplaceSchema,
  suppliesUpdateUiSchema,
  suppliesUi,
};
