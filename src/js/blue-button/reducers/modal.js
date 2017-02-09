const initialState = {
  title: null,
  content: null,
  visible: false,
};

export default function disclaimer(state = initialState, action) {
  switch (action.type) {
    case 'GLOSSARY_MODAL_OPENED':
      return {
        visible: true,
        title: `${action.holdLength} Day Hold`,
        content: action.holdExplanation,
      };
    case 'GLOSSARY_MODAL_CLOSED':
      return {
        visible: false,
        title: '',
        content: '',
      };
    default:
      return state;
  }
}
