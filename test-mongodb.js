require('dotenv').config();
const { MongoClient } = require('mongodb');

async function testMongoDBConnection() {
  const uri = process.env.MONGODB_URI;
  
  if (!uri) {
    console.log('❌ MONGODB_URI não configurada');
    return;
  }
  
  console.log('🧪 Testando conexão MongoDB...');
  console.log('📡 URI:', uri.replace(/\/\/[^:]+:[^@]+@/, '//***:***@'));
  
  // Teste 1: Configuração padrão
  console.log('\n🔍 Teste 1: Configuração padrão');
  try {
    const client1 = new MongoClient(uri, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 10000
    });
    await client1.connect();
    console.log('✅ Conexão padrão: SUCESSO');
    await client1.close();
  } catch (error) {
    console.log('❌ Conexão padrão: FALHA');
    console.log('   Erro:', error.message);
  }
  
  // Teste 2: Com TLS explícito
  console.log('\n🔍 Teste 2: Com TLS explícito');
  try {
    const client2 = new MongoClient(uri, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 10000,
      tls: true,
      tlsAllowInvalidCertificates: false,
      tlsAllowInvalidHostnames: false
    });
    await client2.connect();
    console.log('✅ Conexão com TLS: SUCESSO');
    await client2.close();
  } catch (error) {
    console.log('❌ Conexão com TLS: FALHA');
    console.log('   Erro:', error.message);
  }
  
  // Teste 3: Sem TLS
  console.log('\n🔍 Teste 3: Sem TLS');
  try {
    const client3 = new MongoClient(uri, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 10000,
      tls: false
    });
    await client3.connect();
    console.log('✅ Conexão sem TLS: SUCESSO');
    await client3.close();
  } catch (error) {
    console.log('❌ Conexão sem TLS: FALHA');
    console.log('   Erro:', error.message);
  }
  
  // Teste 4: Configuração completa
  console.log('\n🔍 Teste 4: Configuração completa');
  try {
    const client4 = new MongoClient(uri, {
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
      maxPoolSize: 10,
      minPoolSize: 1,
      maxIdleTimeMS: 30000,
      retryWrites: true,
      w: 'majority',
      tls: true,
      tlsAllowInvalidCertificates: false,
      tlsAllowInvalidHostnames: false
    });
    await client4.connect();
    console.log('✅ Conexão completa: SUCESSO');
    
    // Testar operação básica
    const db = client4.db('aether');
    const collections = await db.listCollections().toArray();
    console.log('📊 Coleções encontradas:', collections.length);
    
    await client4.close();
  } catch (error) {
    console.log('❌ Conexão completa: FALHA');
    console.log('   Erro:', error.message);
  }
  
  console.log('\n🏁 Testes concluídos');
}

testMongoDBConnection().catch(console.error); 