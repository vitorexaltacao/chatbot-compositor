import axios from 'axios';

const API_KEY = process.env.VAGALUME_API_KEY;
const BASE_URL = 'https://api.vagalume.com.br/search.php';

async function buscarLetra(artista, musica) {
    try {
        const response = await axios.get(BASE_URL, {
            params: { apikey: API_KEY, art: artista, mus: musica }
        });

        if (response.data.type === 'exact') {
            return response.data.mus[0].text;
        } else {
            return 'Letra não encontrada.';
        }
    } catch (error) {
        console.error('Erro ao buscar letra:', error);
        throw new Error('Falha na consulta ao Vagalume');
    }
}

export default { buscarLetra };  // Usando export default para exportar a função
