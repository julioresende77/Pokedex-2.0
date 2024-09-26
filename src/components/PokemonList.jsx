import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const PokemonListContainer = styled.ul`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 20px;
    list-style: none;
    padding: 0;
    margin-top: 20px;
    justify-items: center;
`;

const PokemonListItem = styled.li`
    text-align: center;
    h3 {
    font-size: 20px;
    font-weight: 900;
    text-transform: uppercase;
    font-family: sans-serif;
    }

    img {
    max-width: 100%;
    }

    position: relative;
    width: 200px;
    height: 254px;
    background-color: #3333;
    box-shadow: 0 0 10px rgba(0, 23, 50, 1.1);
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 12px;
    gap: 12px;
    border-radius: 8px;
    cursor: pointer;
`;

const LoadMoreButton = styled.button`
    display: block;
    margin: 20px auto;
    outline: none;
    cursor: pointer;
    width: 150px;
    height: 50px;
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

const PokemonList = () => {
    const [types, setTypes] = useState([]);
    const [pokemons, setPokemons] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [filterType, setFilterType] = useState('');
    const [totalPokemonsOfType, setTotalPokemonsOfType] = useState(0);

    const isFirstFetch = useRef(true);
    const pokemonsPerPage = 10;
    const [totalPokemons, setTotalPokemons] = useState(0);

    useEffect(() => {
        const fetchTypes = async () => {
            try {
                const response = await axios.get('https://pokeapi.co/api/v2/type');
                const typesData = response.data.results.map((type) => type.name);
                setTypes(typesData);
            } catch (error) {
                console.error('Erro ao buscar tipos de Pokémon:', error);
            }
        };
        
        const fetchTotalPokemons = async () => {
            try {
                // Busca o total de Pokémons
                const response = await axios.get('https://pokeapi.co/api/v2/pokemon');
                setTotalPokemons(response.data.count);
            } catch (error) {
                console.error('Erro ao buscar o total de Pokémons:', error);
            }
        };

        fetchTypes();
        fetchTotalPokemons(); // Busca o total de Pokémons ao iniciar
    }, []);

    useEffect(() => {
        const fetchPokemons = async () => {
            setIsLoading(true);

            if (currentPage === 1) {
                isFirstFetch.current = true;
            }

            try {
                let pokemonData = [];

                if (filterType) {
                    // Busca os pokémons por tipo
                    const response = await axios.get(`https://pokeapi.co/api/v2/type/${filterType}`);
                    setTotalPokemonsOfType(response.data.pokemon.length);

                    // Calcula o índice inicial e final corretos para fatiar a lista
                    const startIndex = (currentPage - 1) * pokemonsPerPage;
                    const endIndex = Math.min(startIndex + pokemonsPerPage, totalPokemonsOfType);

                    pokemonData = await Promise.all(
                        response.data.pokemon
                            .slice(startIndex, endIndex) // Fatia a lista corretamente
                            .map(async ({ pokemon }) => {
                                const pokemonResponse = await axios.get(pokemon.url);
                                return pokemonResponse.data;
                            })
                    );
                } else {
                    // Busca todos os tipos
                    const offset = (currentPage - 1) * pokemonsPerPage;
                    const response = await axios.get(
                        `https://pokeapi.co/api/v2/pokemon?limit=${pokemonsPerPage}&offset=${offset}`
                    );
                    pokemonData = await Promise.all(
                        response.data.results.map(async (pokemon) => {
                            const pokemonResponse = await axios.get(pokemon.url);
                            return pokemonResponse.data;
                        })
                    );
                }

                // Atualiza o estado dos Pokémons
                setPokemons((prevPokemons) => {
                    if (isFirstFetch.current && currentPage === 1) {
                        isFirstFetch.current = false;
                        return pokemonData;
                    } else {
                        return [...prevPokemons, ...pokemonData];
                    }
                });

            } catch (error) {
                console.error('Erro ao buscar Pokémon:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchPokemons();
    }, [filterType, currentPage]);

    const handleLoadMore = () => {
        setCurrentPage((prevPage) => prevPage + 1);
    };

    useEffect(() => {
        setCurrentPage(1);
        isFirstFetch.current = true;
        setTotalPokemonsOfType(10); // IMPORTANTE: Resetar totalPokemonsOfType!
    }, [filterType]);

    return (
        <>
            <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
                <option value="">Todos os tipos</option>
                {types.map((typeName) => (
                    <option key={typeName} value={typeName}>
                        {typeName}
                    </option>
                ))}
            </select>

            {isLoading && <div>Carregando Pokémons...</div>}

            <PokemonListContainer>
                {pokemons.map((pokemon) => (
                    <PokemonListItem key={pokemon.id}>
                        <Link to={`/pokemon/${pokemon.id}`}>
                            <img src={pokemon.sprites.front_default} alt={pokemon.name} />
                            <h2>{pokemon.name}</h2>
                        </Link>
                    </PokemonListItem>
                ))}
            </PokemonListContainer>

            {!isLoading && (filterType ? pokemons.length < totalPokemonsOfType : pokemons.length < totalPokemons) && (
                <LoadMoreButton onClick={handleLoadMore} disabled={isLoading}>
                    {isLoading ? 'Carregando...' : 'Carregar mais'}
                </LoadMoreButton>
            )
            }
        </>
    );
};

export default PokemonList;