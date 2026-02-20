### Environment variables

Create a file named `.env` inside the `server/` folder (same level as `index.js`) with:

```bash
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>/<db>?retryWrites=true&w=majority
# Optional: dedicated DB for admin accounts (if omitted, defaults to <MONGO_URI db name replaced with cleanstreet_admins>)
ADMIN_MONGO_URI=mongodb+srv://<username>:<password>@<cluster>/cleanstreet_admins?retryWrites=true&w=majority
# Optional db name used only when ADMIN_MONGO_URI is not set
ADMIN_DB_NAME=cleanstreet_admins
```

