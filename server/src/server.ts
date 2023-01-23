import Fastify from 'fastify'
import cors from '@fastify/cors'
import {prisma} from './lib/prisma'
import { appRoutes } from './routes'

const app = Fastify()
//integrando o cors na aplicação
app.register(cors)
app.register(appRoutes)

app.listen({
  port: 3333,
  host: '0.0.0.0',
}).then(() => {
  console.log('HTTP Server running!')
})