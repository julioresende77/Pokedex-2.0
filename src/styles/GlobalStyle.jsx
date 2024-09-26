import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`

* {
    @font-face {
        font-family:pokemon solid;
        font-style:normal;
        font-weight:400;
        src:local('Pokemon Solid'),url('https://fonts.cdnfonts.com/s/17890/Pokemon Solid.woff') format('woff')
    }

    margin: 0;
    padding: 0;
    border: 0;
    box-sizing: border-box;
    text-decoration: none;
    
    h1 {
    font-family: 'Pokemon Solid', sans-serif;
    -webkit-text-stroke-width: 2px;
    -webkit-text-stroke-color: #4682B4;
    -webkit-text-fill-color: #FFD700;
    }

    h2 {
    font-family: 'Pokemon Solid', sans-serif;
    -webkit-text-stroke-width: 1.5px;
    -webkit-text-stroke-color: #4682B4;
    -webkit-text-fill-color: #FFD700;
    font-size: 25px;
    }

    h3 {
    font-family: 'Pokemon Solid', sans-serif;
    -webkit-text-stroke-width: 1.5px;
    -webkit-text-stroke-color: #4682B4;
    -webkit-text-fill-color: #FFD700;
    font-size: 25px;
    }

    h4 {
    font-family: 'Pokemon Solid', sans-serif;
    -webkit-text-stroke-width: 0.8px;
    -webkit-text-stroke-color: #4682B4;
    -webkit-text-fill-color: #FFD700;
    font-size: 15px;
    }

    li {
    -webkit-text-stroke-color: #000;
    -webkit-text-fill-color: #FFD700;
    font-family: lato, sans-serif;
    font-size: 14px;
    font-weight: bold;
    }
}
`;