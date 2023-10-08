import React, { useCallback, useState, useEffect } from 'react'
import { fileState, secretjsState, walletInfoState } from './States';
import {
  useRecoilState,
} from 'recoil';
import FileUpload from './Components/FileUpload';
import { makeStorageClient } from "./Web3StorageInit";
import AES from 'crypto-js/aes';
import CryptoJS, {iv} from 'crypto-js';

function Dashboard() {
	const [walletInfo, _ ] = useRecoilState(walletInfoState);
	const [secretjs, _a ] = useRecoilState(secretjsState);
	const [showModalAdd, setShowModalAdd] = useState();
	const [showModalRetrive, setShowModalRetrive] = useState(-1);
  const [fileInfo, setFileInfo] = useRecoilState(fileState);
  const [tokens, setTokens] = useState()
  const [nftData, setNftData] = useState([])
  const [fileReader, setFileReader] = useState();

  useEffect(()=>{
    setFileReader(new FileReader());
      (async()=>{
        let tokens_res =await secretjs.query.compute.queryContract({
          contract_address: "secret1xatnz695lyxku7a0excjje3l6pj78cul466nkt",
          code_hash: "0x44aa28d75c0b279311cacc8531a194cdf8403a6fcf3183054d821615cb0c3323", // optional but way faster
          query: { all_tokens: {} },
        });
        setTokens(tokens_res.token_list.tokens);
      })()
  },[secretjs])

  const storeFiles = useCallback(async ()=>{
    const client = makeStorageClient()
    const cid = await client.put([fileInfo?.file])
    setFileInfo({...fileInfo, cid})
    const mintMsg = await secretjs.tx.snip721.mint(
      {
        contract_address : "secret1xatnz695lyxku7a0excjje3l6pj78cul466nkt",
        sender: walletInfo[0].address,
        msg: {
          mint_nft: {
            private_metadata: {
              "secret_key": fileInfo.cryptedPass,
              "alg": "SHA256",
              "data": fileInfo.cid
            }
          },
        },
      },
      {
        gasLimit: 200_000,
      },
    );
    console.log(mintMsg);
    await secretjs.tx.snip721.setViewingKey(
      {
        contract_address: "secret1xatnz695lyxku7a0excjje3l6pj78cul466nkt",
        sender: walletInfo[0].address,
        msg: {
          set_viewing_key: {
            key: "hello",
          },
        },
      },
      {
        gasLimit: 100_000,
      },
    );
    let tokens_res =await secretjs.query.compute.queryContract({
      contract_address: "secret1xatnz695lyxku7a0excjje3l6pj78cul466nkt",
      code_hash: "0x44aa28d75c0b279311cacc8531a194cdf8403a6fcf3183054d821615cb0c3323", // optional but way faster
      query: { all_tokens: {} },
    });
    setTokens([...tokens,tokens_res.token_list.tokens])
    setFileInfo({})
    // console.log(tokens);
  }, [fileInfo])


  async function getNftData(token_id){
    let tokens_res = await secretjs.query.compute.queryContract({
      contract_address: "secret1xatnz695lyxku7a0excjje3l6pj78cul466nkt",
      code_hash: "0x44aa28d75c0b279311cacc8531a194cdf8403a6fcf3183054d821615cb0c3323",
      query: {private_metadata: {token_id, viewer: {address: walletInfo[0].address, viewing_key: "hello"}}}});
    if(tokens_res?.private_metadata){
      const client = makeStorageClient()
      const res = await client.get(tokens_res.private_metadata.data)
      console.log(`Got a response! [${res.status}] ${res.statusText}`)
      if (!res.ok) {
        throw new Error(`failed to get ${tokens_res.private_metadata.data}`)
      }
      const files = await res.files()
      const text = await files[0].text()
      const decrypted = AES.decrypt(text, tokens_res.private_metadata.secret_key).toString()
      console.log(decrypted);
      setNftData([...nftData, {content: decrypted}])
      // handleFile(await res.files(), tokens_res.private_metadata.secret_key)
    }
  }
  // async function retrieve (cid) {
  //   const client = makeStorageClient()
  //   const res = await client.get(cid)
  //   console.log(`Got a response! [${res.status}] ${res.statusText}`)
  //   if (!res.ok) {
  //     throw new Error(`failed to get ${cid}`)
  //   }
  
  //   // request succeeded! do something with the response object here...
  // }
	return (
		<div className='bg-slate-400 w-screen h-[calc(100vh-calc(100vh/12*0.8))] mt-[calc(100vh/12*0.8)] md:p-32 p-16 relative overflow-y-scroll flex flex-row justify-between flex-wrap content-between'>
			{!walletInfo && <div>
			NOT CONNECTED</div>}
      {walletInfo && tokens?.map(el=><div className='md:w-[30%] w-[45%] h-2/5 border-black hover:cursor-pointer mb-10 rounded-xl mx-4 relative bg-img' onClick={ nftData[el] ? ()=>setShowModalRetrive(el) : null}>
        <div className='absolute rounded-full w-12 h-12 bg-black bottom-[-10%] right-[-10%] z-[20]' onClick={()=>getNftData(el)}>

        </div>
      </div>)}
			{walletInfo && <div className={'md:w-[30%] w-[45%] h-2/5 border-black  hover:cursor-pointer mb-10 rounded-xl bg-img'} onClick={() => setShowModalAdd(true)}>
        <div className={"bg-[#0000006a] w-full h-full rounded-2xl flex justify-center items-center hover:cursor-pointer"}>
        <svg  xmlns="http://www.w3.org/2000/svg" height="4em" viewBox="0 0 448 512">
        <path fill='#ffff' d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z"/></svg>
        </div>
      </div>}
			{showModalAdd ? (
        <>
          <div
            className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
          >
						<div className='z-[10] bg-[#00000034] h-screen w-screen absolute top-0 left-0' onClick={() => setShowModalAdd(false)}></div>
            <div className="relative w-auto my-6 mx-auto max-w-3xl">
              {/*content*/}
              <div className=" z-[20] border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                {/*header*/}
                <div className="flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t">
                  <h3 className="text-3xl font-semibold">
                    New Locked File
                  </h3>
                  <button
                    className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                    onClick={() => setShowModalAdd(false)}
                  >
                    <span className="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
                      ×
                    </span>
                  </button>
                </div>
                {/*body*/}
                <div className="relative p-6 flex-auto">
                  {!fileInfo?.file && <FileUpload />}
                  {fileInfo?.file && <div>FILE UPLOADED</div>
                }
                </div>
                {/*footer*/}
                <div className="flex items-center justify-between p-6 border-t border-solid border-blueGray-200 rounded-b">
                  <button
                    className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    onClick={() => setShowModalAdd(false)}
                  >
                    Close
                  </button>
                  <button
                    className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    onClick={async () => {
                      await storeFiles();
                      setShowModalAdd(false)
                    }}
                  >
                    Lock
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
      ) : null}
      {showModalRetrive !== -1 ? (
        <>
          <div
            className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
          >
						<div className='z-[10] bg-[#00000034] h-screen w-screen absolute top-0 left-0' onClick={() => setShowModalRetrive(-1)}></div>
            <div className="relative w-auto my-6 mx-auto max-w-3xl">
              {/*content*/}
              <div className=" z-[20] border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                {/*header*/}
                <div className="flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t">
                  <h3 className="text-3xl font-semibold">
                    New Locked File
                  </h3>
                  <button
                    className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                    onClick={() => setShowModalRetrive(-1)}
                  >
                    <span className="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
                      ×
                    </span>
                  </button>
                </div>
                {/*body*/}
                <div className="relative p-6 flex-auto">
                  {nftData && 
                  <>
                    <h3>YOUR CONTENT</h3>
                    <p>{nftData[showModalRetrive].content}</p>
                  </>}
                </div>
              </div>
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
      ) : null}
		</div>
	)
}

export default Dashboard