app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await UserData.findOne({ email });

    if (!user) {
      return res.status(400).send("Invalid email or password");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).send("Invalid email or password");
    }

    const token = await admin.auth().createCustomToken(user._id.toString());
    res.json({ token });
  } catch (error) {
    console.error("Error logging in", error);
    res.status(500).send("Internal server error");
  }
});
