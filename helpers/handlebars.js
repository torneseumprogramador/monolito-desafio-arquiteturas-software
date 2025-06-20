// Helpers personalizados para o Handlebars

module.exports = {
  // Formatar data
  formatDate: function(date) {
    if (!date) return '';
    
    const d = new Date(date);
    return d.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  },

  // Formatar preço
  formatPrice: function(price) {
    if (!price) return 'R$ 0,00';
    
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  },

  // Comparação de igualdade
  eq: function(a, b) {
    return a === b;
  },

  // Comparação maior que
  gt: function(a, b) {
    return a > b;
  },

  // Comparação menor que
  lt: function(a, b) {
    return a < b;
  },

  // Verificar se array tem elementos
  hasItems: function(array) {
    return array && array.length > 0;
  },

  // Capitalizar primeira letra
  capitalize: function(str) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
  },

  // Truncar texto
  truncate: function(str, length) {
    if (!str) return '';
    if (str.length <= length) return str;
    return str.substring(0, length) + '...';
  },

  // Adicionar classe CSS baseada no estoque
  stockClass: function(estoque) {
    if (estoque > 10) return 'bg-success';
    if (estoque > 0) return 'bg-warning';
    return 'bg-danger';
  },

  // Verificar se é o primeiro item
  isFirst: function(index) {
    return index === 0;
  },

  // Verificar se é o último item
  isLast: function(index, array) {
    return index === array.length - 1;
  }
}; 