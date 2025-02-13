import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Resolvendo o diretório usando import.meta.url
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

import vagalume from './vagalume.js';
import openai from './openai.js';

// Rota para buscar letras no Vagalume
app.get('/api/letra', async (req, res) => {
    const { artista, musica } = req.query;
    console.log(`Recebido pedido para letra de ${artista} - ${musica}`);

    if (!artista || !musica) {
        return res.status(400).json({ error: 'Informe artista e música' });
    }

    try {
        console.log('Buscando letra no Vagalume...');
        const letra = await vagalume.buscarLetra(artista, musica);
        console.log('Letra encontrada:', letra);
        res.json({ letra });
    } catch (error) {
        console.error('Erro ao buscar letra:', error);
        res.status(500).json({ error: 'Erro ao buscar letra' });
    }
});

// Rota para gerar composição com OpenAI
app.post('/api/compor', async (req, res) => {
    const { estilo, tema } = req.body;
    console.log(`Recebido pedido de composição para estilo: ${estilo}, tema: ${tema}`);

    if (!estilo || !tema) {
        return res.status(400).json({ error: 'Informe estilo e tema' });
    }

    try {
        console.log('Gerando composição com OpenAI...');
        const response = await openai.chat.completions.create({
            model: 'gpt-4', // ou o modelo desejado
            messages: [
                { role: 'system', content: 'Você é um compositor de músicas de forró, sertanejo, pagode e arrocha.' },
                { role: 'user', content: `Crie uma letra de música de ${estilo} sobre o tema: ${tema}` }
            ]
        });
        const composicao = response.choices[0].message.content;
        console.log('Composição gerada:', composicao);
        res.json({ composicao });
    } catch (error) {
        console.error('Erro ao gerar composição:', error);
        res.status(500).json({ error: 'Erro ao gerar composição' });
    }
});

// Inicia o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
