const initialDocumentsState = {
  isCameraActivated: true,
};

export default documents = (state = initialDocumentsState, action) => {
  switch (action.type) {
    case 'Login':
      return { ...state, isCameraActivated: true };
    case 'Logout':
      return { ...state, isCameraActivated: false };
    default:
      return state;
  }
}