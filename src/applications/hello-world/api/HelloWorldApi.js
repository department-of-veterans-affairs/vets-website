import axios from 'axios';

const HelloWorldApi = {
  submitForm: async firstField => {
    await axios.post(
      `https://localhost:3000/test/message/:message`,
      firstField,
    );
  },
};

export default HelloWorldApi;
