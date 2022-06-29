var mongoose = require('mongoose');
var { DateTime } = require('luxon');

var Schema = mongoose.Schema;

var authorSchema = new Schema({
    first_name: {type: String, required: true, maxLength: 100},
    family_name: {type: String, required: true, maxLength: 100},
    date_of_birth: {type: Date},
    date_of_death: {type: Date},
});

// Virtual for author's full name
authorSchema.virtual('name').get(function () {
    var fullname = '';
    if (this.first_name && this.family_name)
        fullname = this.family_name + ', ' + this.first_name
    if (!this.first_name || !this.family_name)
        fullname = '';
    return fullname;
});

// Virtual for author's lifespan
authorSchema.virtual('lifespan').get(function() {
    var lifetime_string = '';
    if (this.date_of_birth)
        lifetime_string = DateTime.fromJSDate(this.date_of_birth).toLocaleString(DateTime.DATE_MED);
    lifetime_string += ' - ';
    if (this.date_of_death)
        lifetime_string += DateTime.fromJSDate(this.date_of_death).toLocaleString(DateTime.DATE_MED)
    return lifetime_string;
});

authorSchema.virtual('date_of_birth_yyyy_mm_dd').get(function (){
    return DateTime.fromJSDate(this.date_of_birth).toISODate();
});

authorSchema.virtual('date_of_death_yyyy_mm_dd').get(function() {
    return DateTime.fromJSDate(this.date_of_death).toISODate();
});

// Virtual for author's URL : returns the absolute URL required to get a particular instance of the model
authorSchema.virtual('url').get(function(){
    return '/catalog/author/' + this._id; 
});

//Export model
module.exports = mongoose.model('Author', authorSchema);
