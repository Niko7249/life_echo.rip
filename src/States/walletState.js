import {
	atom,
} from 'recoil';
import localStorageEffect from './localStorageEffect';

const wallet = atom({
  key: 'wallet',
  default: null,
	effects: [
    localStorageEffect('wallet'),
  ]
});

export default wallet;