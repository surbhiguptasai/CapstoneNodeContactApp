const mongoose = require('mongoose');

// this is our schema to represent a user
const  userSchema = mongoose.Schema({
  username: {type: String},
  name: {
    firstName: String,
    lastName: String
  },
  accountCode:String,
  totalAmount:String,
  branchName:String,
  email: {type: String},
  address: {
    street: String,
    aptNo: String,
    city:String,
    state:{type: String, maxLength: 2},
    country: {type: String, default: 'USA'},
    zipcode: String   
  },
   phone: {type: String, maxLength:12},
   ssn:{type: String, maxLength:11},
   actopendate:{type: String},
   gender:{type: String},
   acttype:{type: String}
});

// *virtuals* (http://mongoosejs.com/docs/guide.html#virtuals)
// allow us to define properties on our object that manipulate
// properties that are stored in the database. Here we use it
// to generate a human readable string based on the address object
// we're storing in Mongo.
// this virtual grabs the most recent grade for a user.
userSchema.virtual('addressString').get(function() {
  return `${this.address.street} ${this.address.city}`.trim()});
userSchema.virtual('userNameString').get(function() {
  return `${this.name.firstName} ${this.name.lastName}`.trim()});

// this is an *instance method* which will be available on all instances
// of the model. This method will be used to return an object that only
// exposes *some* of the fields we want from the underlying data
userSchema.methods.apiRepr = function() {

  return {
    id: this._id,
    name: this.userNameString,
    accountCode:this.accountCode,
    totalAmount:this.totalAmount,
    branchName:this.branchName,
    email: this.email,
    address: this.addressString,
    city:this.address.city,
    phone:this.phone,
    ssn:this.ssn,
    actopendate:this.actopendate,
    gender:this.gender,
    acttype:this.acttype
  };
}

// note that all instance methods and virtual properties on our
// schema must be defined *before* we make the call to `.model`.
const UserDetail = mongoose.model('UserDetail', userSchema,'userDetails');

module.exports = {UserDetail};
