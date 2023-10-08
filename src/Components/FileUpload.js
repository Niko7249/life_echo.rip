import React, {useState, useRef, useEffect, useCallback} from "react";
import AES from 'crypto-js/aes';
import { Entropy, charset64} from 'entropy-string'
import { fileState } from '../States';
import {
  useRecoilState,
} from 'recoil';
// drag drop file component
function FileUpload() {
	const entropy = new Entropy({ charset: charset64 })
	const [fileReader, setFileReader] = useState();
  const [fileInfo, setFileInfo] = useRecoilState(fileState);
	// drag state
  const [dragActive, setDragActive] = useState(false);
  // ref
  const inputRef = useRef(null);

	useEffect(()=>{
		setFileReader(new FileReader())
	},[])

	const handleFileRead = useCallback(async (e) => {
		const content = fileReader.result;
		const cryptedPass = entropy.token()
		const encrypted = AES.encrypt(content, cryptedPass);
		const fileName = entropy.string()
		const newFile = new File([new Blob([encrypted], { type: "text/plain" })], fileName+".txt");
		setFileInfo({...fileInfo, file:newFile, cryptedPass});
	}, [fileReader]);
	
	const handleFile = useCallback((files) => {
		// console.log(data.append('file', files[0]));
		fileReader.onloadend = handleFileRead;
		fileReader.readAsText(files[0]);
		// console.log(files)
		// alert("Number of files: " + files.length);
	}, [fileReader])
  
  // handle drag events
  const handleDrag = function(e) {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };
  
  // triggers when file is dropped
  const handleDrop = function(e) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files);
    }
  };
  
  // triggers when file is selected with click
  const handleChange = function(e) {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files);
    }
  };
  
// triggers the input when the button is clicked
  const onButtonClick = () => {
    inputRef.current.click();
  };
  
  return (
    <form id="form-file-upload" onDragEnter={handleDrag} onSubmit={(e) => e.preventDefault()}>
      <input ref={inputRef} type="file" id="input-file-upload" multiple={true} onChange={handleChange} />
      <label id="label-file-upload" htmlFor="input-file-upload" className={dragActive ? "drag-active" : "" }>
        <div>
          <p>Drag and drop your file here or</p>
          <button className="upload-button" onClick={onButtonClick}>Upload a file</button>
        </div> 
      </label>
      { dragActive && <div id="drag-file-element" onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}></div> }
    </form>
  );
};

export default FileUpload;