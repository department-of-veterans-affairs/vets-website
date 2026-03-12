import veteranName from '../../pages/veteranName';
import veteranIdentification from '../../pages/veteranIdentification';
import veteranAdditional from '../../pages/veteranAdditional';

/** @type {ChapterSchema} */
export default {
  title: 'Veteran’s information',
  pages: {
    veteranName: {
      title: 'Veteran’s name and date of birth',
      path: 'veteran',
      uiSchema: veteranName.uiSchema,
      schema: veteranName.schema,
    },
    veteranIdentification: {
      title: 'Veteran’s identification information',
      path: 'veteran-identification',
      uiSchema: veteranIdentification.uiSchema,
      schema: veteranIdentification.schema,
    },
    veteranIdentificationAdditional: {
      title: 'Additional Veteran information',
      path: 'veteran-additional-information',
      uiSchema: veteranAdditional.uiSchema,
      schema: veteranAdditional.schema,
    },
  },
};
