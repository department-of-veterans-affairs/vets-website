import { format } from 'date-fns';
import {
  checkboxGroupSchema,
  checkboxGroupUI,
} from '@department-of-veterans-affairs/platform-forms-system/web-component-patterns';

const formatDate = dateString => format(new Date(dateString), 'MMMM d, yyyy');

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
  description,
  hint,
  replaceSchema,
  updateUiSchema,
}) =>
  checkboxGroupUI({
    title,
    description,
    hint,
    labels: {},
    required: false,
    replaceSchema,
    updateUiSchema,
  });

export {
  formatDate,
  suppliesReplaceSchema,
  suppliesUpdateUiSchema,
  suppliesUi,
};
