import * as Knex from "knex";

export async function up(knex: Knex) {
    const hasTable = await knex.schema.hasTable('fridge_types');
    if (!hasTable) {
        return await knex.schema.createTable('fridge_types', (table) => {
            table.increments();
            table.text("name"); 
            table.boolean('is_active')
            table.timestamps(false, true);
        })
    } else {
        return Promise.resolve();
    }
}

export async function down(knex: Knex) {
    return knex.schema.dropTableIfExists('fridge_types');
}
