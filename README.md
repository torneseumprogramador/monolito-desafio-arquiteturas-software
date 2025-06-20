# Sistema de Cadastro de Produtos

Uma aplicação web completa para cadastro e gerenciamento de produtos, desenvolvida com Node.js, Express, MySQL e Bootstrap.

## 🚀 Características

- **Arquitetura MVC**: Estrutura organizada e escalável
- **Interface Moderna**: Design responsivo com Bootstrap 5
- **Banco de Dados MySQL**: Persistência robusta de dados
- **Docker**: Containerização completa da aplicação
- **CRUD Completo**: Create, Read, Update, Delete de produtos
- **Busca Inteligente**: Pesquisa por nome, descrição ou categoria
- **Validação de Dados**: Validação client-side e server-side
- **Interface Responsiva**: Funciona em desktop, tablet e mobile

## 🛠️ Tecnologias Utilizadas

### Backend
- **Node.js**: Runtime JavaScript
- **Express.js**: Framework web
- **MySQL2**: Driver MySQL para Node.js
- **Express-Handlebars**: Template engine
- **Body-Parser**: Parsing de requisições
- **Helmet**: Segurança HTTP
- **CORS**: Cross-Origin Resource Sharing

### Frontend
- **Bootstrap 5**: Framework CSS
- **Bootstrap Icons**: Ícones
- **JavaScript**: Interatividade
- **Handlebars**: Templates HTML

### Infraestrutura
- **Docker**: Containerização
- **Docker Compose**: Orquestração de containers
- **MySQL 8.0**: Banco de dados
- **phpMyAdmin**: Interface de administração do banco

## 📋 Pré-requisitos

- Docker e Docker Compose instalados
- Node.js 18+ (para desenvolvimento local)
- MySQL 8.0+ (para desenvolvimento local)

## 🚀 Como Executar

### Usando Docker (Recomendado)

1. **Clone o repositório**
   ```bash
   git clone <url-do-repositorio>
   cd produtos-app
   ```

2. **Execute com Docker Compose**
   ```bash
   docker-compose up -d
   ```

3. **Acesse a aplicação**
   - Aplicação: http://localhost:3000
   - phpMyAdmin: http://localhost:8080

### Desenvolvimento Local

1. **Instale as dependências**
   ```bash
   npm install
   ```

2. **Configure o banco de dados**
   - Crie um banco MySQL chamado `produtos_db`
   - Execute o script `database/init.sql`

3. **Configure as variáveis de ambiente**
   ```bash
   cp env.example .env
   # Edite o arquivo .env com suas configurações
   ```

4. **Execute a aplicação**
   ```bash
   npm run dev
   ```

## 📁 Estrutura do Projeto```
produtos-app/
├── app.js                 # Arquivo principal da aplicação
├── package.json           # Dependências e scripts
├── Dockerfile            # Configuração do container
├── docker-compose.yml    # Orquestração dos serviços
├── env.example           # Exemplo de variáveis de ambiente
├── README.md             # Documentação
├── config/
│   └── database.js       # Configuração do banco de dados
├── controllers/
│   └── ProdutoController.js # Lógica de negócio
├── models/
│   └── Produto.js        # Modelo de dados
├── routes/
│   └── produtos.js       # Definição das rotas
├── views/
│   ├── layouts/
│   │   └── main.handlebars # Layout principal
│   └── produtos/
│       ├── index.handlebars # Lista de produtos
│       ├── create.handlebars # Formulário de criação
│       ├── edit.handlebars   # Formulário de edição
│       └── show.handlebars   # Detalhes do produto
├── public/
│   ├── css/
│   │   └── style.css     # Estilos personalizados
│   └── js/
│       └── script.js     # JavaScript do frontend
└── database/
    └── init.sql          # Script de inicialização do banco
```

## 🗄️ Banco de Dados

### Tabela `produtos`

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | INT | Chave primária (auto-incremento) |
| nome | VARCHAR(255) | Nome do produto |
| descricao | TEXT | Descrição detalhada |
| preco | DECIMAL(10,2) | Preço do produto |
| categoria | VARCHAR(100) | Categoria do produto |
| estoque | INT | Quantidade em estoque |
| created_at | TIMESTAMP | Data de criação |
| updated_at | TIMESTAMP | Data da última atualização |

### Categorias Disponíveis
- Eletrônicos
- Vestuário
- Casa e Jardim
- Esportes
- Livros
- Alimentos
- Outros

## 🔧 Funcionalidades

### CRUD de Produtos
- ✅ **Criar**: Adicionar novos produtos
- ✅ **Listar**: Visualizar todos os produtos
- ✅ **Visualizar**: Ver detalhes de um produto
- ✅ **Editar**: Modificar produtos existentes
- ✅ **Excluir**: Remover produtos

### Busca e Filtros
- 🔍 Busca por nome, descrição ou categoria
- 📊 Visualização por cards responsivos
- 🏷️ Filtros por categoria
- 📈 Indicadores de estoque

### Interface
- 📱 Design responsivo
- 🎨 Interface moderna com Bootstrap
- ⚡ Animações suaves
- 🔔 Notificações de sucesso/erro
- 🎯 Confirmação para exclusões

## 🐳 Comandos Docker

```bash
# Iniciar todos os serviços
docker-compose up -d

# Ver logs da aplicação
docker-compose logs app

# Parar todos os serviços
docker-compose down

# Reconstruir containers
docker-compose up --build

# Acessar container da aplicação
docker-compose exec app sh

# Acessar container do MySQL
docker-compose exec mysql mysql -u root -p
```

## 🔒 Segurança

- **Helmet**: Headers de segurança HTTP
- **Rate Limiting**: Proteção contra ataques de força bruta
- **CORS**: Configuração de origens permitidas
- **Validação**: Validação de dados de entrada
- **Prepared Statements**: Prevenção de SQL Injection

## 🧪 Testes

Para executar testes (quando implementados):

```bash
npm test
```

## 📝 API Endpoints

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/produtos` | Listar todos os produtos |
| GET | `/produtos/create` | Formulário de criação |
| POST | `/produtos` | Criar novo produto |
| GET | `/produtos/:id` | Visualizar produto |
| GET | `/produtos/:id/edit` | Formulário de edição |
| POST | `/produtos/:id` | Atualizar produto |
| POST | `/produtos/:id/delete` | Excluir produto |
| GET | `/produtos/search` | Buscar produtos |

## 🤝 Contribuindo

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 👨‍💻 Autor

**Desafio Arquitetura**
- GitHub: [@seu-usuario](https://github.com/seu-usuario)

## 🎓 Torne-se um Programador

O Torne-se um Programador é uma plataforma de ensino focada em desenvolvimento de software e arquitetura. O curso Desafio de Arquiteturas de Software faz parte do programa e tem como objetivo ensinar na prática os principais conceitos e padrões de arquitetura de software através de projetos reais.

Acesse: https://www.torneseumprogramador.com.br/

## 🔗 Repositório Original
Este projeto faz parte do Desafio de Arquiteturas de Software e pode ser encontrado em:
https://github.com/torneseumprogramador/monolito-desafio-arquiteturas-software

## 🙏 Agradecimentos

- Bootstrap para o framework CSS
- Express.js para o framework web
- MySQL para o banco de dados
- Docker para a containerização

---

**Desenvolvido com ❤️ usando Node.js, Express, MySQL e Bootstrap** 

