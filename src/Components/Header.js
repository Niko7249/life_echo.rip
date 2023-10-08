import WalletButton from "./WalletButton"

function Header() {
	return (
		<div className='h-[calc(100vh/12*0.8)] bg-[#211f2e] w-screen absolute top-0 flex justify-between items-center px-2 md:px-5 z-[10000]'>
			<div className='bg-slate-400 before:contents-[""] w-[]'></div>
			<div>
				<img className="md:w-[200px]" src="/Logo.png"></img>
			</div>
			<WalletButton/>
		</div>
	)
}

export default Header