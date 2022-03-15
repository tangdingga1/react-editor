// for dev
import React from 'react';
import ReactDOM from 'react-dom';
import Editor from './lib';

ReactDOM.render(
  <React.StrictMode>
    <Editor menu={[{ type: 'word' }, { type: 'price' }, { type: 'image' }]} />
  </React.StrictMode>,
  document.getElementById('root')
);
