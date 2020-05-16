
import * as Knex from 'knex';

export async function up(knex: Knex) {
    const hasTable = await knex.schema.hasTable('shop_fridge_type_settings');
    if (!hasTable) {
        return await knex.schema.createTable('shop_fridge_type_settings', (table) => {
            table.increments();
            table.integer('shop_id').references('shops.id'); 
            table.integer('fridge_type_id').references('fridge_types.id'); 
            table.decimal('min_temp'); 
            table.decimal('max_temp'); 
            table.timestamps(false, true);
        })
    } else {
        return Promise.resolve();
    }
}

export async function down(knex: Knex) {
    return knex.schema.dropTableIfExists('shop_fridge_type_settings');
}
