import WalletButton from "./WalletButton"

function Header() {
	return (
		<div className='h-[calc(100vh/12*0.8)] bg-red-500 w-screen sticky top-0 flex justify-between items-center px-2 md:px-5 z-[10000]'>
			<div className='bg-slate-400 before:contents-[""]'></div>
			<div>
				Life Echo
			</div>
			<WalletButton/>
		</div>
	)
}

export default Header