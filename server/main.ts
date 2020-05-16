import { app } from './src/app'
import { config } from 'dotenv';

config();
const { PORT } = process.env;
app.listen(PORT, () => {
    console.info(`Application is started at ${PORT}`)
})
