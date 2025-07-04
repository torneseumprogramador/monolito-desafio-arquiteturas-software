# Arquitetura Refatorada - Separação de Responsabilidades

## Visão Geral

A aplicação foi refatorada seguindo os princípios de Domain-Driven Design (DDD) e Clean Architecture, separando claramente as responsabilidades em camadas distintas.

## Estrutura da Arquitetura

### 1. Entidades (`entities/`)
**Responsabilidade**: Representar os objetos de negócio com suas regras e validações.

#### `entities/Produto.js`
- Contém a lógica de negócio da entidade Produto
- Validações de domínio (nome obrigatório, preço > 0, etc.)
- Métodos de negócio (temEstoque, diminuirEstoque, aumentarEstoque)
- Métodos de mapeamento (toJSON, toResponse, fromDatabase, fromInput)
- Conversão e validação de tipos de dados

### 2. Repositórios (`repositories/`)
**Responsabilidade**: Acesso a dados e persistência.

#### `repositories/ProdutoRepository.js`
- Operações CRUD no banco de dados
- Conversão de dados do banco para entidades usando `fromDatabase`
- Uso dos métodos de mapeamento da entidade (`toJSON`)
- Queries específicas (busca por termo, atualização de estoque)
- Retorna entidades completas após operações de atualização
- Não contém lógica de negócio

### 3. Serviços (`services/`)
**Responsabilidade**: Orquestração de operações e lógica de aplicação.

#### `services/ProdutoService.js`
- Coordena operações entre repositório e entidades
- Gerencia cache (Redis)
- Integração com serviços externos (S3)
- Validações de aplicação
- Transações e rollback

### 4. Controllers (`controllers/`)
**Responsabilidade**: Interface com a camada de apresentação.

#### `controllers/ProdutoController.js`
- Recebe requisições HTTP
- Validação de entrada
- Renderização de views
- Tratamento de erros de apresentação
- Não contém lógica de negócio

## Fluxo de Dados

```
Request → Controller → Service → Repository → Database
                ↓
Response ← Controller ← Service ← Repository ← Database
```

## Benefícios da Refatoração

### 1. Separação de Responsabilidades
- Cada camada tem uma responsabilidade específica
- Facilita manutenção e testes
- Reduz acoplamento entre componentes

### 2. Testabilidade
- Entidades podem ser testadas isoladamente
- Serviços podem ser mockados para testes
- Repositórios podem ser testados independentemente

### 3. Reutilização
- Serviços podem ser reutilizados por diferentes controllers
- Repositórios podem ser usados por diferentes serviços
- Entidades podem ser usadas em diferentes contextos

### 4. Manutenibilidade
- Mudanças em uma camada não afetam outras
- Código mais organizado e legível
- Facilita debugging e troubleshooting

## Exemplo de Uso

### Antes (Controller com muita responsabilidade):
```javascript
static async create(req, res) {
  // Validação de entrada
  // Lógica de negócio
  // Acesso a dados
  // Cache
  // Upload de arquivo
  // Tratamento de erro
}
```

### Depois (Separação clara):
```javascript
// Controller - apenas interface
async create(req, res) {
  const produtoData = { ...req.body, imagem: req.file };
  await this.produtoService.criarProduto(produtoData);
  res.redirect('/produtos?message=Sucesso!');
}

// Service - orquestração
async criarProduto(produtoData) {
  const produto = Produto.fromInput(produtoData); // mapeamento
  produto.isValid(); // validação de domínio
  await this.produtoRepository.create(produto);
  await this.invalidarCache();
}

// Repository - mapeamento e dados
async create(produto) {
  const dados = produto.toJSON(); // mapeamento para persistência
  // SQL queries com dados mapeados
  produto.id = result.insertId; // atualiza a entidade
}

// Entity - regras de negócio e mapeamento
class Produto {
  toJSON() { /* mapeamento para persistência */ }
  toResponse() { /* mapeamento para resposta */ }
  static fromDatabase(data) { /* mapeamento do banco */ }
  static fromInput(data) { /* mapeamento de entrada */ }
}
```

## Melhorias Implementadas

✅ **Pasta `models/` removida**: Não faz mais sentido com a nova arquitetura
✅ **Mapeamento robusto na entidade**: Métodos `toJSON`, `toResponse`, `fromDatabase`, `fromInput`
✅ **Repositório com mapeamento**: Usa os métodos da entidade para conversão de dados
✅ **Conversão de tipos**: Preços como float, estoque como integer, datas como Date
✅ **Retorno de entidades**: Repositório retorna entidades completas após operações

## Próximos Passos

1. **Implementar Unit of Work**: Para gerenciar transações
2. **Adicionar DTOs**: Para transferência de dados entre camadas
3. **Implementar Injeção de Dependência**: Para melhor testabilidade
4. **Adicionar Validações**: Usando bibliotecas como Joi ou Yup
5. **Implementar Logging**: Para melhor observabilidade
6. **Adicionar Testes Unitários**: Para cada camada

## Convenções

- **Entidades**: PascalCase, métodos de negócio
- **Repositórios**: Sufixo "Repository", métodos CRUD
- **Serviços**: Sufixo "Service", métodos de orquestração
- **Controllers**: Sufixo "Controller", métodos HTTP 