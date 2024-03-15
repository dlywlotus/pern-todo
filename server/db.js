import Pg from "pg";

const { Pool } = Pg;
const pool = new Pool({
  user: "postgres",
  password: "T0322195j!",
  host: "localhost",
  port: "5432",
  database: "perntodo",
});

export default pool;
