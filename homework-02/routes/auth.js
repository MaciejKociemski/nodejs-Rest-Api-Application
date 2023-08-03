const require = require("express");
const router = express.Router;
const Joi = require('joi')

const responseSchema = Joi.object({
    email: Joi.string().required(),
    password: Joi.string().required()
})
 

router.post("/login", function (req, res, next) {
    const validateBody = responseSchema.validate(req.body);
    if (validateBody.error) {
        res.render('error', {
            message: validateBody.error.message,
            error: { ...validateBody.error, status: 400 },
        });
    } else {
        res.render('login', {
            email: validateBody.value.email,
            password: validateBody.value.password,
        })
    }
})

// router.post("/login", function (req, res, next) {
//   const { email, password } = req.body;
//   res.render("index", { title: "Express", email, password });
// });
module.exports = router;
