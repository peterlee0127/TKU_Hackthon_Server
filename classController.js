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
	if (currentClass == null){
		callback('not ok');
	}
	else if(currentClass.lock === false){
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
	}
	
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
		classTable[id] = result;
		callback(result);
	});
};

exports.start_vote = function(id, callback){
	var currentClass = classTable[id];
	currentClass.isVote = true;
	currentClass.currentQuestion = [];
	var order = currentClass.question_list.length +1;
	callback(order);
	console.log('haha');
};

exports.voting = function(data, callback) {
	var currentClass = classTable[data.class_id],
		returnString = 'ok',
		answer = {stu_id:data.stu_id, answer:data.answer};

	if (currentClass.lock && 
		currentClass.hasOwnProperty('isVote') &&
		currentClass.isVote === true) callback('not ok');
	else{
		currentClass.currentQuestion.push(answer);
		callback(answer);
	}
};

exports.end_vote = function(data, callback) {
	var currentClass = classTable[data.class_id],
		returnString = 'ok';

	if (currentClass.lock ===false&& 
		currentClass.hasOwnProperty('isVote') &&
		currentClass.isVote === true){
		var query = {_id:currentClass._id, 'student_list.stu_id':data.stu_id};
		var update = {$push:{'question_list':currentClass.currentQuestion}};		
		ClassHistory.update(query, update, function(err, result){
			callback(result.question_list);
		});
	} 
	else{
		callback('not ok');
	}		
};