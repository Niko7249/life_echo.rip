import React, { useCallback, useEffect, useRef, useState } from 'react'
import {
	useRecoilState,
} from 'recoil';
import { walletState, walletInfoState, secretjsState } from '../States';

import { SecretNetworkClient } from "secretjs";

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function WalletButton() {
	const [wallet, setWallet] = useRecoilState(walletState);
	const [secretjs, setSecretJs] = useRecoilState(secretjsState);
	const [walletInfo,setWalletInfo ] = useRecoilState(walletInfoState);
	const [showDropdown, setShowDropdown] = useState(false);

	const [callable, setCallable] = useState(false);
	const CHAIN_ID = "pulsar-3";
	const url = "https://lcd.mainnet.secretsaturn.net";
	const textReducer = useRef(null);

	useEffect(()=>{
		(async()=>{
			while (
				!window.keplr ||
				!window.getEnigmaUtils ||
				!window.getOfflineSignerOnlyAmino
			) {
				await sleep(50);
			}
			if(!wallet && !callable && !walletInfo)
				setCallable(true);
		})()
	}, [])

	// First Call On Click
	const handleClick = useCallback(()=>{
		(async ()=>{
				if(callable){
					await window.keplr.enable(CHAIN_ID);
					setCallable(false)
					setWallet(window.keplr.getOfflineSignerOnlyAmino(CHAIN_ID));
				}
			}
		)();
		console.log(showDropdown, callable);
		if(!callable)
			setShowDropdown(!showDropdown);
	}, [wallet, callable, showDropdown])

	// WHEN WALLET READY
	useEffect(()=>{
		(async()=>{
			if(wallet && !walletInfo)
				setWalletInfo(await wallet.getAccounts());
		})()
	},[wallet])

	//CALL TO WHEN WalletInfo IS READY
	useEffect(()=>{
		if(walletInfo){
			console.log(walletInfo[0]);
			setSecretJs(new SecretNetworkClient({
				url,
				chainId: CHAIN_ID,
				wallet: wallet,
				walletAddress: walletInfo[0].address,
				encryptionUtils: window.keplr.getEnigmaUtils(CHAIN_ID),
			}));
		}
	}, [walletInfo])


	return (
		<div className='relative z-[100000]'>
			<button onClick={handleClick} id="dropdownDividerButton" data-dropdown-toggle="dropdownDivider" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" type="button">
			<span className='text-xs' ref={textReducer}>
				
				{
						walletInfo && walletInfo[0]?.address ? 
						walletInfo[0]?.address.slice(0, 15)+"..." : "CONNECT"
					}
				</span>
			{walletInfo && walletInfo[0]?.address && <svg className="w-2.5 h-2.5 ml-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
				<path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4"/>
			</svg>}
		</button>
		<div id="dropdownDivider" className={(showDropdown === true ? "" : "hidden ")+" z-[100000] bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 dark:divide-gray-600 absolute md:mt-2 mt-1"}>
			<ul className="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownDividerButton">
				<li>
					<a href="#" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Dashboard</a>
				</li>
			</ul>
			<div className="py-2">
				<a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">Separated link</a>
			</div>
		</div>
		</div>
	)
}

export default WalletButton


