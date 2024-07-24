app.post("/signup", async (req, res) => {
  const { email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new UserData({
      email,
      password: hashedPassword,
      petName,
      petHealthLevel,
      petMood,
      petAge,
    });

    await newUser.save();
    res.status(201).send("User created successfully");
  } catch (err) {
    console.error("Error creating user", err);
    res.status(500).send("Internal server error");
  }
});
