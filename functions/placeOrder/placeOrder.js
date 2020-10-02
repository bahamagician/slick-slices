const nodemailer = require('nodemailer');

// create a transport for nodemailer
const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: 587,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

// test

exports.handler = async (event, context) => {
  const info = await transporter.sendMail({
    from: 'Slick Slices <slick@example.com>',
    to: 'orders@example.com',
    subject: 'New Order',
    html: `<p>Your new pizza order is here!</p>`,
  });
  console.log(info);
  return {
    statusCode: 200,
    body: JSON.stringify(info),
  };
};
