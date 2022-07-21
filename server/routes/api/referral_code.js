const express = require('express');
const router = express.Router();
// const passport = require('passport');
// Admin
const apiResponse = require('../../helpers/apiResponse');
const paginateLabel = require('../../helpers/paginateLabel');

// Bring in Models & Helpers
const ReferralCode = require('../../models/referral_code');
// const auth = require('../../middleware/auth');
// const role = require('../../middleware/role');
//const store = require('../../helpers/store');

router.post('/add', (req, res) => {
    const referralCode = req.body.referralCode;
    const description = req.body.description;
    const type = req.body.type;
    const createdBy = req.body.createdBy;

    if (!description || !referralCode || !type || !createdBy) {
        return res
            .status(400)
            .json({ error: 'You must enter description, referralCode & type.' });
    }

    const referral_code = new ReferralCode({
        referralCode,
        description,
        type,
        createdBy,
    });

    referral_code.save((err, data) => {
        if (err) {
            return res.status(400).json({
                error: 'Your request could not be processed. Please try again.'
            });
        }

        res.status(200).json({
            success: true,
            message: `ReferralCode has been added successfully!`,
            referral_code: data
        });
    });
});

// fetch store referral_code api
router.get('/list', (req, res) => {
    ReferralCode.find((err, data) => {
        if (err) {
            return res.status(400).json({
                error: 'Your request could not be processed. Please try again.'
            });
        }
        res.status(200).json({
            referral_code: data
        });
    });
});

// fetch referral_code api
router.get('/', async(req, res) => {
    try {
        let condition = {};
        let limit = 10;

        if (req.query.createdBy) {
            condition = {
                '$and': []
            };
        }

        if (req.query.createdBy && req.query.createdBy == 'true') {
            condition['$and'].push({
                "createdBy": null
            }, {
                sort: { $ne: null }
            });
        }

        if (req.query.limit) {
            limit = Number(req.query.limit);
        }

        const referral_code = await ReferralCode.find(condition).limit(limit).sort({ sort: 1 });

        res.status(200).json({
            referral_code: referral_code
        });
    } catch (error) {
        res.status(400).json({
            error: 'Your request could not be processed. Please try again.'
        });
    }
});

// Admin API - fetch referral_code
router.get('/admin/list', async(req, res) => {
    if (req.query.pagination === 'false') {
        await ReferralCode.find()
            .then(result => {
                return apiResponse.successResponseWithDataAndPagination(res, result);
            })
            .catch(error => {
                return apiResponse.ErrorResponse(res, error);
            });
    } else {
        const options = {
            page: req.query.page,
            limit: req.query.limit,
            customLabels: paginateLabel,
            // populate: 'createdBy'
        };

        /* Add Filter Search */
        var condition = req.query.search ? {
            '$or': [{
                referralCode: { $regex: req.query.search, $options: 'i' }
            }, ]
        } : {}

        await ReferralCode.paginate(condition, options)
            .then(result => {
                return apiResponse.successResponseWithDataAndPagination(res, result);
            })
            .catch(error => {
                return apiResponse.ErrorResponse(res, error);
            });
    }
});

// fetch referral_code api
router.get('/:id', async(req, res) => {
    try {
        const referral_codeId = req.params.id;

        const referral_codeDoc = await ReferralCode.findOne({ _id: referral_codeId }).populate({
            path: 'products',
            select: 'referralCode'
        });

        if (!referral_codeDoc) {
            return res.status(404).json({
                message: 'No ReferralCode found.'
            });
        }

        res.status(200).json({
            referral_code: referral_codeDoc
        });
    } catch (error) {
        res.status(400).json({
            error: 'Your request could not be processed. Please try again.'
        });
    }
});

router.put('/:id', async(req, res) => {
    try {
        const referral_codeId = req.params.id;
        const update = req.body.referral_code;
        const query = { _id: referral_codeId };

        await ReferralCode.findOneAndUpdate(query, update, {
            new: true
        });

        res.status(200).json({
            success: true,
            message: 'ReferralCode has been updated successfully!'
        });
    } catch (error) {
        res.status(400).json({
            error: 'Your request could not be processed. Please try again.'
        });
    }
});

router.delete(
    '/delete/:id',
    async(req, res) => {
        try {
            const product = await ReferralCode.deleteOne({ _id: req.params.id });

            res.status(200).json({
                success: true,
                message: `ReferralCode has been deleted successfully!`,
                product
            });
        } catch (error) {
            res.status(400).json({
                error: 'Your request could not be processed. Please try again.'
            });
        }
    }
);

// /* Get All Parent ReferralCode */
// router.get('/list/createdBy', async (req, res) => {
//   await ReferralCode.find({
//     createdBy: { $exists: false }
//   })
//     .then(result => {
//         return apiResponse.successResponseWithDataAndPagination(res, result);
//     })
//     .catch(error => {
//         return apiResponse.ErrorResponse(res, error);
//     });
// });

// /* Get All Child ReferralCode by Parent */
// router.get('/list/child/:createdBy', async (req, res) => {
//   await ReferralCode.find({createdBy: req.params.createdBy})
//     .then(result => {
//         return apiResponse.successResponseWithDataAndPagination(res, result);
//     })
//     .catch(error => {
//         return apiResponse.ErrorResponse(res, error);
//     });
// });

module.exports = router;