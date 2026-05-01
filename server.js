const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;
const ERP_URL = process.env.ERP_API_URL;
const ERP_TOKEN = process.env.ERP_TOKEN;

app.get('/dashboard/geral', async (req, res) => {
  try {
    if (!ERP_URL || !ERP_TOKEN) {
      return res.status(500).json({ erro: 'Variaveis ERP nao configuradas no Railway' });
    }
    
    const { data } = await axios.get(`${ERP_URL}/dashboard/geral`, {
      headers: { Authorization: `Bearer ${ERP_TOKEN}` }
    });
    res.json(data);
  } catch (error) {
    res.status(500).json({ 
      erro: 'Falha ao buscar dados da Jueri',
      detalhe: error.message 
    });
  }
});

app.get('/', (req, res) => {
  res.send('API Jueri Online');
});

app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
