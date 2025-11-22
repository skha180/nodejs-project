project-folder/
│── src/
│   ├── app.js
│   ├── start.js
│   ├── models/
│   │     └── db.js
│   ├── routes/
│   │     ├── auth.js
│   │     ├── dbtest.js
│   │     └── createTable.js
│   ├── views/
│   │     ├── layout.ejs
│   │     ├── register.ejs
│   │     ├── login.ejs
│   │     └── dashboard.ejs
│── public/      (CSS/JS/Images)
│── package.json
│── .env
└── README.md




step 2 installation setup

clone your git repository eg using same following code

git clone https://github.com/YOUR-USERNAME/YOUR-REPO.git
cd YOUR-REPO



step 3 install dependencies

npm install



create .env folder in the root and add the following

DB_HOST=your-db-host
DB_USER=your-db-user
DB_PASS=your-db-password
DB_NAME=railway
DB_PORT=3306
SESSION_SECRET=mysecretkey



start the server by running

npm start



db setup on railway visit the following link after db connection 

https://your-app-url.onrender.com/createTable


TEST the db by visiting

https://your-app-url.onrender.com/dbtest



deployment to render setup commands

| Setting               | Value               |
| --------------------- | ------------------- |
| Build Command         | `npm install`       |
| Start Command         | `node src/start.js` |
| Environment Variables | Same as `.env` file |
| Web Type              | Web Service         |


authentication flow

User → Register → bcrypt hash → Save in MySQL  
User → Login → Compare bcrypt hash → Create session  
User → Dashboard (protected route) → Logout  


tech stack


| Technology      | Purpose              |
| --------------- | -------------------- |
| Node.js         | Backend runtime      |
| Express.js      | Web framework        |
| EJS             | Frontend templating  |
| MySQL2          | Database connector   |
| Railway         | Cloud database       |
| Render          | Hosting & deployment |
| Tailwind CSS    | Responsive UI        |
| bcrypt          | Password security    |
| express-session | Login sessions       |














