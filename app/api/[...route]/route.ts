import { Hono } from 'hono'
import {handle} from 'hono/vercel'
import { prettyJSON} from  'hono/pretty-json'
import connectMongoDB from '@/lib/mongodb'


const app = new Hono().basePath('/api')

app.use("*", prettyJSON());

app.get('/hello', (c) => {
  return c.json({
    message: 'Hello from Hono!'
  })
})

app.get('/route', async (c) => {

  await connectMongoDB();

  return c.json({
    route : "this is route",
  }) 
})


export const GET = handle(app)
