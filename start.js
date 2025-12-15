const app = require('./src/app');

const PORT = process.env.PORT || 4207;

app.listen(PORT, () => {
    console.log(`Server running on internal port ${PORT}`);
});
