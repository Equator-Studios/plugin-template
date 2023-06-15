return () => {
	const router = Router();
	router.get('/super-special-url/:message', (req, res, next) => {
		const {user, session} = req.auth;

		session._ui.showModal('info', {text: req.params.message});
		res.redirect('/');
		next();
	});

	return {
		router,
	};
};
