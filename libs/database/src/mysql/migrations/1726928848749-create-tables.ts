import { MigrationInterface, QueryRunner } from 'typeorm'

export class CreateTables1726928848749 implements MigrationInterface {
  name = 'CreateTables1726928848749'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE \`users\` (\`id\` int NOT NULL AUTO_INCREMENT, \`firstName\` varchar(255) NOT NULL, \`lastName\` varchar(255) NOT NULL, \`email\` varchar(255) NOT NULL, \`birthDate\` varchar(255) NOT NULL, \`image\` varchar(255) NULL, \`password\` varchar(255) NOT NULL, \`registeredAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`)
    await queryRunner.query(`CREATE TABLE \`channels\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`userId\` int NOT NULL, \`workspaceId\` int NOT NULL, \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`)
    await queryRunner.query(`CREATE TABLE \`workspace_invitations\` (\`id\` int NOT NULL AUTO_INCREMENT, \`userId\` int NOT NULL, \`inviterId\` int NOT NULL, \`workspaceId\` int NOT NULL, \`status\` varchar(40) NOT NULL DEFAULT 'pending', \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`)
    await queryRunner.query(`CREATE TABLE \`workspaces\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`userId\` int NOT NULL, \`slug\` varchar(255) NOT NULL, \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_b8e9fe62e93d60089dfc4f175f\` (\`slug\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`)
    await queryRunner.query(`ALTER TABLE \`channels\` ADD CONSTRAINT \`FK_b89f82f218818e3d7e0a09b65d2\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`)
    await queryRunner.query(`ALTER TABLE \`channels\` ADD CONSTRAINT \`FK_652fe98ebb18a38f742333f2098\` FOREIGN KEY (\`workspaceId\`) REFERENCES \`workspaces\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`)
    await queryRunner.query(`ALTER TABLE \`workspace_invitations\` ADD CONSTRAINT \`FK_65515eaafd8282c3848bddbb008\` FOREIGN KEY (\`workspaceId\`) REFERENCES \`workspaces\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`)
    await queryRunner.query(`ALTER TABLE \`workspace_invitations\` ADD CONSTRAINT \`FK_06ec10f3b0bc87198df6320cfeb\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`)
    await queryRunner.query(`ALTER TABLE \`workspace_invitations\` ADD CONSTRAINT \`FK_e81dd438808dbb1d25e9cb2a560\` FOREIGN KEY (\`inviterId\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`)
    await queryRunner.query(`ALTER TABLE \`workspaces\` ADD CONSTRAINT \`FK_dc53b3d0b16419a8f5f17458403\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`workspaces\` DROP FOREIGN KEY \`FK_dc53b3d0b16419a8f5f17458403\``)
    await queryRunner.query(`ALTER TABLE \`workspace_invitations\` DROP FOREIGN KEY \`FK_e81dd438808dbb1d25e9cb2a560\``)
    await queryRunner.query(`ALTER TABLE \`workspace_invitations\` DROP FOREIGN KEY \`FK_06ec10f3b0bc87198df6320cfeb\``)
    await queryRunner.query(`ALTER TABLE \`workspace_invitations\` DROP FOREIGN KEY \`FK_65515eaafd8282c3848bddbb008\``)
    await queryRunner.query(`ALTER TABLE \`channels\` DROP FOREIGN KEY \`FK_652fe98ebb18a38f742333f2098\``)
    await queryRunner.query(`ALTER TABLE \`channels\` DROP FOREIGN KEY \`FK_b89f82f218818e3d7e0a09b65d2\``)
    await queryRunner.query(`DROP INDEX \`IDX_b8e9fe62e93d60089dfc4f175f\` ON \`workspaces\``)
    await queryRunner.query(`DROP TABLE \`workspaces\``)
    await queryRunner.query(`DROP TABLE \`workspace_invitations\``)
    await queryRunner.query(`DROP TABLE \`channels\``)
    await queryRunner.query(`DROP TABLE \`users\``)
  }
}
