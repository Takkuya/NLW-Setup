import { prisma } from "./lib/prisma"
import { FastifyInstance } from "fastify"
import dayjs from 'dayjs'
import {z} from 'zod'

// fastify pegando o app
export async function appRoutes(app: FastifyInstance) {
  // criando hábito
  app.post('/habits', async (request) => {
    // fazendo validação
    const createHabitBody = z.object({
      title: z.string(),
      // min e max porque os números do array representam os dias da semana
      weekDays: z.array(z.number().min(0).max(6))
    })

    // pegando o title e o weekDays
    const { title, weekDays } = createHabitBody.parse(request.body)

    console.log('pongers')

    // startof zera os segundos, minutos e hora
    const today = dayjs().startOf('day').toDate()
  
    // criando hábito
    await prisma.habit.create({
      data: {
        title,
        created_at: today,
        weekDays: {
          create: weekDays.map(weekDay => {
            return {
              week_day: weekDay,
            }
          })
        }
      }
    })
  })
  // buscando os hábitos de um dia específico
  app.get('/day', async (request) => {
    const getDayParams = z.object({
      // qual dia quero buscar as informações
      // coerce converte o parâmetro que eu recebo aqui para uma data
      date: z.coerce.date()
    })

    // buscando as informações através de um query param
    const {date} = getDayParams.parse(request.query)

    // criamos essa variável pois caso a hora no date seja 00 ele não retorna os hábitos
    const parsedDate = dayjs(date).startOf('day')
    // retorna o dia da semana
    const weekDay = parsedDate.get('day')

    // pegando todos os hábitos possíveis e os hábitos já completados
    const possibleHabits = await prisma.habit.findMany({
      where: {
        // verificar se a data de criação do hábito é menor ou igual a data atual
        // pq não podemos mostrar um hábito criado no futuro, vou mostrar apenas
        // os hábitos criados até aquela data
        created_at: {
          //menor ou igual
          lte: date,
        },
        //hábitos onde o dia da semana seja igual ao dia do Date que eu recebo
        weekDays: {
          some: {
            week_day: weekDay
          }
        }
      }
    })

    // retornando quais hábitos foram completos em um determinado dia
    const day = await prisma.day.findUnique({
      where: {
        // preciso converter para o objeto Date quando estamos trabalhando no prisma
        date: parsedDate.toDate()
      },
      // traz os dayHabits relacionados ao day
      // se não fosse por esse include, ele só retornaria os dados do day
      include: {
        dayHabits: true,
      }
    })

    // validação caso o day seja null, já que caso o usuário não complete nenhum hábito em um dia
    // esse day vai retornar null
    // se o dia não estiver nulo procurar os dayHabits
    const completedHabits = day?.dayHabits.map(dayHabit => {
      return dayHabit.habit_id
    })

    return {
      possibleHabits,
      completedHabits
    }

  })

  // rota de completar /não completar um hábito
  // usamos patch pois só vamos mudar 1 informação
  // :id => é uma route param => parâmetro de indetificação
  app.patch('/habits/:id/toggle', async (request) => {
    
    const toggleHabitParams = z.object({
      id: z.string().uuid(),
    }) 

    const {id} = toggleHabitParams.parse(request.params)

    // só vamos poder um hábito no mesmo dia
    // startOf => descarta as informações como hora, minuto etc.
    const today = dayjs().startOf('day').toDate()

    let day = await prisma.day.findUnique({
      where: {
        date: today
      }
    })

    // se o dia não estiver no banco de dados, usuário não completou nenhum hábito
    if (!day) {
      day = await prisma.day.create({
        data: {
          date: today,
        }
      })
    }

    const dayHabit = await prisma.dayHabit.findUnique({
      // buscando um registro no banco de dados na tabela dayHabits para ver se o usuário
      // já tinha marcado o hábito como completo no dia atual
      where: {
        day_id_habit_id: {
          day_id: day.id,
          habit_id: id
        }
      }
    })

    // caso o hábito estiver marcado como completo
    if (dayHabit) {
      //remover marcação de completo
      await prisma.dayHabit.delete({
        where: {
          id: dayHabit.id
        }
      })
    } else {
      // completar o hábito no dia atual
      await prisma.dayHabit.create({
        data: {
          day_id: day.id,
          // id vem da rota
          habit_id: id,
        }
      })
    }

    

  })

  // retornar um resumo contendo uma lista com várias informações como sendo um objeto
  // cada um desses objetos vai precisar ter a data, quantidade de hábitos eram possíveis
  // eu completar na data e quantos hábitos eu completei nessa data 
  app.get('/summary', async () => {
    // quando temos query mais complexas, com mais condições e relacionamentos
    // geralmente vamos precisar escrever o SQL na mão nesses casos
    // já que isso traz mais benefícios, como otimização e performance
    // também temos que tomar cuidado, pois quando escrevemos RAW SQL
    // os comandos só vão funcionar para aquele banco de dados

    const summary = await prisma.$queryRaw`
      SELECT 
        D.id, 
        D.date,
        -- pegando quantos hábitos a pessoa completou naquele dia
        -- utilizar subquerys, basicamente utilizar um SELECT dentro de outro SELECT
        (
          SELECT 
          -- transformamos em float pois o count(*) retorna um big int
            cast(count(*) as float)
          FROM day_habits DH
          WHERE DH.day_id = D.id
          -- mostrar como completed no retorno
        ) as completed,
        -- subquery para retornar o amount
        -- total de hábitos disponíveis naquela data específica  
        (
          SELECT
            cast(count(*) as float)
          FROM habit_week_days HWD
          -- mostrando só os hábitos criados nos dias anteriores a data
          JOIN habits H
            ON H.id = HWD.habit_id
          WHERE
          -- formatando uma data em um formato específico
          -- dividimos por 1000 pois o formato do SQLite de data (epoch timestamp)
          -- trabalha com milissegundos
            HWD.week_day = cast(strftime('%w', D.date/1000.0, 'unixepoch') as int)
            -- validando se o hábito foi criado antes ou no mesmo dia que a data
            AND H.created_at <= D.date
        ) as amount
      FROM days D
    `

    return summary

  })
}

