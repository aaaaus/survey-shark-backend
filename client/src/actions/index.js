import axios from 'axios';

import { FETCH_USER } from './types';

// export const fetchUser = () => {
//   return function(dispatch) {
//     axios
//       .get('/api/current_user')
//       .then(res => dispatch({ type: FETCH_USER, payload: res }));
//   };
// };

//REFACTOR: with arrow functions, if only expression is return statement, you can drop curly braces and return statement
export const fetchUser = () => async dispatch => {
  const res = await axios.get('/api/current_user');
  dispatch({ type: FETCH_USER, payload: res.data });
};
