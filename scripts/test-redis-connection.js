const redis = require('redis');

async function testRedisConnection() {
  console.log('🧪 Testando conexão com Redis...');
  
  const redisHost = process.env.REDIS_HOST || 'localhost';
  const redisPort = parseInt(process.env.REDIS_PORT) || 6379;
  const redisDb = parseInt(process.env.REDIS_DB) || 0;
  
  console.log('📋 Configurações:', {
    host: redisHost,
    port: redisPort,
    db: redisDb
  });
  
  console.log('🔍 Variáveis de ambiente:');
  console.log('REDIS_HOST:', process.env.REDIS_HOST);
  console.log('REDIS_PORT:', process.env.REDIS_PORT);
  console.log('REDIS_DB:', process.env.REDIS_DB);
  
  try {
    const client = redis.createClient({
      socket: {
        host: redisHost,
        port: redisPort,
        family: 4,
        connectTimeout: 10000,
        lazyConnect: true
      },
      database: redisDb
    });

    client.on('error', (err) => {
      console.error('❌ Redis Client Error:', err);
    });

    client.on('connect', () => {
      console.log('✅ Redis Client Connected');
    });

    client.on('ready', () => {
      console.log('✅ Redis Client Ready');
    });

    client.on('end', () => {
      console.log('🔌 Redis Client Disconnected');
    });

    console.log('🔄 Tentando conectar...');
    await client.connect();
    
    console.log('✅ Conexão estabelecida!');
    
    // Testar operações básicas
    console.log('🧪 Testando operações...');
    
    await client.set('test', 'Hello Redis!');
    const value = await client.get('test');
    console.log('📝 Valor recuperado:', value);
    
    await client.del('test');
    console.log('🗑️ Chave de teste removida');
    
    await client.quit();
    console.log('✅ Teste concluído com sucesso!');
    
  } catch (error) {
    console.error('❌ Erro no teste:', error);
    console.error('Stack trace:', error.stack);
  }
}

// Executar o teste
testRedisConnection(); 