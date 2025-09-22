import express from 'express';
import userRoutes from './src/routes/userRoutes.js'
import morgan from 'morgan';
const app = express()
app.use(express.json());
app.use('/users', userRoutes)
app.use(morgan("dev"));

app.use("users", userRoutes);

app.use((err, req, res, next)=> {
    console.error("Error:", err.message);
    res.status(500).json({ error: err.message });
});

const port = process.env.PORT || 3000

app.get('/', (req, res) => res.send('Hello World!'))

app.listen(port, () => 
console.log(`app listening on port ${port}!`))