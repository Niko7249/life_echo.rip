import {
	atom,
} from 'recoil';
import localStorageEffect from './localStorageEffect';

const secretjsState = atom({
  key: 'secretjs',
  default: null,
	effects: [
    localStorageEffect('secret_state'),
  ]
});


export default secretjsState;