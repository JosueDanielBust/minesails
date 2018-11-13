let mailgun = require('mailgun-js')({
    apiKey: sails.config.email.api_key,
    domain: sails.config.email.domain
});

module.exports = {
    emailReport : function(obj){
        let imgs = JSON.parse(obj.images), images = "";
        imgs.forEach(e => {
            let i = e.file.split('/');
            images += `${ i[i.length - 1] }, `;
        });

        let data = {
            from: `DDR Server <${ sails.config.email.from }>`,
            to: 'info@ddrserver.com',
            subject: `Report - ${ obj.username }`,
            html: `<p>Status: ${ obj.status }</p><p>Username: ${ obj.username }</p><p>Reason: ${ obj.reason }</p><p>Files: ${ images.substring(0, images.length-2) }</p>`
        };

        mailgun.messages().send(data, function (error, body) {
            if (error) { sails.log.warn(error); } else { sails.log.info(`Email sent - ${body.id}`); }
        });
    },
};