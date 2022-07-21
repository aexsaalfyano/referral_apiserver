const router = require('express').Router();

/*---------------*/
/* Import - Used */
/*---------------*/
const referralRoutes = require('./referral_code');


/*------------------*/
/* Route - Used */
/*------------------*/

router.use('/referral_code', referralRoutes);


module.exports = router;