export const errorHandler = (err, req, res, next) => {
  console.error('Erro no servidor:', err);

  const status = err.status || 500;
  const message = err.message || 'Erro interno no servidor.';

  res.status(status).json({
    error: err.name || 'InternalServerError',
    message: message
  });
};

export const notFoundHandler = (req, res) => {
  res.status(404).json({
    error: 'NotFoundError',
    message: `A rota ${req.method} ${req.originalUrl} não existe.`
  });
};
