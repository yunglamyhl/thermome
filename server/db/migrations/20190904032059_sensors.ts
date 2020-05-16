import * as Knex from "knex";

export async function up(knex: Knex) {
    const hasTable = await knex.schema.hasTable('sensors');
    if (!hasTable) {
        return await knex.schema.createTable('sensors', (table) => {
            table.increments();
            table.string('name')
            table.integer('fridge_id').references('fridges.id')
            table.boolean('is_active')
            table.timestamps(false, true);
        })
    } else {
        return Promise.resolve();
    }
}


export async function down(knex: Knex) {
    return knex.schema.dropTableIfExists('sensors');
}
