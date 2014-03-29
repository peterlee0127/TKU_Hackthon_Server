var mongoose = require('mongoose'),
	fs = require('fs'),
	ClassHistory = mongoose.model('ClassHistory'),
	Student = mongoose.model('Student'),
	classTable = {}
	;

exports.new_class = function (data, callback) {
	var new_class = new ClassHistory(data);
	fs.readFile('./student.json', function(err, string){
		if (err){
			console.log(err);
			return;
		}
		//stu_id, name
		var array = JSON.parse(string);

		for (var i = array.length - 1; i >= 0; i--) {

			var newStudent = new Student(array[i]);
			new_class.student_list.push(newStudent);
		}

		new_class.save(function(err, result){
			if (err){
				console.log(err);
				return;
			}

			classTable[result._id] = result;
			callback(result);
		});
	});
};

exports.come = function(data, callback) {
	var currentClass = classTable[data.class_id],
		returnString = 'ok';

	if (currentClass.lock) callback('not ok');
	for (var i = currentClass.student_list.length - 1; i >= 0; i--) {
		if(currentClass.student_list[i].lock === false&&currentClass.student_list[i].stu_id === data.stu_id) {
			currentClass.student_list[i].come = true;
			returnString = 'ok';
		}
	}
	var query = {_id:currentClass._id, 'student_list.stu_id':data.stu_id};
	var update = {$set:{'student_list.$.come':true}};
	ClassHistory.update(query, update, function(){});
	callback(returnString);
};

exports.class_list = function(callback) {
	ClassHistory.aggregate(
	{$project : {
		class_name : 1,
		class_room : 1,
		class_time : 1
	}
		
	}, function(err, result){
		callback(result);
	});
};

exports.find_class = function(id, callback){
	ClassHistory.findOne({_id:id}, function(err, result){
		console.log(result);
		callback(result);
	});
};

exports.start_vote = function(id, callback){
	var currentClass = classTable[id];
	currentClass.isVote = true;

	callback();

};

exports.voting = function(data, callback) {
var currentClass = classTable[data.class_id],
		returnString = 'ok';

	if (currentClass.lock) callback('not ok');
	for (var i = currentClass.student_list.length - 1; i >= 0; i--) {
		if(currentClass.student_list[i].lock === false&&
			currentClass.student_list[i].stu_id === data.stu_id) {

			currentClass.student_list[i].come = true;
			returnString = 'ok';
		}
	}
	var query = {_id:currentClass._id, 'student_list.stu_id':data.stu_id};
	var update = {$set:{'student_list.$.come':true}};
	ClassHistory.update(query, update, function(){});
	callback(returnString);
};