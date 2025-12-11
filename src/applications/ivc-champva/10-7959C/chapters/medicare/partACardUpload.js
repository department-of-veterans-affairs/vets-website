import { titleUI } from 'platform/forms-system/src/js/web-component-patterns';
import { createCardUploadSchema } from '../../../shared/components/fileUploads/genericCardUpload';
import MedicarePartADescription from '../../components/FormDescriptions/MedicarePartADescription';

const { uiSchema, schema } = createCardUploadSchema({
  frontProperty: 'applicantMedicarePartAFrontCard',
  backProperty: 'applicantMedicarePartABackCard',
  frontImageSrc: '/img/ivc-champva/part_a_card_front_high_res.png',
  backImageSrc: '/img/ivc-champva/medicare_back_high_res.png',
  frontAltText:
    'Red, white, and blue Medicare card. It states “Medicare Health Insurance” and lists the Medicare number and coverage dates for Part A hospital coverage.',
  backAltText:
    'Back of a red, white, and blue Medicare card. Includes card usage instructions and the Medicare phone number and website.',
  cardTitle: 'Sample of Medicare Part A card',
  frontLabel: 'Upload front of Part A Medicare card',
  backLabel: 'Upload back of Part A Medicare card',
  frontAttachmentId: 'Front of Medicare Parts A or B card',
  backAttachmentId: 'Back of Medicare Parts A or B card',
});

export default {
  uiSchema: {
    ...titleUI('Upload Medicare Part A card', MedicarePartADescription),
    ...uiSchema,
  },
  schema,
};
