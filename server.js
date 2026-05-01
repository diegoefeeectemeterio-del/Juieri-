require('dotenv').config()
const fastify = require('fastify')({ logger: true })
const cors = require('@fastify/cors')
const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY)

fastify.register(cors, { origin: true })

fastify.addHook('onRequest', async (req, reply) => {
  if (req.url.startsWith('/api/') && req.headers.authorization!== `Bearer ${process.env.JUERI_API_KEY}`) {
    return reply.code(403).send({ error: 'API_KEY inválida' })
  }
})

fastify.post('/api/revendedoras', async (req, reply) => {
  const { data, error } = await supabase.from('revendedoras').insert(req.body).select()
  if (error) throw error
  return data[0]
})

fastify.post('/api/pastas', async (req, reply) => {
  const { data, error } = await supabase.from('pastas').insert(req.body).select()
  if (error) throw error
  return data[0]
})

fastify.post('/api/acertos', async (req, reply) => {
  const { data, error } = await supabase.from('acertos').insert(req.body).select()
  if (error) throw error
  return data[0]
})

fastify.get('/api/dashboard', async (req, reply) => {
  const { inicio, fim } = req.query
  const { data, error } = await supabase.rpc('get_cards_dashboard', { inicio, fim })
  if (error) throw error
  return data
})

fastify.get('/', async () => {
  return { status: 'API JUERI rodando' }
})

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
