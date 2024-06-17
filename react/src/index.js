import React from 'react';
import ReactDOM from 'react-dom';
import { NextUIProvider } from '@nextui-org/react';
import App from './App';

ReactDOM.render(
  <NextUIProvider>
    <App />
  </NextUIProvider>,
  document.getElementById('root')
);
