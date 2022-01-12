export const EditProfileReducers = (state, action) => {
  switch (action.type) {
    case 'UPDATE_PROFILE':
      return {...state, token: action.token, userId: action.userId};
    default:
      return state;
  }
};
