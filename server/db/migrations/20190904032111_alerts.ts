import * as Knex from "knex";

export async function up(knex: Knex) {
    const hasTable = await knex.schema.hasTable('alerts');
    if (!hasTable) {
        return await knex.schema.createTable('alerts', (table) => {
            table.increments();
            table.integer('sensor_temp_id').references('sensor_temp.id')
            table.integer('alert_type_id').references('alert_types.id')
            table.timestamps(false, true);
        })
    } else {
        return Promise.resolve();
    }
}


export async function down(knex: Knex) {
    return knex.schema.dropTableIfExists('alerts');
}
