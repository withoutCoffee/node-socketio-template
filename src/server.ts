import { env } from "./config/env";
import createApp from "./app";
import prisma from "./lib/prisma";

const startSever = async () => {
  try {
    console.log("Verificando conexão com o banco de dados...");
    await prisma.$connect();
    console.log("Conexão com o banco de dados estabelecida com sucesso!");

    const app = createApp();

    const server = app.listen(env.port, () => {
      console.log(`Servidor rodando na porta ${env.port}`);
      console.log("Pressione CTRL+C para parar o servidor");
    });
    // ============================================
    // GRACEFUL SHUTDOWN
    // ============================================
    const gracefulShutdown = async (signal: string) => {
      console.log("");
      console.log(`\n⚠️  ${signal} recebido. Encerrando servidor...`);

      // Fechar servidor HTTP
      server.close(async () => {
        console.log("✅ Servidor HTTP encerrado");

        // Desconectar do banco de dados
        try {
          await prisma.$disconnect();
          console.log("✅ Conexão com banco de dados encerrada");
        } catch (error) {
          console.error("❌ Erro ao desconectar do banco:", error);
        }

        console.log("👋 Servidor encerrado com sucesso!");
        process.exit(0);
      });

      // Forçar encerramento após 10 segundos
      setTimeout(() => {
        console.error("❌ Tempo limite excedido, forçando encerramento...");
        process.exit(1);
      }, 10000);
    };

    // Capturar sinais de encerramento
    process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
    process.on("SIGINT", () => gracefulShutdown("SIGINT"));
  } catch (error) {
    console.error("");
    console.error(
      "Erro ao iniciar o servidor:",
      error instanceof Error ? error.message : String(error),
    );
    console.error(
      "Certifique-se de que o banco de dados esteja rodando e a variável de ambiente DATABASE_URL esteja configurada corretamente.",
    );
    process.exit(1);
  }
};

startSever();
