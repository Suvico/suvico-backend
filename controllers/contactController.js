const Contact = require('../model/contact');

// Controller function to render the contact form page
exports.getContactForm = (req, res) => {
  res.sendFile('contactForm.html', { root: './public' });
};

// Controller function to handle the form submission (POST request)
exports.submitContactForm = async (req, res) => {
  try {
    const formData = req.body;
    const newContact = new Contact(formData);
    await newContact.save();
    res.status(201).json({ message: 'Form submitted successfully!' });
  } catch (error) {
    res.status(500).json({ error: 'Error submitting the form.' });
  }
};

// Controller function to get all contact form submissions (GET request)
exports.getAllContactSubmissions = async (req, res) => {
  try {
    const contacts = await Contact.find();
    res.status(200).json(contacts);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching contact submissions.' });
  }
};
