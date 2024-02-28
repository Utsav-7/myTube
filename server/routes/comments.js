import express from "express";
import { adddComments,deleteComment,getComments } from "../controllers/comments.js";
import { verifyToken } from "../verifyToken.js";

const router = express.Router()

router.post("/addComment",verifyToken,adddComments)

router.delete("/:id",verifyToken,deleteComment)

router.get("/:videoId",getComments)


export default router