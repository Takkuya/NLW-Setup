import Fastify from 'fastify'
import cors from '@fastify/cors'
import {PrismaClient} from '@prisma/client'

const app = Fastify()
// conexão com o banco de dados
const prisma = new PrismaClient()

//integrando o cors na aplicação
app.register(cors)

app.get('/', async () => {
  // buscando os hábitos do DB
  const habits = await prisma.habit.findMany({
    where: {
      title: {
        startsWith: 'beber'
      }
    }
  })

  return habits
})

app.listen({
  port: 3333
}).then(() => {
  return console.log('Server running')
})