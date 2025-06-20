const db = require('../config/database');

class Produto {
  static async findAll() {
    try {
      const [rows] = await db.execute('SELECT * FROM produtos ORDER BY created_at DESC');
      return rows;
    } catch (error) {
      throw new Error('Erro ao buscar produtos: ' + error.message);
    }
  }

  static async findById(id) {
    try {
      const [rows] = await db.execute('SELECT * FROM produtos WHERE id = ?', [id]);
      return rows[0];
    } catch (error) {
      throw new Error('Erro ao buscar produto: ' + error.message);
    }
  }

  static async create(produtoData) {
    try {
      const { nome, descricao, preco, categoria, estoque } = produtoData;
      const [result] = await db.execute(
        'INSERT INTO produtos (nome, descricao, preco, categoria, estoque) VALUES (?, ?, ?, ?, ?)',
        [nome, descricao, preco, categoria, estoque]
      );
      return result.insertId;
    } catch (error) {
      throw new Error('Erro ao criar produto: ' + error.message);
    }
  }

  static async update(id, produtoData) {
    try {
      const { nome, descricao, preco, categoria, estoque } = produtoData;
      const [result] = await db.execute(
        'UPDATE produtos SET nome = ?, descricao = ?, preco = ?, categoria = ?, estoque = ?, updated_at = NOW() WHERE id = ?',
        [nome, descricao, preco, categoria, estoque, id]
      );
      return result.affectedRows > 0;
    } catch (error) {
      throw new Error('Erro ao atualizar produto: ' + error.message);
    }
  }

  static async delete(id) {
    try {
      const [result] = await db.execute('DELETE FROM produtos WHERE id = ?', [id]);
      return result.affectedRows > 0;
    } catch (error) {
      throw new Error('Erro ao deletar produto: ' + error.message);
    }
  }

  static async search(termo) {
    try {
      const [rows] = await db.execute(
        'SELECT * FROM produtos WHERE nome LIKE ? OR descricao LIKE ? OR categoria LIKE ? ORDER BY created_at DESC',
        [`%${termo}%`, `%${termo}%`, `%${termo}%`]
      );
      return rows;
    } catch (error) {
      throw new Error('Erro ao buscar produtos: ' + error.message);
    }
  }
}

module.exports = Produto; 