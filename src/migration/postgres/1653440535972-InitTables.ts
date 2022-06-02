import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitTables1653440535972 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "not_used_hashes" ("hash" character varying(8) NOT NULL, CONSTRAINT "PK_5e55af1e3e3ff158f0b180c52f7" PRIMARY KEY ("hash"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "used_hashes" ("hash" character varying(8) NOT NULL, CONSTRAINT "PK_a5aff70e73bb53eabe9b6c47073" PRIMARY KEY ("hash"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "urls" ("hash" character varying(8) NOT NULL, "destination" character varying NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_4788f4d8cdae0b6d454aca046e7" PRIMARY KEY ("hash"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "UX_destination" ON "urls" ("destination") `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "used_hashes"`);
    await queryRunner.query(`DROP TABLE "not_used_hashes"`);
    await queryRunner.query(`DROP INDEX "public"."UX_destination"`);
    await queryRunner.query(`DROP TABLE "urls"`);
  }
}
