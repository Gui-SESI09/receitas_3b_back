import Fastify from 'fastify'
import { Pool } from 'pg'

const sql = new Pool({
 user: "postgres",
 password: "senai",
 host: "localhost",
 port: 5432,
 database: "cinema_db" 
})
const servidor = Fastify()

servidor.get('/filmes', async (request, reply) => {
 const resultado = await sql.query('SELECT * FROM filmes')
 return resultado.rows
})

servidor.post('/filmes', async (request, reply) => {
 const { titulo, genero, ano_lancamento, diretor} = request.body;
 if (!titulo || !genero || !ano_lancamento || !diretor) {
 return reply.status(400).send({ error: 'Algum dos dados são Inválidos!' })
 }
 await sql.query('INSERT INTO filmes (titulo, genero, ano_lancamento, diretor) VALUES ($1, $2, $3, $4)', [titulo, genero, ano_lancamento, diretor])
 return reply.status(201).send({ mensagem: "Filme cadastrado no catálogo!" })
})

servidor.put('/filmes/:id', async (request, reply) => {
 const { id } = request.params
 const { titulo, genero, ano_lancamento, diretor } = request.body
 if (!titulo || !genero || !ano_lancamento || !diretor) {
 return reply.status(400).send({ error: 'Algum dos dados são inválidos!' })
 }
 const busca = await sql.query('SELECT * FROM filmes WHERE id = $1', [id])

 if (busca.rows.length === 0) {
 return reply.status(404).send({ error: 'Filme não encontrado!' })
 }
 await sql.query('UPDATE filmes SET titulo = $1, genero = $2, ano_lancamento = $3, diretor = $4 WHERE id = $5', [titulo, genero, ano_lancamento, diretor, id])
 return { mensagem: 'Filme alterado com sucesso!' }
})

servidor.delete('/filmes/:id', async (request, reply) => {
 const { id } = request.params
 await sql.query('DELETE FROM filmes WHERE id = $1', [id])
 return reply.status(204).send({ mensagem: 'Filme deletado com sucesso!' })
})


servidor.listen({
 port: 3000
}).then(() => {
 console.log("Servidor rodando em http://localhost:3000")
})
