import {Reducer} from './Reducer';
import React, {createContext, useReducer} from 'react';

const initialState:any = {
  username:''
};

const useContext = JSON.parse(localStorage.getItem('store') || '{}');
const useState:any = Object.keys(useContext).length ? useContext : initialState

export const Context = createContext(useState);
export const Store = (component: {children: React.ReactNode}) => {
  const [state, dispatch] = useReducer(Reducer, useState);
  return <Context.Provider value={[state, dispatch]}>{component.children}</Context.Provider>;
};
