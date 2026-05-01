require('dotenv').config()
const fastify = require('fastify')({ logger: true })

// Rota do dashboard da Jueri
fastify.get('/dashboard/geral', async (request, reply) => {
  try {
    const response = await fetch(`${process.env.ERP_API_URL}/api/dashboard/geral`, {
      headers: { Authorization: `Bearer ${process.env.ERP_TOKEN}` }
    });
    
    if (!response.ok) {
      throw new Error(`API Jueri retornou ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    reply.code(500).send({ 
      erro: error.message,
      detalhe: 'Falha ao buscar dados da Jueri'
    });
  }
});

// Rota teste
fastify.get('/', async () => {
  return { status: 'API JUERI rodando' }
});

// Inicia servidor
const start = async () => {
  try {
    await fastify.listen({ port: process.env.PORT || 3000, host: '0.0.0.0' })
    console.log('API JUERI no ar')
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}
start()
