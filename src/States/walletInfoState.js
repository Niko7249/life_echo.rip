import {
	atom,
} from 'recoil';
import localStorageEffect from './localStorageEffect';

const walletInfoState = atom({
  key: 'walletInfo',
  default: null,
  effects: [
    localStorageEffect('wallet_info'),
  ]
});

export default walletInfoState