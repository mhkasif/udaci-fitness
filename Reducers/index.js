import { RECIEVE_ENTRIES, ADD_ENTRY } from "../actions/index";
const entries = (state = {}, action) => {
  switch (action.type) {
    case RECIEVE_ENTRIES:
      return {
          ...states,...action.entries
      };

    case ADD_ENTRY:
      return {

        ...state,...action.entry
      };

    default:
      state;
  }
};
export default entries