import * as Knex from "knex";

export async function up(knex: Knex) {
    const hasTable = await knex.schema.hasTable('locations');
    if (!hasTable) {
        return await knex.schema.createTable('locations', (table) => {
            table.increments();
            table.text('name')
            table.timestamps(false, true);
        })
    } else {
        return Promise.resolve();
    }
}


export async function down(knex: Knex) {
    return knex.schema.dropTableIfExists('locations');
}

