const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const helpers = require('./helpers/handlebars');
const redisService = require('./services/RedisService');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Inicializar Redis
async function initializeRedis() {
  if (redisService.isConfigured()) {
    try {
      await redisService.connect();
      console.log('Redis conectado com sucesso');
    } catch (error) {
      console.error('Erro ao conectar com Redis:', error);
    }
  } else {
    console.log('Redis não configurado - cache desabilitado');
  }
}

// Inicializar Redis na startup
initializeRedis();

// Configuração do rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 1000 // limite de 1000 requests por IP
});

// Middleware de segurança
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        imgSrc: [
          "'self'",
          "data:",
          "https://treinamento-arquiteturas.s3.sa-east-1.amazonaws.com"
        ],
        // Outras diretivas podem ser adicionadas conforme necessário
      }
    }
  })
);
app.use(cors());
app.use(limiter);

// Configuração do Handlebars
app.engine('handlebars', exphbs.engine({
  defaultLayout: 'main',
  layoutsDir: './views/layouts',
  partialsDir: './views/partials',
  helpers: helpers
}));
app.set('view engine', 'handlebars');
app.set('views', './views');

// Middleware para parsing
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Servir arquivos estáticos
app.use(express.static('public'));

// Importar rotas
const produtosRoutes = require('./routes/produtos');

// Usar rotas
app.use('/produtos', produtosRoutes);

// Rota principal
app.get('/', (req, res) => {
  res.redirect('/produtos');
});

// Middleware de tratamento de erros
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render('error', { 
    message: 'Algo deu errado!',
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

// Middleware para rotas não encontradas
app.use((req, res) => {
  res.status(404).render('error', { 
    message: 'Página não encontrada',
    error: {}
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  console.log(`Acesse: http://localhost:${PORT}`);
}); 