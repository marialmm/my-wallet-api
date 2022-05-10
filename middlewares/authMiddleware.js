import db from "./../db.js";

export async function validateToken(req, res, next) {
    const { authorization } = req.headers;
    const token = authorization?.replace("Bearer ", "");

    try {
        const session = await db.collection("sessions").findOne({ token });

        if (!session) {
            res.sendStatus(401);
            return;
        }

        const user = await db
            .collection("users")
            .findOne({ _id: session.userId });

        if (!user) {
            res.sendStatus(404);
            return;
        }

        res.locals.user = user;
        res.locals.token = token;

        next();
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
}
