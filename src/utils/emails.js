const sgMail = require('@sendgrid/mail');

const { MASTER_EMAIL_ID: masterEmail, SENDGRID_API_KEY: apiKey } = process.env;

sgMail.setApiKey(apiKey);

const sendWelcomeEmail = ({ email, name }) => {
  sgMail.send({
    to: email,
    from: masterEmail,
    subject: 'Thanks for joining in',
    text: `Welcome to the app, ${name}. Let me know how you get along with the app`,
  });
};

const sendAlertEmail = ({ email, name, hospital, id }) => {
  sgMail.send({
    to: email,
    from: masterEmail,
    subject: `${name} needs your help`,
    html: `
      <p>
        ${name} needs your help right now. Her nearest hospital is ${hospital}.
      </p>
      <br />
      <br />
      <a href="http://localhost:3000/help/${id}/do">Click here</a> to help them`,
  });
};

module.exports = {
  sendWelcomeEmail,
  sendAlertEmail,
};
