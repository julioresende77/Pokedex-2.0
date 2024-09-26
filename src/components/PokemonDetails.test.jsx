import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PokemonDetails from './PokemonDetails';
import axios from 'axios';

// Mock para a requisição axios.get
jest.mock('axios');

describe('PokemonDetails', () => {
    const mockPokemon = {
        id: 1,
        name: 'Bulbasaur',
        sprites: { front_default: 'https://example.com/bulbasaur.png' },
        moves: [{ move: { name: 'tackle' } }, { move: { name: 'vine whip' } }],
        abilities: [{ ability: { name: 'overgrow' } }],
        types: [{ type: { name: 'grass' } }],
    };

    beforeEach(() => {
        axios.get.mockResolvedValue({ data: mockPokemon });
    });

    test('renderiza os detalhes do Pokémon', async () => {
        render(
            <BrowserRouter>
                <Routes>
                    <Route path="/pokemon/:id" element={<PokemonDetails />} />
                </Routes>
            </BrowserRouter>
        );

        // Verifica se o componente está renderizando um indicador de carregamento
        expect(screen.getByText('Carregando...')).toBeInTheDocument();

        // Espera a requisição ser resolvida e o componente ser atualizado
        await screen.findByRole('heading', { name: /bulbasaur/i });

        // Verifica se os detalhes do Pokémon são renderizados
        expect(screen.getByRole('img', { name: /bulbasaur/i })).toHaveAttribute(
            'src',
            'https://example.com/bulbasaur.png'
        );
        expect(screen.getByRole('heading', { name: /bulbasaur/i })).toBeInTheDocument();
        expect(screen.getByText(/tackle/i)).toBeInTheDocument();
        expect(screen.getByText(/vine whip/i)).toBeInTheDocument();
        expect(screen.getByText(/overgrow/i)).toBeInTheDocument();
        expect(screen.getByText(/grass/i)).toBeInTheDocument();
    });

    test('renderiza uma mensagem de erro se a requisição falhar', async () => {
        axios.get.mockRejectedValue(new Error('Erro na requisição'));

        render(
            <BrowserRouter>
                <Routes>
                    <Route path="/pokemon/:id" element={<PokemonDetails />} />
                </Routes>
            </BrowserRouter>
        );

        // Espera a mensagem de erro ser renderizada
        const errorMessage = await screen.findByText(/Erro ao buscar detalhes/i);
        expect(errorMessage).toBeInTheDocument();
    });

    test('navegar para a página anterior ao clicar no botão "Voltar"', async () => {
        const mockNavigate = jest.fn();
        jest.mock('react-router-dom', () => ({
            ...jest.requireActual('react-router-dom'),
            useNavigate: () => mockNavigate,
        }));

        render(
            <BrowserRouter>
                <Routes>
                    <Route path="/pokemon/:id" element={<PokemonDetails />} />
                </Routes>
            </BrowserRouter>
        );

        await screen.findByRole('heading', { name: /bulbasaur/i });

        const backButton = screen.getByRole('button', { name: /voltar/i });
        backButton.click();

        expect(mockNavigate).toHaveBeenCalledWith(-1);
    });
});