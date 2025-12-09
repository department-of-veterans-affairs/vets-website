import { titleUI } from 'platform/forms-system/src/js/web-component-patterns';
import { createCardUploadSchema } from '../../../shared/components/fileUploads/genericCardUpload';
import MedicarePartBDescription from '../../components/FormDescriptions/MedicarePartBDescription';

const { uiSchema, schema } = createCardUploadSchema({
  frontProperty: 'applicantMedicarePartBFrontCard',
  backProperty: 'applicantMedicarePartBBackCard',
  frontImageSrc: '/img/ivc-champva/part_b_card_front_high_res.png',
  backImageSrc: '/img/ivc-champva/medicare_back_high_res.png',
  frontAltText:
    'Red, white, and blue Medicare card. It states “Medicare Health Insurance” and lists the Medicare number and coverage dates for Part B medical coverage.',
  backAltText:
    'Back of a red, white, and blue Medicare card. Includes card usage instructions and the Medicare phone number and website.',
  cardTitle: 'Sample of Medicare Part B card',
  frontLabel: 'Upload front of Part B Medicare card',
  backLabel: 'Upload back of Part B Medicare card',
  frontAttachmentId: 'Front of Medicare Parts A or B card',
  backAttachmentId: 'Back of Medicare Parts A or B card',
});

export default {
  uiSchema: {
    ...titleUI('Upload Medicare Part B card', MedicarePartBDescription),
    ...uiSchema,
  },
  schema,
};
