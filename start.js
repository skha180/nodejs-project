const app = require("./src/app");
const { ensureAdminExists } = require("./dataHandler");

const PORT = process.env.PORT || 4207;

// Create admin user if not exists
ensureAdminExists()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error("❌ Failed to initialize app:", err.message);
  });
