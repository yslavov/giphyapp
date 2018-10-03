var mongoose = require('mongoose');
var schema = mongoose.Schema;
var accountsSchema = new schema({

	name : String,
	username : {type: String, require: '{PATH} is required', unique: true},
	password : {type: String, require: '{PATH} is required'},
	categories : [],
	favorites : []
}, 
{ 
	timestamps: { createdAt: 'created_at' }, 
	versionKey: false 
});

mongoose.model('accounts', accountsSchema);