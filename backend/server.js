const express = require('express');
const bodyParser = require('body-parser');
const {getTodos, addTodo, removeTodo, editTodo, toggleTodoDone} = require('./db');

const app = express();

app.use(bodyParser.json());

app.get('/api/todos', function (req, res) {
	getTodos(function (err, todos) {
		if (err) {
			res.status(500)
				.json({message: 'internal error while loading todos list'})
				.end();
			return;
		}
		res
			.status(200)
			.json(todos)
			.end();
	})
});

app.post('/api/todos', function (req, res) {
	if (!req.body || !req.body.content) {
		return res.status(400).json({message: 'content is missing'}).end();
	}
	addTodo(req.body, function (err, newTodo) {
		if (err) {
			res.status(500).json({message: 'internal error while trying to save todo'}).end();
			return;
		}
		res.status(200).json(newTodo).end();
	});
});

app.delete('/api/todos/:todoId', function (req, res) {
	const todoId = Number(req.params.todoId);
	removeTodo(todoId, function (err) {
		if (err) {
			res.status(500).json({message: 'internal error while trying to save todo'}).end();
			return;
		}
		res.status(200).json({success: true}).end();
	})
});

app.put('/api/todos/:todoId', function (req, res) {
	const todoId = Number(req.params.todoId);
	editTodo(todoId, function (err) {
		if (err) {
			res.status(500).json({message: 'internal error while trying to save todo'}).end();
			return;
		}
		res.status(200).json({success: true}).end();
	})
});

app.put('/api/todos/:todoId', function (req, res) {
	const todoId = Number(req.params.todoId);
	toggleTodoDone(todoId, {isDone}, function (err) {
		if (err) {
			res.status(500).json({message: 'internal error while trying to save todo'}).end();
			return;
		}
		res.status(200).json({success: true}).end();
	})
});

app.listen(3000, () => {
	console.log('Server is up with express!')
})

