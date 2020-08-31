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

const sendAlertEmail = ({ email, name, hospital, id, condition, symptoms }) => {
  sgMail.send({
    to: email,
    from: masterEmail,
    subject: `${name} needs your help`,
    html: `
      <p>
        ${name} needs your help right now. Her nearest hospital is ${hospital}. ${name} is in ${condition} condition.
        <br />
        Their symptoms are: ${symptoms}
      </p>
      <br />
      <a href="${process.env.MAIN_URL}/help/${id}/do">Click here</a> to help them`,
  });
};

module.exports = {
  sendWelcomeEmail,
  sendAlertEmail,
};
