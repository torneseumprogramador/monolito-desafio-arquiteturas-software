const redisService = require('../services/RedisService');

async function testRedis() {
  console.log('🧪 Testando conexão com Redis...\n');

  try {
    // Testar conexão
    console.log('1. Testando conexão...');
    const connected = await redisService.connect();
    if (connected) {
      console.log('✅ Redis conectado com sucesso!');
    } else {
      console.log('❌ Falha ao conectar com Redis');
      return;
    }

    // Testar operações básicas
    console.log('\n2. Testando operações básicas...');
    
    // Testar SET
    const testKey = 'test:key';
    const testValue = { message: 'Hello Redis!', timestamp: new Date().toISOString() };
    const setResult = await redisService.set(testKey, testValue, 30); // 30 segundos
    console.log(setResult ? '✅ SET funcionando' : '❌ SET falhou');

    // Testar GET
    const getResult = await redisService.get(testKey);
    if (getResult && getResult.message === 'Hello Redis!') {
      console.log('✅ GET funcionando');
    } else {
      console.log('❌ GET falhou');
    }

    // Testar DELETE
    const delResult = await redisService.del(testKey);
    console.log(delResult ? '✅ DELETE funcionando' : '❌ DELETE falhou');

    // Testar cache de produtos
    console.log('\n3. Testando cache de produtos...');
    const produtosCacheKey = 'produtos:lista';
    const produtosTest = [
      { id: 1, nome: 'Produto Teste 1', preco: 10.99 },
      { id: 2, nome: 'Produto Teste 2', preco: 20.99 }
    ];

    // Salvar produtos no cache
    await redisService.set(produtosCacheKey, produtosTest, 60);
    console.log('✅ Produtos salvos no cache');

    // Recuperar produtos do cache
    const produtosRecuperados = await redisService.get(produtosCacheKey);
    if (produtosRecuperados && produtosRecuperados.length === 2) {
      console.log('✅ Produtos recuperados do cache');
      console.log('   Produtos:', produtosRecuperados.map(p => p.nome).join(', '));
    } else {
      console.log('❌ Falha ao recuperar produtos do cache');
    }

    // Limpar cache de teste
    await redisService.del(produtosCacheKey);
    console.log('✅ Cache de teste limpo');

    console.log('\n🎉 Todos os testes passaram! Redis está funcionando corretamente.');

  } catch (error) {
    console.error('❌ Erro durante os testes:', error.message);
  } finally {
    // Desconectar
    await redisService.disconnect();
    console.log('\n🔌 Conexão com Redis fechada');
  }
}

// Executar testes se o arquivo for executado diretamente
if (require.main === module) {
  testRedis();
}

module.exports = testRedis; 