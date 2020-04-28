const {readFile, writeFile} = require('fs');

const filePath = './todos.json';

function getTodos(callback) {
	readFile(filePath, (err, data) => {
		if (err) {
			callback(err);
			return;
		}
		callback(null, JSON.parse(data));
	});
}

function saveTodos(todos, callback) {
	writeFile(filePath, JSON.stringify(todos), 'utf8', callback);
}

function noop() {

}

function addTodo(todo, callback = noop) {
	getTodos((err, todos) => {
		if (err) {
			callback(err);
			return;
		}
		const newTodoId = todos[todos.length - 1].id + 1;
		const newTodo = {
			content: todo.content,
			isDone: todo.isDone || false,
			id: newTodoId
		}
		todos.push(newTodo);

		saveTodos(todos, (err) => {
			if (err) {
				callback(err);
				return;
			}
			callback(null, newTodo);
		});
	});
}

function removeTodo(todoId, callback = noop) {
	getTodos((err, todos) => {
		if (err) {
			callback(err);
			return;
		}
		const updatedTodos = todos.filter(todo => todo.id !== todoId);

		saveTodos(updatedTodos, callback);
	});
}

function editTodo(todoId, todo, callback = noop) {
	getTodos((err, todos) => {
		if (err) {
			callback(err);
			return;
		}
		// const todoToEdit = todos.find(todo => todo.id === todoId);
		const todoToEdit = todos.map(todo => {
			if (todo.id === todoId) {
				todo.content = 'bye'
				todo.isDone = !todo.isDone
			}
		})


		if (!todoToEdit) {
			callback(new Error('there is no todo with ID: ' + todoId));
			return;
		}

		Object.assign(todoToEdit, todo);

		saveTodos(todos, (err) => {
			if (err) {
				callback(err);
				return;
			}
			callback(null, todoToEdit);
		});
	});
}


function toggleTodoDone(todoId, isDone, callback) {
	editTodo(todoId, {isDone}, callback);
}

module.exports = {
	getTodos,
	addTodo,
	removeTodo,
	editTodo,
	toggleTodoDone
}


//
// addTodo({content: 'todo to remove', isDone: true})
// removeTodo(9)

//
// console.log('start');
// readFile(filePath, (err, data) => {
// 	if (err) throw err;
//
// 	const content = data.toString();
// 	const obj = JSON.parse(content);
// 	obj.name = 'David';
// 	obj.age = 31;
//
// 	console.log('data is ready to save..')
//
// 	writeFile(filePath, JSON.stringify(obj), 'utf8', (err) => {
// 		if (err) {
// 			throw err;
// 		}
// 		console.log('saved');
// 	});
// 	console.log('save is running ?')
// });
// console.log('The end of the code');
