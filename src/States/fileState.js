import {
	atom,
} from 'recoil';

const secretjsState = atom({
  key: 'fileinfos',
  default: null,
});


export default secretjsState;