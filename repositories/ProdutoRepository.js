const db = require('../config/database');
const Produto = require('../entities/Produto');

class ProdutoRepository {
  async findAll() {
    try {
      const [rows] = await db.execute('SELECT * FROM produtos ORDER BY created_at DESC');
      return rows.map(row => Produto.fromDatabase(row));
    } catch (error) {
      throw new Error('Erro ao buscar produtos: ' + error.message);
    }
  }

  async findById(id) {
    try {
      const [rows] = await db.execute('SELECT * FROM produtos WHERE id = ?', [id]);
      return rows[0] ? Produto.fromDatabase(rows[0]) : null;
    } catch (error) {
      throw new Error('Erro ao buscar produto: ' + error.message);
    }
  }

  async create(produto) {
    try {
      // Usar o método toJSON da entidade para obter os dados
      const produtoData = produto.toJSON();
      const { nome, descricao, preco, categoria, estoque, imagem } = produtoData;
      
      const [result] = await db.execute(
        'INSERT INTO produtos (nome, descricao, preco, categoria, estoque, imagem) VALUES (?, ?, ?, ?, ?, ?)',
        [nome, descricao, preco, categoria, estoque, imagem]
      );
      
      // Retornar o ID criado e atualizar a entidade
      const id = result.insertId;
      produto.id = id;
      return id;
    } catch (error) {
      throw new Error('Erro ao criar produto: ' + error.message);
    }
  }

  async update(id, produto) {
    try {
      // Usar o método toJSON da entidade para obter os dados
      const produtoData = produto.toJSON();
      const { nome, descricao, preco, categoria, estoque, imagem } = produtoData;
      
      let query = 'UPDATE produtos SET nome = ?, descricao = ?, preco = ?, categoria = ?, estoque = ?, updated_at = NOW()';
      const params = [nome, descricao, preco, categoria, estoque];
      
      if (imagem) {
        query += ', imagem = ?';
        params.push(imagem);
      }
      
      query += ' WHERE id = ?';
      params.push(id);
      
      const [result] = await db.execute(query, params);
      
      // Atualizar o updated_at da entidade
      produto.updated_at = new Date();
      
      return result.affectedRows > 0;
    } catch (error) {
      throw new Error('Erro ao atualizar produto: ' + error.message);
    }
  }

  async delete(id) {
    try {
      const [result] = await db.execute('DELETE FROM produtos WHERE id = ?', [id]);
      return result.affectedRows > 0;
    } catch (error) {
      throw new Error('Erro ao deletar produto: ' + error.message);
    }
  }

  async search(termo) {
    try {
      const [rows] = await db.execute(
        'SELECT * FROM produtos WHERE nome LIKE ? OR descricao LIKE ? OR categoria LIKE ? ORDER BY created_at DESC',
        [`%${termo}%`, `%${termo}%`, `%${termo}%`]
      );
      return rows.map(row => Produto.fromDatabase(row));
    } catch (error) {
      throw new Error('Erro ao buscar produtos: ' + error.message);
    }
  }

  async updateEstoque(id, estoque) {
    try {
      const [result] = await db.execute(
        'UPDATE produtos SET estoque = ?, updated_at = NOW() WHERE id = ?',
        [estoque, id]
      );
      
      if (result.affectedRows > 0) {
        // Buscar o produto atualizado e retornar a entidade
        return await this.findById(id);
      }
      
      return null;
    } catch (error) {
      throw new Error('Erro ao atualizar estoque: ' + error.message);
    }
  }
}

module.exports = ProdutoRepository; 