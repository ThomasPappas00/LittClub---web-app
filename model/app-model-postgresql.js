'use strict';
///
const Pool = require('pg').Pool
const pool = new Pool({
    user: 'uunxhdfasrxeha',
    host: 'ec2-35-171-250-21.compute-1.amazonaws.com',
    database: 'd4hfamr544npi1',
    password: 'c203f48531a569a29ca9b89cf1b95bac6608e9cb7a6a768b41393053fa9dae48',
    port: 5432,
    connectionString: process.env.DATABASE_URL,
    ssl:{
        rejectUnauthorized: false
    }
  })

function selAllFromBook(){
  pool.query('SELECT * FROM book', (error, results) => {
    if (error) {
      throw error
    }
    console.log(results.rows)
  })
} 

module.exports = {
  selAllFromBook
}