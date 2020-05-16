import * as Knex from "knex";

export async function up(knex: Knex) {
    const hasTable = await knex.schema.hasTable('sensor_temp');
    if (!hasTable) {
        return await knex.schema.createTable('sensor_temp', (table) => {
            table.increments();
            table.integer('sensor_id').references('sensors.id')
            table.timestamp('time_slot')
            table.decimal('temperature')
            table.timestamps(false, true);
        })
    } else {
        return Promise.resolve();
    }
}


export async function down(knex: Knex) {
    return knex.schema.dropTableIfExists('sensor_temp');
}
