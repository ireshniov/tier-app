import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateVisitsTable1653605641256 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "visits" ("id" SERIAL NOT NULL, "hash" character varying NOT NULL, "destination" character varying NOT NULL, "date" TIMESTAMP WITH TIME ZONE NOT NULL, CONSTRAINT "PK_0b0b322289a41015c6ea4e8bf30" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_destination" ON "visits" ("destination") `,
    );
    await queryRunner.query(`CREATE INDEX "IDX_hash" ON "visits" ("hash") `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "IDX_hash"`);
    await queryRunner.query(`DROP INDEX "IDX_destination"`);
    await queryRunner.query(`DROP TABLE "visits"`);
  }
}
