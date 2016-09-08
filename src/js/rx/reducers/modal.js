const initialState = {
  refill: {
    visible: false,
    prescription: null
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
          prescription: action.rx
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
          prescription: null
        },
        glossary: {
          visible: false,
          content: null
        }
      };
    case 'OPEN_GLOSSARY_MODAL':
      return {
        refill: {
          visible: false,
          prescription: null
        },
        glossary: {
          visible: true,
          content: action.content
        }
      };
    case 'CLOSE_GLOSSARY_MODAL':
      return {
        refill: {
          visible: false,
          prescription: null
        },
        glossary: {
          visible: false,
          content: null
        }
      };
    default:
      return state;
  }
}
