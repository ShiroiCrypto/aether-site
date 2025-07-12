require('dotenv').config();

async function testConfigurations() {
  console.log('🧪 Testando configurações do Aether...\n');

  // Testar variáveis de ambiente
  console.log('📋 Variáveis de Ambiente:');
  console.log(`  NODE_ENV: ${process.env.NODE_ENV || 'development'}`);
  console.log(`  PORT: ${process.env.PORT || 8080}`);
  console.log(`  DISCORD_CLIENT_ID: ${process.env.DISCORD_CLIENT_ID ? '✅ Configurado' : '❌ Não configurado'}`);
  console.log(`  DISCORD_CLIENT_SECRET: ${process.env.DISCORD_CLIENT_SECRET ? '✅ Configurado' : '❌ Não configurado'}`);
  console.log(`  DISCORD_REDIRECT_URI: ${process.env.DISCORD_REDIRECT_URI || '❌ Não configurado'}`);
  console.log(`  GEMINI_API_KEY: ${process.env.GEMINI_API_KEY ? '✅ Configurado' : '❌ Não configurado'}`);
  console.log(`  SESSION_SECRET: ${process.env.SESSION_SECRET ? '✅ Configurado' : '❌ Não configurado'}`);
  console.log(`  MONGODB_URI: ${process.env.MONGODB_URI ? '✅ Configurado' : '❌ Não configurado'}`);

  // Testar MongoDB
  if (process.env.MONGODB_URI) {
    console.log('\n🗄️ Testando MongoDB...');
    const { MongoClient } = require('mongodb');
    
    const client = new MongoClient(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 10000,
      tls: true,
      tlsAllowInvalidCertificates: false,
      tlsAllowInvalidHostnames: false
    });
    
    try {
      await client.connect();
      console.log('✅ MongoDB: Conectado com sucesso');
      
      const db = client.db('aether');
      const collections = await db.listCollections().toArray();
      console.log(`📊 Coleções encontradas: ${collections.length}`);
      
      await client.close();
    } catch (error) {
      console.log('❌ MongoDB: Erro na conexão');
      console.log(`   Erro: ${error.message}`);
    }
  } else {
    console.log('\n⚠️ MongoDB: URI não configurada');
  }

  // Testar Discord OAuth2
  console.log('\n🔐 Testando Discord OAuth2...');
  if (process.env.DISCORD_CLIENT_ID && process.env.DISCORD_CLIENT_SECRET && process.env.DISCORD_REDIRECT_URI) {
    console.log('✅ Discord OAuth2: Configuração completa');
    console.log(`   Redirect URI: ${process.env.DISCORD_REDIRECT_URI}`);
    
    // Verificar se o redirect URI está correto para produção
    if (process.env.NODE_ENV === 'production') {
      if (process.env.DISCORD_REDIRECT_URI.includes('aether.discloud.app')) {
        console.log('✅ Redirect URI: Configurado para produção');
      } else {
        console.log('⚠️ Redirect URI: Pode não estar configurado para produção');
      }
    }
  } else {
    console.log('❌ Discord OAuth2: Configuração incompleta');
  }

  // Testar Gemini API
  console.log('\n🤖 Testando Gemini API...');
  if (process.env.GEMINI_API_KEY) {
    console.log('✅ Gemini API: Chave configurada');
  } else {
    console.log('❌ Gemini API: Chave não configurada');
  }

  console.log('\n🏁 Teste concluído!');
}

testConfigurations().catch(console.error); 