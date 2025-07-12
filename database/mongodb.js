const { MongoClient, ObjectId } = require('mongodb');

class MongoDB {
  constructor() {
    this.client = null;
    this.db = null;
    this.isConnected = false;
  }

  async connect() {
    try {
      const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017';
      this.client = new MongoClient(uri);
      await this.client.connect();
      this.db = this.client.db('aether');
      this.isConnected = true;
      console.log('🌌 MongoDB conectado com sucesso');
    } catch (error) {
      console.error('❌ Erro ao conectar MongoDB:', error);
      throw error;
    }
  }

  async disconnect() {
    if (this.client) {
      await this.client.close();
      this.isConnected = false;
      console.log('🌌 MongoDB desconectado');
    }
  }

  // Coleção de usuários
  getUsersCollection() {
    return this.db.collection('users');
  }

  // Coleção de conversas
  getConversationsCollection() {
    return this.db.collection('conversations');
  }

  // Coleção de sessões
  getSessionsCollection() {
    return this.db.collection('sessions');
  }

  // Métodos para usuários
  async createUser(userData) {
    try {
      const users = this.getUsersCollection();
      const result = await users.insertOne({
        ...userData,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      return result.insertedId;
    } catch (error) {
      console.error('❌ Erro ao criar usuário:', error);
      throw error;
    }
  }

  async findUserById(userId) {
    try {
      const users = this.getUsersCollection();
      return await users.findOne({ id: userId });
    } catch (error) {
      console.error('❌ Erro ao buscar usuário:', error);
      return null;
    }
  }

  async updateUser(userId, updateData) {
    try {
      const users = this.getUsersCollection();
      const result = await users.updateOne(
        { id: userId },
        { 
          $set: { 
            ...updateData, 
            updatedAt: new Date() 
          } 
        }
      );
      return result.modifiedCount > 0;
    } catch (error) {
      console.error('❌ Erro ao atualizar usuário:', error);
      return false;
    }
  }

  // Métodos para conversas
  async createConversation(userId, title = 'Nova Conversa') {
    try {
      const conversations = this.getConversationsCollection();
      const conversation = {
        userId,
        title,
        messages: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        isActive: true
      };
      const result = await conversations.insertOne(conversation);
      return result.insertedId;
    } catch (error) {
      console.error('❌ Erro ao criar conversa:', error);
      return null;
    }
  }

  async getUserConversations(userId) {
    try {
      console.log('📋 Buscando conversas para usuário:', userId);
      const conversations = this.getConversationsCollection();
      const result = await conversations.find({ 
        userId,
        isActive: true 
      }).sort({ updatedAt: -1 }).toArray();
      
      console.log('✅ Conversas encontradas:', result.length);
      result.forEach(conv => {
        console.log(`  - ${conv.title} (${conv._id}) - Ativa: ${conv.isActive}`);
      });
      
      return result;
    } catch (error) {
      console.error('❌ Erro ao buscar conversas:', error);
      return [];
    }
  }

  async getConversation(conversationId) {
    try {
      const conversations = this.getConversationsCollection();
      
      // Converter string para ObjectId
      let objectId;
      try {
        objectId = new ObjectId(conversationId);
      } catch (error) {
        console.log('❌ ID inválido:', conversationId);
        return null;
      }
      
      const result = await conversations.findOne({ _id: objectId });
      return result;
    } catch (error) {
      console.error('❌ Erro ao buscar conversa:', error);
      return null;
    }
  }

  async updateConversation(conversationId, messages, title = null) {
    try {
      const conversations = this.getConversationsCollection();
      
      // Converter string para ObjectId
      let objectId;
      try {
        objectId = new ObjectId(conversationId);
      } catch (error) {
        console.log('❌ ID inválido:', conversationId);
        return false;
      }
      
      const updateData = {
        messages,
        updatedAt: new Date()
      };
      
      if (title) {
        updateData.title = title;
      }
      
      const result = await conversations.updateOne(
        { _id: objectId },
        { $set: updateData }
      );
      return result.modifiedCount > 0;
    } catch (error) {
      console.error('❌ Erro ao atualizar conversa:', error);
      return false;
    }
  }

  async deleteConversation(conversationId) {
    try {
      console.log('🗑️ Tentando deletar conversa:', conversationId);
      const conversations = this.getConversationsCollection();
      
      // Converter string para ObjectId
      let objectId;
      try {
        objectId = new ObjectId(conversationId);
      } catch (error) {
        console.log('❌ ID inválido:', conversationId);
        return false;
      }
      
      // Verificar se a conversa existe antes de deletar
      const existingConversation = await conversations.findOne({ _id: objectId });
      if (!existingConversation) {
        console.log('❌ Conversa não encontrada:', conversationId);
        return false;
      }
      
      console.log('✅ Conversa encontrada, marcando como inativa:', existingConversation.title);
      
      const result = await conversations.updateOne(
        { _id: objectId },
        { $set: { isActive: false } }
      );
      
      console.log('✅ Resultado da atualização:', result.modifiedCount > 0);
      return result.modifiedCount > 0;
    } catch (error) {
      console.error('❌ Erro ao deletar conversa:', error);
      return false;
    }
  }

  async addMessageToConversation(conversationId, message) {
    try {
      const conversations = this.getConversationsCollection();
      
      // Converter string para ObjectId
      let objectId;
      try {
        objectId = new ObjectId(conversationId);
      } catch (error) {
        console.log('❌ ID inválido:', conversationId);
        return false;
      }
      
      const result = await conversations.updateOne(
        { _id: objectId },
        { 
          $push: { messages: message },
          $set: { updatedAt: new Date() }
        }
      );
      return result.modifiedCount > 0;
    } catch (error) {
      console.error('❌ Erro ao adicionar mensagem:', error);
      return false;
    }
  }

  // Métodos para sessões
  async createSession(sessionData) {
    try {
      const sessions = this.getSessionsCollection();
      const result = await sessions.insertOne({
        ...sessionData,
        createdAt: new Date(),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 dias
      });
      return result.insertedId;
    } catch (error) {
      console.error('❌ Erro ao criar sessão:', error);
      throw error;
    }
  }

  async findSession(sessionId) {
    try {
      const sessions = this.getSessionsCollection();
      return await sessions.findOne({ 
        sessionId, 
        expiresAt: { $gt: new Date() } 
      });
    } catch (error) {
      console.error('❌ Erro ao buscar sessão:', error);
      return null;
    }
  }

  async deleteSession(sessionId) {
    try {
      const sessions = this.getSessionsCollection();
      const result = await sessions.deleteOne({ sessionId });
      return result.deletedCount > 0;
    } catch (error) {
      console.error('❌ Erro ao deletar sessão:', error);
      return false;
    }
  }

  // Limpeza de sessões expiradas
  async cleanupExpiredSessions() {
    try {
      const sessions = this.getSessionsCollection();
      const result = await sessions.deleteMany({
        expiresAt: { $lt: new Date() }
      });
      console.log(`🧹 ${result.deletedCount} sessões expiradas removidas`);
    } catch (error) {
      console.error('❌ Erro ao limpar sessões:', error);
    }
  }

  // Estatísticas
  async getStats() {
    try {
      const users = this.getUsersCollection();
      const conversations = this.getConversationsCollection();
      const sessions = this.getSessionsCollection();

      const [userCount, conversationCount, sessionCount] = await Promise.all([
        users.countDocuments(),
        conversations.countDocuments({ isActive: true }),
        sessions.countDocuments()
      ]);

      return {
        users: userCount,
        conversations: conversationCount,
        activeSessions: sessionCount
      };
    } catch (error) {
      console.error('❌ Erro ao buscar estatísticas:', error);
      return { users: 0, conversations: 0, activeSessions: 0 };
    }
  }
}

// Instância singleton
const mongodb = new MongoDB();

module.exports = mongodb; 