"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const data_source_1 = require("./data-source");
async function clearDatabase() {
    try {
        if (!data_source_1.AppDataSource.isInitialized) {
            await data_source_1.AppDataSource.initialize();
        }
        // Drop all tables
        await data_source_1.AppDataSource.dropDatabase();
        console.log("✓ Database cleared");
        // Recreate tables (synchronize creates them from entities)
        await data_source_1.AppDataSource.synchronize();
        console.log("✓ Tables recreated");
        await data_source_1.AppDataSource.destroy();
        console.log("✓ Done");
    }
    catch (error) {
        console.error("Error clearing database:", error);
        process.exit(1);
    }
}
clearDatabase();
//# sourceMappingURL=clear-db.js.map