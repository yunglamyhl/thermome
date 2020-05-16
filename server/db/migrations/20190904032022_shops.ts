import * as Knex from "knex";

export async function up(knex: Knex) {
    const hasTable = await knex.schema.hasTable('shops');
    if (!hasTable) {
        return await knex.schema.createTable('shops', (table) => {
            table.increments();
            table.text('name')
            table.integer('location_id').references('locations.id')
            table.boolean('is_active')
            table.timestamps(false, true);
        })
    } else {
        return Promise.resolve();
    }
}


export async function down(knex: Knex) {
    return knex.schema.dropTableIfExists('shops');
}

