export const validateAddItem = (req, res, next) => {
  const { name, price, quantity } = req.body;

  if (name === undefined || typeof name !== 'string' || name.trim() === '') {
    return res.status(400).json({ 
      error: 'Validação Falhou', 
      message: 'O nome do produto deve ser uma string não vazia.' 
    });
  }

  if (price === undefined || typeof price !== 'number' || price <= 0 || isNaN(price)) {
    return res.status(400).json({ 
      error: 'Validação Falhou', 
      message: 'O preço deve ser um número maior que zero.' 
    });
  }

  if (quantity !== undefined) {
    if (!Number.isInteger(quantity) || quantity <= 0) {
      return res.status(400).json({ 
        error: 'Validação Falhou', 
        message: 'A quantidade deve ser um número inteiro maior que zero.' 
      });
    }
  }

  next();
};

export const validateUpdateQuantity = (req, res, next) => {
  const { quantity } = req.body;

  if (quantity === undefined || !Number.isInteger(quantity) || quantity < 0) {
    return res.status(400).json({ 
      error: 'Validação Falhou', 
      message: 'A quantidade deve ser um número inteiro maior ou igual a zero.' 
    });
  }

  next();
};
