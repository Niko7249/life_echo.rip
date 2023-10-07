import React from 'react';
import ReactDOM from 'react-dom/client';
import "./index.css";
import App from './App';
import reportWebVitals from './reportWebVitals';

import { RecoilRoot, atom, useRecoilSnapshot } from "recoil";
import { useEffect } from "react";

function DebugObserver(){
  const snapshot = useRecoilSnapshot();
  useEffect(() => {
    console.debug('The following atoms were modified:');
    for (const node of snapshot.getNodes_UNSTABLE({isModified: true})) {
      console.debug(node.key, snapshot.getLoadable(node));
    }
  }, [snapshot]);

  return null;
}

function RecoilContextProvider({ children }) {
  return <RecoilRoot><DebugObserver/>{children}</RecoilRoot>;
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RecoilContextProvider>
      <App />
    </RecoilContextProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
