const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
//referencia a la base de datos
const pool = require('../database');
const { isLoggedIn } = require('../lib/auth');


router.get('/add', isLoggedIn, (req, res) => {
    //renderizar
    res.render('salas/add');
});

router.post('/add', isLoggedIn, async (req, res) => {
    const { title, xml, description } = req.body;
    const newSalas = {
        title,
        xml,
        description,
        user_id: req.user.id
    };
    const token = jwt.sign({ newSalas }, 'token_sala');
    console.log(token);
    newSalas.tokenS = token;
    const sala = await pool.query('INSERT INTO salas set ?', [newSalas]);
    console.log(sala);
    newSalas.id = sala.insertId;
    console.log(newSalas.id);
    const newUS = {
        user_id: req.user.id,
        salas_id: newSalas.id
    };
    await pool.query('INSERT INTO usersalas set ?', [newUS]);
    //mensajes nombre del mensaje
    req.flash('success', 'Salas guardada Successfully');
    res.redirect('/salas');
    // res.send('recibido');
});

router.get('/', isLoggedIn, async (req, res) => {
    const salas = await pool.query('SELECT * FROM salas where user_id = ?', [req.user.id]);
    res.render('salas/list', { salas });
});

router.get('/salasCompartidas', isLoggedIn, async (req, res) => {
    const idUs = req.user.id;
    console.log(idUs + 'id usuario');
    const salas = await pool.query('SELECT * from salas where id in ( SELECT usersalas.salas_id from usersalas where user_id = ?)', [req.user.id]);
    console.log(salas);
    res.render('salas/listCompartidas', { salas });
});

router.get('/delete/:id', async (req, res) => {
    console.log(req.params.id);
    const { id } = req.params;
    //agregar seguridad al eliminar
    await pool.query('DELETE FROM usersalas WHERE salas_id = ?', [id]);
    await pool.query('DELETE FROM salas WHERE ID = ?', [id]);
    req.flash('success', 'Sala eliminada de la base de datos');
    res.redirect('/salas');
});

router.get('/edit/:id', isLoggedIn, async (req, res) => {
    const { id } = req.params;
    const salas = await pool.query('SELECT * FROM salas WHERE id = ?', [id]);
    console.log(salas);
    res.render('salas/edit', { sala: salas[0] });
});

router.post('/edit/:id', isLoggedIn, async (req, res) => {
    const { id } = req.params;
    const { title, description, xml } = req.body;
    const newSala = {
        title,
        description,
        xml
    };
    await pool.query('UPDATE salas set ? WHERE id = ?', [newSala, id]);
    req.flash('success', 'Sala actualizada Successfully');
    res.redirect('/salas');
});

router.get('/inSala/:tokenS', isLoggedIn, async (req, res) => {
    const tokenU = req.user.tokenU;
    console.log(tokenU + 'token de usuario');
    const { tokenS } = req.params;
    console.log(req.params + ' requ parametros');
    const inSala = '?room=' + tokenS;
    const inUs = '&username=' + tokenU;
    /* const xml = 'http://localhost:8080/model-UML' + inSala + inUs; */
    const xml = 'https://diagrama-frontend.onrender.com/model-UML' + inSala + inUs;
    console.log(xml);
    res.redirect(xml);
});

router.get('/listUsuarios/:idSala', isLoggedIn, async (req, res, idS) => {
    const { idSala } = req.params;

    const users = await pool.query('SELECT * FROM users');
    console.log(users);
    console.log(idSala + 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa');
    idS = idSala;
    res.render('salas/listUsuarios', { users, idSala });
});


router.post('/compartir/:idSala', isLoggedIn, async (req, res,) => {
    console.log('hola');
    console.log(req.body);
    const { idUsuario } = req.body;
    const { idSala } = req.params;

    console.log(idUsuario + 'id del usuario');
    console.log(idSala + ' id de las sala');
    const newUS = {
        user_id: idUsuario,
        salas_id: idSala
    };
    console.log('newUS');
    await pool.query('INSERT INTO usersalas set ?', [newUS]);
    req.flash('success', 'Compartido Successfully');
    res.redirect('/salas');
});

router.get('/generarCodigo/:idSala', isLoggedIn, async (req, res) => {
    const { idSala } = req.params;
    const salas = await pool.query('SELECT * FROM salas WHERE id = ?', [idSala]);
    console.log(salas);
    res.render('salas/generarCodigo', { sala: salas[0] });
});

module.exports = router;