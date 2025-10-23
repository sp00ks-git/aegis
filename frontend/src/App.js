import React from 'react';
import AppRouter from './Router';
import Navbar from './Navbar';

function App() {
  return (
    <div className="App">
      <Navbar />
      <main className="content">
        <AppRouter />
      </main>
    </div>
  );
}

export default App;
