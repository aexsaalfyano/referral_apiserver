/* Import Requirements */
const Mongoose = require('mongoose');
// const slug = require('mongoose-slug-generator');
const mongoosePaginate = require('mongoose-paginate-v2'); // Import Library Mongoose Paginate
const { Schema } = Mongoose;

/* Referral Schema */
const ReferralCodeSchema = new Schema({
    _id: { type: Schema.ObjectId, auto: true }, // ID referral_code
    referralCode: { type: String, trim: true },
    description: { type: String, trim: true }, // Deskripsi referral_code
    type: { type: String, trim: true }, // Deskripsi referral_code
    createdBy: { type: String, trim: true }, // Created By referral_code
    createdOn: { type: Date, default: Date.now }, // Tanggal
});

/* Add Plugin Mongoose Paginate */
Mongoose.plugin(mongoosePaginate);

/* Add Plugin Slug */
// const options = {
//   separator: '-',
//   lang: 'en',
//   truncate: 120
// };
// Mongoose.plugin(slug, options);

/* Export File Method */
module.exports = Mongoose.model('ReferralCode', ReferralCodeSchema);