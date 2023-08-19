import express from "express";
import jwtMiddleware from '../../middlewares/jwt';
import ctrlContacts from "../controllers/contacts";

const router = express.Router();

router.use(jwtMiddleware);

router.get("/", ctrlContacts.get);

router.get("/:id", ctrlContacts.getById);

router.post("/", ctrlContacts.create);

router.delete("/:id", ctrlContacts.remove);

router.put("/:id", ctrlContacts.update);

router.patch("/:id/favorite", ctrlContacts.updateStatusContact);

export default router;