import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

const BASE_URL = 'https://viacep.com.br/ws'

type Address = {
  logradouro: string;
  localidade: string;
}

// coloquei o nome enum mas nao é bem um enum
const enumFormItems: Address = {
  logradouro: 'Logradouro',
  localidade: 'Localidade'
}

// Em um state que vai um objeto é sempre bom ter um initial value pra voce poder zerar esse state sem stress depois
// também é bom nao ficar jogando tipos diferentes num contexto que espera um objeto (tipo usar undefined pra zerar state)
// porque num fluxo complexo fica dificil prever o que ta vindo e ai tu tem que ficar fazendo checagem pra ver se a variavel
// nao está undefined ou null
const initialAddress: Address = {
  logradouro: '',
  localidade: '',
}

function App() {
  const [searchValue, setSearchValue] = useState('');
  const [addressData, setAddressData] = useState<Address>(initialAddress);
  // veja que aqui ja posso usar essa abordagem de object destructuring porque eu ja garanti com o initialAddress
  // que sempre teremos essas propriedades no objeto independente de fazer uma busca com sucesso ou nao
  const { logradouro, localidade } = addressData;

  // melhor forma de garantir 'somente numeros' porque:
  // usuario pode mexer no html e mudar o type number pra type text e zoar sua api
  // tu pode reusar em qualquer campo (basta alterar pra ela dar um return sanitizedValue)
  // facilita os testes unitarios (tu vai quebrar os testes em cenarios de escopo de cada responsabilidade)
  // ex: seu teste do form nao precisará mais garantir que ta digitando somente numeros porque ja vai existir
  // um teste disso nessa funcao.
  const onChangeNumber = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { target = { value: '' } } = event;
    const { value = '' } = target;

    const sanitizedValue = value.replace(/\D/g, '');

    setSearchValue(sanitizedValue)
  }

  // aqui conseguimos mudar pra fazer um reuso de elementos repetidos
  const renderResultItem = (item: string, name: string) => {
    if (!item) {
      return null
    }

    return (
      <div className="search-result-item">
        <strong className="result-text">{name}</strong> <br />
        <span className="result-text">{item}</span>
      </div>
    )
  }

  // aqui mudamos pra uma funcao ao inves do conditional render de addressData &&
  // porque o uso desse tipo de conditional render pode ser perigoso pra recursos que tu nao tem controle
  // se a api por exemplo retornar algo diferente do esperado a tua view pode quebrar
  // ex: antes se a api retornasse uma string/objeto vazia o render do logradouro e localidade iam ficar undefined
  // tbm tem o problema com falsy truthy values ex: se a api retornar o numero 1 essa condicao iria passar
  // teste no console do navegador 1 && 'teste' (vai printar 'teste')
  const renderAddressData = () => {
    if (!logradouro && !localidade) {
      return null;
    }
    return (
      <>
        {renderResultItem(logradouro, enumFormItems.logradouro)}
        {renderResultItem(localidade, enumFormItems.localidade)}
      </>
    )
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // fazer o post primeiro pra depois zerar o state, porque se der ruim
    // o usuario nao precisa reinserir os dados de novo no form
    // encapsular uma chamada async dentro de um try/catch é mais legivel do que promise/then

    try {
      // de novo o initialAddress garantindo que mesmo se a api nao responder a gente terá
      // o state sempre como esperado
      const { data = initialAddress } = await axios(`${BASE_URL}/${searchValue}/json`)
      setAddressData(data)
    } catch (error) {
      console.error('Houve um erro ao buscar os dados!', error)
    }
  }

  return (
    <section className="main-section">
      <div className="container">
        <h1 className="title">Busca CEP</h1>
        <form className="search-form" onSubmit={handleSubmit}>
          <input
            // type number nao é uma boa pratica pra campos que vao possivelmente receber uma mascara
            className="search-input"
            placeholder="CEP (somente números)"
            value={searchValue}
            onChange={onChangeNumber}
            maxLength={8}
          />
          <button className="search-button">Buscar</button>
          {/*agora tem "menos" html junto pra ler, facilitando o
          entendimento do codigo se o form crescer */}
          {renderAddressData()}
        </form>
      </div>
    </section>
  );
}

export default App;
