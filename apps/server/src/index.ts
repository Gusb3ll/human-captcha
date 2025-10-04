import Express from 'express'

const main = async () => {
  const app = Express()

  app.use(Express.json())

  app.get('/', (_, res) => {
    res.json('Hello World!')
  })

  app.listen(4000, () => {
    console.log('Server is running on http://localhost:4000')
  })
}

main()
