const initialState = {
  refill: {
    visible: false,
    content: null
  },
  glossary: {
    visible: false,
    content: null
  }
};

export default function modal(state = initialState, action) {
  switch (action.type) {
    case 'OPEN_REFILL_MODAL':
      return {
        refill: {
          visible: true,
          content: null
        },
        glossary: {
          visible: false,
          content: null
        }
      };
    case 'CLOSE_REFILL_MODAL':
      return {
        refill: {
          visible: false,
          content: null
        },
        glossary: {
          visible: false,
          content: null
        }
      };
    case 'CLOSE_GLOSSARY_MODAL':
      return {
        refill: {
          visible: false,
          content: null
        },
        glossary: {
          visible: false,
          content: action.content
        }
      };
    case 'OPEN_GLOSSARY_MODAL':
      return {
        refill: {
          visible: false,
          content: null
        },
        glossary: {
          visible: true,
          content: action.content
        }
      };
    default:
      return state;
  }
}
