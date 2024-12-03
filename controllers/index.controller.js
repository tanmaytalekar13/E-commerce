export const index = async (req, res, next) => {
    res.status(200).json({ message: "Welcome to the API" });
}