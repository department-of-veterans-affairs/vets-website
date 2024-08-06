export const createFormConfig = ({ chapters, formId, title }) => {
  return {
    formId,
    title,
    subTitle: `VA Form ${formId}`,
    chapters,
  };
};
