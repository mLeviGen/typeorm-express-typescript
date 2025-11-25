import {MigrationInterface, QueryRunner} from "typeorm";

export class CreateCatalog1762876335533 implements MigrationInterface {
    name = 'CreateCatalog1762876335533'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "cheese_products" ("id" SERIAL NOT NULL, "name" character varying(150) NOT NULL, "cheese_type" character varying(80), "base_price" numeric(10,2) NOT NULL DEFAULT '0', "is_active" boolean NOT NULL DEFAULT true, CONSTRAINT "PK_f466e5dfdb91fed03723b2dd301" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_fb295f80c7aff11bad237d7a7e" ON "cheese_products" ("name") `);
        await queryRunner.query(`CREATE TABLE "order_items" ("id" SERIAL NOT NULL, "order_id" integer NOT NULL, "product_id" integer NOT NULL, "quantity" integer NOT NULL DEFAULT '1', "unit_price" numeric(10,2) NOT NULL, CONSTRAINT "PK_005269d8574e6fac0493715c308" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "customer_orders" ("id" SERIAL NOT NULL, "order_date" TIMESTAMP NOT NULL DEFAULT now(), "status" character varying(20) NOT NULL DEFAULT 'NEW', "customer_id" integer NOT NULL, CONSTRAINT "PK_ce425b6edb31cce9a80b269298e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "customers" ("id" SERIAL NOT NULL, "name" character varying(120) NOT NULL, "phone" character varying(30), "address_id" integer, CONSTRAINT "PK_133ec679a801fab5e070f73d3ea" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "addresses" ("id" SERIAL NOT NULL, "address" character varying(255) NOT NULL, "city" character varying(100), "country" character varying(100), CONSTRAINT "PK_745d8f43d3af10ab8247465e450" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "order_items" ADD CONSTRAINT "FK_145532db85752b29c57d2b7b1f1" FOREIGN KEY ("order_id") REFERENCES "customer_orders"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "order_items" ADD CONSTRAINT "FK_9263386c35b6b242540f9493b00" FOREIGN KEY ("product_id") REFERENCES "cheese_products"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "customer_orders" ADD CONSTRAINT "FK_d7fd44c68cff957a9168272c745" FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "customers" ADD CONSTRAINT "FK_2441e5a7e71f5dc216fa2f96feb" FOREIGN KEY ("address_id") REFERENCES "addresses"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "customers" DROP CONSTRAINT "FK_2441e5a7e71f5dc216fa2f96feb"`);
        await queryRunner.query(`ALTER TABLE "customer_orders" DROP CONSTRAINT "FK_d7fd44c68cff957a9168272c745"`);
        await queryRunner.query(`ALTER TABLE "order_items" DROP CONSTRAINT "FK_9263386c35b6b242540f9493b00"`);
        await queryRunner.query(`ALTER TABLE "order_items" DROP CONSTRAINT "FK_145532db85752b29c57d2b7b1f1"`);
        await queryRunner.query(`DROP TABLE "addresses"`);
        await queryRunner.query(`DROP TABLE "customers"`);
        await queryRunner.query(`DROP TABLE "customer_orders"`);
        await queryRunner.query(`DROP TABLE "order_items"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_fb295f80c7aff11bad237d7a7e"`);
        await queryRunner.query(`DROP TABLE "cheese_products"`);
    }

}
