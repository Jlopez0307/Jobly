"use strict";

const db = require("../db");
const { BadRequestError, NotFoundError, ExpressError } = require("../expressError");
const { sqlForPartialUpdate } = require("../helpers/sql");

class Job {

    static async create({title, salary, equity, company_handle}){
        const duplicateCheck = await db.query(`
            SELECT company_handle
            FROM jobs
            WHERE company_handle = $1`,
            [company_handle]
        );

        if ( duplicateCheck.rows[0] ) throw BadRequestError(`${company_handle} already exists`)

        const results = await db.query(`
        INSERT INTO companies
        (title, salary, equity, company_handle)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING handle, name, description, num_employees AS "numEmployees", logo_url AS "logoUrl"`,
        [title, salary, equity, company_handle]
        );

        const job = results.rows[0];
        return job;
    }

    static async findAll(){
        const result = await db.query(`
            SELECT title, salary, equity, company_handle
            FROM jobs`);
        return result.rows
    }

    /**
     * 
     * GET route for retrieving a job based on company handle
     * 
     * Returns {title, salary, equity, company_handle}
     * 
     * Authorization required: Logged in admin
     */

    static async get(company_handle){
        const results = await db.query(`
            SELECT title, salary, equity, company_handle
            FROM jobs
            WHERE company_handle = $1`,
            [company_handle]
        );

        const companyJobs = results.rows[0];

        if(!companyJobs) throw BadRequestError(`No matches for ${company_handle}`);
        return companyJobs;
    }

    static async filter(title, minSalary, hasEquity){
        let jobsRes
        
        if(title && (!minSalary && !hasEquity)){
            jobsRes = await db.query(
                `SELECT title, salary, equity, company_handle
                FROM jobs
                WHERE LOWER(title) LIKE LOWER('%' || $1 || '%')`,
                [title]);

        } else if( title , minSalary && !hasEquity){
          jobsRes = await db.query(
            `SELECT title, salary, equity, company_handle
             FROM jobs
             WHERE LOWER(title) LIKE LOWER('%' || $1 || '%')
             AND minSalary >= $2`,
          [companyName, minSalary]);
        } else if( title, minSalary, hasEquity){
            jobsRes = await db.query(`
            SELECT title, salary, equity, company_handle
            FROM jobs
            WHERE LOWER(title) LIKE LOWER('%' || $1 || '%')
            AND minSalary >= $2
            AND hasEquity > 0
            `, [companyName, minSalary, hasEquity])
        }
    
        const jobs  = jobsRes.rows;
    
        if(!jobs) throw new NotFoundError(`No job matching: ${title}`);
    
        return jobs;
    }

    static async update(handle, data){
        const { setCols, values } = sqlForPartialUpdate(
            data,
            {
              numEmployees: "num_employees",
              logoUrl: "logo_url",
            });
        const handleVarIdx = "$" + (values.length + 1);
    
        const querySql = `UPDATE companies 
                          SET ${setCols} 
                          WHERE handle = ${handleVarIdx} 
                          RETURNING title, salary, equity, company_handle`
        const result = await db.query(querySql, [...values, handle]);
        const companyJobs = result.rows[0];
    
        if (!companyJobs) throw new NotFoundError(`No jobs for: ${companyJobs.company_handle}`);
    
        return company;
    }

    static async remove(id){
        await db.query(`
            DELETE FROM jobs
            WHERE id = $1
            RETURNING title`, [id])
    }
}

module.exports = Job