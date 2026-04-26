const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

  const { name, email, message } = req.body || {};

  if (!name || !email || !message) {
    return res.status(400).json({ error: '必須項目を入力してください。' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'メールアドレスの形式が正しくありません。' });
  }

  try {
    await resend.emails.send({
      from: 'Spinel Lab <onboarding@resend.dev>',
      to: 'alnair.llc.info@gmail.com',
      reply_to: email,
      subject: `【お問い合わせ】${name} 様より`,
      html: `
        <div style="font-family:'Helvetica Neue',Arial,sans-serif;max-width:600px;margin:0 auto;background:#f4f5f7;padding:32px;">
          <div style="background:#fff;border-radius:8px;padding:36px;border-top:4px solid #f97316;">
            <h2 style="color:#1a1a2e;margin:0 0 24px;font-size:20px;">新しいお問い合わせが届きました</h2>
            <table style="width:100%;border-collapse:collapse;font-size:14px;">
              <tr>
                <th style="text-align:left;padding:12px 16px 12px 0;width:90px;color:#888;font-weight:600;border-bottom:1px solid #eee;vertical-align:top;">お名前</th>
                <td style="padding:12px 0;border-bottom:1px solid #eee;color:#333;">${name}</td>
              </tr>
              <tr>
                <th style="text-align:left;padding:12px 16px 12px 0;color:#888;font-weight:600;border-bottom:1px solid #eee;">メール</th>
                <td style="padding:12px 0;border-bottom:1px solid #eee;"><a href="mailto:${email}" style="color:#f97316;">${email}</a></td>
              </tr>
              <tr>
                <th style="text-align:left;padding:12px 16px 12px 0;color:#888;font-weight:600;vertical-align:top;">お問い合わせ内容</th>
                <td style="padding:12px 0;color:#333;white-space:pre-wrap;line-height:1.7;">${message.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</td>
              </tr>
            </table>
            <p style="margin:24px 0 0;font-size:12px;color:#aaa;">このメールはSpinel Labのお問い合わせフォームから自動送信されました。</p>
          </div>
        </div>
      `,
    });

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('Resend error:', err);
    return res.status(500).json({ error: 'メールの送信に失敗しました。時間をおいて再度お試しください。' });
  }
};
