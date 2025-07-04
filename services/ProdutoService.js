const ProdutoRepository = require('../repositories/ProdutoRepository');
const Produto = require('../entities/Produto');
const redisService = require('./RedisService');
const { S3Service } = require('./S3Service');

class ProdutoService {
  constructor() {
    this.produtoRepository = new ProdutoRepository();
  }

  // Listar todos os produtos com cache
  async listarProdutos() {
    try {
      const cacheKey = 'produtos:lista';
      const cacheTTL = parseInt(process.env.REDIS_CACHE_TTL) || 60;
      
      // Tentar buscar do cache primeiro
      let produtos = null;
      if (redisService.isConfigured()) {
        produtos = await redisService.get(cacheKey);
      }
      
      // Se não encontrou no cache, buscar do repositório
      if (!produtos) {
        produtos = await this.produtoRepository.findAll();
        
        // Salvar no cache se o Redis estiver configurado
        if (redisService.isConfigured()) {
          await redisService.set(cacheKey, produtos, cacheTTL);
        }
      }
      
      return produtos;
    } catch (error) {
      throw new Error('Erro ao listar produtos: ' + error.message);
    }
  }

  // Buscar produto por ID
  async buscarProdutoPorId(id) {
    try {
      const produto = await this.produtoRepository.findById(id);
      if (!produto) {
        throw new Error('Produto não encontrado');
      }
      return produto;
    } catch (error) {
      throw new Error('Erro ao buscar produto: ' + error.message);
    }
  }

  // Criar novo produto
  async criarProduto(produtoData) {
    try {
      // Criar instância da entidade usando o método de mapeamento
      const produto = Produto.fromInput(produtoData);
      
      // Validar produto
      const validation = produto.isValid();
      if (!validation.isValid) {
        throw new Error(validation.errors.join(', '));
      }

      // Processar imagem se fornecida
      if (produtoData.imagem) {
        if (!S3Service.isConfigured()) {
          throw new Error('Configuração do S3 não encontrada');
        }
        produto.imagem = S3Service.getFileUrl(produtoData.imagem);
      }

      // Salvar no repositório
      await this.produtoRepository.create(produto);

      // Invalidar cache
      await this.invalidarCache();

      return produto;
    } catch (error) {
      throw new Error('Erro ao criar produto: ' + error.message);
    }
  }

  // Atualizar produto
  async atualizarProduto(id, produtoData) {
    try {
      // Buscar produto existente
      const produtoExistente = await this.produtoRepository.findById(id);
      if (!produtoExistente) {
        throw new Error('Produto não encontrado');
      }

      // Criar nova instância com dados atualizados
      const produto = new Produto({
        ...produtoExistente.toJSON(),
        ...produtoData
      });

      // Validar produto
      const validation = produto.isValid();
      if (!validation.isValid) {
        throw new Error(validation.errors.join(', '));
      }

      // Processar nova imagem se fornecida
      if (produtoData.imagem) {
        if (!S3Service.isConfigured()) {
          throw new Error('Configuração do S3 não encontrada');
        }
        
        // Deletar imagem antiga se existir
        if (produtoExistente.imagem && produtoExistente.imagem.includes('s3')) {
          await S3Service.deleteFile(produtoExistente.imagem);
        }
        
        produto.imagem = S3Service.getFileUrl(produtoData.imagem);
      }

      // Atualizar no repositório
      const success = await this.produtoRepository.update(id, produto);
      if (!success) {
        throw new Error('Erro ao atualizar produto');
      }

      // Invalidar cache
      await this.invalidarCache();

      return produto;
    } catch (error) {
      throw new Error('Erro ao atualizar produto: ' + error.message);
    }
  }

  // Deletar produto
  async deletarProduto(id) {
    try {
      // Buscar produto antes de deletar
      const produto = await this.produtoRepository.findById(id);
      if (!produto) {
        throw new Error('Produto não encontrado');
      }

      // Deletar do repositório
      const success = await this.produtoRepository.delete(id);
      if (!success) {
        throw new Error('Erro ao deletar produto');
      }

      // Deletar imagem do S3 se existir
      if (produto.imagem && produto.imagem.includes('s3')) {
        await S3Service.deleteFile(produto.imagem);
      }

      // Invalidar cache
      await this.invalidarCache();

      return true;
    } catch (error) {
      throw new Error('Erro ao deletar produto: ' + error.message);
    }
  }

  // Buscar produtos por termo
  async buscarProdutos(termo) {
    try {
      if (!termo || termo.trim().length === 0) {
        return await this.listarProdutos();
      }
      
      return await this.produtoRepository.search(termo);
    } catch (error) {
      throw new Error('Erro ao buscar produtos: ' + error.message);
    }
  }

  // Atualizar estoque
  async atualizarEstoque(id, quantidade) {
    try {
      const produto = await this.produtoRepository.findById(id);
      if (!produto) {
        throw new Error('Produto não encontrado');
      }

      produto.aumentarEstoque(quantidade);
      
      const produtoAtualizado = await this.produtoRepository.updateEstoque(id, produto.estoque);
      if (!produtoAtualizado) {
        throw new Error('Erro ao atualizar estoque');
      }

      // Invalidar cache
      await this.invalidarCache();

      return produtoAtualizado;
    } catch (error) {
      throw new Error('Erro ao atualizar estoque: ' + error.message);
    }
  }

  // Diminuir estoque
  async diminuirEstoque(id, quantidade = 1) {
    try {
      const produto = await this.produtoRepository.findById(id);
      if (!produto) {
        throw new Error('Produto não encontrado');
      }

      if (!produto.diminuirEstoque(quantidade)) {
        throw new Error('Estoque insuficiente');
      }

      const produtoAtualizado = await this.produtoRepository.updateEstoque(id, produto.estoque);
      if (!produtoAtualizado) {
        throw new Error('Erro ao atualizar estoque');
      }

      // Invalidar cache
      await this.invalidarCache();

      return produtoAtualizado;
    } catch (error) {
      throw new Error('Erro ao diminuir estoque: ' + error.message);
    }
  }

  // Invalidar cache do Redis
  async invalidarCache(keys = []) {
    if (!redisService.isConfigured()) return;
    
    try {
      const cacheKeys = keys.length > 0 ? keys : ['produtos:lista'];
      for (const key of cacheKeys) {
        await redisService.del(key);
      }
    } catch (error) {
      console.error('Erro ao invalidar cache:', error);
    }
  }
}

module.exports = ProdutoService; 