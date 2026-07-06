import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import cartRouter from './routes/cartRoutes.js';
import { errorHandler, notFoundHandler } from './middlewares/errorHandler.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3001;

// Middleware to parse JSON request bodies
app.use(express.json());

// Serve static files (HTML, CSS, JS dashboard)
app.use(express.static(path.join(__dirname, 'public')));

// API Request Logger Middleware
app.use((req, res, next) => {
  console.log(`[Backend Log] ${new Date().toLocaleTimeString()} - ${req.method} ${req.originalUrl}`);
  next();
});

// Register the Cart Routes
app.use('/api/cart', cartRouter);

// 404 Route Not Found Handler
app.use(notFoundHandler);

// Centralized Error Handler
app.use(errorHandler);

app.listen(port, () => {
  console.log(`\x1b[32m[Backend] Servidor inicializado com sucesso em http://localhost:${port}\x1b[0m`);
});
