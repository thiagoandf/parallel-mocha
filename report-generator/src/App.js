import './App.css';

function App() {
  return (
    <div className="App">
      <div className="App-header">
        <form action="/report" method="post" encType="multipart/form-data">
          <input type="file" name="report"/>
          <input type="submit" value="Get me the stats!" className="btn btn-default"/>
        </form>
      </div>
    </div>
  );
}

export default App;
