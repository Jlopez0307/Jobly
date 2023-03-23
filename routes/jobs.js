/** Routes for companies. */

const jsonschema = require("jsonschema");
const express = require("express");

const { BadRequestError, NotFoundError } = require("../expressError");
const { ensureLoggedIn, ensureAdmin } = require("../middleware/auth");

const Job = require('../models/jobs');

const router = new express.Router();

/**
 * POST route for creating jobs
 * 
 * job should be {title, salary, equity, company_handle}
 * 
 * Returns job: {title, salary equity, company_handle}
 * 
 * Authorization required: Logged in admin
 * 
 */

router.post('/', async ( req, res, next) => {
    try {
        const job = await Job.create(req.body);
        return res.status(201).json({ job });

    } catch (error) {
        return next(error);
    };
});


/**
 * GET route for finding ALL companies
 * Company is { title, salary, equity, comapny_handle}
 * 
 * Optional queries: 
 * -title
 * -minSalary
 * -hasEquity
 * 
 * Authorization required: none
 */

router.get('/', async ( req, res, next ) => {
    try {
        const title = req.query.title;
        const minSalary = req.query.minSalary;
        const hasEquity = req.query.hasEquity;

        if(title,minSalary && hasEquity === true) {
            const jobs = await Job.filter(title, minSalary, hasEquity);
            return res.status(200).json({ jobs });

        } else if(title){
            const jobs = await Job.filter(title);
            return res.status(200).json({ jobs })

        } else {
            const jobs = await Job.findAll();
            return res.json({ jobs });
        };

    } catch (error) {
        return next(error);;
    };
});

/**
 * GET job by id
 * 
 * Returns job: {title, salary, equity, company_handle}
 * 
 * Authorization required: none
 */

router.get('/:handle', async ( req, res, next ) => {
    try {
        const getJob = await Job.get(req.params.handle);
        return res.status(200).json({ getJob });

    } catch (error) {
        return next(error);
    };
});

/**
 * PATCH route for updating a job
 * 
 * fields can be: {title, salary, equity}
 * 
 * Returns {title, salary, equity, company_handle}
 * 
 * Authorization required: logged in admin
 */

router.patch('/:id', async ( req, res, next ) => {
    try {
        const updateJob = await Job.update(req.params.id, req.body);
        return res.status(200).json({ updateJob });     

    } catch (error) {
        return next(error);
    };
});

/**
 * DELETE route for deleting a job post
 * 
 * authorization required: Logged in admin
 * 
 */

router.delete('/:id', async (req, res, next ) => {
    try {
        const deleteJob = await Job.delete(req.params.id);
        return res.status(200).res.json({message: `Succesfully deleted ${deleteJob.title}`})

    } catch (error) {
        return next(error);
    };
});

router.get

module.exports = router;