import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';

const DetailsContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
    background-color: #3355;
    border-radius: 8px;
    box-shadow: 0 0 10px rgba(0, 23, 50, 1.1);
    max-width: 500px;
    margin: 0 auto;
`;

const ImageContainer = styled.div`
    width: 200px;
    height: 200px;
    img {
    width: 100%;
    height: 100%;
    }
    background-color: #FFCC33;
    border-radius: 50%;
    box-shadow: 0 0 10px rgba(0, 23, 50, 1.1);
`;

const InfoContainer = styled.div`
    text-align: left;
`;

const BackButton = styled.button`
    display: block;
    margin: 20px auto;
    outline: none;
    cursor: pointer;
    width: 80px;
    height: 40px;
    background-image: linear-gradient(to top, #D8D9DB 0%, #fff 80%, #FDFDFD 100%);
    border-radius: 30px;
    border: 1px solid #8F9092;
    transition: all 0.2s ease;
    font-family: "Source Sans Pro", sans-serif;
    font-size: 16px;
    font-weight: 600;
    color: #606060;
    text-shadow: 0 1px #fff;
    &:hover {
        box-shadow: 0 4px 3px 1px #FCFCFC, 0 6px 8px #D6D7D9, 0 -4px 4px #CECFD1, 0 -6px 4px #FEFEFE, inset 0 0 3px 3px #CECFD1;
    }

    &:active {
        box-shadow: 0 4px 3px 1px #FCFCFC, 0 6px 8px #D6D7D9, 0 -4px 4px #CECFD1, 0 -6px 4px #FEFEFE, inset 0 0 5px 3px #999, inset 0 0 30px #aaa;
    }

    &:focus {
        box-shadow: 0 4px 3px 1px #FCFCFC, 0 6px 8px #D6D7D9, 0 -4px 4px #CECFD1, 0 -6px 4px #FEFEFE, inset 0 0 5px 3px #999, inset 0 0 30px #aaa;
    }
`;

const PokemonDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [pokemon, setPokemon] = useState(null);

    useEffect(() => {
        const fetchPokemon = async () => {
            try {
                const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${id}`);
                setPokemon(response.data);
            } catch (error) {
                console.error(`Erro ao buscar detalhes do Pokémon ${id}:`, error);
            }
        };
        fetchPokemon();
    }, [id]);

    if (!pokemon) {
        return <div>Carregando...</div>;
    }

    return (
        <DetailsContainer>
            <ImageContainer>
                <img src={pokemon.sprites.front_default} alt={pokemon.name} />
            </ImageContainer>
            <InfoContainer>
                <h3>{pokemon.name}</h3>
                <h4>Movimentos:</h4>
                <ul>
                    {pokemon.moves.slice(0, 4).map((move) => (
                        <li key={move.move.name}>{move.move.name}</li>
                    ))}
                </ul>
                <h4>Habilidades:</h4>
                <ul>
                    {pokemon.abilities.map((ability) => (
                        <li key={ability.ability.name}>
                            {ability.ability.name}: {/* Implementar lógica para exibir a descrição da habilidade */}
                        </li>
                    ))}
                </ul>
                <h4>Tipo:</h4>
                <ul>
                    {pokemon.types.map((type) => (
                        <li key={type.type.name}>{type.type.name}</li>
                    ))}
                </ul>
            </InfoContainer>
            <BackButton onClick={() => navigate(-1)}>Voltar</BackButton>
        </DetailsContainer>
    );
};

export default PokemonDetails;