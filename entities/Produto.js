class Produto {
  constructor(data = {}) {
    this.id = data.id || null;
    this.nome = data.nome || '';
    this.descricao = data.descricao || '';
    this.preco = data.preco || 0;
    this.categoria = data.categoria || '';
    this.estoque = data.estoque || 0;
    this.imagem = data.imagem || null;
    this.created_at = data.created_at || new Date();
    this.updated_at = data.updated_at || new Date();
  }

  // Validações de negócio
  isValid() {
    const errors = [];
    
    if (!this.nome || this.nome.trim().length === 0) {
      errors.push('Nome é obrigatório');
    }
    
    if (!this.preco || this.preco <= 0) {
      errors.push('Preço deve ser maior que zero');
    }
    
    if (!this.categoria || this.categoria.trim().length === 0) {
      errors.push('Categoria é obrigatória');
    }
    
    if (this.estoque < 0) {
      errors.push('Estoque não pode ser negativo');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Métodos de negócio
  temEstoque() {
    return this.estoque > 0;
  }

  diminuirEstoque(quantidade = 1) {
    if (this.estoque >= quantidade) {
      this.estoque -= quantidade;
      this.updated_at = new Date();
      return true;
    }
    return false;
  }

  aumentarEstoque(quantidade = 1) {
    this.estoque += quantidade;
    this.updated_at = new Date();
  }

  // Converter para objeto simples (para persistência)
  toJSON() {
    return {
      id: this.id,
      nome: this.nome,
      descricao: this.descricao,
      preco: this.preco,
      categoria: this.categoria,
      estoque: this.estoque,
      imagem: this.imagem,
      created_at: this.created_at,
      updated_at: this.updated_at
    };
  }

  // Converter para objeto de resposta (sem dados sensíveis)
  toResponse() {
    return {
      id: this.id,
      nome: this.nome,
      descricao: this.descricao,
      preco: this.preco,
      categoria: this.categoria,
      estoque: this.estoque,
      imagem: this.imagem,
      temEstoque: this.temEstoque(),
      created_at: this.created_at,
      updated_at: this.updated_at
    };
  }

  // Criar instância a partir de dados do banco
  static fromDatabase(data) {
    if (!data) return null;
    
    return new Produto({
      id: data.id,
      nome: data.nome,
      descricao: data.descricao,
      preco: parseFloat(data.preco) || 0,
      categoria: data.categoria,
      estoque: parseInt(data.estoque) || 0,
      imagem: data.imagem,
      created_at: data.created_at ? new Date(data.created_at) : new Date(),
      updated_at: data.updated_at ? new Date(data.updated_at) : new Date()
    });
  }

  // Criar instância a partir de dados de entrada (formulário)
  static fromInput(data) {
    return new Produto({
      nome: data.nome,
      descricao: data.descricao,
      preco: parseFloat(data.preco) || 0,
      categoria: data.categoria,
      estoque: parseInt(data.estoque) || 0,
      imagem: data.imagem
    });
  }
}

module.exports = Produto; 