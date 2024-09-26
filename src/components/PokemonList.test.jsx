import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import PokemonList from './PokemonList';
import axios from 'axios';

jest.mock('axios');

describe('PokemonList', () => {
    const mockTypes = ['normal', 'fire', 'water'];
    const mockPokemons = [
        { id: 1, name: 'Bulbasaur', sprites: { front_default: 'https://example.com/bulbasaur.png' }, types: [{ type: { name: 'grass' } }] },
        { id: 4, name: 'Charmander', sprites: { front_default: 'https://example.com/charmander.png' }, types: [{ type: { name: 'fire' } }] },
        { id: 7, name: 'Squirtle', sprites: { front_default: 'https://example.com/squirtle.png' }, types: [{ type: { name: 'water' } }] },
    ];

    beforeEach(() => {
        axios.get.mockResolvedValueOnce({ data: { results: mockTypes } }) // Mock para tipos
            .mockImplementation((url) => {
                if (url === 'https://pokeapi.co/api/v2/pokemon?limit=10&offset=0') {
                    return Promise.resolve({ data: { results: mockPokemons.slice(0, 10), count: mockPokemons.length } });
                } else if (url.startsWith('https://pokeapi.co/api/v2/pokemon?limit=10&offset=10')) {
                    return Promise.resolve({ data: { results: [], count: mockPokemons.length } });
                } else if (url.startsWith('https://pokeapi.co/api/v2/type/')) {
                    const type = url.split('/').pop();
                    const filteredPokemons = mockPokemons.filter(p => p.types.some(t => t.type.name === type));
                    return Promise.resolve({ data: { pokemon: filteredPokemons.map(p => ({ pokemon: { name: p.name, url: `https://pokeapi.co/api/v2/pokemon/${p.id}/` } })) } });
                }
                return Promise.reject(new Error('URL não reconhecida'));
            });
    });

    test('renderiza a lista de Pokémons', async () => {
        render(
            <BrowserRouter>
                <PokemonList />
            </BrowserRouter>
        );

        expect(screen.getByText('Carregando Pokémons...')).toBeInTheDocument();

        await screen.findByText('Bulbasaur');

        mockPokemons.slice(0, 10).forEach(pokemon => {
            expect(screen.getByText(pokemon.name)).toBeInTheDocument();
        });
    });

    test('carrega mais Pokémons ao clicar no botão "Carregar mais"', async () => {
        render(
            <BrowserRouter>
                <PokemonList />
            </BrowserRouter>
        );

        await screen.findByText('Bulbasaur');
        const loadMoreButton = screen.getByText('Carregar mais');
        fireEvent.click(loadMoreButton);

        // Como estamos mockando a resposta, não haverá novos Pokémons
        // Verificamos se o botão está desabilitado após clicar
        expect(loadMoreButton).toBeDisabled();
    });

    test('filtra Pokémons por tipo', async () => {
        render(
            <BrowserRouter>
                <PokemonList />
            </BrowserRouter>
        );

        await screen.findByText('Bulbasaur');

        const select = screen.getByRole('combobox');
        fireEvent.change(select, { target: { value: 'fire' } });

        await screen.findByText('Charmander');

        expect(screen.queryByText('Bulbasaur')).not.toBeInTheDocument();
        expect(screen.queryByText('Squirtle')).not.toBeInTheDocument();
    });

    test('desabilita o botão "Carregar mais" quando não há mais Pokémons do tipo', async () => {
        render(
            <BrowserRouter>
                <PokemonList />
            </BrowserRouter>
        );

        await screen.findByText('Bulbasaur');

        const select = screen.getByRole('combobox');
        fireEvent.change(select, { target: { value: 'fire' } });

        await screen.findByText('Charmander');

        const loadMoreButton = screen.getByText('Carregar mais');
        expect(loadMoreButton).toBeDisabled();
    });

    test('renderiza links para a página de detalhes do Pokémon', async () => {
        render(
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<PokemonList />} />
                    <Route path="/pokemon/:id" element={<div>Detalhes do Pokémon</div>} />
                </Routes>
            </BrowserRouter>
        );

        await screen.findByText('Bulbasaur');

        const bulbasaurLink = screen.getByRole('link', { name: /bulbasaur/i });
        expect(bulbasaurLink).toHaveAttribute('href', '/pokemon/1');
    });
});