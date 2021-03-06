const db = require('../database/connectMySQL')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');



exports.signup = (req, res, next) => {
    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            let post = {
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                email: req.body.email,
                password: hash,
                image_url: req.body.image_url,
            };
            let sql = 'INSERT INTO employes SET ?'
            db.query(sql, post, (err, result) => {
                if (err) {
                    res.status(401).json({ error: 'L\'utilisateur existe déja !' });
                    return;
                }
                if(result) {
                    db.query(`SELECT * FROM employes WHERE email=?;`, post.email, (err, results) => {
                        if (err) {
                           return res.status(401).json({ error: 'Une erreur c\'est produit à la création du compte !' });
                        }
                    res.status(201).json({ token: jwt.sign({ employesId: results[0].id, firstName: results[0].firstname, lastName: results[0].lastname, admin: results[0].admin },
                            process.env.TOKEN_KEY, { expiresIn: '24h' })
                        });
                    })
                }
            })
        })
};

exports.login = (req, res) => {
    let employeEmail = req.body.email
    let sql = `SELECT * FROM employes WHERE email=?;`;
    db.query(sql, employeEmail, (err, results) => {
        if (err) {
            res.status(400).json({ error: 'Une erreur c\'est produit !' });
            return;
        }
        if (results == '') {
            res.status(401).json({ error: 'Utilisateur non trouvé !' });
            return;
        }
        if (req.body.password == undefined) {
            res.status(401).json({ error: 'Veiller mettre un mot de passe !' });
            return;
        }
        bcrypt.compare(req.body.password, results[0].password)
            .then(valid => {
                if (!valid) {
                    res.status(401).json({ error: 'Mot de passe incorrect !' });
                }
                res.status(200).json({
                    token: jwt.sign({ employesId: results[0].id, firstName: results[0].firstname, lastName: results[0].lastname, admin: results[0].admin },
                        process.env.TOKEN_KEY, { expiresIn: '24h' })
                });
            })
    })
}

exports.updateEmploye = (req, res) => {
    
    const update = req.file ? {
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        image_url: `${req.protocol}://${req.get('host')}/images/profile/${req.file.filename}`,
    } : { ...req.body};

    const id = req.params.id;
    const sql = `UPDATE employes SET ? WHERE id = ${id}`;

    db.query(sql, update, (err, results) => {
        if (err) {
            res.status(401).json({ error: 'Profile non mise a jour! ', err });
            return;
        }
        res.status(201).json({ message: 'Modification réussi! ', results });
    })
}

exports.deleteEmploye = (req, res) => {
    let sql = `DELETE FROM employes WHERE id = ${req.params.id}`;
    db.query(sql, err => {
        if (err) {
            console.log('Employer non supprimer', err)
        }
        res.send('Employer supprimer avec succés');
    })
}

exports.profile = (req, res, next) => {
    let sql = `SELECT employes.firstname, employes.lastname, employes.image_url, employes.admin
        FROM employes
        WHERE employes.id= ${req.params.id}`;

    db.query(sql, (err, results) => {
        if (err) {
            res.status(400).json({ error: 'Une erreur c\'est produit !' });
        }
        if (results == '') {
            res.status(401).json({ error: 'Utilisateur non trouvé !' });
        }
        res.send(results)
    })
}