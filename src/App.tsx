import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

const BASE_URL = 'https://viacep.com.br/ws'

type Address = {
  logradouro: string;
  localidade: string;
}

function App() {
  const [searchValue, setSearchValue] = useState('');
  const [addressData, setAddressData] = useState<Address>();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setAddressData(undefined);

    axios(`${BASE_URL}/${searchValue}/json`)
      .then(response => setAddressData(response.data))
      .catch(() => console.error('Houve um errro ao buscar os dados!'));
  }

  return (
    <div className="container-wrapper">
      <div className="container">
        <h1 className="title">Busca CEP</h1>
        <form className="search-form" onSubmit={handleSubmit}>
          <input
            type="number"
            className="search-input"
            placeholder="CEP (somente números)"
            value={searchValue}
            onChange={event => setSearchValue(event.target.value)}
            maxLength={8}
          />
          <button className="search-button">Buscar</button>
          {addressData && (
            <>
              <div className="search-result-item">
                <strong className="result-title">Logradouro</strong> <br />
                <span className="result-subtitle">{addressData.logradouro}</span>
              </div>
              <div className="search-result-item">
                <strong className="result-title">Localidade</strong> <br />
                <span className="result-subtitle">{addressData.localidade}</span>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
}

export default App;
