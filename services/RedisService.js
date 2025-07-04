const redis = require('redis');

class RedisService {
  constructor() {
    this.client = null;
    this.isConnected = false;
  }

  async connect() {
    try {
      const redisHost = process.env.REDIS_HOST || 'localhost';
      const redisPort = parseInt(process.env.REDIS_PORT) || 6379;
      const redisDb = parseInt(process.env.REDIS_DB) || 0;
      
      console.log('🔍 Conectando ao Redis:', `${redisHost}:${redisPort}`);
      
      // Configuração para Redis v4+
      this.client = redis.createClient({
        socket: {
          host: redisHost,
          port: redisPort,
          family: 4, // Forçar IPv4
          connectTimeout: 10000,
          lazyConnect: true
        },
        database: redisDb,
        retry_strategy: (options) => {
          if (options.error && options.error.code === 'ECONNREFUSED') {
            console.log('Redis server refused connection');
            return new Error('Redis server refused connection');
          }
          if (options.total_retry_time > 1000 * 60 * 60) {
            console.log('Redis retry time exhausted');
            return new Error('Redis retry time exhausted');
          }
          if (options.attempt > 10) {
            console.log('Redis max retry attempts reached');
            return undefined;
          }
          return Math.min(options.attempt * 100, 3000);
        }
      });

      this.client.on('error', (err) => {
        console.error('❌ Redis Error:', err.message);
        this.isConnected = false;
      });

      this.client.on('connect', () => {
        console.log('✅ Redis conectado');
        this.isConnected = true;
      });

      this.client.on('ready', () => {
        console.log('✅ Redis pronto');
        this.isConnected = true;
      });

      this.client.on('end', () => {
        console.log('🔌 Redis desconectado');
        this.isConnected = false;
      });

      await this.client.connect();
      console.log('✅ Redis inicializado com sucesso');
      return true;
    } catch (error) {
      console.error('❌ Erro ao conectar com Redis:', error.message);
      this.isConnected = false;
      return false;
    }
  }

  async disconnect() {
    if (this.client) {
      await this.client.quit();
      this.isConnected = false;
    }
  }

  async get(key) {
    try {
      if (!this.isConnected || !this.client) {
        return null;
      }
      const value = await this.client.get(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.error('Erro ao buscar no Redis:', error);
      return null;
    }
  }

  async set(key, value, ttl = null) {
    try {
      if (!this.isConnected || !this.client) {
        return false;
      }
      
      const serializedValue = JSON.stringify(value);
      
      if (ttl) {
        await this.client.setEx(key, ttl, serializedValue);
      } else {
        await this.client.set(key, serializedValue);
      }
      
      return true;
    } catch (error) {
      console.error('Erro ao salvar no Redis:', error);
      return false;
    }
  }

  async del(key) {
    try {
      if (!this.isConnected || !this.client) {
        return false;
      }
      await this.client.del(key);
      return true;
    } catch (error) {
      console.error('Erro ao deletar do Redis:', error);
      return false;
    }
  }

  async flush() {
    try {
      if (!this.isConnected || !this.client) {
        return false;
      }
      await this.client.flushDb();
      return true;
    } catch (error) {
      console.error('Erro ao limpar Redis:', error);
      return false;
    }
  }

  isConfigured() {
    return process.env.REDIS_HOST && process.env.REDIS_PORT;
  }
}

// Instância singleton
const redisService = new RedisService();

module.exports = redisService; 