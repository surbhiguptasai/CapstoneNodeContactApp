const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const moment = require('moment');
mongoose.Promise = global.Promise;

// this is our schema to represent a user
const  userSchema = mongoose.Schema({
  
  username: {type: String},
  name: {
    firstName: String,
    lastName: String
  },
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
   
   gender:{type: String},
   age:{type: String},
   company:{type: String},
   about:{type: String}
 
});

// *virtuals* (http://mongoosejs.com/docs/guide.html#virtuals)
// allow us to define properties on our object that manipulate
// properties that are stored in the database. Here we use it
// to generate a human readable string based on the address object
// we're storing in Mongo.
// this virtual grabs the most recent grade for a user.
userSchema.virtual('addressString').get(function() {
  return `${this.address.street} ${this.address.city} ${this.address.state} ${this.address.zipcode} ${this.address.country}`.trim()});
userSchema.virtual('userNameString').get(function() {
  return `${this.name.firstName} ${this.name.lastName}`.trim()});

// this is an *instance method* which will be available on all instances
// of the model. This method will be used to return an object that only
// exposes *some* of the fields we want from the underlying data
userSchema.methods.apiRepr = function() {

  return {
    id: this._id,
    name: this.userNameString,
    email: this.email,
    phone:this.phone,
    gender:this.gender,
    age: this.age,
    street:this.address.street,
    aptNo:this.address.aptNo,
    city:this.address.city,
    state:this.address.state,
    zipcode:this.address.zipcode,
    country: this.address.country,
    address: this.addressString,
    company:this.company,
    about:this.about
  };
}

// note that all instance methods and virtual properties on our
// schema must be defined *before* we make the call to `.model`.
const UserDetail = mongoose.model('UserDetail', userSchema,'userDetails');

const  userContacts = mongoose.Schema({
   userId: {type: String,
    required: true,
    unique: true},
    password: {
    type: String,
    required: true
  },
   contacts:[userSchema]

});

userContacts.methods.apiRepr = function() {
  return {
    username: this.userId || '',
    contacts: this.contacts
  };
}

userContacts.methods.validatePassword = function(password) {
  console.log("Inside password validation")
  console.log(" password is "+password);
  console.log(" this.password is "+this.password);
  console.log(" compare is "+bcrypt.compare(password, this.password));
  return bcrypt.compare(password, this.password);
}

userContacts.statics.hashPassword = function(password) {
  return bcrypt.hash(password, 10);
}

const UserContact = mongoose.model('UserContact', userContacts,'userContacts');

module.exports = {UserDetail,UserContact};
