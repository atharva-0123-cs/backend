import { Hono } from 'hono'
import {handle} from 'hono/vercel'
import { prettyJSON} from  'hono/pretty-json'
import connectMongoDB from '@/lib/mongodb'
import fetch from 'node-fetch'
import tableModel from 'model/tableModel'

type ReqQuery = {
  page : number;
  perPage : number;
  search : string;
  month : Date;
}

const app = new Hono().basePath('/api')

app.use("*", prettyJSON());

// seed fiding to the database
app.get('/init', async (c) => {
  
  try {
      await connectMongoDB();

      const response = await fetch(process.env.FETCH_URI!)
      const transaction = await response.json();

      // clear existing data
      await tableModel.deleteMany({});

      console.log("Deleted")

      // insert fecthed data into MongoDB
      await tableModel.insertMany(transaction)

      return c.json({
        message: 'Database initialized with seed data'
      })   

    } catch (error: any) {
      return c.json({err : error.message}, 500) 
  }
  
})


app.get('/route', async (c) => {

  await connectMongoDB();

  const {page = "1", perPage = "10", search = '', month } = c.req.query();

   const query = {
    ...(month && {
      dateOfSale: { $regex: new RegExp(`-${month.padStart(2, '0')}-`, 'i') }
    }),
    ...(search && {
      $or: [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { price: { $regex: search, $options: 'i' } }
      ]
    })
  };

  const transactions = await tableModel.find(query)
  .skip((Number(page) - 1) * Number(perPage))
  .limit(Number(perPage))

  return c.json({
    transactions
  }) 
})


export const GET = handle(app)
