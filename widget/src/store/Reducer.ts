export const Reducer = (state:any, action:any) => {

  const persist = (payload:any) => {
    localStorage.setItem('store', JSON.stringify(payload));
    return payload;
  }

  switch (action.type) {
    case 'USERNAME':
      return persist({
        ...state,
        username: action.payload
      });

    default:
      return state;
  }
};
