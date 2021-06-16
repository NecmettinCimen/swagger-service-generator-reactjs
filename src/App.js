import React, { useState } from 'react'
import SwaggerParser from '@apidevtools/swagger-parser'
import AceEditor from "react-ace";

import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/theme-github";


function App() {
  const pathSearch = window.location.search + '';

  const [url, setUrl] = useState(pathSearch !== "" && pathSearch.indexOf("?q=") !== -1 ? pathSearch.slice(3, pathSearch.length) : "")
  const [error, setError] = useState(false)
  const [success, setSuccess] = useState(null)
  const [openRawFile, setOpenRawFile] = useState(false)
  const [endpoint, setEndpoint] = useState('')
  const [api, setApi] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault();
    await parseApi();
  }

  const parseApi = async () => {
    setError(false);
    setSuccess(null)

    try {
      let api = await SwaggerParser.validate(url);
      let endpointStr = 'export enum EndPoint { \n';

      const paths = Object.keys(api.paths);
      for (let index = 0; index < paths.length; index++) {
        const element = paths[index];
        endpointStr += `${element.slice(1, element.length).replaceAll('/', '_').replace('_{id}', '')} = '${element}', \n`;
      }
      endpointStr = endpointStr.slice(0, -3);

      endpointStr += '\n}';
      setApi(api)
      setSuccess(true)
      setEndpoint(endpointStr)
    }
    catch (err) {
      console.error(err);
      setError(true)
    }
  }

  return openRawFile ? <div>{endpoint}</div> : (
    <div>
      <header className="py-3 mb-3 border-bottom">
        <div className="container-fluid d-grid gap-3 align-items-center" style={{ gridTemplateColumns: '1fr 2fr' }}>
          Swagger Service Generator
          <div className="d-flex align-items-center">
            <form onSubmit={handleSubmit} className="d-flex align-items-center w-100 me-3" >
              <input value={url} onChange={(e) => setUrl(e.target.value)} required type="Url" className="form-control" placeholder="Swagger Json Url..." aria-label="Swagger Json Url" />
              <div className="flex-shrink-0" style={{ marginLeft: '3px' }}>
                <button type="submit" className="btn btn-primary" >Generate</button>
              </div>

            </form>
          </div>
        </div>
      </header>
      <div className="container-fluid pb-3">
        {!error ? null : <div className="alert alert-danger">Hata! Girdiğiniz url bilgileri doğrulayamadım.</div>}
        {success ? <div className="alert alert-success">Başarılı! {api.info.title} {api.info.version} bilgilerini bulabildim.</div> : null}
        <div className="d-grid gap-3" style={{ gridTemplateColumns: '1fr 2fr' }}>
          <div className="bg-light border rounded-3">
            {
              success ? <ul class="list-group">
                <li class="list-group-item d-flex justify-content-between align-items-center">
                  EndPoint.js
                  <span class="badge bg-primary rounded-pill" onClick={() => setOpenRawFile(true)} style={{ cursor: 'pointer' }}>Raw file</span>
                </li>
              </ul> : null
            }
            <br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
          </div>
          <div className="bg-light border rounded-3">
            {
              success ? <AceEditor
                placeholder="Endpoint.js"
                mode="javascript"
                theme="github"
                name="blah2"
                fontSize={14}
                showPrintMargin={true}
                showGutter={true}
                highlightActiveLine={true}
                value={endpoint}
                setOptions={{
                  enableBasicAutocompletion: true,
                  enableLiveAutocompletion: true,
                  enableSnippets: true,
                  showLineNumbers: true,
                }} />
                : <div><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /></div>
            }

          </div>
        </div>
      </div>
    </div>

  );
}

export default App;
