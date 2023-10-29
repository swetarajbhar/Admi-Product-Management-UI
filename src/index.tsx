import React from 'react';
import ReactDOM from 'react-dom';
import './styles/index.scss';
import Masterpage from './pages/Masterpage/Masterpage';
import reportWebVitals from './reportWebVitals';
ReactDOM.render(
	<React.StrictMode>
		<Masterpage />
	</React.StrictMode>,
	document.getElementById('root')
);

reportWebVitals();
