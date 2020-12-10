const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config();

module.exports = async (result) => {
    const transporter = nodemailer.createTransport({
	    host: 'relay.ablegroup.de',
		port: 587,
		secure: false,
		auth: {
			method: 'PLAIN',
			user: process.env.MAIL_USER,
			pass: process.env.MAIL_PASSWORD,
		}
    });
    
    await transporter.sendMail({
		from: 'ECM_Monitoring@able-group.de',
		to: process.env.MAILTO,
		subject: 'ECM Property Mapping Report',
        text: getMailText(),
        html: getMailHTML(result),
        attachments: getAttachments(result),
	});
};

function getMailText() {
    return 'Property Mapping abgeschlossen. Ergebnisse sind angehangen. Für mehr Informationen siehe HTML-Version dieser Nachricht.';
}

function getMailHTML(result) {
    const stringBuilder = [];
    stringBuilder.push('<h3>ECM Property Mapping</h3>');
    stringBuilder.push('<p>Property Mapping abgeschlossen. Genaue Ergebnisse sind angehangen.</p>');
    stringBuilder.push('<h4>Kategorie-Tabellen</h4>');
    Object.keys(result.categories).forEach((key) => {
        stringBuilder.push(`<h5>d.3_Categories_${key.toUpperCase()}</h5>`);
        stringBuilder.push('<ul>');
        stringBuilder.push(`<li>Erstellte Datensätze: ${result.categories[key].created.length}</li>`);
        stringBuilder.push(`<li>Veränderte Datensätze: ${result.categories[key].changed.length}</li>`);
        stringBuilder.push(`<li>Unveränderte Datensätze: ${result.categories[key].unchanged.length}</li>`);
        stringBuilder.push('</ul>');
    });
    stringBuilder.push('<h4>Eigenschaften-Tabellen</h4>');
    Object.keys(result.properties).forEach((key) => {
        stringBuilder.push(`<h5>d.3_Categories_${key.toUpperCase()}</h5>`);
        stringBuilder.push('<ul>');
        stringBuilder.push(`<li>Erstellte Datensätze: ${result.properties[key].created.length}</li>`);
        stringBuilder.push(`<li>Veränderte Datensätze: ${result.properties[key].changed.length}</li>`);
        stringBuilder.push(`<li>Unveränderte Datensätze: ${result.properties[key].unchanged.length}</li>`);
        stringBuilder.push('</ul>');
    });
    return stringBuilder.join('');
}

function getAttachments(result) {
    return [
        {
            filename: 'results.json',
            content: JSON.stringify(result, null, 2)
        }
    ];
}