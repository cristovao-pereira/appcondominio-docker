const { PrismaClient } = require('@prisma/client');
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');
const bcrypt = require('bcrypt');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('==> Iniciando o seed do banco de dados com Driver Adapter...');

  const adminEmail = 'admin@obsidian.com';
  
  // Verifica se o administrador já existe
  const existingUser = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (existingUser) {
    console.log(`[Seed] O usuário administrador (${adminEmail}) já está cadastrado.`);
    return;
  }

  // Gera o hash bcrypt da senha padrão do administrador usando salt 12
  console.log('[Seed] Gerando hash da senha do administrador...');
  const hashedPassword = await bcrypt.hash('Admin@123', 12);

  // Cria o usuário administrador
  const admin = await prisma.user.create({
    data: {
      email: adminEmail,
      name: 'Administrador',
      password: hashedPassword,
      role: 'admin',
    },
  });

  console.log(`[Seed] Usuário administrador criado com sucesso: ${admin.email} (ID: ${admin.id})`);
}

main()
  .catch((e) => {
    console.error('Erro ao executar o seed do banco de dados:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
