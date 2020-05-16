import * as Knex from "knex";

export async function up(knex: Knex) {
    const hasTable = await knex.schema.hasTable('fridges');
    if (!hasTable) {
        return await knex.schema.createTable('fridges', (table) => {
            table.increments();
            table.text("name"); //serial no
            table.integer('shop_id').references('shops.id')
            table.integer('fridge_type_id').references('fridge_types.id')
            table.boolean('is_active')
            table.timestamps(false, true);
        })
    } else {
        return Promise.resolve();
    }
}


export async function down(knex: Knex) {
    return knex.schema.dropTableIfExists('fridges');
}
