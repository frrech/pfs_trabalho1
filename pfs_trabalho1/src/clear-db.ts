import { AppDataSource } from "./data-source"

async function clearDatabase() {
  try {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize()
    }

    // Drop all tables
    await AppDataSource.dropDatabase()
    console.log("✓ Database cleared")

    // Recreate tables (synchronize creates them from entities)
    await AppDataSource.synchronize()
    console.log("✓ Tables recreated")

    await AppDataSource.destroy()
    console.log("✓ Done")
  } catch (error) {
    console.error("Error clearing database:", error)
    process.exit(1)
  }
}

clearDatabase()
