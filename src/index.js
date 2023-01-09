import App from './app/app.js'
import * as dotenv from 'dotenv'

dotenv.config();
const app = new App();
app.start();