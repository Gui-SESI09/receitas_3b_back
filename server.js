import Fastify from 'fastify'
import { Pool } from 'pg'
// Configuração da conexão com o Banco de Dados
const sql = new Pool({
 user: "postgres",
 password: "senai",
 host: "localhost",
 port: 5432,
 database: "cinema_db" // Certifique-se que o banco no pgAdmin tem este nome
})
const servidor = Fastify()
// --- ROTAS DE USUÁRIOS ---    

// Listar todos os usuários
servidor.get('/filmes', async (request, reply) => {
 const resultado = await sql.query('SELECT * FROM filmes')
 return resultado.rows
})

// Criar novo usuário
servidor.post('/filmes', async (request, reply) => {
 const { titulo, genero, ano_lancamento, diretor} = request.body;
 if (!titulo || !genero || !ano_lancamento || !diretor) {
 return reply.status(400).send({ error: 'Algum dos dados são Inválidos!' })
 }
 await sql.query('INSERT INTO usuario (titulo, genero, ano_lancamento, diretor) VALUES ($1, $2, $3, $4)', [titulo, genero, ano_lancamento, diretor])
 return reply.status(201).send({ mensagem: "Filme cadastrado no catálogo!" })
})

// Editar usuário existente
servidor.put('/filmes/:id', async (request, reply) => {
 const { id } = request.params
 const { nome, senha } = request.body
 if (!nome || !senha) {
 return reply.status(400).send({ error: 'Nome ou senha inválidos!' })
 }
 const busca = await sql.query('SELECT * FROM usuario WHERE id = $1', [id])

 if (busca.rows.length === 0) {
 return reply.status(404).send({ error: 'Usuário não encontrado!' })
 }
 await sql.query('UPDATE usuario SET nome = $1, senha = $2 WHERE id = $3', [nome,
senha, id])
 return { mensagem: 'Usuário alterado com sucesso!' }
})

// Deletar usuário
servidor.delete('/filmes/:id', async (request, reply) => {
 const { id } = request.params
 await sql.query('DELETE FROM usuario WHERE id = $1', [id])
 return reply.status(204).send()
})

// --- O ALUNO DEVE CRIAR AS ROTAS DE /FILMES ABAIXO ---
// Inicialização do Servidor
servidor.listen({
 port: 3000
}).then(() => {
 console.log("Servidor rodando em http://localhost:3000")
})