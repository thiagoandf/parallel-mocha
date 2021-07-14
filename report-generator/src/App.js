import './App.css';

import axios from 'axios';
import {useDropzone} from "react-dropzone";
import {useCallback, useState} from "react";
import {saveAs} from 'file-saver';


function App() {

  const [loading, setLoading] = useState(false);

  const onDrop = useCallback(acceptedFiles => {
    if (acceptedFiles.length === 0) return;

    setLoading(true);

    const fd = new FormData();
    fd.append('report', acceptedFiles[0])
    axios.post('/report', fd).then((r) => {
      setLoading(false);
      saveAs(r.data, 'index.html', {autoBom: true});
    });
  }, [])

  const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop})

  return (
    <div className="App">
      <div className="App-header">
        {loading ?
          <div className="lds-ellipsis">
            <div/>
            <div/>
            <div/>
            <div/>
          </div> :
          <div className="dropzone" {...getRootProps()}>
            <input {...getInputProps()} />
            {
              isDragActive ?
                <p>Drop the files here ...</p> :
                <p>Drag 'n' drop some files here, or click to select files</p>
            }
          </div>
        }
      </div>
    </div>
  );
}

export default App;
