exports.up = function (knex) {
    return knex.schema
        .createTable("grants", tbl => {
            tbl.increments(); //Keep
            tbl.string("competition_name", 500); //Keep
            // tbl.string("type", 255);
            tbl.string("area_focus", 255); //Keep
            tbl.string("sponsoring_entity", 255); //Keep
            tbl.string("website", 500); //Keep
            tbl.date("most_recent_application_due_date"); //Keep
            tbl.integer("amount"); //Keep
            tbl.string("amount_notes", 1000); //Keep
            tbl.string("geographic_region", 255); //Keep
            tbl.string("country");
            // tbl.string("domain_areas", 1000);
            tbl.string("target_entrepreneur_demographic", 255); //Keep
            tbl.string("notes", 5000); //Keep
            tbl.boolean("early_stage_funding"); //Keep
            tbl.boolean("is_reviewed"); //Keep
            tbl.boolean("has_requests"); //Keep
            tbl.date("details_last_updated"); //Keep
            tbl.string("domain_areas", 500);
            tbl.string("type");
        })
        .createTable("requests", tbl => {
            tbl.increments();
            tbl.string("subject", 255);
            tbl.string("suggestion", 1000);
            tbl
                .integer("grant_id")
                .unsigned()
                .notNullable()
                .references("id")
                .inTable("grants")
                .onDelete("CASCADE")
                .onUpdate("CASCADE");
        })
        .createTable("users", tbl => {
            // token row
            tbl.increments();
            tbl.string('email').notNullable().unique();
        })
        .createTable("favorites", tbl => {
            // many to many (grants - users)
            tbl.increments();

            tbl.integer("grant_id")
                .unsigned()
                .notNullable()
                .references("id")
                .inTable("grants")
                .onDelete("CASCADE")
                .onUpdate("CASCADE");

            tbl.string("auth_id", 200)
                .notNullable();
            // tbl.unique(["grant_id", "auth_id"]);
        });
};

exports.down = function (knex) {
    return knex.schema
        .dropTableIfExists("favorites")
        .dropTableIfExists("requests")
        .dropTableIfExists("grants")
        .dropTableIfExists("users");
};
